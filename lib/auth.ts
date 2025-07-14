import { supabase, testSupabaseConnection } from "./supabase"
import type { User } from "./supabase"
import bcrypt from "bcrypt"

// Set current user context for RLS
async function setUserContext(phone: string) {
  try {
    await supabase.rpc("set_config", {
      setting_name: "app.current_user_phone",
      setting_value: phone,
      is_local: false,
    })
  } catch (error) {
    console.log("Context setting not available, using alternative method")
  }
}

// Hash password using bcrypt
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Verify password using bcrypt
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Login user with phone and password
export async function loginUser(
  phone: string,
  password: string,
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    console.log("🔐 Logging in user:", phone)
    
    // Check Vercel environment variables
    const supabaseUrl = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.VERCEL_SUPABASE_URL
    
    const supabaseAnonKey = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.VERCEL_SUPABASE_ANON_KEY
    
    console.log("🔍 Vercel Environment Check:")
    console.log("medo_NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing")
    console.log("medo_NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Found" : "❌ Missing")
    
    // First test Supabase connection
    const { connected, error: connectionError } = await testSupabaseConnection()
    
    if (!connected) {
      console.error("❌ Database not connected:", connectionError)
      return { 
        success: false, 
        message: "डेटाबेस कनेक्शन त्रुटि - कृपया Vercel environment variables जांचें" 
      }
    }
    
    // Find user by phone number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (userError || !user) {
      console.log("❌ User not found:", phone)
      return { success: false, message: "फोन नंबर या पासवर्ड गलत है" }
    }

    // Check if user is approved
    if (user.status !== 'active' && user.status !== 'approved') {
      console.log("❌ User not approved:", user.status)
      return { success: false, message: "आपका अकाउंट अभी स्वीकृत नहीं हुआ है" }
    }

    // Verify password
    if (!user.password_hash) {
      console.log("❌ No password hash found")
      return { success: false, message: "पासवर्ड सेट नहीं है" }
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash)
    
    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return { success: false, message: "फोन नंबर या पासवर्ड गलत है" }
    }

    console.log("✅ Login successful for user:", user.name)
    return { success: true, user, message: "लॉगिन सफल" }

  } catch (error) {
    console.error("❌ Error in loginUser:", error)
    return { success: false, message: "लॉगिन में त्रुटि हुई" }
  }
}

// Register new user with password
export async function registerUser(
  userData: Partial<User> & { password: string },
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    console.log("📝 Registering new user:", userData.phone)
    
    // Check Vercel environment variables
    const supabaseUrl = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.VERCEL_SUPABASE_URL
    
    const supabaseAnonKey = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.VERCEL_SUPABASE_ANON_KEY
    
    console.log("🔍 Vercel Environment Check:")
    console.log("medo_NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing")
    console.log("medo_NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Found" : "❌ Missing")
    
    // First test Supabase connection
    const { connected, error: connectionError } = await testSupabaseConnection()
    
    if (!connected) {
      console.error("❌ Database not connected:", connectionError)
      return { 
        success: false, 
        message: "डेटाबेस कनेक्शन त्रुटि - कृपया Vercel environment variables जांचें" 
      }
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', userData.phone)
      .single()

    if (existingUser) {
      console.log("❌ User already exists:", userData.phone)
      return { success: false, message: "यह फोन नंबर पहले से रजिस्टर्ड है" }
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password)
    
    // Prepare user data for insertion
    const newUserData = {
      name: userData.name,
      phone: userData.phone,
      password_hash: passwordHash,
      store_name: userData.store_name,
      location: userData.location,
      aadhar: userData.aadhar,
      gst_number: userData.gst_number,
      drug_license_number: userData.drug_license_number,
      food_license_number: userData.food_license_number,
      account_number: userData.account_number,
      ifsc: userData.ifsc,
      branch: userData.branch,
      nominee_name: userData.nominee_name,
      nominee_relation: userData.nominee_relation,
      nominee_phone: userData.nominee_phone,
      nominee_account_number: userData.nominee_account_number,
      nominee_ifsc: userData.nominee_ifsc,
      nominee_branch: userData.nominee_branch,
      role: 'user',
      status: 'pending',
    }

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(newUserData)
      .select()
      .single()

    if (insertError) {
      console.error("❌ Failed to insert user:", insertError)
      return { success: false, message: "रजिस्ट्रेशन में त्रुटि हुई" }
    }

    console.log("✅ User registered successfully:", newUser.name)
    return { 
      success: true, 
      user: newUser, 
      message: "रजिस्ट्रेशन सफल! कृपया प्रशासक से अनुमति लें।" 
    }

  } catch (error) {
    console.error("❌ Error in registerUser:", error)
    return { success: false, message: "रजिस्ट्रेशन में त्रुटि हुई" }
  }
}

// Clean expired OTPs (keeping for compatibility)
export async function cleanExpiredOTPs(): Promise<void> {
  try {
    const { error } = await supabase
      .from('otp_verifications')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error("Error cleaning expired OTPs:", error)
    } else {
      console.log("Expired OTPs cleaned successfully")
    }
  } catch (error) {
    console.error("Error in cleanExpiredOTPs:", error)
  }
}
