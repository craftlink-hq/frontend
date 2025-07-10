import { ArtisanProfileProps } from '@/utils/profile';
export interface Job {
  // Core properties (originally from utils/types.ts)
  id?: string | number;
  title: string;
  createdAt: string;
  preferredLocation: string;
  language?: string;
  projectDuration: { weeks: number };
  experienceLevel: string;
  price?: number; // Optional in types.ts, required in job.ts—adjust based on needs
  paymentType?: string;
  projectDescription?: string;
  skillCategory?: string[]; // Renamed from 'tags' to match job.ts
  payment?: string;
  type?: string;

  // Additional properties from utils/job.ts
  _id?: string;
  totalJobs?: number;
  rating?: number;
  notes?: string;
  artisans?: string;
  files?: string[]; // Optional to match real-world API flexibility
  images?: string[]; // Optional to match real-world API flexibility
  client?: Client; // Optional to handle cases where client data is unavailable
  status?: string;
  applicants?: Artisan[] | []; // Allow empty array or undefined
  completedBy?: Artisan;
  contextLink?: string;
  additionalProjectInfo?: string;
  clientAddress?: string;
  clientDescription?: string;
}

// Client interface (aligned with utils/job.ts)
export interface Client {
  walletAddress: string;
  verificationStatus: boolean;
  about: string;
  dateJoined: string;
  location: string;
  language: string;
  status: string;
  username: string;
  avatar: string;
  id: string;
  moneySpent: number;
  completed: number;
  posted: number;
  noProjectSpentMoney: number;
  rating: number;
  category?: string; // Optional in job.ts
}

// Artisan interface (aligned with utils/job.ts)
export interface Artisan {
  walletAddress: string;
  verificationStatus: boolean;
  about: string;
  dateJoined: string;
  id: string;
  location: string;
  language: string;
  experienceLevel: string; // Renamed from 'expertise' to match job.ts
  rating: number;
  review?: string;
  category?: string; // Added to align with job.ts
  avatar?: string; // Added to align with job.ts
  username?: string; // Added to align with job.ts
  profile?: ArtisanProfileProps; // Optional to match job.ts
  available?: boolean;
  preferredLanguages?: string[];
  artisanCategory?: string;
  bio?: string;
  skills?: string[];
  yearsOfPractice?: number;
  minimumProjectAmount?: number;
  merkleRoot?: string;
  merkleProof?: string[];
}

// Applied interface (updated to use unified Job)
export interface Applied {
  startDate: string;
  status: string;
  statusMsg: string;
  job: Job; // Use the unified Job type
  endDate?: string;
  rating?: number;
  feedback?: string;
  disputeType?: string;
  issue?: string;
  disputeRaisedDate?: string;
  disputeStatus?: "pending" | "resolved" | "escalated";
  user_type?: "artisan" | "client";
}

// Component prop interfaces (unchanged, now use unified Job)
export interface JobCardProps {
  job: Job;
  index: number;
}

export interface JobHeaderProps {
  job: Job;
}

export interface JobDetailsProps {
  job: Job;
}

export interface JobPricingProps {
  job: Job;
}

export interface JobDescriptionProps {
  job: Job;
  jobId: string | number;
  isExpanded: boolean;
  onToggle: (jobId: string | number) => void;
}

export interface JobTagsProps {
  job: Job;
  jobId: string | number;
  isExpanded: boolean;
  onToggle: (jobId: string | number) => void;
}

export interface JobActionsProps {
  job: Job;
}