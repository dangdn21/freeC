'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = ''
}) => {


  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
        <div className={`${sizeClasses[size]} border-4 border-gradient-to-r from-blue-500 to-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
    </div>
  )

};