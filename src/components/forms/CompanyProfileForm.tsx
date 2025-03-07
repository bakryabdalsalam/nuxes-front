import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../../services/api';
import { toast } from 'react-toastify';

interface CompanyProfileData {
  companyName: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  logo?: string;
}

const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
];

const INDUSTRIES = [
  'TECHNOLOGY',
  'HEALTHCARE',
  'FINANCE',
  'EDUCATION',
  'RETAIL',
  'MANUFACTURING',
  'CONSULTING',
  'MEDIA',
  'OTHER'
];

const CompanyProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CompanyProfileData>({
    companyName: '',
    description: '',
    industry: 'TECHNOLOGY',
    size: '1-10',
    website: '',
    location: '',
    logo: ''
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getProfile();
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error('Error loading company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await companyApi.updateProfile(formData);
      toast.success('Company profile updated successfully');
      navigate('/company/dashboard');
    } catch (error) {
      toast.error('Error updating company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Company Profile
        </h2>

        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name*
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description*
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Tell potential candidates about your company..."
            />
          </div>

          {/* Industry and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry*
              </label>
              <select
                name="industry"
                required
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>
                    {industry.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size*
              </label>
              <select
                name="size"
                required
                value={formData.size}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {COMPANY_SIZES.map(size => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Website and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.example.com"
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
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              name="logo"
              value={formData.logo || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo && (
              <img 
                src={formData.logo} 
                alt="Company Logo Preview" 
                className="mt-2 h-16 object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            )}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfileForm;