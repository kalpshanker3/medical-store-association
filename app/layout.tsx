"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"
import { createContext, useContext } from "react"
import StatusPage from "@/components/status-page"

const inter = Inter({ subsets: ["latin"] })

// AuthContext for global auth state
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  setIsLoggedIn: (loggedIn: boolean) => void
  logout: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Sync with Supabase session on mount
  useEffect(() => {
    // Remove timeout logic, just fetch session/profile as before
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (data?.session && data.session.user) {
          // Fetch user profile from DB
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
          if (userProfile) {
            setUser(userProfile)
            setIsLoggedIn(true)
            localStorage.setItem('user', JSON.stringify(userProfile))
            localStorage.setItem('isLoggedIn', 'true')
          } else {
            setUser(null)
            setIsLoggedIn(false)
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
          }
        } else {
          setUser(null)
          setIsLoggedIn(false)
          localStorage.removeItem('user')
          localStorage.removeItem('isLoggedIn')
        }
      } catch (err) {
        setUser(null)
        setIsLoggedIn(false)
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
      }
      setIsLoading(false)
    }
    checkSession()
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (userProfile) {
            setUser(userProfile)
            setIsLoggedIn(true)
            localStorage.setItem('user', JSON.stringify(userProfile))
            localStorage.setItem('isLoggedIn', 'true')
          } else {
            setUser(null)
            setIsLoggedIn(false)
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
          }
        } else {
          setUser(null)
          setIsLoggedIn(false)
          localStorage.removeItem('user')
          localStorage.removeItem('isLoggedIn')
        }
      } catch (err) {
        setUser(null)
        setIsLoggedIn(false)
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
      }
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
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
          <AuthContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, logout }}>
            {/* Block all pages except status for pending/rejected users */}
            {isLoggedIn && user && (user.status === "pending" || user.status === "rejected") ? (
              <StatusPage user={user} isLoggedIn={isLoggedIn} setUser={setUser} setIsLoggedIn={setIsLoggedIn} setCurrentPage={() => {}} />
            ) : (
              children
            )}
          </AuthContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
