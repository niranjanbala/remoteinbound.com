import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseServiceKey;

// Create a function to get the server client (lazy initialization)
export const getSupabaseServer = () => {
  if (!isSupabaseConfigured) {
    console.error('Missing Supabase environment variables:', {
      url: !!supabaseUrl,
      serviceKey: !!supabaseServiceKey
    });
    throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Service Key: ${!!supabaseServiceKey}`);
  }

  return createClient<Database>(
    supabaseUrl!,
    supabaseServiceKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Legacy export for backward compatibility (will throw at runtime if not configured)
export const supabaseServer = isSupabaseConfigured ? getSupabaseServer() : null;

// Export configuration status
export { isSupabaseConfigured };