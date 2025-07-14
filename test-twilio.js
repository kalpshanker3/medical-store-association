// Test script for Twilio SMS functionality
const twilio = require('twilio');

async function testTwilioSMS() {
  try {
    console.log("🧪 Testing Twilio SMS functionality...");
    
    // Get credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.medo_TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER;
    const messageServiceSid = process.env.TWILIO_MESSAGE_SERVICE_SID || process.env.medo_TWILIO_MESSAGE_SERVICE_SID;
    
    console.log("📋 Credentials check:");
    console.log("Account SID:", accountSid ? "✅ Found" : "❌ Missing");
    console.log("Auth Token:", authToken ? "✅ Found" : "❌ Missing");
    console.log("Phone Number:", twilioPhone ? "✅ Found" : "❌ Missing");
    console.log("Message Service SID:", messageServiceSid ? "✅ Found" : "❌ Missing");
    
    if (!accountSid || !authToken) {
      console.error("❌ Twilio credentials missing!");
      return;
    }
    
    // Initialize Twilio client
    const client = twilio(accountSid, authToken);
    
    // Test message data
    const testPhone = "+919876543210"; // Replace with your test phone number
    const testMessage = "🧪 Test SMS from Medical Store Association\n\nThis is a test message to verify Twilio integration.";
    
    console.log("📱 Sending test SMS...");
    console.log("To:", testPhone);
    console.log("Message:", testMessage);
    
    // Prepare message data
    const messageData = {
      body: testMessage,
      to: testPhone
    };
    
    // Use Message Service SID if available
    if (messageServiceSid) {
      messageData.messagingServiceSid = messageServiceSid;
      console.log("Using Message Service SID:", messageServiceSid);
    } else {
      messageData.from = twilioPhone;
      console.log("Using Phone Number:", twilioPhone);
    }
    
    // Send SMS
    const result = await client.messages.create(messageData);
    
    console.log("✅ SMS sent successfully!");
    console.log("Message SID:", result.sid);
    console.log("Status:", result.status);
    console.log("Price:", result.price);
    
  } catch (error) {
    console.error("❌ Error testing Twilio SMS:", error);
    console.error("Error details:", error.message);
    
    if (error.code) {
      console.error("Twilio Error Code:", error.code);
    }
  }
}

// Run the test
testTwilioSMS(); 