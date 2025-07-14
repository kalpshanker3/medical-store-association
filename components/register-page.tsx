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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
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
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    setIsLoading(true)
    try {
      // 1. Register with Supabase Auth using phone as email
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
      // 2. Insert user profile in users table
      const userData = {
        id: authData.user.id,
        name: formData.name,
        phone: formData.phone,
        alternate_phone: formData.alternatePhone,
        age: Number.parseInt(formData.age),
        aadhar: formData.aadhar,
        location: formData.location,
        store_name: formData.storeName,
        gst_number: formData.gstNumber,
        drug_license_number: formData.drugLicenseNumber,
        drug_license_start_date: formData.drugLicenseStartDate,
        drug_license_end_date: formData.drugLicenseEndDate,
        food_license_number: formData.foodLicenseNumber,
        food_license_start_date: formData.foodLicenseStartDate,
        food_license_end_date: formData.foodLicenseEndDate,
        account_number: formData.accountNumber,
        ifsc: formData.ifsc,
        branch: formData.branch,
        nominee_name: formData.nomineeName,
        nominee_relation:
          formData.nomineeRelation === "अन्य" ? formData.customNomineeRelation : formData.nomineeRelation,
        nominee_phone: formData.nomineePhone,
        nominee_account_number: formData.nomineeAccountNumber,
        nominee_ifsc: formData.nomineeIfsc,
        nominee_branch: formData.nomineeBranch,
        status: "pending",
        membership_status: "pending",
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
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  व्यक्तिगत जानकारी
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
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
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      आयु *
                    </label>
                    <Input
                      required
                      type="number"
                      placeholder="आपकी उम्र"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      फ़ोन नंबर (व्हाट्सऐप नंबर) *
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
                      <Phone className="h-4 w-4" />
                      वैकल्पिक नंबर
                    </label>
                    <Input
                      type="tel"
                      placeholder="दूसरा मोबाइल नंबर (वैकल्पिक)"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    आधार नंबर *
                  </label>
                  <Input
                    required
                    placeholder="1234-5678-9012"
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                  />
                </div>
                {/* Password Fields */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      पासवर्ड *
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="पासवर्ड (कम से कम 6 अक्षर)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      पासवर्ड की पुष्टि *
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="पासवर्ड दोबारा लिखें"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg text-black pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Business Information */}
              <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  व्यापार जानकारी
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      स्थान *
                    </label>
                    <Input
                      required
                      placeholder="शहर/गांव"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      स्टोर का नाम *
                    </label>
                    <Input
                      required
                      placeholder="मेडिकल स्टोर का नाम"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      GST नंबर
                    </label>
                    <Input
                      placeholder="GST नंबर"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      दवा लाइसेंस नंबर
                    </label>
                    <Input
                      placeholder="दवा लाइसेंस नंबर"
                      value={formData.drugLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, drugLicenseNumber: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      दवा लाइसेंस शुरू करने का तिथि
                    </label>
                    <Input
                      required
                      type="date"
                      value={formData.drugLicenseStartDate}
                      onChange={(e) => setFormData({ ...formData, drugLicenseStartDate: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      दवा लाइसेंस समाप्त करने का तिथि
                    </label>
                    <Input
                      required
                      type="date"
                      value={formData.drugLicenseEndDate}
                      onChange={(e) => setFormData({ ...formData, drugLicenseEndDate: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      खाद्य लाइसेंस नंबर
                    </label>
                    <Input
                      placeholder="खाद्य लाइसेंस नंबर"
                      value={formData.foodLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, foodLicenseNumber: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      खाद्य लाइसेंस शुरू करने का तिथि
                    </label>
                    <Input
                      required
                      type="date"
                      value={formData.foodLicenseStartDate}
                      onChange={(e) => setFormData({ ...formData, foodLicenseStartDate: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      खाद्य लाइसेंस समाप्त करने का तिथि
                    </label>
                    <Input
                      required
                      type="date"
                      value={formData.foodLicenseEndDate}
                      onChange={(e) => setFormData({ ...formData, foodLicenseEndDate: e.target.value })}
                      className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
              </div>
              {/* Bank Information */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  बैंक विवरण
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-yellow-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      खाता नंबर
                    </label>
                    <Input
                      required
                      placeholder="खाता नंबर"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="rounded-xl border-2 border-yellow-200 focus:border-yellow-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-yellow-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      IFSC कोड
                    </label>
                    <Input
                      required
                      placeholder="IFSC कोड"
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      className="rounded-xl border-2 border-yellow-200 focus:border-yellow-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-yellow-800 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      शाखा
                    </label>
                    <Input
                      required
                      placeholder="बैंक शाखा"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="rounded-xl border-2 border-yellow-200 focus:border-yellow-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
              </div>
              {/* Nominee Information */}
              <div className="bg-gradient-to-r from-pink-100 to-red-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  नामांकित व्यक्ति का विवरण
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      नामांकित का नाम
                    </label>
                    <Input
                      required
                      placeholder="नामांकित का नाम"
                      value={formData.nomineeName}
                      onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      संबंध
                    </label>
                    <Input
                      required
                      placeholder="संबंध (पिता, पुत्र, आदि)"
                      value={formData.nomineeRelation}
                      onChange={(e) => setFormData({ ...formData, nomineeRelation: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      फोन नंबर
                    </label>
                    <Input
                      required
                      placeholder="नामांकित का फोन"
                      value={formData.nomineePhone}
                      onChange={(e) => setFormData({ ...formData, nomineePhone: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      खाता नंबर
                    </label>
                    <Input
                      required
                      placeholder="नामांकित का खाता"
                      value={formData.nomineeAccountNumber}
                      onChange={(e) => setFormData({ ...formData, nomineeAccountNumber: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      IFSC कोड
                    </label>
                    <Input
                      required
                      placeholder="नामांकित का IFSC"
                      value={formData.nomineeIfsc}
                      onChange={(e) => setFormData({ ...formData, nomineeIfsc: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      शाखा
                    </label>
                    <Input
                      required
                      placeholder="नामांकित का बैंक"
                      value={formData.nomineeBranch}
                      onChange={(e) => setFormData({ ...formData, nomineeBranch: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg text-black"
                    />
                  </div>
                </div>
              </div>
              {/* Submit Button */}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
