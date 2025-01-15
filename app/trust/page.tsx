
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function TrustPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-blue mb-6">Customer Agreement</h1>
        <div className="prose max-w-none">
          <Button
                asChild
                className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2"
              >
                  
                  <a
                    href="/disclosures/customer_subscription_agreement.txt"
                    download="/disclosures/customer_subscription_agreement.txt"
                  ><FileText className="w-5 h-5" aria-hidden="true" />Download</a>
              </Button>
        </div>
      </div>
    )
  } 