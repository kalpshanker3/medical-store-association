import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Hash, Building, CreditCard, Upload, Heart, User } from "lucide-react"
import Navbar from "./navbar"
import type { User } from "@/lib/supabase"
import { supabase, Accident } from "@/lib/supabase"
import { useAuth } from "../app/layout"

interface PageProps {
  user: User | null;
  isLoggedIn: boolean;
}

export default function DonatePage() {
  const { user, isLoggedIn } = useAuth();
  const [deceasedMembers, setDeceasedMembers] = useState<Accident[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<{ [accidentId: string]: string }>({});

  // Data fetch + real-time
  useEffect(() => {
    let accidentSubscription: any
    const fetchAccidents = async () => {
      const { data, error } = await supabase
        .from("accidents")
        .select(`*, users:member_id(name, aadhar, store_name, account_number, ifsc, branch)`) // join user info
        .eq("status", "active")
        .order("created_at", { ascending: false })
      if (!error && data) setDeceasedMembers(data)
    }
    fetchAccidents()
    // Real-time listener
    accidentSubscription = supabase
      .channel('accidents-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accidents' }, () => {
        fetchAccidents()
      })
      .subscribe()
    return () => {
      if (accidentSubscription) supabase.removeChannel(accidentSubscription)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, accidentId: string) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedAccidentId(accidentId);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, accidentId: string) => {
    setAmounts((prev) => ({ ...prev, [accidentId]: e.target.value }));
  };

  const handleUpload = async (accident: Accident) => {
    const amountStr = amounts[accident.id];
    const amount = Number(amountStr);
    if (!selectedFile || !user) {
      setUploadError("कृपया फ़ाइल चुनें और लॉगिन करें");
      return;
    }
    if (!amountStr || isNaN(amount) || amount <= 0) {
      setUploadError("कृपया मान्य राशि दर्ज करें");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      // 1. Upload to Supabase Storage
      const filePath = `donations/${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('receipts').upload(filePath, selectedFile);
      if (uploadError) throw uploadError;
      // 2. Get public URL
      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(filePath);
      const receiptUrl = urlData.publicUrl;
      // 3. Insert donation record
      const { error: dbError } = await supabase.from('donations').insert({
        donor_id: user.id,
        recipient_name: accident.users?.name || '',
        amount,
        receipt_image_url: receiptUrl,
        status: 'pending',
        donation_date: new Date().toISOString(),
      });
      if (dbError) throw dbError;
      setUploadSuccess(true);
      setSelectedFile(null);
      setAmounts((prev) => ({ ...prev, [accident.id]: '' }));
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-red-500 animate-pulse" />
            दुर्घटनाग्रस्त सदस्यों के परिवार की सहायता
          </h2>
          <p className="text-xl text-gray-700 font-medium">🙏 उनकी जल्दी स्वस्थता की कामना और परिवार को सहारा मिले</p>
        </div>

        {deceasedMembers.map((accident, index) => (
          <Card key={accident.id} className="mb-8 shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white via-orange-50 to-red-50 hover:shadow-3xl transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-3xl">
              <CardTitle className="text-2xl flex items-center gap-3">
                <User className="h-8 w-8" />
                {accident.users?.name || "-"}
                <span className="text-lg">🕯️</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
                    <Hash className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-600 font-medium">आधार नंबर:</span>
                      <div className="font-bold text-lg text-blue-800">{accident.users?.aadhar || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
                    <Building className="h-6 w-6 mr-3 text-green-600" />
                    <div>
                      <span className="text-sm text-gray-600 font-medium">स्टोर का नाम:</span>
                      <div className="font-bold text-lg text-green-800">{accident.users?.store_name || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                    <CreditCard className="h-6 w-6 mr-3 text-purple-600" />
                    <div>
                      <span className="text-sm text-gray-600 font-medium">खाता नंबर:</span>
                      <div className="font-bold text-lg text-purple-800">{accident.users?.account_number || "-"}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
                    <span className="text-sm text-gray-600 font-medium">IFSC कोड:</span>
                    <div className="font-bold text-lg text-orange-800">{accident.users?.ifsc || "-"}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl">
                    <span className="text-sm text-gray-600 font-medium">शाखा:</span>
                    <div className="font-bold text-lg text-indigo-800">{accident.users?.branch || "-"}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl">
                    <span className="text-sm text-gray-600 font-medium">दुर्घटना का प्रकार:</span>
                    <div className="font-bold text-lg text-red-800">{accident.accident_type || accident.custom_accident_type || "-"}</div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl">
                  <h4 className="font-bold text-xl mb-4 text-green-800 flex items-center gap-2">
                    <Upload className="h-6 w-6" />💳 भुगतान की रसीद अपलोड करें:
                  </h4>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <Input
                      type="number"
                      min="1"
                      placeholder="राशि (₹)"
                      className="w-32 rounded-xl h-12 border-2 border-green-300 focus:border-green-500"
                      value={amounts[accident.id] || ''}
                      onChange={e => handleAmountChange(e, accident.id)}
                      disabled={uploading}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      className="flex-1 rounded-xl h-12 border-2 border-green-300 focus:border-green-500"
                      onChange={e => handleFileChange(e, accident.id)}
                      disabled={uploading}
                    />
                    <Button
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl h-12 px-8 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      onClick={() => handleUpload(accident)}
                      disabled={uploading || !selectedFile || selectedAccidentId !== accident.id}
                    >
                      {uploading && selectedAccidentId === accident.id ? 'Uploading...' : <><Upload className="h-5 w-5 mr-2" />📤 अपलोड करें</>}
                    </Button>
                  </div>
                  {uploadSuccess && selectedAccidentId === accident.id && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl">
                      <p className="text-green-700 font-bold text-center flex items-center justify-center gap-2">
                        ✅ आपकी दान रसीद प्रशासन को भेज दी गई है
                        <Heart className="h-5 w-5 text-red-500 animate-pulse" />
                      </p>
                    </div>
                  )}
                  {uploadError && selectedAccidentId === accident.id && (
                    <div className="mt-4 p-4 bg-red-100 rounded-xl text-red-700 font-bold text-center">
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-0 rounded-3xl shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-orange-800 mb-4">🙏 दान के नियम</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span className="text-orange-700 font-medium">न्यूनतम दान राशि: ₹500</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                <span className="text-orange-700 font-medium">दान की समय सीमा: 30 दिन</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <span className="text-orange-700 font-medium">UPI/NEFT/RTGS स्वीकार्य</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                <span className="text-orange-700 font-medium">रसीद अपलोड अनिवार्य</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
