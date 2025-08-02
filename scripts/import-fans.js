const fs = require('fs');
const path = require('path');

/**
 * CSV Fan Import Utility
 * 
 * This script helps you import fans (attendees/speakers) from a CSV file into your Remote Inbound fan system.
 * 
 * Usage:
 * 1. Fill out the fans_import_template.csv file with your friends' information
 * 2. Run: node scripts/import-fans.js
 * 
 * CSV Format:
 * name,email,company,jobTitle,phone,bio,interestedInSpeaking,speakingExperience,expertise,sessionTopics,twitterHandle,linkedinProfile,website,availableForNetworking,hubspotExperience,interests,registrationStatus,registeredAt,speakerStatus
 */

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const fans = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const fan = {};
      headers.forEach((header, index) => {
        fan[header.trim()] = values[index].trim();
      });
      fans.push(fan);
    }
  }

  return fans;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

function convertToUserFormat(csvFan) {
  return {
    id: `fan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: csvFan.email.toLowerCase().trim(),
    fullName: csvFan.name.trim(),
    company: csvFan.company.trim(),
    jobTitle: csvFan.jobTitle.trim(),
    phone: csvFan.phone.trim() || undefined,
    role: 'fan',
    preferences: {
      notifications: true,
      theme: 'system'
    },
    fanProfile: {
      bio: csvFan.bio.trim(),
      interestedInSpeaking: csvFan.interestedInSpeaking.toLowerCase() === 'true',
      speakingExperience: csvFan.speakingExperience.trim() || 'none',
      expertise: csvFan.expertise ? csvFan.expertise.split(',').map(e => e.trim()) : [],
      sessionTopics: csvFan.sessionTopics ? csvFan.sessionTopics.split(',').map(t => t.trim()) : [],
      social: {
        twitter: csvFan.twitterHandle.trim() || undefined,
        linkedin: csvFan.linkedinProfile.trim() || undefined,
        website: csvFan.website.trim() || undefined
      },
      availableForNetworking: csvFan.availableForNetworking.toLowerCase() === 'true',
      hubspotExperience: csvFan.hubspotExperience ? csvFan.hubspotExperience.split(',').map(h => h.trim()) : [],
      interests: csvFan.interests ? csvFan.interests.split(',').map(i => i.trim()) : []
    },
    registrationStatus: {
      status: csvFan.registrationStatus || 'pending',
      registeredAt: csvFan.registeredAt || new Date().toISOString()
    },
    speakerStatus: csvFan.interestedInSpeaking.toLowerCase() === 'true' ? {
      status: csvFan.speakerStatus || 'pending',
      appliedAt: csvFan.registeredAt || new Date().toISOString(),
      sessionTopics: csvFan.sessionTopics ? csvFan.sessionTopics.split(',').map(t => t.trim()) : []
    } : undefined,
    createdAt: csvFan.registeredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function importFans() {
  const csvPath = path.join(__dirname, '..', 'fans_import_template.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    console.log('📝 Please create and fill out the fans_import_template.csv file first.');
    return;
  }

  try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const csvFans = parseCSV(csvContent);
    
    console.log(`📊 Found ${csvFans.length} fans in CSV file`);
    
    const fans = csvFans.map(convertToUserFormat);
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save fans to JSON file
    const outputPath = path.join(dataDir, 'imported_fans.json');
    fs.writeFileSync(outputPath, JSON.stringify(fans, null, 2));
    
    // Generate statistics
    const stats = {
      total: fans.length,
      speakers: fans.filter(f => f.fanProfile.interestedInSpeaking).length,
      attendees: fans.filter(f => !f.fanProfile.interestedInSpeaking).length,
      confirmed: fans.filter(f => f.registrationStatus.status === 'confirmed').length,
      pending: fans.filter(f => f.registrationStatus.status === 'pending').length,
      speakerStatuses: {
        approved: fans.filter(f => f.speakerStatus && f.speakerStatus.status === 'approved').length,
        pending: fans.filter(f => f.speakerStatus && f.speakerStatus.status === 'pending').length,
        featured: fans.filter(f => f.speakerStatus && f.speakerStatus.status === 'featured').length
      }
    };
    
    console.log('✅ Fans imported successfully!');
    console.log(`📁 Saved to: ${outputPath}`);
    console.log('\n📊 Import Statistics:');
    console.log(`👥 Total Fans: ${stats.total}`);
    console.log(`🎤 Interested in Speaking: ${stats.speakers}`);
    console.log(`👋 Attendees Only: ${stats.attendees}`);
    console.log(`✅ Confirmed Registrations: ${stats.confirmed}`);
    console.log(`⏳ Pending Registrations: ${stats.pending}`);
    
    if (stats.speakers > 0) {
      console.log('\n🎤 Speaker Status Breakdown:');
      console.log(`⭐ Featured Speakers: ${stats.speakerStatuses.featured}`);
      console.log(`✅ Approved Speakers: ${stats.speakerStatuses.approved}`);
      console.log(`⏳ Pending Speakers: ${stats.speakerStatuses.pending}`);
    }
    
    console.log('\n📋 Imported Fans:');
    fans.forEach((fan, index) => {
      const speakerBadge = fan.fanProfile.interestedInSpeaking ? '🎤' : '👋';
      const statusBadge = fan.registrationStatus.status === 'confirmed' ? '✅' : '⏳';
      console.log(`${index + 1}. ${speakerBadge} ${statusBadge} ${fan.fullName} (${fan.company})`);
    });
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Review the imported_fans.json file');
    console.log('2. Update your speakers page to show real speakers');
    console.log('3. Update homepage stats with actual attendee numbers');
    console.log('4. Consider creating individual speaker profile pages');
    
  } catch (error) {
    console.error('❌ Error importing fans:', error.message);
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importFans();
}

module.exports = { importFans, convertToUserFormat, parseCSV };