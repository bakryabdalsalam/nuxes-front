import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, applicationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  id: string;
  resume: string;
  skills: string[];
  experience: string;
  education: string;
  bio: string;
  phoneNumber: string;
  address: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Application {
  id: string;
  status: string;
  resume: string;
  coverLetter: string;
  createdAt: string;
  job: {
    id: string;
    title: string; 
    company: {
      companyName: string;
      location: string;
    };
  };
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching user profile and applications data');
        console.log('Current auth token:', localStorage.getItem('token'));
        
        // Use our API services with proper token handling
        const [profileRes, applicationsRes] = await Promise.all([
          userApi.getProfile(),
          applicationApi.getUserApplications(),
        ]);
        
        // Check if the responses were successful
        if (profileRes.success) {
          setProfile(profileRes.data);
        } else {
          console.error('Failed to fetch profile:', profileRes);
        }
        
        if (applicationsRes.success) {
          setApplications(applicationsRes.data);
        } else {
          console.error('Failed to fetch applications:', applicationsRes);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      // If no authenticated user, redirect to login
      navigate('/login');
    }
  }, [user, navigate]);

  // Show placeholder content while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={() => navigate('/profile/edit')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name: {profile?.user?.name || user?.name}</p>
            <p className="text-gray-600">Email: {profile?.user?.email || user?.email}</p>
            <p className="text-gray-600">Phone: {profile?.phoneNumber}</p>
            <p className="text-gray-600">Location: {profile?.address}</p>
          </div>
          <div>
            <p className="text-gray-600">LinkedIn: {profile?.linkedIn}</p>
            <p className="text-gray-600">GitHub: {profile?.github}</p>
            <p className="text-gray-600">Portfolio: {profile?.portfolio}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            )) || <span className="text-gray-600">No skills listed</span>}
          </div>
        </div>
        {profile?.resume && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Resume</h3>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View Resume
            </a>
          </div>
        )}
      </div>

      {/* Job Applications Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Applications</h2>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Browse Jobs
          </button>
        </div>
        
        {applications && applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
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
                      <div className="text-sm font-medium text-gray-900">
                        {application.job.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.job.company?.companyName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {application.job.company?.location || 'Remote'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/jobs/${application.job.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Job
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Find Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;