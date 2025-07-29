import { Job, Client, Artisan, Applied } from './types';
import { dummyProfile } from '@/utils/profile';

export interface CompletedJob extends Job {
  completedBy: Artisan;
}

export const Abdul: Client = {
  walletAddress: "0x1276eefgegvsbj73yop3hne",
  verificationStatus: true,
  about: "We’re a boutique clothing line based in Lagos...",
  dateJoined: "January 2024",
  id: "3",
  location: "Nigeria",
  language: "English/Igbo",
  status: "First Time Client",
  username: "Abdul",
  avatar: "/client-avatar.png",
  moneySpent: 3000,
  completed: 2,
  posted: 3,
  noProjectSpentMoney: 5,
  rating: 4.3,
};

export const Tolu: Artisan = {
  walletAddress: "0x1276eefgegvsbj73yop3hne",
  verificationStatus: true,
  about: "We’re a boutique clothing line based in Lagos...",
  dateJoined: "January 2024",
  id: "3",
  location: "Abuja, Nigeria",
  language: "English",
  experienceLevel: "Intermediate",
  rating: 3.5,
  review: "Described as clear, collaborative, and timely",
  avatar: "/client-avatar.png",
  category: "Fashion",
  username: "abdul",
  profile: dummyProfile,
};

export const DummyArtisans: Artisan[] = [
  {
    walletAddress: "0x1276eefgegvsbj73yop3hne",
    verificationStatus: true,
    about: "We’re a boutique clothing line based in Lagos...",
    dateJoined: "January 2024",
    id: "3",
    location: "Abuja, Nigeria",
    language: "English",
    experienceLevel: "Intermediate",
    rating: 3.5,
    review: "Described as clear, collaborative, and timely",
    avatar: "/client-avatar.png",
    category: "Fashion",
    username: "abdul",
    profile: dummyProfile,
  },
  {
    walletAddress: "0x1286eefgegvsbj73yop3hne",
    verificationStatus: true,
    about: "We’re a boutique clothing line based in Lagos...",
    dateJoined: "January 2024",
    id: "4",
    location: "Lagos, Nigeria",
    language: "English",
    experienceLevel: "Intermediate",
    rating: 3.5,
    avatar: "/client-avatar.png",
    category: "Fashion",
    username: "abdul",
    profile: dummyProfile,
  },
];

export const fashionDesigner: Job = {
  id: "1",
  createdAt: "Yesterday",
  projectDuration: { weeks: 2 },
  title: "Seeking a Fashion Designer for a New Clothing Line",
  preferredLocation: "Lagos, Nigeria",
  language: "English",
  totalJobs: 3,
  experienceLevel: "Intermediate",
  price: 1500,
  rating: 3.5,
  contextLink: "https://pinterest.com/fashion-inspiration",
  projectDescription: "We’re seeking a highly skilled and experienced tailor...",
  type: "open Application",
  payment: "Secured Payment",
  paymentType: "Fixed",
  skillCategory: [
    "Pattern-making",
    "garment construction",
    "fabric selection",
    "eco-conscious fashion",
    "Digital illustration",
  ],
  notes: "Artisans selected for this project will receive a bonus...",
  artisans: "three",
  files: ["/file.png", "/file1.png"],
  images: ["/dress.png", "/dress1.png"],
  client: Abdul,
  applicants: DummyArtisans,
  completedBy: Tolu,
  clientAddress: "0x1276eefgegvsbj73yop3hne",
  clientDescription: "We’re a boutique clothing line based in Lagos...",
};

const Pope: Client = {
  walletAddress: "0x1276eefgegvsbj73yop3hne",
  verificationStatus: false,
  about:
    "We’re a boutique clothing line based in Lagos, passionate about contemporary designs and collaborations with creative artisans",
  dateJoined: "January 2024",
  id: "4",
  username: "Pope",
  location: "Nigeria",
  language: "English/Yoruba",
  status: "First Time Client",
  avatar: "/client-avatar.png",
  moneySpent: 3000,
  completed: 2,
  posted: 3,
  noProjectSpentMoney: 5,
  rating: 4.3,
};
export const fashion = {
  createdAt: "2 days",
  projectDuration: { weeks: 2 },
  title: "Seeking a Tailor",
  preferredLocation: "Lagos, Nigeria",
  language: "English",
  totalJobs: 3,
  experienceLevel: "Intermediate",
  price: 1500,
  rating: 3.5,
  projectDescription:
    "We’re seeking a highly skilled and experienced tailor to bring our upcoming fashion collection to life. The project involves creating 15 bespoke pieces, including evening gowns, tailored suits, and casual wear, designed to align the",
  type: "open Application",
  payment: "Secured Payment",
  paymentType: "Fixed",
  skillCategory: [
    "Pattern-making",
    "garment construction",
    "fabric selection",
    "eco-conscious fashion",
    "Digital illustration",
  ],
  notes:
    "Artisans selected for this project will receive a bonus for exceptional work and have the opportunity to collaborate on future collections.",
  artisans: "three",
  files: ["/file.png", "/file1.png"],
  images: ["/dress.png", "/dress1.png"],
  client: Pope,
  completedBy: Tolu,
  applicants: DummyArtisans,
  clientAddress: "0x1276eefgegvsbj73yop3hne",
  clientDescription:
    "We’re a boutique clothing line based in Lagos, passionate about contemporary designs and collaborations with creative artisans",
};

export const Applications: Applied[] = [
  {
    startDate: "13/01/25",
    status: "Review",
    statusMsg: "Client is yet to pick an artisan",
    job: fashionDesigner,
  },
  {
    startDate: "13/01/25",
    status: "Review",
    statusMsg: "Client is yet to pick an artisan",
    job: fashion,
  },
];

export const Actives: Applied[] = [
  {
    startDate: "13/01/25",
    status: "progress",
    statusMsg: "In progress",
    job: fashionDesigner,
    endDate: "24/01/25",
    feedback:
      "The artisan did an excellent job with the designs. Highly recommend!",
    rating: 4.5,
    user_type: "artisan"
  },
  {
    startDate: "16/01/25",
    status: "progress",
    statusMsg: "In progress",
    job: fashion,
    endDate: "28/01/25",
    feedback:
      "The artisan did an excellent job with the designs. Highly recommend!",
    rating: 4.8,
    user_type: "artisan"
  },
];

export const Closed: Applied[] = [
  {
    startDate: "13/01/25",
    status: "approved",
    statusMsg: "Approved: Client has picked an artisan",
    job: fashionDesigner,
    endDate: "24/01/25",
    feedback:
      "The artisan did an excellent job with the designs. Highly recommend!",
    rating: 4.5,
  },
  {
    startDate: "16/01/25",
    status: "ended",
    statusMsg: "Ended: Client closed job without getting an artisan",
    job: fashion,
    endDate: "28/01/25",
    feedback:
      "The artisan did an excellent job with the designs. Highly recommend!",
    rating: 4.8,
  },
];

export const Disputed: Applied[] = [
  {
    startDate: "13/01/25",
    status: "dispute",
    statusMsg: "Pending: Awaiting Client Action",
    job: fashionDesigner,
    endDate: "24/01/25",
    disputeType: "Payment not released",
    disputeRaisedDate: "13/12/24",
    disputeStatus: "pending",
    issue: "The client has not confirmed that the artisan has completed the job on their end, preventing the release of funds.",
  },
  {
    startDate: "16/01/25", 
    status: "dispute",
    statusMsg: "Resolved: Payment Released to Artisan",
    job: fashion,
    endDate: "28/01/25",
    disputeType: "Work Quality",
    disputeRaisedDate: "10/12/24",
    disputeStatus: "resolved",
    issue: "Client questioned the quality of work delivered by artisan.",
  }
];

export const dispute: Applied[] = [{
  startDate: "13/01/25",
  status: "dispute",
  statusMsg: "Awaiting Client Action",
  job: fashionDesigner,
  disputeType: "Payment not released",
  issue:
    "The client has not confirmed that the artisan has completed the job on their end, preventing the release of funds.",
}];

export const Completed: Applied[] = [
  {
    startDate: "13/01/25",
    status: "progress",
    statusMsg: "In progress",
    job: fashionDesigner,
    endDate: "24/01/25",
    feedback:
      "The artisan did an excellent job with the designs. Highly recommend!",
    rating: 4.5,
    user_type: "client"
  },
  {
    startDate: "16/01/25",
    status: "progress",
    statusMsg: "In progress",
    job: fashion,
    endDate: "28/01/25",
    feedback:
      "The artisan did an excellent job with the designs. Highly recommend!",
    rating: 4.8,
    user_type: "client"
  },
];

export const jobs: Job[] = [fashionDesigner, fashion];


export const percentage = 10