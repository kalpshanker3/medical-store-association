import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    // Get Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.medo_TWILIO_AUTH_TOKEN
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("❌ Twilio credentials missing")
      return NextResponse.json(
        { success: false, error: "Twilio credentials not configured" },
        { status: 500 }
      )
    }

    console.log("📱 Sending SMS via Twilio:")
    console.log("Account SID:", accountSid)
    console.log("To:", to)
    console.log("From:", twilioPhone)
    console.log("Message:", message)

    // Import Twilio dynamically
    const twilio = require('twilio')(accountSid, authToken)
    
    // Send SMS via Twilio
    const result = await twilio.messages.create({
      body: message,
      from: twilioPhone,
      to: to
    })
    
    console.log("✅ SMS sent via Twilio:", result.sid)

    return NextResponse.json({
      success: true,
      message: "SMS sent successfully",
      sid: result.sid
    })

  } catch (error) {
    console.error("❌ Error in send-sms API:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 }
    )
  }
} 