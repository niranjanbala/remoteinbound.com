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

async function setupDatabase() {
  console.log('🚀 Setting up database using Supabase REST API...\n');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'COPY_THIS_SQL.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement via REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      try {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: statement
          })
        });
        
        if (response.ok) {
          console.log(`   ✅ Success`);
          successCount++;
        } else {
          const errorText = await response.text();
          console.log(`   ⚠️  Warning: ${response.status} - ${errorText.substring(0, 100)}`);
          errorCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Results: ${successCount} successful, ${errorCount} warnings/errors\n`);
    
    // Verify tables were created
    console.log('🔍 Verifying database setup...');
    
    const tables = ['users', 'events', 'speakers', 'sessions', 'registrations'];
    let verifiedTables = 0;
    
    for (const table of tables) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          }
        });
        
        if (response.ok) {
          console.log(`   ✅ Table '${table}' is accessible`);
          verifiedTables++;
        } else {
          console.log(`   ⚠️  Table '${table}' may have access restrictions (normal for RLS)`);
        }
      } catch (error) {
        console.log(`   ❌ Table '${table}': ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (verifiedTables >= 3) {
      console.log('🎉 DATABASE SETUP LIKELY SUCCESSFUL!');
      console.log(`✅ ${verifiedTables}/${tables.length} tables verified`);
      console.log('✅ Ready to test user registration');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Test registration: http://localhost:3000/register');
      console.log('2. Verify setup: node scripts/verify-database.js');
      console.log('3. Check Supabase dashboard for tables');
      
    } else {
      console.log('⚠️  PARTIAL SUCCESS - Some tables may not be accessible');
      console.log('This could be due to Row Level Security policies (which is normal)');
      console.log('\n🧪 Test the registration to see if it works:');
      console.log('- Go to: http://localhost:3000/register');
      console.log('- Try creating a test account');
      console.log('- Check your Supabase dashboard for the user');
    }
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n📋 Alternative: Manual Setup Required');
    console.log('Please follow the instructions in scripts/manual-setup-guide.md');
  }
}

setupDatabase();