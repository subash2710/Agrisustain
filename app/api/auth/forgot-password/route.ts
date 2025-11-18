import { type NextRequest, NextResponse } from "next/server"

// In-memory store for verification codes (replace with database in production)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    if (action === "send-code") {
      // In production:
      // 1. Verify email exists in MongoDB
      // 2. Generate random 6-digit code
      // 3. Store in database with expiration time (10 minutes)
      // 4. Send email using nodemailer or similar

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

      verificationCodes.set(email, { code: verificationCode, expiresAt })

      // In production, send email here using nodemailer
      console.log(`[DEMO] Verification code for ${email}: ${verificationCode}`)

      return NextResponse.json(
        {
          message: "Verification code sent to email",
          // Remove in production - for demo only
          demoCode: verificationCode,
        },
        { status: 200 },
      )
    }

    if (action === "verify-code") {
      const { code, newPassword } = await req.json()

      if (!code || !newPassword) {
        return NextResponse.json({ message: "Code and new password are required" }, { status: 400 })
      }

      const stored = verificationCodes.get(email)

      if (!stored) {
        return NextResponse.json({ message: "No verification request found for this email" }, { status: 400 })
      }

      if (Date.now() > stored.expiresAt) {
        verificationCodes.delete(email)
        return NextResponse.json({ message: "Verification code expired" }, { status: 400 })
      }

      if (stored.code !== code) {
        return NextResponse.json({ message: "Invalid verification code" }, { status: 400 })
      }

      // In production: Update password in MongoDB
      verificationCodes.delete(email)

      return NextResponse.json(
        {
          message: "Password reset successful",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
