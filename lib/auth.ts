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

// Login user with phone and password via API
export async function loginUser(
  phone: string,
  password: string,
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    console.log("🔐 Logging in user:", phone)
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password })
    })

    const result = await response.json()

    if (result.success) {
      console.log("✅ Login successful for user:", result.user.name)
      return { success: true, user: result.user, message: result.message }
    } else {
      console.log("❌ Login failed:", result.message)
      return { success: false, message: result.message }
    }

  } catch (error) {
    console.error("❌ Error in loginUser:", error)
    return { success: false, message: "लॉगिन में त्रुटि हुई" }
  }
}

// Register new user with password via API
export async function registerUser(
  userData: Partial<User> & { password: string },
): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    console.log("📝 Registering new user:", userData.phone)
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    const result = await response.json()

    if (result.success) {
      console.log("✅ User registered successfully:", result.user.name)
      return { success: true, user: result.user, message: result.message }
    } else {
      console.log("❌ Registration failed:", result.message)
      return { success: false, message: result.message }
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
