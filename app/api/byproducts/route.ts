import { type NextRequest, NextResponse } from "next/server"

// Mock database for by-products
const byProductsDB: any[] = []

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get("type")
    const sellerId = url.searchParams.get("sellerId")

    let filtered = byProductsDB

    if (type && type !== "all") {
      filtered = filtered.filter((p) => p.type === type)
    }

    if (sellerId) {
      filtered = filtered.filter((p) => p.sellerId === sellerId)
    }

    return NextResponse.json({ byProducts: filtered })
  } catch (error) {
    console.error("Get byproducts error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sellerId, name, type, price, quantity, contact, image, description, sellerName } = await req.json()

    const byProduct = {
      id: `byproduct_${Date.now()}`,
      sellerId,
      name,
      type,
      price,
      quantity,
      contact,
      image,
      description,
      sellerName,
      createdAt: new Date(),
    }

    byProductsDB.push(byProduct)

    return NextResponse.json({ byProduct }, { status: 201 })
  } catch (error) {
    console.error("Create byproduct error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
