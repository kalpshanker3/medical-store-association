"use client"
import { useAuth } from "../layout"
import GalleryPage from "@/components/gallery-page"

export default function Gallery() {
  const { user, isLoggedIn } = useAuth()
  return <GalleryPage user={user} isLoggedIn={isLoggedIn} />
} 