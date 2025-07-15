import { ArtisanProfileProps } from '@/utils/profile';
export interface Job {
  id?: string | number;
  title: string;
  createdAt: string; // ISO date string or relative time (e.g., "2 days ago")
  preferredLocation: string;
  language?: string;
  projectDuration: { weeks: number };
  experienceLevel: string;
  price?: number;
  paymentType?: string;
  projectDescription?: string;
  skillCategory?: string[]; // Unified with job.ts
  payment?: string;
  type?: string;
  _id?: string;
  totalJobs?: number;
  rating?: number;
  notes?: string;
  artisans?: string;
  files?: string[];
  images?: string[];
  client?: Client;
  status?: string;
  applicants?: Artisan[] | [];
  completedBy?: Artisan;
  contextLink?: string;
  additionalProjectInfo?: string;
  clientAddress?: string;
  clientDescription?: string;
}

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
  category?: string;
}

export interface Artisan {
  walletAddress: string;
  verificationStatus: boolean;
  about: string;
  dateJoined: string;
  id: string;
  location: string;
  language: string;
  experienceLevel: string;
  rating: number;
  review?: string;
  category?: string;
  avatar?: string;
  username?: string;
  profile?: ArtisanProfileProps;
  availableForProjects?: boolean;
  preferredLanguages?: string[];
  artisanCategory?: string;
  bio?: string;
  skills?: string[];
  yearsOfPractice?: number;
  minimumProjectAmount?: number;
  merkleRoot?: string;
  merkleProof?: string[];
}

export interface Applied {
  startDate: string;
  status: string;
  statusMsg: string;
  job: Job; // Use unified Job type
  endDate?: string;
  rating?: number;
  feedback?: string;
  disputeType?: string;
  issue?: string;
  disputeRaisedDate?: string;
  disputeStatus?: "pending" | "resolved" | "escalated";
  user_type?: "artisan" | "client";
  hiredArtisan?: string
}

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