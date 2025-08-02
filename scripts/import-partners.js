const fs = require('fs');
const path = require('path');

/**
 * CSV Partner Import Utility
 * 
 * This script helps you import partners from a CSV file into your Remote Inbound partner system.
 * 
 * Usage:
 * 1. Fill out the partners_import_template.csv file with your friends' information
 * 2. Run: node scripts/import-partners.js
 * 
 * CSV Format:
 * name,email,company,jobTitle,phone,companyDescription,partnershipType,website,offerings,interestedInSpeaking,status,appliedAt,approvedAt
 */

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const partners = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const partner = {};
      headers.forEach((header, index) => {
        partner[header.trim()] = values[index].trim();
      });
      partners.push(partner);
    }
  }

  return partners;
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

function convertToUserFormat(csvPartner) {
  return {
    id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: csvPartner.email.toLowerCase().trim(),
    fullName: csvPartner.name.trim(),
    company: csvPartner.company.trim(),
    jobTitle: csvPartner.jobTitle.trim(),
    phone: csvPartner.phone.trim() || undefined,
    role: 'partner',
    preferences: {
      notifications: true,
      theme: 'system'
    },
    partnerProfile: {
      companyDescription: csvPartner.companyDescription.trim(),
      partnershipType: csvPartner.partnershipType.trim(),
      website: csvPartner.website.trim(),
      offerings: csvPartner.offerings.split(',').map(o => o.trim()),
      interestedInSpeaking: csvPartner.interestedInSpeaking.toLowerCase() === 'true'
    },
    partnerStatus: {
      status: csvPartner.status || 'pending',
      appliedAt: csvPartner.appliedAt || new Date().toISOString(),
      approvedAt: csvPartner.approvedAt || undefined
    },
    createdAt: csvPartner.appliedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function importPartners() {
  const csvPath = path.join(__dirname, '..', 'partners_import_template.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    console.log('📝 Please create and fill out the partners_import_template.csv file first.');
    return;
  }

  try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const csvPartners = parseCSV(csvContent);
    
    console.log(`📊 Found ${csvPartners.length} partners in CSV file`);
    
    const partners = csvPartners.map(convertToUserFormat);
    
    // Create partners directory if it doesn't exist
    const partnersDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(partnersDir)) {
      fs.mkdirSync(partnersDir, { recursive: true });
    }
    
    // Save partners to JSON file
    const outputPath = path.join(partnersDir, 'imported_partners.json');
    fs.writeFileSync(outputPath, JSON.stringify(partners, null, 2));
    
    console.log('✅ Partners imported successfully!');
    console.log(`📁 Saved to: ${outputPath}`);
    console.log('\n📋 Imported Partners:');
    
    partners.forEach((partner, index) => {
      console.log(`${index + 1}. ${partner.fullName} (${partner.company}) - ${partner.partnerStatus.status}`);
    });
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Review the imported_partners.json file');
    console.log('2. Update your partner pages to show these partners');
    console.log('3. Consider updating the partner stats on your homepage');
    
  } catch (error) {
    console.error('❌ Error importing partners:', error.message);
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importPartners();
}

module.exports = { importPartners, convertToUserFormat, parseCSV };