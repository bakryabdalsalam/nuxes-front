import React, { createContext, useContext, useState } from 'react';
import { Job } from '../types';

// Define JobFilters directly here or import from types
interface JobFilters {
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

interface JobContextType {
  jobs: Job[];
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  loading: boolean;
  setJobs: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});
  const [loading, setLoading] = useState(false);

  return (
    <JobContext.Provider value={{ jobs, filters, setFilters, loading, setJobs, setLoading }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
