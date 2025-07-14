"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"
import { loginUser } from "../lib/auth"

export default function LoginPage(appState: AppState) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.phone.trim()) {
      setError("फोन नंबर आवश्यक है")
      return false
    }
    if (formData.phone.length !== 10) {
      setError("फोन नंबर 10 अंकों का होना चाहिए")
      return false
    }
    if (!formData.password) {
      setError("पासवर्ड आवश्यक है")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await loginUser(formData.phone, formData.password)

      if (result.success && result.user) {
        // Set user data in app state
        appState.setUser({
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          storeName: result.user.store_name || "",
          location: result.user.location || "",
          role: result.user.role || "user",
          status: result.user.status || "active",
        })
        appState.setIsLoggedIn(true)
        
        // Redirect based on role
        if (result.user.role === "admin") {
          appState.setCurrentPage("admin")
        } else {
          appState.setCurrentPage("home")
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("लॉगिन में त्रुटि हुई")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar {...appState} />

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <Card className="max-w-md mx-auto shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white via-slate-50 to-gray-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-3">
              <LogIn className="h-6 w-6 sm:h-8 sm:w-8" />
              लॉगिन
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">फोन नंबर *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10 अंकों का नंबर"
                  maxLength={10}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">पासवर्ड *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="अपना पासवर्ड लिखें"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appState.setCurrentPage("register")}
                  className="flex items-center gap-2 mx-auto"
                >
                  <UserPlus className="h-4 w-4" />
                  नया अकाउंट बनाएं
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
