"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface ByProduct {
  id: string
  name: string
  type: "waste-product" | "byproduct" | "cattle-feed"
  price: number
  quantity: string
  contact: string
  image: string
  sellerId: string
  sellerName: string
  description: string
}

export default function ByProductsPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"seller" | "buyer" | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [byProducts, setByProducts] = useState<ByProduct[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "waste-product" | "byproduct" | "cattle-feed">("all")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    type: "byproduct" as "waste-product" | "byproduct" | "cattle-feed",
    price: "",
    quantity: "",
    contact: "",
    image: "",
    description: "",
  })

  useEffect(() => {
    const id = localStorage.getItem("userId")
    const role = localStorage.getItem("userRole")

    if (!id) {
      router.push("/login")
    } else {
      setUserId(id)
      setUserRole(role as "seller" | "buyer")
      fetchByProducts()
    }
  }, [router])

  const fetchByProducts = async () => {
    try {
      const response = await fetch("/api/byproducts")
      const data = await response.json()
      setByProducts(data.byProducts || [])
    } catch (err) {
      console.error("Failed to fetch byproducts:", err)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      setImagePreview(preview)
    }
    reader.readAsDataURL(file)

    // Upload to server
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          image: data.imageUrl,
        }))
      } else {
        alert("Image upload failed")
      }
    } catch (err) {
      console.error("Upload error:", err)
      alert("Failed to upload image")
    }
  }

  const handleUploadByProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/byproducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          sellerId: userId,
          sellerName: `Farmer ${userId.slice(-4)}`,
        }),
      })

      if (response.ok) {
        setFormData({
          name: "",
          type: "byproduct",
          price: "",
          quantity: "",
          contact: "",
          image: "",
          description: "",
        })
        setImagePreview("")
        setShowForm(false)
        fetchByProducts()
      }
    } catch (err) {
      console.error("Failed to upload byproduct:", err)
    }
  }

  const filtered = filterType === "all" ? byProducts : byProducts.filter((p) => p.type === filterType)

  const typeDescriptions = {
    "waste-product": "🌾 Waste Products",
    byproduct: "🔄 By-Products",
    "cattle-feed": "🐄 Cattle Feed",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">Agricultural By-Products & Waste</h1>
            <p className="text-gray-700 mt-2">Buy and sell agricultural waste, by-products, and cattle feed</p>
          </div>
          <div className="flex gap-4">
            {userRole === "seller" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
              >
                {showForm ? "Cancel" : "List By-Product"}
              </button>
            )}
            <Link
              href={userRole === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Upload Form */}
        {showForm && userRole === "seller" && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">List New By-Product</h2>
            <form onSubmit={handleUploadByProduct} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Banana Tree Waste"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="waste-product">Waste Product (Agricultural waste)</option>
                    <option value="byproduct">By-Product (Can be used for other production)</option>
                    <option value="cattle-feed">Cattle Feed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹ per unit)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="50"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    placeholder="e.g., 100 kg, 50 bundles"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleFormChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden border-2 border-amber-500">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the product, quality, and usage..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 h-24"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!formData.image}
                className="w-full py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                List By-Product
              </button>
            </form>
          </Card>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              filterType === "all"
                ? "bg-amber-600 text-white"
                : "bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-50"
            }`}
          >
            All
          </button>
          {(["waste-product", "byproduct", "cattle-feed"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                filterType === type
                  ? "bg-amber-600 text-white"
                  : "bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-50"
              }`}
            >
              {typeDescriptions[type]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Available By-Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-48 bg-gray-200">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {typeDescriptions[product.type]}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-amber-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                    <p className="text-2xl font-bold text-amber-600 my-2">₹{product.price}/unit</p>
                    <div className="bg-amber-50 p-3 rounded mb-4 text-sm">
                      <p className="text-gray-700 mb-1">📦 Available: {product.quantity}</p>
                      <p className="text-gray-600 mb-1">📞 {product.contact}</p>
                      <p className="text-xs text-gray-500">Seller: {product.sellerName}</p>
                    </div>
                    {userRole === "buyer" && (
                      <button className="w-full px-4 py-2 bg-amber-600 text-white font-bold rounded hover:bg-amber-700">
                        Contact Seller
                      </button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 text-lg">No by-products available in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
