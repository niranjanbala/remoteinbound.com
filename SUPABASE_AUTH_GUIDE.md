# Supabase Authentication & Database Setup Guide

## 🔐 Authentication Options for Database Setup

### **Option 1: Supabase Dashboard (Recommended - Easiest)**

1. **Go to your Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Login with your account
   - Select your project: `tdcghhupwfoiwfwoqqrt`

2. **Navigate to SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the SQL**:
   - Open [`COPY_THIS_SQL.sql`](COPY_THIS_SQL.sql) from this project
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify Tables Created**:
   - Go to "Table Editor" in the sidebar
   - You should see all tables: `users`, `events`, `speakers`, `sessions`, `registrations`, etc.

---

### **Option 2: Supabase CLI Authentication**

If you want to use the CLI, you need to authenticate first:

```bash
# Login to Supabase CLI
supabase login

# This will open a browser window for authentication
# After login, link your project
supabase link --project-ref tdcghhupwfoiwfwoqqrt

# Execute the SQL file
supabase db reset --linked
```

**Note**: CLI requires you to be the project owner or have admin access.

---

### **Option 3: Manual Table Creation (Step by Step)**

If you prefer to create tables manually through the dashboard:

#### **Step 1: Create Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    job_title VARCHAR(255),
    phone VARCHAR(50),
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'attendee' CHECK (role IN ('attendee', 'speaker', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Step 2: Create Events Table**
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended')),
    cover_image TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    organizer_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Step 3: Create Other Tables**
Continue with the remaining tables from [`COPY_THIS_SQL.sql`](COPY_THIS_SQL.sql).

---

### **Option 4: Using Database URL (Advanced)**

If you have the direct PostgreSQL connection string:

```bash
# Install PostgreSQL client
brew install postgresql  # macOS
# or
sudo apt-get install postgresql-client  # Ubuntu

# Connect directly to database
psql "your_postgresql_connection_string_here"

# Then paste the SQL commands
\i COPY_THIS_SQL.sql
```

---

## 🚀 **Recommended Approach: Supabase Dashboard**

**The easiest and most reliable method is using the Supabase Dashboard:**

### **Quick Steps:**
1. **Login**: Go to https://supabase.com/dashboard
2. **Select Project**: Click on your project `tdcghhupwfoiwfwoqqrt`
3. **SQL Editor**: Click "SQL Editor" → "New Query"
4. **Copy SQL**: Copy all contents from [`COPY_THIS_SQL.sql`](COPY_THIS_SQL.sql)
5. **Paste & Run**: Paste in editor and click "Run"
6. **Verify**: Check "Table Editor" to see your tables

### **What Gets Created:**
- ✅ **8 Tables**: users, events, speakers, sessions, registrations, session_attendees, chat_messages, networking_connections, notifications
- ✅ **Indexes**: For better query performance
- ✅ **Triggers**: Auto-update timestamps
- ✅ **Functions**: Helper functions for attendee counting
- ✅ **Row Level Security**: Proper access controls
- ✅ **Policies**: Security policies for each table

---

## 🔍 **Verification Steps**

After running the SQL, verify everything is set up correctly:

### **1. Check Tables in Dashboard**
- Go to "Table Editor"
- Verify all 9 tables are present
- Check that each table has the correct columns

### **2. Test Registration**
- Go to: http://localhost:3000/register
- Create a test account
- Check if the user appears in the `users` table

### **3. Run Verification Script**
```bash
node scripts/verify-database.js
```

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **"Permission Denied" Errors**
- Make sure you're logged into the correct Supabase account
- Verify you have admin access to the project
- Try using the dashboard method instead of CLI

#### **"Function does not exist" Errors**
- Make sure to enable the UUID extension first
- Run the SQL in the correct order (don't skip lines)

#### **"Table already exists" Errors**
- This is normal if you're re-running the script
- The `IF NOT EXISTS` clauses will handle this

#### **RLS Policy Errors**
- Row Level Security policies are normal
- They protect your data and are working correctly

---

## 📋 **Next Steps After Database Setup**

Once your database is set up:

1. **Test Registration**: Try creating an account at `/register`
2. **Test Admin Panel**: Login at `/admin` (create admin user first)
3. **Add Sample Data**: Use the admin panel to add events and speakers
4. **Test Dashboard**: Check the user dashboard at `/dashboard`

---

## 🔑 **Your Current Credentials**

From your `.env.local` file:
- **Project URL**: `https://tdcghhupwfoiwfwoqqrt.supabase.co`
- **Project ID**: `tdcghhupwfoiwfwoqqrt`
- **Anon Key**: Available in your `.env.local`
- **Service Role Key**: Available in your `.env.local`

**Security Note**: Never share your service role key publicly!

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the Supabase dashboard for error messages
2. Verify your project credentials in `.env.local`
3. Try the manual table creation approach
4. Check the browser console for any JavaScript errors

The database setup is crucial for the full functionality of your Remote Inbound event platform!