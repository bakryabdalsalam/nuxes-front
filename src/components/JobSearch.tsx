import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/api';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';

interface Job {
  id: string;
  title: string;
  company: {
    companyName: string;
    location: string;
  };
  location: string;
  experienceLevel: string;
  category: string;
  salary: number;
  remote: boolean;
  createdAt: string;
}

interface JobSearchFilters {
  search: string;
  category: string;
  location: string;
  remote: boolean;
  experienceLevel: string;
}

export const JobSearch: React.FC<{ onSearch?: (filters: JobSearchFilters) => void }> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<JobSearchFilters>({
    search: '',
    category: '',
    location: '',
    remote: false,
    experienceLevel: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(filters);
    } else {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.search) params.append('keyword', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.remote) params.append('remote', 'true');
      
      // Navigate to jobs page with filters
      navigate(`/jobs?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col space-y-4">
        {/* Main search bar with location */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Job title, keywords, or company"
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
            />
          </div>
          
          <div className="relative md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
            />
          </div>
          
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2.5 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 shadow-sm flex-shrink-0 font-medium"
          >
            Search
          </button>
        </div>
        
        {/* Toggle for advanced filters */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center transition-colors duration-200"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
            {showAdvanced ? 'Hide filters' : 'Show more filters'}
          </button>
        </div>
        
        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                >
                  <option value="">All Categories</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="DESIGN">Design</option>
                  <option value="PRODUCT">Product</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SALES">Sales</option>
                  <option value="CUSTOMER_SERVICE">Customer Service</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Experience Level Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
              >
                <option value="">All Levels</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>

            {/* Remote Checkbox */}
            <div className="flex items-center h-full pt-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="remote"
                  checked={filters.remote}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-5 w-5"
                />
                <span className="ml-2 text-sm text-gray-700">Remote Only</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default JobSearch;