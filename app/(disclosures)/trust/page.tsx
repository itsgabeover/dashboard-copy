import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function TrustPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
<div className="customer-subscription-agreement bg-white p-6 rounded-lg shadow-md mb-4">
  <h1 className="text-3xl font-bold text-primary-blue mb-6">Customer Subscription Agreement</h1>
  <p className="text-base text-gray-700 mb-4">
    This Customer Subscription Agreement (&quot;Agreement&quot;) is entered into by and between [Your Company Name] 
    (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) and the customer (&quot;you&quot;, &quot;your&quot;). 
    By subscribing to our services, you agree to be bound by the terms of this Agreement.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">1. Subscription Services</h2>
  <p className="text-base text-gray-700 mb-4">
    We provide subscription-based access to our services as described on our website. These services are subject to 
    the terms and conditions outlined in this Agreement.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">2. Fees and Payment</h2>
  <p className="text-base text-gray-700 mb-4">You agree to the following payment terms:</p>
  <ul className="list-disc list-inside mb-4 text-gray-700">
    <li><strong>Subscription Fees:</strong> You will pay the fees specified at the time of your subscription.</li>
    <li><strong>Billing Cycle:</strong> Subscription fees are charged on a recurring basis, as outlined during the signup process.</li>
    <li><strong>Late Payments:</strong> Late payments may result in suspension or termination of your subscription.</li>
  </ul>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">3. Term and Termination</h2>
  <p className="text-base text-gray-700 mb-4">
    This Agreement will remain in effect for the duration of your subscription. Either party may terminate this Agreement:
  </p>
  <ul className="list-disc list-inside mb-4 text-gray-700">
    <li>By providing written notice 30 days prior to the end of the current billing period.</li>
    <li>Immediately, if the other party breaches any material term of this Agreement.</li>
  </ul>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">4. Customer Responsibilities</h2>
  <p className="text-base text-gray-700 mb-4">As a subscriber, you agree to:</p>
  <ul className="list-disc list-inside mb-4 text-gray-700">
    <li>Provide accurate and current account information.</li>
    <li>Use the services only for lawful purposes.</li>
    <li>Maintain the confidentiality of your account credentials.</li>
  </ul>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">5. Intellectual Property</h2>
  <p className="text-base text-gray-700 mb-4">
    All intellectual property rights associated with the services remain the sole property of the Company or its licensors. 
    You may not reproduce, distribute, or create derivative works based on the services without prior written consent.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">6. Limitation of Liability</h2>
  <p className="text-base text-gray-700 mb-4">
    To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, 
    consequential, or punitive damages arising out of or relating to this Agreement.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">7. Governing Law</h2>
  <p className="text-base text-gray-700 mb-4">
    This Agreement shall be governed by the laws of [Your State/Country], without regard to its conflict of law principles.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">8. Changes to This Agreement</h2>
  <p className="text-base text-gray-700 mb-4">
    We may update this Agreement from time to time. Any changes will be communicated to you, and your continued use 
    of the services constitutes acceptance of the revised Agreement.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">9. Contact Information</h2>
  <p className="text-base text-gray-700 mb-4">
    If you have any questions about this Agreement, please contact us at [Your Contact Information].
  </p>
</div>


      <div className="prose max-w-none">
      </div>
    </div>
  );
}
