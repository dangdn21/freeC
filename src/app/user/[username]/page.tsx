'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VirtualizedRepoList } from '@/components/VirtualizedRepoList';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { githubService } from '@/services/github';
import { ApiError, GitHubRepo, GitHubUser } from '@/types/github';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function UserDetailPage() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reposError, setReposError] = useState<string | null>(null);
  const [hasMoreRepos, setHasMoreRepos] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const currentUserNameRef = useRef('');
  const heightRef = useRef(0);
  
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  // Infinite scroll hook
  const { targetRef, resetFetching } = useInfiniteScroll(
    () => {
    },
    { threshold: 0.8 }
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      heightRef.current = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    if (currentUserNameRef.current !== username) {
      currentUserNameRef.current = username;
      fetchUserData();
    }
  }, [currentUserNameRef.current, username]);


  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!username) {
        throw new Error('Username is required');
      }

      const userData = await githubService.searchUser(username);
      setUser(userData);
      fetchUserRepos();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRepos = async (page = 1) => {
    if (page === 1) {
      setReposLoading(true);
      setRepos([]);
      setCurrentPage(1);
    }

    setReposError(null);

    try {
      const response = await githubService.getUserRepos(username, page, 10);
      
      if (page === 1) {
        setRepos(response.data);
      } else {
        setRepos(prev => [...prev, ...response.data]);
      }
      
      setHasMoreRepos(response.hasNextPage);
      setCurrentPage(page);
    } catch (err) {
      const apiError = err as ApiError;
      setReposError(apiError.message);
    } finally {
      setReposLoading(false);
      resetFetching();
    }
  };

  const fetchMoreRepos = useCallback(() => {
    if (!reposLoading && hasMoreRepos) {
      fetchUserRepos(currentPage + 1);
    }
  }, [currentPage, reposLoading, hasMoreRepos, username]);

  const handleRetry = () => {
    fetchUserData();
  };

  const handleReposRetry = () => {
    fetchUserRepos(1);
  };

  if (loading) {
    return (
      <div className="relative text-center py-16 animate-fadeIn">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 mr-3 p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 transform group-hover:scale-110"
        >
          <svg className="w-full h-full text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="animate-slideUp">
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="w-10 h-10 mr-3 p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 transform group-hover:scale-110"
      >
        <svg className="w-full h-full text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* User Profile */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 animate-slideUp">
        <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-full h-full object-cover transform"
                />
              </div>
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
                {user.name || user.login}
              </h1>
              <p className="text-2xl text-gray-600 font-medium">@{user.login}</p>
            </div>
            
            {user.bio && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/30">
                <p className="text-gray-800 text-lg leading-relaxed">{user.bio}</p>
              </div>
            )}
            
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 justify-center lg:justify-start">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Public Repositories', value: user.public_repos },
                  { label: 'Followers', value: user.followers },
                  { label: 'Following', value: user.following },
                  { label: 'Public Gists', value: user.public_gists }
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center group"
                  >
                    <p className={`text-3xl font-bold`}>
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 glass-morphism animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">{repos.length} Public Repositories</h2>
        </div>
      </div>

      {/* Repositories Section */}
      <div className="animate-slideUp" style={{animationDelay: '0.3s'}}>
        {reposError && (
          <div className="mb-6">
            <ErrorMessage 
              message={reposError} 
              onRetry={handleReposRetry}
            />
          </div>
        )}

        {!reposLoading && !reposError && repos.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="relative mb-8 flex items-center justify-center mx-auto">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">
              No public repositories
            </h3>
          </div>
        )}

        {heightRef.current > 0 && !reposError && repos.length > 0 && (
          <VirtualizedRepoList
            repos={repos}
            isLoading={reposLoading}
            height={heightRef.current - 700}
            itemHeight={180}
            onLoadMore={fetchMoreRepos}
            hasMore={hasMoreRepos}
          />
        )}

        <div ref={targetRef} className="h-10" />
      </div>
    </div>
  );
}