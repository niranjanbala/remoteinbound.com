import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client-side operations
export const createBrowserSupabaseClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client for server-side operations
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// Simple client for basic operations (fallback)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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