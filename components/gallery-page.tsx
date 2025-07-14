"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Users, Heart, Award } from "lucide-react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"
import { supabase } from "../lib/supabase"
import type { GalleryImage } from "../lib/supabase"

export default function GalleryPage(appState: AppState) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("सभी")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")

  const categories = [
    { name: "सभी", icon: Camera, color: "from-purple-500 to-pink-500" },
    { name: "events", icon: Users, color: "from-blue-500 to-cyan-500" },
    { name: "awards", icon: Award, color: "from-yellow-500 to-orange-500" },
    { name: "charity", icon: Heart, color: "from-red-500 to-pink-500" },
    { name: "members", icon: Users, color: "from-green-500 to-teal-500" },
    { name: "health", icon: Heart, color: "from-indigo-500 to-purple-500" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    setUploading(true)
    setUploadError("")
    if (!file || !title) {
      setUploadError("कृपया शीर्षक और फ़ाइल चुनें।")
      setUploading(false)
      return
    }
    try {
      const filePath = `${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from('gallery-images').upload(filePath, file)
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('gallery-images').getPublicUrl(filePath)
      const imageUrl = urlData.publicUrl
      const { error: dbError } = await supabase.from('gallery').insert([
        { title, image_url: imageUrl }
      ])
      if (dbError) throw dbError
      setFile(null)
      setTitle("")
      // Optionally, refresh gallery images
      setGalleryImages(prev => [{ title, image_url: imageUrl }, ...prev])
    } catch (err: any) {
      setUploadError("अपलोड विफल रहा: " + (err.message || err.error_description || "Unknown error"))
    } finally {
      setUploading(false)
    }
  }

  // Fetch gallery images from database
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true)
        console.log("🖼️ Fetching gallery images...")
        
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error("❌ Error fetching gallery:", error)
          return
        }

        console.log("✅ Gallery images fetched:", data?.length || 0)
        setGalleryImages(data || [])
      } catch (error) {
        console.error("❌ Error in fetchGalleryImages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  // Filter images by category
  const filteredImages = selectedCategory === "सभी" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

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
            const isActive = selectedCategory === category.name
            return (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r ${category.color} ${
                  isActive ? 'ring-4 ring-white/50 scale-105' : ''
                }`}
              >
                <Icon className="h-5 w-5 inline mr-2" />
                {category.name === "events" ? "कार्यक्रम" :
                 category.name === "awards" ? "पुरस्कार" :
                 category.name === "charity" ? "दान" :
                 category.name === "members" ? "सदस्य" :
                 category.name === "health" ? "स्वास्थ्य" :
                 category.name}
              </button>
            )
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">फोटो लोड हो रही हैं...</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.length > 0 ? (
              filteredImages.map((image, index) => (
                <Card
                  key={image.id || index}
                  className="shadow-xl rounded-3xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-purple-50"
                >
                  <div className="relative">
                    <img 
                      src={image.image_url || "/placeholder.svg"} 
                      alt={image.title} 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
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
                      <span className="text-sm text-purple-600 font-medium">
                        #{image.category === "events" ? "कार्यक्रम" :
                          image.category === "awards" ? "पुरस्कार" :
                          image.category === "charity" ? "दान" :
                          image.category === "members" ? "सदस्य" :
                          image.category === "health" ? "स्वास्थ्य" :
                          image.category}
                      </span>
                      <Heart className="h-5 w-5 text-red-500 cursor-pointer hover:scale-125 transition-transform" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(image.created_at).toLocaleDateString('hi-IN')}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {selectedCategory === "सभी" 
                    ? "कोई फोटो नहीं मिली" 
                    : `${selectedCategory} श्रेणी में कोई फोटो नहीं मिली`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Admin Upload Section */}
        {appState.user?.role === "admin" && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="फोटो का शीर्षक"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="rounded-xl h-12 border-2 border-indigo-300 focus:border-indigo-500 px-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-xl h-12 border-2 border-indigo-300 focus:border-indigo-500 px-4"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              {uploading ? "अपलोड हो रहा है..." : "फोटो अपलोड करें"}
            </button>
            {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
          </div>
        )}

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
