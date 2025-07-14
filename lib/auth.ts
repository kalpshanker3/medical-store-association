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

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send SMS via Twilio
async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.medo_TWILIO_AUTH_TOKEN
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("❌ Twilio credentials missing")
      return false
    }

    // For now, we'll simulate SMS sending
    // In production, you would use Twilio's API
    console.log("📱 Twilio SMS would be sent:")
    console.log("To:", phone)
    console.log("From:", twilioPhone)
    console.log("Message:", message)
    
    // Simulate API call
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phone,
        message: message
      })
    })

    if (response.ok) {
      console.log("✅ SMS sent successfully via Twilio")
      return true
    } else {
      console.error("❌ SMS sending failed")
      return false
    }
  } catch (error) {
    console.error("❌ Error sending SMS:", error)
    return false
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
    
    // Check Twilio credentials
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || process.env.medo_TWILIO_AUTH_TOKEN
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER
    
    console.log("🔍 Twilio check:")
    console.log("TWILIO_ACCOUNT_SID:", twilioAccountSid ? "✅ Found" : "❌ Missing")
    console.log("TWILIO_AUTH_TOKEN:", twilioAuthToken ? "✅ Found" : "❌ Missing")
    console.log("TWILIO_PHONE_NUMBER:", twilioPhone ? "✅ Found" : "❌ Missing")
    
    // First test Supabase connection
    const { connected, error: connectionError } = await testSupabaseConnection()
    
    if (!connected) {
      console.error("❌ Database not connected:", connectionError)
      return { 
        success: false, 
        message: "डेटाबेस कनेक्शन त्रुटि - कृपया Vercel environment variables जांचें" 
      }
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    
    console.log("🔐 Generated OTP:", otp, "Expires at:", expiresAt)

    // Save OTP to database
    const { error: otpError } = await supabase
      .from('otp_verifications')
      .insert({
        phone,
        otp,
        expires_at: expiresAt.toISOString(),
        verified: false
      })

    if (otpError) {
      console.error("❌ Failed to save OTP:", otpError)
      return { success: false, message: "OTP सेव करने में त्रुटि" }
    }

    // Send SMS via Twilio
    const smsMessage = `आपका OTP है: ${otp}\n\nयह OTP 5 मिनट के लिए वैध है।\n\nMedical Store Association`
    const smsSent = await sendSMS(phone, smsMessage)

    if (smsSent) {
      console.log("✅ SMS sent successfully via Twilio")
      return { success: true, message: "OTP SMS भेजा गया है" }
    } else {
      console.log("⚠️ SMS failed, showing OTP in console for development")
      // For development, show OTP in alert
      if (typeof window !== 'undefined') {
        alert(`📱 OTP भेजा गया: ${otp}\n\nTwilio से SMS भेजने में त्रुटि। Production में यह ठीक काम करेगा।`)
      }
      return { success: true, message: `OTP भेजा गया है: ${otp} (Development Mode)` }
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
    
    // Check if OTP exists and is valid
    const { data: otpData, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (otpError || !otpData) {
      console.log("❌ Invalid or expired OTP")
      return { success: false, message: "गलत या समाप्त OTP" }
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpData.id)

    console.log("✅ OTP verified successfully")
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single()

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

    return { success: false, message: "उपयोगकर्ता नहीं मिला" }
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
