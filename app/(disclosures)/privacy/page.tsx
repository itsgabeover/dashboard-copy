import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'


export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="privacy-policy bg-white p-6 rounded-lg shadow-md mb-4">
  <h1 className="text-3xl font-bold text-primary-blue mb-6">Privacy Policy</h1>
  <p className="text-base text-gray-700 mb-4">
    At [Your Company Name] (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;), your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. Please read this policy carefully to understand our practices.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">1. Information We Collect</h2>
  <p className="text-base text-gray-700 mb-4">
    We may collect the following types of information:
    <ul className="list-disc list-inside mt-2 mb-4">
      <li><strong>Personal Information:</strong> Such as your name, email address, phone number, and other information you provide directly to us.</li>
      <li><strong>Usage Data:</strong> Information about how you use our website and services, including IP address, browser type, and pages visited.</li>
      <li><strong>Cookies and Tracking Technologies:</strong> Data collected through cookies and similar tools. (See our <a href="#cookie-policy" className="text-primary-blue underline">Cookie Policy</a> for more details.)</li>
    </ul>
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">2. How We Use Your Information</h2>
  <p className="text-base text-gray-700 mb-4">
    We may use the information we collect to:
    <ul className="list-disc list-inside mt-2 mb-4">
      <li>Provide, maintain, and improve our services.</li>
      <li>Communicate with you about updates, promotions, and other relevant information.</li>
      <li>Ensure the security and integrity of our services.</li>
      <li>Comply with legal obligations and resolve disputes.</li>
    </ul>
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">3. How We Share Your Information</h2>
  <p className="text-base text-gray-700 mb-4">
    We do not sell your personal information. We may share your information with:
    <ul className="list-disc list-inside mt-2 mb-4">
      <li><strong>Service Providers:</strong> Third parties that assist us in providing our services.</li>
      <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights.</li>
      <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our assets.</li>
    </ul>
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">4. Your Rights and Choices</h2>
  <p className="text-base text-gray-700 mb-4">
    You have rights regarding your personal information, including:
    <ul className="list-disc list-inside mt-2 mb-4">
      <li>The right to access, update, or delete your information.</li>
      <li>The right to opt-out of marketing communications.</li>
      <li>The right to data portability where applicable.</li>
    </ul>
    To exercise your rights, please contact us at [Your Contact Information].
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">5. Data Security</h2>
  <p className="text-base text-gray-700 mb-4">
    We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no system is completely secure, and we cannot guarantee the absolute security of your data.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">6. Changes to This Privacy Policy</h2>
  <p className="text-base text-gray-700 mb-4">
    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">7. Contact Us</h2>
  <p className="text-base text-gray-700 mb-4">
    If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].
  </p>
</div>

      <div className="prose max-w-none">
        <Button
                asChild
                className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2"
              >
                  
                  <a
                    href="/disclosures/privacy_policy.txt"
                    download="/disclosures/privacy_policy.txt"
                  ><FileText className="w-5 h-5" aria-hidden="true" />Download</a>
              </Button>
      </div>
    </div>
  )
} 
