const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function initializeSessionClaims() {
  console.log('🚀 Initializing session claims for Inbound 2025...');
  
  try {
    // Get all existing sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id, speaker_ids');
    
    if (sessionsError) throw sessionsError;
    
    console.log(`📊 Found ${sessions.length} sessions to initialize`);
    
    // Create claim records for each session
    const claimRecords = sessions.map(session => ({
      session_id: session.id,
      original_speaker_ids: session.speaker_ids || [],
      claim_status: 'available'
    }));
    
    // Insert claims in batches to avoid timeout
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < claimRecords.length; i += batchSize) {
      const batch = claimRecords.slice(i, i + batchSize);
      
      const { data: claims, error: claimsError } = await supabase
        .from('session_claims')
        .upsert(batch, { onConflict: 'session_id' })
        .select();
      
      if (claimsError) {
        console.warn(`⚠️ Error inserting batch ${i / batchSize + 1}:`, claimsError);
        continue;
      }
      
      insertedCount += claims.length;
      console.log(`✅ Processed batch ${i / batchSize + 1}/${Math.ceil(claimRecords.length / batchSize)} (${claims.length} records)`);
    }
    
    // Update sessions to mark them as 2025 and unclaimed
    const claimDeadline = new Date();
    claimDeadline.setDate(claimDeadline.getDate() + 30); // 30 days from now
    
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        event_year: 2025,
        is_claimed: false,
        youtube_enabled: true,
        claim_deadline: claimDeadline.toISOString()
      })
      .in('id', sessions.map(s => s.id));
    
    if (updateError) throw updateError;
    
    console.log(`✅ Successfully initialized ${insertedCount} session claims`);
    console.log(`📅 Claim deadline set to: ${claimDeadline.toLocaleDateString()}`);
    console.log('🎯 All sessions are now available for claiming by new speakers');
    
    // Show summary statistics
    const { data: stats } = await supabase
      .from('session_claims_overview')
      .select('claim_status')
      .eq('event_year', 2025);
    
    if (stats) {
      const statusCounts = stats.reduce((acc, session) => {
        acc[session.claim_status] = (acc[session.claim_status] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📈 Session Status Summary:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} sessions`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error initializing session claims:', error);
    process.exit(1);
  }
}

// Add command line options
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

if (dryRun) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  // Add dry run logic here if needed
} else {
  initializeSessionClaims();
}