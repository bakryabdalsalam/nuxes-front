import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../services/api';
import { ApplicationForm } from '../components/jobs/ApplicationForm';
import { useAuthStore } from '../store/auth.store';
import { 
  MapPinIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJob(id!),
    enabled: !!id
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <Link 
        to="/jobs" 
        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to all jobs
      </Link>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 rounded-xl p-8 border border-red-100">
          <h3 className="text-lg font-medium text-red-800">Failed to load job details</h3>
          <p className="mt-2 text-sm text-red-600">Please try again later or contact support</p>
        </div>
      ) : !job?.data ? (
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-lg font-medium text-gray-900">Job not found</h3>
          <p className="mt-2 text-sm text-gray-500">This job may have been removed or is no longer available</p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Browse other jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-soft rounded-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold text-gray-900">{job.data.title}</h1>
                      {job.data.isNew && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4 mb-2">
                        <BuildingOfficeIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                        {job.data.company || 'Company Name'}
                      </div>
                      <div className="flex items-center mr-4 mb-2">
                        <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                        {job.data.location || 'Location'}
                      </div>
                      <div className="flex items-center mr-4 mb-2">
                        <ClockIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                        Posted {new Date(job.data.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {job.data.logo ? (
                    <img 
                      src={job.data.logo} 
                      alt={`${job.data.company} logo`}
                      className="hidden md:block h-16 w-16 object-contain mt-4 md:mt-0" 
                    />
                  ) : (
                    <div className="hidden md:flex h-16 w-16 rounded-md bg-primary-100 text-primary-600 items-center justify-center font-bold text-xl mt-4 md:mt-0">
                      {(job.data.company || 'C').charAt(0)}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 flex items-center">
                    <BriefcaseIcon className="mr-1.5 h-4 w-4 text-blue-500" />
                    {job.data.experienceLevel || 'Experience Level'}
                  </div>
                  
                  <div className="rounded-md bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 flex items-center">
                    <TagIcon className="mr-1.5 h-4 w-4 text-purple-500" />
                    {job.data.category || 'Category'}
                  </div>
                  
                  {job.data.salary && (
                    <div className="rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 flex items-center">
                      <CurrencyDollarIcon className="mr-1.5 h-4 w-4 text-green-500" />
                      ${job.data.salary.toLocaleString()} per year
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-soft rounded-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="whitespace-pre-wrap">{job.data.description}</p>
                </div>
              </div>
            </div>

            {job.data.requirements && (
              <div className="bg-white shadow-soft rounded-xl overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                  <div className="prose max-w-none text-gray-600">
                    <p className="whitespace-pre-wrap">{job.data.requirements}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {isAuthenticated && user ? (
                <div className="bg-white shadow-soft rounded-xl overflow-hidden">
                  <ApplicationForm jobId={job.data.id} />
                </div>
              ) : (
                <div className="bg-white shadow-soft rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Want to Apply?</h2>
                    <p className="text-gray-600 mb-6">Please log in to submit your application for this position.</p>
                    <button
                      onClick={() => navigate('/login', { state: { from: `/jobs/${job.data.id}` } })}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                    >
                      Log in to Apply
                    </button>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Don't have an account?{' '}
                      <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {job.data.company && (
                <div className="mt-6 bg-white shadow-soft rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h2>
                    <div className="flex items-center mb-4">
                      {job.data.logo ? (
                        <img 
                          src={job.data.logo} 
                          alt={`${job.data.company} logo`}
                          className="h-12 w-12 object-contain mr-4 bg-white border border-gray-100 rounded-md p-1" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl mr-4">
                          {job.data.company.charAt(0)}
                        </div>
                      )}
                      <h3 className="font-medium text-gray-900">{job.data.company}</h3>
                    </div>
                    {job.data.companyDescription && (
                      <p className="text-sm text-gray-600">{job.data.companyDescription}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
