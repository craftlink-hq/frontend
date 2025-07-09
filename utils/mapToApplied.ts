import { ethers } from 'ethers';
import { Applied, Job, Client, CompletedJob, Artisan } from '@/utils/job';

interface BackendGigData {
  _id: string;
  id: string; // databaseId
  title: string;
  projectDuration: { weeks: number };
  preferredLocation: string;
  experienceLevel: string;
  projectDescription: string;
  price: number;
  skillCategory: string[];
  clientAddress: string;
  createdAt: string;
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
  disputeStatus: 'pending' | 'resolved' | 'escalated';
}

interface GigData {
  backend: BackendGigData;
  contract: ContractGigData;
  dispute?: DisputeData;
}

export const mapToApplied = (
  gigData: GigData,
  userAddress: string,
  userType: 'artisan' | 'client',
  clientAmountSpent?: number
): Applied => {
  const { backend, contract, dispute } = gigData;
  let status = '';
  let statusMsg = '';
  const user_type = userType;
  let endDate: string | undefined;
  let feedback: string | undefined;
  let rating: number | undefined;
  let disputeType: string | undefined;
  let issue: string | undefined;
  let disputeRaisedDate: string | undefined;
  let disputeStatus: 'pending' | 'resolved' | 'escalated' | undefined;

  // Determine status based on user type and gig state
  if (userType === 'artisan') {
    if (
      contract.hiredArtisan === '0x0000000000000000000000000000000000000000' &&
      !contract.isClosed &&
      !contract.isCompleted
    ) {
      status = 'review';
      statusMsg = 'Under Review: Client is yet to pick an artisan';
    } else if (
      contract.hiredArtisan === userAddress &&
      !contract.isCompleted &&
      contract.artisanComplete
    ) {
      status = 'progress';
      statusMsg = 'Awaiting client confirmation';
      endDate = new Date(
        new Date(backend.createdAt).getTime() + backend.projectDuration.weeks * 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0];
    } else if (
      contract.hiredArtisan === userAddress &&
      !contract.isCompleted &&
      !contract.artisanComplete
    ) {
      status = 'progress';
      statusMsg = 'In progress';
      endDate = new Date(
        new Date(backend.createdAt).getTime() + backend.projectDuration.weeks * 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0];
    } else if (contract.hiredArtisan === userAddress && contract.isCompleted) {
      status = 'completed';
      statusMsg = 'Completed';
      endDate = new Date().toISOString().split('T')[0]; // Approximation
      feedback = 'Work completed successfully'; // Replace with backend data
      rating = 4.5; // Replace with backend data
    } else if (contract.isClosed) {
      status = 'closed';
      statusMsg = 'Closed: Client closed the gig';
    }
  } else {
    // Client
    if (
      contract.hiredArtisan === '0x0000000000000000000000000000000000000000' &&
      !contract.isClosed &&
      !contract.isCompleted
    ) {
      status = 'posted';
      statusMsg = 'Posted: Awaiting artisan applications';
    } else if (
      contract.hiredArtisan !== '0x0000000000000000000000000000000000000000' &&
      !contract.isCompleted
    ) {
      status = 'progress';
      statusMsg = 'In Progress: Artisan hired';
      endDate = new Date(
        new Date(backend.createdAt).getTime() + backend.projectDuration.weeks * 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0];
    } else if (contract.isCompleted) {
      status = 'completed';
      statusMsg = 'Completed';
      endDate = new Date().toISOString().split('T')[0];
      feedback = 'Project completed successfully';
      rating = 4.5;
    } else if (contract.isClosed) {
      status = 'closed';
      statusMsg = 'Closed';
    }
  }

  // Handle disputes
  if (dispute) {
    status = 'dispute';
    statusMsg = dispute.disputeStatus === 'pending' ? 'Pending: Awaiting Action' : `Resolved: ${dispute.disputeType}`;
    disputeType = dispute.disputeType;
    issue = dispute.issue;
    disputeRaisedDate = dispute.disputeRaisedDate;
    disputeStatus = dispute.disputeStatus;
  }

  const client: Client = {
    walletAddress: contract.client,
    verificationStatus: false, // Fetch from backend or registry
    about: '', // Fetch from /api/artisans/:walletAddress
    dateJoined: '',
    location: '',
    language: '',
    status: '',
    username: '',
    avatar: '',
    id: contract.client,
    moneySpent: clientAmountSpent || 0,
    completed: 0, // Fetch from contract or backend
    posted: 0,
    noProjectSpentMoney: 0,
    rating: 0,
  };

  const job: Job = {
    id: backend.id,
    _id: backend._id,
    createdAt: backend.createdAt,
    projectDuration: backend.projectDuration,
    title: backend.title,
    preferredLocation: backend.preferredLocation,
    experienceLevel: backend.experienceLevel,
    price: parseFloat(ethers.formatUnits(backend.price, 6)), // Assuming USDC with 6 decimals
    projectDescription: backend.projectDescription,
    skillCategory: backend.skillCategory,
    contextLink: backend.contextLink,
    additionalProjectInfo: backend.additionalProjectInfo,
    files: backend.files?.map((file) => file.url) || [],
    images: backend.files?.filter((file) => file.url.match(/\.(jpg|jpeg|png|gif)$/i))?.map((file) => file.url) || [],
    client,
    applicants: [], // Fetch via getGigApplicants if needed
    status: backend.status,
    completedBy: contract.hiredArtisan !== '0x0000000000000000000000000000000000000000' ? { walletAddress: contract.hiredArtisan } as Artisan : undefined,
  };

  return {
    startDate: backend.createdAt.split('T')[0],
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