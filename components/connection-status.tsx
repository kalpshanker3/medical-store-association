"use client"

import { useState, useEffect } from "react"
import { testSupabaseConnection } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Database } from "lucide-react"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected" | "error">("loading")
  const [error, setError] = useState<string>("")
  const [lastChecked, setLastChecked] = useState<Date>(new Date())
  const [envStatus, setEnvStatus] = useState<{
    url: boolean
    key: boolean
    source: string
    envData: any
  }>({ url: false, key: false, source: "", envData: {} })

  const fetchEnvironmentVariables = async () => {
    try {
      const response = await fetch('/api/env')
      const result = await response.json()
      
      if (result.success) {
        const envData = result.data
        const url = 
          envData.medo_NEXT_PUBLIC_SUPABASE_URL || 
          envData.NEXT_PUBLIC_SUPABASE_URL ||
          envData.medo_SUPABASE_URL
        
        const key = 
          envData.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
          envData.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        const source = 
          envData.medo_NEXT_PUBLIC_SUPABASE_URL ? "Vercel (medo_)" :
          envData.NEXT_PUBLIC_SUPABASE_URL ? "Local" : "None"
        
        setEnvStatus({
          url: !!url,
          key: !!key,
          source,
          envData
        })
        
        console.log("🔍 Environment variables from API:", envData)
        
        return { url, key, source }
      }
    } catch (error) {
      console.error("❌ Failed to fetch environment variables:", error)
    }
    
    return { url: null, key: null, source: "None" }
  }

  const checkEnvironmentVariables = () => {
    const url = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.medo_SUPABASE_URL
    
    const key = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    const source = 
      process.env.medo_NEXT_PUBLIC_SUPABASE_URL ? "Vercel (medo_)" :
      process.env.NEXT_PUBLIC_SUPABASE_URL ? "Local" : "None"
    
    setEnvStatus({
      url: !!url,
      key: !!key,
      source,
      envData: {}
    })
    
    return { url, key, source }
  }

  const checkConnection = async () => {
    setStatus("loading")
    
    // First try to fetch from API
    const envCheck = await fetchEnvironmentVariables()
    
    if (!envCheck.url || !envCheck.key) {
      // Fallback to direct check
      const directCheck = checkEnvironmentVariables()
      
      if (!directCheck.url || !directCheck.key) {
        setStatus("error")
        setError("Environment variables missing")
        setLastChecked(new Date())
        return
      }
    }
    
    try {
      const { connected, error: connectionError } = await testSupabaseConnection()
      
      if (connected) {
        setStatus("connected")
        setError("")
      } else {
        setStatus("error")
        setError(connectionError || "Unknown error")
      }
    } catch (err) {
      setStatus("error")
      setError(String(err))
    }
    setLastChecked(new Date())
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "loading":
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "डेटाबेस कनेक्टेड"
      case "error":
        return "कनेक्शन त्रुटि"
      case "loading":
        return "कनेक्शन जांच रहा है..."
      default:
        return "अज्ञात स्थिति"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "loading":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-orange-100 text-orange-800 border-orange-200"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">Supabase कनेक्शन स्थिति</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          disabled={status === "loading"}
        >
          <RefreshCw className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`} />
          <span className="ml-2">रीफ्रेश</span>
        </Button>
      </div>

      {/* Environment Variables Status */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Environment Variables</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className={envStatus.url ? "text-green-600" : "text-red-600"}>
              {envStatus.url ? "✅" : "❌"}
            </span>
            <span>URL: {envStatus.url ? "Found" : "Missing"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={envStatus.key ? "text-green-600" : "text-red-600"}>
              {envStatus.key ? "✅" : "❌"}
            </span>
            <span>Key: {envStatus.key ? "Found" : "Missing"}</span>
          </div>
          <div className="text-blue-600">
            Source: {envStatus.source}
          </div>
          {Object.keys(envStatus.envData).length > 0 && (
            <div className="text-xs text-gray-600 mt-2">
              <details>
                <summary>View Environment Data</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(envStatus.envData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>

      <Badge className={getStatusColor()}>
        {getStatusText()}
      </Badge>

      {status === "error" && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>त्रुटि:</strong> {error}</p>
              <div className="text-sm space-y-1">
                <p>समाधान के लिए:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vercel environment variables जांचें</li>
                  <li>medo_NEXT_PUBLIC_SUPABASE_URL सेट है या नहीं</li>
                  <li>medo_NEXT_PUBLIC_SUPABASE_ANON_KEY सेट है या नहीं</li>
                  <li>Supabase प्रोजेक्ट active है या नहीं</li>
                  <li>डेटाबेस टेबल्स बनाए गए हैं या नहीं</li>
                  <li>App restart करें</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {status === "connected" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            सभी सिस्टम सामान्य रूप से काम कर रहे हैं! 🚀
            <br />
            <span className="text-sm text-green-600">Vercel से environment variables सफलतापूर्वक लोड हो गए हैं</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500">
        अंतिम जांच: {lastChecked.toLocaleTimeString()}
      </div>
    </div>
  )
} 