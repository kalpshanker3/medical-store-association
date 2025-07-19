"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CreditCard, Building, Hash, CheckCircle } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../lib/types"
import { supabase } from "../lib/supabase"

export default function MembershipPaymentPage(appState: AppState) {
  const [receiptUploaded, setReceiptUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleReceiptUpload = async () => {
    setUploading(true)
    setError("")
    if (!file) {
      setError("कृपया एक फ़ाइल चुनें।")
      setUploading(false)
      return
    }
    try {
      // Upload to Supabase Storage
      const filePath = `${appState.user.id}_${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from('receipts').upload(filePath, file)
      if (uploadError) throw uploadError
      // Get public URL
      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(filePath)
      const fileUrl = urlData.publicUrl
      // Insert into membership_payments table
      const currentYear = new Date().getFullYear()
      const { error: dbError } = await supabase.from('membership_payments').insert([
        {
          user_id: appState.user.id,
          receipt_image_url: fileUrl,
          status: 'pending',
          membership_year: currentYear,
          amount: 100.00
        }
      ])
      if (dbError) throw dbError
      setReceiptUploaded(true)
    } catch (err: any) {
      setError("अपलोड विफल रहा: " + (err.message || err.error_description || "Unknown error"))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      <Navbar />

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <Card className="max-w-2xl mx-auto shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white via-green-50 to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-3">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />
              सदस्यता शुल्क भुगतान
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {/* QR Code Section */}
            <div className="text-center mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-4">
                <img
                  src="/placeholder.svg?height=200&width=200&text=QR+Code+₹100"
                  alt="Membership Payment QR Code"
                  className="w-48 h-48 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-3 font-medium">स्कैन करें और ₹100 भुगतान करें</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl">
                <h3 className="font-bold text-green-800 text-lg mb-2">💳 भुगतान विकल्प</h3>
                <p className="text-green-700">UPI, PhonePe, Google Pay, Paytm</p>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-2xl mb-6">
              <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                बैंक विवरण
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <div>
                    <span className="text-sm text-blue-600 font-medium">खाता नंबर:</span>
                    <p className="font-bold text-blue-800">1234567890123456</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <div>
                    <span className="text-sm text-blue-600 font-medium">IFSC कोड:</span>
                    <p className="font-bold text-blue-800">SBIN0001234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-blue-600" />
                  <div>
                    <span className="text-sm text-blue-600 font-medium">खाता नाम:</span>
                    <p className="font-bold text-blue-800">फुटकर दवा व्यापार मंडल</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-2xl">
              <h3 className="font-bold text-orange-800 text-lg mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                भुगतान रसीद अपलोड करें
              </h3>

              {!receiptUploaded ? (
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    className="rounded-xl h-12 border-2 border-orange-300 focus:border-orange-500"
                    onChange={handleFileChange}
                  />
                  <Button
                    onClick={handleReceiptUpload}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={uploading}
                  >
                    {uploading ? "अपलोड हो रहा है..." : (<><Upload className="h-5 w-5 mr-2" />📤 रसीद अपलोड करें</>)}
                  </Button>
                  {error && <p className="text-red-600 mt-2">{error}</p>}
                </div>
              ) : (
                <div className="text-center p-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-700 font-bold text-lg">✅ रसीद सफलतापूर्वक अपलोड हो गई!</p>
                  <p className="text-green-600 mt-2">प्रशासन द्वारा सत्यापन के बाद आपकी सदस्यता सक्रिय हो जाएगी।</p>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => window.location.href = "/"}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🏠 होम पेज पर वापस जाएं
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
