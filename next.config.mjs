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
    // Expose environment variables to the browser
    medo_NEXT_PUBLIC_SUPABASE_URL: process.env.medo_NEXT_PUBLIC_SUPABASE_URL,
    medo_NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    medo_SUPABASE_URL: process.env.medo_SUPABASE_URL,
    medo_SUPABASE_SERVICE_ROLE_KEY: process.env.medo_SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
