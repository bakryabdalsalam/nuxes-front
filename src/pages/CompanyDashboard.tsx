import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { companyApi } from '../services/api';
import { toast } from 'react-toastify';

interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

const CompanyDashboard: React.FC = () => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      if (!isAuthenticated) {
        await checkAuth();
      }
      fetchStats();
    };

    initDashboard();
  }, [isAuthenticated, checkAuth]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching company stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats?.totalJobs || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Active Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats?.activeJobs || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {stats?.totalApplications || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Pending Reviews</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {stats?.pendingApplications || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;