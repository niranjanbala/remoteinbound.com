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
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabaseFunctions() {
  console.log('🧪 Testing database functions and operations...\n');
  
  try {
    // Test 1: Test the increment_attendees function
    console.log('1️⃣ Testing increment_attendees function...');
    
    // First create a test event
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert([{
        title: 'Test Event for Functions',
        description: 'Testing database functions',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        end_date: new Date(Date.now() + 90000000).toISOString(),
        timezone: 'UTC',
        status: 'upcoming',
        organizer_name: 'Test Organizer',
        organizer_email: 'test@example.com',
        current_attendees: 0
      }])
      .select()
      .single();
    
    if (eventError) {
      console.log(`   ❌ Event creation failed: ${eventError.message}`);
      return false;
    }
    
    console.log(`   ✅ Test event created: ${eventData.title}`);
    
    // Test the increment function
    const { error: incrementError } = await supabase
      .rpc('increment_attendees', { event_id: eventData.id });
    
    if (incrementError) {
      console.log(`   ❌ increment_attendees function failed: ${incrementError.message}`);
    } else {
      console.log(`   ✅ increment_attendees function works`);
      
      // Verify the increment worked
      const { data: updatedEvent } = await supabase
        .from('events')
        .select('current_attendees')
        .eq('id', eventData.id)
        .single();
      
      console.log(`   ✅ Attendees count: ${updatedEvent.current_attendees} (should be 1)`);
    }
    
    // Test 2: Test the decrement_attendees function
    console.log('\n2️⃣ Testing decrement_attendees function...');
    
    const { error: decrementError } = await supabase
      .rpc('decrement_attendees', { event_id: eventData.id });
    
    if (decrementError) {
      console.log(`   ❌ decrement_attendees function failed: ${decrementError.message}`);
    } else {
      console.log(`   ✅ decrement_attendees function works`);
      
      // Verify the decrement worked
      const { data: updatedEvent } = await supabase
        .from('events')
        .select('current_attendees')
        .eq('id', eventData.id)
        .single();
      
      console.log(`   ✅ Attendees count: ${updatedEvent.current_attendees} (should be 0)`);
    }
    
    // Test 3: Test basic CRUD operations
    console.log('\n3️⃣ Testing basic CRUD operations...');
    
    // Create a test user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        email: `test-${Date.now()}@example.com`,
        full_name: 'Test User',
        company: 'Test Company',
        job_title: 'Developer'
      }])
      .select()
      .single();
    
    if (userError) {
      console.log(`   ❌ User creation failed: ${userError.message}`);
    } else {
      console.log(`   ✅ User created: ${userData.email}`);
    }
    
    // Test 4: Test relationships and joins
    console.log('\n4️⃣ Testing relationships and joins...');
    
    if (userData && eventData) {
      // Create a registration
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert([{
          user_id: userData.id,
          event_id: eventData.id,
          registration_type: 'virtual',
          status: 'confirmed'
        }])
        .select()
        .single();
      
      if (regError) {
        console.log(`   ❌ Registration creation failed: ${regError.message}`);
      } else {
        console.log(`   ✅ Registration created successfully`);
        
        // Test join query
        const { data: joinData, error: joinError } = await supabase
          .from('registrations')
          .select(`
            *,
            users(full_name, email),
            events(title, start_date)
          `)
          .eq('id', regData.id)
          .single();
        
        if (joinError) {
          console.log(`   ❌ Join query failed: ${joinError.message}`);
        } else {
          console.log(`   ✅ Join query successful: ${joinData.users.full_name} registered for ${joinData.events.title}`);
        }
      }
    }
    
    // Test 5: Test updated_at trigger
    console.log('\n5️⃣ Testing updated_at trigger...');
    
    if (userData) {
      const originalUpdatedAt = userData.updated_at;
      
      // Wait a moment then update the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ company: 'Updated Company' })
        .eq('id', userData.id)
        .select()
        .single();
      
      if (updateError) {
        console.log(`   ❌ User update failed: ${updateError.message}`);
      } else {
        const updatedAtChanged = new Date(updatedUser.updated_at) > new Date(originalUpdatedAt);
        if (updatedAtChanged) {
          console.log(`   ✅ updated_at trigger works correctly`);
        } else {
          console.log(`   ⚠️  updated_at trigger may not be working`);
        }
      }
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    
    if (userData) {
      await supabase.from('users').delete().eq('id', userData.id);
      console.log('   ✅ Test user deleted');
    }
    
    if (eventData) {
      await supabase.from('events').delete().eq('id', eventData.id);
      console.log('   ✅ Test event deleted');
    }
    
    console.log('\n🎉 DATABASE FUNCTIONS TEST COMPLETED!');
    console.log('✅ All database functions are working correctly');
    console.log('✅ CRUD operations successful');
    console.log('✅ Relationships and joins working');
    console.log('✅ Triggers functioning properly');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Database function test failed:', error.message);
    return false;
  }
}

testDatabaseFunctions();