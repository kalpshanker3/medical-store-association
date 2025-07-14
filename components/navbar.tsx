"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Users, Bell, User, Building, Menu, X, ArrowLeft } from "lucide-react"
// import type { AppState } from "../app/page"
import Link from "next/link"
import { useAuth } from "../app/layout"

export default function Navbar() {
  const { isLoggedIn, user, logout, setUser, setIsLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Only show Profile and Contact Us if user is pending
  const isPending = isLoggedIn && user && (user.status === "pending" || user.status === "rejected");

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl"></div>
      <div className="container-responsive relative">
        <div className="flex justify-between items-center py-4 sm:py-5">
          {/* Back Button */}
          {/* Removed Back Button as per new_code */}

          {/* Logo */}
          <div
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer touch-manipulation group"
            onClick={() => {}}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-active:scale-95 transition-all duration-300 group-hover:rotate-3 border-2 border-white/20">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-200 via-white to-blue-200 bg-clip-text text-transparent leading-tight group-hover:scale-105 transition-transform duration-300">
              फुटकर दवा व्यापार मंडल
            </h1>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-3">
              {isPending ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl btn-mobile backdrop-blur-sm border border-transparent hover:border-white/20 px-4 py-2"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {user?.name || "प्रोफ़ाइल"}
                  </Button>
                  <Link href="/contact"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl btn-mobile backdrop-blur-sm border border-transparent hover:border-white/20 px-4 py-2"
                  >
                    संपर्क करें
                  </Button></Link>
                </>
              ) : (
                <>
                  <Link href="/"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl btn-mobile backdrop-blur-sm border border-transparent hover:border-white/20 px-4 py-2"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    होम
                  </Button></Link>
                  <Link href="/groups"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl btn-mobile backdrop-blur-sm border border-transparent hover:border-white/20 px-4 py-2"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    ग्रुप्स
                  </Button></Link>
                  <Link href="/notifications"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl btn-mobile backdrop-blur-sm border border-transparent hover:border-white/20 px-4 py-2 relative"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    नोटिफिकेशन
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
                  </Button></Link>
                  <Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl btn-mobile backdrop-blur-sm border border-transparent hover:border-white/20 px-4 py-2"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {user?.name || "प्रोफ़ाइल"}
                  </Button>
                </>
              )}
              <Button
                className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 btn-mobile border border-white/20 backdrop-blur-sm"
                onClick={handleLogout}
              >
                लॉग आउट
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-3">
              <Link href="/register"><Button
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 btn-mobile border border-white/20 backdrop-blur-sm"
              >
                रजिस्टर करें
              </Button></Link>
              <Link href="/login"><Button
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 btn-mobile border border-white/20 backdrop-blur-sm"
              >
                लॉग इन करें
              </Button></Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-white/90 hover:text-white hover:bg-white/10 p-3 rounded-2xl btn-mobile backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-white/10 mt-2 backdrop-blur-xl bg-white/5 rounded-b-3xl">
            <div className="flex flex-col space-y-3 pt-6 px-2">
              {/* Back Button for Mobile */}
              {/* Removed Back Button for Mobile as per new_code */}

              {isLoggedIn ? (
                <>
                  <Link href="/"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 justify-start rounded-2xl btn-mobile backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 py-4"
                  >
                    <Home className="h-5 w-5 mr-3" />
                    होम
                  </Button></Link>
                  <Link href="/groups"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 justify-start rounded-2xl btn-mobile backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 py-4"
                  >
                    <Users className="h-5 w-5 mr-3" />
                    ग्रुप्स
                  </Button></Link>
                  <Link href="/notifications"><Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 justify-start rounded-2xl btn-mobile backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 py-4 relative"
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    नोटिफिकेशन
                    <span className="absolute left-8 top-3 w-2 h-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse"></span>
                  </Button></Link>
                  <Button
                    variant="ghost"
                    className="text-white/90 hover:text-white hover:bg-white/10 justify-start rounded-2xl btn-mobile backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 py-4"
                  >
                    <User className="h-5 w-5 mr-3" />
                    प्रोफ़ाइल
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/register"><Button
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-xl btn-mobile border border-white/20 backdrop-blur-sm py-4"
                  >
                    रजिस्टर करें
                  </Button></Link>
                  <Link href="/login"><Button
                    className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-semibold rounded-2xl shadow-xl btn-mobile border border-white/20 backdrop-blur-sm py-4"
                  >
                    लॉग इन करें
                  </Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
