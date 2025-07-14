"use client"
import { useAuth } from "../layout"
import PaymentHistoryPage from "@/components/payment-history-page"

export default function PaymentHistory() {
  const { user, isLoggedIn } = useAuth()
  return <PaymentHistoryPage user={user} isLoggedIn={isLoggedIn} />
} 