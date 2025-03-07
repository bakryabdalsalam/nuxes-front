import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '../../services/api';
import { Application } from '../../types';
import { formatCompanyName, formatDate, statusColors } from '../../utils/formatters';

export const ApplicationTracking = () => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: applicationApi.getUserApplications
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {applications?.map((application: Application) => (
        <div key={application.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {application.job?.title || 'Unknown Job'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {formatCompanyName(application.job?.company)}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status] || 'bg-gray-100 text-gray-800'}`}>
              {application.status}
            </span>
          </div>
          <div className="mt-4">
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                {['PENDING', 'REVIEWING', 'ACCEPTED'].includes(application.status) && (
                  <div
                    style={{ width: application.status === 'ACCEPTED' ? '100%' : '50%' }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  />
                )}
              </div>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Applied on</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(application.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(application.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
};
