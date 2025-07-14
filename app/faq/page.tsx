import { useAuth } from "../layout"
import FaqPage from "@/components/faq-page"

export default function FAQ() {
  const { user, isLoggedIn } = useAuth()
  return <FaqPage user={user} isLoggedIn={isLoggedIn} />
} 