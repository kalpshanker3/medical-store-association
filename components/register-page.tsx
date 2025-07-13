"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
} from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"
import { sendOTP, verifyOTP, registerUser } from "../lib/auth"

export default function RegisterPage(appState: AppState) {
  const [showOtpDialog, setShowOtpDialog] = useState(false)
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
  })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phone || formData.phone.length !== 10) {
      alert("कृपया 10 अंकों का सही फ़ोन नंबर डालें")
      return
    }

    setIsLoading(true)

    try {
      const result = await sendOTP(formData.phone)
      if (result.success) {
        setShowOtpDialog(true)
        alert("OTP भेजा गया है।")
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      alert("OTP भेजने में त्रुटि हुई")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert("कृपया 6 अंकों का OTP डालें")
      return
    }

    setOtpLoading(true)

    try {
      // First verify OTP (this will fail for new users, which is expected)
      const otpResult = await verifyOTP(formData.phone, otp)

      if (otpResult.success) {
        alert("यह फ़ोन नंबर पहले से रजिस्टर्ड है। कृपया लॉग इन करें।")
        appState.setCurrentPage("login")
        return
      }

      // If OTP verification fails because user doesn't exist, proceed with registration
      if (otp === "123456") {
        const userData = {
          name: formData.name,
          phone: formData.phone,
          alternate_phone: formData.alternatePhone || undefined,
          age: formData.age ? Number.parseInt(formData.age) : undefined,
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
        }

        const registerResult = await registerUser(userData)

        if (registerResult.success && registerResult.user) {
          appState.setUser({
            id: registerResult.user.id,
            name: registerResult.user.name,
            phone: registerResult.user.phone,
            alternatePhone: registerResult.user.alternate_phone,
            aadhar: registerResult.user.aadhar || "",
            storeName: registerResult.user.store_name || "",
            location: registerResult.user.location || "",
            gstNumber: registerResult.user.gst_number || "",
            drugLicenseNumber: registerResult.user.drug_license_number || "",
            drugLicenseStartDate: registerResult.user.drug_license_start_date || "",
            drugLicenseEndDate: registerResult.user.drug_license_end_date || "",
            foodLicenseNumber: registerResult.user.food_license_number || "",
            foodLicenseStartDate: registerResult.user.food_license_start_date || "",
            foodLicenseEndDate: registerResult.user.food_license_end_date || "",
            age: registerResult.user.age?.toString() || "",
            accountNumber: registerResult.user.account_number || "",
            ifsc: registerResult.user.ifsc || "",
            branch: registerResult.user.branch || "",
            nomineeName: registerResult.user.nominee_name,
            nomineeRelation: registerResult.user.nominee_relation,
            customNomineeRelation: registerResult.user.custom_nominee_relation,
            nomineePhone: registerResult.user.nominee_phone,
            nomineeAccountNumber: registerResult.user.nominee_account_number,
            nomineeIfsc: registerResult.user.nominee_ifsc,
            nomineeBranch: registerResult.user.nominee_branch,
            status: "प्रगति में है",
            membershipStatus: "pending",
            role: "user",
          })
          appState.setIsLoggedIn(true)
          setShowOtpDialog(false)
          appState.setCurrentPage("status")
          alert("रजिस्ट्रेशन सफल! आपका आवेदन समीक्षाधीन है।")
        } else {
          alert(registerResult.message)
        }
      } else {
        alert("गलत OTP! कृपया 123456 डालें")
      }
    } catch (error) {
      console.error("Error in registration:", error)
      alert("रजिस्ट्रेशन में त्रुटि हुई")
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <Navbar {...appState} />

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
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg"
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
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg"
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
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg"
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
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg"
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
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-bold text-blue-800 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    पता *
                  </label>
                  <Input
                    required
                    placeholder="स्थान: गांव/शहर, जिला, राज्य"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-500 h-12 sm:h-14 text-base sm:text-lg"
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  व्यापारिक जानकारी
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    मेडिकल स्टोर का नाम *
                  </label>
                  <Input
                    required
                    placeholder="आपकी दुकान का नाम"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-bold text-green-800 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    GST नंबर *
                  </label>
                  <Input
                    required
                    placeholder="GST पंजीकरण नंबर"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="rounded-xl border-2 border-green-200 focus:border-green-500 h-12 sm:h-14 text-base sm:text-lg"
                  />
                </div>
              </div>

              {/* License Information */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  लाइसेंस की जानकारी
                </h3>

                {/* Drug License */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    ड्रग लाइसेंस
                  </h4>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-orange-800">ड्रग लाइसेंस नंबर *</label>
                    <Input
                      required
                      placeholder="ड्रग लाइसेंस नंबर"
                      value={formData.drugLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, drugLicenseNumber: e.target.value })}
                      className="rounded-xl border-2 border-orange-200 focus:border-orange-500 h-12 sm:h-14 text-base sm:text-lg"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-orange-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        प्रारंभ तिथि *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.drugLicenseStartDate}
                        onChange={(e) => setFormData({ ...formData, drugLicenseStartDate: e.target.value })}
                        className="rounded-xl border-2 border-orange-200 focus:border-orange-500 h-12 sm:h-14 text-base sm:text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-orange-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        समाप्ति तिथि *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.drugLicenseEndDate}
                        onChange={(e) => setFormData({ ...formData, drugLicenseEndDate: e.target.value })}
                        className="rounded-xl border-2 border-orange-200 focus:border-orange-500 h-12 sm:h-14 text-base sm:text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Food License */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    फूड लाइसेंस
                  </h4>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-orange-800">फूड लाइसेंस नंबर *</label>
                    <Input
                      required
                      placeholder="फूड लाइसेंस नंबर"
                      value={formData.foodLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, foodLicenseNumber: e.target.value })}
                      className="rounded-xl border-2 border-orange-200 focus:border-orange-500 h-12 sm:h-14 text-base sm:text-lg"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-orange-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        प्रारंभ तिथि *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.foodLicenseStartDate}
                        onChange={(e) => setFormData({ ...formData, foodLicenseStartDate: e.target.value })}
                        className="rounded-xl border-2 border-orange-200 focus:border-orange-500 h-12 sm:h-14 text-base sm:text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-orange-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        समाप्ति तिथि *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.foodLicenseEndDate}
                        onChange={(e) => setFormData({ ...formData, foodLicenseEndDate: e.target.value })}
                        className="rounded-xl border-2 border-orange-200 focus:border-orange-500 h-12 sm:h-14 text-base sm:text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  बैंक की जानकारी
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-indigo-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      खाता नंबर *
                    </label>
                    <Input
                      required
                      placeholder="बैंक खाता नंबर"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="rounded-xl border-2 border-indigo-200 focus:border-indigo-500 h-12 sm:h-14 text-base sm:text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-indigo-800 flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      IFSC कोड *
                    </label>
                    <Input
                      required
                      placeholder="IFSC कोड"
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      className="rounded-xl border-2 border-indigo-200 focus:border-indigo-500 h-12 sm:h-14 text-base sm:text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-bold text-indigo-800 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    शाखा का नाम *
                  </label>
                  <Input
                    required
                    placeholder="बैंक शाखा का नाम"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="rounded-xl border-2 border-indigo-200 focus:border-indigo-500 h-12 sm:h-14 text-base sm:text-lg"
                  />
                </div>
              </div>

              {/* Nominee Information */}
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-4 rounded-2xl">
                <h3 className="text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  नॉमिनी की जानकारी
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      नॉमिनी का नाम *
                    </label>
                    <Input
                      required
                      placeholder="नॉमिनी का पूरा नाम"
                      value={formData.nomineeName}
                      onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                      className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      रिश्ता *
                    </label>
                    <select
                      required
                      value={formData.nomineeRelation}
                      onChange={(e) => {
                        setFormData({ ...formData, nomineeRelation: e.target.value })
                        if (e.target.value !== "अन्य") {
                          setFormData({ ...formData, customNomineeRelation: "" })
                        }
                      }}
                      className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg bg-white cursor-pointer"
                    >
                      <option value="" className="text-gray-500">रिश्ता चुनें</option>
                      <option value="पत्नी" className="text-black">पत्नी</option>
                      <option value="पति" className="text-black">पति</option>
                      <option value="बेटा" className="text-black">बेटा</option>
                      <option value="बेटी" className="text-black">बेटी</option>
                      <option value="माता" className="text-black">माता</option>
                      <option value="पिता" className="text-black">पिता</option>
                      <option value="भाई" className="text-black">भाई</option>
                      <option value="बहन" className="text-black">बहन</option>
                      <option value="अन्य" className="text-black">अन्य</option>
                    </select>

                    {formData.nomineeRelation === "अन्य" && (
                      <Input
                        required
                        placeholder="कृपया रिश्ता लिखें"
                        value={formData.customNomineeRelation}
                        onChange={(e) => setFormData({ ...formData, customNomineeRelation: e.target.value })}
                        className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-bold text-pink-800 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    नॉमिनी का फ़ोन नंबर *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="नॉमिनी का मोबाइल नंबर"
                    value={formData.nomineePhone}
                    onChange={(e) => setFormData({ ...formData, nomineePhone: e.target.value })}
                    className="rounded-xl border-2 border-pink-200 focus:border-pink-500 h-12 sm:h-14 text-base sm:text-lg"
                    maxLength={10}
                  />
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded-xl">
                  <h4 className="font-bold text-rose-800 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    नॉमिनी की बैंक जानकारी
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-rose-800">खाता नंबर *</label>
                      <Input
                        required
                        placeholder="नॉमिनी का बैंक खाता नंबर"
                        value={formData.nomineeAccountNumber}
                        onChange={(e) => setFormData({ ...formData, nomineeAccountNumber: e.target.value })}
                        className="rounded-xl border-2 border-rose-200 focus:border-rose-500 h-12 sm:h-14 text-base sm:text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-rose-800">IFSC कोड *</label>
                      <Input
                        required
                        placeholder="IFSC कोड"
                        value={formData.nomineeIfsc}
                        onChange={(e) => setFormData({ ...formData, nomineeIfsc: e.target.value })}
                        className="rounded-xl border-2 border-rose-200 focus:border-rose-500 h-12 sm:h-14 text-base sm:text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label className="block text-sm font-bold text-rose-800">शाखा का नाम *</label>
                    <Input
                      required
                      placeholder="नॉमिनी के बैंक की शाखा"
                      value={formData.nomineeBranch}
                      onChange={(e) => setFormData({ ...formData, nomineeBranch: e.target.value })}
                      className="rounded-xl border-2 border-rose-200 focus:border-rose-500 h-12 sm:h-14 text-base sm:text-lg"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 sm:h-16 text-lg sm:text-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold btn-mobile"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>OTP भेजा जा रहा है...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>🚀 OTP भेजें और रजिस्टर करें</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              OTP सत्यापन
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
            <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl sm:rounded-2xl">
              <p className="text-base sm:text-lg text-gray-700 font-medium">
                📱 आपके फ़ोन नंबर <span className="font-bold text-blue-600">{formData.phone}</span> पर OTP भेजा गया है
              </p>
            </div>
            <Input
              placeholder="6 अंकों का OTP डालें"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-xl sm:text-2xl rounded-xl sm:rounded-2xl h-14 sm:h-16 border-2 border-green-300 focus:border-green-500 font-bold tracking-widest"
              maxLength={6}
            />
            <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200/50 text-center">
              <p className="text-green-700 font-bold text-lg">
                🔐 टेस्ट OTP: <span className="text-2xl">123456</span>
              </p>
            </div>
            <Button
              onClick={handleOtpVerify}
              disabled={otpLoading}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 btn-mobile"
            >
              {otpLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>रजिस्ट्रेशन हो रहा है...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>✅ सत्यापित करें</span>
                </div>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
