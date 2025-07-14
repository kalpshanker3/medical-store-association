/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.medo_NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    
    // Twilio
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || process.env.medo_TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || process.env.medo_TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || process.env.medo_TWILIO_PHONE_NUMBER,
    TWILIO_MESSAGE_SERVICE_SID: process.env.TWILIO_MESSAGE_SERVICE_SID || process.env.medo_TWILIO_MESSAGE_SERVICE_SID,
  },
  // Alternative method to expose environment variables
  publicRuntimeConfig: {
    medo_NEXT_PUBLIC_SUPABASE_URL: process.env.medo_NEXT_PUBLIC_SUPABASE_URL,
    medo_NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    medo_SUPABASE_URL: process.env.medo_SUPABASE_URL,
    medo_SUPABASE_SERVICE_ROLE_KEY: process.env.medo_SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
