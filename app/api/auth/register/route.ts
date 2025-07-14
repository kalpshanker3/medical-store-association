import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    if (!userData.phone || !userData.password || !userData.name) {
      return NextResponse.json(
        { success: false, message: "नाम, फोन नंबर और पासवर्ड आवश्यक हैं" },
        { status: 400 }
      )
    }

    console.log("📝 API Registration attempt for:", userData.phone)

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', userData.phone)
      .single()

    if (existingUser) {
      console.log("❌ User already exists:", userData.phone)
      return NextResponse.json(
        { success: false, message: "यह फोन नंबर पहले से रजिस्टर्ड है" },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(userData.password, saltRounds)
    
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
      return NextResponse.json(
        { success: false, message: "रजिस्ट्रेशन में त्रुटि हुई" },
        { status: 500 }
      )
    }

    console.log("✅ User registered successfully:", newUser.name)
    return NextResponse.json({
      success: true,
      user: newUser,
      message: "रजिस्ट्रेशन सफल! कृपया प्रशासक से अनुमति लें।"
    })

  } catch (error) {
    console.error("❌ Error in register API:", error)
    return NextResponse.json(
      { success: false, message: "रजिस्ट्रेशन में त्रुटि हुई" },
      { status: 500 }
    )
  }
} 