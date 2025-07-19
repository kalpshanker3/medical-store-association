"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Sparkles } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../lib/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StatusPage(appState: AppState) {
  const router = useRouter()

  // Redirect to home if user is approved
  useEffect(() => {
    if (appState.isLoggedIn && appState.user && appState.user.status === "approved") {
      router.push("/")
    }
  }, [appState.isLoggedIn, appState.user, router])

  // Don't render anything if user is approved (will redirect)
  if (appState.isLoggedIn && appState.user && appState.user.status === "approved") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto text-center shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white via-green-50 to-emerald-50 transform hover:scale-105 transition-all duration-500">
          <CardContent className="p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <div className="mb-6">
              <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2 animate-bounce" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                🎉 बधाई हो! 🎉
              </h2>
              <p className="text-xl text-green-800 font-semibold">आपका फॉर्म सफलतापूर्वक जमा हो गया है</p>
            </div>

            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-orange-800">वर्तमान स्थिति:</span>
              </div>
              <Badge className="text-lg px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full shadow-lg font-bold">
                ⏳ {appState.user?.status}
              </Badge>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                🔍 आपका आवेदन समीक्षा के लिए भेजा गया है।
                <br />
                <span className="text-blue-600 font-bold">प्रशासन द्वारा सत्यापन</span> के बाद आपको सूचना दी जाएगी।
              </p>
            </div>

            <Button
              onClick={() => router.push("/")}
              className="w-full h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              🏠 होम पेज पर जाएं
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
