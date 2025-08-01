import { createBrowserSupabaseClient, Database } from './supabase';
import { User, Event, Speaker } from '@/types';

// Type definitions for database operations
type DbUser = Database['public']['Tables']['users']['Row'];
type DbEvent = Database['public']['Tables']['events']['Row'];
type DbSpeaker = Database['public']['Tables']['speakers']['Row'];

// Transform database types to application types
const transformDbUser = (dbUser: DbUser): User => ({
  id: dbUser.id,
  email: dbUser.email,
  fullName: dbUser.full_name,
  company: dbUser.company,
  jobTitle: dbUser.job_title,
  phone: dbUser.phone,
  createdAt: dbUser.created_at,
  updatedAt: dbUser.updated_at,
});

const transformDbEvent = (dbEvent: DbEvent): Event => ({
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

const transformDbSpeaker = (dbSpeaker: DbSpeaker): Speaker => ({
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
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        full_name: userData.fullName,
        company: userData.company,
        job_title: userData.jobTitle,
        phone: userData.phone,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return transformDbUser(data);
  },

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get user: ${error.message}`);
    }
    
    return transformDbUser(data);
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get user: ${error.message}`);
    }
    
    return transformDbUser(data);
  },

  // Update user
  async update(id: string, updates: Partial<User>): Promise<User> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('users')
      .update({
        email: updates.email,
        full_name: updates.fullName,
        company: updates.company,
        job_title: updates.jobTitle,
        phone: updates.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return transformDbUser(data);
  },

  // Delete user
  async delete(id: string): Promise<void> {
    const supabase = createBrowserSupabaseClient();
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete user: ${error.message}`);
  },
};

// Event operations
export const eventService = {
  // Get all events
  async getAll(): Promise<Event[]> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw new Error(`Failed to get events: ${error.message}`);
    return data.map(transformDbEvent);
  },

  // Get event by ID
  async getById(id: string): Promise<Event | null> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get event: ${error.message}`);
    }
    
    return transformDbEvent(data);
  },

  // Create event
  async create(eventData: Omit<Event, 'id'>): Promise<Event> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        timezone: eventData.timezone,
        status: eventData.status,
        cover_image: eventData.coverImage,
        max_attendees: eventData.maxAttendees,
        current_attendees: eventData.currentAttendees || 0,
        tags: eventData.tags,
        organizer_name: eventData.organizer.name,
        organizer_email: eventData.organizer.email,
        organizer_avatar: eventData.organizer.avatar,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create event: ${error.message}`);
    return transformDbEvent(data);
  },

  // Update event
  async update(id: string, updates: Partial<Event>): Promise<Event> {
    const supabase = createBrowserSupabaseClient();
    
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.startDate) updateData.start_date = updates.startDate;
    if (updates.endDate) updateData.end_date = updates.endDate;
    if (updates.timezone) updateData.timezone = updates.timezone;
    if (updates.status) updateData.status = updates.status;
    if (updates.coverImage) updateData.cover_image = updates.coverImage;
    if (updates.maxAttendees) updateData.max_attendees = updates.maxAttendees;
    if (updates.currentAttendees !== undefined) updateData.current_attendees = updates.currentAttendees;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.organizer) {
      updateData.organizer_name = updates.organizer.name;
      updateData.organizer_email = updates.organizer.email;
      updateData.organizer_avatar = updates.organizer.avatar;
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update event: ${error.message}`);
    return transformDbEvent(data);
  },
};

// Speaker operations
export const speakerService = {
  // Get all speakers
  async getAll(): Promise<Speaker[]> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('speakers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to get speakers: ${error.message}`);
    return data.map(transformDbSpeaker);
  },

  // Get speaker by ID
  async getById(id: string): Promise<Speaker | null> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('speakers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get speaker: ${error.message}`);
    }
    
    return transformDbSpeaker(data);
  },

  // Create speaker
  async create(speakerData: Omit<Speaker, 'id'>): Promise<Speaker> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('speakers')
      .insert({
        name: speakerData.name,
        title: speakerData.title,
        company: speakerData.company,
        bio: speakerData.bio,
        avatar: speakerData.avatar,
        social_twitter: speakerData.social?.twitter,
        social_linkedin: speakerData.social?.linkedin,
        social_website: speakerData.social?.website,
        sessions: speakerData.sessions || [],
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create speaker: ${error.message}`);
    return transformDbSpeaker(data);
  },
};

// Registration operations
export const registrationService = {
  // Register user for event
  async create(userId: string, eventId: string, type: 'virtual' | 'in_person' = 'virtual'): Promise<void> {
    const supabase = createBrowserSupabaseClient();
    
    // Check if already registered
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single();

    if (existing) {
      throw new Error('User is already registered for this event');
    }

    const { error } = await supabase
      .from('registrations')
      .insert({
        user_id: userId,
        event_id: eventId,
        registration_type: type,
        status: 'confirmed',
      });

    if (error) throw new Error(`Failed to register for event: ${error.message}`);

    // Update event attendee count
    const { error: updateError } = await supabase.rpc('increment_attendees', {
      event_id: eventId,
    });

    if (updateError) {
      console.error('Failed to update attendee count:', updateError);
    }
  },

  // Get user registrations
  async getByUserId(userId: string): Promise<string[]> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('registrations')
      .select('event_id')
      .eq('user_id', userId)
      .eq('status', 'confirmed');

    if (error) throw new Error(`Failed to get registrations: ${error.message}`);
    return data.map(reg => reg.event_id);
  },

  // Cancel registration
  async cancel(userId: string, eventId: string): Promise<void> {
    const supabase = createBrowserSupabaseClient();
    
    const { error } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('event_id', eventId);

    if (error) throw new Error(`Failed to cancel registration: ${error.message}`);
  },
};

// Initialize sample data (for development)
export const initializeSampleData = async () => {
  try {
    // Check if data already exists
    const events = await eventService.getAll();
    if (events.length > 0) {
      console.log('Sample data already exists');
      return;
    }

    console.log('Initializing sample data...');
    
    // Create sample events (this would typically be done via admin interface)
    // For now, we'll keep using the existing sample data in the components
    
    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
  }
};