
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function TrustPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="subscription-agreement bg-white p-6 rounded-lg shadow-md mb-4">
  <h1 className="text-3xl font-bold text-primary-blue mb-6">Customer Subscription Agreement</h1>
  <p className="text-base text-gray-700 mb-4">
    This Customer Subscription Agreement (&quot;Agreement&quot;) governs your subscription to and use of the services provided by [Your Company Name] (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By subscribing to or using our services, you agree to comply with and be bound by this Agreement. Please read it carefully.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">1. Subscription Services</h2>
  <p className="text-base text-gray-700 mb-4">
    We offer subscription-based services (&quot;Services&quot;) that grant you access to specific features, content, and resources for the duration of your subscription term. The scope of services available to you depends on the subscription plan you select.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">2. Subscription Terms</h2>
  <p className="text-base text-gray-700 mb-4">
    <ul className="list-disc list-inside mt-2 mb-4">
      <li><strong>Term:</strong> Your subscription begins on the date of purchase and will continue for the duration specified in your plan.</li>
      <li><strong>Renewal:</strong> Subscriptions automatically renew unless canceled before the renewal date. You may manage or cancel your subscription in your account settings.</li>
      <li><strong>Fees:</strong> You agree to pay the subscription fees specified at the time of purchase. Fees are non-refundable except as required by law.</li>
    </ul>
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">3. Account Responsibilities</h2>
  <p className="text-base text-gray-700 mb-4">
    You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted through your account. Notify us immediately if you suspect unauthorized access.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">4. Acceptable Use</h2>
  <p className="text-base text-gray-700 mb-4">
    You agree to use our Services only for lawful purposes and in compliance with this Agreement. Prohibited activities include, but are not limited to:
    <ul className="list-disc list-inside mt-2 mb-4">
      <li>Reselling, sublicensing, or redistributing the Services without our authorization.</li>
      <li>Engaging in fraudulent, abusive, or harmful activities.</li>
      <li>Violating applicable laws or regulations.</li>
    </ul>
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">5. Termination</h2>
  <p className="text-base text-gray-700 mb-4">
    We may terminate your subscription or access to the Services if you breach this Agreement. Upon termination, your right to use the Services will immediately cease, and no refunds will be provided.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">6. Intellectual Property</h2>
  <p className="text-base text-gray-700 mb-4">
    All content and materials provided as part of the Services are the intellectual property of [Your Company Name] or our licensors. You are granted a limited, non-exclusive, non-transferable right to access and use the Services during your subscription term.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">7. Limitation of Liability</h2>
  <p className="text-base text-gray-700 mb-4">
    To the maximum extent permitted by law, we shall not be liable for indirect, incidental, or consequential damages arising from your use of the Services.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">8. Governing Law</h2>
  <p className="text-base text-gray-700 mb-4">
    This Agreement is governed by the laws of [Your State/Country], without regard to its conflict of law principles.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">9. Contact Information</h2>
  <p className="text-base text-gray-700 mb-4">
    If you have any questions or concerns about this Agreement, please contact us at [Your Contact Information].
  </p>
</div>

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