export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'COMPANY';
  isActive: boolean;
  profile?: {
    fullName: string;
    bio?: string;
    avatar?: string;
  };
  _count?: {
    applications: number;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: {
    name?: string;
    companyName?: string;
  } | string;
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  postedDate: string;
  deadline?: string;
  category?: string;
  experienceLevel?: string;
  employmentType?: string;
  remote?: boolean;
  skills?: string[];
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  coverLetter: string;
  resume: string;
  submittedAt: string;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  job?: Job;
}

export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'REJECTED' | 'SHORTLISTED' | 'ACCEPTED';

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  experienceLevel?: string;
  employmentType?: string;
  remote?: boolean;
  salary?: {
    min?: number;
    max?: number;
  };
  keyword?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user?: User;
    token?: string;
  };
  message?: string;
  // Additional auth-specific properties if needed
}
