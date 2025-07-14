"use client"
import { useAuth } from "../layout"
import MembershipPaymentPage from "@/components/membership-payment-page"

export default function MembershipPayment() {
  const { user, isLoggedIn } = useAuth()
  return <MembershipPaymentPage user={user} isLoggedIn={isLoggedIn} />
} 