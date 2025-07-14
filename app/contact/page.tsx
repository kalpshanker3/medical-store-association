"use client"
import { useAuth } from "../layout"
import ContactPage from "@/components/contact-page"

export default function Contact() {
  const { user, isLoggedIn } = useAuth()
  return <ContactPage user={user} isLoggedIn={isLoggedIn} />
} 