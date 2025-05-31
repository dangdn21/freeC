'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 1.0, rootMargin = '0px' } = options;
  const [isFetching, setIsFetching] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetching) {
        setIsFetching(true);
        callback();
      }
    },
    [callback, isFetching]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  const resetFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  return { targetRef, isFetching, resetFetching };
}