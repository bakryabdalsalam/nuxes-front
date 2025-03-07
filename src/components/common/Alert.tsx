import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  icon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  icon = true,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    success: {
      container: 'bg-green-50 border border-green-100 text-green-800',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />,
      title: 'text-green-800',
      closeButton: 'text-green-500 hover:bg-green-100',
    },
    warning: {
      container: 'bg-yellow-50 border border-yellow-100 text-yellow-800',
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
      title: 'text-yellow-800',
      closeButton: 'text-yellow-500 hover:bg-yellow-100',
    },
    error: {
      container: 'bg-red-50 border border-red-100 text-red-800',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />,
      title: 'text-red-800',
      closeButton: 'text-red-500 hover:bg-red-100',
    },
    info: {
      container: 'bg-blue-50 border border-blue-100 text-blue-800',
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />,
      title: 'text-blue-800',
      closeButton: 'text-blue-500 hover:bg-blue-100',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`rounded-lg p-4 ${styles.container} ${className}`} role="alert">
      <div className="flex">
        {icon && (
          <div className="flex-shrink-0 mr-3">{styles.icon}</div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title} mb-1`}>{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-50 focus:ring-${variant}-500 ${styles.closeButton}`}
                onClick={onDismiss}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};