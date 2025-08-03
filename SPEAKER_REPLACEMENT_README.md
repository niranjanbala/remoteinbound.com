# Speaker Replacement System for Inbound 2025

## Overview

This system transforms Inbound 2024 into Inbound 2025 by allowing new speakers to claim existing sessions and deliver them as live YouTube presentations. The original event schedule and session structure are preserved while enabling fresh speaker participation.

## System Architecture

### Database Schema
- **session_claims**: Tracks which sessions have been claimed by speakers
- **speaker_applications**: Manages new speaker applications and approvals
- **remote_speakers**: Clone of speakers table for remote speaker management
- **sessions**: Extended with claim tracking columns
- **session_claims_overview**: Optimized view for efficient querying
- **remote_speaker_details**: View with session statistics for remote speakers

### API Endpoints

#### Session Claims Management
- `GET /api/sessions/claims` - List sessions with claim status and filtering
- `POST /api/sessions/claims` - Bulk operations (admin only)
- `POST /api/sessions/[id]/claim` - Claim a specific session
- `PUT /api/sessions/[id]/claim` - Update claim details
- `DELETE /api/sessions/[id]/claim` - Release a session claim
- `GET /api/sessions/[id]/claim` - Get claim details

#### Speaker Applications
- `POST /api/speakers/applications` - Submit new speaker application
- `GET /api/speakers/applications` - List applications (admin only)

#### Remote Speakers Management
- `GET /api/remote-speakers` - List remote speakers with filtering and pagination
- `POST /api/remote-speakers` - Sync speakers or create new remote speakers
- `PUT /api/remote-speakers` - Update remote speaker details
- `DELETE /api/remote-speakers` - Delete remote speaker

### Frontend Components
- **AvailableSessions**: Interactive session browser with claiming interface
- **RemoteSpeakers**: Management interface for remote speakers with sync capabilities
- **SpeakerApplication**: Form for new speaker registration
- **AdminDashboard**: Management interface for approvals and oversight

## Installation & Setup

### 1. Database Migration
```bash
# Apply the session claims migration
supabase db push

# Or manually run the migration file
psql -f supabase/migrations/20250803_session_claims.sql
```

### 2. Initialize Session Claims
```bash
# Dry run to see what will be initialized
npm run init-claims-dry-run

# Initialize all sessions as claimable for 2025
npm run init-session-claims
```

### 3. Setup Remote Speakers
```bash
# Sync all speakers to remote_speakers table
npm run sync-remote-speakers

# List remote speakers with statistics
npm run list-remote-speakers

# Full management script with options
npm run manage-remote-speakers help
```

### 4. Environment Variables
Ensure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage Workflow

### For New Speakers

1. **Apply to Speak**
   ```typescript
   // Submit application
   const response = await fetch('/api/speakers/applications', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'Speaker Name',
       email: 'speaker@example.com',
       bio: 'Speaker biography',
       expertise_areas: ['Marketing', 'Sales'],
       youtube_channel: 'https://youtube.com/@speaker',
       linkedin_profile: 'https://linkedin.com/in/speaker'
     })
   });
   ```

2. **Browse Available Sessions**
   ```typescript
   // Get available sessions
   const sessions = await fetch('/api/sessions/claims?status=available');
   ```

3. **Claim a Session**
   ```typescript
   // Claim session
   const claim = await fetch(`/api/sessions/${sessionId}/claim`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       speaker_id: speakerId,
       proposed_delivery_date: '2025-09-15T14:00:00Z',
       notes: 'I will adapt this session for 2025 trends'
     })
   });
   ```

4. **Update Claim with YouTube Details**
   ```typescript
   // Add YouTube stream URL
   await fetch(`/api/sessions/${sessionId}/claim`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       youtube_stream_url: 'https://youtube.com/watch?v=...',
       status: 'confirmed'
     })
   });
   ```

### For Administrators

1. **Review Applications**
   ```typescript
   // Get pending applications
   const applications = await fetch('/api/speakers/applications?status=pending');
   ```

2. **Monitor Claims**
   ```typescript
   // Get all claims with details
   const claims = await fetch('/api/sessions/claims?include_details=true');
   ```

3. **Bulk Operations**
   ```typescript
   // Release expired claims
   await fetch('/api/sessions/claims', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       action: 'release_expired',
       admin_id: adminId
     })
   });
   ```

## Status Workflow

Sessions progress through these statuses:
- **available** → Session is open for claiming
- **claimed** → Speaker has claimed but not confirmed details
- **confirmed** → YouTube URL provided, ready for delivery
- **completed** → Session has been delivered
- **cancelled** → Claim was cancelled/released

## Caching Strategy

The system implements intelligent caching:
- **Client-side**: 10-hour TTL localStorage cache
- **Cache keys**: `sessions_cache_v1`, `speakers_cache_v1`
- **Invalidation**: Automatic on data mutations
- **Performance**: Reduces API calls by ~90%

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Input validation**: Comprehensive data sanitization
- **Rate limiting**: API endpoint protection
- **Authentication**: NextAuth.js integration
- **Authorization**: Role-based access control

## Monitoring & Analytics

Track key metrics:
- Session claim rates
- Speaker application conversion
- YouTube engagement metrics
- System performance indicators

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check Supabase connection
   supabase status
   ```

2. **Migration Failures**
   ```bash
   # Reset and reapply migrations
   supabase db reset
   supabase db push
   ```

3. **Cache Issues**
   ```javascript
   // Clear client cache
   localStorage.removeItem('sessions_cache_v1');
   localStorage.removeItem('speakers_cache_v1');
   ```

## Development Scripts

```bash
# Setup database schema
npm run setup-inbound-schema

# Extract session data
npm run extract-inbound-sessions

# Initialize session claims (dry run)
npm run init-claims-dry-run

# Initialize session claims
npm run init-session-claims

# Sync all speakers to remote_speakers
npm run sync-remote-speakers

# List remote speakers with details
npm run list-remote-speakers

# Full remote speakers management
npm run manage-remote-speakers [command]

# Start development server
npm run dev
```

## Remote Speakers Management

The `remote_speakers` table is a complete clone of the `speakers` table, designed for separate management of remote speakers in Inbound 2025. This allows you to:

### Key Features
- **Independent Management**: Modify remote speakers without affecting original data
- **Sync Capabilities**: Keep remote speakers in sync with main speakers table
- **Enhanced Views**: Access session statistics and relationships
- **Bulk Operations**: Sync all speakers or individual records

### Management Commands
```bash
# Sync all speakers from speakers to remote_speakers
node scripts/manage-remote-speakers.js sync-all

# List all remote speakers with statistics
node scripts/manage-remote-speakers.js list

# Compare speakers and remote_speakers tables
node scripts/manage-remote-speakers.js compare

# Check for duplicate records
node scripts/manage-remote-speakers.js cleanup

# Validate data integrity
node scripts/manage-remote-speakers.js validate
```

### API Usage Examples

#### Sync All Speakers
```javascript
const response = await fetch('/api/remote-speakers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'sync_all' })
});
```

#### Get Remote Speakers with Details
```javascript
const response = await fetch('/api/remote-speakers?include_details=true&page=1&limit=20');
const data = await response.json();
```

#### Create New Remote Speaker
```javascript
const response = await fetch('/api/remote-speakers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create',
    speaker_data: {
      name: 'John Doe',
      title: 'Senior Developer',
      company: 'Tech Corp',
      bio: 'Experienced developer...',
      social_linkedin: 'https://linkedin.com/in/johndoe'
    }
  })
});
```

## API Response Examples

### Session with Claim Details
```json
{
  "id": "session-123",
  "title": "Advanced Marketing Automation",
  "description": "Learn cutting-edge automation techniques",
  "scheduled_start": "2025-09-15T14:00:00Z",
  "duration_minutes": 45,
  "claim_status": "claimed",
  "claim_details": {
    "speaker_name": "Jane Doe",
    "claimed_at": "2025-08-01T10:00:00Z",
    "proposed_delivery_date": "2025-09-15T14:00:00Z",
    "youtube_stream_url": "https://youtube.com/watch?v=...",
    "status": "confirmed"
  }
}
```

### Speaker Application
```json
{
  "id": "app-456",
  "name": "John Smith",
  "email": "john@example.com",
  "bio": "Marketing expert with 10+ years experience",
  "expertise_areas": ["Marketing", "Sales", "Analytics"],
  "youtube_channel": "https://youtube.com/@johnsmith",
  "linkedin_profile": "https://linkedin.com/in/johnsmith",
  "status": "approved",
  "applied_at": "2025-08-01T09:00:00Z"
}
```

## Contributing

1. Follow the existing code patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Ensure database migrations are reversible
5. Test caching behavior thoroughly

## Support

For technical issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Examine database schema
4. Test with dry-run scripts first