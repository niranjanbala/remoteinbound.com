-- Migration: Add Inbound sessions support
-- Created: 2025-08-03

-- Add new columns to sessions table for Inbound data
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_level VARCHAR(50) DEFAULT 'OPEN TO ALL LEVELS';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reservation_required BOOLEAN DEFAULT FALSE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS sponsor_name VARCHAR(255);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS sponsor_logo TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS external_id VARCHAR(255);

-- Add new columns to speakers table for Inbound data
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS external_id VARCHAR(255);

-- Create inbound_session_tags table for better tag management
CREATE TABLE IF NOT EXISTS inbound_session_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_category VARCHAR(50), -- e.g., 'topic', 'technology', 'level'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inbound_session_speakers junction table for multiple speakers per session
CREATE TABLE IF NOT EXISTS inbound_session_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
    speaker_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, speaker_id)
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_inbound_session_tags_session_id ON inbound_session_tags(session_id);
CREATE INDEX IF NOT EXISTS idx_inbound_session_tags_tag_name ON inbound_session_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_inbound_session_speakers_session_id ON inbound_session_speakers(session_id);
CREATE INDEX IF NOT EXISTS idx_inbound_session_speakers_speaker_id ON inbound_session_speakers(speaker_id);
CREATE INDEX IF NOT EXISTS idx_sessions_external_id ON sessions(external_id);
CREATE INDEX IF NOT EXISTS idx_speakers_external_id ON speakers(external_id);

-- Add RLS policies for new tables
ALTER TABLE inbound_session_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound_session_speakers ENABLE ROW LEVEL SECURITY;

-- Tags and speaker associations are publicly readable
CREATE POLICY "Session tags are publicly readable" ON inbound_session_tags FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify session tags" ON inbound_session_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Session speakers are publicly readable" ON inbound_session_speakers FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify session speakers" ON inbound_session_speakers FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create a view for easy session data retrieval with speakers and tags
CREATE OR REPLACE VIEW session_details AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.start_time,
    s.end_time,
    s.session_level,
    s.reservation_required,
    s.sponsor_name,
    s.sponsor_logo,
    s.source_url,
    s.external_id,
    s.room,
    s.max_attendees,
    s.current_attendees,
    s.stream_url,
    s.recording_url,
    s.created_at,
    s.updated_at,
    -- Aggregate speakers
    COALESCE(
        json_agg(
            json_build_object(
                'id', sp.id,
                'name', sp.name,
                'title', sp.title,
                'company', sp.company,
                'avatar', sp.avatar,
                'profile_image', sp.profile_image
            ) ORDER BY iss.speaker_order
        ) FILTER (WHERE sp.id IS NOT NULL), 
        '[]'::json
    ) as speakers,
    -- Aggregate tags
    COALESCE(
        json_agg(
            json_build_object(
                'name', ist.tag_name,
                'category', ist.tag_category
            )
        ) FILTER (WHERE ist.tag_name IS NOT NULL),
        '[]'::json
    ) as tags
FROM sessions s
LEFT JOIN inbound_session_speakers iss ON s.id = iss.session_id
LEFT JOIN speakers sp ON iss.speaker_id = sp.id
LEFT JOIN inbound_session_tags ist ON s.id = ist.session_id
GROUP BY s.id, s.title, s.description, s.start_time, s.end_time, s.session_level, 
         s.reservation_required, s.sponsor_name, s.sponsor_logo, s.source_url, 
         s.external_id, s.room, s.max_attendees, s.current_attendees, 
         s.stream_url, s.recording_url, s.created_at, s.updated_at;

-- Grant access to the view
GRANT SELECT ON session_details TO public;