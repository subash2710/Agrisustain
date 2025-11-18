import { type NextRequest, NextResponse } from "next/server"

const productsDB: any[] = []

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get("category")
    const sellerId = url.searchParams.get("sellerId")

    let filtered = productsDB

    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (sellerId) {
      filtered = filtered.filter((p) => p.sellerId === sellerId)
    }

    return NextResponse.json({ products: filtered })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sellerId, sellerName, name, price, contact, image, category, age, deliveryDays } = await req.json()

    const product = {
      id: `product_${Date.now()}`,
      sellerId,
      sellerName,
      name,
      price,
      contact,
      image,
      category,
      age,
      deliveryDays: deliveryDays || 3,
      createdAt: new Date(),
    }

    productsDB.push(product)

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
