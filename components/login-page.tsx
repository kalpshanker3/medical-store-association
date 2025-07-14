"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Shield, CheckCircle, Eye, EyeOff } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../lib/types"
import { loginUser } from "../lib/auth"
import { supabase } from "@/lib/supabase"

export default function LoginPage(appState: AppState) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.phone || formData.phone.length !== 10) {
      setError("कृपया 10 अंकों का सही फ़ोन नंबर डालें")
      return
    }
    if (!formData.password || formData.password.length < 6) {
      setError("पासवर्ड कम से कम 6 अक्षर का होना चाहिए")
      return
    }
    setIsLoading(true)
    try {
      // Use phone as email for Supabase Auth
      const email = `${formData.phone}@example.com`
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password
      })
      if (authError || !data.session) {
        setError("फोन नंबर या पासवर्ड गलत है")
        setIsLoading(false)
        return
      }
      // Fetch user profile from DB
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()
      if (userProfile) {
        appState.setUser(userProfile)
        appState.setIsLoggedIn(true)
        setError("")
        appState.setCurrentPage("status")
      } else {
        setError("यूज़र प्रोफाइल नहीं मिली")
      }
    } catch (error) {
      setError("लॉगिन में त्रुटि हुई")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      <Navbar />
      <div className="container-responsive py-8 flex items-center justify-center min-h-[80vh] relative">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-xl border border-white/20 hover:shadow-3xl transition-all duration-500">
          <CardHeader className="bg-gradient-to-r from-slate-700 via-indigo-600 to-purple-600 text-white rounded-t-3xl relative">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 drop-shadow-lg" />
              <span className="drop-shadow-sm">लॉगिन</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 relative">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 text-red-800 rounded-xl p-3 text-center font-semibold">
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  फ़ोन नंबर (व्हाट्सऐप नंबर)
                </label>
                <Input
                  type="tel"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 h-14 text-lg backdrop-blur-sm bg-white/80 font-medium text-black"
                  required
                  maxLength={10}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  पासवर्ड
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="अपना पासवर्ड लिखें"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 h-14 text-lg backdrop-blur-sm bg-white/80 font-medium text-black pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-700"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold border-2 border-white/20 backdrop-blur-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>लॉगिन हो रहा है...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6" />
                    <span>लॉगिन करें</span>
                  </div>
                )}
              </Button>
              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => appState.setCurrentPage("register")}
                  className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-2xl font-semibold px-6 py-3 transition-all duration-300"
                >
                  नया अकाउंट बनाएं
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
