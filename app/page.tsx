"use client"

import { useAuth } from "./layout"
import HomePage from "@/components/home-page"

export default function Home() {
  const { user, isLoggedIn } = useAuth()
  // You can use user and isLoggedIn to render content or redirect
  return <HomePage user={user} isLoggedIn={isLoggedIn} />
}
