"use client"
import { useAuth } from "../layout"
import GroupsPage from "@/components/groups-page"

export default function Groups() {
  const { user, isLoggedIn } = useAuth()
  return <GroupsPage user={user} isLoggedIn={isLoggedIn} />
} 