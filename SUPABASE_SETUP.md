# 🗄️ Supabase Database Setup Guide

## Quick Setup Instructions

### 1. Access Your Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `tdcghhupwfoiwfwoqqrt`

### 2. Create Database Tables
1. In your Supabase dashboard, navigate to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql)
4. Paste it into the SQL Editor
5. Click **Run** to execute the SQL

### 3. Verify Setup
After running the SQL, you should see these tables in your **Table Editor**:
- ✅ `users` - User accounts and profiles
- ✅ `events` - Event information
- ✅ `speakers` - Speaker profiles
- ✅ `sessions` - Event sessions/talks
- ✅ `registrations` - User event registrations

## What the Schema Creates

### Tables
- **users**: Stores user account information
- **events**: Event details, dates, and organizer info
- **speakers**: Speaker profiles and social links
- **sessions**: Individual talks/sessions within events
- **registrations**: Links users to events they've registered for

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Policies** configured for secure data access
- **Indexes** for optimal query performance

### Functions
- **increment_attendees()**: Automatically updates event attendee counts

## Environment Variables ✅

Your `.env.local` is already configured with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tdcghhupwfoiwfwoqqrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testing the Setup

Once you've run the SQL schema:

1. **Test Registration**: Go to `/register` and create a test account
2. **Check Database**: Verify the user appears in your Supabase `users` table
3. **Test Application**: All database operations should work seamlessly

## Troubleshooting

### If tables don't appear:
1. Refresh your Supabase dashboard
2. Check the SQL Editor for any error messages
3. Ensure you copied the entire schema file

### If registration fails:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Confirm tables exist in Supabase

## Next Steps

After setting up the database:
1. ✅ Test user registration functionality
2. ✅ Add sample events and speakers (optional)
3. ✅ Build additional features like dashboard
4. ✅ Deploy to production

---

**Need Help?** Check the detailed setup in [`DATABASE_SETUP.md`](./DATABASE_SETUP.md)