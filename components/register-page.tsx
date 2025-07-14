"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  User,
  Hash,
  Building,
  MapPin,
  CreditCard,
  Banknote,
  Shield,
  Calendar,
  FileText,
  Heart,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../lib/types"
import { registerUser } from "../lib/auth"
import { supabase } from "@/lib/supabase"

export default function RegisterPage(appState: AppState) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    alternatePhone: "",
    age: "",
    aadhar: "",
    location: "",
    storeName: "",
    gstNumber: "",
    drugLicenseNumber: "",
    drugLicenseStartDate: "",
    drugLicenseEndDate: "",
    foodLicenseNumber: "",
    foodLicenseStartDate: "",
    foodLicenseEndDate: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    nomineeName: "",
    nomineeRelation: "",
    customNomineeRelation: "",
    nomineePhone: "",
    nomineeAccountNumber: "",
    nomineeIfsc: "",
    nomineeBranch: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Step 1 submit handler
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      setError("कृपया सभी फ़ील्ड भरें")
      return
    }
    if (formData.phone.length !== 10) {
      setError("कृपया 10 अंकों का सही फ़ोन नंबर डालें")
      return
    }
    if (formData.password.length < 6) {
      setError("पासवर्ड कम से कम 6 अक्षर का होना चाहिए")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("पासवर्ड मेल नहीं खाते")
      return
    }
    setStep(2)
  }

  // Step 2 submit handler (final registration)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    // Validate all fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        setError(`कृपया सभी फ़ील्ड भरें (${key})`)
        return
      }
    }
    setIsLoading(true)
    try {
      // Register with Supabase Auth using phone as email
      const email = `${formData.phone}@example.com`
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: formData.password
      })
      if (authError || !authData.user) {
        setError("रजिस्ट्रेशन में त्रुटि: " + (authError?.message || ""))
        setIsLoading(false)
        return
      }
      // Insert user profile in users table
      const userData = {
        id: authData.user.id,
        ...formData,
        status: "pending",
        role: "user"
      }
      const { error: dbError } = await supabase.from('users').insert(userData)
      if (dbError) {
        setError("रजिस्ट्रेशन में त्रुटि: " + dbError.message)
        setIsLoading(false)
        return
      }
      appState.setUser(userData)
      appState.setIsLoggedIn(true)
      setSuccess("रजिस्ट्रेशन सफल! आपका आवेदन समीक्षा में है।")
      appState.setCurrentPage("status")
    } catch (error) {
      setError("रजिस्ट्रेशन में त्रुटि हुई")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <Card className="max-w-5xl mx-auto shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white via-blue-50 to-cyan-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-2xl sm:rounded-t-3xl p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <User className="h-6 w-6 sm:h-8 sm:w-8" />
              <span>नया सदस्य रजिस्ट्रेशन</span>
              <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    फ़ोन नंबर *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    पासवर्ड *
                  </label>
                  <Input
                    required
                    type="password"
                    placeholder="पासवर्ड (कम से कम 6 अक्षर)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    पासवर्ड की पुष्टि *
                  </label>
                  <Input
                    required
                    type="password"
                    placeholder="पासवर्ड दोबारा लिखें"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                  />
                </div>
                {error && <div className="text-red-600 font-bold text-center">{error}</div>}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
                  >
                    {isLoading ? "जांच हो रही है..." : "आगे बढ़ें"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
                {/* All other required fields, similar to your original form, each with required and * */}
                {/* ... (reuse your previous form fields here, all required) ... */}
                {/* Example for name: */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    नाम *
                  </label>
                  <Input
                    required
                    placeholder="अपना पूरा नाम लिखें"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                  />
                </div>
                {/* Repeat for all other fields, all required, as in your previous form */}
                {/* ... */}
                {error && <div className="text-red-600 font-bold text-center">{error}</div>}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
                  >
                    {isLoading ? "रजिस्टर हो रहा है..." : "रजिस्टर करें"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
