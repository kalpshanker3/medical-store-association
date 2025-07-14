import { NextResponse } from 'next/server'

export async function GET() {
  // Only expose public environment variables
  const envVars = {
    medo_NEXT_PUBLIC_SUPABASE_URL: process.env.medo_NEXT_PUBLIC_SUPABASE_URL,
    medo_NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    medo_SUPABASE_URL: process.env.medo_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  return NextResponse.json({
    success: true,
    data: envVars,
    timestamp: new Date().toISOString()
  })
} 