'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UserCard } from '@/components/UserCard';
import { githubService } from '@/services/github';
import { GitHubUser } from '@/types/github';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();

  const [keywordsHistory, setKeywordsHistory] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSearch = useCallback(async (e: React.FormEvent | KeyboardEvent) => {
    e.preventDefault();
    const trimSearchText = searchTerm.trim();
    if (!trimSearchText) {
      setError('Please enter a GitHub username');
      return;
    }

    let newKeywordsHistory = [trimSearchText, ...keywordsHistory].filter((keyword, index, self) => self.indexOf(keyword) === index);
    if (newKeywordsHistory.length > 5) {
      newKeywordsHistory = newKeywordsHistory.slice(0, 5);
    }
    localStorage.setItem('keywordsHistory', JSON.stringify(newKeywordsHistory))
    setKeywordsHistory(newKeywordsHistory);

    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const userData = await githubService.searchUser(trimSearchText);
      setUser(userData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [keywordsHistory, searchTerm]);


  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedHistory = localStorage.getItem('keywordsHistory');
    if (storedHistory) {
      setKeywordsHistory(JSON.parse(storedHistory));
    }
  }, []);


  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch(e);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [searchTerm]);
  const handleUserClick = () => {
    if (user) {
      router.push(`/user/${user.login}`);
    }
  };

  const handleRetry = () => {
    if (searchTerm.trim()) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <div className="space-y-12">
      <div className="max-w-2xl mx-auto">
        <div className="mt-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative group">
              <div className="relative flex space-x-4 p-2">
                <div className="flex-1 relative border border-gray-300 rounded-xl group-hover:border-gray-400 transition-colors duration-300 hover:shadow-lg">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Please enter a GitHub username"
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-lg"
                    disabled={loading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  className="group/btn px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  <div className="flex items-center space-x-3">
                    {loading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    <span>Search</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
        {keywordsHistory.length > 0 && (
          <div className="flex flex-wrap justify-start gap-2 mt-4">
            {keywordsHistory.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setSearchTerm(suggestion)}
                className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="relative text-center py-16 animate-fadeIn">
            <LoadingSpinner size="large" />
          </div>
        )}

        {error && (
          <div className="animate-slideUp">
            <ErrorMessage 
              message={error} 
              onRetry={searchTerm.trim() ? handleRetry : undefined}
              className="max-w-md mx-auto"
            />
          </div>
        )}

        {user && !loading && !error && (
          <div className="space-y-6 animate-slideUp">
            <UserCard user={user} onClick={handleUserClick} />
          </div>
        )}

        {/* Empty State */}
        {!user && !loading && !error && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="relative mb-8 flex items-center justify-center mx-auto">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">
              Let find Github username!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}