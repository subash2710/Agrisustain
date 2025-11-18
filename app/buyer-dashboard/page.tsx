"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  sellerName: string
  deliveryDays?: number
  paymentMode?: string
}

interface Product {
  id: string
  name: string
  price: number
  contact: string
  image: string
  sellerName: string
  sellerId: string
  age?: string
  deliveryDays?: number
}

export default function BuyerDashboardPage() {
  const router = useRouter()
  const [category, setCategory] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("cash")
  const [buyerName, setBuyerName] = useState<string>("")

  useEffect(() => {
    const cat = localStorage.getItem("selectedCategory")
    const userId = localStorage.getItem("userId")
    const email = localStorage.getItem("userEmail")
    if (!cat || !userId) {
      router.push("/role-selection")
    } else {
      setCategory(cat)
      setBuyerName(email || `Buyer_${userId.slice(-4)}`)
      fetchProducts(cat)
      loadCart()
    }
  }, [router])

  const fetchProducts = async (cat: string) => {
    try {
      const response = await fetch(`/api/products?category=${cat}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Failed to fetch products:", err)
    }
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id)
      let newCart
      if (existingItem) {
        newCart = prev.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        newCart = [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            sellerName: product.sellerName,
            deliveryDays: product.deliveryDays,
            paymentMode: selectedPaymentMode,
          },
        ]
      }
      localStorage.setItem("cart", JSON.stringify(newCart))
      return newCart
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId)
      localStorage.setItem("cart", JSON.stringify(newCart))
      return newCart
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prev) => {
        const newCart = prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        localStorage.setItem("cart", JSON.stringify(newCart))
        return newCart
      })
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-800">Buyer Dashboard</h1>
            <p className="text-gray-700 mt-2">
              Category: <span className="font-bold">{category}</span> | Buyer:{" "}
              <span className="font-bold">{buyerName}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <Link
              href="/byproducts"
              className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
            >
              By-Products
            </Link>
          </div>
        </div>

        {/* Cart Section */}
        {showCart && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Shopping Cart</h2>
            {cart.length > 0 ? (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment Mode:</label>
                  <div className="grid md:grid-cols-5 gap-3">
                    {[
                      { value: "cash", label: "💵 Cash on Delivery" },
                      { value: "gpay", label: "🔵 Google Pay" },
                      { value: "upi", label: "📱 UPI" },
                      { value: "netbanking", label: "🏦 Net Banking" },
                      { value: "online", label: "💳 Online Payment" },
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setSelectedPaymentMode(mode.value)}
                        className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
                          selectedPaymentMode === mode.value
                            ? "bg-green-600 text-white"
                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-600"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-gray-600">₹{item.price}</p>
                          <p className="text-sm text-gray-600">Seller: {item.sellerName}</p>
                          <p className="text-sm text-gray-600">Delivery: {item.deliveryDays} days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border border-gray-300 rounded">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-lg w-24 text-right">₹{item.price * item.quantity}</p>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-2xl text-blue-600">₹{cartTotal}</span>
                  </div>
                  <button className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                    Proceed to Checkout ({selectedPaymentMode === "cash" ? "Cash on Delivery" : "Online Payment"})
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            )}
          </Card>
        )}

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Available Products</h2>
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
                    <h3 className="font-bold text-lg text-blue-800">{product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2">₹{product.price}</p>
                    {product.age && <p className="text-gray-600 text-sm">Age: {product.age} years</p>}
                    <div className="bg-gray-100 p-3 rounded mb-4">
                      <p className="text-sm text-gray-600 mb-1">📞 {product.contact}</p>
                      <p className="text-xs text-gray-600 mb-1">Seller: {product.sellerName}</p>
                      <p className="text-xs text-gray-600">🚚 Delivery: {product.deliveryDays} days</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 text-lg">No products available in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
