"use client"

import { useState, useEffect } from "react"
import HomePage from "../components/home-page"
import RegisterPage from "../components/register-page"
import StatusPage from "../components/status-page"
import GroupsPage from "../components/groups-page"
import DonatePage from "../components/donate-page"
import ContactPage from "../components/contact-page"
import GalleryPage from "../components/gallery-page"
import FAQPage from "../components/faq-page"
import PaymentHistoryPage from "../components/payment-history-page"
import MembershipPaymentPage from "../components/membership-payment-page"
import AdminPage from "../components/admin-page"
import LoginPage from "../components/login-page"
import NotificationsPage from "../components/notifications-page"

export type Page =
  | "home"
  | "register"
  | "login"
  | "status"
  | "groups"
  | "donate"
  | "contact"
  | "gallery"
  | "faq"
  | "payment-history"
  | "membership-payment"
  | "admin"
  | "notifications"

export interface AssociationUser {
  name: string
  phone: string
  alternatePhone?: string
  aadhar: string
  storeName: string
  location: string
  gstNumber: string
  drugLicenseNumber: string
  drugLicenseStartDate: string
  drugLicenseEndDate: string
  foodLicenseNumber: string
  foodLicenseStartDate: string
  foodLicenseEndDate: string
  age: string
  accountNumber: string
  ifsc: string
  branch: string
  // Nominee Information
  nomineeName?: string
  nomineeRelation?: string
  customNomineeRelation?: string // Add this line
  nomineePhone?: string
  nomineeAccountNumber?: string
  nomineeIfsc?: string
  nomineeBranch?: string
  status: "प्रगति में है" | "स्वीकृत"
  membershipStatus?: "active" | "pending"
  role?: "user" | "admin"
}

export interface AppState {
  currentPage: Page
  isLoggedIn: boolean
  user: AssociationUser | null
  setCurrentPage: (page: Page) => void
  setIsLoggedIn: (loggedIn: boolean) => void
  setUser: (user: AssociationUser | null) => void
}

export default function MedicalStoreAssociation() {
  const [currentPage, setCurrentPageState] = useState<Page>("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AssociationUser | null>(null)
  const [pageHistory, setPageHistory] = useState<Page[]>(["home"])

  // Custom setCurrentPage function with history management and scroll to top
  const setCurrentPage = (page: Page) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Add to history if it's a different page
    if (page !== currentPage) {
      setPageHistory((prev) => [...prev, page])
      // Update browser history
      window.history.pushState({ page }, "", `#${page}`)
    }
    setCurrentPageState(page)
  }

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Scroll to top when using back button
      window.scrollTo({ top: 0, behavior: "smooth" })

      if (pageHistory.length > 1) {
        // Remove current page from history
        const newHistory = [...pageHistory]
        newHistory.pop()

        // Get previous page
        const previousPage = newHistory[newHistory.length - 1] || "home"

        setPageHistory(newHistory)
        setCurrentPageState(previousPage)
      } else {
        // If no history, go to home
        setCurrentPageState("home")
        setPageHistory(["home"])
      }
    }

    // Listen for back button
    window.addEventListener("popstate", handlePopState)

    // Set initial state
    window.history.replaceState({ page: currentPage }, "", `#${currentPage}`)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [pageHistory, currentPage])

  // Initialize page from URL hash on load and scroll to top
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo({ top: 0, behavior: "auto" })

    const hash = window.location.hash.slice(1) as Page
    const validPages: Page[] = [
      "home",
      "register",
      "login",
      "status",
      "groups",
      "donate",
      "contact",
      "gallery",
      "faq",
      "payment-history",
      "membership-payment",
      "admin",
      "notifications",
    ]

    if (hash && validPages.includes(hash)) {
      setCurrentPageState(hash)
      setPageHistory([hash])
    }
  }, [])

  // Scroll to top whenever currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const appState: AppState = {
    currentPage,
    isLoggedIn,
    user,
    setCurrentPage,
    setIsLoggedIn,
    setUser,
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "register":
        return <RegisterPage {...appState} />
      case "login":
        return <LoginPage {...appState} />
      case "status":
        return <StatusPage {...appState} />
      case "groups":
        return <GroupsPage {...appState} />
      case "donate":
        return <DonatePage {...appState} />
      case "contact":
        return <ContactPage {...appState} />
      case "gallery":
        return <GalleryPage {...appState} />
      case "faq":
        return <FAQPage {...appState} />
      case "payment-history":
        return <PaymentHistoryPage {...appState} />
      case "membership-payment":
        return <MembershipPaymentPage {...appState} />
      case "admin":
        return <AdminPage {...appState} />
      case "notifications":
        return <NotificationsPage {...appState} />
      default:
        return <HomePage {...appState} />
    }
  }

  return <div className="font-sans">{renderCurrentPage()}</div>
}
