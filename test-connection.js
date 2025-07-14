// Simple Supabase Connection Test Script
// Run this with: node test-connection.js

const { createClient } = require('@supabase/supabase-js')

// Get environment variables with Vercel support
const supabaseUrl = 
  process.env.medo_NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.medo_SUPABASE_URL ||
  process.env.VERCEL_SUPABASE_URL

const supabaseAnonKey = 
  process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VERCEL_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('=====================================')

// Check environment variables
console.log('📋 Environment Variables Check:')
console.log('medo_NEXT_PUBLIC_SUPABASE_URL:', process.env.medo_NEXT_PUBLIC_SUPABASE_URL ? '✅ Present' : '❌ Missing')
console.log('medo_NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing')
console.log('medo_SUPABASE_URL:', process.env.medo_SUPABASE_URL ? '✅ Present' : '❌ Missing')
console.log('medo_SUPABASE_SERVICE_ROLE_KEY:', process.env.medo_SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Environment variables missing!')
  console.log('Please check Vercel environment variables:')
  console.log('medo_NEXT_PUBLIC_SUPABASE_URL')
  console.log('medo_NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('\n✅ Environment variables found!')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')

// Create client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🔗 Testing basic connection...')
    
    // Test 1: Basic health check
    const { data: healthData, error: healthError } = await supabase.from('users').select('count').limit(1)
    
    if (healthError) {
      console.log('❌ Health check failed:', healthError.message)
      
      // Test 2: Try RPC call
      console.log('\n🔄 Trying RPC call...')
      const { data: rpcData, error: rpcError } = await supabase.rpc('version')
      
      if (rpcError) {
        console.log('❌ RPC call failed:', rpcError.message)
        console.log('\n🔧 Possible solutions:')
        console.log('1. Check if Supabase project is active')
        console.log('2. Verify URL and key are correct')
        console.log('3. Check if database tables exist')
        console.log('4. Verify network connection')
        console.log('5. Check Vercel environment variables')
      } else {
        console.log('✅ RPC call successful:', rpcData)
      }
    } else {
      console.log('✅ Health check successful:', healthData)
      
      // Test 3: Get user count
      const { count, error: countError } = await supabase.from('users').select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.log('⚠️ Count query failed:', countError.message)
      } else {
        console.log('📊 Total users in database:', count)
      }
      
      // Test 4: Test authentication
      console.log('\n🔐 Testing authentication...')
      const { data: authData, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        console.log('⚠️ Auth test failed:', authError.message)
      } else {
        console.log('✅ Authentication working:', authData.session ? 'Session found' : 'No session')
      }
    }
    
    console.log('\n🎉 Connection test completed!')
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
    
    if (error.message.includes('fetch')) {
      console.log('\n🌐 Network error detected!')
      console.log('Check your internet connection')
    } else if (error.message.includes('CORS')) {
      console.log('\n🔒 CORS error detected!')
      console.log('Check Supabase allowed origins')
    } else if (error.message.includes('Unauthorized')) {
      console.log('\n🔑 Authentication error!')
      console.log('Check your Supabase anon key')
    }
  }
}

// Run test
testConnection() 