import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { companyApi } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile: {
      fullName: string;
      resume?: string;
    };
  };
}

const APPLICATION_STATUSES = [
  'PENDING',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEWED',
  'OFFERED',
  'HIRED',
  'REJECTED'
];

const JobApplicationsList: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (jobId) {
      loadApplications();
    }
  }, [jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getApplications(jobId!);
      setApplications(response.data);
      
      // Also fetch job details
      const jobsResponse = await companyApi.getJobs();
      const jobDetails = jobsResponse.data.jobs.find((j: any) => j.id === jobId);
      setJob(jobDetails);
    } catch (error) {
      toast.error('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await companyApi.updateApplicationStatus(jobId!, applicationId, newStatus);
      toast.success('Application status updated');
      // Reload applications to get fresh data
      loadApplications();
    } catch (error) {
      toast.error('Error updating application status');
    }
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
      {/* Job Details Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Applications for {job?.title}
        </h1>
        <p className="text-gray-600">
          {job?.location} • {job?.employmentType} • {applications.length} Applications
        </p>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.user.profile.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(application.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application.id, e.target.value)}
                      className="text-sm rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        backgroundColor: application.status === 'HIRED' ? '#DEF7EC' :
                          application.status === 'REJECTED' ? '#FDE8E8' :
                          application.status === 'PENDING' ? '#FEF3C7' : '#E1EFFE',
                        color: application.status === 'HIRED' ? '#03543F' :
                          application.status === 'REJECTED' ? '#9B1C1C' :
                          application.status === 'PENDING' ? '#92400E' : '#1E429F'
                      }}
                    >
                      {APPLICATION_STATUSES.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {application.user.profile.resume && (
                      <a
                        href={application.user.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Resume
                      </a>
                    )}
                    <a
                      href={`mailto:${application.user.email}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Contact
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications yet for this position.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsList;