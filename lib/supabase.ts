import { createClient } from "@supabase/supabase-js"

// Support multiple environment variable sources
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.medo_NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VERCEL_SUPABASE_URL ||
  process.env.SUPABASE_URL

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VERCEL_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing!")
  console.error("Checking all possible sources:")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Present" : "❌ Missing")
  console.error("medo_NEXT_PUBLIC_SUPABASE_URL:", process.env.medo_NEXT_PUBLIC_SUPABASE_URL ? "✅ Present" : "❌ Missing")
  console.error("VERCEL_SUPABASE_URL:", process.env.VERCEL_SUPABASE_URL ? "✅ Present" : "❌ Missing")
  console.error("SUPABASE_URL:", process.env.SUPABASE_URL ? "✅ Present" : "❌ Missing")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing")
  console.error("medo_NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing")
  console.error("VERCEL_SUPABASE_ANON_KEY:", process.env.VERCEL_SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing")
  console.error("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "✅ Present" : "❌ Missing")
  console.error("📝 Please check Vercel environment variables or create .env.local file")
} else {
  console.log("✅ Supabase environment variables found!")
  console.log("Source:", 
    process.env.VERCEL_SUPABASE_URL ? "Vercel" : 
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "Local" : 
    "Other"
  )
}

// Create Supabase client with fallback values to prevent crashes
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'medical-store-association'
      }
    }
  }
)

// Test connection function
export async function testSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    // Test basic connection
    const { data, error } = await supabase.from("users").select("count").limit(1)
    
    if (error) {
      console.error("❌ Supabase connection failed:", error.message)
      return { connected: false, error: error.message }
    }
    
    console.log("✅ Supabase connection successful!")
    return { connected: true }
  } catch (error) {
    console.error("❌ Supabase connection error:", error)
    return { connected: false, error: String(error) }
  }
}

// Initialize connection test on module load
if (typeof window !== 'undefined') {
  // Only run in browser
  testSupabaseConnection().then(({ connected, error }) => {
    if (connected) {
      console.log("🚀 Supabase ready for use!")
    } else {
      console.error("⚠️ Supabase not connected:", error)
    }
  })
}

// Database types
export interface User {
  id: string
  phone: string
  name: string
  age?: number
  alternate_phone?: string
  aadhar?: string
  store_name?: string
  location?: string
  gst_number?: string
  drug_license_number?: string
  drug_license_start_date?: string
  drug_license_end_date?: string
  food_license_number?: string
  food_license_start_date?: string
  food_license_end_date?: string
  account_number?: string
  ifsc?: string
  branch?: string
  nominee_name?: string
  nominee_relation?: string
  custom_nominee_relation?: string
  nominee_phone?: string
  nominee_account_number?: string
  nominee_ifsc?: string
  nominee_branch?: string
  status: "pending" | "approved" | "rejected"
  membership_status: "pending" | "active" | "inactive"
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface MembershipPayment {
  id: string
  user_id: string
  amount: number
  receipt_image_url?: string
  status: "pending" | "approved" | "rejected"
  payment_date: string
  approved_by?: string
  approved_at?: string
  created_at: string
  users?: User
}

export interface Donation {
  id: string
  donor_id: string
  recipient_name: string
  amount: number
  receipt_image_url?: string
  status: "pending" | "approved" | "rejected"
  donation_date: string
  approved_by?: string
  approved_at?: string
  created_at: string
  users?: User
}

export interface Accident {
  id: string
  member_id: string
  accident_type: string
  custom_accident_type?: string
  description?: string
  status: "active" | "resolved"
  created_by: string
  created_at: string
  updated_at: string
  users?: User
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "emergency"
  is_read: boolean
  created_by?: string
  created_at: string
}

export interface GalleryImage {
  id: string
  title: string
  image_url: string
  category: string
  uploaded_by?: string
  created_at: string
}

export interface OTPVerification {
  id: string
  phone: string
  otp: string
  expires_at: string
  verified: boolean
  created_at: string
}
