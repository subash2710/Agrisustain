"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  contact: string
  image: string
  category: string
  sellerName: string // Added seller name field
  age?: string // Added age field for livestock
  deliveryDays?: number // Added delivery duration field
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const [category, setCategory] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [sellerName, setSellerName] = useState<string>("") // Added seller name state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    contact: "",
    image: "",
    age: "", // Added age for livestock
    deliveryDays: "3", // Added default delivery duration
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cat = localStorage.getItem("selectedCategory")
    const userId = localStorage.getItem("userId")
    const name = localStorage.getItem("userEmail") || `Farmer_${userId?.slice(-4)}` // Get seller name from email
    if (!cat || !userId) {
      router.push("/role-selection")
    } else {
      setCategory(cat)
      setSellerName(name)
      fetchProducts(userId, cat)
    }
  }, [router])

  const fetchProducts = async (userId: string, cat: string) => {
    try {
      const response = await fetch(`/api/products?sellerId=${userId}&category=${cat}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Failed to fetch products:", err)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      setImagePreview(preview)
    }
    reader.readAsDataURL(file)

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

  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userId = localStorage.getItem("userId")
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: userId,
          sellerName: sellerName, // Added seller name to request
          name: formData.name,
          price: Number.parseFloat(formData.price),
          contact: formData.contact,
          image: formData.image,
          category,
          age: formData.age, // Added age for livestock
          deliveryDays: Number.parseInt(formData.deliveryDays), // Added delivery duration
        }),
      })

      if (response.ok) {
        setFormData({ name: "", price: "", contact: "", image: "", age: "", deliveryDays: "3" })
        setImagePreview("")
        setShowForm(false)
        fetchProducts(userId!, category)
      }
    } catch (err) {
      console.error("Failed to upload product:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-800">Seller Dashboard</h1>
            <p className="text-gray-700 mt-2">
              Category: <span className="font-bold">{category}</span> | Seller:{" "}
              <span className="font-bold">{sellerName}</span> {/* Show seller name */}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              {showForm ? "Cancel" : "Upload Product"}
            </button>
            <Link
              href="/byproducts"
              className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
            >
              By-Products
            </Link>
          </div>
        </div>

        {/* Upload Form */}
        {showForm && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Add New Product</h2>
            <form onSubmit={handleUploadProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder={category === "Livestock" ? "e.g., Jersey Cow" : "e.g., Fresh Tomatoes"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="100"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {category === "Livestock" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age (in years)</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleFormChange}
                      placeholder="2"
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery (days)</label>
                  <input
                    type="number"
                    name="deliveryDays"
                    value={formData.deliveryDays}
                    onChange={handleFormChange}
                    placeholder="3"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden border-2 border-green-500">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.image}
                className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Product"}
              </button>
            </form>
          </Card>
        )}

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Your Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-48 bg-gray-200">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-green-800">{product.name}</h3>
                    <p className="text-2xl font-bold text-green-600 my-2">₹{product.price}</p>
                    {product.age && <p className="text-gray-600 text-sm mb-2">Age: {product.age} years</p>}
                    <p className="text-gray-600 text-sm mb-2">📞 {product.contact}</p>
                    <p className="text-gray-600 text-sm mb-4">🚚 Delivery: {product.deliveryDays} days</p>
                    <button className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 text-lg">No products uploaded yet. Start by adding your first product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
