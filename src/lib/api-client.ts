import { User, Event, Speaker } from '@/types';

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
  // Get all speakers
  async getAll(): Promise<Speaker[]> {
    const response = await apiRequest<any[]>('/speakers');
    return response.map(transformDbSpeaker);
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
    return transformDbSpeaker(response);
  },
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