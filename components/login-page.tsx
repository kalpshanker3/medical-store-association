"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Phone, Shield, CheckCircle } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"
import { sendOTP, verifyOTP } from "../lib/auth"

export default function LoginPage(appState: AppState) {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || phone.length !== 10) {
      alert("कृपया 10 अंकों का सही फ़ोन नंबर डालें")
      return
    }

    setIsLoading(true)

    try {
      const result = await sendOTP(phone)
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
      const result = await verifyOTP(phone, otp)
      if (result.success && result.user) {
        appState.setUser({
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          alternatePhone: result.user.alternate_phone,
          aadhar: result.user.aadhar || "",
          storeName: result.user.store_name || "",
          location: result.user.location || "",
          gstNumber: result.user.gst_number || "",
          drugLicenseNumber: result.user.drug_license_number || "",
          drugLicenseStartDate: result.user.drug_license_start_date || "",
          drugLicenseEndDate: result.user.drug_license_end_date || "",
          foodLicenseNumber: result.user.food_license_number || "",
          foodLicenseStartDate: result.user.food_license_start_date || "",
          foodLicenseEndDate: result.user.food_license_end_date || "",
          age: result.user.age?.toString() || "",
          accountNumber: result.user.account_number || "",
          ifsc: result.user.ifsc || "",
          branch: result.user.branch || "",
          nomineeName: result.user.nominee_name,
          nomineeRelation: result.user.nominee_relation,
          customNomineeRelation: result.user.custom_nominee_relation,
          nomineePhone: result.user.nominee_phone,
          nomineeAccountNumber: result.user.nominee_account_number,
          nomineeIfsc: result.user.nominee_ifsc,
          nomineeBranch: result.user.nominee_branch,
          status: result.user.status === "approved" ? "स्वीकृत" : "प्रगति में है",
          membershipStatus: result.user.membership_status,
          role: result.user.role,
        })
        appState.setIsLoggedIn(true)
        setShowOtpDialog(false)
        appState.setCurrentPage("home")
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      alert("OTP सत्यापन में त्रुटि हुई")
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%236366f1'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`}
      />

      <Navbar {...appState} />

      <div className="container-responsive py-8 flex items-center justify-center min-h-[80vh] relative">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-xl border border-white/20 hover:shadow-3xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl"></div>
          <CardHeader className="bg-gradient-to-r from-slate-700 via-indigo-600 to-purple-600 text-white rounded-t-3xl relative">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 drop-shadow-lg" />
              <span className="drop-shadow-sm">OTP से लॉग इन करें</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 relative">
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  फ़ोन नंबर (व्हाट्सऐप नंबर)
                </label>
                <Input
                  type="tel"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 h-14 text-lg backdrop-blur-sm bg-white/80 font-medium"
                  required
                  maxLength={10}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold border-2 border-white/20 backdrop-blur-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>OTP भेजा जा रहा है...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Phone className="h-6 w-6" />
                    <span>OTP भेजें</span>
                  </div>
                )}
              </Button>
            </form>



            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => appState.setCurrentPage("register")}
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-2xl font-semibold px-6 py-3 transition-all duration-300"
              >
                नया अकाउंट बनाएं
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="rounded-3xl bg-gradient-to-br from-white/95 via-green-50/95 to-emerald-50/95 backdrop-blur-xl border-2 border-green-200/50 mx-4 max-w-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl"></div>
          <DialogHeader className="relative">
            <DialogTitle className="text-center text-2xl font-bold text-slate-800 flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-green-600 drop-shadow-sm" />
              <span className="drop-shadow-sm">OTP सत्यापन</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4 relative">
            <div className="text-center p-6 bg-gradient-to-r from-blue-100/80 to-green-100/80 backdrop-blur-sm rounded-2xl border border-blue-200/50">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-3 drop-shadow-sm" />
              <p className="text-lg text-slate-700 font-medium mb-2">📱 आपके फ़ोन नंबर पर OTP भेजा गया है</p>
              <p className="text-xl font-bold text-blue-600 drop-shadow-sm">{phone}</p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-800 text-center">6 अंकों का OTP डालें</label>
              <Input
                placeholder="OTP यहाँ डालें"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center text-2xl rounded-2xl h-16 border-2 border-green-300 focus:border-green-500 font-bold tracking-widest backdrop-blur-sm bg-white/80"
                maxLength={6}
              />
            </div>

            <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200/50 text-center">
              <p className="text-green-700 font-bold text-lg">
                🔐 टेस्ट OTP: <span className="text-2xl">123456</span>
              </p>
            </div>

            <Button
              onClick={handleOtpVerify}
              disabled={otpLoading}
              className="w-full h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
            >
              {otpLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>सत्यापन हो रहा है...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  <span>✅ सत्यापित करें</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowOtpDialog(false)}
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl font-medium px-6 py-2 transition-all duration-300"
              >
                वापस जाएं
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
