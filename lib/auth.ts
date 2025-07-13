import { supabase } from "./supabase"
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
    console.log("Sending OTP to:", phone)
    
    // Check if Supabase is properly configured (support both with and without medo_ prefix)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.medo_NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase configuration missing")
      return { success: false, message: "डेटाबेस कॉन्फ़िगरेशन त्रुटि" }
    }

    // Test database connection
    const { data: testData, error: testError } = await supabase.from("otp_verifications").select("count").limit(1)
    if (testError) {
      console.error("Database connection test failed:", testError)
      return { success: false, message: "डेटाबेस कनेक्शन त्रुटि" }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiry time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    console.log("Generated OTP:", otp, "Expires at:", expiresAt)

    // Delete any existing OTP for this phone
    const { error: deleteError } = await supabase.from("otp_verifications").delete().eq("phone", phone)
    if (deleteError) {
      console.log("Delete error (non-critical):", deleteError)
    }

    // Insert new OTP
    const { error } = await supabase.from("otp_verifications").insert({
      phone,
      otp,
      expires_at: expiresAt,
    })

    if (error) {
      console.error("Insert OTP error:", error)
      return { success: false, message: `OTP भेजने में त्रुटि: ${error.message}` }
    }

    // In production, you would send SMS here
    console.log(`OTP for ${phone}: ${otp}`)

    return { success: true, message: "OTP भेजा गया है" }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return { success: false, message: "OTP भेजने में त्रुटि" }
  }
}

// Verify OTP and login user
export async function verifyOTP(
  phone: string,
  otp: string,
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    // For development purposes, accept 123456 as valid OTP
    if (otp === "123456") {
      // Check if user exists
      const { data: user, error: userError } = await supabase.from("users").select("*").eq("phone", phone).single()

      if (userError && userError.code !== "PGRST116") {
        throw userError
      }

      if (user) {
        // Set user context for RLS
        await setUserContext(phone)

        // Mark OTP as verified (if exists)
        await supabase.from("otp_verifications").update({ verified: true }).eq("phone", phone).eq("otp", otp)

        return { success: true, user, message: "सफलतापूर्वक लॉग इन हो गए" }
      } else {
        return { success: false, message: "यह फ़ोन नंबर रजिस्टर्ड नहीं है" }
      }
    }

    // Check OTP in database
    const { data: otpData, error: otpError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", phone)
      .eq("otp", otp)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .single()

    if (otpError || !otpData) {
      return { success: false, message: "गलत या समाप्त OTP" }
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("phone", phone).single()

    if (userError) {
      return { success: false, message: "यह फ़ोन नंबर रजिस्टर्ड नहीं है" }
    }

    // Set user context for RLS
    await setUserContext(phone)

    // Mark OTP as verified
    await supabase.from("otp_verifications").update({ verified: true }).eq("id", otpData.id)

    return { success: true, user, message: "सफलतापूर्वक लॉग इन हो गए" }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return { success: false, message: "OTP सत्यापन में त्रुटि" }
  }
}

// Register new user
export async function registerUser(
  userData: Partial<User>,
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
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

    if (error) throw error

    // Set user context for RLS
    if (userData.phone) {
      await setUserContext(userData.phone)
    }

    return { success: true, user, message: "रजिस्ट्रेशन सफल" }
  } catch (error) {
    console.error("Error registering user:", error)
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
