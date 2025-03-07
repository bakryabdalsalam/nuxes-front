import React, { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    options, 
    label, 
    error, 
    helperText, 
    icon, 
    className = '',
    size = 'md',
    ...props 
  }, ref) => {
    // Size classes
    const sizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2.5 text-sm',
      lg: 'py-3 text-base',
    };
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <select
            ref={ref}
            className={`
              block w-full rounded-lg border-gray-300 shadow-sm
              ${icon ? 'pl-10' : 'pl-3'} pr-9 ${sizeClasses[size]}
              appearance-none
              focus:border-primary-500 focus:ring-primary-500 
              transition-colors duration-200 text-gray-900
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
        
        {error ? (
          <p className="mt-1.5 text-sm text-red-600 flex items-start">
            <span className="text-red-500 mr-1">•</span>
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';