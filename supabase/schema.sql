-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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

-- Create events table
CREATE TABLE IF NOT EXISTS events (
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

-- Create speakers table
CREATE TABLE IF NOT EXISTS speakers (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    speaker_ids TEXT[] DEFAULT '{}',
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room VARCHAR(100),
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    stream_url TEXT,
    recording_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    registration_type VARCHAR(20) DEFAULT 'virtual' CHECK (registration_type IN ('virtual', 'in_person')),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Create session_attendees table (for tracking session attendance)
CREATE TABLE IF NOT EXISTS session_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, session_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'message' CHECK (message_type IN ('message', 'question', 'announcement')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create networking_connections table
CREATE TABLE IF NOT EXISTS networking_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id1 UUID REFERENCES users(id) ON DELETE CASCADE,
    user_id2 UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id1, user_id2),
    CHECK (user_id1 != user_id2)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'success', 'error')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_speakers_updated_at BEFORE UPDATE ON speakers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_networking_connections_updated_at BEFORE UPDATE ON networking_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment event attendees
CREATE OR REPLACE FUNCTION increment_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE events 
    SET current_attendees = current_attendees + 1,
        updated_at = NOW()
    WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement event attendees
CREATE OR REPLACE FUNCTION decrement_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE events 
    SET current_attendees = GREATEST(current_attendees - 1, 0),
        updated_at = NOW()
    WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Events are publicly readable, only admins can modify
CREATE POLICY "Events are publicly readable" ON events FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Speakers are publicly readable, only admins can modify
CREATE POLICY "Speakers are publicly readable" ON speakers FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify speakers" ON speakers FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions are publicly readable, only admins can modify
CREATE POLICY "Sessions are publicly readable" ON sessions FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify sessions" ON sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Users can manage their own registrations
CREATE POLICY "Users can view own registrations" ON registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registrations" ON registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON registrations FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own session attendance
CREATE POLICY "Users can view own session attendance" ON session_attendees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own session attendance" ON session_attendees FOR ALL USING (auth.uid() = user_id);

-- Chat messages are readable by session attendees
CREATE POLICY "Session attendees can view chat messages" ON chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM session_attendees WHERE session_id = chat_messages.session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can manage their own networking connections
CREATE POLICY "Users can view own connections" ON networking_connections FOR SELECT USING (
    auth.uid() = user_id1 OR auth.uid() = user_id2
);
CREATE POLICY "Users can create connections" ON networking_connections FOR INSERT WITH CHECK (
    auth.uid() = user_id1 OR auth.uid() = user_id2
);
CREATE POLICY "Users can update own connections" ON networking_connections FOR UPDATE USING (
    auth.uid() = user_id1 OR auth.uid() = user_id2
);

-- Users can view and manage their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO events (id, title, description, start_date, end_date, timezone, status, current_attendees, tags, organizer_name, organizer_email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'INBOUND 2025', 'The world''s largest gathering of inbound professionals. Join 26,000+ marketing, sales, and customer success professionals for 4 days of learning, networking, and growth.', '2025-09-03T09:00:00Z', '2025-09-06T18:00:00Z', 'EST', 'upcoming', 0, ARRAY['Marketing', 'Sales', 'Customer Success', 'Growth'], 'INBOUND Team', 'events@inbound.com'),
('550e8400-e29b-41d4-a716-446655440002', 'Digital Marketing Masterclass', 'Learn advanced digital marketing strategies from industry experts. Cover topics including SEO, social media marketing, content strategy, and conversion optimization.', '2025-03-22T14:00:00Z', '2025-03-22T17:00:00Z', 'EST', 'upcoming', 850, ARRAY['Marketing', 'Digital', 'SEO', 'Social Media'], 'Marketing Pro Academy', 'info@marketingpro.com'),
('550e8400-e29b-41d4-a716-446655440003', 'Remote Work Best Practices', 'Discover effective strategies for remote work, team collaboration, and maintaining work-life balance in a distributed work environment.', '2025-03-28T11:00:00Z', '2025-03-28T15:00:00Z', 'GMT', 'upcoming', 1200, ARRAY['Remote Work', 'Productivity', 'Team Management'], 'Future Work Institute', 'contact@futurework.org');

INSERT INTO speakers (id, name, title, company, bio, social_twitter, social_linkedin, social_website, sessions) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Sarah Chen', 'Chief Technology Officer', 'TechCorp', 'Sarah is a visionary technology leader with over 15 years of experience in AI and machine learning. She has led digital transformation initiatives at Fortune 500 companies and is passionate about using technology to solve real-world problems.', 'https://twitter.com/sarahchen', 'https://linkedin.com/in/sarahchen', 'https://sarahchen.dev', ARRAY['1', '3']),
('660e8400-e29b-41d4-a716-446655440002', 'Marcus Rodriguez', 'Senior Product Manager', 'InnovateLabs', 'Marcus is a product strategy expert who has launched over 20 successful digital products. He specializes in user experience design and data-driven product development.', 'https://twitter.com/marcusrodriguez', 'https://linkedin.com/in/marcusrodriguez', NULL, ARRAY['2']),
('660e8400-e29b-41d4-a716-446655440003', 'Dr. Emily Watson', 'Data Science Director', 'DataInsights Inc', 'Dr. Watson is a renowned data scientist and researcher with expertise in machine learning, statistical analysis, and predictive modeling.', NULL, 'https://linkedin.com/in/emilywatson', 'https://emilywatson.research.com', ARRAY['6']);