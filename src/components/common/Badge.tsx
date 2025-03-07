import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
  outline?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  dot = false,
  outline = false,
}) => {
  // Base variant styles
  const variantClasses = {
    primary: outline 
      ? 'bg-white text-primary-700 border border-primary-200' 
      : 'bg-primary-50 text-primary-700 border border-primary-100',
    secondary: outline 
      ? 'bg-white text-secondary-700 border border-secondary-200' 
      : 'bg-secondary-50 text-secondary-700 border border-secondary-100',
    success: outline 
      ? 'bg-white text-green-700 border border-green-200' 
      : 'bg-green-50 text-green-700 border border-green-100',
    warning: outline 
      ? 'bg-white text-yellow-700 border border-yellow-200' 
      : 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    error: outline 
      ? 'bg-white text-red-700 border border-red-200' 
      : 'bg-red-50 text-red-700 border border-red-100',
    info: outline 
      ? 'bg-white text-blue-700 border border-blue-200' 
      : 'bg-blue-50 text-blue-700 border border-blue-100',
    default: outline 
      ? 'bg-white text-gray-700 border border-gray-200' 
      : 'bg-gray-50 text-gray-700 border border-gray-100',
  };

  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  };

  // Dot colors
  const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-gray-500',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span 
          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} 
          aria-hidden="true"
        />
      )}
      
      {icon && (
        <span className="mr-1 -ml-0.5">
          {icon}
        </span>
      )}
      
      {children}
    </span>
  );
};