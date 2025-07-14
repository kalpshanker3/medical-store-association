"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  CreditCard,
  Heart,
  CheckCircle,
  X,
  AlertTriangle,
  FileText,
  Settings,
  Bell,
  Camera,
  Upload,
  Trash2,
  Eye,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Navbar from "./navbar"
import type { AppState } from "../lib/types"
import { supabase } from "@/lib/supabase"

interface GalleryImage {
  id: number
  src: string
  title: string
  category: string
  uploadDate: string
}

interface MembershipRequest {
  id: number
  name: string
  phone: string
  status: string
  amount: number
  receiptImage: string
  uploadDate: string
}

interface DonationReceipt {
  id: number
  donor: string
  amount: number
  recipient: string
  status: string
  receiptImage: string
  uploadDate: string
}

interface RegistrationForm {
  id: number
  name: string
  storeName: string
  location: string
  status: string
  phone: string
  aadhar: string
  gstNumber: string
  drugLicenseNumber: string
  foodLicenseNumber: string
  accountNumber: string
  ifsc: string
  branch: string
  nomineeName: string
  nomineeRelation: string
  nomineePhone: string
  nomineeAccountNumber: string
  nomineeIfsc: string
  nomineeBranch: string
}

interface Member {
  id: number
  name: string
  phone: string
  storeName: string
  location: string
  status: "active" | "inactive"
}

export default function AdminPage(appState: AppState) {
  useEffect(() => {
    if (!appState.isLoggedIn || appState.user?.role !== "admin") {
      appState.setCurrentPage("home")
    }
  }, [appState.isLoggedIn, appState.user])

  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [membershipRequests, setMembershipRequests] = useState<any[]>([])
  const [donationReceipts, setDonationReceipts] = useState<any[]>([])
  const [registrationForms, setRegistrationForms] = useState<any[]>([])
  const [allMembers, setAllMembers] = useState<any[]>([])
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationType, setNotificationType] = useState("info")
  const [notificationBody, setNotificationBody] = useState("")
  const [notifications, setNotifications] = useState<any[]>([])

  // UI states
  const [selectedMember, setSelectedMember] = useState("")
  const [accidentType, setAccidentType] = useState("")
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<string | null>(null)
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<any | null>(null)
  const [customAccidentType, setCustomAccidentType] = useState("")
  const [newImageTitle, setNewImageTitle] = useState("")
  const [newImageCategory, setNewImageCategory] = useState("events")
  const [newImageFile, setNewImageFile] = useState<File | null>(null)

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Membership Requests (pending payments)
      const { data: payments, error: payErr } = await supabase
        .from("membership_payments")
        .select("*, users: user_id(name, phone)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
      if (payErr) throw payErr
      setMembershipRequests(payments || [])

      // Donation Receipts (pending donations)
      const { data: donations, error: donErr } = await supabase
        .from("donations")
        .select("*, users: donor_id(name)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
      if (donErr) throw donErr
      setDonationReceipts(donations || [])

      // Registration Forms (pending users)
      const { data: regs, error: regErr } = await supabase
        .from("users")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
      if (regErr) throw regErr
      setRegistrationForms(regs || [])

      // All Members
      const { data: members, error: memErr } = await supabase
        .from("users")
        .select("*")
        .eq("membership_status", "active")
        .order("name")
      if (memErr) throw memErr
      setAllMembers(members || [])

      // Gallery Images
      const { data: gallery, error: galErr } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
      if (galErr) throw galErr
      setGalleryImages(gallery || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // Approve/Reject Handlers
  const handleApprove = async (type: string, id: string) => {
    setLoading(true)
    setError(null)
    try {
      if (type === "membership") {
        const { error } = await supabase
          .from("membership_payments")
          .update({ status: "approved", approved_by: appState.user.id, approved_at: new Date().toISOString() })
          .eq("id", id)
        if (error) throw error
      } else if (type === "donation") {
        const { error } = await supabase
          .from("donations")
          .update({ status: "approved", approved_by: appState.user.id, approved_at: new Date().toISOString() })
          .eq("id", id)
        if (error) throw error
      } else if (type === "registration") {
        const { error } = await supabase
          .from("users")
          .update({ status: "approved", membership_status: "active" })
          .eq("id", id)
        if (error) throw error
      }
      await fetchAllData()
    } catch (err: any) {
      setError(err.message || "Failed to approve")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (type: string, id: string) => {
    setLoading(true)
    setError(null)
    try {
      if (type === "membership") {
        const { error } = await supabase
          .from("membership_payments")
          .update({ status: "rejected" })
          .eq("id", id)
        if (error) throw error
      } else if (type === "donation") {
        const { error } = await supabase
          .from("donations")
          .update({ status: "rejected" })
          .eq("id", id)
        if (error) throw error
      } else if (type === "registration") {
        const { error } = await supabase
          .from("users")
          .update({ status: "rejected", membership_status: "inactive" })
          .eq("id", id)
        if (error) throw error
      }
      await fetchAllData()
    } catch (err: any) {
      setError(err.message || "Failed to reject")
    } finally {
      setLoading(false)
    }
  }

  // Gallery Add/Delete
  const handleAddImage = async () => {
    if (!newImageTitle.trim() || !newImageFile) {
      setError('कृपया शीर्षक और फ़ाइल चुनें।')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const filePath = `${Date.now()}_${newImageFile.name}`
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from('gallery').upload(filePath, newImageFile)
      if (uploadError || !uploadData) throw uploadError || new Error('Upload failed')
      // Get the public URL
      const { data: urlData, error: urlError } = supabase.storage.from('gallery').getPublicUrl(filePath)
      if (urlError || !urlData || !urlData.publicUrl) throw urlError || new Error('Failed to get public URL')
      const imageUrl = urlData.publicUrl
      // Insert into gallery table
      const { error } = await supabase
        .from('gallery')
        .insert({
          title: newImageTitle,
          image_url: imageUrl,
          category: newImageCategory,
          uploaded_by: appState.user.id,
        })
      if (error) throw error
      setNewImageTitle("")
      setNewImageCategory("events")
      setNewImageFile(null)
      await fetchAllData()
    } catch (err: any) {
      setError(err.message || 'Failed to add image')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id)
      if (error) throw error
      await fetchAllData()
    } catch (err: any) {
      setError(err.message || "Failed to delete image")
    } finally {
      setLoading(false)
    }
  }

  // Add Accident
  const handleAddAccident = async () => {
    const finalAccidentType = accidentType === "अन्य" ? customAccidentType : accidentType
    if (!selectedMember || !finalAccidentType) {
      alert("कृपया सदस्य और दुर्घटना का प्रकार चुनें")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const member = allMembers.find((m: any) => m.name === selectedMember)
      if (!member) throw new Error("Member not found")
      const { error } = await supabase
        .from("accidents")
        .insert({
          member_id: member.id,
          accident_type: finalAccidentType,
          created_by: appState.user.id,
        })
      if (error) throw error
      setSelectedMember("")
      setAccidentType("")
      setCustomAccidentType("")
      alert("दुर्घटना की जानकारी सफलतापूर्वक जोड़ी गई!")
    } catch (err: any) {
      setError(err.message || "Failed to add accident")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      events: "कार्यक्रम",
      awards: "पुरस्कार",
      charity: "दान",
      members: "सदस्य",
      health: "स्वास्थ्य",
      community: "सामुदायिक",
      festivals: "त्योहार",
      meetings: "बैठक",
      youth: "युवा",
    }
    return categoryMap[category] || category
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      setNotifications(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications")
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Add notification
  const handleAddNotification = async () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) {
      setError("कृपया शीर्षक और विवरण भरें।")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from("notifications")
        .insert({
          title: notificationTitle,
          type: notificationType,
          body: notificationBody,
          created_by: appState.user.id,
        })
      if (error) throw error
      setNotificationTitle("")
      setNotificationType("info")
      setNotificationBody("")
      await fetchNotifications()
    } catch (err: any) {
      setError(err.message || "Failed to add notification")
    } finally {
      setLoading(false)
    }
  }

  // Delete notification
  const handleDeleteNotification = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
      if (error) throw error
      await fetchNotifications()
    } catch (err: any) {
      setError(err.message || "Failed to delete notification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <Navbar />

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <Card className="mb-6 shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white via-slate-50 to-gray-50">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
              प्रशासन पैनल
              <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="bg-red-100 text-red-800 rounded-xl p-3 text-center font-semibold mb-4">
                {error}
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-xl p-3 text-center font-semibold mb-4 gap-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                कृपया प्रतीक्षा करें...
              </div>
            )}
            <Tabs defaultValue="membership" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="membership" className="flex items-center gap-2 text-black">
                  <CreditCard className="h-4 w-4" />
                  सदस्यता
                </TabsTrigger>
                <TabsTrigger value="donations" className="flex items-center gap-2 text-black">
                  <Heart className="h-4 w-4" />
                  दान
                </TabsTrigger>
                <TabsTrigger value="registrations" className="flex items-center gap-2 text-black">
                  <Users className="h-4 w-4" />
                  रजिस्ट्रेशन
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center gap-2 text-black">
                  <AlertTriangle className="h-4 w-4" />
                  दुर्घटना
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 text-black">
                  <Bell className="h-4 w-4" />
                  सूचनाएं
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2 text-black">
                  <Camera className="h-4 w-4" />
                  गैलरी
                </TabsTrigger>
              </TabsList>

              {/* Membership Approvals */}
              <TabsContent value="membership">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      सदस्यता भुगतान अनुमोदन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {membershipRequests.map((request) => (
                        <div key={request.id} className="bg-white p-6 rounded-xl shadow-lg">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-bold text-gray-800 text-xl">{request.name}</h4>
                                <p className="text-gray-600">📞 {request.phone}</p>
                                <p className="text-green-600 font-semibold text-lg">राशि: ₹{request.amount}</p>
                                <p className="text-gray-500 text-sm">अपलोड: {request.uploadDate}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-yellow-100 text-yellow-800">प्रतीक्षारत</Badge>
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                  onClick={() => handleApprove("membership", String(request.id))}
                                  disabled={loading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  स्वीकार
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject("membership", String(request.id))}
                                  disabled={loading}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  अस्वीकार
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <Camera className="h-4 w-4" />
                                  भुगतान रसीद:
                                </h5>
                                <img
                                  src={request.receiptImage || "/placeholder.svg"}
                                  alt="Payment Receipt"
                                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => setSelectedReceiptImage(request.receiptImage)}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2 bg-transparent"
                                  onClick={() => setSelectedReceiptImage(request.receiptImage)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  बड़ा देखें
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Donation Approvals */}
              <TabsContent value="donations">
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      दान रसीद अनुमोदन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donationReceipts.map((receipt) => (
                        <div key={receipt.id} className="bg-white p-6 rounded-xl shadow-lg">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-bold text-gray-800 text-xl">दानकर्ता: {receipt.name}</h4>
                                <p className="text-gray-700">प्राप्तकर्ता: {receipt.recipient}</p>
                                <p className="text-red-700 font-semibold text-lg">राशि: ₹{receipt.amount}</p>
                                <p className="text-gray-500 text-sm">अपलोड: {receipt.uploadDate}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-yellow-200 text-yellow-900">प्रतीक्षारत</Badge>
                                <Button
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-700"
                                  onClick={() => handleApprove("donation", String(receipt.id))}
                                  disabled={loading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  स्वीकार
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() => handleReject("donation", String(receipt.id))}
                                  disabled={loading}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  अस्वीकार
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <Camera className="h-4 w-4" />
                                  दान रसीद:
                                </h5>
                                <img
                                  src={receipt.receiptImage || "/placeholder.svg"}
                                  alt="Donation Receipt"
                                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => setSelectedReceiptImage(receipt.receiptImage)}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2 bg-transparent"
                                  onClick={() => setSelectedReceiptImage(receipt.receiptImage)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  बड़ा देखें
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Registration Approvals */}
              <TabsContent value="registrations">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      सदस्य रजिस्ट्रेशन अनुमोदन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {registrationForms.map((form) => (
                        <div key={form.id} className="bg-white p-6 rounded-xl shadow-lg">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 text-xl">{form.name}</h4>
                              <p className="text-gray-600">🏪 {form.storeName}</p>
                              <p className="text-gray-600">📍 {form.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800">प्रतीक्षारत</Badge>
                              <Button size="sm" variant="outline" onClick={() => setSelectedMemberDetails(form)}>
                                <Eye className="h-4 w-4 mr-1" />
                                विवरण देखें
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleApprove("registration", String(form.id))}
                                disabled={loading}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                स्वीकार
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject("registration", String(form.id))}
                                disabled={loading}
                              >
                                <X className="h-4 w-4 mr-1" />
                                अस्वीकार
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Updates */}
              <TabsContent value="emergency">
                <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      दुर्घटना अपडेट
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 mb-4 text-xl">नई दुर्घटना की जानकारी जोड़ें</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-orange-800 mb-2">दुर्घटनाग्रस्त सदस्य चुनें *</label>
                            <select
                              value={selectedMember}
                              onChange={(e) => setSelectedMember(e.target.value)}
                              className="w-full p-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 text-lg"
                            >
                              <option value="">सदस्य चुनें</option>
                              {allMembers.map((member) => (
                                <option key={member.id} value={member.name}>
                                  {member.name} - {member.storeName} ({member.location})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-orange-800 mb-2">दुर्घटना का प्रकार *</label>
                            <select
                              value={accidentType}
                              onChange={(e) => {
                                setAccidentType(e.target.value)
                                if (e.target.value !== "अन्य") {
                                  setCustomAccidentType("")
                                }
                              }}
                              className="w-full p-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 text-lg"
                            >
                              <option value="">दुर्घटना का प्रकार चुनें</option>
                              <option value="हृदयाघात">हृदयाघात</option>
                              <option value="कैंसर">कैंसर</option>
                              <option value="दुर्घटना">दुर्घटना</option>
                              <option value="बीमारी">गंभीर बीमारी</option>
                              <option value="अन्य">अन्य</option>
                            </select>

                            {accidentType === "अन्य" && (
                              <input
                                type="text"
                                placeholder="कृपया दुर्घटना का प्रकार लिखें"
                                value={customAccidentType}
                                onChange={(e) => setCustomAccidentType(e.target.value)}
                                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 text-lg mt-2"
                                required
                              />
                            )}
                          </div>
                          <Button
                            onClick={handleAddAccident}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl font-bold h-14 text-lg"
                            disabled={loading}
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            दुर्घटना जानकारी जोड़ें
                          </Button>
                        </div>
                      </div>

                      {/* Current Members List */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 mb-4 text-xl">सभी सदस्यों की सूची</h4>
                        <div className="grid md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                          {allMembers.map((member) => (
                            <div
                              key={member.id}
                              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <h5 className="font-semibold text-gray-800">{member.name}</h5>
                              <p className="text-sm text-gray-600">📞 {member.phone}</p>
                              <p className="text-sm text-gray-600">🏪 {member.storeName}</p>
                              <p className="text-sm text-gray-600">📍 {member.location}</p>
                              <Badge
                                className={`mt-2 ${
                                  member.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {member.status === "active" ? "सक्रिय" : "निष्क्रिय"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Management */}
              <TabsContent value="notifications">
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-purple-800 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      सूचना प्रबंधन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Add New Notification */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 mb-4">नई सूचना जोड़ें</h4>
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="सूचना का शीर्षक"
                              className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500"
                              value={notificationTitle}
                              onChange={e => setNotificationTitle(e.target.value)}
                            />
                            <select className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500" value={notificationType} onChange={e => setNotificationType(e.target.value)}>
                              <option value="info">जानकारी</option>
                              <option value="warning">चेतावनी</option>
                              <option value="success">सफलता</option>
                              <option value="emergency">आपातकाल</option>
                            </select>
                          </div>
                          <textarea
                            placeholder="सूचना का विवरण"
                            rows={4}
                            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500"
                            value={notificationBody}
                            onChange={e => setNotificationBody(e.target.value)}
                          />
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl font-bold" disabled={loading} onClick={handleAddNotification}>
                            <Bell className="h-4 w-4 mr-2" />
                            सूचना प्रकाशित करें
                          </Button>
                        </div>
                      </div>

                      {/* Existing Notifications */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 mb-4">मौजूदा सूचनाएं</h4>
                        <div className="space-y-3">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <h5 className="font-semibold text-gray-800">{notification.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    className={`text-xs ${
                                      notification.type === "emergency"
                                        ? "bg-red-100 text-red-800"
                                        : notification.type === "warning"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : notification.type === "success"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {notification.type === "emergency" && "आपातकाल"}
                                    {notification.type === "warning" && "चेतावनी"}
                                    {notification.type === "success" && "सफलता"}
                                    {notification.type === "info" && "जानकारी"}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{notification.created_at ? notification.created_at.split('T')[0] : ''}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteNotification(notification.id)}
                                disabled={loading}
                              >
                                <X className="h-4 w-4 mr-1" />
                                हटाएं
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gallery Management */}
              <TabsContent value="gallery">
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-pink-800 flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      गैलरी प्रबंधन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Add New Image */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 mb-4">नई फोटो जोड़ें</h4>
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <Input
                              type="text"
                              placeholder="फोटो का शीर्षक"
                              value={newImageTitle}
                              onChange={(e) => setNewImageTitle(e.target.value)}
                              className="rounded-xl border-2 border-pink-200 focus:border-pink-500"
                            />
                            <select
                              value={newImageCategory}
                              onChange={(e) => setNewImageCategory(e.target.value)}
                              className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-500"
                            >
                              <option value="events">कार्यक्रम</option>
                              <option value="awards">पुरस्कार</option>
                              <option value="charity">दान</option>
                              <option value="members">सदस्य</option>
                              <option value="health">स्वास्थ्य</option>
                              <option value="community">सामुदायिक</option>
                              <option value="festivals">त्योहार</option>
                              <option value="meetings">बैठक</option>
                              <option value="youth">युवा</option>
                            </select>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            className="rounded-xl border-2 border-pink-200 focus:border-pink-500"
                            onChange={e => setNewImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          />
                          <Button
                            onClick={handleAddImage}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl font-bold"
                            disabled={loading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            फोटो अपलोड करें
                          </Button>
                        </div>
                      </div>

                      {/* Gallery Statistics */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 rounded-xl">
                          <CardContent className="p-4 text-center">
                            <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-blue-800">{galleryImages.length}</h3>
                            <p className="text-blue-600 text-sm">कुल फोटो</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0 rounded-xl">
                          <CardContent className="p-4 text-center">
                            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-green-800">
                              {new Set(galleryImages.map((img) => img.category)).size}
                            </h3>
                            <p className="text-green-600 text-sm">श्रेणियां</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 rounded-xl">
                          <CardContent className="p-4 text-center">
                            <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-purple-800">
                              {
                                galleryImages.filter((img) => img.uploadDate === new Date().toISOString().split("T")[0])
                                  .length
                              }
                            </h3>
                            <p className="text-purple-600 text-sm">आज अपलोड</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-0 rounded-xl">
                          <CardContent className="p-4 text-center">
                            <Heart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-orange-800">
                              {galleryImages.filter((img) => img.category === "events").length}
                            </h3>
                            <p className="text-orange-600 text-sm">कार्यक्रम फोटो</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Existing Images */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 mb-4">मौजूदा फोटो ({galleryImages.length})</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                          {galleryImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.src || "/placeholder.svg"}
                                alt={image.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteImage(String(image.id))}
                                  className="rounded-full"
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                                <h5 className="text-white text-sm font-semibold truncate">{image.title}</h5>
                                <div className="flex items-center justify-between">
                                  <Badge className="text-xs bg-white/20 text-white">
                                    {getCategoryName(image.category)}
                                  </Badge>
                                  <span className="text-white text-xs">{image.uploadDate}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Image Modal */}
      {selectedReceiptImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReceiptImage(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">भुगतान रसीद</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedReceiptImage(null)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <img
              src={selectedReceiptImage || "/placeholder.svg"}
              alt="Payment Receipt"
              className="w-full max-h-96 object-contain rounded-lg"
            />
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                स्वीकार करें
              </Button>
              <Button variant="destructive" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                अस्वीकार करें
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                डाउनलोड
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMemberDetails && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMemberDetails(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">सदस्य का पूरा विवरण</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMemberDetails(null)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-blue-800 border-b pb-2">व्यक्तिगत जानकारी</h4>
                <div className="space-y-2">
                  <p>
                    <strong>नाम:</strong> {selectedMemberDetails.name}
                  </p>
                  <p>
                    <strong>फ़ोन:</strong> {selectedMemberDetails.phone}
                  </p>
                  <p>
                    <strong>आधार:</strong> {selectedMemberDetails.aadhar}
                  </p>
                  <p>
                    <strong>पता:</strong> {selectedMemberDetails.location}
                  </p>
                </div>

                <h4 className="text-lg font-bold text-green-800 border-b pb-2 mt-6">व्यापारिक जानकारी</h4>
                <div className="space-y-2">
                  <p>
                    <strong>स्टोर नाम:</strong> {selectedMemberDetails.storeName}
                  </p>
                  <p>
                    <strong>GST नंबर:</strong> {selectedMemberDetails.gstNumber}
                  </p>
                  <p>
                    <strong>ड्रग लाइसेंस:</strong> {selectedMemberDetails.drugLicenseNumber}
                  </p>
                  <p>
                    <strong>फूड लाइसेंस:</strong> {selectedMemberDetails.foodLicenseNumber}
                  </p>
                </div>

                <h4 className="text-lg font-bold text-indigo-800 border-b pb-2 mt-6">बैंक जानकारी</h4>
                <div className="space-y-2">
                  <p>
                    <strong>खाता नंबर:</strong> {selectedMemberDetails.accountNumber}
                  </p>
                  <p>
                    <strong>IFSC:</strong> {selectedMemberDetails.ifsc}
                  </p>
                  <p>
                    <strong>शाखा:</strong> {selectedMemberDetails.branch}
                  </p>
                </div>
              </div>

              {/* Nominee Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-pink-800 border-b pb-2">नॉमिनी की जानकारी</h4>
                <div className="space-y-2">
                  <p>
                    <strong>नॉमिनी नाम:</strong> {selectedMemberDetails.nomineeName}
                  </p>
                  <p>
                    <strong>रिश्ता:</strong> {selectedMemberDetails.nomineeRelation}
                  </p>
                  <p>
                    <strong>फ़ोन:</strong> {selectedMemberDetails.nomineePhone}
                  </p>
                </div>

                <h4 className="text-lg font-bold text-rose-800 border-b pb-2 mt-6">नॉमिनी बैंक जानकारी</h4>
                <div className="space-y-2">
                  <p>
                    <strong>खाता नंबर:</strong> {selectedMemberDetails.nomineeAccountNumber}
                  </p>
                  <p>
                    <strong>IFSC:</strong> {selectedMemberDetails.nomineeIfsc}
                  </p>
                  <p>
                    <strong>शाखा:</strong> {selectedMemberDetails.nomineeBranch}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mt-6">
                  <h5 className="font-bold text-orange-800 mb-2">⚠️ महत्वपूर्ण सूचना:</h5>
                  <p className="text-orange-700 text-sm">
                    दुर्घटना की स्थिति में सहायता राशि सीधे नॉमिनी के बैंक खाते में भेजी जाएगी।
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 h-12 text-lg"
                onClick={() => {
                  handleApprove("registration", String(selectedMemberDetails.id))
                  setSelectedMemberDetails(null)
                }}
                disabled={loading}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                रजिस्ट्रेशन स्वीकार करें
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 text-lg"
                onClick={() => {
                  handleReject("registration", String(selectedMemberDetails.id))
                  setSelectedMemberDetails(null)
                }}
                disabled={loading}
              >
                <X className="h-5 w-5 mr-2" />
                रजिस्ट्रेशन अस्वीकार करें
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
