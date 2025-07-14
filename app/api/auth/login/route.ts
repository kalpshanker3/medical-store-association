import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "फोन नंबर और पासवर्ड आवश्यक हैं" },
        { status: 400 }
      )
    }

    console.log("🔐 API Login attempt for:", phone)

    // Find user by phone number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (userError || !user) {
      console.log("❌ User not found:", phone)
      return NextResponse.json(
        { success: false, message: "फोन नंबर या पासवर्ड गलत है" },
        { status: 401 }
      )
    }

    // Check if user is approved
    if (user.status !== 'active' && user.status !== 'approved') {
      console.log("❌ User not approved:", user.status)
      return NextResponse.json(
        { success: false, message: "आपका अकाउंट अभी स्वीकृत नहीं हुआ है" },
        { status: 403 }
      )
    }

    // Verify password
    if (!user.password_hash) {
      console.log("❌ No password hash found")
      return NextResponse.json(
        { success: false, message: "पासवर्ड सेट नहीं है" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return NextResponse.json(
        { success: false, message: "फोन नंबर या पासवर्ड गलत है" },
        { status: 401 }
      )
    }

    console.log("✅ Login successful for user:", user.name)
    return NextResponse.json({
      success: true,
      user,
      message: "लॉगिन सफल"
    })

  } catch (error) {
    console.error("❌ Error in login API:", error)
    return NextResponse.json(
      { success: false, message: "लॉगिन में त्रुटि हुई" },
      { status: 500 }
    )
  }
} 