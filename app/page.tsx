"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"
import HomePage from "@/components/home-page"
import LoginPage from "@/components/login-page"
import RegisterPage from "@/components/register-page"
import AdminPage from "@/components/admin-page"
import ContactPage from "@/components/contact-page"
import DonatePage from "@/components/donate-page"
import FaqPage from "@/components/faq-page"
import GalleryPage from "@/components/gallery-page"
import GroupsPage from "@/components/groups-page"
import MembershipPaymentPage from "@/components/membership-payment-page"
import NotificationsPage from "@/components/notifications-page"
import PaymentHistoryPage from "@/components/payment-history-page"
import StatusPage from "@/components/status-page"

export interface AppState {
  currentPage: string
  setCurrentPage: (page: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const savedUser = localStorage.getItem('user')
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn')
        
        if (savedUser && savedIsLoggedIn === 'true') {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsLoggedIn(true)
          
          // Redirect admin to admin page
          if (userData.role === 'admin') {
            setCurrentPage('admin')
          }
        }
      } catch (error) {
        console.error('Error loading session:', error)
        // Clear invalid session
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  // Save session to localStorage when user state changes
  useEffect(() => {
    if (user && isLoggedIn) {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true')
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    }
  }, [user, isLoggedIn])

  // Logout function
  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setCurrentPage("home")
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
  }

  const appState: AppState = {
    currentPage,
    setCurrentPage,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    logout,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  // Render page based on currentPage state
  switch (currentPage) {
    case "home":
      return <HomePage {...appState} />
    case "login":
      return <LoginPage {...appState} />
    case "register":
      return <RegisterPage {...appState} />
    case "admin":
      return <AdminPage {...appState} />
    case "contact":
      return <ContactPage {...appState} />
    case "donate":
      return <DonatePage {...appState} />
    case "faq":
      return <FaqPage {...appState} />
    case "gallery":
      return <GalleryPage {...appState} />
    case "groups":
      return <GroupsPage {...appState} />
    case "membership-payment":
      return <MembershipPaymentPage {...appState} />
    case "notifications":
      return <NotificationsPage {...appState} />
    case "payment-history":
      return <PaymentHistoryPage {...appState} />
    case "status":
      return <StatusPage {...appState} />
    default:
      return <HomePage {...appState} />
  }
}
