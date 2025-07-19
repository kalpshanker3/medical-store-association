"use client"
import { useAuth } from "../layout"
import StatusPage from "@/components/status-page"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Status() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

  // Redirect to home if user is approved
  useEffect(() => {
    if (isLoggedIn && user && user.status === "approved") {
      router.push("/")
    }
  }, [isLoggedIn, user, router])

  // Don't render anything if user is approved (will redirect)
  if (isLoggedIn && user && user.status === "approved") {
    return null
  }

  return <StatusPage user={user} isLoggedIn={isLoggedIn} />
} 