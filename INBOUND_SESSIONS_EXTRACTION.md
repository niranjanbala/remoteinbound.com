# Inbound Sessions Data Extraction

This system extracts session data from the Inbound conference website (https://www.inbound.com/sessions) and stores it in Supabase tables.

## Features

- **Web Scraping**: Uses Puppeteer to extract session data from the Inbound website
- **Database Storage**: Stores sessions, speakers, and metadata in Supabase
- **Data Normalization**: Handles speakers, tags, and session relationships properly
- **Duplicate Prevention**: Uses external IDs to prevent duplicate entries
- **Comprehensive Data**: Extracts titles, speakers, timing, tags, levels, and sponsor information

## Database Schema

The system extends the existing schema with Inbound-specific fields:

### Sessions Table Extensions
- `session_level`: Session difficulty level (e.g., "OPEN TO ALL LEVELS", "ADVANCED")
- `reservation_required`: Boolean indicating if reservation is needed
- `sponsor_name`: Name of the session sponsor (if any)
- `sponsor_logo`: URL to sponsor logo
- `source_url`: Original URL where data was extracted from
- `external_id`: Unique identifier for preventing duplicates

### New Tables
- `inbound_session_tags`: Many-to-many relationship for session tags
- `inbound_session_speakers`: Many-to-many relationship for session speakers
- `session_details`: View that combines all session data with speakers and tags

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install Puppeteer and other required dependencies.

### 2. Environment Variables

Ensure you have the following environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Setup Database Schema

Run the schema setup script to add the necessary tables and columns:

```bash
npm run setup-inbound-schema
```

This will:
- Add new columns to existing tables
- Create junction tables for tags and speakers
- Set up proper indexes and RLS policies
- Create the `session_details` view

### 4. Extract Session Data

Run the extraction script to scrape and store session data:

```bash
npm run extract-inbound-sessions
```

This will:
- Launch a headless browser
- Navigate to the Inbound sessions page
- Extract all session information
- Store sessions, speakers, and tags in Supabase
- Handle duplicates gracefully

## Data Structure

### Extracted Session Data

Each session includes:

```javascript
{
  title: "Session Title",
  description: "Session description",
  start_time: "2024-09-03T17:45:00.000Z",
  end_time: "2024-09-03T18:15:00.000Z",
  session_level: "OPEN TO ALL LEVELS",
  reservation_required: false,
  sponsor_name: "Sponsor Name",
  sponsor_logo: "https://example.com/logo.png",
  speakers: [
    {
      name: "Speaker Name",
      avatar: "https://example.com/avatar.jpg"
    }
  ],
  tags: ["AI", "MARKETING", "GROWTH"]
}
```

### Database Relationships

```
sessions
├── inbound_session_speakers → speakers
├── inbound_session_tags
└── events (optional parent event)
```

## API Usage

### Get All Sessions with Details

```javascript
const { data: sessions } = await supabase
  .from('session_details')
  .select('*');
```

### Get Sessions by Tag

```javascript
const { data: sessions } = await supabase
  .from('session_details')
  .select('*')
  .contains('tags', [{ name: 'AI' }]);
```

### Get Sessions by Speaker

```javascript
const { data: sessions } = await supabase
  .from('session_details')
  .select('*')
  .contains('speakers', [{ name: 'Speaker Name' }]);
```

## Customization

### Modifying Extraction Logic

Edit `scripts/extract-inbound-sessions.js` to:
- Change CSS selectors for different website layouts
- Add new data fields
- Modify parsing logic
- Add custom filtering

### Adding New Data Fields

1. Update the schema in `supabase/inbound_sessions_schema.sql`
2. Run the schema setup script
3. Modify the extraction script to capture new fields
4. Update the storage logic

## Troubleshooting

### Common Issues

1. **Puppeteer Installation**: If Puppeteer fails to install, try:
   ```bash
   npm install puppeteer --unsafe-perm=true
   ```

2. **Website Changes**: If the extraction fails, the website structure may have changed. Update the CSS selectors in the extraction script.

3. **Database Permissions**: Ensure your service role key has the necessary permissions to create tables and insert data.

4. **Rate Limiting**: The script includes delays to avoid overwhelming the website. Adjust if needed.

### Debug Mode

To run the extraction with visible browser for debugging:

```javascript
// In extract-inbound-sessions.js, change:
this.browser = await puppeteer.launch({
  headless: false, // Set to false for debugging
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

## Data Quality

The system includes several data quality measures:

- **Duplicate Prevention**: Uses external IDs to prevent duplicate sessions
- **Data Validation**: Validates required fields before storage
- **Error Handling**: Continues processing even if individual sessions fail
- **Logging**: Comprehensive logging for monitoring and debugging

## Maintenance

### Regular Updates

1. **Schema Updates**: As the website evolves, update the extraction logic
2. **Data Refresh**: Run the extraction script periodically to get new sessions
3. **Cleanup**: Remove old or outdated session data as needed

### Monitoring

Monitor the extraction process by:
- Checking console output during extraction
- Verifying data in Supabase dashboard
- Using the `session_details` view for data validation

## Integration

### With Next.js App

The extracted data integrates seamlessly with the existing Next.js application:

```javascript
// In your React components
import { createClient } from '@/lib/supabase';

export async function getServerSideProps() {
  const supabase = createClient();
  const { data: sessions } = await supabase
    .from('session_details')
    .select('*')
    .order('start_time');

  return { props: { sessions } };
}
```

### API Endpoints

Create API endpoints to serve the session data:

```javascript
// pages/api/sessions.js
export default async function handler(req, res) {
  const supabase = createClient();
  const { data: sessions } = await supabase
    .from('session_details')
    .select('*');
  
  res.json(sessions);
}
```

## License

This extraction system is part of the RemoteInbound.com project and follows the same license terms.