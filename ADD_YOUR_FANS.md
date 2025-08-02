# 👥 Add Your Friends as Fans (Attendees/Speakers)

## Quick Instructions

1. **Open the CSV file**: `fans_import_template.csv`
2. **Replace the sample data** with your friends' information
3. **Run the import**: `node scripts/import-fans.js`
4. **Update your pages** to show real attendees and speakers

## 📝 What to Replace

The CSV currently has 10 sample fans. Replace them with your friends:

### Current Sample Fans:
- **Alex Thompson** (GrowthTech Solutions) - Growth Marketing Expert, Speaker ⭐
- **Maria Garcia** (Salesforce) - CRM Integration Specialist, Speaker
- **David Kim** (StartupLife Co) - Serial Entrepreneur, Featured Speaker 🌟
- **Jennifer Lee** (Content Queen Agency) - Content Strategist, Speaker
- **Michael Brown** (TechCorp Industries) - VP of Sales, Attendee Only
- **Lisa Wang** (Creative Design Studio) - UX/UI Designer, Speaker
- **Robert Johnson** (Analytics Plus) - Data Analyst, Speaker
- **Emma Davis** (HubSpot Enthusiast) - Community Manager, Attendee Only
- **Carlos Rodriguez** (EcommercePro Solutions) - E-commerce Expert, Speaker
- **Sophie Martin** (Nonprofit Growth Alliance) - Fundraising Expert, Speaker

### For Each Friend, You Need:
- **Basic Info**: Name, email, company, job title, phone (optional)
- **Bio**: What they do and their HubSpot experience (50-500 characters)
- **Speaking Interest**: Do they want to speak? (`true` or `false`)
- **Experience Level**: `none`, `beginner`, `intermediate`, `expert`
- **Expertise**: What they're good at (comma-separated)
- **Session Topics**: What they could speak about (if interested)
- **Social**: Twitter handle, LinkedIn profile, website (all optional)
- **Networking**: Available for networking? (`true` or `false`)
- **HubSpot Experience**: Which HubSpot tools they use
- **Interests**: Professional interests
- **Status**: `pending`, `confirmed`, or `cancelled`
- **Registration Date**: When they registered

## 🎯 Example Row for Your Friend

```csv
Sarah Johnson,sarah@marketingpro.com,MarketingPro Agency,Marketing Director,+1-555-0124,"Full-service marketing professional with 6+ years of HubSpot experience. Love helping businesses grow through strategic inbound marketing.",true,expert,"Inbound Marketing,HubSpot Strategy,Lead Generation","Advanced Lead Nurturing Strategies,HubSpot Automation Secrets",sarahmarketing,sarah-johnson-marketing,https://sarahjohnson.com,true,"Marketing Hub,Sales Hub,Operations Hub","Inbound Marketing,Lead Generation,Marketing Automation",confirmed,2025-01-15T10:00:00Z,approved
```

## 🎤 Speaker vs Attendee

### Speakers (interestedInSpeaking = true)
- Need: expertise, sessionTopics, speakingExperience, speakerStatus
- Will be featured on speakers page
- Can present sessions at the event

### Attendees (interestedInSpeaking = false)
- Just attending the event
- Available for networking
- Don't need speaker-specific fields

## 📊 Status Options

### Registration Status:
- **`pending`**: Just registered, awaiting confirmation
- **`confirmed`**: Registration confirmed, will attend
- **`cancelled`**: Registration cancelled

### Speaker Status (if interested in speaking):
- **`pending`**: Speaker application under review
- **`approved`**: Approved to speak
- **`featured`**: Featured/keynote speaker
- **`declined`**: Speaker application declined

## 🚀 After Import

Once you run the import, you'll get:

### 📊 Statistics:
- Total fans count
- Speaker vs attendee breakdown
- Registration status distribution
- Speaker status breakdown

### 📁 Files Created:
- `data/imported_fans.json` - All fan data in proper format

### 🔧 Next Steps:
1. **Update Homepage**: Change "5,000+ Expected Attendees" to actual count
2. **Populate Speakers Page**: Show real speakers with their topics
3. **Create Networking**: Use the data for attendee networking features
4. **Speaker Profiles**: Generate individual speaker profile pages

## 💡 Pro Tips

- **Mix Experience Levels**: Include both beginners and experts
- **Diverse Topics**: Cover different aspects of HubSpot and marketing
- **Real Bios**: Use actual professional descriptions
- **Social Links**: Include real social media handles
- **Realistic Dates**: Use recent registration dates
- **Balance Speakers/Attendees**: Not everyone needs to be a speaker

## 🔄 Re-running the Import

You can run the import multiple times to:
- Add more friends
- Update existing information
- Test different configurations
- Generate fresh IDs and timestamps

## 📞 Need Help?

If you have questions about:
- CSV formatting
- Field requirements
- Speaker vs attendee setup
- Integration with your app

Check the detailed `FANS_IMPORT_GUIDE.md` file for comprehensive documentation!

## 🎉 Sample Import Results

After running the import with sample data, you'll see:
```
📊 Import Statistics:
👥 Total Fans: 10
🎤 Interested in Speaking: 8
👋 Attendees Only: 2
✅ Confirmed Registrations: 10

🎤 Speaker Status Breakdown:
⭐ Featured Speakers: 1
✅ Approved Speakers: 5
⏳ Pending Speakers: 2
```

This gives you a realistic mix of speakers and attendees to showcase on your Remote Inbound platform!