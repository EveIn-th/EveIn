export type Role = 'Brand' | 'Influencer' | 'Admin' | 'WebsiteManager';

export interface User {
  id: string;
  username: string;
  realName?: string;
  role: Role;
  gender: string;
  age: number;
  email: string;
  phone: string;
  password?: string;
  transactionPassword?: string; // รหัสผ่านธุรกรรม
  isFrozen?: boolean; // อายัดบัญชี
  isBanned?: boolean; // แบนตลอดชีพ
  bio?: string;
  avatar?: string;
  lineId?: string;
  // Brand specific
  brandName?: string;
  productCategories?: string[]; // E.g., Skincare, Cosmetics
  // Influencer specific
  workCategories?: string[]; // E.g., Sports, Beauty
  bankName?: string;
  bankAccount?: string;
  socials?: {
    platform: 'Tiktok' | 'Facebook' | 'Instagram' | 'YouTube';
    handle: string;
    followers: number;
    url?: string;
  }[];
}

export interface EventItem {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bannerUrl: string;
  budget?: string;
  createdBy: string; // User ID
  createdByName: string;
  createdAt: string;
}

export interface JobItem {
  id: string;
  title: string;
  brandName: string;
  description: string;
  province: string; // 77 provinces
  platforms: ('Tiktok' | 'Facebook' | 'Instagram' | 'YouTube')[];
  category: string; // Beauty, Skincare, Sports...
  ageRange: string; // E.g., "18-25", "26-35", "All"
  genderRequired: 'All' | 'Male' | 'Female' | 'LGBTQ';
  budget: number;
  isOpen: boolean; // active/paused for Brand Controls
  followerRange?: string; // E.g., "All", "Under 10k", "10k-50k", "50k-100k", "100k+"
  createdBy: string; // User ID
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  brandId: string;
  brandName: string;
  influencerId: string;
  influencerName: string;
  influencerPlatformDetails?: string; 
  status: 'Applied' | 'In Progress' | 'Completed' | 'Cancelled';
  submittedLinks?: { platform: string; url: string }[];
  isApproved?: boolean; // Brand approved links
  paymentStatus: 'Unpaid' | 'Verifying' | 'Paid';
  paymentSlipUrl?: string;
  paymentSlipUploadedAt?: string;
  taxInvoiceRequested?: boolean; // "ต้องการรับใบกำกับภาษี"
  appliedAt: string;
}

export interface LiveMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // can be "admin" or another user ID
  content: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'warning' | 'alert';
}
