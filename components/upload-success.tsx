import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function UploadSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] py-16 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600 flex items-center">
            <CheckCircle className="mr-2" />
            Upload Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <p className="mb-4">
              Your policy has been successfully uploaded and is now being analyzed by our AI system.
            </p>
            <p className="mb-4">
              You will receive an email shortly with:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>A clear summary of your coverage</li>
              <li>Professional PDF analysis with detailed metrics</li>
              <li>Personalized recommendations based on your policy</li>
            </ul>
            <p>
              If you don&apos;t receive the email within 30 minutes, please check your spam/junk folders. 
              If you still can&apos;t find it, please contact our support team at{' '}
              <a href="mailto:support@fpai.com" className="text-[#4B6FEE] hover:text-[#3B4FDE]">
                support@fpai.com
              </a>
            </p>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

