import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { SparklesIcon, MapPinIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface JobCardProps {
  job: Job;
  isRecommended?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isRecommended }) => {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white hover:bg-gray-50 shadow-soft hover:shadow-hover transition-all duration-300 rounded-xl overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        {isRecommended && (
          <div className="flex items-center mb-3 text-xs font-medium text-secondary-600 bg-secondary-50 w-fit px-2.5 py-1 rounded-full">
            <SparklesIcon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Recommended for you
          </div>
        )}
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-400" />
              {job.company}
            </p>
          </div>
          {job.logo ? (
            <img 
              src={job.logo} 
              alt={`${job.company} logo`} 
              className="h-10 w-10 object-contain rounded-md bg-white border border-gray-100"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              {job.company.charAt(0)}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <MapPinIcon className="h-3 w-3 mr-1" />
            {job.location}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
            {job.experienceLevel}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            {job.category}
          </span>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {job.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          {job.salary && (
            <div className="text-sm font-medium text-gray-900">
              ${job.salary.toLocaleString()}/yr
            </div>
          )}
          <div className="text-xs text-gray-500 flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
};
