// Client-side caching utility for sessions and speakers data
interface CacheItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  version: string; // Cache version for invalidation
}

class DataCache {
  private static instance: DataCache;
  private config: CacheConfig = {
    ttl: 10 * 60 * 60 * 1000, // 10 hours default
    version: '1.0.0'
  };

  private constructor() {}

  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  private getStorageKey(key: string): string {
    return `remoteinbound_cache_${key}`;
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.config.ttl;
  }

  private isValidVersion(version: string): boolean {
    return version === this.config.version;
  }

  set<T>(key: string, data: T, customTTL?: number): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.config.version
      };

      if (customTTL) {
        // Store custom TTL in the cache item for future validation
        (cacheItem as any).customTTL = customTTL;
      }

      localStorage.setItem(this.getStorageKey(key), JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.getStorageKey(key));
      if (!cached) return null;

      const cacheItem: CacheItem<T> & { customTTL?: number } = JSON.parse(cached);
      
      // Check version validity
      if (!this.isValidVersion(cacheItem.version)) {
        this.remove(key);
        return null;
      }

      // Check expiration with custom TTL if available
      const ttl = cacheItem.customTTL || this.config.ttl;
      if (Date.now() - cacheItem.timestamp > ttl) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      this.remove(key);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('remoteinbound_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // Get cache info for debugging
  getCacheInfo(): { [key: string]: { size: number; timestamp: number; version: string } } {
    const info: { [key: string]: { size: number; timestamp: number; version: string } } = {};
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('remoteinbound_cache_')) {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheItem = JSON.parse(cached);
            const cleanKey = key.replace('remoteinbound_cache_', '');
            info[cleanKey] = {
              size: cached.length,
              timestamp: cacheItem.timestamp,
              version: cacheItem.version
            };
          }
        }
      });
    } catch (error) {
      console.warn('Failed to get cache info:', error);
    }

    return info;
  }

  // Update cache version to invalidate all cached data
  updateVersion(newVersion: string): void {
    this.config.version = newVersion;
    this.clear(); // Clear all existing cache when version changes
  }

  // Set custom TTL for different data types
  setTTL(ttl: number): void {
    this.config.ttl = ttl;
  }
}

// Export singleton instance
export const cache = DataCache.getInstance();

// Predefined cache keys
export const CACHE_KEYS = {
  SESSIONS: 'sessions',
  SPEAKERS: 'speakers',
  EVENTS: 'events',
  USER_PREFERENCES: 'user_preferences'
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30 * 60 * 1000,     // 30 minutes
  MEDIUM: 2 * 60 * 60 * 1000, // 2 hours
  LONG: 10 * 60 * 60 * 1000, // 10 hours (perfect for event data)
  DAY: 24 * 60 * 60 * 1000   // 24 hours
} as const;

// Utility functions for common operations
export const cacheUtils = {
  // Cache sessions data
  cacheSessions: (sessions: any[], filters?: any) => {
    const key = filters ? `${CACHE_KEYS.SESSIONS}_${JSON.stringify(filters)}` : CACHE_KEYS.SESSIONS;
    cache.set(key, sessions, CACHE_TTL.MEDIUM);
  },

  // Get cached sessions
  getCachedSessions: (filters?: any) => {
    const key = filters ? `${CACHE_KEYS.SESSIONS}_${JSON.stringify(filters)}` : CACHE_KEYS.SESSIONS;
    return cache.get<any[]>(key);
  },

  // Cache speakers data
  cacheSpeakers: (speakers: any[]) => {
    cache.set(CACHE_KEYS.SPEAKERS, speakers, CACHE_TTL.LONG);
  },

  // Get cached speakers
  getCachedSpeakers: () => {
    return cache.get<any[]>(CACHE_KEYS.SPEAKERS);
  },

  // Cache events data
  cacheEvents: (events: any[]) => {
    cache.set(CACHE_KEYS.EVENTS, events, CACHE_TTL.MEDIUM);
  },

  // Get cached events
  getCachedEvents: () => {
    return cache.get<any[]>(CACHE_KEYS.EVENTS);
  },

  // Clear all event-related cache
  clearEventCache: () => {
    cache.remove(CACHE_KEYS.SESSIONS);
    cache.remove(CACHE_KEYS.SPEAKERS);
    cache.remove(CACHE_KEYS.EVENTS);
    
    // Clear filtered sessions cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('remoteinbound_cache_sessions_')) {
        localStorage.removeItem(key);
      }
    });
  }
};