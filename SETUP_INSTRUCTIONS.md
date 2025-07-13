# 🚀 Complete Supabase Setup Instructions

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose organization
5. Fill project details:
   - Name: `medical-store-association`
   - Database Password: (save this!)
   - Region: Choose closest to you
6. Wait for project to be ready (2-3 minutes)

## Step 2: Run SQL Scripts (IN ORDER!)
Go to SQL Editor in Supabase Dashboard and run these scripts one by one:

### 1. First run: `scripts/01-create-tables.sql`
- Creates all database tables
- Sets up indexes
- Enables Row Level Security

### 2. Then run: `scripts/02-create-policies.sql`
- Creates security policies
- Sets up access controls
- Configures user permissions

### 3. Then run: `scripts/03-insert-demo-data.sql`
- Adds demo admin and users
- Inserts sample notifications
- Creates test data

### 4. Then run: `scripts/04-create-functions.sql`
- Creates utility functions
- Sets up triggers
- Adds helper procedures

### 5. Finally run: `scripts/05-create-storage-policies.sql`
- Creates storage buckets
- Sets up file upload policies
- Configures image storage

## Step 3: Setup Storage Buckets
1. Go to Storage in Supabase Dashboard
2. Create these buckets (if not auto-created):
   - `receipts` (Public: Yes)
   - `gallery` (Public: Yes)  
   - `documents` (Public: No)

## Step 4: Get API Keys
1. Go to Settings > API in Supabase Dashboard
2. Copy these values:
   - Project URL
   - Anon (public) key
   - Service role key (keep secret!)

## Step 5: Setup Environment Variables
Create `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

## Step 6: Test the Setup
1. Start your Next.js app: `npm run dev`
2. Try logging in with demo credentials:
   - Admin: Phone `9876543210`, OTP `1234`
   - User: Phone `8765432109`, OTP `1234`
3. Test registration with any new phone number
4. Check admin panel functionality

## 🎯 Demo Credentials

### Admin Account
- **Phone:** `9876543210`
- **OTP:** `1234`
- **Access:** Full admin panel access

### Regular User
- **Phone:** `8765432109`  
- **OTP:** `1234`
- **Access:** User features only

### New Registration
- **Phone:** Any 10-digit number
- **OTP:** `1234`
- **Status:** Will be pending approval

## 🔧 Troubleshooting

### Common Issues:

1. **"relation does not exist" error:**
   - Make sure you ran scripts in correct order
   - Check if tables were created successfully

2. **Permission denied errors:**
   - Verify you're using the correct API keys
   - Check RLS policies are set up

3. **OTP not working:**
   - Always use `1234` for demo
   - Check phone number format (10 digits)

4. **File upload fails:**
   - Verify storage buckets exist
   - Check bucket policies are set

### Verification Steps:
1. Check Tables: Go to Table Editor, verify all tables exist
2. Check Data: Verify demo data is inserted
3. Check Storage: Verify buckets are created
4. Check Policies: Go to Authentication > Policies

## 🚀 Production Deployment

### For Production:
1. **SMS Integration:** Replace demo OTP with real SMS service
2. **File Storage:** Configure proper file size limits
3. **Security:** Review and tighten RLS policies
4. **Backup:** Set up automated backups
5. **Monitoring:** Enable logging and monitoring

### Environment Variables for Production:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# Optional: SMS Service (Twilio/AWS SNS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
\`\`\`

## ✅ Success Checklist

After setup, you should be able to:
- [ ] Login with demo admin account
- [ ] Login with demo user account  
- [ ] Register new user account
- [ ] View admin panel (as admin)
- [ ] See real-time notifications
- [ ] Upload payment receipts
- [ ] Manage gallery (as admin)
- [ ] View member lists
- [ ] Process donations

## 🆘 Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Verify all SQL scripts ran successfully
3. Confirm environment variables are correct
4. Test with demo credentials first

**Bhai ab ye complete setup guide hai! Step by step follow karo aur sab kuch working ho jayega! 🔥**
