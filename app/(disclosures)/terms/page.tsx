"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("1")

  const sections = [
    { id: "1", title: "Introduction and Acceptance" },
    { id: "2", title: "Definitions and Interpretation" },
    { id: "3", title: "Eligibility and Registration" },
    { id: "4", title: "Service Description and Scope" },
    { id: "5", title: "Critical Limitations and Disclaimers" },
    { id: "6", title: "Data Rights and Privacy" },
    { id: "7", title: "Payment Terms and Conditions" },
    { id: "8", title: "Usage Restrictions and Requirements" },
    { id: "9", title: "Intellectual Property Rights" },
    { id: "10", title: "Third-Party Services and Content" },
    { id: "11", title: "Warranties and Disclaimers" },
    { id: "12", title: "Limitation of Liability" },
    { id: "13", title: "Dispute Resolution and Arbitration" },
    { id: "14", title: "Indemnification" },
    { id: "15", title: "Term and Termination" },
    { id: "16", title: "General Provisions" },
    { id: "17", title: "Contact Information" },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="w-full lg:w-1/4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="pr-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start mb-2 text-left"
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="truncate">{section.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </nav>
        <main className="w-full lg:w-3/4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h1>TERMS OF SERVICE</h1>
              <p>
                <strong>Effective Date: January 1, 2025</strong>
              </p>

              <div className="bg-muted p-4 rounded-lg mb-8">
                <strong>IMPORTANT NOTICE REGARDING YOUR LEGAL RIGHTS</strong>
                <p className="mt-2">
                  {"PLEASE READ THESE TERMS OF SERVICE CAREFULLY. THEY CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION WAIVER THAT AFFECT YOUR LEGAL RIGHTS."}
                </p>
              </div>

              <p>
                {"By accessing or using the Services provided by Financial Planner AI, LLC, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, including the binding arbitration provision and class action waiver found in Section 12."}
              </p>

              <h2 id="section-1">1. INTRODUCTION AND ACCEPTANCE</h2>
              <p>
                {"Welcome to Financial Planner AI. These Terms of Service (the \"Terms\") constitute a legally binding agreement between you and Financial Planner AI, LLC, a limited liability company organized under the laws of New Jersey (\"Financial Planner AI,\" \"we,\" \"our,\" or \"us\"). These Terms govern your access to and use of our website located at https://www.lifeinsuranceplanner-ai.com (the \"Website\"), our proprietary web-based software application (the \"Application\"), our AI-powered analysis feature (\"Insurance Planner AI\"), our chatbot service, and all related services (collectively, the \"Services\")."}
              </p>

              <p>
                {"These Terms incorporate by reference our Privacy Policy, available at https://www.lifeinsuranceplanner-ai.com/privacy, our Cookie Policy https://www.lifeinsuranceplanner-ai.com/cookie-policy and any additional terms, conditions, or policies we may provide to you from time to time. Together, these documents form the entire agreement between you and Financial Planner AI regarding your use of our Services."}
              </p>

              <p>
                {"By accessing or using our Services, you represent and warrant that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms in their entirety, you must not access or use our Services. If you are accessing or using our Services on behalf of a business entity, you represent and warrant that you have the authority to bind such entity to these Terms, and references to \"you\" and \"your\" in these Terms refer to both you individually and such entity."}
              </p>

              {/* Sections 2-4 continue in part 2 */}
              <h2 id="section-2">2. DEFINITIONS AND INTERPRETATION</h2>
              <h3>2.1 Throughout these Terms, the following definitions apply:</h3>
              
              <p>
                {"\"Affiliate\" means any entity that directly or indirectly controls, is controlled by, or is under common control with Financial Planner AI, where \"control\" means the ownership of, or the power to vote, at least fifty percent (50%) of the voting stock, shares or interests of such entity."}
              </p>

              <p>
                {"\"AI Technology\" means our artificial intelligence and machine learning technologies, algorithms, models, and systems used to provide the Services."}
              </p>

              <p>
                {"\"Analyses\" means the outputs, reports, summaries, and other materials generated by our AI Technology based on the information and documentation you provide."}
              </p>

              <p>
                {"\"Confidential Information\" means any non-public information that relates to our business, technology, customers, or Services, including but not limited to our AI Technology, trade secrets, know-how, software code, technical specifications, development plans, and business strategies."}
              </p>

              <p>
                {"\"Content\" means all information, data, text, documents, graphics, images, photographs, videos, software, music, sounds, and other materials that may be available through the Services."}
              </p>

              <p>
                {"\"Documentation\" means any user guides, help materials, or other documentation we provide or make available regarding the Services."}
              </p>

              <p>
                {"\"Feedback\" means any suggestions, ideas, enhancement requests, recommendations, or other feedback you provide regarding the Services."}
              </p>

              <p>
                {"\"Intellectual Property Rights\" means all patent rights, copyright rights, mask work rights, moral rights, rights of publicity, trademark, trade dress and service mark rights, goodwill, trade secret rights, and other intellectual property rights that may exist now or come into existence in the future, under the laws of any state, country, territory or other jurisdiction."}
              </p>

              <h3>2.2 In these Terms:</h3>
              <p>
                {"(a) the words \"include,\" \"includes,\" and \"including\" are deemed to be followed by the words \"without limitation\";"}
                <br />
                {"(b) the word \"or\" is not exclusive;"}
                <br />
                {"(c) the words \"herein,\" \"hereof,\" \"hereby,\" \"hereto,\" and \"hereunder\" refer to these Terms as a whole; and"}
                <br />
                {"(d) words denoting the singular have a comparable meaning when used in the plural, and vice-versa."}
              </p>

              <h2 id="section-3">3. ELIGIBILITY AND REGISTRATION</h2>
              <h3>3.1 Eligibility Requirements</h3>
              <p>
                {"To access and use our Services, you must be at least eighteen (18) years old and have the legal capacity to form a binding contract with Financial Planner AI under applicable law. By using our Services, you represent and warrant that you meet these eligibility requirements. If you don't meet these requirements, you must not access or use our Services."}
              </p>

              <h3>3.2 Registration Process</h3>
              <p>
                {"To access certain features of our Services, you must register for an account. When registering, you agree to provide accurate, current, and complete information about yourself as prompted by our registration process. You further agree to maintain and promptly update your registration information to keep it accurate, current, and complete. We reserve the right to suspend or terminate your account if we reasonably believe that any information you provide is inaccurate, outdated, or incomplete."}
              </p>

              <h2 id="section-4">4. SERVICE DESCRIPTION AND SCOPE</h2>
              <h3>4.1 Core Services</h3>
              <p>
                {"Financial Planner AI provides a web-based software application that enables Life Insurance Policy Owners to conduct life insurance policy analyses through our proprietary AI Technology. Our core Services include: (a) automated analysis of life insurance policy illustrations; (b) generation of technical advisor reports; (c) creation of client-ready summaries; and (d) basic information delivery through our chatbot interface. The Services are designed to help Policy Owners better understand their life insurance policies and prepare for discussions with their Professional Advisors."}
              </p>

              <h3>4.2 Service Delivery</h3>
              <p>
                {"We will make the Services available to you pursuant to these Terms and any applicable Documentation. We may modify, enhance, or otherwise change the Services at any time in our sole discretion. We will use commercially reasonable efforts to provide the Services in accordance with industry standards, but we don't guarantee that the Services will be provided without interruption or error-free. You acknowledge that our Services are subject to limitations, delays, and other problems inherent in the use of internet and electronic communications."}
              </p>

              <h2 id="section-5">5. CRITICAL LIMITATIONS AND DISCLAIMERS</h2>
              <h3>5.1 No Professional Advice</h3>
              <p>
                {"YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT THE SERVICES DO NOT CONSTITUTE PROFESSIONAL ADVICE OF ANY KIND. The Services are informational tools only and are not intended to replace the advice or services of licensed professionals. Financial Planner AI does not provide tax, legal, financial, insurance, or investment advice. We don't recommend, endorse, or sell any insurance products, policies, or companies."}
              </p>

              <p>
                {"You must consult with qualified Professional Advisors before making any decisions about your life insurance policy or taking any actions based on information provided through our Services. The Analyses generated by our Services are intended solely as starting points for discussions with your Professional Advisors and should never be relied upon as the sole basis for any decision or action regarding your life insurance policy."}
              </p>

              <h2 id="section-6">6. DATA RIGHTS AND PRIVACY</h2>
              <h3>6.1 Data Collection and Use</h3>
              <p>
                {"By using our Services, you acknowledge and agree that we may collect and process various types of data about you and your use of the Services. This data includes, without limitation: (a) account registration information; (b) policy illustration data; (c) usage data and analytics; (d) technical information about your devices and systems; (e) communications and correspondence; (f) payment information; and (g) any other information you provide to us through the Services."}
              </p>

              <h3>6.2 Data Rights and Licenses</h3>
              <p>
                {"You represent and warrant that you have all necessary rights, permissions, and consents to provide any data you submit to our Services. You retain all ownership rights in your User Content but grant Financial Planner AI and its Affiliates a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, store, copy, modify, create derivative works from, distribute, publish, transmit, stream, broadcast, and otherwise exploit such User Content for any purpose related to providing and improving the Services."}
              </p>

              <h3>6.3 Privacy Practices</h3>
              <p>
                {"Our collection, use, and disclosure of personal information is governed by our Privacy Policy, available at https://www.lifeinsuranceplanner-ai.com/privacy. You acknowledge that you have reviewed our Privacy Policy and consent to the practices described therein. We reserve the right to update our Privacy Policy at any time in accordance with its terms. Your continued use of the Services following any changes to our Privacy Policy constitutes acceptance of such changes."}
              </p>
              <h2 id="section-7">7. PAYMENT TERMS AND CONDITIONS</h2>
              <h3>7.1 Fees and Payment</h3>
              <p>
                {"Access to certain features of our Services requires payment of fees as specified on our Website or in a separate written agreement. All fees are quoted in U.S. dollars and are exclusive of applicable taxes. You agree to pay all fees and applicable taxes in accordance with the payment terms presented to you at the time of purchase. You authorize us to charge your designated payment method for all fees and taxes due. Fees paid are non-refundable except as expressly provided in these Terms or required by law."}
              </p>

              <h3>7.2 Subscription Terms</h3>
              <p>
                {"Our Services may be offered on a subscription basis with recurring payments. By subscribing to our Services, you authorize us to charge your payment method on a recurring basis until you cancel your subscription. Subscription fees will be billed at the beginning of each subscription period. You acknowledge that your subscription will automatically renew unless you cancel it prior to the renewal date. We reserve the right to change subscription fees upon notice to you. If you don't accept a fee change, you must cancel your subscription before the change takes effect."}
              </p>

              <h3>7.3 Payment Processing</h3>
              <p>
                {"We use third-party payment processors to process payments for our Services. Your use of these payment services is subject to the applicable processor's terms of service and privacy policy. We are not responsible for any errors, failures, or interruptions in payment processing. You agree to provide accurate and complete payment information and to update such information as necessary. We reserve the right to suspend or terminate your access to paid features if your payment method is declined or expires."}
              </p>

              <h2 id="section-8">8. USAGE RESTRICTIONS AND REQUIREMENTS</h2>
              <h3>8.1 Acceptable Use</h3>
              <p>
                {"You agree to use the Services only for lawful purposes and in accordance with these Terms. You shall not use the Services in any manner that could damage, disable, overburden, or impair our servers or networks, or interfere with any other party's use and enjoyment of the Services. You acknowledge and agree that we may monitor your use of the Services to ensure compliance with these Terms and to protect our rights and interests."}
              </p>

              <h3>8.2 Prohibited Activities</h3>
              <p>{"Without limiting the generality of the foregoing, you shall not:"}</p>
              <p>
                {"(a) Use the Services to engage in any unlawful, fraudulent, deceptive, or manipulative activity."}
                <br />
                {"(b) Attempt to circumvent, disable, or otherwise interfere with any security-related features of the Services or features that prevent or restrict use or copying of any content."}
                <br />
                {"(c) Use any robot, spider, crawler, scraper, or other automated means to access the Services or collect information from the Services."}
                <br />
                {"(d) Copy, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, transmit, sell, rent, lease, lend, or sublicense any portion of the Services."}
                <br />
                {"(e) Decompile, disassemble, reverse engineer, or attempt to discover any source code, object code, or underlying ideas or algorithms of the Services."}
              </p>

              <h2 id="section-9">9. INTELLECTUAL PROPERTY RIGHTS</h2>
              <h3>9.1 Ownership of Services</h3>
              <p>
                {"The Services, including all content, features, functionality, software, code, databases, user interfaces, algorithms, machine learning models, and documentation, are owned by Financial Planner AI and its licensors and are protected by United States and international intellectual property laws. These Terms don't grant you any rights to use any of our trademarks, logos, domain names, or other distinctive brand features except as expressly provided herein."}
              </p>

              <h3>9.2 Limited License Grant</h3>
              <p>
                {"Subject to your compliance with these Terms and payment of applicable fees, Financial Planner AI grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Services solely for your internal business or personal purposes. This license is conditional upon your continued compliance with these Terms and will terminate automatically upon any breach of these Terms by you or upon termination of your account."}
              </p>

              <h2 id="section-10">10. THIRD-PARTY SERVICES AND CONTENT</h2>
              <h3>10.1 Third-Party Services</h3>
              <p>
                {"The Services may contain links to integrate with, or enable access to third-party websites, services, or resources (\"Third-Party Services\"). Your access and use of Third-Party Services is governed solely by the terms and conditions of such Third-Party Services. Financial Planner AI does not endorse, is not responsible for, and makes no representations or warranties regarding any Third-Party Services, including their accuracy, completeness, timeliness, validity, legality, quality, or any other aspect thereof."}
              </p>

              <h2 id="section-11">11. WARRANTIES AND DISCLAIMERS</h2>
              <h3>11.1 Disclaimer of Warranties</h3>
              <p>
                {"TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE,\" WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. FINANCIAL PLANNER AI AND ITS LICENSORS EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION:"}
              </p>
              <p>
                {"(a) WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, OR NON-INFRINGEMENT."}
                <br />
                {"(b) WARRANTIES ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE."}
                <br />
                {"(c) WARRANTIES REGARDING THE SECURITY, RELIABILITY, TIMELINESS, OR PERFORMANCE OF THE SERVICES."}
              </p>

              <h2 id="section-12">12. LIMITATION OF LIABILITY</h2>
              <h3>12.1 Exclusion of Damages</h3>
              <p>
                {"TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FINANCIAL PLANNER AI, ITS AFFILIATES, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR:"}
              </p>
              <p>
                {"(a) LOSS OF PROFITS, REVENUE, BUSINESS, OR ANTICIPATED SAVINGS."}
                <br />
                {"(b) LOSS OF USE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES."}
                <br />
                {"(c) BUSINESS INTERRUPTION OR DIMINUTION IN VALUE."}
                <br />
                {"(d) PERSONAL INJURY OR PROPERTY DAMAGE."}
                <br />
                {"(e) ANY INVESTMENT, EXPENDITURE, OR COMMITMENT BY YOU IN RELATION TO THESE TERMS OR YOUR USE OF THE SERVICES."}
              </p>

              <h3>12.2 Liability Cap</h3>
              <p>
                {"TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICES, WHETHER IN CONTRACT, TORT, OR OTHERWISE, SHALL NOT EXCEED THE AMOUNT YOU PAID US FOR THE SERVICES DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER."}
              </p>
              <h2 id="section-13">13. DISPUTE RESOLUTION AND ARBITRATION</h2>
              <h3>13.1 Agreement to Arbitrate</h3>
              <p>
                {"PLEASE READ THIS SECTION CAREFULLY AS IT AFFECTS YOUR LEGAL RIGHTS AND PROVIDES FOR RESOLUTION OF DISPUTES THROUGH BINDING INDIVIDUAL ARBITRATION."}
              </p>
              
              <p>
                {"You and Financial Planner AI agree that any dispute, claim, or controversy arising out of or relating to these Terms, or your use of the Services (collectively, \"Disputes\") will be resolved exclusively through binding individual arbitration rather than in court, except that:"}
              </p>

              <p>
                {"(a) Each party retains the right to bring an individual action in small claims court."}
                <br />
                {"(b) Each party retains the right to seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights."}
                <br />
                {"(c) Each party retains the right to bring claims that are expressly excluded from arbitration by applicable law."}
              </p>

              <h3>13.2 Class Action Waiver</h3>
              <p>
                {"YOU AND FINANCIAL PLANNER AI AGREE TO RESOLVE ANY DISPUTES ON AN INDIVIDUAL BASIS AND HEREBY WAIVE ANY RIGHT TO:"}
              </p>
              <p>
                {"(a) Participate in a class action, collective action, or other representative proceeding."}
                <br />
                {"(b) Act as a private attorney general or participate in claims brought in such capacity."}
                <br />
                {"(c) Join or consolidate claims with claims of any other person or entity."}
                <br />
                {"(d) Pursue any claim on behalf of any other person or entity or group of persons or entities."}
              </p>

              <h2 id="section-14">14. INDEMNIFICATION</h2>
              <h3>14.1 Indemnification Obligations</h3>
              <p>
                {"You agree to defend, indemnify, and hold harmless Financial Planner AI, its Affiliates, licensors, and service providers, and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns (collectively, \"Indemnified Parties\") from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:"}
              </p>
              <p>
                {"(a) Your violation of these Terms or any applicable law, regulation, or third-party right."}
                <br />
                {"(b) Your User Content or any material you submit to or transmit through the Services."}
                <br />
                {"(c) Your use or misuse of the Services, including any activities conducted through your account."}
                <br />
                {"(d) Your negligence, misconduct, or fraudulent or illegal activities."}
              </p>

              <h2 id="section-15">15. TERM AND TERMINATION</h2>
              <h3>15.1 Term</h3>
              <p>
                {"These Terms commence on the date you first accept them and continue until terminated in accordance with their provisions."}
              </p>

              <h3>15.2 Termination by You</h3>
              <p>{"You may terminate these Terms at any time by:"}</p>
              <p>
                {"(a) Canceling your account through the Services interface, if such functionality is available."}
                <br />
                {"(b) Providing written notice to us at rpc@financialplanner-ai.com"}
                <br />
                {"(c) Ceasing all use of the Services and deleting any software or materials provided as part of the Services."}
              </p>

              <h2 id="section-16">16. GENERAL PROVISIONS</h2>
              <h3>16.1 Governing Law</h3>
              <p>
                {"These Terms and any dispute arising out of or related to these Terms, or the Services shall be governed by and construed in accordance with the laws of the State of New Jersey, without regard to its conflict of law principles. This choice of law provision is only intended to specify the use of New Jersey law to interpret these Terms and is not intended to create any substantive rights to non-New Jersey residents to bring claims under New Jersey law."}
              </p>

              <h3>16.2 Jurisdiction and Venue</h3>
              <p>
                {"Subject to the arbitration provisions in Section 13, any legal action or proceeding arising out of or relating to these Terms or the Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of New Jersey, in each case located in Monmouth County, and you hereby consent to and waive all defenses of lack of personal jurisdiction and forum non convenience with respect to venue and jurisdiction in such courts."}
              </p>

              <h2 id="section-17">17. CONTACT INFORMATION</h2>
              <h3>17.1 General Inquiries</h3>
              <p>
                {"For general inquiries about the Services or these Terms, please contact us at:"}
              </p>
              <p>
                {"Financial Planner AI, LLC"}
                <br />
                {"Email: rpc@financialplanner-ai.com"}
              </p>

              <h3>17.2 Legal Notices</h3>
              <p>
                {"For legal notices, please contact us at:"}
              </p>
              <p>
                {"Financial Planner AI, LLC"}
                <br />
                {"Attn: Legal Matter"}
                <br />
                {"155 Glendale Drive"}
                <br />
                {"Freehold, NJ 07728"}
                <br />
                {"Email: rpc@financialplanner-ai.com"}
              </p>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  {"Last Updated: January 29, 2025"}
                  <br />
                  {"© 2025 Financial Planner AI, LLC. All rights reserved."}
                </p>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
