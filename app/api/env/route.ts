import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      // Supabase
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.medo_NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY,
      
      // Twilio
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER,
      twilioMessageServiceSid: process.env.TWILIO_MESSAGE_SERVICE_SID || process.env.medo_TWILIO_MESSAGE_SERVICE_SID,
      
      // Connection status
      hasSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.medo_NEXT_PUBLIC_SUPABASE_URL),
      hasTwilio: !!(process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID),
    }

    console.log("🔧 Environment variables status:")
    console.log("Supabase URL:", envVars.supabaseUrl ? "✅ Set" : "❌ Missing")
    console.log("Supabase Key:", envVars.supabaseAnonKey ? "✅ Set" : "❌ Missing")
    console.log("Twilio Account SID:", envVars.twilioAccountSid ? "✅ Set" : "❌ Missing")
    console.log("Twilio Phone:", envVars.twilioPhoneNumber ? "✅ Set" : "❌ Missing")
    console.log("Twilio Message Service SID:", envVars.twilioMessageServiceSid ? "✅ Set" : "❌ Missing")

    return NextResponse.json(envVars)
  } catch (error) {
    console.error("❌ Error fetching environment variables:", error)
    return NextResponse.json(
      { error: "Failed to fetch environment variables" },
      { status: 500 }
    )
  }
} 