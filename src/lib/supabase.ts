import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseAnonKey !== 'your_supabase_anon_key';

// Browser client for client-side operations
export const createBrowserSupabaseClient = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Simple client for basic operations
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Export configuration status
export { isSupabaseConfigured };

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          company?: string;
          job_title?: string;
          phone?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          company?: string;
          job_title?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          company?: string;
          job_title?: string;
          phone?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          timezone: string;
          status: 'upcoming' | 'live' | 'ended';
          cover_image?: string;
          max_attendees?: number;
          current_attendees: number;
          tags: string[];
          organizer_name: string;
          organizer_email: string;
          organizer_avatar?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          timezone: string;
          status?: 'upcoming' | 'live' | 'ended';
          cover_image?: string;
          max_attendees?: number;
          current_attendees?: number;
          tags?: string[];
          organizer_name: string;
          organizer_email: string;
          organizer_avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          timezone?: string;
          status?: 'upcoming' | 'live' | 'ended';
          cover_image?: string;
          max_attendees?: number;
          current_attendees?: number;
          tags?: string[];
          organizer_name?: string;
          organizer_email?: string;
          organizer_avatar?: string;
          updated_at?: string;
        };
      };
      speakers: {
        Row: {
          id: string;
          name: string;
          title: string;
          company: string;
          bio: string;
          avatar?: string;
          social_twitter?: string;
          social_linkedin?: string;
          social_website?: string;
          sessions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title: string;
          company: string;
          bio: string;
          avatar?: string;
          social_twitter?: string;
          social_linkedin?: string;
          social_website?: string;
          sessions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          company?: string;
          bio?: string;
          avatar?: string;
          social_twitter?: string;
          social_linkedin?: string;
          social_website?: string;
          sessions?: string[];
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_time: string;
          end_time: string;
          speaker_ids: string[];
          event_id: string;
          room?: string;
          max_attendees?: number;
          current_attendees: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          start_time: string;
          end_time: string;
          speaker_ids?: string[];
          event_id: string;
          room?: string;
          max_attendees?: number;
          current_attendees?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_time?: string;
          end_time?: string;
          speaker_ids?: string[];
          event_id?: string;
          room?: string;
          max_attendees?: number;
          current_attendees?: number;
          tags?: string[];
          updated_at?: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          registration_type: 'virtual' | 'in_person';
          status: 'confirmed' | 'pending' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          registration_type?: 'virtual' | 'in_person';
          status?: 'confirmed' | 'pending' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          registration_type?: 'virtual' | 'in_person';
          status?: 'confirmed' | 'pending' | 'cancelled';
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};