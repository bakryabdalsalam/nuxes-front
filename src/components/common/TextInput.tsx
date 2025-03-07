import React, { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, icon, helperText, className, ...props }, ref) => {
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
          
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border-gray-300 shadow-sm
              ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5
              focus:border-primary-500 focus:ring-primary-500 
              transition duration-200 text-gray-900 text-sm
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${className || ''}
            `}
            {...props}
          />
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

TextInput.displayName = 'TextInput';