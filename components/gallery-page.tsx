import { Card, CardContent } from "@/components/ui/card"
import { Camera, Users, Heart, Award } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"

export default function GalleryPage(appState: AppState) {
  // Gallery images will be fetched from database
  const galleryImages: Array<{ src: string; title: string; category: string }> = []

  const categories = [
    { name: "सभी", icon: Camera, color: "from-purple-500 to-pink-500" },
    { name: "कार्यक्रम", icon: Users, color: "from-blue-500 to-cyan-500" },
    { name: "पुरस्कार", icon: Award, color: "from-yellow-500 to-orange-500" },
    { name: "दान", icon: Heart, color: "from-red-500 to-pink-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100">
      <Navbar {...appState} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
            <Camera className="h-10 w-10 text-indigo-500" />
            फोटो गैलरी
          </h2>
          <p className="text-xl text-gray-700">हमारी यादों का खजाना</p>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl inline-block">
            <p className="text-blue-700 font-medium">
              📸 सभी फोटो प्रशासन द्वारा प्रबंधित • कुल फोटो: {galleryImages.length}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <button
                key={index}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r ${category.color}`}
              >
                <Icon className="h-5 w-5 inline mr-2" />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Card
              key={index}
              className="shadow-xl rounded-3xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-purple-50"
            >
              <div className="relative">
                <img src={image.src || "/placeholder.svg"} alt={image.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">{image.title}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  #{image.category}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 font-medium">#{image.category}</span>
                  <Heart className="h-5 w-5 text-red-500 cursor-pointer hover:scale-125 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 rounded-2xl shadow-lg text-center">
            <CardContent className="p-6">
              <Camera className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-800">{galleryImages.length}</h3>
              <p className="text-blue-600 font-medium">तस्वीरें</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0 rounded-2xl shadow-lg text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-800">
                {galleryImages.filter((img) => img.category === "events").length}
              </h3>
              <p className="text-green-600 font-medium">कार्यक्रम</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-0 rounded-2xl shadow-lg text-center">
            <CardContent className="p-6">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-800">
                {galleryImages.filter((img) => img.category === "awards").length}
              </h3>
              <p className="text-yellow-600 font-medium">पुरस्कार</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-100 to-red-200 border-0 rounded-2xl shadow-lg text-center">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-red-800">
                {galleryImages.filter((img) => img.category === "charity").length}
              </h3>
              <p className="text-red-600 font-medium">सहायता</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Note */}
        {appState.user?.role === "admin" && (
          <Card className="mt-8 bg-gradient-to-r from-orange-100 to-yellow-100 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <Camera className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-orange-800 mb-2">प्रशासक सूचना</h3>
              <p className="text-orange-700">
                गैलरी प्रबंधन के लिए प्रशासन पैनल में जाएं। आप नई फोटो जोड़ सकते हैं या पुरानी हटा सकते हैं।
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
