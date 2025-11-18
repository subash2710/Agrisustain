"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function RoleSelectionPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("userId")
    if (!id) {
      router.push("/login")
    } else {
      setUserId(id)
    }
  }, [router])

  const handleSelectRole = (role: "seller" | "buyer") => {
    if (userId) {
      localStorage.setItem("userRole", role)
      router.push("/category-selection")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-700">Tell us how you'd like to use AgriSustain</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Seller Card */}
          <Card
            onClick={() => handleSelectRole("seller")}
            className="p-8 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🌾</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">I'm a Seller</h2>
              <p className="text-gray-700 mb-6">
                Upload your agricultural products, set prices, and connect with buyers directly.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>✓ Upload product images</li>
                <li>✓ Set competitive prices</li>
                <li>✓ Manage your inventory</li>
                <li>✓ Get direct buyer inquiries</li>
              </ul>
              <button className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 w-full">
                Become a Seller
              </button>
            </div>
          </Card>

          {/* Buyer Card */}
          <Card
            onClick={() => handleSelectRole("buyer")}
            className="p-8 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">I'm a Buyer</h2>
              <p className="text-gray-700 mb-6">
                Browse fresh products from local farmers, add to cart, and place orders.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>✓ Browse fresh products</li>
                <li>✓ View seller details</li>
                <li>✓ Add items to cart</li>
                <li>✓ Track your orders</li>
              </ul>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 w-full">
                Start Buying
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
