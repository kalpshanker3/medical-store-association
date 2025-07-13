"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "./navbar"
import type { AppState } from "../app/page"

interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "success" | "emergency"
  date: string
  isRead: boolean
}

export default function NotificationsPage(appState: AppState) {
  // Sample notifications - in real app, this would come from state/API
  const notifications: Notification[] = [
    {
      id: 1,
      title: "नई सदस्यता शुल्क दरें",
      message: "1 अप्रैल 2024 से सदस्यता शुल्क ₹100 से बढ़कर ��150 हो जाएगा। कृपया समय पर भुगतान करें।",
      type: "warning",
      date: "2024-03-15",
      isRead: false,
    },
    {
      id: 2,
      title: "वार्षिक सभा की सूचना",
      message: "वार्षिक सभा 25 मार्च 2024 को गोरखपुर मुख्यालय में आयोजित होगी। सभी सदस्यों की उपस्थिति आवश्यक है।",
      type: "info",
      date: "2024-03-10",
      isRead: true,
    },
    {
      id: 3,
      title: "आपातकालीन सहायता",
      message: "सदस्य राम प्रसाद शर्मा जी की दुर्घटना के कारण उनके परिवार को तत्काल सहायता की आवश्यकता है। कृपया दान करें।",
      type: "emergency",
      date: "2024-03-08",
      isRead: false,
    },
    {
      id: 4,
      title: "नए सदस्य स्वागत",
      message: "इस महीने 15 नए सदस्य हमारी संस्था में शामिल हुए हैं। सभी का स्वागत है!",
      type: "success",
      date: "2024-03-05",
      isRead: true,
    },
    {
      id: 5,
      title: "लाइसेंस नवीनीकरण अनुस्मारक",
      message: "कृपया अपने ड्रग लाइसेंस और फूड लाइसेंस की समाप्ति तिथि की जांच करें और समय पर नवीनीकरण कराएं।",
      type: "warning",
      date: "2024-03-01",
      isRead: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "from-red-50 to-pink-50 border-red-200"
      case "warning":
        return "from-yellow-50 to-orange-50 border-yellow-200"
      case "success":
        return "from-green-50 to-emerald-50 border-green-200"
      default:
        return "from-blue-50 to-cyan-50 border-blue-200"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "success":
        return "bg-green-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100">
      <Navbar {...appState} />

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <Card className="mb-6 shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white via-indigo-50 to-purple-50">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-3">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
              सूचनाएं
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white px-3 py-1 rounded-full">{unreadCount} नई</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">कोई सूचना नहीं</h3>
                <p className="text-gray-500">अभी तक कोई नई सूचना नहीं आई है</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`shadow-lg rounded-2xl border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r ${getNotificationColor(notification.type)} ${
                      !notification.isRead ? "ring-2 ring-blue-300" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-gray-800">{notification.title}</h3>
                              <Badge
                                className={`${getBadgeColor(notification.type)} px-2 py-1 rounded-full text-xs font-bold`}
                              >
                                {notification.type === "emergency" && "आपातकाल"}
                                {notification.type === "warning" && "चेतावनी"}
                                {notification.type === "success" && "सफलता"}
                                {notification.type === "info" && "जानकारी"}
                              </Badge>
                              {!notification.isRead && (
                                <Badge className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">नई</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-3">{notification.message}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(notification.date).toLocaleDateString("hi-IN")}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-blue-800">{notifications.length}</h3>
              <p className="text-blue-600 font-medium">कुल सूचनाएं</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-100 to-red-200 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-red-800">{unreadCount}</h3>
              <p className="text-red-600 font-medium">अपठित सूचनाएं</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-green-800">{notifications.filter((n) => n.isRead).length}</h3>
              <p className="text-green-600 font-medium">पढ़ी गई सूचनाएं</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
