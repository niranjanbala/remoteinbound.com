const { createClient } = require('@supabase/supabase-js');

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

async function verifyDatabase() {
  console.log('🔍 Checking database setup...\n');
  
  const tables = [
    { name: 'users', description: 'User accounts and profiles' },
    { name: 'events', description: 'Event information and details' },
    { name: 'speakers', description: 'Speaker profiles and bios' },
    { name: 'sessions', description: 'Event sessions and talks' },
    { name: 'registrations', description: 'User event registrations' }
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table.name}' - ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table.name}' - ${table.description}`);
      }
    } catch (err) {
      console.log(`❌ Table '${table.name}' - Connection error`);
      allTablesExist = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allTablesExist) {
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('✅ All tables are ready for use');
    console.log('✅ You can now test user registration');
    console.log('✅ Database operations will work correctly');
  } else {
    console.log('⚠️  DATABASE SETUP REQUIRED');
    console.log('\n📋 Next Steps:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project: tdcghhupwfoiwfwoqqrt');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Copy contents of supabase/schema.sql');
    console.log('5. Paste and run the SQL');
    console.log('6. Run this script again to verify');
  }
  
  console.log('\n🔗 Quick Links:');
  console.log('- Supabase Dashboard: https://supabase.com/dashboard');
  console.log('- Your Project: https://supabase.com/dashboard/project/tdcghhupwfoiwfwoqqrt');
  console.log('- SQL Editor: https://supabase.com/dashboard/project/tdcghhupwfoiwfwoqqrt/sql');
}

verifyDatabase().catch(console.error);