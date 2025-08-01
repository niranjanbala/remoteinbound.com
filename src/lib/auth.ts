import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { getSupabaseServer, isSupabaseConfigured } from './supabase-server';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
        process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret'
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []
    ),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user role to session
      if (session.user && user && isSupabaseConfigured) {
        try {
          // Check if user is admin by email or role in database
          const supabaseServer = getSupabaseServer();
          const { data: userData } = await supabaseServer
            .from('users')
            .select('role')
            .eq('email', session.user.email)
            .single();

          session.user.role = userData?.role || 'attendee';
          session.user.id = user.id;
        } catch (error) {
          console.warn('Failed to fetch user role from database:', error);
          session.user.role = 'attendee';
          session.user.id = user.id;
        }
      } else {
        // Fallback when Supabase is not configured
        if (session.user && user) {
          session.user.role = 'attendee';
          session.user.id = user.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
});