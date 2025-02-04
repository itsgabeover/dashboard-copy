import Image from "next/image"
import Link from "next/link"
import { Upload, FileText, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyDashboard() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <Image src="/placeholder.svg" alt="Empty dashboard illustration" fill className="object-contain" priority />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Start Your Insurance Policy Review</h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your first insurance policy to get detailed AI-powered analysis, insights, and recommendations
            tailored just for you.
          </p>

          <div className="pt-4">
            <Button asChild size="lg" className="bg-[#4B6FEE] hover:bg-[#3B4FDE] text-lg px-8 py-6">
              <Link href="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Upload Your First Policy
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/50 backdrop-blur border-2 border-[#4B6FEE]/10 hover:border-[#4B6FEE]/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-[#4B6FEE]/10 p-3 w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-[#4B6FEE]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
                <p className="text-gray-600 text-sm">Simply upload your policy document and our AI will do the rest</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur border-2 border-[#4B6FEE]/10 hover:border-[#4B6FEE]/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-[#4B6FEE]/10 p-3 w-fit mx-auto mb-4">
                  <Shield className="h-6 w-6 text-[#4B6FEE]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Get comprehensive insights about your coverage and potential gaps
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur border-2 border-[#4B6FEE]/10 hover:border-[#4B6FEE]/30 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-[#4B6FEE]/10 p-3 w-fit mx-auto mb-4">
                  <ArrowRight className="h-6 w-6 text-[#4B6FEE]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
                <p className="text-gray-600 text-sm">Receive personalized suggestions to optimize your coverage</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-4 bg-blue-50 rounded-lg inline-block">
            <p className="text-sm text-gray-600">
              Need help getting started?{" "}
              <button
                onClick={() => window.parent.postMessage({ type: "OPEN_CHAT" }, "*")}
                className="text-[#4B6FEE] hover:text-[#3B4FDE] font-medium"
              >
                Chat with our AI Helper
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

