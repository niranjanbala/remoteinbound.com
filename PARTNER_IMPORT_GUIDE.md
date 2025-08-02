# Partner Import Guide

This guide will help you add your friends as partners to Remote Inbound using the CSV import system.

## 📋 Quick Start

1. **Edit the CSV file**: Open `partners_import_template.csv` and replace the sample data with your friends' information
2. **Run the import**: Execute `node scripts/import-partners.js`
3. **Update your pages**: The partners will be saved to `data/imported_partners.json`

## 📊 CSV Template Fields

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| `name` | Full name | "John Smith" | ✅ |
| `email` | Email address | "john@company.com" | ✅ |
| `company` | Company name | "TechSolutions Inc" | ✅ |
| `jobTitle` | Job title | "CEO" | ✅ |
| `phone` | Phone number | "+1-555-0123" | ❌ |
| `companyDescription` | Company description (50-500 chars) | "We help businesses..." | ✅ |
| `partnershipType` | Type of partnership | "technology", "service", "integration", "community" | ✅ |
| `website` | Company website | "https://company.com" | ✅ |
| `offerings` | Services offered (comma-separated) | "HubSpot Implementation,Training" | ✅ |
| `interestedInSpeaking` | Want to speak at events | "true" or "false" | ✅ |
| `status` | Partner status | "pending", "approved", "active" | ✅ |
| `appliedAt` | Application date | "2025-01-15T10:00:00Z" | ✅ |
| `approvedAt` | Approval date | "2025-01-16T14:30:00Z" | ❌ |

## 🎯 Partnership Types

- **`technology`**: Software integrations and tech solutions
- **`service`**: Consulting, implementation, and support services  
- **`integration`**: API integrations and data connections
- **`community`**: Community building and engagement

## 🛠️ Available Offerings

Choose from these options (comma-separated):
- HubSpot Implementation
- HubSpot Training
- Custom Integrations
- Marketing Automation
- Sales Enablement
- Customer Success
- Data Analytics
- Content Creation
- Design Services
- Development Services
- Consulting
- Support Services

## 📈 Partner Status Options

- **`pending`**: Application submitted, awaiting review
- **`approved`**: Application approved, not yet active
- **`active`**: Fully active mission partner

## 🚀 Usage Instructions

### Step 1: Prepare Your CSV
```bash
# Open the template file
open partners_import_template.csv
```

Replace the sample data with your friends' information. Here's an example row:
```csv
Sarah Johnson,sarah@marketingpro.com,MarketingPro Agency,Marketing Director,+1-555-0124,"Full-service marketing agency specializing in HubSpot-powered inbound marketing strategies.",service,https://marketingpro.com,"HubSpot Training,Marketing Automation,Content Creation",true,active,2025-01-10T09:15:00Z,2025-01-12T11:45:00Z
```

### Step 2: Run the Import
```bash
node scripts/import-partners.js
```

### Step 3: Review the Output
The script will create `data/imported_partners.json` with your partners in the correct format.

## 📝 Sample Data Included

The template includes 6 sample partners:
- **TechSolutions Inc** (Technology Partner) - Approved
- **MarketingPro Agency** (Service Partner) - Active  
- **DataConnect Solutions** (Integration Partner) - Active
- **HubSpot User Group LA** (Community Partner) - Approved
- **SalesBoost Consulting** (Service Partner) - Pending
- **Creative Design Studio** (Service Partner) - Pending

## 🔧 Integration with Your App

After importing, you can:

1. **Update Partner Stats**: Change "0 Mission Partners" to show actual count
2. **Display Real Partners**: Replace "Be the First!" with actual partner listings
3. **Show Partner Status**: Use the status field to display different partner states

## 💡 Tips

- **Company Descriptions**: Keep between 50-500 characters for best display
- **Websites**: Always include `https://` prefix
- **Offerings**: Use exact names from the list above
- **Dates**: Use ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- **Status Flow**: pending → approved → active

## 🎨 Customization

You can modify the import script to:
- Add custom validation rules
- Connect directly to your database
- Send welcome emails to imported partners
- Generate partner profile pages automatically

## 🆘 Troubleshooting

**CSV parsing errors**: Make sure commas in descriptions are properly quoted
**Missing fields**: All required fields must have values
**Date format errors**: Use ISO 8601 format for dates
**Invalid partnership types**: Use only the 4 supported types

## 📞 Support

If you need help with the import process, check the console output for detailed error messages and suggestions.