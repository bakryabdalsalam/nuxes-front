import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  to?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  href,
  to,
  fullWidth = false,
  type = 'button',
  onClick,
}) => {
  // Button variants
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    text: 'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  };

  // Button sizes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
  };

  // Common classes for all buttons
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200
    ${isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${className}
  `;

  // Icon spacing
  const iconSpacing = size === 'sm' ? 'mr-1.5' : 'mr-2';
  const iconSpacingRight = size === 'sm' ? 'ml-1.5' : 'ml-2';

  // Icon sizing
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  const content = (
    <>
      {isLoading ? (
        <LoadingSpinner 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? 'primary' : 'white'} 
          className={icon && iconPosition === 'left' ? iconSpacing : ''}
        />
      ) : icon && iconPosition === 'left' ? (
        <span className={`${iconSize} ${iconSpacing}`}>{icon}</span>
      ) : null}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className={`${iconSize} ${iconSpacingRight}`}>{icon}</span>
      )}
    </>
  );

  // Render as Link from react-router-dom if 'to' prop is provided
  if (to) {
    return (
      <Link 
        to={to} 
        className={baseClasses}
        onClick={onClick as any}
      >
        {content}
      </Link>
    );
  }

  // Render as anchor tag if 'href' prop is provided
  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={onClick as any}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type}
      className={baseClasses}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {content}
    </button>
  );
};