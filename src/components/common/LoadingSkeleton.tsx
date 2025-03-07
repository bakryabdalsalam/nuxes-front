import { memo } from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  type?: 'text' | 'card' | 'profile' | 'job';
}

export const LoadingSkeleton = memo(({ 
  rows = 3, 
  className = '', 
  type = 'text' 
}: LoadingSkeletonProps) => {
  
  if (type === 'card') {
    return (
      <div className={`animate-pulse rounded-xl overflow-hidden shadow-soft ${className}`} role="status" aria-label="Loading content">
        <div className="h-40 bg-gray-200"></div>
        <div className="p-5 space-y-4">
          <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-md"></div>
            <div className="h-3 bg-gray-200 rounded-md"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'job') {
    return (
      <div className={`animate-pulse rounded-xl overflow-hidden shadow-soft bg-white border border-gray-100 p-6 ${className}`} role="status" aria-label="Loading job">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-md flex-shrink-0"></div>
        </div>
        <div className="flex flex-wrap gap-2 my-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3.5 bg-gray-200 rounded-md"></div>
          <div className="h-3.5 bg-gray-200 rounded-md"></div>
          <div className="h-3.5 bg-gray-200 rounded-md w-4/5"></div>
        </div>
        <div className="h-px w-full bg-gray-100 my-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    )
  }

  if (type === 'profile') {
    return (
      <div className={`animate-pulse ${className}`} role="status" aria-label="Loading profile">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-3 flex-1">
            <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-md"></div>
            <div className="h-3 bg-gray-200 rounded-md"></div>
            <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  // Default text skeleton
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4">
            <div className="h-4 bg-gray-200 rounded-md col-span-2"></div>
            <div className="h-4 bg-gray-200 rounded-md col-span-1"></div>
            <div className="h-4 bg-gray-200 rounded-md col-span-3"></div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
