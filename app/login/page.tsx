"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Glasses, Share2, MessageSquareMore } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/Logo"

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="p-8">
          <div className="mb-8">
            <Logo />
          </div>

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-2xl font-semibold">Welcome to the Insurance Planner AI Pilot Program</h1>
            <p className="text-gray-600">Insurance Planner AI (IP-AI) delivers life insurance policy reviews in minutes, not hours. We're excited to have you help transform how policy reviews are done.</p>
          </div>

          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-medium">Your Role in Shaping IP-AI</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Glasses className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Try It Out</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Upload illustrations and experince how quickly IP-AI streamlines the policy review review process for clients and advisors.
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Explore Opportunities</h3>
                  <p className="text-gray-600 text-sm mt-1">
                   Consider how IP-AI can empower clients to better understand their policies and engage more meaningfully with their advisors.
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquareMore className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Share Your Insights</h3>
                  <p className="text-gray-600 text-sm mt-1">
                   Help us lead the way in AI-powered policy reviews. Your feedback will shape how clients and advisors experience automated life insurance policy analysis.
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700">
                Your work email
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
              <label htmlFor="password" className="block text-gray-700">
                Your pilot access password
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

            <Button type="submit" className="w-full bg-gray-600 hover:bg-gray-600 text-white">
              Access Pilot Platform
            </Button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600">Have questions? Want to share immediate feedback?</p>
            <p className="text-gray-600">Reach us at:</p>
            <a href="mailto:pilot-support@financialplanner-ai.com" className="text-blue-600 hover:underline block">
              pilot-support@financialplanner-ai.com
            </a>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            We take security seriously - your access and all policy data are fully encrypted 🔒
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

