import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    // Get Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.medo_TWILIO_AUTH_TOKEN
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER
    const messageServiceSid = process.env.TWILIO_MESSAGE_SERVICE_SID || process.env.medo_TWILIO_MESSAGE_SERVICE_SID

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("❌ Twilio credentials missing")
      return NextResponse.json(
        { success: false, error: "Twilio credentials not configured" },
        { status: 500 }
      )
    }

    console.log("📱 Sending SMS via Twilio:")
    console.log("Account SID:", accountSid)
    console.log("Message Service SID:", messageServiceSid)
    console.log("To:", to)
    console.log("From:", twilioPhone)
    console.log("Message:", message)

    // Import Twilio dynamically
    const twilio = require('twilio')(accountSid, authToken)
    
    // Send SMS via Twilio with Message Service SID if available
    const messageData: any = {
      body: message,
      to: to
    }

    // Use Message Service SID if available, otherwise use phone number
    if (messageServiceSid) {
      messageData.messagingServiceSid = messageServiceSid
    } else {
      messageData.from = twilioPhone
    }
    
    const result = await twilio.messages.create(messageData)
    
    console.log("✅ SMS sent via Twilio:", result.sid)
    console.log("Message Status:", result.status)

    return NextResponse.json({
      success: true,
      message: "SMS sent successfully",
      sid: result.sid,
      status: result.status
    })

  } catch (error) {
    console.error("❌ Error in send-sms API:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 }
    )
  }
} 