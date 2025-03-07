import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyApi } from '../../services/api';
import { toast } from 'react-toastify';
import { Job } from '../../types';

interface JobFormData {
  title: string;
  description: string;
  location: string;
  salary?: number;
  employmentType: string;
  experienceLevel: string;
  remote: boolean;
  requirements: string[];
  benefits: string[];
  category: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
}

const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'TEMPORARY'
];

const EXPERIENCE_LEVELS = [
  'ENTRY_LEVEL',
  'MID_LEVEL',
  'SENIOR_LEVEL',
  'EXECUTIVE'
];

const JOB_CATEGORIES = [
  'TECHNOLOGY',
  'ENGINEERING',
  'DESIGN',
  'MARKETING',
  'SALES',
  'FINANCE',
  'HUMAN_RESOURCES',
  'OTHER'
];

const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    salary: undefined,
    employmentType: 'FULL_TIME',
    experienceLevel: 'ENTRY_LEVEL',
    remote: false,
    requirements: [''],
    benefits: [''],
    category: 'TECHNOLOGY',
    status: 'DRAFT'
  });

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getJobs({ page: 1 });
      const job = response.data.jobs.find((j: Job) => j.id === id);
      
      if (job) {
        setFormData({
          title: job.title,
          description: job.description,
          location: job.location,
          salary: job.salary,
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
          remote: job.remote || false,
          requirements: job.requirements || [''],
          benefits: job.benefits || [''],
          category: job.category,
          status: job.status as 'OPEN' | 'CLOSED' | 'DRAFT'
        });
      }
    } catch (error) {
      toast.error('Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Filter out empty requirements and benefits
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(ben => ben.trim())
      };

      if (id) {
        await companyApi.updateJob(id, cleanedData);
        toast.success('Job updated successfully');
      } else {
        await companyApi.createJob(cleanedData);
        toast.success('Job created successfully');
      }
      
      navigate('/company/dashboard');
    } catch (error) {
      toast.error(id ? 'Error updating job' : 'Error creating job');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? (value ? parseFloat(value) : undefined) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleArrayInputChange = (index: number, value: string, field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? 'Edit Job Listing' : 'Create New Job Listing'}
        </h2>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title*
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location*
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description*
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type*
            </label>
            <select
              name="employmentType"
              required
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {EMPLOYMENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level*
            </label>
            <select
              name="experienceLevel"
              required
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category*
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {JOB_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary (Optional)
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="remote"
              checked={formData.remote}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Remote Position
            </label>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'requirements')}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Requirement
          </button>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefits
          </label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'benefits')}
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'benefits')}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('benefits')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Benefit
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status*
          </label>
          <select
            name="status"
            required
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/company/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (id ? 'Update Job' : 'Create Job')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;