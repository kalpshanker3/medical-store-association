"use client"
import { useAuth } from "../layout"
import NotificationsPage from "@/components/notifications-page"

export default function Notifications() {
  const { user, isLoggedIn } = useAuth()
  return <NotificationsPage user={user} isLoggedIn={isLoggedIn} />
} 