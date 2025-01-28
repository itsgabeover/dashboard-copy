"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials")
      }

      window.location.href = "/"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Insurance Planner AI</h1>
            <p className="text-lg text-gray-600">
              Transforming life insurance policy analysis through AI-powered technology
            </p>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600">
              Beta Access
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign In to Beta
            </Button>
          </form>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg space-y-2">
            <h3 className="text-blue-600 font-semibold">Beta Access</h3>
            <p className="text-blue-600">
              Thanks for being part of our beta. We appreciate your feedback as we continue to improve our site and AI services.
            </p>
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600">Need help? Contact</p>
            <a href="mailto:support@financial-planner-ai.com" className="text-blue-600 hover:underline block">
              support@financial-planner-ai.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

