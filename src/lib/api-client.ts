import { User, Event, Speaker } from '@/types';
import { cache, cacheUtils, CACHE_KEYS, CACHE_TTL } from './cache';

// Base API client configuration
const API_BASE = '/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Transform database types to application types
const transformDbUser = (dbUser: any): User => ({
  id: dbUser.id,
  email: dbUser.email,
  fullName: dbUser.full_name,
  company: dbUser.company,
  jobTitle: dbUser.job_title,
  phone: dbUser.phone,
  createdAt: dbUser.created_at,
  updatedAt: dbUser.updated_at,
});

const transformDbEvent = (dbEvent: any): Event => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  startDate: dbEvent.start_date,
  endDate: dbEvent.end_date,
  timezone: dbEvent.timezone,
  status: dbEvent.status,
  coverImage: dbEvent.cover_image,
  maxAttendees: dbEvent.max_attendees,
  currentAttendees: dbEvent.current_attendees,
  tags: dbEvent.tags,
  organizer: {
    name: dbEvent.organizer_name,
    email: dbEvent.organizer_email,
    avatar: dbEvent.organizer_avatar,
  },
});

const transformDbSpeaker = (dbSpeaker: any): Speaker => ({
  id: dbSpeaker.id,
  name: dbSpeaker.name,
  title: dbSpeaker.title,
  company: dbSpeaker.company,
  bio: dbSpeaker.bio,
  avatar: dbSpeaker.avatar,
  social: {
    twitter: dbSpeaker.social_twitter,
    linkedin: dbSpeaker.social_linkedin,
    website: dbSpeaker.social_website,
  },
  sessions: dbSpeaker.sessions,
});

// User operations
export const userService = {
  // Create a new user
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await apiRequest<any>('/users', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        fullName: userData.fullName,
        company: userData.company,
        jobTitle: userData.jobTitle,
        phone: userData.phone,
      }),
    });
    return transformDbUser(response);
  },

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    try {
      const response = await apiRequest<any>(`/users/${id}`);
      return transformDbUser(response);
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAll();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      throw error;
    }
  },

  // Get all users
  async getAll(): Promise<User[]> {
    const response = await apiRequest<any[]>('/users');
    return response.map(transformDbUser);
  },

  // Update user
  async update(id: string, updates: Partial<User>): Promise<User> {
    const response = await apiRequest<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        email: updates.email,
        fullName: updates.fullName,
        company: updates.company,
        jobTitle: updates.jobTitle,
        phone: updates.phone,
      }),
    });
    return transformDbUser(response);
  },

  // Delete user
  async delete(id: string): Promise<void> {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Event operations
export const eventService = {
  // Get all events
  async getAll(): Promise<Event[]> {
    const response = await apiRequest<any[]>('/events');
    return response.map(transformDbEvent);
  },

  // Get event by ID
  async getById(id: string): Promise<Event | null> {
    try {
      const response = await apiRequest<any>(`/events/${id}`);
      return transformDbEvent(response);
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },

  // Create event
  async create(eventData: Omit<Event, 'id'>): Promise<Event> {
    const response = await apiRequest<any>('/events', {
      method: 'POST',
      body: JSON.stringify({
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        timezone: eventData.timezone,
        status: eventData.status,
        coverImage: eventData.coverImage,
        maxAttendees: eventData.maxAttendees,
        currentAttendees: eventData.currentAttendees,
        tags: eventData.tags,
        organizer: eventData.organizer,
      }),
    });
    return transformDbEvent(response);
  },

  // Update event
  async update(id: string, updates: Partial<Event>): Promise<Event> {
    const response = await apiRequest<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updates.title,
        description: updates.description,
        startDate: updates.startDate,
        endDate: updates.endDate,
        timezone: updates.timezone,
        status: updates.status,
        coverImage: updates.coverImage,
        maxAttendees: updates.maxAttendees,
        currentAttendees: updates.currentAttendees,
        tags: updates.tags,
        organizer: updates.organizer,
      }),
    });
    return transformDbEvent(response);
  },

  // Delete event
  async delete(id: string): Promise<void> {
    await apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Speaker operations
export const speakerService = {
  // Get all speakers with caching
  async getAll(useCache: boolean = true): Promise<Speaker[]> {
    // Try to get from cache first
    if (useCache) {
      const cached = cacheUtils.getCachedSpeakers();
      if (cached) {
        console.log('📦 Speakers loaded from cache');
        return cached.map(transformDbSpeaker);
      }
    }

    console.log('🌐 Fetching speakers from API');
    const response = await apiRequest<any[]>('/speakers');
    const speakers = response.map(transformDbSpeaker);
    
    // Cache the raw response for future use
    if (useCache) {
      cacheUtils.cacheSpeakers(response);
    }
    
    return speakers;
  },

  // Get speaker by ID
  async getById(id: string): Promise<Speaker | null> {
    try {
      const response = await apiRequest<any>(`/speakers/${id}`);
      return transformDbSpeaker(response);
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },

  // Create speaker
  async create(speakerData: Omit<Speaker, 'id'>): Promise<Speaker> {
    const response = await apiRequest<any>('/speakers', {
      method: 'POST',
      body: JSON.stringify({
        name: speakerData.name,
        title: speakerData.title,
        company: speakerData.company,
        bio: speakerData.bio,
        avatar: speakerData.avatar,
        social: speakerData.social,
        sessions: speakerData.sessions,
      }),
    });
    
    // Clear speakers cache when new speaker is created
    cache.remove(CACHE_KEYS.SPEAKERS);
    
    return transformDbSpeaker(response);
  },
};

// Sessions operations with caching
export const sessionService = {
  // Get all sessions with caching and filtering
  async getAll(filters?: {
    search?: string;
    track?: string;
    level?: string;
    type?: string;
  }, useCache: boolean = true): Promise<any[]> {
    
    // Create cache key based on filters
    const cacheKey = filters ? `sessions_${JSON.stringify(filters)}` : 'sessions';
    
    // Try to get from cache first
    if (useCache) {
      const cached = cache.get<any[]>(cacheKey);
      if (cached) {
        console.log('📦 Sessions loaded from cache', filters ? `(filtered: ${JSON.stringify(filters)})` : '');
        return cached;
      }
    }

    console.log('🌐 Fetching sessions from API', filters ? `(filters: ${JSON.stringify(filters)})` : '');
    
    // Build query parameters
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.track) params.append('track', filters.track);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.type) params.append('type', filters.type);
    
    const queryString = params.toString();
    const endpoint = `/sessions${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest<{ sessions: any[]; total: number }>(endpoint);
    const sessions = response.sessions || [];
    
    // Cache the results
    if (useCache) {
      cache.set(cacheKey, sessions, CACHE_TTL.MEDIUM);
    }
    
    return sessions;
  },

  // Get session by ID
  async getById(id: string): Promise<any | null> {
    try {
      // Check if we have this session in any cached sessions first
      const allCached = cache.get<any[]>('sessions');
      if (allCached) {
        const cachedSession = allCached.find(session => session.id === id);
        if (cachedSession) {
          console.log('📦 Session loaded from cache');
          return cachedSession;
        }
      }

      console.log('🌐 Fetching session from API');
      const response = await apiRequest<any>(`/sessions/${id}`);
      return response;
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },

  // Clear sessions cache (useful when data changes)
  clearCache(): void {
    // Clear all session-related cache entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('remoteinbound_cache_sessions')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ Sessions cache cleared');
  },

  // Preload sessions and speakers data
  async preloadData(): Promise<{ sessions: any[]; speakers: any[] }> {
    console.log('🚀 Preloading sessions and speakers data...');
    
    try {
      // Load both sessions and speakers in parallel
      const [sessions, speakers] = await Promise.all([
        this.getAll(undefined, true), // Load all sessions with caching
        speakerService.getAll(true)    // Load all speakers with caching
      ]);

      console.log(`✅ Preloaded ${sessions.length} sessions and ${speakers.length} speakers`);
      
      return { sessions, speakers };
    } catch (error) {
      console.error('❌ Failed to preload data:', error);
      throw error;
    }
  }
};

// Cache management utilities
export const cacheManager = {
  // Get cache statistics
  getStats() {
    return cache.getCacheInfo();
  },

  // Clear all cache
  clearAll() {
    cache.clear();
    console.log('🗑️ All cache cleared');
  },

  // Update cache version (invalidates all cache)
  updateVersion(version: string) {
    cache.updateVersion(version);
    console.log(`🔄 Cache version updated to ${version}`);
  },

  // Check if cache is available
  isAvailable(): boolean {
    try {
      const testKey = 'cache_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};

// Registration operations
export const registrationService = {
  // Register user for event
  async create(userId: string, eventId: string, type: 'virtual' | 'in_person' = 'virtual'): Promise<void> {
    await apiRequest('/registrations', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        eventId,
        type,
      }),
    });
  },

  // Get user registrations
  async getByUserId(userId: string): Promise<string[]> {
    return apiRequest<string[]>(`/registrations/user/${userId}`);
  },

  // Cancel registration
  async cancel(userId: string, eventId: string): Promise<void> {
    await apiRequest('/registrations/cancel', {
      method: 'PUT',
      body: JSON.stringify({
        userId,
        eventId,
      }),
    });
  },
};