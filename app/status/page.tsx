import { useAuth } from "../layout"
import StatusPage from "@/components/status-page"

export default function Status() {
  const { user, isLoggedIn } = useAuth()
  return <StatusPage user={user} isLoggedIn={isLoggedIn} />
} 