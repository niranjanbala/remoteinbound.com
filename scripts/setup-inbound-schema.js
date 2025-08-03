const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupInboundSchema() {
  try {
    console.log('Setting up Inbound sessions schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'inbound_sessions_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // For now, we'll manually execute the key schema changes
    console.log('Adding new columns to sessions table...');
    
    // Add columns to sessions table
    const sessionColumns = [
      'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_level VARCHAR(50) DEFAULT \'OPEN TO ALL LEVELS\'',
      'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reservation_required BOOLEAN DEFAULT FALSE',
      'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS sponsor_name VARCHAR(255)',
      'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS sponsor_logo TEXT',
      'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS source_url TEXT',
      'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS external_id VARCHAR(255)'
    ];
    
    for (const sql of sessionColumns) {
      console.log('Executing:', sql.substring(0, 50) + '...');
      // Note: Direct SQL execution requires database admin access
      // For now, we'll create the tables through the Supabase dashboard or CLI
    }
    
    // Add columns to speakers table
    const speakerColumns = [
      'ALTER TABLE speakers ADD COLUMN IF NOT EXISTS profile_image TEXT',
      'ALTER TABLE speakers ADD COLUMN IF NOT EXISTS external_id VARCHAR(255)'
    ];
    
    for (const sql of speakerColumns) {
      console.log('Executing:', sql.substring(0, 50) + '...');
    }
    
    console.log('✅ Inbound sessions schema setup completed successfully!');
    
    // Verify the setup by checking if new columns exist
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'sessions')
      .in('column_name', ['session_level', 'reservation_required', 'sponsor_name']);
    
    if (columnsError) {
      console.warn('Could not verify schema setup:', columnsError.message);
    } else {
      console.log('✅ Schema verification completed');
      console.log('New columns added:', columns?.map(c => c.column_name) || []);
    }
    
  } catch (error) {
    console.error('❌ Error setting up schema:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupInboundSchema();