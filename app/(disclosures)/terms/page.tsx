import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="terms-of-use bg-white p-6 rounded-lg shadow-md mb-4">
        <h1 className="text-3xl font-bold text-primary-blue mb-6">Terms of Service</h1>
        <p className="text-base text-gray-700 mb-4">
          Welcome to [Your Company Name] (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;)! By
          accessing or using our services, you agree to comply with and be bound by these Terms of Use
          (&quot;Terms&quot;). Please read them carefully.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">1. Acceptance of Terms</h2>
        <p className="text-base text-gray-700 mb-4">
          By accessing our website and using our services, you agree to be bound by these Terms. If you do not agree,
          you must not use our services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">2. Changes to Terms</h2>
        <p className="text-base text-gray-700 mb-4">
          We reserve the right to modify or replace these Terms at any time. We will notify you of any changes by
          posting the new Terms on our website. Continued use of the services following the changes indicates your
          acceptance of the new Terms.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">3. User Accounts</h2>
        <p className="text-base text-gray-700 mb-4">
          To access certain features of our services, you may be required to register an account. You agree to provide
          accurate, current, and complete information and to keep your account information updated.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">4. Use of Services</h2>
        <p className="text-base text-gray-700 mb-4">
          You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited
          from using the services in any way that may damage, disable, overburden, or impair the services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">5. Intellectual Property</h2>
        <p className="text-base text-gray-700 mb-4">
          All content, features, and functionality (including but not limited to text, graphics, logos, and software)
          provided as part of the services are the property of [Your Company Name] or its licensors and are protected by
          copyright, trademark, and other laws.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">6. Termination</h2>
        <p className="text-base text-gray-700 mb-4">
          We may suspend or terminate your access to our services without prior notice or liability, for any reason,
          including if you breach these Terms.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">7. Limitation of Liability</h2>
        <p className="text-base text-gray-700 mb-4">
          To the maximum extent permitted by law, [Your Company Name] shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits or revenues.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">8. Governing Law</h2>
        <p className="text-base text-gray-700 mb-4">
          These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without
          regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">9. Contact Information</h2>
        <p className="text-base text-gray-700 mb-4">
          For any questions about these Terms, please contact us at [Your Contact Information].
        </p>
      </div>

      <div className="prose max-w-none">
      </div>
    </div>
  )
}

