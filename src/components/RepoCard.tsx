'use client';

import React from 'react';
import { GitHubRepo } from '../types/github';

interface RepoCardProps {
  repo: GitHubRepo;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-white/20 p-6 hover-lift glass-morphism animate-slideUp hover:bg-white/90">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center text-lg font-bold text-gray-900 hover:gradient-text transition-all duration-300 truncate-1-line"
          >
            <span className=" fold-bold text-xl truncate-1-line">{repo.name}</span>
          </a>
          
          {repo.description && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
              {repo.description}
            </p>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          {repo.private ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200/50">
              Private
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/50">

              Public
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
        {repo.language && (
          <div className="flex items-center group/lang">
            <span className="font-bold text-gray-800 text-lg">
              {repo.language}
            </span>
          </div>
        )}
        
        <div className="flex items-center group/stat hover:text-yellow-600 transition-colors duration-300">
          <span className="font-medium">Stars: {repo.stargazers_count}</span>
        </div>
        
        <div className="flex items-center group/stat hover:text-blue-600 transition-colors duration-300">
          <span className="font-medium">Forks: {repo.forks_count}</span>
        </div>
        
        <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
          <span className="font-medium">Updated: {formatDate(repo.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};