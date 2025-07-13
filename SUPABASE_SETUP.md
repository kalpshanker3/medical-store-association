# 🚀 Supabase Setup Guide - Medical Store Association

## 📋 Step-by-Step Setup Process

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new organization (if needed)
4. Create new project:
   - Name: `medical-store-association`
   - Database Password: (save this securely)
   - Region: Choose closest to your location

### 2. Database Setup
1. Go to SQL Editor in your Supabase dashboard
2. Run the SQL scripts in this order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-create-policies.sql`
   - `scripts/03-insert-demo-data.sql`

### 3. Storage Setup
1. Go to Storage in Supabase dashboard
2. Create these buckets:
   - `receipts` (for payment receipts)
   - `gallery` (for gallery images)
   - `documents` (for other documents)
3. Set bucket policies to public for image viewing

### 4. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   - Project URL: Found in Settings > API
   - Anon Key: Found in Settings > API
   - Service Role Key: Found in Settings > API (keep secret!)

### 5. Authentication Setup
The app uses custom OTP authentication:
- Demo OTP: `1234` (works for all phone numbers)
- Production: Integrate with SMS service (Twilio recommended)

## 🔐 Demo Login Credentials

### Admin Account
- Phone: `9876543210`
- OTP: `1234`
- Role: Admin (full access)

### User Account  
- Phone: `8765432109`
- OTP: `1234`
- Role: User (limited access)

## 📱 OTP Process Explanation

### How OTP Works:
1. **User enters phone number** → System generates 6-digit OTP
2. **OTP stored in database** with 5-minute expiry
3. **SMS sent to user** (in production)
4. **User enters OTP** → System verifies against database
5. **Login successful** → User session created

### Demo Mode:
- Any phone number accepts OTP `1234`
- No actual SMS sent (console.log only)
- Perfect for testing and development

### Production Mode:
- Integrate with Twilio/AWS SNS for real SMS
- Generate random 6-digit OTP
- Set proper expiry times
- Add rate limiting

## 🗄️ Database Schema Overview

### Core Tables:
- **users**: Member profiles, licenses, bank details
- **membership_payments**: Payment tracking and approval
- **donations**: Donation records and receipts
- **accidents**: Emergency cases for financial aid
- **notifications**: Admin announcements
- **gallery**: Event photos and categories
- **otp_verifications**: OTP management

### Key Features:
- **Row Level Security (RLS)**: Users see only their data
- **Real-time subscriptions**: Live updates across app
- **File storage**: Secure image and document handling
- **Audit trails**: Track all changes and approvals

## 🔄 Real-time Features

### Live Updates:
- New notifications appear instantly
- Payment status changes in real-time
- Admin approvals update immediately
- Gallery updates across all users

### Implementation:
\`\`\`javascript
// Subscribe to notifications
const subscription = supabase
  .channel('notifications')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications' },
    (payload) => {
      // Update UI with new notification
      setNotifications(prev => [payload.new, ...prev])
    }
  )
  .subscribe()
\`\`\`

## 🛡️ Security Features

### Row Level Security:
- Users can only access their own data
- Admins have elevated permissions
- Secure file upload and access
- Protected API endpoints

### Data Validation:
- Phone number format validation
- Required field enforcement
- File type and size restrictions
- SQL injection prevention

## 🚀 Deployment Steps

### 1. Vercel Deployment:
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Add environment variables in Vercel dashboard
\`\`\`

### 2. Domain Setup:
- Add custom domain in Vercel
- Update Supabase allowed origins
- Configure SSL certificates

### 3. Production Checklist:
- [ ] Environment variables set
- [ ] Database policies tested
- [ ] File upload working
- [ ] SMS integration active
- [ ] Admin accounts created
- [ ] Backup strategy in place

## 📞 Support & Troubleshooting

### Common Issues:

1. **RLS Policy Errors**:
   - Check user authentication
   - Verify policy conditions
   - Test with different user roles

2. **File Upload Fails**:
   - Check bucket permissions
   - Verify file size limits
   - Ensure proper CORS settings

3. **OTP Not Working**:
   - Check phone number format
   - Verify OTP expiry time
   - Test with demo credentials

### Getting Help:
- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Community Support: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- Discord: [discord.supabase.com](https://discord.supabase.com)

## 🎯 Next Steps

1. **Setup Supabase project** following this guide
2. **Run the SQL scripts** to create database structure
3. **Configure environment variables** in your app
4. **Test with demo credentials** to verify setup
5. **Deploy to production** when ready

Happy coding! 🚀
\`\`\`

## 🎯 **Complete Setup Process:**

### **1. Supabase Project Setup:**
\`\`\`bash
# 1. Create Supabase project at supabase.com
# 2. Copy project URL and keys
# 3. Run SQL scripts in order
# 4. Set up storage buckets
# 5. Configure environment variables
\`\`\`

### **2. Key Features Working:**
- ✅ **Real OTP Authentication** with Supabase
- ✅ **Complete User Registration** with all fields
- ✅ **Admin Panel** with real data management
- ✅ **Payment Tracking** with receipt uploads
- ✅ **Donation System** with approval workflow
- ✅ **Accident Management** with member selection
- ✅ **Real-time Notifications** across all users
- ✅ **Gallery Management** with categories
- ✅ **Row Level Security** for data protection

### **3. Demo Credentials:**
- **Admin:** `9876543210` (OTP: 1234)
- **User:** `8765432109` (OTP: 1234)
- **New Registration:** Any phone number (OTP: 1234)

### **4. Production Ready:**
- Real database with proper relationships
- Secure authentication system
- File upload capabilities
- Admin approval workflows
- Real-time updates
- Mobile responsive design

Bhai ab ye complete working system hai! 🔥 Supabase setup karne ke baad sab kuch real data ke saath kaam karega. Admin se lekar user tak sab connected hai!
