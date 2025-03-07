import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  ClipboardDocumentCheckIcon, 
  UserCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { applicationApi, jobsApi } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';


export const Dashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);
  
  // Get user applications count
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications-count'],
    queryFn: () => applicationApi.getUserApplications(),
    enabled: !!user,
  });
  
  // Get recommended jobs
  const { data: recommendedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['recommended-jobs'],
    queryFn: () => jobsApi.getJobs(1, { category: 'recommended' }),
    enabled: !!user,
  });
  
  const appliedCount = applications?.data?.length || 0;
  const hasRecommendedJobs = recommendedJobs?.data?.jobs && 
                            Array.isArray(recommendedJobs.data.jobs) && 
                            recommendedJobs.data.jobs.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 md:p-8 mb-8 shadow-soft">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, <span className="text-primary-600">{user?.name || 'User'}</span>!
        </h1>
        <p className="mt-2 text-gray-600 max-w-xl">
          Your career dashboard gives you an overview of your job search progress and recommended opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Applications Submitted</p>
            <div className="flex items-center">
              {applicationsLoading ? (
                <LoadingSpinner size="small" className="h-8" />
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">{appliedCount}</h3>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
            <ChartBarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Profile Completion</p>
            <h3 className="text-2xl font-bold text-gray-900">75%</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
            <DocumentTextIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Resume Views</p>
            <h3 className="text-2xl font-bold text-gray-900">21</h3>
          </div>
        </div>
      </div>
      
      {/* Quick Links Section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          to="/applications"
          className="group bg-white rounded-xl shadow-soft hover:shadow-hover p-6 transition-all duration-200 border border-gray-100 flex flex-col h-full"
        >
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors duration-200 flex items-center justify-center mb-4">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors duration-200">My Applications</h3>
          <p className="text-gray-600 text-sm flex-grow">Track the status of your job applications and follow-ups</p>
          <div className="mt-4 text-primary-600 text-sm font-medium group-hover:text-primary-700">
            View Applications →
          </div>
        </Link>

        <Link
          to="/jobs"
          className="group bg-white rounded-xl shadow-soft hover:shadow-hover p-6 transition-all duration-200 border border-gray-100 flex flex-col h-full"
        >
          <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200 group-hover:text-purple-700 transition-colors duration-200 flex items-center justify-center mb-4">
            <BriefcaseIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors duration-200">Browse Jobs</h3>
          <p className="text-gray-600 text-sm flex-grow">Explore thousands of job opportunities that match your skills</p>
          <div className="mt-4 text-primary-600 text-sm font-medium group-hover:text-primary-700">
            Find Jobs →
          </div>
        </Link>

        <Link
          to="/profile"
          className="group bg-white rounded-xl shadow-soft hover:shadow-hover p-6 transition-all duration-200 border border-gray-100 flex flex-col h-full"
        >
          <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 group-hover:text-green-700 transition-colors duration-200 flex items-center justify-center mb-4">
            <UserCircleIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors duration-200">My Profile</h3>
          <p className="text-gray-600 text-sm flex-grow">Update your resume, skills, and preferences to improve job matches</p>
          <div className="mt-4 text-primary-600 text-sm font-medium group-hover:text-primary-700">
            Edit Profile →
          </div>
        </Link>
      </div>
      
      {/* Recommended Jobs Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recommended For You</h2>
          <Link to="/jobs" className="text-primary-600 text-sm font-medium hover:text-primary-700">
            View All Jobs →
          </Link>
        </div>
        
        {jobsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : hasRecommendedJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.data.jobs.slice(0, 3).map((job: any) => (
              <Link 
                key={job.id} 
                to={`/jobs/${job.id}`}
                className="bg-white rounded-xl shadow-soft hover:shadow-hover p-6 transition-all duration-200 border border-gray-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{job.title}</h3>
                      <SparklesIcon className="ml-2 h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  {job.logo ? (
                    <img 
                      src={job.logo} 
                      alt={`${job.company} logo`} 
                      className="h-10 w-10 object-contain" 
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 font-medium">
                      {job.company?.charAt(0).toUpperCase() || 'C'}
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {job.description}
                </p>
                <div className="text-primary-600 text-sm font-medium group-hover:text-primary-700 flex justify-end">
                  View Details →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-600">Complete your profile to get personalized job recommendations!</p>
            <Link to="/profile" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
              Update Profile →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};