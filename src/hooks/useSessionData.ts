'use client';

import { useState, useEffect, useCallback } from 'react';
import { sessionService, speakerService, cacheManager } from '@/lib/api-client';

interface UseSessionDataOptions {
  preload?: boolean;
  filters?: {
    search?: string;
    track?: string;
    level?: string;
    type?: string;
  };
}

interface SessionDataState {
  sessions: any[];
  speakers: any[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

export function useSessionData(options: UseSessionDataOptions = {}) {
  const { preload = true, filters } = options;
  
  const [state, setState] = useState<SessionDataState>({
    sessions: [],
    speakers: [],
    loading: true,
    error: null,
    fromCache: false
  });

  // Load data function
  const loadData = useCallback(async (useCache: boolean = true) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      if (preload) {
        // Use preload function for initial load
        const { sessions, speakers } = await sessionService.preloadData();
        setState({
          sessions,
          speakers,
          loading: false,
          error: null,
          fromCache: useCache
        });
      } else {
        // Load sessions with filters
        const sessions = await sessionService.getAll(filters, useCache);
        setState(prev => ({
          ...prev,
          sessions,
          loading: false,
          error: null,
          fromCache: useCache
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load data',
        fromCache: false
      }));
    }
  }, [preload, filters]);

  // Refresh data (bypass cache)
  const refresh = useCallback(() => {
    return loadData(false);
  }, [loadData]);

  // Clear cache and reload
  const clearCacheAndReload = useCallback(() => {
    sessionService.clearCache();
    return loadData(false);
  }, [loadData]);

  // Load data on mount and when filters change
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  return {
    ...state,
    refresh,
    clearCacheAndReload,
    cacheStats: cacheManager.getStats(),
    isCacheAvailable: cacheManager.isAvailable()
  };
}

// Hook specifically for speakers
export function useSpeakers() {
  const [state, setState] = useState<{
    speakers: any[];
    loading: boolean;
    error: string | null;
    fromCache: boolean;
  }>({
    speakers: [],
    loading: true,
    error: null,
    fromCache: false
  });

  const loadSpeakers = useCallback(async (useCache: boolean = true) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const speakers = await speakerService.getAll(useCache);
      setState({
        speakers,
        loading: false,
        error: null,
        fromCache: useCache
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load speakers',
        fromCache: false
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    return loadSpeakers(false);
  }, [loadSpeakers]);

  useEffect(() => {
    loadSpeakers(true);
  }, [loadSpeakers]);

  return {
    ...state,
    refresh
  };
}

// Hook for cache management
export function useCache() {
  const [stats, setStats] = useState(cacheManager.getStats());

  const updateStats = useCallback(() => {
    setStats(cacheManager.getStats());
  }, []);

  const clearAll = useCallback(() => {
    cacheManager.clearAll();
    updateStats();
  }, [updateStats]);

  const clearSessions = useCallback(() => {
    sessionService.clearCache();
    updateStats();
  }, [updateStats]);

  return {
    stats,
    updateStats,
    clearAll,
    clearSessions,
    isAvailable: cacheManager.isAvailable()
  };
}