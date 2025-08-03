#!/usr/bin/env node

/**
 * Remote Speakers Management Script
 * 
 * This script helps manage the remote_speakers table by providing utilities to:
 * - Sync all speakers from speakers table to remote_speakers
 * - Sync individual speakers
 * - List remote speakers with statistics
 * - Clean up duplicate or orphaned records
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncAllSpeakers() {
  console.log('🔄 Syncing all speakers to remote_speakers table...');
  
  try {
    const { data, error } = await supabase.rpc('sync_all_speakers_to_remote');
    
    if (error) {
      console.error('❌ Error syncing speakers:', error);
      return false;
    }
    
    console.log(`✅ Successfully synced ${data} speakers to remote_speakers table`);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function syncAllSessionSpeakers() {
  console.log('🔄 Syncing all session speakers to remote_session_speakers table...');
  
  try {
    const { data, error } = await supabase.rpc('sync_all_session_speakers_to_remote');
    
    if (error) {
      console.error('❌ Error syncing session speakers:', error);
      return false;
    }
    
    console.log(`✅ Successfully synced ${data} session speaker relationships to remote_session_speakers table`);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function listRemoteSpeakers() {
  console.log('📋 Listing remote speakers...');
  
  try {
    const { data: speakers, error } = await supabase
      .from('remote_speaker_details')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching remote speakers:', error);
      return;
    }
    
    console.log(`\n📊 Found ${speakers.length} remote speakers:\n`);
    
    speakers.forEach((speaker, index) => {
      console.log(`${index + 1}. ${speaker.name}`);
      console.log(`   Title: ${speaker.title}`);
      console.log(`   Company: ${speaker.company}`);
      console.log(`   Sessions: ${speaker.session_count || 0}`);
      if (speaker.session_titles && speaker.session_titles.length > 0) {
        console.log(`   Session Titles: ${speaker.session_titles.slice(0, 2).join(', ')}${speaker.session_titles.length > 2 ? '...' : ''}`);
      }
      if (speaker.external_id) {
        console.log(`   External ID: ${speaker.external_id}`);
      }
      console.log('');
    });
    
    // Show statistics
    const companies = [...new Set(speakers.map(s => s.company))];
    const totalSessions = speakers.reduce((sum, s) => sum + (s.session_count || 0), 0);
    
    console.log('📈 Statistics:');
    console.log(`   Total Speakers: ${speakers.length}`);
    console.log(`   Unique Companies: ${companies.length}`);
    console.log(`   Total Sessions: ${totalSessions}`);
    console.log(`   Average Sessions per Speaker: ${(totalSessions / speakers.length).toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function listRemoteSessions() {
  console.log('📋 Listing sessions with remote speakers...');
  
  try {
    const { data: sessions, error } = await supabase
      .from('remote_session_details')
      .select('*')
      .order('start_time');
    
    if (error) {
      console.error('❌ Error fetching remote sessions:', error);
      return;
    }
    
    console.log(`\n📊 Found ${sessions.length} sessions:\n`);
    
    const sessionsWithSpeakers = sessions.filter(s => s.remote_speaker_count > 0);
    const sessionsWithoutSpeakers = sessions.filter(s => s.remote_speaker_count === 0);
    
    console.log(`📈 Session Statistics:`);
    console.log(`   Total Sessions: ${sessions.length}`);
    console.log(`   Sessions with Remote Speakers: ${sessionsWithSpeakers.length}`);
    console.log(`   Sessions without Remote Speakers: ${sessionsWithoutSpeakers.length}`);
    console.log('');
    
    // Show sessions with remote speakers
    if (sessionsWithSpeakers.length > 0) {
      console.log('🎤 Sessions with Remote Speakers:');
      sessionsWithSpeakers.slice(0, 10).forEach((session, index) => {
        console.log(`${index + 1}. ${session.title}`);
        console.log(`   Time: ${new Date(session.start_time).toLocaleString()}`);
        console.log(`   Remote Speakers: ${session.remote_speaker_count}`);
        if (session.remote_speakers && session.remote_speakers.length > 0) {
          const speakerNames = session.remote_speakers.map(s => s.name).join(', ');
          console.log(`   Speaker Names: ${speakerNames}`);
        }
        console.log('');
      });
      
      if (sessionsWithSpeakers.length > 10) {
        console.log(`   ... and ${sessionsWithSpeakers.length - 10} more sessions with remote speakers\n`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function compareTables() {
  console.log('🔍 Comparing speakers and remote_speakers tables...');
  
  try {
    // Get counts from both tables
    const { count: speakersCount } = await supabase
      .from('speakers')
      .select('*', { count: 'exact', head: true });
    
    const { count: remoteSpeakersCount } = await supabase
      .from('remote_speakers')
      .select('*', { count: 'exact', head: true });
    
    const { count: sessionSpeakersCount } = await supabase
      .from('inbound_session_speakers')
      .select('*', { count: 'exact', head: true });
    
    const { count: remoteSessionSpeakersCount } = await supabase
      .from('remote_session_speakers')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Table Comparison:`);
    console.log(`   speakers table: ${speakersCount} records`);
    console.log(`   remote_speakers table: ${remoteSpeakersCount} records`);
    console.log(`   inbound_session_speakers table: ${sessionSpeakersCount} records`);
    console.log(`   remote_session_speakers table: ${remoteSessionSpeakersCount} records`);
    
    if (speakersCount === remoteSpeakersCount) {
      console.log('✅ Speaker tables have the same number of records');
    } else {
      console.log(`⚠️  Speaker difference: ${Math.abs(speakersCount - remoteSpeakersCount)} records`);
    }
    
    if (sessionSpeakersCount === remoteSessionSpeakersCount) {
      console.log('✅ Session speaker tables have the same number of records');
    } else {
      console.log(`⚠️  Session speaker difference: ${Math.abs(sessionSpeakersCount - remoteSessionSpeakersCount)} records`);
    }
    
    // Check for speakers not in remote_speakers
    const { data: missingSpeakers } = await supabase
      .from('speakers')
      .select('id, name, company')
      .not('id', 'in', `(SELECT id FROM remote_speakers)`);
    
    if (missingSpeakers && missingSpeakers.length > 0) {
      console.log(`\n⚠️  ${missingSpeakers.length} speakers not in remote_speakers:`);
      missingSpeakers.forEach(speaker => {
        console.log(`   - ${speaker.name} (${speaker.company})`);
      });
    } else {
      console.log('\n✅ All speakers are synced to remote_speakers');
    }
    
  } catch (error) {
    console.error('❌ Error comparing tables:', error);
  }
}

async function cleanupDuplicates() {
  console.log('🧹 Checking for duplicate remote speakers...');
  
  try {
    // Find duplicates by name and company
    const { data: duplicates } = await supabase
      .from('remote_speakers')
      .select('name, company, count(*)')
      .group('name, company')
      .having('count(*) > 1');
    
    if (!duplicates || duplicates.length === 0) {
      console.log('✅ No duplicates found');
      return;
    }
    
    console.log(`⚠️  Found ${duplicates.length} potential duplicate groups:`);
    duplicates.forEach(dup => {
      console.log(`   - ${dup.name} at ${dup.company} (${dup.count} records)`);
    });
    
    console.log('\n💡 To clean up duplicates, you may need to manually review and remove them');
    
  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
  }
}

async function validateData() {
  console.log('🔍 Validating remote speakers data...');
  
  try {
    const { data: speakers } = await supabase
      .from('remote_speakers')
      .select('*');
    
    let issues = 0;
    
    speakers.forEach(speaker => {
      if (!speaker.name || speaker.name.trim() === '') {
        console.log(`⚠️  Speaker ${speaker.id} has empty name`);
        issues++;
      }
      
      if (!speaker.title || speaker.title.trim() === '') {
        console.log(`⚠️  Speaker ${speaker.name} has empty title`);
        issues++;
      }
      
      if (!speaker.company || speaker.company.trim() === '') {
        console.log(`⚠️  Speaker ${speaker.name} has empty company`);
        issues++;
      }
      
      if (!speaker.bio || speaker.bio.trim() === '') {
        console.log(`⚠️  Speaker ${speaker.name} has empty bio`);
        issues++;
      }
    });
    
    if (issues === 0) {
      console.log('✅ All remote speakers have valid data');
    } else {
      console.log(`⚠️  Found ${issues} data validation issues`);
    }
    
  } catch (error) {
    console.error('❌ Error validating data:', error);
  }
}

async function showHelp() {
  console.log(`
🎯 Remote Speakers Management Script

Usage: node scripts/manage-remote-speakers.js [command]

Commands:
  sync-all         Sync all speakers from speakers table to remote_speakers
  sync-sessions    Sync all session speakers to remote_session_speakers
  sync-complete    Sync both speakers and session relationships
  list             List all remote speakers with details
  list-sessions    List sessions with remote speaker assignments
  compare          Compare speakers and remote_speakers tables
  cleanup          Check for and report duplicate records
  validate         Validate data integrity in remote_speakers table
  help             Show this help message

Examples:
  node scripts/manage-remote-speakers.js sync-complete
  node scripts/manage-remote-speakers.js list
  node scripts/manage-remote-speakers.js list-sessions
  node scripts/manage-remote-speakers.js compare
  
Environment:
  Make sure .env.local contains:
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
`);
}

async function main() {
  const command = process.argv[2];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables');
    console.error('   Please ensure .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  console.log('🚀 Remote Speakers Management Script');
  console.log('=====================================\n');
  
  switch (command) {
    case 'sync-all':
      await syncAllSpeakers();
      break;
      
    case 'sync-sessions':
      await syncAllSessionSpeakers();
      break;
      
    case 'sync-complete':
      console.log('🔄 Performing complete sync...');
      const speakersSuccess = await syncAllSpeakers();
      if (speakersSuccess) {
        await syncAllSessionSpeakers();
      }
      break;
      
    case 'list':
      await listRemoteSpeakers();
      break;
      
    case 'list-sessions':
      await listRemoteSessions();
      break;
      
    case 'compare':
      await compareTables();
      break;
      
    case 'cleanup':
      await cleanupDuplicates();
      break;
      
    case 'validate':
      await validateData();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      await showHelp();
      break;
      
    default:
      if (command) {
        console.log(`❌ Unknown command: ${command}\n`);
      }
      await showHelp();
      break;
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});