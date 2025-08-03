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
    s.room,
    s.max_attendees,
    sc.claim_status,
    sc.youtube_stream_url,
    sc.youtube_video_id,
    sp.name as new_speaker_name,
    sp.company as new_speaker_company,
    sp.avatar as new_speaker_avatar,
    sp.bio as new_speaker_bio,
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

-- Create updated_at trigger for new tables
CREATE TRIGGER update_session_claims_updated_at BEFORE UPDATE ON session_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_speaker_applications_updated_at BEFORE UPDATE ON speaker_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();