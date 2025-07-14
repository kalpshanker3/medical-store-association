"use client"
import { useAuth } from "../layout"
import RegisterPage from "@/components/register-page"

export default function Register() {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth()
  return <RegisterPage user={user} isLoggedIn={isLoggedIn} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
} 