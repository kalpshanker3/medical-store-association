import { supabase, testSupabaseConnection } from "./supabase"
import type { User } from "./supabase"

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

// Send OTP to phone number
export async function sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("📱 Sending OTP to:", phone)
    
    // Check Vercel environment variables first
    const supabaseUrl = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.VERCEL_SUPABASE_URL
    
    const supabaseAnonKey = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.VERCEL_SUPABASE_ANON_KEY
    
    console.log("🔍 Environment check:")
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

    // Check if we can reach Supabase
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)
      if (error) {
        console.log("⚠️ Database not accessible, using offline mode")
        return { success: true, message: "OTP भेजा गया है (ऑफ़लाइन मोड) - 123456" }
      } else {
        console.log("✅ Database accessible")
        return { success: true, message: "OTP भेजा गया है (टेस्ट मोड) - 123456" }
      }
    } catch (error) {
      console.log("⚠️ Network error, using offline mode")
      return { success: true, message: "OTP भेजा गया है (ऑफ़लाइन मोड) - 123456" }
    }
  } catch (error) {
    console.error("❌ Error sending OTP:", error)
    return { success: false, message: "OTP भेजने में त्रुटि" }
  }
}

// Verify OTP and login user
export async function verifyOTP(
  phone: string,
  otp: string,
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    console.log("🔐 Verifying OTP for:", phone, "OTP:", otp)
    
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
    
    // For development purposes, accept 123456 as valid OTP
    if (otp === "123456") {
      console.log("✅ Test OTP accepted, checking user in database...")
      
      // Check if user exists
      const { data: user, error: userError } = await supabase.from("users").select("*").eq("phone", phone).single()

      if (userError) {
        console.log("📝 User not found, this is a new registration")
        return { success: false, message: "यह फ़ोन नंबर रजिस्टर्ड नहीं है" }
      }

      if (user) {
        console.log("✅ User found:", user.name)
        // Set user context for RLS
        await setUserContext(phone)
        return { success: true, user, message: "सफलतापूर्वक लॉग इन हो गए" }
      }
    }

    // For any other OTP, return error
    return { success: false, message: "गलत OTP! कृपया 123456 डालें" }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error)
    return { success: false, message: "OTP सत्यापन में त्रुटि" }
  }
}

// Register new user
export async function registerUser(
  userData: Partial<User>,
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
    
    console.log("🔍 Vercel Environment Check for Registration:")
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

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        ...userData,
        status: "pending",
        membership_status: "pending",
        role: "user",
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Registration error:", error)
      throw error
    }

    // Set user context for RLS
    if (userData.phone) {
      await setUserContext(userData.phone)
    }

    console.log("✅ User registered successfully:", user.name)
    return { success: true, user, message: "रजिस्ट्रेशन सफल" }
  } catch (error) {
    console.error("❌ Error registering user:", error)
    return { success: false, message: "रजिस्ट्रेशन में त्रुटि" }
  }
}

// Clean expired OTPs (utility function)
export async function cleanExpiredOTPs(): Promise<void> {
  try {
    await supabase.rpc("clean_expired_otps")
  } catch (error) {
    console.error("Error cleaning expired OTPs:", error)
  }
}
