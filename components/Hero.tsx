'use client'

import { Upload, Clock, FileText, CheckCircle, Zap, ArrowRight, Shield, Sparkles, TrendingUp, Lock, Share2 } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { FC } from "react"

export const Hero: FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Main Hero Section */}
      <div className="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32">
        <div className="flex flex-col items-center space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-600 max-w-4xl">
            Transform Your Life Insurance Policy into Clear Insights
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
            Insurance Planner AI: From Complex Policy to Confident Decisions
          </p>
          <p className="text-lg text-gray-500 max-w-3xl">
            Our AI analyzes every detail of your policy, uncovering opportunities, revealing potential risks, and ensuring your premiums are working as hard as you do
          </p>
        </div>

        {/* AI Analysis Card */}
        <Card className="max-w-4xl mx-auto mt-12 border-2 border-blue-100">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center gap-3">
                <Zap className="w-8 h-8" />
                AI-powered policy reviews in minutes
              </h2>
              <p className="text-gray-600 text-lg text-center max-w-2xl">
                Upload your policy&apos;s in-force illustration and get clear insights in minutes. Insurance Planner AI helps you read between the lines, understanding each feature, benefit, and provision.
              </p>
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Crystal-clear email summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Professional policy review analysis PDF</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Protection Confidence</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Know exactly how your policy protects your family and if coverage matches your current needs</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Premium Optimization</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Understand if your premiums are properly structured and how to prevent costly policy lapses</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Growth Potential</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Discover how your policy can build value over time and options for accessing benefits</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Lock className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Future Security</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Get clear insights about guarantees, options, and strategies to keep your coverage strong</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                  Step 1: Get Ready
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Request your illustration</li>
                  <li>Takes about 2 weeks</li>
                  <li>Step-by-step guidance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                  Step 2: Upload & Analyze
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Secure upload</li>
                  <li>AI-powered analysis</li>
                  <li>5-minute process</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                  Step 3: Get Results
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Clear email summary</li>
                  <li>Professional PDF report</li>
                  <li>Instant delivery</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-gray-600 mt-8">
            That&apos;s it. No meetings, no sales calls. Just clear insights and professional analysis in 5 minutes.
          </p>
        </div>

        {/* What You'll Receive Section */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-12">
            What You&apos;ll Receive
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-center">Email Summary</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {['Current Coverage Assessment', 'Performance Highlights', 'Key Recommendations', 'Clear Action Items'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-8">
                  <a
                    href="/sample_reports/SAMPLE_CLIENT_SUMMARY.docx"
                    download="SAMPLE_CLIENT_SUMMARY.docx"
                    className="flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Sample Summary
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-center">Professional Analysis PDF</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {['Detailed Performance Metrics', 'Coverage Optimization Options', 'Professional Recommendations', 'Advisor-Ready Format'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-8">
                  <a
                    href="/sample_reports/SAMPLE_POLICY_REVIEW.docx"
                    download="SAMPLE_POLICY_REVIEW.docx"
                    className="flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Sample Analysis
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-4xl mx-auto mt-24 mb-16">
          <Card className="border-2 border-blue-100">
            <CardHeader className="text-center bg-blue-600 text-white">
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Get Life Insurance Clarity Today</h2>
              </div>
              <p className="text-xl mt-2">From confusion to confidence in 5 minutes</p>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-full"
              >
                <Link href="/upload" className="flex items-center gap-2">
                  Analyze My Policy
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

