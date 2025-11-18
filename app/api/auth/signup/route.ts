import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { type NextRequest, NextResponse } from "next/server"

// Note: In production, install mongodb package and use it here
// For now, this shows the structure - you'll need to add: npm install mongodb bcryptjs

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { username, email, phone, password } = await req.json()

    // Validation
    if (!username || !email || !phone || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }
     let user = await User.findOne({ email });
    if (user) {
      // User already exists
      return NextResponse.json({ message: "Email already registered" });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ message: "Username must be at least 3 characters" }, { status: 400 })
    }

    // In production:
    // 1. Connect to MongoDB using process.env.MONGODB_URI
    // 2. Check if email and username already exist
    // 3. Hash password with bcryptjs
    // 4. Save user to database

    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://x_subas_X:db_password@cluster0.gua9efp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    // Mock: Check if user exists (in real app, query MongoDB)
    const userId = `user_${Date.now()}`
    user = await User.create({ email, password });

    return NextResponse.json(
      {
        userId,
        username,
        email,
        message: "Account created successfully. Please verify your email.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
