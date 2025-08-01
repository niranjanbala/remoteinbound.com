import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey
  });
  throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Service Key: ${!!supabaseServiceKey}`);
}

// Server-side client with service role key for admin operations
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);