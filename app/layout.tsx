"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"

const inter = Inter({ subsets: ["latin"] })

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
          let userData
          try {
            userData = JSON.parse(savedUser)
            // Fallback: ensure userData has at least phone and name
            if (!userData || !userData.phone) throw new Error('Invalid user')
          } catch {
            userData = null
          }
          if (userData) {
            setUser(userData)
            setIsLoggedIn(true)
            if (userData.role === 'admin') {
              setCurrentPage('admin')
            }
          } else {
            setUser(null)
            setIsLoggedIn(false)
            setCurrentPage('home')
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
          }
        }
      } catch (error) {
        setUser(null)
        setIsLoggedIn(false)
        setCurrentPage('home')
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
        <head>
          <title>Medical Store Association</title>
          <meta name="description" content="Medical Store Association Management System" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#3b82f6" />
        </head>
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
      <head>
        <title>Medical Store Association</title>
        <meta name="description" content="Medical Store Association Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
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
