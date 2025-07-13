import { createClient } from "@supabase/supabase-js"

// Support both with and without medo_ prefix
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.medo_NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
