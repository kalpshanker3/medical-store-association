"use client"
import { useAuth } from "../layout"
import AdminPage from "@/components/admin-page"

export default function Admin() {
  const { user, isLoggedIn, logout } = useAuth()
  return <AdminPage user={user} isLoggedIn={isLoggedIn} logout={logout} />
} 