import { useEffect, useState } from "react"
import { supabase, Donation, User } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, CheckCircle, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "./navbar"
import { useAuth } from "../app/layout"

interface PageProps {
  user: User | null;
  isLoggedIn: boolean;
}

export default function PaymentHistoryPage(props: PageProps) {
  const { user, isLoggedIn } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState<Donation[]>([])

  useEffect(() => {
    let donationSubscription: any
    const fetchDonations = async () => {
      const { data, error } = await supabase
        .from("donations")
        .select(`*, users:donor_id(name, phone, store_name, location)`) // join user info
        .order("created_at", { ascending: false })
      if (!error && data) setPaymentHistory(data)
    }
    fetchDonations()
    // Real-time listener
    donationSubscription = supabase
      .channel('donations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
        fetchDonations()
      })
      .subscribe()
    return () => {
      if (donationSubscription) supabase.removeChannel(donationSubscription)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      case "rejected":
        return "bg-gradient-to-r from-red-400 to-pink-500 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalPaid = paymentHistory
    .filter((payment) => payment.status === "approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  // Only show payment history for the logged-in user
  const filteredHistory = user ? paymentHistory.filter((p) => p.donor_id === user.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
            <CreditCard className="h-10 w-10 text-violet-500" />💳 भुगतान इतिहास
          </h2>
          <p className="text-xl text-gray-700">आपके सभी लेन-देन की जानकारी</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-800">₹{totalPaid.toLocaleString()}</h3>
              <p className="text-green-600 font-medium">कुल भुगतान</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-cyan-200 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-800">{paymentHistory.length}</h3>
              <p className="text-blue-600 font-medium">कुल लेन-देन</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-pink-200 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-purple-800">
                {paymentHistory.filter((p) => p.status === "approved").length}
              </h3>
              <p className="text-purple-600 font-medium">सफल भुगतान</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table */}
        <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white via-violet-50 to-purple-50">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-3xl">
            <CardTitle className="text-2xl flex items-center gap-3">
              <CreditCard className="h-8 w-8" />
              लेन-देन का विवरण
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">लेन-देन ID</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">प्राप्तकर्ता</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">राशि</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">दिनांक</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">स्थिति</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">दाता</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">रसीद</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((payment, index) => (
                    <tr
                      key={payment.id}
                      className={`border-b hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-sm font-bold text-violet-700">{payment.id}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium max-w-xs truncate">{payment.recipient_name}</td>
                      <td className="px-6 py-4 font-bold text-lg text-green-700">₹{payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{new Date(payment.donation_date).toLocaleDateString('hi-IN')}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusColor(payment.status)} px-3 py-1 rounded-full font-bold flex items-center gap-1 w-fit`}>
                          {getStatusIcon(payment.status)}
                          {payment.status === "approved" ? "सफल" : payment.status === "pending" ? "प्रगति में" : "अस्वीकृत"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium max-w-xs truncate">{payment.users?.name || "-"}</td>
                      <td className="px-6 py-4">
                        {payment.receipt_image_url ? (
                          <a href={payment.receipt_image_url} download target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 rounded-xl font-bold">
                              <Download className="h-4 w-4 mr-1" />
                              रसीद
                            </Button>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Download All Receipts */}
        <div className="text-center mt-8">
          <Button className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 rounded-2xl h-16 px-8 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Download className="h-6 w-6 mr-3" />📄 सभी रसीदें डाउनलोड करें
          </Button>
        </div>
      </div>
    </div>
  )
}
