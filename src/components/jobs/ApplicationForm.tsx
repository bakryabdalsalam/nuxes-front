import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ApplicationFormProps {
  jobId: string;
}

interface ApplicationFormData {
  coverLetter: string;
  resume: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ jobId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<ApplicationFormData>();

  useEffect(() => {
    // Verify authentication when component mounts
    checkAuth();
  }, [checkAuth]);

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      if (!isAuthenticated) {
        throw new Error('Please log in to submit an application');
      }
      return applicationApi.createApplication(jobId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      toast.success('Application submitted successfully!');
      reset();
    },
    onError: (error: any) => {
      console.error('Application submission error:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in again to submit your application');
        navigate('/login', { state: { from: `/jobs/${jobId}` } });
        return;
      }
      const message = error.response?.data?.message || error.message || 'Failed to submit application';
      toast.error(message);
    }
  });

  const onSubmit = (data: ApplicationFormData) => {
    applicationMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply for this Position</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 text-gray-400">
              <DocumentTextIcon className="h-5 w-5" />
            </div>
            <textarea
              id="coverLetter"
              rows={5}
              {...register('coverLetter', { 
                required: 'Cover letter is required',
                minLength: {
                  value: 100,
                  message: 'Cover letter should be at least 100 characters'
                }
              })}
              className={`shadow-sm block w-full text-sm border-gray-300 rounded-lg pl-10 pr-3 py-2.5 transition-colors duration-200
                focus:border-primary-500 focus:ring-primary-500
                ${errors.coverLetter ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Tell us why you're a great fit for this position..."
            />
          </div>
          {errors.coverLetter && (
            <p className="mt-1.5 text-sm text-red-600 flex items-start">
              <span className="text-red-500 mr-1">•</span>
              {errors.coverLetter.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Resume Link
          </label>
          <div className="relative">
            <div className="absolute top-2.5 left-3 text-gray-400">
              <LinkIcon className="h-5 w-5" />
            </div>
            <input
              type="url"
              id="resume"
              {...register('resume', { 
                required: 'Resume link is required',
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'Please enter a valid URL'
                }
              })}
              className={`shadow-sm block w-full text-sm border-gray-300 rounded-lg pl-10 pr-3 py-2.5 transition-colors duration-200
                focus:border-primary-500 focus:ring-primary-500
                ${errors.resume ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="https://your-resume-link.com"
            />
          </div>
          {errors.resume && (
            <p className="mt-1.5 text-sm text-red-600 flex items-start">
              <span className="text-red-500 mr-1">•</span>
              {errors.resume.message}
            </p>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            Please provide a link to your resume (Google Drive, Dropbox, etc.)
          </p>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || applicationMutation.isPending || !isAuthenticated}
            className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg
              shadow-sm text-sm font-medium text-white bg-primary-600 transition-all duration-200
              ${(isSubmitting || applicationMutation.isPending || !isAuthenticated) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-primary-700 hover:shadow'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {(isSubmitting || applicationMutation.isPending) ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" color="white" className="mr-3" />
                <span>Submitting...</span>
              </div>
            ) : !isAuthenticated ? (
              'Please log in to apply'
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
