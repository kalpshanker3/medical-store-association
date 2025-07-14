"use client"
import { useAuth } from "../layout"
import LoginPage from "@/components/login-page"

export default function Login() {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth()
  return <LoginPage user={user} isLoggedIn={isLoggedIn} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
} 