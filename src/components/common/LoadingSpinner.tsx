import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white'
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`
        animate-spin rounded-full 
        ${sizeClasses[size]}
        border-2 
        border-t-transparent
        ${colorClasses[color as keyof typeof colorClasses] || 'border-primary-600'}
      `}></div>
    </div>
  );
};
