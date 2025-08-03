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

-- Add comment to document the purpose of this table
COMMENT ON TABLE remote_speakers IS 'Clone of speakers table for remote speaker management in Inbound 2025. Allows separate management of remote speakers while preserving original speaker data.';