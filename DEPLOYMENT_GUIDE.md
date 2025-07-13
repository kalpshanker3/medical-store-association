# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account
- Supabase project

## Step 1: Push to GitHub

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Medical Store Association App"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `medical-store-association`
4. Make it **Public** (for free Vercel deployment)
5. Don't initialize with README (we already have one)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/medical-store-association.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 1. Connect to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository: `medical-store-association`

### 2. Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Environment Variables
Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://gpzmbuokxfxumgbadulw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwem1idW9reGZ4dW1nYmFkdWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyODkzMzUsImV4cCI6MjA2Nzg2NTMzNX0.NLRoFyuTqoaWyNYan1dfEyCjEp7lZIwnNXhzfIhZryg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwem1idW9reGZ4dW1nYmFkdWx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI4OTMzNSwiZXhwIjoyMDY3ODY1MzM1fQ.wpou0ECB1_oqj3fggWC5aq37Q1ZtOudR6InNRechuag
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Step 3: Configure Supabase

### 1. Database Setup
1. Go to your Supabase project
2. Run the SQL scripts in order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-create-policies.sql`
   - `scripts/04-create-functions.sql`
   - `scripts/05-create-storage-policies.sql`

### 2. Row Level Security (RLS)
Make sure RLS is enabled on all tables:
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
```

### 3. Storage Setup
1. Go to Storage in Supabase
2. Create buckets:
   - `receipts` (for payment receipts)
   - `gallery` (for gallery images)
   - `donations` (for donation receipts)

## Step 4: Production Configuration

### 1. SMS Integration (Optional)
For production SMS, add these environment variables:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 2. Custom Domain (Optional)
1. In Vercel, go to your project settings
2. Add your custom domain
3. Configure DNS records as instructed

## Step 5: Testing Production

### 1. Test Registration
1. Go to your Vercel URL
2. Try registering a new user
3. Use OTP: `123456` (for development)

### 2. Test Admin Functions
1. Create an admin user in Supabase:
```sql
INSERT INTO public.users (
    phone, name, role, status, membership_status
) VALUES (
    'your_admin_phone', 'Admin Name', 'admin', 'approved', 'active'
);
```

### 3. Test All Features
- User registration
- Login
- Payment uploads
- Gallery management
- Admin functions

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if all dependencies are in `package.json`
   - Verify TypeScript errors are fixed

2. **Environment Variables Not Working**
   - Make sure they're added in Vercel project settings
   - Redeploy after adding variables

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check if RLS policies are correct

4. **Image Upload Issues**
   - Verify storage buckets exist
   - Check storage policies

## Security Notes

1. **Never commit `.env.local`** to GitHub
2. **Use environment variables** for all secrets
3. **Enable RLS** on all tables
4. **Regular backups** of your Supabase database

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs
3. Verify all environment variables are set correctly

Your app should now be live at: `https://your-project-name.vercel.app` 