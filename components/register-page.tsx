"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"
import { registerUser } from "../lib/auth"

export default function RegisterPage(appState: AppState) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    location: "",
    aadhar: "",
    gstNumber: "",
    drugLicenseNumber: "",
    foodLicenseNumber: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    nomineeAccountNumber: "",
    nomineeIfsc: "",
    nomineeBranch: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("नाम आवश्यक है")
      return false
    }
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
    if (formData.password.length < 6) {
      setError("पासवर्ड कम से कम 6 अक्षर का होना चाहिए")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("पासवर्ड मेल नहीं खाते")
      return false
    }
    if (!formData.storeName.trim()) {
      setError("स्टोर का नाम आवश्यक है")
      return false
    }
    if (!formData.location.trim()) {
      setError("स्थान आवश्यक है")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await registerUser({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        store_name: formData.storeName,
        location: formData.location,
        aadhar: formData.aadhar,
        gst_number: formData.gstNumber,
        drug_license_number: formData.drugLicenseNumber,
        food_license_number: formData.foodLicenseNumber,
        account_number: formData.accountNumber,
        ifsc: formData.ifsc,
        branch: formData.branch,
        nominee_name: formData.nomineeName,
        nominee_relation: formData.nomineeRelation,
        nominee_phone: formData.nomineePhone,
        nominee_account_number: formData.nomineeAccountNumber,
        nominee_ifsc: formData.nomineeIfsc,
        nominee_branch: formData.nomineeBranch,
      })

      if (result.success) {
        setSuccess("रजिस्ट्रेशन सफल! कृपया प्रशासक से अनुमति लें।")
        setFormData({
          name: "",
          phone: "",
          password: "",
          confirmPassword: "",
          storeName: "",
          location: "",
          aadhar: "",
          gstNumber: "",
          drugLicenseNumber: "",
          foodLicenseNumber: "",
          accountNumber: "",
          ifsc: "",
          branch: "",
          nomineeName: "",
          nomineeRelation: "",
          nomineePhone: "",
          nomineeAccountNumber: "",
          nomineeIfsc: "",
          nomineeBranch: "",
        })
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("रजिस्ट्रेशन में त्रुटि हुई")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar {...appState} />

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <Card className="max-w-4xl mx-auto shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-3">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8" />
              नया सदस्य रजिस्ट्रेशन
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-gray-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">नाम *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="पूरा नाम"
                    required
                  />
                </div>
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
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">पासवर्ड *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="कम से कम 6 अक्षर"
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
                <div>
                  <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="पासवर्ड दोबारा लिखें"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">स्टोर का नाम *</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    type="text"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="मेडिकल स्टोर का नाम"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">स्थान *</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="शहर/गांव"
                    required
                  />
                </div>
              </div>

              {/* License Information */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="aadhar">आधार नंबर</Label>
                  <Input
                    id="aadhar"
                    name="aadhar"
                    type="text"
                    value={formData.aadhar}
                    onChange={handleInputChange}
                    placeholder="12 अंकों का आधार"
                    maxLength={12}
                  />
                </div>
                <div>
                  <Label htmlFor="gstNumber">GST नंबर</Label>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    type="text"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="GST नंबर"
                  />
                </div>
                <div>
                  <Label htmlFor="drugLicenseNumber">दवा लाइसेंस नंबर</Label>
                  <Input
                    id="drugLicenseNumber"
                    name="drugLicenseNumber"
                    type="text"
                    value={formData.drugLicenseNumber}
                    onChange={handleInputChange}
                    placeholder="दवा लाइसेंस नंबर"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="foodLicenseNumber">खाद्य लाइसेंस नंबर</Label>
                  <Input
                    id="foodLicenseNumber"
                    name="foodLicenseNumber"
                    type="text"
                    value={formData.foodLicenseNumber}
                    onChange={handleInputChange}
                    placeholder="खाद्य लाइसेंस नंबर"
                  />
                </div>
              </div>

              {/* Bank Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">बैंक विवरण</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">खाता नंबर</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="खाता नंबर"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc">IFSC कोड</Label>
                    <Input
                      id="ifsc"
                      name="ifsc"
                      type="text"
                      value={formData.ifsc}
                      onChange={handleInputChange}
                      placeholder="IFSC कोड"
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">शाखा</Label>
                    <Input
                      id="branch"
                      name="branch"
                      type="text"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="बैंक शाखा"
                    />
                  </div>
                </div>
              </div>

              {/* Nominee Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">नामांकित व्यक्ति का विवरण</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="nomineeName">नामांकित का नाम</Label>
                    <Input
                      id="nomineeName"
                      name="nomineeName"
                      type="text"
                      value={formData.nomineeName}
                      onChange={handleInputChange}
                      placeholder="नामांकित का नाम"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomineeRelation">संबंध</Label>
                    <Input
                      id="nomineeRelation"
                      name="nomineeRelation"
                      type="text"
                      value={formData.nomineeRelation}
                      onChange={handleInputChange}
                      placeholder="संबंध (पिता, पुत्र, आदि)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomineePhone">फोन नंबर</Label>
                    <Input
                      id="nomineePhone"
                      name="nomineePhone"
                      type="tel"
                      value={formData.nomineePhone}
                      onChange={handleInputChange}
                      placeholder="नामांकित का फोन"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="nomineeAccountNumber">खाता नंबर</Label>
                    <Input
                      id="nomineeAccountNumber"
                      name="nomineeAccountNumber"
                      type="text"
                      value={formData.nomineeAccountNumber}
                      onChange={handleInputChange}
                      placeholder="नामांकित का खाता"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomineeIfsc">IFSC कोड</Label>
                    <Input
                      id="nomineeIfsc"
                      name="nomineeIfsc"
                      type="text"
                      value={formData.nomineeIfsc}
                      onChange={handleInputChange}
                      placeholder="नामांकित का IFSC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomineeBranch">शाखा</Label>
                    <Input
                      id="nomineeBranch"
                      name="nomineeBranch"
                      type="text"
                      value={formData.nomineeBranch}
                      onChange={handleInputChange}
                      placeholder="नामांकित का बैंक"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appState.setCurrentPage("login")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  लॉगिन पर जाएं
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "रजिस्टर हो रहा है..." : "रजिस्टर करें"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
