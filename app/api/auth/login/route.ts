import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // In production:
    // 1. Connect to MongoDB
    // 2. Find user by email
    // 3. Compare hashed passwords with bcryptjs
    // 4. Return user or error

    // Mock check - replace with actual MongoDB query
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://x_subas_X:db_password@cluster0.gua9efp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    // Simulate user not found error
    if (!email.includes("@")) {
      return NextResponse.json({ message: "User not found. Please sign up first." }, { status: 401 })
    }
    const user = await User.findOne({ email });

    const username = email.split("@")[0]
    const userId = `user_${email.replace("@", "_").replace(".", "_")}`

    if (!user) {
      return NextResponse.json({ message: "User not found. Please sign up first." }, { status: 401 })
    }
if (user.password !== password) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json(
      {
        userId,
        username,
        email,
        message: "Login successful",
      },
      { status: 200 },
    )

  
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
