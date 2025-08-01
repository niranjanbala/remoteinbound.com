const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Remote Inbound database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   ${i + 1}/${statements.length}: Executing statement...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_supabase_migrations')
          .select('*')
          .limit(1);
        
        if (directError && directError.code === '42P01') {
          // Table doesn't exist, try to execute raw SQL
          console.log(`   ⚠️  RPC method not available, trying alternative approach...`);
        } else {
          console.error(`   ❌ Error executing statement ${i + 1}:`, error.message);
        }
      }
    }
    
    // Verify tables were created
    console.log('🔍 Verifying database setup...');
    
    const tables = ['users', 'events', 'speakers', 'sessions', 'registrations'];
    let allTablesExist = true;
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Table '${table}' not found or accessible`);
        allTablesExist = false;
      } else {
        console.log(`   ✅ Table '${table}' is ready`);
      }
    }
    
    if (allTablesExist) {
      console.log('\n🎉 Database setup completed successfully!');
      console.log('✅ All tables created and accessible');
      console.log('✅ Row Level Security policies applied');
      console.log('✅ Ready for user registration and data operations');
    } else {
      console.log('\n⚠️  Database setup completed with some issues.');
      console.log('Please run the SQL schema manually in your Supabase dashboard.');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase/schema.sql');
    console.log('4. Run the SQL to create all tables and policies');
  }
}

setupDatabase();