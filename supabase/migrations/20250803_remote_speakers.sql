-- Create remote_speakers table as a clone of the speakers table
-- This table will store remote speakers for Inbound 2025

-- Create remote_speakers table with the same structure as speakers
CREATE TABLE IF NOT EXISTS remote_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    avatar TEXT,
    social_twitter TEXT,
    social_linkedin TEXT,
    social_website TEXT,
    sessions TEXT[] DEFAULT '{}',
    -- Additional columns from inbound_sessions_schema.sql
    profile_image TEXT,
    external_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for remote_speakers table
CREATE INDEX IF NOT EXISTS idx_remote_speakers_external_id ON remote_speakers(external_id);
CREATE INDEX IF NOT EXISTS idx_remote_speakers_name ON remote_speakers(name);
CREATE INDEX IF NOT EXISTS idx_remote_speakers_company ON remote_speakers(company);

-- Create updated_at trigger for remote_speakers
CREATE TRIGGER update_remote_speakers_updated_at 
    BEFORE UPDATE ON remote_speakers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for remote_speakers
ALTER TABLE remote_speakers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for remote_speakers (same as speakers table)
-- Remote speakers are publicly readable
CREATE POLICY "Remote speakers are publicly readable" 
    ON remote_speakers FOR SELECT TO public USING (true);

-- Only admins can modify remote speakers
CREATE POLICY "Only admins can modify remote speakers" 
    ON remote_speakers FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Copy all existing speakers data to remote_speakers table
-- This preserves the original speakers while creating a separate table for remote operations
INSERT INTO remote_speakers (
    name, title, company, bio, avatar, 
    social_twitter, social_linkedin, social_website, sessions,
    profile_image, external_id, created_at, updated_at
)
SELECT 
    s.name, s.title, s.company, s.bio, s.avatar,
    s.social_twitter, s.social_linkedin, s.social_website, s.sessions,
    s.profile_image, s.external_id, s.created_at, s.updated_at
FROM speakers s
ON CONFLICT (id) DO NOTHING;

-- Create a view for easy querying of remote speakers with session details
CREATE OR REPLACE VIEW remote_speaker_details AS
SELECT 
    rs.id,
    rs.name,
    rs.title,
    rs.company,
    rs.bio,
    rs.avatar,
    rs.profile_image,
    rs.social_twitter,
    rs.social_linkedin,
    rs.social_website,
    rs.external_id,
    rs.sessions,
    rs.created_at,
    rs.updated_at,
    -- Count of sessions for this remote speaker
    (
        SELECT COUNT(*)
        FROM inbound_session_speakers iss
        WHERE iss.speaker_id = rs.id
    ) as session_count,
    -- Array of session titles for this remote speaker
    COALESCE(
        (
            SELECT array_agg(s.title)
            FROM inbound_session_speakers iss
            JOIN sessions s ON iss.session_id = s.id
            WHERE iss.speaker_id = rs.id
        ),
        '{}'::text[]
    ) as session_titles
FROM remote_speakers rs;

-- Grant access to the remote speaker details view
GRANT SELECT ON remote_speaker_details TO public;

-- Create a function to sync speakers to remote_speakers
CREATE OR REPLACE FUNCTION sync_speaker_to_remote(speaker_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO remote_speakers (
        id, name, title, company, bio, avatar,
        social_twitter, social_linkedin, social_website, sessions,
        profile_image, external_id, created_at, updated_at
    )
    SELECT 
        s.id, s.name, s.title, s.company, s.bio, s.avatar,
        s.social_twitter, s.social_linkedin, s.social_website, s.sessions,
        s.profile_image, s.external_id, s.created_at, s.updated_at
    FROM speakers s
    WHERE s.id = speaker_uuid
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        bio = EXCLUDED.bio,
        avatar = EXCLUDED.avatar,
        social_twitter = EXCLUDED.social_twitter,
        social_linkedin = EXCLUDED.social_linkedin,
        social_website = EXCLUDED.social_website,
        sessions = EXCLUDED.sessions,
        profile_image = EXCLUDED.profile_image,
        external_id = EXCLUDED.external_id,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to sync all speakers to remote_speakers
CREATE OR REPLACE FUNCTION sync_all_speakers_to_remote()
RETURNS INTEGER AS $$
DECLARE
    sync_count INTEGER;
BEGIN
    INSERT INTO remote_speakers (
        id, name, title, company, bio, avatar,
        social_twitter, social_linkedin, social_website, sessions,
        profile_image, external_id, created_at, updated_at
    )
    SELECT 
        s.id, s.name, s.title, s.company, s.bio, s.avatar,
        s.social_twitter, s.social_linkedin, s.social_website, s.sessions,
        s.profile_image, s.external_id, s.created_at, s.updated_at
    FROM speakers s
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        bio = EXCLUDED.bio,
        avatar = EXCLUDED.avatar,
        social_twitter = EXCLUDED.social_twitter,
        social_linkedin = EXCLUDED.social_linkedin,
        social_website = EXCLUDED.social_website,
        sessions = EXCLUDED.sessions,
        profile_image = EXCLUDED.profile_image,
        external_id = EXCLUDED.external_id,
        updated_at = NOW();
    
    GET DIAGNOSTICS sync_count = ROW_COUNT;
    RETURN sync_count;
END;
$$ LANGUAGE plpgsql;

-- Create remote_session_speakers junction table for linking sessions with remote speakers
CREATE TABLE IF NOT EXISTS remote_session_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    remote_speaker_id UUID REFERENCES remote_speakers(id) ON DELETE CASCADE,
    speaker_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, remote_speaker_id)
);

-- Create indexes for remote_session_speakers table
CREATE INDEX IF NOT EXISTS idx_remote_session_speakers_session_id ON remote_session_speakers(session_id);
CREATE INDEX IF NOT EXISTS idx_remote_session_speakers_remote_speaker_id ON remote_session_speakers(remote_speaker_id);

-- Enable Row Level Security for remote_session_speakers
ALTER TABLE remote_session_speakers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for remote_session_speakers
CREATE POLICY "Remote session speakers are publicly readable"
    ON remote_session_speakers FOR SELECT TO public USING (true);

CREATE POLICY "Only admins can modify remote session speakers"
    ON remote_session_speakers FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Update the remote_speaker_details view to use the junction table
DROP VIEW IF EXISTS remote_speaker_details;
CREATE OR REPLACE VIEW remote_speaker_details AS
SELECT
    rs.id,
    rs.name,
    rs.title,
    rs.company,
    rs.bio,
    rs.avatar,
    rs.profile_image,
    rs.social_twitter,
    rs.social_linkedin,
    rs.social_website,
    rs.external_id,
    rs.sessions,
    rs.created_at,
    rs.updated_at,
    -- Count of sessions for this remote speaker
    (
        SELECT COUNT(*)
        FROM remote_session_speakers rss
        WHERE rss.remote_speaker_id = rs.id
    ) as session_count,
    -- Array of session titles for this remote speaker
    COALESCE(
        (
            SELECT array_agg(s.title ORDER BY rss.speaker_order)
            FROM remote_session_speakers rss
            JOIN sessions s ON rss.session_id = s.id
            WHERE rss.remote_speaker_id = rs.id
        ),
        '{}'::text[]
    ) as session_titles,
    -- Array of session IDs for this remote speaker
    COALESCE(
        (
            SELECT array_agg(s.id ORDER BY rss.speaker_order)
            FROM remote_session_speakers rss
            JOIN sessions s ON rss.session_id = s.id
            WHERE rss.remote_speaker_id = rs.id
        ),
        '{}'::uuid[]
    ) as session_ids
FROM remote_speakers rs;

-- Create a view for sessions with remote speakers
CREATE OR REPLACE VIEW remote_session_details AS
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
    -- Aggregate remote speakers
    COALESCE(
        json_agg(
            json_build_object(
                'id', rs.id,
                'name', rs.name,
                'title', rs.title,
                'company', rs.company,
                'avatar', rs.avatar,
                'profile_image', rs.profile_image,
                'social_twitter', rs.social_twitter,
                'social_linkedin', rs.social_linkedin,
                'social_website', rs.social_website
            ) ORDER BY rss.speaker_order
        ) FILTER (WHERE rs.id IS NOT NULL),
        '[]'::json
    ) as remote_speakers,
    -- Count of remote speakers for this session
    (
        SELECT COUNT(*)
        FROM remote_session_speakers rss2
        WHERE rss2.session_id = s.id
    ) as remote_speaker_count
FROM sessions s
LEFT JOIN remote_session_speakers rss ON s.id = rss.session_id
LEFT JOIN remote_speakers rs ON rss.remote_speaker_id = rs.id
GROUP BY s.id, s.title, s.description, s.start_time, s.end_time, s.session_level,
         s.reservation_required, s.sponsor_name, s.sponsor_logo, s.source_url,
         s.external_id, s.room, s.max_attendees, s.current_attendees,
         s.stream_url, s.recording_url, s.created_at, s.updated_at;

-- Grant access to the new views
GRANT SELECT ON remote_speaker_details TO public;
GRANT SELECT ON remote_session_details TO public;

-- Function to assign remote speaker to session
CREATE OR REPLACE FUNCTION assign_remote_speaker_to_session(
    p_session_id UUID,
    p_remote_speaker_id UUID,
    p_speaker_order INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO remote_session_speakers (session_id, remote_speaker_id, speaker_order)
    VALUES (p_session_id, p_remote_speaker_id, p_speaker_order)
    ON CONFLICT (session_id, remote_speaker_id)
    DO UPDATE SET speaker_order = EXCLUDED.speaker_order;
END;
$$ LANGUAGE plpgsql;

-- Function to remove remote speaker from session
CREATE OR REPLACE FUNCTION remove_remote_speaker_from_session(
    p_session_id UUID,
    p_remote_speaker_id UUID
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM remote_session_speakers
    WHERE session_id = p_session_id AND remote_speaker_id = p_remote_speaker_id;
END;
$$ LANGUAGE plpgsql;

-- Function to sync session speakers to remote session speakers
CREATE OR REPLACE FUNCTION sync_session_speakers_to_remote(p_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
    sync_count INTEGER := 0;
    speaker_record RECORD;
BEGIN
    -- First, ensure all speakers exist in remote_speakers
    PERFORM sync_all_speakers_to_remote();
    
    -- Clear existing remote session speakers for this session
    DELETE FROM remote_session_speakers WHERE session_id = p_session_id;
    
    -- Insert remote session speakers based on inbound_session_speakers
    INSERT INTO remote_session_speakers (session_id, remote_speaker_id, speaker_order)
    SELECT
        iss.session_id,
        iss.speaker_id, -- This will be the same ID in remote_speakers
        iss.speaker_order
    FROM inbound_session_speakers iss
    WHERE iss.session_id = p_session_id
    AND EXISTS (SELECT 1 FROM remote_speakers rs WHERE rs.id = iss.speaker_id);
    
    GET DIAGNOSTICS sync_count = ROW_COUNT;
    RETURN sync_count;
END;
$$ LANGUAGE plpgsql;

-- Function to sync all session speakers to remote
CREATE OR REPLACE FUNCTION sync_all_session_speakers_to_remote()
RETURNS INTEGER AS $$
DECLARE
    total_sync_count INTEGER := 0;
    session_record RECORD;
    session_sync_count INTEGER;
BEGIN
    -- Sync all speakers first
    PERFORM sync_all_speakers_to_remote();
    
    -- Clear all existing remote session speakers
    DELETE FROM remote_session_speakers;
    
    -- Sync each session's speakers
    FOR session_record IN
        SELECT DISTINCT session_id FROM inbound_session_speakers
    LOOP
        SELECT sync_session_speakers_to_remote(session_record.session_id) INTO session_sync_count;
        total_sync_count := total_sync_count + session_sync_count;
    END LOOP;
    
    RETURN total_sync_count;
END;
$$ LANGUAGE plpgsql;

-- Add comments to document the purpose of these tables
COMMENT ON TABLE remote_speakers IS 'Clone of speakers table for remote speaker management in Inbound 2025. Allows separate management of remote speakers while preserving original speaker data.';
COMMENT ON TABLE remote_session_speakers IS 'Junction table linking sessions with remote_speakers, similar to inbound_session_speakers but for remote speaker management.';