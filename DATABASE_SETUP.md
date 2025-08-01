# Database Setup Guide

This guide will help you set up the Supabase database for the RemoteInbound event platform.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `remoteinbound-com`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"

## Step 2: Set Up Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Project API Key** (anon/public key)
   - **Service Role Key** (keep this secret!)

3. Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

## Step 3: Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` and paste it into the editor
4. Click "Run" to execute the schema

This will create all the necessary tables, indexes, and sample data.

## Step 4: Configure Row Level Security (RLS)

The schema automatically sets up Row Level Security policies, but you can review them in:
- **Authentication** → **Policies**

## Step 5: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Try registering a new user at `http://localhost:3000/register`
3. Check your Supabase dashboard under **Table Editor** → **users** to see if the user was created

## Database Schema Overview

### Core Tables

- **users**: User profiles and authentication data
- **events**: Event information and details
- **speakers**: Speaker profiles and information
- **sessions**: Individual sessions within events
- **registrations**: User event registrations
- **session_attendees**: Track session attendance
- **chat_messages**: Real-time chat messages
- **networking_connections**: User networking connections
- **notifications**: User notifications

### Key Features

- **UUID Primary Keys**: All tables use UUID for better security and scalability
- **Timestamps**: Automatic created_at and updated_at timestamps
- **Row Level Security**: Secure access control for all tables
- **Indexes**: Optimized for common query patterns
- **Sample Data**: Pre-populated with sample events and speakers

## API Usage Examples

### Create a User
```typescript
import { userService } from '@/lib/database';

const newUser = await userService.create({
  email: 'user@example.com',
  fullName: 'John Doe',
  company: 'Example Corp',
  jobTitle: 'Developer'
});
```

### Get All Events
```typescript
import { eventService } from '@/lib/database';

const events = await eventService.getAll();
```

### Register for Event
```typescript
import { registrationService } from '@/lib/database';

await registrationService.create(userId, eventId, 'virtual');
```

## Migration from Local Storage

The application currently uses local storage for data persistence. To migrate to Supabase:

1. Update components to use the database services instead of local storage
2. Replace `userStorage`, `eventStorage`, etc. with `userService`, `eventService`, etc.
3. Handle async operations with proper loading states
4. Add error handling for database operations

## Backup and Maintenance

- **Automatic Backups**: Supabase provides automatic daily backups
- **Manual Backup**: Use the Supabase CLI or dashboard to create manual backups
- **Monitoring**: Monitor database performance in the Supabase dashboard

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Service Role Key**: Only use the service role key on the server side
3. **RLS Policies**: Review and test all Row Level Security policies
4. **API Keys**: Rotate API keys regularly
5. **Database Access**: Limit database access to necessary operations only

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check your environment variables and network connection
2. **Permission Denied**: Verify RLS policies and user authentication
3. **Schema Errors**: Ensure the schema was applied correctly
4. **Performance Issues**: Check indexes and query optimization

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

After setting up the database:

1. Update the registration form to use `userService.create()`
2. Update event pages to use `eventService.getAll()`
3. Implement real-time features with Supabase subscriptions
4. Add authentication with Supabase Auth
5. Deploy to production with proper environment variables