'use client';

import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { GitHubRepo } from '@/types/github';
import React, { useMemo } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { RepoCard } from './RepoCard';

interface VirtualizedRepoListProps {
  repos: GitHubRepo[];
  isLoading?: boolean;
  height?: number;
  itemHeight?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const VirtualizedRepoList: React.FC<VirtualizedRepoListProps> = ({
  repos,
  isLoading = false,
  height = 600,
  itemHeight = 160,
  onLoadMore,
  hasMore = false,
}) => {
  const {
    scrollElementRef,
    totalHeight,
    visibleItems,
    offsetY,
    startIndex,
  } = useVirtualScroll(repos, {
    itemHeight,
    containerHeight: height,
    overscan: 3,
  });

  // Calculate visible repos with their original indices
  const visibleRepos = useMemo(() => {
    return visibleItems.map((repo, index) => ({
      repo,
      originalIndex: startIndex + index,
    }));
  }, [visibleItems, startIndex]);

  // Handle scroll to bottom for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isNearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 100;
    if (isNearBottom && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={scrollElementRef}
        className="relative overflow-auto rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm"
        style={{ height }}
        onScroll={handleScroll}
      >
        {/* Total height container */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items container */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleRepos.map(({ repo }) => (
              <div
                key={repo.id}
                style={{ height: itemHeight }}
                className="px-4 py-2"
              >
                <div className="h-full animate-slideUp">
                  <RepoCard repo={repo} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="small" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};