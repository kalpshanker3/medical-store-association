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
import type { AppState } from "../app/page"
import { supabase } from "../lib/supabase"
import type { User, MembershipPayment, Donation, GalleryImage, Notification } from "../lib/supabase"

export default function AdminPage(appState: AppState) {
  useEffect(() => {
    if (!appState.isLoggedIn || appState.user?.role !== "admin") {
      appState.setCurrentPage("home")
    }
  }, [appState.isLoggedIn, appState.user])

  // Real data states
  const [membershipPayments, setMembershipPayments] = useState<MembershipPayment[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Loading states
  const [loading, setLoading] = useState({
    membership: true,
    donations: true,
    users: true,
    gallery: true,
    notifications: true
  })

  // Form states
  const [selectedMember, setSelectedMember] = useState("")
  const [accidentType, setAccidentType] = useState("")
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<string | null>(null)
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<User | null>(null)
  const [customAccidentType, setCustomAccidentType] = useState("")
  const [newImageTitle, setNewImageTitle] = useState("")
  const [newImageCategory, setNewImageCategory] = useState("events")
  const [newNotificationTitle, setNewNotificationTitle] = useState("")
  const [newNotificationMessage, setNewNotificationMessage] = useState("")
  const [newNotificationType, setNewNotificationType] = useState<"info" | "warning" | "success" | "emergency">("info")

  // Fetch all data on component mount
  useEffect(() => {
    if (appState.user?.role === "admin") {
      fetchAllData()
    }
  }, [appState.user])

  const fetchAllData = async () => {
    try {
      console.log("🔄 Fetching admin data...")
      
      // Fetch membership payments
      const { data: payments, error: paymentsError } = await supabase
        .from('membership_payments')
        .select(`
          *,
          users (
            id,
            name,
            phone,
            store_name,
            location
          )
        `)
        .order('created_at', { ascending: false })

      if (paymentsError) {
        console.error("❌ Error fetching payments:", paymentsError)
      } else {
        console.log("✅ Payments fetched:", payments?.length || 0)
        setMembershipPayments(payments || [])
      }
      setLoading(prev => ({ ...prev, membership: false }))

      // Fetch donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select(`
          *,
          users (
            id,
            name,
            phone,
            store_name,
            location
          )
        `)
        .order('created_at', { ascending: false })

      if (donationsError) {
        console.error("❌ Error fetching donations:", donationsError)
      } else {
        console.log("✅ Donations fetched:", donationsData?.length || 0)
        setDonations(donationsData || [])
      }
      setLoading(prev => ({ ...prev, donations: false }))

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) {
        console.error("❌ Error fetching users:", usersError)
      } else {
        console.log("✅ Users fetched:", usersData?.length || 0)
        setUsers(usersData || [])
      }
      setLoading(prev => ({ ...prev, users: false }))

      // Fetch gallery images
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (galleryError) {
        console.error("❌ Error fetching gallery:", galleryError)
      } else {
        console.log("✅ Gallery fetched:", galleryData?.length || 0)
        setGalleryImages(galleryData || [])
      }
      setLoading(prev => ({ ...prev, gallery: false }))

      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (notificationsError) {
        console.error("❌ Error fetching notifications:", notificationsError)
      } else {
        console.log("✅ Notifications fetched:", notificationsData?.length || 0)
        setNotifications(notificationsData || [])
      }
      setLoading(prev => ({ ...prev, notifications: false }))

    } catch (error) {
      console.error("❌ Error in fetchAllData:", error)
    }
  }

  const handleApprove = async (type: string, id: string) => {
    try {
      console.log(`Approving ${type} with ID: ${id}`)
      
      if (type === 'membership') {
        const { error } = await supabase
          .from('membership_payments')
          .update({ 
            status: 'approved',
            approved_by: appState.user?.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', id)

        if (error) {
          console.error("❌ Error approving payment:", error)
          alert("Approval failed")
        } else {
          console.log("✅ Payment approved")
          fetchAllData() // Refresh data
        }
      } else if (type === 'donation') {
        const { error } = await supabase
          .from('donations')
          .update({ 
            status: 'approved',
            approved_by: appState.user?.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', id)

        if (error) {
          console.error("❌ Error approving donation:", error)
          alert("Approval failed")
        } else {
          console.log("✅ Donation approved")
          fetchAllData() // Refresh data
        }
      } else if (type === 'user') {
        const { error } = await supabase
          .from('users')
          .update({ 
            status: 'approved',
            approved_by: appState.user?.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', id)

        if (error) {
          console.error("❌ Error approving user:", error)
          alert("User approval failed")
        } else {
          console.log("✅ User approved")
          fetchAllData() // Refresh data
        }
      }
    } catch (error) {
      console.error("❌ Error in handleApprove:", error)
    }
  }

  const handleReject = async (type: string, id: string) => {
    try {
      console.log(`Rejecting ${type} with ID: ${id}`)
      
      if (type === 'membership') {
        const { error } = await supabase
          .from('membership_payments')
          .update({ status: 'rejected' })
          .eq('id', id)

        if (error) {
          console.error("❌ Error rejecting payment:", error)
          alert("Rejection failed")
        } else {
          console.log("✅ Payment rejected")
          fetchAllData() // Refresh data
        }
      } else if (type === 'donation') {
        const { error } = await supabase
          .from('donations')
          .update({ status: 'rejected' })
          .eq('id', id)

        if (error) {
          console.error("❌ Error rejecting donation:", error)
          alert("Rejection failed")
        } else {
          console.log("✅ Donation rejected")
          fetchAllData() // Refresh data
        }
      } else if (type === 'user') {
        const { error } = await supabase
          .from('users')
          .update({ status: 'rejected' })
          .eq('id', id)

        if (error) {
          console.error("❌ Error rejecting user:", error)
          alert("User rejection failed")
        } else {
          console.log("✅ User rejected")
          fetchAllData() // Refresh data
        }
      }
    } catch (error) {
      console.error("❌ Error in handleReject:", error)
    }
  }

  const handleAddImage = async () => {
    if (newImageTitle.trim()) {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .insert({
            title: newImageTitle,
            image_url: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(newImageTitle)}`,
            category: newImageCategory,
            uploaded_by: appState.user?.id
          })
          .select()
          .single()

        if (error) {
          console.error("❌ Error adding image:", error)
          alert("Image addition failed")
        } else {
          console.log("✅ Image added:", data)
          setNewImageTitle("")
          setNewImageCategory("events")
          fetchAllData() // Refresh data
        }
      } catch (error) {
        console.error("❌ Error in handleAddImage:", error)
      }
    }
  }

  const handleDeleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("❌ Error deleting image:", error)
        alert("Image deletion failed")
      } else {
        console.log("✅ Image deleted")
        fetchAllData() // Refresh data
      }
    } catch (error) {
      console.error("❌ Error in handleDeleteImage:", error)
    }
  }

  const handleAddNotification = async () => {
    if (newNotificationTitle.trim() && newNotificationMessage.trim()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            title: newNotificationTitle,
            message: newNotificationMessage,
            type: newNotificationType,
            created_by: appState.user?.id
          })
          .select()
          .single()

        if (error) {
          console.error("❌ Error adding notification:", error)
          alert("Notification addition failed")
        } else {
          console.log("✅ Notification added:", data)
          setNewNotificationTitle("")
          setNewNotificationMessage("")
          setNewNotificationType("info")
          fetchAllData() // Refresh data
        }
      } catch (error) {
        console.error("❌ Error in handleAddNotification:", error)
      }
    }
  }

  const handleAddAccident = async () => {
    const finalAccidentType = accidentType === "अन्य" ? customAccidentType : accidentType

    if (selectedMember && finalAccidentType) {
      try {
        const { data, error } = await supabase
          .from('accidents')
          .insert({
            member_id: selectedMember,
            accident_type: finalAccidentType,
            status: 'active',
            created_by: appState.user?.id
          })
          .select()
          .single()

        if (error) {
          console.error("❌ Error adding accident:", error)
          alert("Accident addition failed")
        } else {
          console.log("✅ Accident added:", data)
          setSelectedMember("")
          setAccidentType("")
          setCustomAccidentType("")
          alert("दुर्घटना की जानकारी सफलतापूर्वक जोड़ी गई!")
          fetchAllData() // Refresh data
        }
      } catch (error) {
        console.error("❌ Error in handleAddAccident:", error)
      }
    } else {
      alert("कृपया सदस्य और दुर्घटना का प्रकार चुनें")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <Navbar {...appState} />

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
            <Tabs defaultValue="membership" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="membership" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  सदस्यता
                </TabsTrigger>
                <TabsTrigger value="donations" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  दान
                </TabsTrigger>
                <TabsTrigger value="registrations" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  रजिस्ट्रेशन
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  दुर्घटना
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  गैलरी
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  सूचनाएं
                </TabsTrigger>
              </TabsList>

              {/* Membership Payments Tab */}
              <TabsContent value="membership">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <CreditCard className="h-6 w-6" />
                      सदस्यता भुगतान अनुरोध
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.membership ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">डेटा लोड हो रहा है...</p>
                      </div>
                    ) : membershipPayments.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">कोई सदस्यता भुगतान अनुरोध नहीं</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {membershipPayments.map((payment) => (
                          <Card key={payment.id} className="border-2 border-blue-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg">{payment.users?.name || 'Unknown'}</h3>
                                  <p className="text-gray-600">{payment.users?.phone}</p>
                                  <p className="text-gray-600">{payment.users?.store_name}</p>
                                  <p className="text-gray-600">{payment.users?.location}</p>
                                  <p className="text-green-600 font-bold">₹{payment.amount}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(payment.payment_date).toLocaleDateString('hi-IN')}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={`${
                                    payment.status === 'approved' ? 'bg-green-500' :
                                    payment.status === 'rejected' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                  } text-white`}>
                                    {payment.status === 'approved' ? 'स्वीकृत' :
                                     payment.status === 'rejected' ? 'अस्वीकृत' :
                                     'लंबित'}
                                  </Badge>
                                  {payment.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprove('membership', payment.id)}
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        स्वीकृत
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject('membership', payment.id)}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        अस्वीकृत
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Donations Tab */}
              <TabsContent value="donations">
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <Heart className="h-6 w-6" />
                      दान अनुरोध
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.donations ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">डेटा लोड हो रहा है...</p>
                      </div>
                    ) : donations.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">कोई दान अनुरोध नहीं</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {donations.map((donation) => (
                          <Card key={donation.id} className="border-2 border-red-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg">{donation.users?.name || 'Unknown'}</h3>
                                  <p className="text-gray-600">{donation.users?.phone}</p>
                                  <p className="text-gray-600">प्राप्तकर्ता: {donation.recipient_name}</p>
                                  <p className="text-green-600 font-bold">₹{donation.amount}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(donation.donation_date).toLocaleDateString('hi-IN')}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={`${
                                    donation.status === 'approved' ? 'bg-green-500' :
                                    donation.status === 'rejected' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                  } text-white`}>
                                    {donation.status === 'approved' ? 'स्वीकृत' :
                                     donation.status === 'rejected' ? 'अस्वीकृत' :
                                     'लंबित'}
                                  </Badge>
                                  {donation.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprove('donation', donation.id)}
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        स्वीकृत
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject('donation', donation.id)}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        अस्वीकृत
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Registrations Tab */}
              <TabsContent value="registrations">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Users className="h-6 w-6" />
                      नए सदस्य रजिस्ट्रेशन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.users ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">डेटा लोड हो रहा है...</p>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">कोई नया रजिस्ट्रेशन नहीं</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {users.map((user) => (
                          <Card key={user.id} className="border-2 border-green-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg">{user.name}</h3>
                                  <p className="text-gray-600">{user.phone}</p>
                                  <p className="text-gray-600">{user.store_name}</p>
                                  <p className="text-gray-600">{user.location}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('hi-IN')}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={`${
                                    user.status === 'approved' ? 'bg-green-500' :
                                    user.status === 'rejected' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                  } text-white`}>
                                    {user.status === 'approved' ? 'स्वीकृत' :
                                     user.status === 'rejected' ? 'अस्वीकृत' :
                                     'लंबित'}
                                  </Badge>
                                  {user.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprove('user', user.id)}
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        स्वीकृत
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject('user', user.id)}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        अस्वीकृत
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Tab */}
              <TabsContent value="emergency">
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="h-6 w-6" />
                      दुर्घटना प्रबंधन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            सदस्य चुनें
                          </label>
                          <select
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">सदस्य चुनें</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} - {user.phone}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            दुर्घटना का प्रकार
                          </label>
                          <select
                            value={accidentType}
                            onChange={(e) => setAccidentType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">प्रकार चुनें</option>
                            <option value="हृदयाघात">हृदयाघात</option>
                            <option value="कैंसर">कैंसर</option>
                            <option value="दुर्घटना">दुर्घटना</option>
                            <option value="अन्य">अन्य</option>
                          </select>
                        </div>
                      </div>
                      {accidentType === "अन्य" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            कस्टम दुर्घटना प्रकार
                          </label>
                          <Input
                            type="text"
                            value={customAccidentType}
                            onChange={(e) => setCustomAccidentType(e.target.value)}
                            placeholder="दुर्घटना का प्रकार लिखें"
                            className="w-full"
                          />
                        </div>
                      )}
                      <Button
                        onClick={handleAddAccident}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        दुर्घटना जोड़ें
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Camera className="h-6 w-6" />
                      गैलरी प्रबंधन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Add New Image */}
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                        <h3 className="font-bold text-lg mb-4">नई तस्वीर जोड़ें</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <Input
                            type="text"
                            value={newImageTitle}
                            onChange={(e) => setNewImageTitle(e.target.value)}
                            placeholder="तस्वीर का शीर्षक"
                          />
                          <select
                            value={newImageCategory}
                            onChange={(e) => setNewImageCategory(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="events">कार्यक्रम</option>
                            <option value="awards">पुरस्कार</option>
                            <option value="charity">दान</option>
                            <option value="members">सदस्य</option>
                            <option value="health">स्वास्थ्य</option>
                          </select>
                          <Button onClick={handleAddImage} className="bg-purple-500 hover:bg-purple-600">
                            <Upload className="h-4 w-4 mr-2" />
                            जोड़ें
                          </Button>
                        </div>
                      </div>

                      {/* Gallery Images */}
                      {loading.gallery ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">गैलरी लोड हो रही है...</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {galleryImages.map((image) => (
                            <Card key={image.id} className="border-2 border-purple-200 bg-white">
                              <div className="relative">
                                <img
                                  src={image.image_url}
                                  alt={image.title}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="absolute top-2 right-2">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteImage(image.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-bold text-lg">{image.title}</h3>
                                <p className="text-purple-600 font-medium">
                                  #{getCategoryName(image.category)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(image.created_at).toLocaleDateString('hi-IN')}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Bell className="h-6 w-6" />
                      सूचना प्रबंधन
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Add New Notification */}
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        <h3 className="font-bold text-lg mb-4">नई सूचना जोड़ें</h3>
                        <div className="space-y-4">
                          <Input
                            type="text"
                            value={newNotificationTitle}
                            onChange={(e) => setNewNotificationTitle(e.target.value)}
                            placeholder="सूचना का शीर्षक"
                          />
                          <textarea
                            value={newNotificationMessage}
                            onChange={(e) => setNewNotificationMessage(e.target.value)}
                            placeholder="सूचना का विवरण"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="grid md:grid-cols-2 gap-4">
                            <select
                              value={newNotificationType}
                              onChange={(e) => setNewNotificationType(e.target.value as any)}
                              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="info">जानकारी</option>
                              <option value="warning">चेतावनी</option>
                              <option value="success">सफलता</option>
                              <option value="emergency">आपातकाल</option>
                            </select>
                            <Button onClick={handleAddNotification} className="bg-blue-500 hover:bg-blue-600">
                              <Bell className="h-4 w-4 mr-2" />
                              सूचना जोड़ें
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Existing Notifications */}
                      {loading.notifications ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">सूचनाएं लोड हो रही हैं...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <Card key={notification.id} className="border-2 border-blue-200 bg-white">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg">{notification.title}</h3>
                                    <p className="text-gray-600">{notification.message}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className={`${
                                        notification.type === 'emergency' ? 'bg-red-500' :
                                        notification.type === 'warning' ? 'bg-yellow-500' :
                                        notification.type === 'success' ? 'bg-green-500' :
                                        'bg-blue-500'
                                      } text-white`}>
                                        {notification.type === 'emergency' ? 'आपातकाल' :
                                         notification.type === 'warning' ? 'चेतावनी' :
                                         notification.type === 'success' ? 'सफलता' :
                                         'जानकारी'}
                                      </Badge>
                                      <span className="text-sm text-gray-500">
                                        {new Date(notification.created_at).toLocaleDateString('hi-IN')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
