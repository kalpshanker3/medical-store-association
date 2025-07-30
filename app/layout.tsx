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
  const [error, setError] = useState<string | null>(null)

  // No localStorage for auth state; always use Supabase session

  // Sync with Supabase session on mount
  useEffect(() => {
    const checkExpiredMemberships = async () => {
      try {
        const { error } = await supabase.rpc('check_expired_memberships')
        if (error) console.error('Error checking expired memberships:', error)
      } catch (err) {
        console.error('Failed to check expired memberships:', err)
      }
    }
    checkExpiredMemberships()

    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Supabase session:', data?.session);
        if (data?.session && data.session.user) {
          // Fetch user profile from DB
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          console.log('User profile:', userProfile, userError);
          if (userProfile) {
            setUser(userProfile);
            setIsLoggedIn(true);
            setError(null);
          } else {
            // Profile missing, log out and show error
            setUser(null);
            setIsLoggedIn(false);
            setError('User profile not found. Please login again.');
            await supabase.auth.signOut();
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setError(null);
        }
      } catch (err) {
        setUser(null);
        setIsLoggedIn(false);
        setError('Something went wrong. Please refresh or login again.');
        console.error('Error in checkSession:', err);
      }
      setIsLoading(false);
    };
    checkSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (userProfile) {
            setUser(userProfile);
            setIsLoggedIn(true);
            setError(null);
          } else {
            setUser(null);
            setIsLoggedIn(false);
            setError('User profile not found. Please login again.');
            await supabase.auth.signOut();
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setError(null);
        }
      } catch (err) {
        setUser(null);
        setIsLoggedIn(false);
        setError('Something went wrong. Please refresh or login again.');
        console.error('Error in onAuthStateChange:', err);
      }
      setIsLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Auto-refresh user profile every 30s and on window focus
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setUser(data);
    };
    const interval = setInterval(fetchProfile, 30000); // every 30 seconds
    const onFocus = () => { fetchProfile(); };
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [isLoggedIn, user?.id]);

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsLoggedIn(false)
    setError(null)
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

  if (error) {
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
                <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
                  onClick={logout}
                >
                  लॉगिन पेज पर जाएं
                </button>
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
