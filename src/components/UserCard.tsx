'use client';

import React from 'react';
import { GitHubUser } from '../types/github';

interface UserCardProps {
  user: GitHubUser;
  onClick: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div
      key={user.id}
      role="button"
      onClick={onClick}
      tabIndex={0}
      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 p-6 max-w-md mx-auto hover:bg-white/90 cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-full h-full object-cover transform"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:gradient-text transition-all duration-300">
            {user.name || user.login}
          </h3>
          <p className="text-sm text-gray-600 font-medium">@{user.login}</p>
          {user.bio && (
            <p className="text-sm text-gray-700 mt-1 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end w-full">
        <button type="button" className='flex items-center justify-center px-4 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm '
        >
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};