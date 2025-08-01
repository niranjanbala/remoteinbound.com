import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { supabaseServer } from './supabase-server';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user role to session
      if (session.user && user) {
        // Check if user is admin by email or role in database
        const { data: userData } = await supabaseServer
          .from('users')
          .select('role')
          .eq('email', session.user.email)
          .single();

        session.user.role = userData?.role || 'attendee';
        session.user.id = user.id;
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