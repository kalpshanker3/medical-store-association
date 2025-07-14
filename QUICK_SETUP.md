# 🚀 Quick Supabase Setup Guide

## ❌ Problem: Supabase Connection Not Working

Agar aapka Supabase connect nahi ho raha hai, to ye step-by-step guide follow karein:

## 📋 Step 1: Supabase Project Create Karein

1. **Supabase.com** pe jao
2. **"Start your project"** click karo
3. **New organization** banao (agar nahi hai)
4. **New project** banao:
   - Name: `medical-store-association`
   - Database Password: (secure password save karo)
   - Region: India ya closest location

## 🔑 Step 2: Environment Variables Set Karein

1. **Project root** mein `.env.local` file banao
2. **Supabase dashboard** mein jao → Settings → API
3. **Project URL** aur **anon key** copy karo
4. `.env.local` mein ye add karo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ Step 3: Database Tables Banayein

1. **Supabase dashboard** mein **SQL Editor** pe jao
2. **Scripts folder** se ye files run karo order mein:

```sql
-- 1. Tables banayein
\i scripts/01-create-tables.sql

-- 2. Policies set karein  
\i scripts/02-create-policies.sql

-- 3. Demo data add karein
\i scripts/03-insert-demo-data.sql

-- 4. Functions banayein
\i scripts/04-create-functions.sql

-- 5. Storage policies
\i scripts/05-create-storage-policies.sql

-- 6. Admin user banayein
\i scripts/06-create-admin-user.sql
```

## 📦 Step 4: Storage Buckets Banayein

1. **Storage** section mein jao
2. **New bucket** banao:
   - `receipts` (payment receipts ke liye)
   - `gallery` (images ke liye)
   - `documents` (documents ke liye)

## 🔄 Step 5: App Restart Karein

```bash
# Development server restart
npm run dev
# ya
yarn dev
# ya  
pnpm dev
```

## ✅ Step 6: Test Karein

1. **Browser** mein app open karo
2. **Home page** pe connection status check karo
3. **Login** test karo:
   - Phone: `9876543210`
   - OTP: `123456`

## 🐛 Common Problems & Solutions

### Problem 1: Environment Variables Missing
```
❌ Supabase environment variables are missing!
```

**Solution:**
- `.env.local` file check karo
- Variables properly set hain ya nahi
- App restart karo

### Problem 2: Database Connection Failed
```
❌ Database connection failed: relation "users" does not exist
```

**Solution:**
- SQL scripts run karo
- Tables properly create hue hain ya nahi check karo

### Problem 3: CORS Error
```
❌ CORS error: Access to fetch at '...' from origin '...' has been blocked
```

**Solution:**
- Supabase dashboard → Settings → API
- **Additional allowed origins** mein add karo:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - Your production URL

### Problem 4: Network Error
```
❌ Network error: Failed to fetch
```

**Solution:**
- Internet connection check karo
- Firewall settings check karo
- VPN off karo (agar use kar rahe hain)

## 🔧 Debug Commands

### Environment Check
```bash
# Console mein ye commands run karo
console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("SUPABASE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing")
```

### Database Test
```javascript
// Browser console mein
import { supabase } from './lib/supabase'
const { data, error } = await supabase.from('users').select('count')
console.log("Test result:", { data, error })
```

## 📞 Support

Agar abhi bhi problem hai to:

1. **Console errors** check karo (F12 press karo)
2. **Network tab** mein failed requests check karo
3. **Supabase dashboard** mein logs check karo
4. **Environment variables** properly set hain ya nahi verify karo

## 🎯 Success Indicators

✅ Connection status shows "डेटाबेस कनेक्टेड"  
✅ Login with test credentials works  
✅ No console errors  
✅ Database operations successful  

---

**Bhai, ye complete guide follow karne ke baad bhi agar problem hai to exact error message share karo!** 🚀 