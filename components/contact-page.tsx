import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Users, Building } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"

export default function ContactPage(appState: AppState) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100">
      <Navbar {...appState} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
            <Phone className="h-10 w-10 text-teal-500" />
            संपर्क करें
          </h2>
          <p className="text-xl text-gray-700">हमसे जुड़ें और अपनी समस्याओं का समाधान पाएं</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white via-teal-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-3xl">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building className="h-8 w-8" />
                मुख्यालय की जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl">
                <MapPin className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-bold text-blue-800">पता:</h4>
                  <p className="text-gray-700">
                    मेडिकल कॉलेज रोड, गोरखपुर
                    <br />
                    उत्तर प्रदेश - 273013
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
                <Phone className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-bold text-green-800">फ़ोन नंबर:</h4>
                  <p className="text-gray-700 font-mono text-lg">
                    Contact details will be updated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                <Mail className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-bold text-purple-800">ईमेल:</h4>
                  <p className="text-gray-700">
                    info@medicalstoreunion.org
                    <br />
                    support@medicalstoreunion.org
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white via-orange-50 to-yellow-50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-3xl">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Clock className="h-8 w-8" />
                कार्यालय समय
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
                <h4 className="font-bold text-orange-800 mb-3">सप्ताह के दिन:</h4>
                <p className="text-gray-700 text-lg">
                  सोमवार - शुक्रवार
                  <br />
                  सुबह 9:00 - शाम 6:00
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
                <h4 className="font-bold text-indigo-800 mb-3">शनिवार:</h4>
                <p className="text-gray-700 text-lg">सुबह 9:00 - दोपहर 2:00</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl">
                <h4 className="font-bold text-red-800 mb-3">रविवार:</h4>
                <p className="text-gray-700 text-lg">बंद (आपातकाल में फ़ोन करें)</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl text-center">
                <h4 className="font-bold text-green-800 mb-2">24/7 हेल्पलाइन:</h4>
                <p className="text-2xl font-bold text-green-700">📞 1800-123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white via-purple-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-3xl">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Users className="h-8 w-8" />
              प्रमुख अधिकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-bold text-purple-800 text-lg">राम प्रकाश शर्मा</h4>
                <p className="text-purple-600 font-medium">अध्यक्ष</p>
                <p className="text-gray-600 text-sm mt-2">📞 Contact details will be updated</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-bold text-teal-800 text-lg">श्याम सुंदर गुप्ता</h4>
                <p className="text-teal-600 font-medium">सचिव</p>
                <p className="text-gray-600 text-sm mt-2">📞 Contact details will be updated</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-bold text-red-800 text-lg">मोहन लाल सिंह</h4>
                <p className="text-red-600 font-medium">कोषाध्यक्ष</p>
                <p className="text-gray-600 text-sm mt-2">📞 Contact details will be updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
