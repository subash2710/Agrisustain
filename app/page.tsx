"use client"

import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      {/* Logo Image */}
      <div className="mb-8 w-full max-w-md flex justify-center">
        <div className="relative w-full h-80">
          <Image
            src="/images/design-mode/image201.jpg"
            alt="AgriSustain Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to AgriSustain</h1>
        <p className="text-xl text-green-700 mb-8">Sustainable Farming for a Better Future</p>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl">
          Connect directly with farmers and buyers. Buy fresh agricultural products or sell your harvest with
          confidence.
        </p>
      </div>

      {/* CTA Button */}
      <Link
        href="/intro"
        className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors shadow-lg"
      >
        Get Started
      </Link>
    </div>
  )
}
