# Fans Import Guide

This guide will help you add your friends as fans (attendees/speakers) to Remote Inbound using the CSV import system.

## 📋 Quick Start

1. **Edit the CSV file**: Open `fans_import_template.csv` and replace the sample data with your friends' information
2. **Run the import**: Execute `node scripts/import-fans.js`
3. **Update your pages**: The fans will be saved to `data/imported_fans.json`

## 📊 CSV Template Fields

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| `name` | Full name | "Alex Thompson" | ✅ |
| `email` | Email address | "alex@company.com" | ✅ |
| `company` | Company name | "GrowthTech Solutions" | ✅ |
| `jobTitle` | Job title | "Head of Marketing" | ✅ |
| `phone` | Phone number | "+1-555-1001" | ❌ |
| `bio` | Personal bio (50-500 chars) | "Marketing leader with 8+ years..." | ✅ |
| `interestedInSpeaking` | Want to speak at events | "true" or "false" | ✅ |
| `speakingExperience` | Speaking experience level | "none", "beginner", "intermediate", "expert" | ❌ |
| `expertise` | Areas of expertise (comma-separated) | "Growth Marketing,HubSpot Automation" | ❌ |
| `sessionTopics` | Potential session topics (comma-separated) | "Advanced HubSpot Workflows" | ❌ |
| `twitterHandle` | Twitter username | "alexgrowth" | ❌ |
| `linkedinProfile` | LinkedIn username | "alex-thompson-marketing" | ❌ |
| `website` | Personal/company website | "https://alexthompson.com" | ❌ |
| `availableForNetworking` | Available for networking | "true" or "false" | ✅ |
| `hubspotExperience` | HubSpot tools used (comma-separated) | "Marketing Hub,Sales Hub" | ❌ |
| `interests` | Professional interests (comma-separated) | "Growth Marketing,Lead Generation" | ❌ |
| `registrationStatus` | Registration status | "pending", "confirmed", "cancelled" | ✅ |
| `registeredAt` | Registration date | "2025-01-05T09:00:00Z" | ✅ |
| `speakerStatus` | Speaker application status | "pending", "approved", "featured", "declined" | ❌ |

## 🎯 Speaking Experience Levels

- **`none`**: No speaking experience
- **`beginner`**: 1-2 speaking engagements
- **`intermediate`**: 3-10 speaking engagements
- **`expert`**: 10+ speaking engagements or professional speaker

## 📈 Registration Status Options

- **`pending`**: Registration submitted, awaiting confirmation
- **`confirmed`**: Registration confirmed, will attend
- **`cancelled`**: Registration cancelled

## 🎤 Speaker Status Options

- **`pending`**: Speaker application submitted, awaiting review
- **`approved`**: Speaker application approved
- **`featured`**: Featured/keynote speaker
- **`declined`**: Speaker application declined

## 🛠️ Available HubSpot Experience

Choose from these options (comma-separated):
- Marketing Hub
- Sales Hub
- Service Hub
- Operations Hub
- CRM Management
- HubSpot Implementation
- Marketing Automation
- Sales Automation
- Content Strategy
- Lead Generation
- Customer Success
- Analytics & Reporting
- E-commerce Integration
- API Integration

## 🎨 Professional Interests

Common interests to choose from:
- Growth Marketing
- Marketing Automation
- Lead Generation
- Content Marketing
- SEO
- Social Media
- Email Marketing
- Sales Operations
- Customer Success
- Data Analytics
- UX/UI Design
- E-commerce
- SaaS
- Startup Growth
- Community Building
- Nonprofit Marketing

## 🚀 Usage Instructions

### Step 1: Prepare Your CSV
```bash
# Open the template file
open fans_import_template.csv
```

Replace the sample data with your friends' information. Here's an example row:
```csv
Jane Smith,jane@company.com,Awesome Corp,Marketing Manager,+1-555-9999,"Marketing professional with 5 years of HubSpot experience. Love helping businesses grow through inbound strategies.",true,intermediate,"Inbound Marketing,HubSpot Strategy","Inbound Marketing Best Practices",janemarketing,jane-smith-marketing,https://janesmith.com,true,"Marketing Hub,Sales Hub","Inbound Marketing,Lead Generation",confirmed,2025-01-01T10:00:00Z,approved
```

### Step 2: Run the Import
```bash
node scripts/import-fans.js
```

### Step 3: Review the Output
The script will create `data/imported_fans.json` with your fans in the correct format and show detailed statistics.

## 📝 Sample Data Included

The template includes 10 sample fans:
- **8 interested in speaking** (1 featured, 5 approved, 2 pending)
- **2 attendees only**
- **All confirmed registrations**
- **Diverse expertise areas**: Growth Marketing, Content Strategy, Sales, Design, Analytics, etc.
- **Various experience levels**: From beginners to experts

## 📊 Import Statistics

After import, you'll see:
- **Total fans count**
- **Speaker vs attendee breakdown**
- **Registration status distribution**
- **Speaker status breakdown**
- **Individual fan listing with status badges**

## 🔧 Integration with Your App

After importing, you can:

1. **Update Homepage Stats**: Change attendee numbers to reflect actual registrations
2. **Populate Speakers Page**: Show real speakers instead of placeholder content
3. **Create Speaker Profiles**: Generate individual speaker profile pages
4. **Show Attendee List**: Display confirmed attendees for networking
5. **Filter by Expertise**: Allow filtering speakers by expertise areas

## 💡 Tips

- **Bios**: Keep between 50-500 characters for best display
- **Social Handles**: Use just the username, not full URLs
- **Expertise**: Use specific, searchable terms
- **Session Topics**: Be descriptive and engaging
- **Dates**: Use ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- **Mix Experience Levels**: Include beginners to experts for diversity

## 🎨 Customization

You can modify the import script to:
- Add custom validation rules
- Connect directly to your database
- Send welcome emails to imported fans
- Generate speaker profile pages automatically
- Create networking match suggestions

## 🆘 Troubleshooting

**CSV parsing errors**: Make sure commas in bios/topics are properly quoted
**Missing required fields**: name, email, company, jobTitle, bio, registrationStatus, registeredAt must have values
**Date format errors**: Use ISO 8601 format for dates
**Boolean field errors**: Use "true" or "false" (lowercase) for boolean fields

## 📞 Support

If you need help with the import process, check the console output for detailed error messages and suggestions. The script provides comprehensive feedback on the import process and statistics.

## 🔄 Re-running the Import

You can run the import multiple times. Each time it will:
- Generate new unique IDs
- Update the timestamps
- Overwrite the previous `imported_fans.json` file
- Show updated statistics

This allows you to easily update your fan database as you add more friends or modify existing data.