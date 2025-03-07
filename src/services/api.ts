/// <reference types="vite/client" />

import axios from 'axios';
import { Job, PaginatedResponse, Application, ApplicationStatus, User } from '../types';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/auth.store';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse<User> {
  success: boolean;
  user?: User;  // Add user property to match backend response
  data?: {
    user?: User;
    token?: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Keep track of refresh promise to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshEndpoint = originalRequest.url === 'auth/refresh';

    // Handle rate limit errors immediately
    if (error.response?.status === 429) {
      toast.error('Too many attempts. Please try again later.');
      if (isRefreshEndpoint) {
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }

    // Only attempt refresh if:
    // 1. It's a 401 error
    // 2. We haven't tried to refresh yet
    // 3. We're not on a refresh request itself
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isRefreshEndpoint
    ) {
      if (isRefreshing) {
        // Wait for the other refresh request to complete
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting token refresh after 401 error');
        // Try to refresh the token
        const response = await api.post('/auth/refresh');
        
        // Extract token from response - handle different response formats
        let token: string | undefined;
        
        if (response.data.success) {
          console.log('Token refresh response:', response.data);
          // Try multiple paths to get the token
          token = response.data.data?.token || 
                 response.data.token ||
                 (response.data.data?.user?.token);
                 
          if (token) {
            console.log('New token obtained, storing and retrying original request');
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            processQueue(null, token);
            return api(originalRequest);
          } else {
            console.warn('No token found in refresh response:', response.data);
          }
        }
        
        throw new Error('Token refresh failed - no valid token in response');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export const jobsApi = {
  getJobs: async (page = 1, filters: {
    search?: string;
    location?: string;
    category?: string;
    experienceLevel?: string;
    salary?: { min?: number; max?: number };
    employmentType?: string;
    remote?: boolean;
  } = {}) => {
    try {
      console.log('Fetching jobs with filters:', { page, filters });
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.category && { category: filters.category }),
        ...(filters.experienceLevel && { experienceLevel: filters.experienceLevel }),
        ...(filters.salary?.min && { salary_min: filters.salary.min.toString() }),
        ...(filters.salary?.max && { salary_max: filters.salary.max.toString() }),
        ...(filters.employmentType && { employmentType: filters.employmentType }),
        ...(filters.remote !== undefined && { remote: filters.remote.toString() })
      });

      const response = await api.get(`jobs?${queryParams}`);
      
      // Transform the response to match expected structure
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch jobs');
      }

      console.log('Jobs fetched successfully:', response.data);

      return {
        success: true,
        data: {
          jobs: response.data.data.jobs || [],
          pagination: response.data.data.pagination || {
            total: 0,
            page: 1,
            totalPages: 1,
            hasMore: false
          }
        }
      };
    } catch (error: any) {
      console.error('Error in getJobs:', error.response || error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch jobs');
    }
  },

  getJob: async (id: string) => {
    const response = await api.get(`jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData: Partial<Job>) => {
    const response = await api.post('jobs', jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>) => {
    const response = await api.put(`jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`jobs/${id}`);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get<ApiResponse<Job[]>>('jobs/recommendations');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('admin/stats');
    return response.data;
  }
};

// Update the auth API methods with improved token handling
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('auth/login', credentials);
      
      // If request was successful
      if (response.data.success) {
        console.log('Login response:', JSON.stringify(response.data));
        
        // Extract token from any possible path in the response
        let token: string | undefined;
        
        // Try to find token in different places
        if (response.data.data?.token) {
          token = response.data.data.token;
        } else if (response.data.token) {
          token = response.data.token;
        }
        
        if (token) {
          console.log('Token found, storing in localStorage');
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('No token found in login response:', response.data);
        }
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Authentication failed');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('An error occurred during login');
      }
    }
  },
  register: async (userData: { email: string; password: string; name: string; role?: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post('auth/register', userData);
      if (response.data.success && response.data.data && response.data.data.token) {
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('An error occurred during registration');
      }
    }
  },
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post('auth/logout');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },
  me: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },
  refresh: async (): Promise<AuthResponse> => {
    try {
      const response = await api.post('auth/refresh');
      
      // Extract token from any possible path in the response
      let token: string | undefined;
      
      if (response.data.success) {
        if (response.data.data?.token) {
          token = response.data.data.token;
        } else if (response.data.token) {
          token = response.data.token;
        }
        
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to refresh token');
    }
  }
};

export const analyticsApi = {
  getStats: async () => {
    const response = await api.get('admin/stats');
    return response.data;
  },
  
  getAnalytics: async () => {
    const response = await api.get('admin/analytics');
    return response.data;
  }
};

export const applicationApi = {
  createApplication: async (jobId: string, data: { coverLetter: string; resume: string }) => {
    const response = await api.post('applications', { jobId, ...data });
    return response.data;
  },

  getAllApplications: async () => {
    const response = await api.get('admin/applications');
    return response.data;
  },
  
  updateApplicationStatus: async (id: string, status: ApplicationStatus): Promise<ApiResponse<Application>> => {
    try {
      console.log('Updating application status:', { id, status });
      
      if (!id || !status) {
        throw new Error('Invalid application ID or status');
      }

      const response = await api.patch(`admin/applications/${id}/status`, { status });
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to update application status');
      }

      console.log('Update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update application status error:', {
        error,
        response: error.response,
        message: error.response?.data?.message,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please ensure you are logged in as an admin.');
      }
      
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update application status.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Failed to update application status. Please try again.');
    }
  },
  
  getUserApplications: async () => {
    try {
      console.log('Fetching user applications with token:', localStorage.getItem('token'));
      const response = await api.get('user/applications');
      console.log('Applications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  }
};

export const userApi = {
  getProfile: async () => {
    try {
      console.log('Fetching user profile with token:', localStorage.getItem('token'));
      const response = await api.get('user/profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  updateProfile: async (data: any) => {
    try {
      const response = await api.put('user/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export const adminApi = {
  getUsers: async () => {
    const response = await api.get('admin/users');
    return response.data;
  },
  updateUser: async (userId: string, userData: Partial<User>) => {
    const response = await api.put(`admin/users/${userId}`, userData);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('admin/stats');
    return response.data;
  },
  
  updateUserRole: async ({ userId, role }: { userId: string; role: 'USER' | 'ADMIN' | 'COMPANY' }) => {
    const response = await api.patch(`admin/users/${userId}/role`, { role });
    return response.data;
  },
  
  generateReport: async (type: string, config?: any) => {
    const response = await api.post(`admin/reports/${type}`, config, {
      responseType: 'blob'
    });
    return response.data;
  },

  getEmailTemplates: async () => {
    const response = await api.get('admin/email-templates');
    return response.data;
  },

  createEmailTemplate: async (template: any) => {
    const response = await api.post('admin/email-templates', template);
    return response.data;
  },

  getAnalytics: async (params?: any) => {
    const response = await api.get('admin/analytics', { params });
    return response.data;
  },

  getJobs: async () => {
    const response = await api.get('admin/jobs');
    return response.data;
  },

  createJob: async (jobData: Partial<Job>) => {
    const response = await api.post('admin/jobs', jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>) => {
    const response = await api.put(`admin/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`admin/jobs/${id}`);
    return response.data;
  }
};

export const companyApi = {
  getProfile: async () => {
    const response = await api.get('company/profile');
    return response.data;
  },
  
  updateProfile: async (data: {
    companyName: string;
    description: string;
    industry: string;
    size: string;
    website?: string;
    location: string;
    logo?: string;
  }) => {
    const response = await api.put('company/profile', data);
    return response.data;
  },
  
  getJobs: async (params?: {
    page?: number;
    limit?: number;
    status?: 'OPEN' | 'CLOSED' | 'DRAFT';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const response = await api.get(`company/jobs?${queryParams}`);
    return response.data;
  },

  createJob: async (jobData: {
    title: string;
    description: string;
    location: string;
    salary?: number;
    employmentType: string;
    experienceLevel: string;
    remote?: boolean;
    requirements?: string[];
    benefits?: string[];
    category: string;
  }) => {
    const response = await api.post('company/jobs', jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>) => {
    const response = await api.put(`company/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`company/jobs/${id}`);
    return response.data;
  },

  getApplications: async (jobId: string) => {
    const response = await api.get(`company/jobs/${jobId}/applications`);
    return response.data;
  },

  updateApplicationStatus: async (jobId: string, applicationId: string, status: string) => {
    const response = await api.patch(`company/jobs/${jobId}/applications/${applicationId}`, { status });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('company/stats');
    return response.data;
  }
};

export default api;
