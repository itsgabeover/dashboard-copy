"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted - attempting login with:", email)

    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      console.log("Making fetch request to /api/login")
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
        credentials: "include",
      })

      console.log("Fetch response received:", response.status)

      const contentType = response.headers.get("content-type")
      console.log("Response content type:", contentType)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials")
      }

      console.log("Login successful, redirecting...")
      window.location.href = "/"
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome to Insurance Planner AI</h1>
          <p className="text-xl text-gray-600 mb-8">
            Transforming life insurance policy analysis through AI-powered technology
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-2">Sign In to Beta Platform</h2>
          <p className="text-gray-600 text-center mb-8">Enter your credentials to access beta website</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 flex flex-col gap-1 items-center">
              <span>Need help? Contact</span>
              <a href="mailto:support@financialplanner-ai.com" className="text-blue-600 hover:underline">
                support@financial-planner-ai.com
              </a>
            </p>
          </div>

          {/* Beta Info */}
          <div className="text-center pt-8">
            <h3 className="text-xl font-bold">Insurance Planner AI Beta</h3>
            <p className="text-gray-600">Transforming life insurance reviews through AI</p>
          </div>
        </div>
      </div>
    </div>
  )
}

