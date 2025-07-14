"use client"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Medical Store Association",
  description: "Medical Store Association Management System",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const appState = {
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
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">लोड हो रहा है...</p>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
