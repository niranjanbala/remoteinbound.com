# Implementation Guide: Speaker Replacement System

## Quick Start Implementation

This guide provides step-by-step instructions to implement the speaker replacement system for transforming Inbound 2024 sessions into Inbound 2025 with new speakers.

## Phase 1: Database Schema Updates

### 1.1 Create Migration File
Create `supabase/migrations/20250803_session_claims.sql`:

```sql
-- Migration: Add session claim tracking for Inbound 2025
-- Created: 2025-08-03

-- Create session_claims table
CREATE TABLE IF NOT EXISTS session_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    original_speaker_ids TEXT[], -- Store original speakers for reference
    new_speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
    claim_status VARCHAR(20) DEFAULT 'available' CHECK (claim_status IN ('available', 'claimed', 'confirmed', 'completed')),
    youtube_stream_url TEXT,
    youtube_video_id VARCHAR(50),
    claimed_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id)
);

-- Create speaker_applications table
CREATE TABLE IF NOT EXISTS speaker_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    avatar TEXT,
    social_linkedin TEXT,
    social_twitter TEXT,
    social_website TEXT,
    youtube_channel TEXT,
    experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
    preferred_topics TEXT[],
    availability_notes TEXT,
    application_status VARCHAR(20) DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS event_year INTEGER DEFAULT 2024;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS claim_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS youtube_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS original_session_id UUID;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_session_claims_session_id ON session_claims(session_id);
CREATE INDEX IF NOT EXISTS idx_session_claims_status ON session_claims(claim_status);
CREATE INDEX IF NOT EXISTS idx_session_claims_speaker ON session_claims(new_speaker_id);
CREATE INDEX IF NOT EXISTS idx_speaker_applications_status ON speaker_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_sessions_event_year ON sessions(event_year);
CREATE INDEX IF NOT EXISTS idx_sessions_is_claimed ON sessions(is_claimed);

-- Create session claims overview view
CREATE OR REPLACE VIEW session_claims_overview AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.start_time,
    s.end_time,
    s.tags,
    s.event_year,
    s.is_claimed,
    sc.claim_status,
    sc.youtube_stream_url,
    sc.youtube_video_id,
    sp.name as new_speaker_name,
    sp.company as new_speaker_company,
    sp.avatar as new_speaker_avatar,
    sc.claimed_at,
    sc.confirmed_at,
    sc.notes
FROM sessions s
LEFT JOIN session_claims sc ON s.id = sc.session_id
LEFT JOIN speakers sp ON sc.new_speaker_id = sp.id;

-- Add RLS policies
ALTER TABLE session_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_applications ENABLE ROW LEVEL SECURITY;

-- Session claims are publicly readable, only admins can modify
CREATE POLICY "Session claims are publicly readable" ON session_claims FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify session claims" ON session_claims FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Speaker applications - users can view their own, admins can view all
CREATE POLICY "Users can view own applications" ON speaker_applications FOR SELECT USING (
    auth.uid()::text = email OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create applications" ON speaker_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can modify applications" ON speaker_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Grant access to the view
GRANT SELECT ON session_claims_overview TO public;
```

### 1.2 Initialize Session Claims
Create script `scripts/initialize-session-claims.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function initializeSessionClaims() {
  console.log('🚀 Initializing session claims for Inbound 2025...');
  
  try {
    // Get all existing sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id, speaker_ids');
    
    if (sessionsError) throw sessionsError;
    
    console.log(`📊 Found ${sessions.length} sessions to initialize`);
    
    // Create claim records for each session
    const claimRecords = sessions.map(session => ({
      session_id: session.id,
      original_speaker_ids: session.speaker_ids || [],
      claim_status: 'available'
    }));
    
    const { data: claims, error: claimsError } = await supabase
      .from('session_claims')
      .insert(claimRecords)
      .select();
    
    if (claimsError) throw claimsError;
    
    // Update sessions to mark them as 2025 and unclaimed
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        event_year: 2025,
        is_claimed: false,
        youtube_enabled: true,
        claim_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
      .in('id', sessions.map(s => s.id));
    
    if (updateError) throw updateError;
    
    console.log(`✅ Successfully initialized ${claims.length} session claims`);
    console.log('🎯 All sessions are now available for claiming by new speakers');
    
  } catch (error) {
    console.error('❌ Error initializing session claims:', error);
    process.exit(1);
  }
}

initializeSessionClaims();
```

## Phase 2: API Endpoints

### 2.1 Session Claims API
Create `src/app/api/sessions/claims/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/sessions/claims - Get available sessions for claiming
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';
    const userId = searchParams.get('userId');
    
    let query = supabaseServer
      .from('session_claims_overview')
      .select('*')
      .eq('event_year', 2025);
    
    if (status !== 'all') {
      query = query.eq('claim_status', status);
    }
    
    if (userId) {
      query = query.eq('new_speaker_id', userId);
    }
    
    const { data: sessions, error } = await query.order('start_time', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json({
      sessions: sessions || [],
      total: sessions?.length || 0
    });
    
  } catch (error: any) {
    console.error('Error fetching session claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session claims' },
      { status: 500 }
    );
  }
}
```

### 2.2 Individual Session Claim API
Create `src/app/api/sessions/[id]/claim/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/sessions/[id]/claim - Claim a session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { speakerId, notes } = await request.json();
    const sessionId = params.id;
    
    // Check if session is available
    const { data: existingClaim, error: checkError } = await supabaseServer
      .from('session_claims')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    
    if (existingClaim && existingClaim.claim_status !== 'available') {
      return NextResponse.json(
        { error: 'Session is already claimed' },
        { status: 409 }
      );
    }
    
    // Update or create claim
    const claimData = {
      session_id: sessionId,
      new_speaker_id: speakerId,
      claim_status: 'claimed',
      claimed_at: new Date().toISOString(),
      notes: notes || null
    };
    
    const { data: claim, error: claimError } = await supabaseServer
      .from('session_claims')
      .upsert(claimData)
      .select()
      .single();
    
    if (claimError) throw claimError;
    
    // Update session status
    await supabaseServer
      .from('sessions')
      .update({ is_claimed: true })
      .eq('id', sessionId);
    
    return NextResponse.json({ claim });
    
  } catch (error: any) {
    console.error('Error claiming session:', error);
    return NextResponse.json(
      { error: 'Failed to claim session' },
      { status: 500 }
    );
  }
}

// PUT /api/sessions/[id]/claim - Update claim details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const sessionId = params.id;
    
    const { data: claim, error } = await supabaseServer
      .from('session_claims')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ claim });
    
  } catch (error: any) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { error: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id]/claim - Release a claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    
    // Reset claim to available
    const { error: claimError } = await supabaseServer
      .from('session_claims')
      .update({
        new_speaker_id: null,
        claim_status: 'available',
        claimed_at: null,
        youtube_stream_url: null,
        youtube_video_id: null,
        notes: null
      })
      .eq('session_id', sessionId);
    
    if (claimError) throw claimError;
    
    // Update session status
    await supabaseServer
      .from('sessions')
      .update({ is_claimed: false })
      .eq('id', sessionId);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error releasing claim:', error);
    return NextResponse.json(
      { error: 'Failed to release claim' },
      { status: 500 }
    );
  }
}
```

### 2.3 Speaker Applications API
Create `src/app/api/speakers/applications/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/speakers/applications - Submit speaker application
export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();
    
    // Check if application already exists
    const { data: existing } = await supabaseServer
      .from('speaker_applications')
      .select('id')
      .eq('email', applicationData.email)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Application already exists for this email' },
        { status: 409 }
      );
    }
    
    const { data: application, error } = await supabaseServer
      .from('speaker_applications')
      .insert({
        ...applicationData,
        applied_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ application });
    
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// GET /api/speakers/applications - List applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = supabaseServer
      .from('speaker_applications')
      .select('*')
      .order('applied_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('application_status', status);
    }
    
    const { data: applications, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      applications: applications || [],
      total: applications?.length || 0
    });
    
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
```

## Phase 3: Frontend Components

### 3.1 Available Sessions Component
Create `src/components/AvailableSessions.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { sessionService } from '@/lib/api-client';

interface Session {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  tags: string[];
  claim_status: string;
  new_speaker_name?: string;
}

export function AvailableSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sessions/claims?status=${filter}`);
      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimSession = async (sessionId: string, speakerId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakerId })
      });
      
      if (response.ok) {
        loadSessions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error claiming session:', error);
    }
  };

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setFilter('available')}
          className={`px-4 py-2 rounded ${filter === 'available' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Available ({sessions.filter(s => s.claim_status === 'available').length})
        </button>
        <button
          onClick={() => setFilter('claimed')}
          className={`px-4 py-2 rounded ${filter === 'claimed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Claimed ({sessions.filter(s => s.claim_status === 'claimed').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Sessions ({sessions.length})
        </button>
      </div>

      <div className="grid gap-4">
        {sessions.map(session => (
          <div key={session.id} className="border rounded-lg p-6 bg-white shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
                <p className="text-gray-600 mb-4">{session.description}</p>
                
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>📅 {new Date(session.start_time).toLocaleDateString()}</span>
                  <span>🕒 {new Date(session.start_time).toLocaleTimeString()}</span>
                </div>
                
                {session.tags && session.tags.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {session.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                {session.claim_status === 'available' ? (
                  <button
                    onClick={() => claimSession(session.id, 'current-user-id')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Claim Session
                  </button>
                ) : (
                  <div className="text-center">
                    <div className={`px-3 py-1 rounded text-sm ${
                      session.claim_status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                      session.claim_status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {session.claim_status.charAt(0).toUpperCase() + session.claim_status.slice(1)}
                    </div>
                    {session.new_speaker_name && (
                      <div className="text-sm text-gray-600 mt-1">
                        by {session.new_speaker_name}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Phase 4: Deployment Steps

### 4.1 Database Migration
```bash
# Run the migration
npm run supabase:migrate

# Initialize session claims
node scripts/initialize-session-claims.js
```

### 4.2 Environment Variables
Add to `.env.local`:
```
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
```

### 4.3 Package.json Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "init-claims": "node scripts/initialize-session-claims.js",
    "migrate-sessions": "node scripts/migrate-2024-to-2025.js"
  }
}
```

## Next Steps

1. **Run Database Migration**: Apply the schema changes
2. **Initialize Claims**: Set up all existing sessions for claiming
3. **Deploy API Endpoints**: Add the new API routes
4. **Build Frontend**: Create the session claiming interface
5. **Test System**: Verify the complete workflow
6. **Launch**: Open for speaker applications and session claiming

This implementation provides a complete foundation for the speaker replacement system while maintaining all existing functionality.