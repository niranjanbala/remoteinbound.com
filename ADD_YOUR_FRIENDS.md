# 👥 Add Your Friends as Partners

## Quick Instructions

1. **Open the CSV file**: `partners_import_template.csv`
2. **Replace the sample data** with your friends' information
3. **Run the import**: `node scripts/import-partners.js`
4. **Update your partner pages** to show real partners instead of "Be the First!" messages

## 📝 What to Replace

The CSV currently has 6 sample partners. Replace them with your friends:

### Current Sample Partners:
- John Smith (TechSolutions Inc) - Technology Partner
- Sarah Johnson (MarketingPro Agency) - Service Partner  
- Mike Chen (DataConnect Solutions) - Integration Partner
- Lisa Rodriguez (HubSpot User Group LA) - Community Partner
- David Park (SalesBoost Consulting) - Service Partner
- Emma Wilson (Creative Design Studio) - Service Partner

### For Each Friend, You Need:
- **Name**: Their full name
- **Email**: Their email address
- **Company**: Their company name
- **Job Title**: Their role/position
- **Phone**: Their phone number (optional)
- **Company Description**: What their company does (50-500 characters)
- **Partnership Type**: Choose from:
  - `technology` - Software/tech solutions
  - `service` - Consulting/services
  - `integration` - API/data connections
  - `community` - Community building
- **Website**: Their company website
- **Offerings**: What services they provide (comma-separated)
- **Speaking Interest**: `true` if they want to speak at events
- **Status**: Choose from:
  - `pending` - Just applied
  - `approved` - Application approved
  - `active` - Fully active partner

## 🎯 Example Row for Your Friend

```csv
Jane Doe,jane@awesomeagency.com,Awesome Marketing Agency,Founder,+1-555-9999,"We help SaaS companies grow using HubSpot and inbound marketing strategies. 5+ years experience.",service,https://awesomeagency.com,"HubSpot Implementation,Marketing Automation,Consulting",true,active,2025-01-01T10:00:00Z,2025-01-02T15:00:00Z
```

## 🚀 After Import

Once you run the import, you can:

1. **Update Partner Stats**: Change "0 Mission Partners" to show the actual count
2. **Show Real Partners**: Replace "Be the First!" sections with actual partner listings
3. **Create Partner Profiles**: Use the data to create individual partner pages

## 💡 Tips

- **Keep it realistic**: Use real company descriptions and websites
- **Mix the statuses**: Have some pending, some approved, some active
- **Vary partnership types**: Include different types for diversity
- **Speaking opportunities**: Mark friends who might actually want to speak

## 🔄 Re-running the Import

You can run the import multiple times. Each time it will:
- Generate new unique IDs
- Update the timestamps
- Overwrite the previous `imported_partners.json` file

## 📞 Need Help?

If you have questions about:
- CSV formatting
- Partnership types
- Status meanings
- Integration with your app

Check the detailed `PARTNER_IMPORT_GUIDE.md` file!