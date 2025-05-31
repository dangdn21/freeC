'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/50 rounded-2xl p-6 text-center shadow-lg backdrop-blur-sm animate-slideUp ${className}`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-rose-400 to-pink-400"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-red-800 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-sm font-medium text-red-700 mb-4 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-rose-300 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
    </div>
  );
};