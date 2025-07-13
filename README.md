# 🏥 Medical Store Association Management System

A comprehensive web application for managing medical store associations, member registrations, payments, donations, and community events.

## ✨ Features

### 🔐 Authentication & User Management
- **OTP-based Login/Registration** - Secure 6-digit OTP verification
- **Role-based Access** - Admin and User roles with different permissions
- **Profile Management** - Complete user profile with business details

### 💰 Financial Management
- **Membership Payments** - Annual membership fee collection (₹100)
- **Donation System** - Support for accident-affected families
- **Payment Receipts** - Image upload and verification system
- **Payment History** - Complete transaction tracking

### 👥 Member Management
- **Registration System** - Complete member onboarding
- **Status Tracking** - Pending, Approved, Rejected statuses
- **Business Details** - Store information, licenses, bank details
- **Nominee Information** - Family member details for support

### 🖼️ Gallery & Events
- **Photo Gallery** - Community events and activities
- **Category Management** - Events, Awards, Charity, Health camps
- **Admin Upload** - Controlled image management

### 📢 Communication
- **Notifications** - Important announcements and updates
- **Status Updates** - Real-time application status
- **Emergency Alerts** - Critical information dissemination

### 🏢 Admin Panel
- **Dashboard** - Complete overview of all activities
- **Approval System** - Member and payment approvals
- **Accident Reports** - Track and manage accident cases
- **Gallery Management** - Upload and organize photos

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **SMS**: Twilio (for production OTP)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/medical-store-association.git
cd medical-store-association
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Environment Setup**
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Database Setup**
Run SQL scripts in Supabase:
- `scripts/01-create-tables.sql`
- `scripts/02-create-policies.sql`
- `scripts/04-create-functions.sql`
- `scripts/05-create-storage-policies.sql`

5. **Start development server**
```bash
npm run dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Members
1. **Register** - Complete registration form with all required details
2. **Login** - Use phone number and OTP (123456 for development)
3. **Pay Membership** - Upload payment receipt
4. **Make Donations** - Support accident-affected families
5. **View Gallery** - See community events and activities

### For Admins
1. **Login** - Use admin credentials
2. **Approve Members** - Review and approve new registrations
3. **Verify Payments** - Approve membership payments
4. **Manage Gallery** - Upload and organize photos
5. **Send Notifications** - Communicate with members

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (SMS) | No |
| `TWILIO_AUTH_TOKEN` | Twilio auth token (SMS) | No |
| `TWILIO_PHONE_NUMBER` | Twilio phone number (SMS) | No |

### Database Tables

- `users` - Member information and profiles
- `membership_payments` - Payment records and receipts
- `donations` - Donation transactions
- `accidents` - Accident reports and cases
- `notifications` - System notifications
- `gallery` - Photo gallery management
- `otp_verifications` - OTP authentication

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **OTP Authentication** - Secure phone verification
- **Role-based Permissions** - Admin/User access control
- **Environment Variables** - Secure configuration management
- **Input Validation** - Form validation and sanitization

## 📊 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- phone (VARCHAR, Unique)
- name (VARCHAR)
- age (INTEGER)
- store_name (VARCHAR)
- location (TEXT)
- gst_number (VARCHAR)
- drug_license_number (VARCHAR)
- food_license_number (VARCHAR)
- account_number (VARCHAR)
- ifsc (VARCHAR)
- branch (VARCHAR)
- nominee_name (VARCHAR)
- nominee_relation (VARCHAR)
- nominee_phone (VARCHAR)
- status (VARCHAR) - pending/approved/rejected
- membership_status (VARCHAR) - pending/active/inactive
- role (VARCHAR) - user/admin
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Review [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- Check [Supabase Setup](./SUPABASE_SETUP.md)

## 🔄 Updates

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added gallery management
- **v1.2.0** - Enhanced admin panel
- **v1.3.0** - Production-ready deployment

---

**Built with ❤️ for Medical Store Associations** 