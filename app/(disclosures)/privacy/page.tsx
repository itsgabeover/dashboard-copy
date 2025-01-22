import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="privacy-policy bg-white p-6 rounded-lg shadow-md mb-4">
        <h1 className="text-3xl font-bold text-primary-blue mb-6">
          Privacy Policy
        </h1>
        <p className="text-base text-gray-700 mb-4">
          This Privacy Policy describes how [Your Company Name]
          (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
          collects, uses, and protects your information when you use our
          services. By using our services, you consent to the collection and use
          of your information as outlined in this policy.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          1. Information We Collect
        </h2>
        <p className="text-base text-gray-700 mb-4">
          We collect the following types of information:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            <strong>Personal Information:</strong> Information you provide
            directly, such as your name, email address, phone number, and
            payment details.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our services, such as IP address, browser type, and pages visited.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> Data collected
            through cookies and similar technologies as described in our Cookie
            Policy.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          2. How We Use Your Information
        </h2>
        <p className="text-base text-gray-700 mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Provide, operate, and maintain our services.</li>
          <li>Process transactions and send confirmations.</li>
          <li>Respond to your inquiries and provide customer support.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          3. Sharing Your Information
        </h2>
        <p className="text-base text-gray-700 mb-4">
          We may share your information with:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            <strong>Service Providers:</strong> Third-party vendors who perform
            services on our behalf.
          </li>
          <li>
            <strong>Legal Authorities:</strong> When required to comply with
            legal obligations or to protect our rights.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger,
            acquisition, or sale of assets.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          4. Your Rights
        </h2>
        <p className="text-base text-gray-700 mb-4">
          Depending on your location, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>The right to access, correct, or delete your information.</li>
          <li>
            The right to restrict or object to the processing of your data.
          </li>
          <li>The right to data portability.</li>
          <li>The right to withdraw consent at any time.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          5. Data Security
        </h2>
        <p className="text-base text-gray-700 mb-4">
          We take appropriate security measures to protect your information from
          unauthorized access, alteration, disclosure, or destruction. However,
          no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          6. Changes to This Privacy Policy
        </h2>
        <p className="text-base text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and we encourage you to review it
          periodically. Your continued use of our services constitutes your
          acceptance of the updated policy.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-primary-blue">
          7. Contact Us
        </h2>
        <p className="text-base text-gray-700 mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at [Your Contact Information].
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
          >
            <FileText className="w-5 h-5" aria-hidden="true" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}
