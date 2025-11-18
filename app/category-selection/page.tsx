"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function CategorySelectionPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (!role) {
      router.push("/role-selection")
    } else {
      setUserRole(role)
    }
  }, [router])

  const categories = ["Grocery", "Dairy", "Florist", "Crop", "Livestock"]

  const categoryDescriptions: { [key: string]: string } = {
    Grocery: "Fresh vegetables and grains",
    Dairy: "Milk, cheese, and dairy products",
    Florist: "Fresh flowers and plants",
    Crop: "Seeds, fertilizers, pesticides", // Added new Crop category
    Livestock: "Animals - Cows, Goats, Hens", // Added new Livestock category
  }

  const categoryEmojis: { [key: string]: string } = {
    Grocery: "🥬",
    Dairy: "🥛",
    Florist: "🌸",
    Crop: "🌱", // Added emoji for Crop
    Livestock: "🐄", // Added emoji for Livestock
  }

  const handleSelectCategory = (category: string) => {
    localStorage.setItem("selectedCategory", category)
    router.push(userRole === "seller" ? "/seller-dashboard" : "/buyer-dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Select Category</h1>
          <p className="text-xl text-gray-700">Choose the category you want to work with</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category}
              onClick={() => handleSelectCategory(category)}
              className="p-8 cursor-pointer hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <div className="text-5xl mb-4">{categoryEmojis[category]}</div>
              <h2 className="text-2xl font-bold text-green-800">{category}</h2>
              <p className="text-gray-600 mt-2 mb-4">{categoryDescriptions[category]}</p>
              <button className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 w-full">
                Select
              </button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">Interested in agricultural waste and by-products?</p>
          <Link
            href="/byproducts"
            className="inline-block px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to By-Products Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}
