"use client"

import Link from "next/link"
import Image from "next/image"

export default function IntroPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Hero Section with Image */}
      <div className="grid md:grid-cols-2 gap-8 items-center px-4 py-12 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <div className="relative w-full h-96">
            <Image
              src="/images/design-mode/image202.jpg"
              alt="Farmer with produce"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-2">Join Our Community</h1>
            <p className="text-gray-600 text-lg">
              Connect with farmers and buyers in your region. Buy fresh or sell your harvest.
            </p>
          </div>

          {/* Auth Options */}
          <div className="space-y-4 pt-4">
            {/* Create Account */}
            <Link
              href="/signup"
              className="block w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-center text-lg"
            >
              Create New Account
            </Link>

            {/* Login Google */}
            <button className="w-full p-4 bg-white border-2 border-gray-300 font-bold rounded-lg hover:border-green-500 hover:bg-gray-50 transition-all text-lg flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Already Have Account */}
            <div className="pt-4">
              <p className="text-gray-700 text-center mb-4">Already have an account?</p>
              <Link
                href="/login"
                className="block w-full p-4 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors text-center text-lg border-2 border-gray-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
