"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Sparkles, Heart, Users, Database } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../lib/types"
import { Badge } from "@/components/ui/badge"
import { supabase, testSupabaseConnection } from "../lib/supabase"
import { ConnectionStatus } from "./connection-status"
import Link from "next/link"
import { useRouter } from "next/navigation"


// Gallery images will be fetched from database
const galleryImages: string[] = []

export default function HomePage(appState: AppState) {
  const router = useRouter();
  const [typedText, setTypedText] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [randomImages, setRandomImages] = useState<string[]>([])

  const aboutText =
    "हमारी संस्था सभी मेडिकल स्टोर मालिकों को एक साथ लाने का काम करती है। हम एक दूसरे की मदद करते हैं और किसी अप्रिय घटना होने पर उनके परिवार की सहायता करते हैं। यह एक सहयोग और भाईचारे की संस्था है।"

  // Function to get random images from gallery
  const getRandomImages = () => {
    const shuffled = [...galleryImages].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4) // Show 4 random images
  }

  // Typing animation effect
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < aboutText.length) {
        setTypedText(aboutText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  // Initialize random images and set up carousel
  useEffect(() => {
    const randomImgs = getRandomImages()
    setRandomImages(randomImgs)

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % randomImgs.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // Refresh random images every 30 seconds
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      const newRandomImages = getRandomImages()
      setRandomImages(newRandomImages)
      setCurrentImageIndex(0)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshTimer)
  }, [])

  // Fetch the user's membership status from the database on mount and update appState.user with latest membership information
  useEffect(() => {
    // Fetch latest user profile to get membership status
    const fetchUserProfile = async () => {
      if (appState.isLoggedIn && appState.user?.id) {
        const { data, error } = await supabase.from('users').select('*').eq('id', appState.user.id).single()
        if (data) {
          appState.setUser({ ...appState.user, ...data })
        }
      }
    }
    fetchUserProfile()
  }, [appState.isLoggedIn, appState.user?.id])

  // Remove any code that checks or displays database connection status, alerts, or debug info


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%236366f1'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`}
      />

      <Navbar />

      <div className="container-responsive py-6 sm:py-8 lg:py-12 relative bg-slate-200">
        {/* About Section */}
        <Card className="mb-8 sm:mb-12 shadow-2xl rounded-3xl sm:rounded-[2rem] border-0 bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02] card-touch border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl sm:rounded-[2rem]"></div>
          <CardHeader className="pb-6 sm:pb-8 relative">
            <CardTitle className="heading-responsive font-bold text-center bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500 animate-pulse drop-shadow-lg" />
              <span className="drop-shadow-sm text-black">संस्था के बारे में</span>
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500 animate-pulse drop-shadow-lg" />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <p className="text-responsive sm:text-lg lg:text-xl leading-relaxed text-slate-700 min-h-[120px] sm:min-h-[150px] font-medium drop-shadow-sm">
                  {typedText}
                  <span className="animate-pulse text-blue-500 text-xl sm:text-2xl">|</span>
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 text-slate-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                  <Heart className="h-6 w-6 text-red-500 animate-pulse drop-shadow-sm" />
                  <span className="font-semibold text-center sm:text-left">सहयोग • भाईचारा • एकजुटता</span>
                </div>
                

              </div>
              <div className="relative h-72 sm:h-96 rounded-3xl sm:rounded-[2rem] overflow-hidden shadow-2xl group order-1 lg:order-2 border-4 border-white/50">
                {randomImages.length > 0 && (
                  <img
                    src={randomImages[currentImageIndex] || "/placeholder.svg"}
                    alt="Community"
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 sm:space-x-4">
                  {randomImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30 ${
                        index === currentImageIndex
                          ? "bg-white scale-125 shadow-xl"
                          : "bg-white/60 hover:bg-white/80 hover:scale-110"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Image ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-medium border border-white/20">
                  🖼️ गैलरी से
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership/Donation Section - Only for logged in users */}
        {appState.isLoggedIn && (
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Membership Card */}
            <Card className="shadow-2xl rounded-3xl sm:rounded-[2rem] border-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02] card-touch border border-white/20 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl sm:rounded-[2rem] group-hover:from-emerald-500/15 group-hover:via-teal-500/15 group-hover:to-cyan-500/15 transition-all duration-500"></div>
              <CardContent className="p-8 sm:p-10 text-center relative">
                <div className="mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border-4 border-white/30">
                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 drop-shadow-sm">सदस्यता शुल्क</h3>
                  <p className="text-slate-600 font-medium mb-6 text-lg">वार्षिक सदस्यता: ₹100</p>
                </div>
                <div className="mb-6">
                  {appState.user?.membership_status === "active" ? (
                    <div className="space-y-3">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
                        ✅ सक्रिय सदस्य
                      </Badge>
                      {appState.user?.membership_expiry_date && (
                        <div className="text-sm text-slate-600 bg-white/80 p-3 rounded-xl border border-emerald-200">
                          <p className="font-semibold">सदस्यता समाप्ति: {new Date(appState.user.membership_expiry_date).toLocaleDateString('hi-IN')}</p>
                          <p className="text-xs text-slate-500">
                            {(() => {
                              const expiryDate = new Date(appState.user.membership_expiry_date)
                              const today = new Date()
                              const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                              if (daysLeft > 0) {
                                return `${daysLeft} दिन शेष`
                              } else if (daysLeft === 0) {
                                return "आज समाप्त हो रही है"
                              } else {
                                return "समाप्त हो गई है"
                              }
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : appState.user?.membership_status === "expired" ? (
                    <div className="space-y-3">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
                        ⚠️ सदस्यता समाप्त
                      </Badge>
                      <div className="text-sm text-slate-600 bg-white/80 p-3 rounded-xl border border-red-200">
                        <p className="font-semibold text-red-700">कृपया नई सदस्यता के लिए भुगतान करें</p>
                      </div>
                    </div>
                  ) : (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg">
                      ⏳ सदस्यता प्रतीक्षारत
                    </Badge>
                  )}
                </div>

                <Link href="/membership-payment">
                  <Button
                    className="w-full h-16 sm:h-18 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 rounded-2xl font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 btn-mobile text-lg border-2 border-white/20 backdrop-blur-sm"
                  >
                    💳 सदस्यता शुल्क भरें
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Donation Card */}
            <Card className="shadow-2xl rounded-3xl sm:rounded-[2rem] border-0 bg-gradient-to-br from-rose-50/90 via-pink-50/90 to-red-50/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02] card-touch border border-white/20 group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-red-500/10 rounded-3xl sm:rounded-[2rem] group-hover:from-rose-500/15 group-hover:via-pink-500/15 group-hover:to-red-500/15 transition-all duration-500"></div>
              <CardContent className="p-8 sm:p-10 text-center relative">
                <div className="mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border-4 border-white/30">
                    <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-pulse drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 drop-shadow-sm">दान करें</h3>
                  <p className="text-slate-600 font-medium mb-6 text-lg">जरूरतमंद परिवारों की सहायता करें</p>
                </div>

                <div className="bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-rose-200/50">
                  <p className="text-slate-700 font-semibold text-base sm:text-lg">
                    🙏 दुर्घटनाग्रस्त सदस्यों के परिवार की सहायता के लिए दान करें
                  </p>
                </div>

                <Link href="/donate">
                  <Button
                    className="w-full h-16 sm:h-18 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 rounded-2xl font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 btn-mobile text-lg border-2 border-white/20 backdrop-blur-sm"
                  >
                    💝 दान करें
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons - Three in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 sm:mb-12">
          <Link href="/contact">
            <Button className="h-20 sm:h-24 text-lg sm:text-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold btn-mobile border-2 border-white/20 backdrop-blur-sm group w-full">
              <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl sm:text-3xl drop-shadow-lg">📞</span>
                <span className="drop-shadow-sm">संपर्क करें</span>
              </div>
            </Button>
          </Link>
          <Link href="/gallery">
            <Button className="h-20 sm:h-24 text-lg sm:text-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold btn-mobile border-2 border-white/20 backdrop-blur-sm group w-full">
              <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl sm:text-3xl drop-shadow-lg">🖼️</span>
                <span className="drop-shadow-sm">गैलरी</span>
              </div>
            </Button>
          </Link>
          <Link href="/faq">
            <Button className="h-20 sm:h-24 text-lg sm:text-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold btn-mobile border-2 border-white/20 backdrop-blur-sm group w-full">
              <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl sm:text-3xl drop-shadow-lg">❓</span>
                <span className="drop-shadow-sm">प्रश्न उत्तर</span>
              </div>
            </Button>
          </Link>
        </div>
        {/* Admin Button - Separate row */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <Button
            className="h-20 sm:h-24 text-lg sm:text-xl bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600 hover:from-slate-700 hover:via-gray-700 hover:to-zinc-700 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold btn-mobile border-2 border-white/20 backdrop-blur-sm group w-full max-w-lg"
            onClick={() => {
              if (!appState.isLoggedIn) {
                alert("कृपया पहले लॉग इन करें");
                return;
              }
              if (appState.user?.role !== "admin") {
                alert("आपको प्रशासन पैनल का अधिकार नहीं है");
                return;
              }
              router.push("/admin");
            }}
          >
            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl sm:text-3xl drop-shadow-lg">⚙️</span>
              <span className="drop-shadow-sm">प्रशासन</span>
            </div>
          </Button>
        </div>
        {/* Payment History Button for logged in users - Wide row at bottom */}
        {appState.isLoggedIn && (
          <div className="text-center mb-12 sm:mb-16">
            <Link href="/payment-history">
              <Button
                className="h-20 sm:h-24 px-12 sm:px-16 text-lg sm:text-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold btn-mobile border-2 border-white/20 backdrop-blur-sm group w-full max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-4 group-hover:scale-110 transition-transform duration-300 justify-center">
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-sm" />
                  <span className="drop-shadow-sm">💳 भुगतान इतिहास</span>
                </div>
              </Button>
            </Link>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="bg-gradient-to-br from-blue-100/80 via-indigo-100/80 to-purple-100/80 backdrop-blur-xl border-0 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 card-touch border-2 border-white/30 group">
            <CardContent className="p-6 sm:p-8 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 mx-auto mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 drop-shadow-sm">500+</h3>
              <p className="text-slate-600 font-medium text-base sm:text-lg">सक्रिय सदस्य</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-100/80 via-teal-100/80 to-cyan-100/80 backdrop-blur-xl border-0 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 card-touch border-2 border-white/30 group">
            <CardContent className="p-6 sm:p-8 text-center">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 mx-auto mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 drop-shadow-sm">₹50L+</h3>
              <p className="text-slate-600 font-medium text-base sm:text-lg">कुल सहायता राशि</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-100/80 via-purple-100/80 to-fuchsia-100/80 backdrop-blur-xl border-0 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 card-touch sm:col-span-2 lg:col-span-1 border-2 border-white/30 group">
            <CardContent className="p-6 sm:p-8 text-center">
              <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-violet-600 mx-auto mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 drop-shadow-sm">100+</h3>
              <p className="text-slate-600 font-medium text-base sm:text-lg">सहायता प्राप्त परिवार</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
