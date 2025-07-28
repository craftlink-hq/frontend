import { ethers } from "ethers";
import { CompletedJob } from "@/utils/job";
import { Job, Client, Artisan, Applied } from "@/utils/types";

interface BackendGigData {
  _id: string;
  id: string;
  title: string;
  projectDuration?: { weeks: number };
  preferredLocation: string;
  experienceLevel: string;
  projectDescription: string;
  price: number | null | undefined;
  skillCategory: string[];
  clientAddress: string;
  createdAt?: string;
  status: string;
  contextLink?: string;
  additionalProjectInfo?: string;
  files?: { url: string }[];
}

interface ContractGigData {
  client: string;
  hiredArtisan: string;
  paymentId: number;
  rootHash: string;
  artisanComplete: boolean;
  isCompleted: boolean;
  isClosed: boolean;
}

interface DisputeData {
  disputeType: string;
  issue: string;
  disputeRaisedDate: string;
  disputeStatus: "pending" | "resolved" | "escalated";
}

interface GigData {
  backend: BackendGigData;
  contract: ContractGigData;
  dispute?: DisputeData;
  applicants?: Artisan[];
  hireTimestamp?: string;
}

export const mapToApplied = (
  gigData: GigData,
  userAddress: string,
  userType: "artisan" | "client",
  clientAmountSpent?: number
): Applied => {
  const { backend, contract, dispute, applicants, hireTimestamp } = gigData;
  let status = "";
  let statusMsg = "";
  const user_type = userType;
  let endDate: string | undefined;
  let feedback: string | undefined;
  let rating: number | undefined;
  let disputeType: string | undefined;
  let issue: string | undefined;
  let disputeRaisedDate: string | undefined;
  let disputeStatus: "pending" | "resolved" | "escalated" | undefined;

  // Use hireTimestamp for startDate, fallback to current date
  const startDate = hireTimestamp || new Date().toISOString();

  // Use backend.createdAt for job.createdAt, fallback to current date
  const createdAt = backend.createdAt || new Date().toISOString();
  if (!backend.createdAt) {
    console.warn(
      `createdAt is undefined for gig ${
        backend.id || "unknown"
      }, using current date as fallback`
    );
  }  

  // Safely calculate endDate using startDate (hire date)
  const projectDurationWeeks = backend.projectDuration?.weeks || 404;
  if (projectDurationWeeks != null) {
    endDate = new Date(
      new Date(startDate).getTime() +
        projectDurationWeeks * 7 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
  } else {
    console.warn(
      `projectDuration is undefined or missing weeks for gig ${
        backend.id || "unknown"
      }`
    );
    endDate = undefined;
  }

  // Handle price safely
  let formattedPrice = 0;
  if (backend.price != null) {
    try {
      formattedPrice = parseFloat(ethers.formatUnits(backend.price, 6));
    } catch (err) {
      console.error(
        `Error formatting price for gig ${backend.id || "unknown"}:`,
        err
      );
      formattedPrice = 0;
    }
  } else {
    console.warn(
      `Price is null or undefined for gig ${backend.id || "unknown"}`
    );
  }

  if (userType === "artisan") {
    if (
      contract.hiredArtisan === "0x0000000000000000000000000000000000000000" &&
      !contract.isClosed &&
      !contract.isCompleted
    ) {
      status = "review";
      statusMsg = "Client is yet to pick an artisan";
    } else if (
      contract.hiredArtisan === userAddress &&
      !contract.isCompleted &&
      contract.artisanComplete
    ) {
      status = "progress";
      statusMsg = "Awaiting client confirmation";
    } else if (
      contract.hiredArtisan === userAddress &&
      !contract.isCompleted &&
      !contract.artisanComplete
    ) {
      status = "progress";
      statusMsg = "In progress";
    } else if (contract.hiredArtisan === userAddress && contract.isCompleted) {
      status = "completed";
      statusMsg = "Completed";
      endDate = new Date().toISOString().split("T")[0];
      feedback = "Work completed successfully";
      rating = 4.5;
    } else if (contract.isClosed) {
      status = "closed";
      statusMsg = "Closed: Client closed the gig";
    }
  } else {
    if (
      contract.hiredArtisan === "0x0000000000000000000000000000000000000000" &&
      !contract.isClosed &&
      !contract.isCompleted
    ) {
      status = "posted";
      statusMsg = "Posted: Awaiting artisan applications";
    } else if (
      contract.hiredArtisan !== "0x0000000000000000000000000000000000000000" &&
      !contract.isCompleted
    ) {
      status = "progress";
      statusMsg = "In Progress: Artisan hired";
    } else if (contract.isCompleted) {
      status = "completed";
      statusMsg = "Completed";
      endDate = new Date().toISOString().split("T")[0];
      feedback = "Project completed successfully";
      rating = 4.5;
    } else if (contract.isClosed) {
      status = "closed";
      statusMsg = "Closed";
    }
  }

  if (dispute) {
    status = "dispute";
    statusMsg =
      dispute.disputeStatus === "pending"
        ? "Pending: Awaiting Action"
        : `Resolved: ${dispute.disputeType}`;
    disputeType = dispute.disputeType;
    issue = dispute.issue;
    disputeRaisedDate = dispute.disputeRaisedDate;
    disputeStatus = dispute.disputeStatus;
  }

  const client: Client = {
    walletAddress: contract.client,
    verificationStatus: false,
    about: "",
    dateJoined: "",
    location: "",
    language: "",
    status: "",
    username: "",
    avatar: "",
    id: contract.client,
    moneySpent: clientAmountSpent || 0,
    completed: 0,
    posted: 0,
    noProjectSpentMoney: 0,
    rating: 0,
  };

  const job: Job = {
    id: backend.id,
    _id: backend._id,
    createdAt: createdAt, // Use backend.createdAt for job posting date
    projectDuration: backend.projectDuration || { weeks: 404 },
    title: backend.title,
    preferredLocation: backend.preferredLocation,
    experienceLevel: backend.experienceLevel,
    price: formattedPrice,
    projectDescription: backend.projectDescription,
    skillCategory: backend.skillCategory,
    contextLink: backend.contextLink,
    additionalProjectInfo: backend.additionalProjectInfo,
    files: backend.files?.map((file) => file.url) || [],
    images:
      backend.files
        ?.filter((file) => file.url.match(/\.(jpg|jpeg|png|gif)$/i))
        ?.map((file) => file.url) || [],
    client,
    applicants: applicants || [],
    status: backend.status,
    completedBy:
      contract.hiredArtisan !== "0x0000000000000000000000000000000000000000"
        ? ({ walletAddress: contract.hiredArtisan } as Artisan)
        : undefined,
  };

  return {
    startDate: startDate.split("T")[0],
    status,
    statusMsg,
    job: job as CompletedJob,
    endDate,
    feedback,
    rating,
    disputeType,
    issue,
    disputeRaisedDate,
    disputeStatus,
    user_type,
  };
};
