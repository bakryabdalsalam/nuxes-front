import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../services/api';
import { JobCard } from './JobCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { AdvancedSearch } from './AdvancedSearch';
import { Job, PaginatedResponse } from '../../types';
import { z } from 'zod';
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Define the search schema (same as in AdvancedSearch)
const searchSchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  experienceLevel: z.string().optional(),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional(),
  employmentType: z.string().optional(),
  remote: z.boolean().optional()
});

type SearchFormData = z.infer<typeof searchSchema>;

export const JobList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFormData>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Job[]>>({
    queryKey: ['jobs', page, filters],
    queryFn: async () => {
      const response = await jobsApi.getJobs(page, filters);
      return {
        success: response.success,
        data: response.data.jobs,
        pagination: response.data.pagination
      };
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const handleSearch = (searchFilters: SearchFormData) => {
    setFilters(searchFilters);
    setPage(1); // Reset to first page when new search is performed
    setShowFilters(false); // Hide filters on mobile after search
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-soft rounded-xl p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Job Listings</h2>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <AdvancedSearch onSearch={handleSearch} initialValues={filters} />
        </div>
      </div>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white shadow-soft rounded-xl h-64 animate-pulse-slow">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : isError || !data ? (
          <div className="text-center bg-red-50 text-red-500 py-10 rounded-xl border border-red-100">
            <p className="font-medium">Failed to load jobs</p>
            <p className="text-sm mt-2">Please try again later or contact support if the problem persists</p>
          </div>
        ) : (
          <>
            {data.data.length === 0 ? (
              <div className="text-center bg-gray-50 py-16 rounded-xl">
                <div className="mx-auto max-w-md">
                  <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                  <p className="mt-2 text-gray-500">
                    We couldn't find any jobs matching your search criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({});
                      setPage(1);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                
                {data.pagination.pages > 1 && (
                  <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-between sm:space-y-0 bg-white p-4 rounded-xl shadow-soft">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(page - 1) * data.pagination.limit + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(page * data.pagination.limit, data.pagination.total)}
                      </span>{" "}
                      of <span className="font-medium">{data.pagination.total}</span> jobs
                    </div>
                    
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                        let pageNum;
                        const totalPages = data.pagination.pages;
                        
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              page === pageNum
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= data.pagination.pages}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
