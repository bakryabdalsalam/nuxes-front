import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ShareIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  url = window.location.href, 
  title = document.title, 
  className = '', 
  variant = 'primary',
  size = 'md',
  children 
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      }
    }
  };

  // Variant styles
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    text: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-500'
  };

  // Size styles
  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-xs',
    md: 'py-2 px-3.5 text-sm',
    lg: 'py-2.5 px-4 text-base'
  };

  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleShare}
      aria-label="Share this page"
    >
      {children || (
        <>
          {navigator.share ? (
            <ShareIcon className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${size !== 'sm' ? 'mr-2' : 'mr-1.5'}`} />
          ) : copied ? (
            <CheckIcon className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${size !== 'sm' ? 'mr-2' : 'mr-1.5'} text-green-500`} />
          ) : (
            <DocumentDuplicateIcon className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${size !== 'sm' ? 'mr-2' : 'mr-1.5'}`} />
          )}
          {copied ? 'Copied!' : navigator.share ? 'Share' : 'Copy Link'}
        </>
      )}
    </button>
  );
};

export default ShareButton;