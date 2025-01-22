
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function CookiePage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="cookie-policy bg-white p-6 rounded-lg shadow-md mb-4">
  <h1 className="text-3xl font-bold text-primary-blue mb-6">Cookie Policy</h1>
  <p className="text-base text-gray-700 mb-4">
    This Cookie Policy explains how [Your Company Name] (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control their use.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">1. What Are Cookies?</h2>
  <p className="text-base text-gray-700 mb-4">
    Cookies are small data files that are placed on your computer or device when you visit a website. They are widely used to make websites work more efficiently and to provide reporting information.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">2. How We Use Cookies</h2>
  <p className="text-base text-gray-700 mb-4">
    We use cookies to improve your experience on our website, including:
    <ul className="list-disc list-inside mt-2 mb-4">
      <li>Remembering your preferences and settings.</li>
      <li>Providing personalized content and advertisements.</li>
      <li>Analyzing website traffic and performance.</li>
    </ul>
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">3. Types of Cookies We Use</h2>
  <p className="text-base text-gray-700 mb-4">
    <strong>Essential Cookies:</strong> Necessary for the website to function and cannot be turned off. <br />
    <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website. <br />
    <strong>Functionality Cookies:</strong> Enable enhanced features and personalization. <br />
    <strong>Targeting Cookies:</strong> Collect information about your browsing habits for advertising purposes.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">4. Managing Cookies</h2>
  <p className="text-base text-gray-700 mb-4">
    You have the right to accept or reject cookies. You can manage your cookie preferences through your browser settings. Please note that disabling cookies may affect the functionality of our website.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">5. Changes to This Policy</h2>
  <p className="text-base text-gray-700 mb-4">
    We may update this Cookie Policy from time to time to reflect changes in technology, laws, or business operations. We encourage you to review this page periodically for the latest information on our use of cookies.
  </p>

  <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">6. Contact Us</h2>
  <p className="text-base text-gray-700 mb-4">
    If you have any questions about this Cookie Policy, please contact us at [Your Contact Information].
  </p>
</div>

        <div className="prose max-w-none">
        <Button
            asChild
            className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2 mx-auto"
        >
            <a
                href="/disclosures/cookie_policy.txt"
                download="/disclosures/cookie_policy.txt"
            >
                <FileText className="w-5 h-5" aria-hidden="true" />
                Download
            </a>
        </Button>
        </div>
      </div>
    )
  } 