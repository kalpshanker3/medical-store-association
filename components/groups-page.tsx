"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, MapPin, Building, Users, Heart } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"

interface Member {
  name: string
  address: string
  storeName: string
}

export default function GroupsPage(appState: AppState) {
  const members: Member[] = [
    { name: "राम प्रसाद शर्मा", address: "गोरखपुर, उत्तर प्रदेश", storeName: "शर्मा मेडिकल स्टोर" },
    { name: "श्याम लाल गुप्ता", address: "देवरिया, उत्तर प्रदेश", storeName: "गुप्ता फार्मेसी" },
    { name: "मोहन सिंह", address: "कुशीनगर, उत्तर प्रदेश", storeName: "सिंह मेडिकल" },
    { name: "राजेश कुमार", address: "महराजगंज, उत्तर प्रदेश", storeName: "कुमार ड्रग्स" },
    { name: "सुरेश चंद्र", address: "बस्ती, उत्तर प्रदेश", storeName: "चंद्र फार्मेसी" },
    { name: "दिनेश कुमार", address: "सिद्धार्थनगर, उत्तर प्रदेश", storeName: "कुमार मेडिकल" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100">
      <Navbar {...appState} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <Users className="h-10 w-10 text-purple-600" />
              हमारे सदस्य
            </h2>
            <p className="text-lg text-gray-600 mt-2">एक साथ, एक परिवार 👨‍👩‍👧‍👦</p>
          </div>
          <Button
            onClick={() => appState.setCurrentPage("donate")}
            className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl h-16 px-8 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Heart className="h-6 w-6 mr-3 animate-pulse" />💝 दान करें
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <Card
              key={index}
              className="shadow-xl rounded-3xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white via-purple-50 to-pink-50"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-purple-800">{member.name}</h3>
                    <span className="text-sm text-purple-600 font-medium">सदस्य #{index + 1}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="text-gray-700 font-medium">{member.address}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                    <Building className="h-5 w-5 mr-3 text-green-600" />
                    <span className="text-gray-700 font-medium">{member.storeName}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl text-center">
                  <span className="text-orange-700 font-bold">🤝 सक्रिय सदस्य</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 border-0 rounded-3xl shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">🌟 सदस्यता के फायदे</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-indigo-700 font-medium">आर्थिक सहायता</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  <span className="text-indigo-700 font-medium">पारस्परिक सहयोग</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <span className="text-indigo-700 font-medium">पारिवारिक सुरक्षा</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📞</span>
                  <span className="text-indigo-700 font-medium">24/7 सहायता</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
