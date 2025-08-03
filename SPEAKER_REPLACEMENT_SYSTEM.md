# Speaker Replacement System for Inbound 2025

## Overview
Transform the existing Inbound 2024 event data into Inbound 2025 by keeping all original sessions but allowing new speakers to "claim" sessions and deliver them as live YouTube sessions.

## System Architecture

### 1. Database Schema Updates

#### New Tables
```sql
-- Session Claims Table
CREATE TABLE session_claims (
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

-- New Speaker Applications Table
CREATE TABLE speaker_applications (
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
```

#### Session Table Updates
```sql
-- Add new columns to existing sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS event_year INTEGER DEFAULT 2024;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS claim_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS youtube_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS original_session_id UUID; -- Reference to original Inbound 2024 session
```

### 2. API Endpoints

#### Session Claims API
- `GET /api/sessions/available` - List unclaimed sessions
- `POST /api/sessions/{id}/claim` - Claim a session
- `PUT /api/sessions/{id}/claim` - Update claim details
- `DELETE /api/sessions/{id}/claim` - Release a claim
- `GET /api/sessions/my-claims` - Get user's claimed sessions

#### Speaker Applications API
- `POST /api/speakers/apply` - Submit speaker application
- `GET /api/speakers/applications` - List applications (admin)
- `PUT /api/speakers/applications/{id}` - Approve/reject application
- `GET /api/speakers/my-application` - Get user's application status

#### Admin Management API
- `GET /api/admin/claims` - Manage all session claims
- `PUT /api/admin/claims/{id}/confirm` - Confirm a claim
- `GET /api/admin/sessions/migration` - Migrate 2024 to 2025 sessions

### 3. User Interface Components

#### Public Session Browser
- **Available Sessions Page**: Browse unclaimed sessions with filters
- **Session Detail Modal**: Show session details with claim button
- **Claim Status Indicators**: Visual indicators for session availability
- **Speaker Profile Integration**: Link to new speaker profiles

#### Speaker Dashboard
- **My Claims**: Manage claimed sessions
- **Application Status**: Track speaker application
- **YouTube Integration**: Set up live streaming details
- **Session Preparation**: Access session materials and guidelines

#### Admin Panel
- **Claims Management**: Approve/reject session claims
- **Speaker Applications**: Review and approve new speakers
- **Migration Tools**: Bulk operations for 2024→2025 transition
- **Analytics Dashboard**: Track claim progress and speaker engagement

### 4. Business Logic

#### Session Claim Workflow
1. **Available**: Session is open for claiming
2. **Claimed**: Speaker has expressed interest
3. **Confirmed**: Admin has approved the claim
4. **Completed**: Session has been delivered

#### Speaker Onboarding Process
1. **Application**: Submit speaker profile and preferences
2. **Review**: Admin reviews application
3. **Approval**: Speaker gains access to claim sessions
4. **Claiming**: Speaker can claim available sessions
5. **Preparation**: Access to session materials and YouTube setup
6. **Delivery**: Live YouTube session delivery

#### YouTube Integration
- **Stream Setup**: Integration with YouTube Live API
- **Video Management**: Automatic video creation and management
- **Analytics**: Track viewership and engagement
- **Recording**: Automatic session recording and storage

### 5. Data Migration Strategy

#### Phase 1: Preparation
- Create new tables and columns
- Set up claim tracking system
- Initialize all 2024 sessions as "available"

#### Phase 2: Speaker Onboarding
- Launch speaker application system
- Begin reviewing and approving speakers
- Create new speaker profiles

#### Phase 3: Session Claiming
- Open session claiming to approved speakers
- Monitor and manage claim process
- Confirm high-quality claims

#### Phase 4: Event Delivery
- Support speakers with YouTube setup
- Monitor live sessions
- Handle technical issues and support

### 6. Technical Implementation

#### Database Views
```sql
-- Session Claims Overview
CREATE VIEW session_claims_overview AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.start_time,
    s.end_time,
    s.tags,
    sc.claim_status,
    sc.youtube_stream_url,
    sp.name as new_speaker_name,
    sp.company as new_speaker_company,
    sc.claimed_at,
    sc.confirmed_at
FROM sessions s
LEFT JOIN session_claims sc ON s.id = sc.session_id
LEFT JOIN speakers sp ON sc.new_speaker_id = sp.id
WHERE s.event_year = 2025;
```

#### Cache Strategy
- Cache available sessions for 1 hour
- Cache speaker profiles for 4 hours
- Invalidate cache on claim status changes
- Real-time updates for admin dashboard

#### Security Considerations
- Role-based access control (speakers, admins)
- Session claim ownership validation
- Rate limiting on claim attempts
- Audit logging for all claim activities

### 7. Monitoring and Analytics

#### Key Metrics
- **Claim Rate**: Percentage of sessions claimed
- **Speaker Engagement**: Active speakers vs. total approved
- **Completion Rate**: Claimed sessions actually delivered
- **Quality Score**: Viewer ratings and feedback

#### Reporting Dashboard
- Real-time claim status overview
- Speaker performance metrics
- Session popularity analytics
- YouTube integration statistics

### 8. Success Criteria

#### Quantitative Goals
- 80% of original sessions claimed by new speakers
- 95% of confirmed claims successfully delivered
- Average session rating of 4.0+ stars
- 50+ approved speakers in the system

#### Qualitative Goals
- Smooth speaker onboarding experience
- Reliable YouTube live streaming
- Positive community feedback
- Successful event transformation

## Implementation Timeline

### Week 1-2: Foundation
- Database schema updates
- Basic API endpoints
- Admin interface setup

### Week 3-4: Speaker System
- Speaker application system
- Claim management interface
- YouTube integration setup

### Week 5-6: Testing & Launch
- System testing and bug fixes
- Speaker onboarding pilot
- Full system launch

### Week 7-8: Event Delivery
- Live session support
- Real-time monitoring
- Post-event analytics

## Risk Mitigation

### Technical Risks
- **Database Migration**: Careful testing and rollback plans
- **YouTube API Limits**: Rate limiting and error handling
- **Performance**: Load testing and optimization

### Business Risks
- **Low Adoption**: Marketing and incentive programs
- **Quality Control**: Speaker vetting and session guidelines
- **Technical Issues**: 24/7 support during live events

## Conclusion

This system transforms the static Inbound 2024 content into a dynamic, community-driven Inbound 2025 event while preserving the valuable session structure and content that made the original event successful.