"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

export default function TermsPage() {
  //const [activeSection, setActiveSection] = useState("1")

  //const sections = [
  //  { id: "1", title: "Introduction and Acceptance" },
  //  { id: "2", title: "Definitions and Interpretation" },
  //  { id: "3", title: "Eligibility and Registration" },
  //  { id: "4", title: "Service Description and Scope" },
  //  { id: "5", title: "Critical Limitations and Disclaimers" },
  //  { id: "6", title: "Data Rights and Privacy" },
  //  { id: "7", title: "Payment Terms and Conditions" },
  //  { id: "8", title: "Usage Restrictions and Requirements" },
  //  { id: "9", title: "Intellectual Property Rights" },
  //  { id: "10", title: "Third-Party Services and Content" },
  //  { id: "11", title: "Warranties and Disclaimers" },
  //  { id: "12", title: "Limitation of Liability" },
  //  { id: "13", title: "Dispute Resolution and Arbitration" },
  //  { id: "14", title: "Indemnification" },
  //  { id: "15", title: "Term and Termination" },
  //  { id: "16", title: "General Provisions" },
  //  { id: "17", title: "Contact Information" },
  //]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <main className="w-full">
        <ScrollArea className="h-[calc(100vh-200px)]" aria-label="Terms of Service content">
          <div className="prose prose-gray dark:prose-invert max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg mb-6">
              <strong>Effective Date: January 1, 2025</strong>
            </p>

            <div className="bg-muted p-6 rounded-lg mb-8">
              <strong className="text-lg block mb-3">IMPORTANT NOTICE REGARDING YOUR LEGAL RIGHTS</strong>
              <p className="text-base">
                PLEASE READ THESE TERMS OF SERVICE CAREFULLY. THEY CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION
                WAIVER THAT AFFECT YOUR LEGAL RIGHTS.
              </p>
            </div>

            <p className="text-base mb-8">
              By accessing or using the Services provided by Financial Planner AI, LLC, you acknowledge that you have
              read, understood, and agree to be bound by these Terms of Service, including the binding arbitration
              provision and class action waiver found in Section 12.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-1">
                1. INTRODUCTION AND ACCEPTANCE
              </h2>
              <p className="text-base mb-6">
                Welcome to Financial Planner AI. These Terms of Service (the &quot;Terms&quot;) constitute a legally
                binding agreement between you and Financial Planner AI, LLC, a limited liability company organized under
                the laws of New Jersey (&quot;Financial Planner AI,&quot; &quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;). These Terms govern your access to and use of our website located at{" "}
                <Link
                  href="https://www.lifeinsuranceplanner-ai.com"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.lifeinsuranceplanner-ai.com
                </Link>{" "}
                (the &quot;Website&quot;), our proprietary web-based software application (the &quot;Application&quot;),
                our AI-powered analysis feature (&quot;Insurance Planner AI&quot;), our chatbot service, and all related
                services (collectively, the &quot;Services&quot;).
              </p>
              <p className="text-base mb-6">
                These Terms incorporate by reference our Privacy Policy, available at{" "}
                <Link
                  href="https://www.lifeinsuranceplanner-ai.com/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.lifeinsuranceplanner-ai.com/privacy
                </Link>
                , our Cookie Policy
                <Link
                  href="https://www.lifeinsuranceplanner-ai.com/cookie-policy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.lifeinsuranceplanner-ai.com/cookie-policy
                </Link>{" "}
                and any additional terms, conditions, or policies we may provide to you from time to time. Together,
                these documents form the entire agreement between you and Financial Planner AI regarding your use of our
                Services.
              </p>
              <p className="text-base mb-6">
                By accessing or using our Services, you represent and warrant that you have read, understood, and agree
                to be bound by these Terms. If you don&apos;t agree to these Terms in their entirety, you must not
                access or use our Services. If you are accessing or using our Services on behalf of a business entity,
                you represent and warrant that you have the authority to bind such entity to these Terms, and references
                to &quot;you&quot; and &quot;your&quot; in these Terms refer to both you individually and such entity.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-2">
                2. DEFINITIONS AND INTERPRETATION
              </h2>
              <h3 className="text-xl mb-4">2.1 Throughout these Terms, the following definitions apply:</h3>
              <p className="text-base mb-4">
                &quot;Affiliate&quot; means any entity that directly or indirectly controls, is controlled by, or is
                under common control with Financial Planner AI, where &quot;control&quot; means the ownership of, or the
                power to vote, at least fifty percent (50%) of the voting stock, shares or interests of such entity.
              </p>
              <p className="text-base mb-4">
                &quot;AI Technology&quot; means our artificial intelligence and machine learning technologies,
                algorithms, models, and systems used to provide the Services.
              </p>
              <p className="text-base mb-4">
                &quot;Analyses&quot; means the outputs, reports, summaries, and other materials generated by our AI
                Technology based on the information and documentation you provide.
              </p>
              <p className="text-base mb-4">
                &quot;Confidential Information&quot; means any non-public information that relates to our business,
                technology, customers, or Services, including but not limited to our AI Technology, trade secrets,
                know-how, software code, technical specifications, development plans, and business strategies.
              </p>
              <p className="text-base mb-4">
                &quot;Content&quot; means all information, data, text, documents, graphics, images, photographs, videos,
                software, music, sounds, and other materials that may be available through the Services.
              </p>
              <p className="text-base mb-4">
                &quot;Documentation&quot; means any user guides, help materials, or other documentation we provide or
                make available regarding the Services.
              </p>
              <p className="text-base mb-4">
                &quot;Feedback&quot; means any suggestions, ideas, enhancement requests, recommendations, or other
                feedback you provide regarding the Services.
              </p>
              <p className="text-base mb-4">
                &quot;Intellectual Property Rights&quot; means all patent rights, copyright rights, mask work rights,
                moral rights, rights of publicity, trademark, trade dress and service mark rights, goodwill, trade
                secret rights, and other intellectual property rights that may exist now or come into existence in the
                future, under the laws of any state, country, territory or other jurisdiction.
              </p>
              <p className="text-base mb-4">
                &quot;Policy Owner&quot; means an individual who owns a life insurance policy and uses our Services to
                analyze such policy.
              </p>
              <p className="text-base mb-4">
                &quot;Professional Advisor&quot; means a licensed financial advisor, insurance agent, attorney,
                accountant, or other professional who may use our Services to assist Policy Owners.
              </p>
              <p className="text-base mb-4">
                &quot;User Content&quot; means any Content that you submit, upload, publish, or otherwise make available
                through the Services.
              </p>
              <h3 className="text-xl mb-4">2.2 In these Terms:</h3>
              <p className="text-base mb-4">
                (a) the words "include," "includes," and "including" are deemed to be followed by the words "without
                limitation";
                <br />
                (b) the word "or" is not exclusive;
                <br />
                (c) the words "herein," "hereof," "hereby," "hereto," and "hereunder" refer to these Terms as a whole;
                and
                <br />
                (d) words denoting the singular have a comparable meaning when used in the plural, and vice-versa.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-3">
                3. ELIGIBILITY AND REGISTRATION
              </h2>
              <h3 className="text-xl mb-4">3.1 Eligibility Requirements</h3>
              <p className="text-base mb-4">
                To access and use our Services, you must be at least eighteen (18) years old and have the legal capacity
                to form a binding contract with Financial Planner AI under applicable law. By using our Services, you
                represent and warrant that you meet these eligibility requirements. If you don&apos;t meet these
                requirements, you must not access or use our Services.
              </p>
              <h3 className="text-xl mb-4">3.2 Registration Process</h3>
              <p className="text-base mb-4">
                To access certain features of our Services, you must register for an account. When registering, you
                agree to provide accurate, current, and complete information about yourself as prompted by our
                registration process. You further agree to maintain and promptly update your registration information to
                keep it accurate, current, and complete. We reserve the right to suspend or terminate your account if we
                reasonably believe that any information you provide is inaccurate, outdated, or incomplete.
              </p>
              <h3 className="text-xl mb-4">3.3 Account Security</h3>
              <p className="text-base mb-4">
                You are responsible for maintaining the confidentiality of your account credentials, including your
                username and password. You agree to notify us immediately of any unauthorized use of your account or any
                other breach of security. You acknowledge and agree that you are fully responsible for all activities
                that occur under your account. We reserve the right to suspend or terminate your account, deny your
                access to all or part of the Services, or delete any User Content you have provided, with or without
                notice, if we reasonably believe that you have violated these Terms or that your conduct may harm
                Financial Planner AI or its users.
              </p>
              <h3 className="text-xl mb-4">3.4 Account Types</h3>
              <p className="text-base mb-4">
                Our Services may offer different types of accounts with varying features and functionality. The specific
                features and functionality available to you will depend on the type of account you register for and
                maintain. We reserve the right to modify, add, or remove features and functionality from any account
                type at any time in our sole discretion.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-4">
                4. SERVICE DESCRIPTION AND SCOPE
              </h2>
              <h3 className="text-xl mb-4">4.1 Core Services</h3>
              <p className="text-base mb-4">
                Financial Planner AI provides a web-based software application that enables Life Insurance Policy Owners
                to conduct life insurance policy analyses through our proprietary AI Technology. Our core Services
                include: (a) automated analysis of life insurance policy illustrations; (b) generation of technical
                advisor reports; (c) creation of client-ready summaries; and (d) basic information delivery through our
                chatbot interface. The Services are designed to help Policy Owners better understand their life
                insurance policies and prepare for discussions with their Professional Advisors.
              </p>
              <h3 className="text-xl mb-4">4.2 Service Delivery</h3>
              <p className="text-base mb-4">
                We will make the Services available to you pursuant to these Terms and any applicable Documentation. We
                may modify, enhance, or otherwise change the Services at any time in our sole discretion. We will use
                commercially reasonable efforts to provide the Services in accordance with industry standards, but we
                don&apos;t guarantee that the Services will be provided without interruption or error-free. You
                acknowledge that our Services are subject to limitations, delays, and other problems inherent in the use
                of internet and electronic communications.
              </p>
              <h3 className="text-xl mb-4">4.3 Service Access</h3>
              <p className="text-base mb-4">
                Subject to your compliance with these Terms and payment of applicable fees, we grant you a limited,
                non-exclusive, non-transferable, non-sublicensable right to access and use the Services solely for your
                internal business or personal purposes during the term of these Terms. This right is conditioned on your
                compliance with all applicable laws, regulations, and these Terms.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-5">
                5. CRITICAL LIMITATIONS AND DISCLAIMERS
              </h2>
              <h3 className="text-xl mb-4">5.1 No Professional Advice</h3>
              <p className="text-base mb-4">
                YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT THE SERVICES DO NOT CONSTITUTE PROFESSIONAL ADVICE OF ANY KIND.
                The Services are informational tools only and are not intended to replace the advice or services of
                licensed professionals. Financial Planner AI does not provide tax, legal, financial, insurance, or
                investment advice. We do not recommend, endorse, or sell any insurance products, policies, or companies.
              </p>
              <p className="text-base mb-4">
                You must consult with qualified Professional Advisors before making any decisions about your life
                insurance policy or taking any actions based on information provided through our Services. The Analyses
                generated by our Services are intended solely as starting points for discussions with your Professional
                Advisors and should never be relied upon as the sole basis for any decision or action regarding your
                life insurance policy.
              </p>
              <h3 className="text-xl mb-4">5.2 AI Technology Limitations</h3>
              <p className="text-base mb-4">
                You expressly acknowledge and understand that our Services utilize automated artificial intelligence and
                machine learning technologies that have inherent limitations and potential for error. The accuracy and
                reliability of our Analyses depend entirely on the quality, completeness, and accuracy of the
                information and documentation you provide. Different illustration dates, assumptions, or inputs may
                produce materially different analysis results.
              </p>
              <p className="text-base mb-4">Our AI Technology:</p>
              <p className="text-base mb-4">
                (a) May contain errors, bugs, or inaccuracies;
                <br />
                (b) May not capture all relevant factors or considerations;
                <br />
                (c) May produce inconsistent or unexpected results;
                <br />
                (d) Requires human review and professional verification;
                <br />
                (e) Is subject to regular updates that may affect results;
                <br />
                (f) Cannot verify the completeness or accuracy of input data;
                <br />
                (g) May have biases or limitations we have not identified; and
                <br />
                (h) Should never be relied upon without independent verification.
              </p>
              <h3 className="text-xl mb-4">5.3 Document Processing Restrictions</h3>
              <p className="text-base mb-4">
                The Services are designed to process only life insurance policy illustrations. We do not analyze other
                insurance or financial documents. You acknowledge and agree that:
              </p>
              <p className="text-base mb-4">
                (a) We cannot verify the completeness, accuracy, or authenticity of any illustration you submit;
                <br />
                (b) The accuracy of our Analyses depends entirely on the accuracy of the illustration provided;
                <br />
                (c) We do not independently verify any information contained in policy illustrations;
                <br />
                (d) Certain illustration formats or types may not be compatible with our Services;
                <br />
                (e) Processing errors or failures may occur due to document formatting or quality issues; and
                <br />
                (f) We are not responsible for any errors or omissions in the illustrations you provide.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-6">
                6. DATA RIGHTS AND PRIVACY
              </h2>
              <h3 className="text-xl mb-4">6.1 Data Collection and Use</h3>
              <p className="text-base mb-4">
                By using our Services, you acknowledge and agree that we may collect and process various types of data
                about you and your use of the Services. This data includes, without limitation: (a) account registration
                information; (b) policy illustration data; (c) usage data and analytics; (d) technical information about
                your devices and systems; (e) communications and correspondence; (f) payment information; and (g) any
                other information you provide to us through the Services. You hereby grant Financial Planner AI a
                worldwide, perpetual, irrevocable, royalty-free license to use, copy, modify, create derivative works
                from, distribute, perform, display, and otherwise exploit such data for the purposes of: (i) providing
                and improving the Services; (ii) developing and training our AI Technology; (iii) generating aggregated
                analytics and insights; (iv) preventing fraud and abuse; (v) complying with legal obligations; and (vi)
                any other purpose disclosed to you at the time of collection.
              </p>
              <h3 className="text-xl mb-4">6.2 Data Rights and Licenses</h3>
              <p className="text-base mb-4">
                You represent and warrant that you have all necessary rights, permissions, and consents to provide any
                data you submit to our Services. You retain all ownership rights in your User Content but grant
                Financial Planner AI and its Affiliates a worldwide, non-exclusive, royalty-free, sublicensable, and
                transferable license to use, store, copy, modify, create derivative works from, distribute, publish,
                transmit, stream, broadcast, and otherwise exploit such User Content for any purpose related to
                providing and improving the Services. You also grant Financial Planner AI and its Affiliates the right
                to use your name, likeness, and other identifying information in connection with your User Content.
              </p>
              <h3 className="text-xl mb-4">6.3 Privacy Practices</h3>
              <p className="text-base mb-4">
                Our collection, use, and disclosure of personal information is governed by our Privacy Policy, available
                at{" "}
                <Link
                  href="https://www.lifeinsuranceplanner-ai.com/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.lifeinsuranceplanner-ai.com/privacy
                </Link>
                . You acknowledge that you have reviewed our Privacy Policy and consent to the practices described
                therein. We reserve the right to update our Privacy Policy at any time in accordance with its terms.
                Your continued use of the Services following any changes to our Privacy Policy constitutes acceptance of
                such changes.
              </p>
              <h3 className="text-xl mb-4">6.4 Data Security</h3>
              <p className="text-base mb-4">
                We implement reasonable technical, administrative, and physical security measures designed to protect
                your data from unauthorized access, disclosure, or misuse. However, no security measures are perfect or
                impenetrable. You acknowledge that: (a) any security measures can be circumvented; (b) we cannot
                guarantee the absolute security of any data; (c) transmissions over the internet are never completely
                secure; and (d) we are not responsible for the circumvention of any privacy settings or security
                measures contained in the Services.
              </p>
              <h3 className="text-xl mb-4">6.5 Data Retention and Deletion</h3>
              <p className="text-base mb-4">
                We retain your data for as long as necessary to provide the Services, comply with our legal obligations,
                resolve disputes, and enforce our agreements. Upon termination of your account, we may retain your data
                for a reasonable period of time for backup, archival, audit, or legal purposes. You may request deletion
                of your account and associated data by contacting us at{" "}
                <Link href="mailto:rpc@financialplanner-ai.com" className="text-primary hover:underline">
                  rpc@financialplanner-ai.com
                </Link>
                . However, some information may be retained indefinitely in our backup systems or as required by law.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-7">
                7. PAYMENT TERMS AND CONDITIONS
              </h2>
              <h3 className="text-xl mb-4">7.1 Fees and Payment</h3>
              <p className="text-base mb-4">
                Access to certain features of our Services requires payment of fees as specified on our Website or in a
                separate written agreement. All fees are quoted in U.S. dollars and are exclusive of applicable taxes.
                You agree to pay all fees and applicable taxes in accordance with the payment terms presented to you at
                the time of purchase. You authorize us to charge your designated payment method for all fees and taxes
                due. Fees paid are non-refundable except as expressly provided in these Terms or required by law.
              </p>
              <h3 className="text-xl mb-4">7.2 Subscription Terms</h3>
              <p className="text-base mb-4">
                Our Services may be offered on a subscription basis with recurring payments. By subscribing to our
                Services, you authorize us to charge your payment method on a recurring basis until you cancel your
                subscription. Subscription fees will be billed at the beginning of each subscription period. You
                acknowledge that your subscription will automatically renew unless you cancel it prior to the renewal
                date. We reserve the right to change subscription fees upon notice to you. If you don&apos;t accept a
                fee change, you must cancel your subscription before the change takes effect.
              </p>
              <h3 className="text-xl mb-4">7.3 Payment Processing</h3>
              <p className="text-base mb-4">
                We use third-party payment processors to process payments for our Services. Your use of these payment
                services is subject to the applicable processor&apos;s terms of service and privacy policy. We are not
                responsible for any errors, failures, or interruptions in payment processing. You agree to provide
                accurate and complete payment information and to update such information as necessary. We reserve the
                right to suspend or terminate your access to paid features if your payment method is declined or
                expires.
              </p>
              <h3 className="text-xl mb-4">7.4 Late Payments and Collection</h3>
              <p className="text-base mb-4">
                Any amounts not paid when due shall bear interest at the rate of 1.5% per month or the maximum rate
                permitted by law, whichever is less. You agree to reimburse us for all costs and expenses incurred in
                collecting past due amounts, including reasonable attorneys&apos; fees. We may suspend or terminate your
                access to paid features if your account becomes delinquent and you fail to cure such delinquency within
                thirty (30) days after notice.
              </p>
              <h3 className="text-xl mb-4">7.5 Taxes</h3>
              <p className="text-base mb-4">
                You are responsible for paying all taxes, levies, duties, and assessments of any kind imposed by any
                governmental authority in connection with your use of the Services, excluding taxes based on our net
                income. If we have a legal obligation to pay or collect taxes for which you are responsible, you
                authorize us to charge your payment method for such amounts.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-8">
                8. USAGE RESTRICTIONS AND REQUIREMENTS
              </h2>
              <h3 className="text-xl mb-4">8.1 Acceptable Use</h3>
              <p className="text-base mb-4">
                You agree to use the Services only for lawful purposes and in accordance with these Terms. You shall not
                use the Services in any manner that could damage, disable, overburden, or impair our servers or
                networks, or interfere with any other party&apos;s use and enjoyment of the Services. You acknowledge
                and agree that we may monitor your use of the Services to ensure compliance with these Terms and to
                protect our rights and interests.
              </p>
              <h3 className="text-xl mb-4">8.2 Prohibited Activities</h3>
              <p className="text-base mb-4">Without limiting the generality of the foregoing, you shall not:</p>
              <p className="text-base mb-4">
                (a) Use the Services to engage in any unlawful, fraudulent, deceptive, or manipulative activity;
                <br />
                (b) Attempt to circumvent, disable, or otherwise interfere with any security-related features of the
                Services or features that prevent or restrict use or copying of any content;
                <br />
                (c) Use any robot, spider, crawler, scraper, or other automated means to access the Services or collect
                information from the Services;
                <br />
                (d) Copy, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
                republish, download, store, transmit, sell, rent, lease, lend, or sublicense any portion of the
                Services;
                <br />
                (e) Decompile, disassemble, reverse engineer, or attempt to discover any source code, object code, or
                underlying ideas or algorithms of the Services;
                <br />
                (f) Access the Services to build a similar or competitive product or service;
                <br />
                (g) Upload, transmit, or distribute any computer viruses, worms, malicious code, or any software
                intended to damage or alter a computer system or data;
                <br />
                (h) Use the Services to send unsolicited communications, promotions, advertisements, or spam;
                <br />
                (i) Submit false or misleading information or impersonate another person or entity;
                <br />
                (j) Violate, misappropriate, or infringe any intellectual property, publicity, privacy, or other rights
                of any party;
                <br />
                (k) Use the Services in any manner that could interfere with, disrupt, negatively affect, or inhibit
                other users from fully enjoying the Services.
              </p>
              <h3 className="text-xl mb-4">8.3 Usage Monitoring and Enforcement</h3>
              <p className="text-base mb-4">We reserve the right to:</p>
              <p className="text-base mb-4">
                (a) Monitor and record all use of the Services for compliance with these Terms;
                <br />
                (b) Investigate any suspicious or reported violation of these Terms;
                <br />
                (c) Take appropriate legal action against anyone who violates these Terms;
                <br />
                (d) Remove or refuse any content that violates these Terms or may expose us to liability;
                <br />
                (e) Terminate or suspend your access to the Services for violations of these Terms;
                <br />
                (f) Report any activity we suspect violates any law or regulation to appropriate authorities.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-9">
                9. INTELLECTUAL PROPERTY RIGHTS
              </h2>
              <h3 className="text-xl mb-4">9.1 Ownership of Services</h3>
              <p className="text-base mb-4">
                The Services, including all content, features, functionality, software, code, databases, user
                interfaces, algorithms, machine learning models, and documentation, are owned by Financial Planner AI
                and its licensors and are protected by United States and international intellectual property laws. These
                Terms don&apos;t grant you any rights to use any of our trademarks, logos, domain names, or other
                distinctive brand features except as expressly provided herein.
              </p>
              <h3 className="text-xl mb-4">9.2 Limited License Grant</h3>
              <p className="text-base mb-4">
                Subject to your compliance with these Terms and payment of applicable fees, Financial Planner AI grants
                you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Services
                solely for your internal business or personal purposes. This license is conditional upon your continued
                compliance with these Terms and will terminate automatically upon any breach of these Terms by you or
                upon termination of your account.
              </p>
              <h3 className="text-xl mb-4">9.3 Restrictions on Use</h3>
              <p className="text-base mb-4">You shall not, and shall not permit any third party to:</p>
              <p className="text-base mb-4">
                (a) Copy, modify, translate, or create derivative works based on the Services;
                <br />
                (b) Sell, sublicense, transfer, lease, rent, loan, or otherwise distribute the Services to any third
                party;
                <br />
                (c) Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code, object
                code, or underlying structure of the Services;
                <br />
                (d) Remove, alter, or obscure any proprietary notices in or on the Services;
                <br />
                (e) Use the Services to develop any similar or competitive product or service;
                <br />
                (f) Use any unauthorized third-party software or tools designed to extract data or content from the
                Services.
              </p>
              <h3 className="text-xl mb-4">9.4 Feedback and Suggestions</h3>
              <p className="text-base mb-4">
                If you provide any feedback, suggestions, comments, ideas, or recommendations regarding the Services
                (&quot;Feedback&quot;), you hereby grant Financial Planner AI a worldwide, perpetual, irrevocable,
                royalty-free license to use, incorporate, modify, display, perform, create derivative works from, and
                otherwise exploit such Feedback for any purpose without restriction or compensation to you.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-10">
                10. THIRD-PARTY SERVICES AND CONTENT
              </h2>
              <h3 className="text-xl mb-4">10.1 Third-Party Services</h3>
              <p className="text-base mb-4">
                The Services may contain links to integrate with, or enable access to third-party websites, services, or
                resources (&quot;Third-Party Services&quot;). Your access and use of Third-Party Services is governed
                solely by the terms and conditions of such Third-Party Services. Financial Planner AI does not endorse,
                is not responsible for, and makes no representations or warranties regarding any Third-Party Services,
                including their accuracy, completeness, timeliness, validity, legality, quality, or any other aspect
                thereof.
              </p>
              <h3 className="text-xl mb-4">10.2 Third-Party Content</h3>
              <p className="text-base mb-4">
                The Services may display, include, or make available content, data, information, applications, or
                materials from third parties (&quot;Third-Party Content&quot;). You acknowledge and agree that:
              </p>
              <p className="text-base mb-4">
                (a) We do not control, endorse, or adopt any Third-Party Content;
                <br />
                (b) We make no representations or warranties regarding Third-Party Content;
                <br />
                (c) We are not responsible for examining or evaluating the content, accuracy, completeness,
                availability, timeliness, validity, legality, quality, or any other aspect of Third-Party Content;
                <br />
                (d) We shall not be liable for any Third-Party Content, or any loss or damage caused by your use of or
                reliance on Third-Party Content.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-11">
                11. WARRANTIES AND DISCLAIMERS
              </h2>
              <h3 className="text-xl mb-4">11.1 Disclaimer of Warranties</h3>
              <p className="text-base mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE,"
                WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. FINANCIAL PLANNER AI AND ITS LICENSORS EXPRESSLY
                DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT
                LIMITATION:
              </p>
              <p className="text-base mb-4">
                (a) WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY,
                OR NON-INFRINGEMENT;
                <br />
                (b) WARRANTIES ARISING OUT OF COURSE OF DEALING, USAGE,br /> (b) WARRANTIES ARISING OUT OF COURSE OF
                DEALING, USAGE, OR TRADE;
                <br />
                (c) WARRANTIES REGARDING THE SECURITY, RELIABILITY, TIMELINESS, OR PERFORMANCE OF THE SERVICES;
                <br />
                (d) WARRANTIES REGARDING THE ACCURACY OR COMPLETENESS OF ANY ANALYSES, OUTPUTS, OR RESULTS GENERATED BY
                THE SERVICES;
                <br />
                (e) WARRANTIES THAT THE SERVICES WILL MEET YOUR REQUIREMENTS OR BE UNINTERRUPTED, ERROR-FREE, OR FREE
                FROM HARMFUL COMPONENTS;
                <br />
                (f) WARRANTIES REGARDING THE QUALITY, ACCURACY, OR RELIABILITY OF ANY INFORMATION OBTAINED THROUGH THE
                SERVICES.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-12">
                12. LIMITATION OF LIABILITY
              </h2>
              <h3 className="text-xl mb-4">12.1 Exclusion of Damages</h3>
              <p className="text-base mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FINANCIAL PLANNER AI, ITS
                AFFILIATES, LICENSORS, ORSERVICE PROVIDERS BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT,
                CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR:
              </p>
              <p className="text-base mb-4">
                (a) LOSS OF PROFITS, REVENUE, BUSINESS, OR ANTICIPATED SAVINGS;
                <br />
                (b) LOSS OF USE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES;
                <br />
                (c) BUSINESS INTERRUPTION OR DIMINUTION IN VALUE;
                <br />
                (d) PERSONAL INJURY OR PROPERTY DAMAGE;
                <br />
                (e) ANY INVESTMENT, EXPENDITURE, OR COMMITMENT BY YOU IN RELATION TO THESE TERMS OR YOUR USE OF THE
                SERVICES;
                <br />
                (f) ANY ERRORS OR OMISSIONS IN ANY ANALYSIS OR OUTPUT;
                <br />
                (g) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS OR ANY PERSONAL INFORMATION;
                <br />
                (h) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES;
                <br />
                (i) ANY BUGS, VIRUSES, OR OTHER HARMFUL CODE THAT MAY BE TRANSMITTED THROUGH THE SERVICES.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-13">
                13. DISPUTE RESOLUTION AND ARBITRATION
              </h2>
              <h3 className="text-xl mb-4">13.1 Agreement to Arbitrate</h3>
              <p className="text-base mb-4">
                PLEASE READ THIS SECTION CAREFULLY AS IT AFFECTS YOUR LEGAL RIGHTS AND PROVIDES FOR RESOLUTION OF
                DISPUTES THROUGH BINDING INDIVIDUAL ARBITRATION.
              </p>
              <p className="text-base mb-4">
                You and Financial Planner AI agree that any dispute, claim, or controversy arising out of or relating to
                these Terms, or your use of the Services (collectively, &quot;Disputes&quot;) will be resolved
                exclusively through binding individual arbitration rather than in court.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-14">
                14. INDEMNIFICATION
              </h2>
              <h3 className="text-xl mb-4">14.1 Indemnification Obligations</h3>
              <p className="text-base mb-4">
                You agree to defend, indemnify, and hold harmless Financial Planner AI, its Affiliates, licensors, and
                service providers, and their respective officers, directors, employees, contractors, agents, licensors,
                suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards,
                losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating
                to your violation of these Terms or use of the Services.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-15">
                15. TERM AND TERMINATION
              </h2>
              <h3 className="text-xl mb-4">15.1 Term</h3>
              <p className="text-base mb-4">
                These Terms commence on the date you first accept them and continue until terminated in accordance with
                their provisions.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-16">
                16. GENERAL PROVISIONS
              </h2>
              <h3 className="text-xl mb-4">16.1 Governing Law</h3>
              <p className="text-base mb-4">
                These Terms and any dispute arising out of or related to these Terms or the Services shall be governed
                by and construed in accordance with the laws of the State of New Jersey, without regard to its conflict
                of law principles.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" id="section-17">
                17. CONTACT INFORMATION
              </h2>
              <h3 className="text-xl mb-4">17.1 General Inquiries</h3>
              <p className="text-base mb-4">
                For general inquiries about the Services or these Terms, please contact us at:
              </p>
              <p className="text-base mb-4">
                Financial Planner AI, LLC
                <br />
                <Link href="mailto:rpc@financialplanner-ai.com" className="text-primary hover:underline">
                  rpc@financialplanner-ai.com
                </Link>
              </p>
              <h3 className="text-xl mb-4">17.2 Legal Notices</h3>
              <p className="text-base mb-4">For legal notices, please contact us at:</p>
              <p className="text-base mb-4">
                Financial Planner AI, LLC
                <br />
                Attn: Legal Matter
                <br />
                155 Glendale Drive
                <br />
                Freehold, NJ 07728
                <br />
                <Link href="mailto:rpc@financialplanner-ai.com" className="text-primary hover:underline">
                  rpc@financialplanner-ai.com
                </Link>
              </p>
            </section>

            <div className="mt-16 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Last Updated: January 29, 2025
                <br />© 2025 Financial Planner AI, LLC. All rights reserved.
              </p>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

