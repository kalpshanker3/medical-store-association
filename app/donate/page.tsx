import { useAuth } from "../layout"
import DonatePage from "@/components/donate-page"

export default function Donate() {
  const { user, isLoggedIn } = useAuth()
  return <DonatePage user={user} isLoggedIn={isLoggedIn} />
} 