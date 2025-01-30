import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Financial Planner AI",
  description: "Financial Planner AI privacy policy, effective January 1, 2025",
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>

          <div className="text-sm text-muted-foreground mb-8">Effective: January 1, 2025</div>

          {/* Introduction */}
          <section className="mb-8">
            <p>
              This Privacy Policy (&quot;Privacy Policy&quot;) describes how Financial Planner AI, LLC and its
              subsidiaries and affiliates (&quot;Financial Planner AI,&quot; &quot;us,&quot; &quot;we,&quot; or
              &quot;our&quot;) may collect, use, and share your personal information in connection with our website at:
              and any other websites we own and operate that link to this Privacy Policy (collectively, the
              &quot;Site&quot;) together with our products, services, social media pages, events, emails, and other
              electronic communications (collectively, the &quot;Services&quot;), and the choices you have with respect
              to your personal information. Financial Planner AI is based in the United States.
            </p>
            <p>
              This Privacy Policy does not apply to personal information that we may store, maintain, or process as a
              data processor/service provider on behalf of Financial Planner AI customers. For more information about
              the privacy practices of Financial Planner AI customers, please contact the relevant customer.
            </p>
            <p>
              Financial Planner AI reserves the right, at any time, to modify this Privacy Policy. If we modify how we
              collect, use, or share personal information, we will notify you by revising the &quot;Last Updated&quot;
              date at the top of this Privacy Policy and, in some cases, we may provide you with additional notice (such
              as sending you an email notification). In all cases, your continued use of the Service following posting
              or other notification of changes constitutes your acknowledgement of such changes. Please review this
              Privacy Policy periodically to keep up to date on our most current policies and practices.
            </p>
          </section>

          {/* Collection of Personal Information */}
          <section className="mb-8">
            <h2 id="collection" className="text-2xl font-semibold mb-4">
              COLLECTION OF PERSONAL INFORMATION
            </h2>
            <h3 className="text-xl font-medium mb-3">Personal Information You Provide</h3>
            <p>We collect personal information when you provide it to us, which may include the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Contact information, such as first and last name and company email address, phone number, and mailing
                address.
              </li>
              <li>
                Professional information, such as company name, job title, company location, and other details we may
                collect about your business or profession.
              </li>
              <li>
                Account information, such as information you provide during registration or agreement submission,
                records of products and services you have purchased from us, and other details about your use of the
                Service.
              </li>
              <li>
                Personal Information Contained in Insurance Policies, such as Life insurance policy illustrations may
                include an owner&apos;s and/or the insured&apos;s name, insured&apos;s date of birth, address
                information, agent or agency name, address and phone number. This information is redacted/removed from
                the policy illustration before illustration data is passed to OpenAI and Anthropic for AI analysis.
              </li>
              <li>
                Payment information, such as bank account number, credit or debit card number, or financial account
                details used for payments. All payment processing services connected with your use of the Service are
                provided to you by third-party payment processors. We accept payment from Clients in the form of credit
                cards, debit cards, and e-checks. Financial Planner AI does not store any credit card or banking
                information. We are not responsible nor have any liability if you suffer any damages of any kind from
                your use of the products and services offered by Stripe, OpenAI and Anthropic. You agree that you are
                subject to the terms and conditions and privacy policies of these companies:
                <ul className="list-none mt-2">
                  <li>
                    <a href="https://openai.com/policies/terms-of-use/" className="break-all">
                      https://openai.com/policies/terms-of-use/
                    </a>
                  </li>
                  <li>
                    <a href="https://openai.com/policies/row-privacy-policy/" className="break-all">
                      https://openai.com/policies/row-privacy-policy/
                    </a>
                  </li>
                  <li>
                    <a href="https://openai.com/policies/row-terms-of-use/" className="break-all">
                      https://openai.com/policies/row-terms-of-use/
                    </a>
                  </li>
                  <li>
                    <a href="https://www.anthropic.com/legal/consumer-terms" className="break-all">
                      https://www.anthropic.com/legal/consumer-terms
                    </a>
                  </li>
                  <li>
                    <a href="https://www.anthropic.com/legal/privacy" className="break-all">
                      https://www.anthropic.com/legal/privacy
                    </a>
                  </li>
                  <li>
                    <a href="https://stripe.com/legal/consumer" className="break-all">
                      https://stripe.com/legal/consumer
                    </a>
                  </li>
                  <li>
                    <a href="https://stripe.com/privacy" className="break-all">
                      https://stripe.com/privacy
                    </a>
                  </li>
                </ul>
              </li>
              <li>Preferences, such as any marketing or communications preferences.</li>
              <li>
                Survey responses, such as the information you provide in response to our surveys or questionnaires.
              </li>
              <li>
                Communications, such as the information associated with your requests or inquiries, including for
                support, assistance, or order information, and any feedback you provide when you communicate with us. We
                and our service providers may also record or monitor any call or chat you have with us for quality
                control or training purposes, or to enforce our rights.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Personal Information from Third Parties</h3>
            <p>
              We may obtain personal information about you from third parties, such as social media platforms and other
              public sources, third parties that help us advertise our services and find new customers, joint marketing
              partners, event co-sponsors, and other third parties.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Personal Information Collected Automatically</h3>
            <p>
              We, our service providers, and our advertising partners may automatically log information about you, your
              computer or mobile device, and your activity over time on our Service and other sites and online services,
              such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Device data, such as your computer or mobile device operating system type and version number,
                manufacturer and model, browser type, screen resolution, IP address, unique identifiers, the website you
                visited before browsing to our website, and general location information such as city, state, or
                geographic area.
              </li>
              <li>
                Online activity data, such as pages or screens you viewed, how long you spent on a page or screen,
                navigation paths between pages or screens, information about your activity on a page or screen, access
                times, and duration of access.
              </li>
            </ul>

            <p className="mt-4">
              Like many online services, we use the following technologies to facilitate some of our automatic data
              collection:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cookies, which are text files that websites store on a visitor&apos;s device to uniquely identify the
                visitor&apos;s browser or to store information or settings in the browser for the purpose of helping you
                navigate between pages efficiently, remembering your preferences, enabling functionality, helping us
                understand user activity and patterns, and facilitating online advertising.
              </li>
              <li>
                Web beacons, also known as pixel tags or clear GIFs, which are typically used to demonstrate that a
                webpage or email was accessed or opened, or that certain content was viewed or clicked, typically to
                compile statistics about usage of websites and the success of marketing campaigns.
              </li>
              <li>
                Local storage, which is used to save data on a visitor&apos;s device. We may use data from local storage
                to, for example, turn on web navigation, store multimedia preferences, customize what we show you based
                on your past interactions with our Service, and remember your preferences.
              </li>
              <li>
                Session-replay technologies, which are third-party software programs that we may use on the Site to
                record a video replay of user&apos;s interactions with the Site. The video replay may include
                users&apos; clicks, mouse movements, scrolls, mobile app touches, typing, and other activity taken
                during the session. We use these replays for research and development purposes, such as to help us
                troubleshoot problems with the Site, understand how users interact with and use the Site, and identify
                areas for improvement.
              </li>
            </ul>
          </section>

          {/* Use of Personal Information */}
          <section className="mb-8">
            <h2 id="use" className="text-2xl font-semibold mb-4">
              USE OF PERSONAL INFORMATION
            </h2>
            <p>
              Financial Planner AI uses personal information for the purposes set forth below and as otherwise described
              in this Privacy Policy or at the time of collection.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">To Provide the Service</h3>
            <p>
              We may use personal information to provide our Service and to operate our business. For example, we use
              personal information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>process your transactions, including granting access to our online products and technology;</li>
              <li>establish, manage, monitor, and maintain your account;</li>
              <li>improve and personalize your experience on or with the Service;</li>
              <li>verify your identity or determine your eligibility for offers or promotions;</li>
              <li>
                communicate with you, including providing notices about your account or transaction (e.g.,
                confirmations, technical notices, updates, and security alerts) and responding to any of your requests,
                feedback, or questions;
              </li>
              <li>contact you by phone, email, or other form of communication;</li>
              <li>provide any contests, surveys, sweepstakes, or other promotions you participate in;</li>
              <li>provide maintenance and support; and</li>
              <li>fulfill any other purpose for which you provide personal information.</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Research and Development</h3>
            <p>
              We may use your personal information for research and development purposes, including to study and improve
              the Service and our business, understand and analyze the usage trends and preferences of our users, and
              develop new features, functionality, products, and services. As part of these activities, we may create
              aggregated, de-identified, or other anonymous data from personal information we collect. We make personal
              information into anonymous data by removing information that makes the data personally identifiable to
              you. We may use this anonymous data and share it with third parties for our lawful business purposes.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Direct Marketing</h3>
            <p>
              We may send you Financial Planner AI-related or other direct marketing communications as permitted by law,
              including materials, updates, information, special offers, and promotional material from us and our
              business partners. You may opt-out of our marketing communications as described in the &quot;YOUR
              CHOICES&quot; section below.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Interest-Based Advertising</h3>
            <p>
              We work with third-party advertising companies and social media companies to help us advertise our
              business and to display ads for our Service. These companies may use cookies and similar technologies to
              collect information about you (including the online activity information and device information described
              above in the section called &quot;Personal Information Automatically Collected&quot;) over time across our
              Site and other websites and services or your interaction with our emails, and use that information to
              serve ads that they think will interest you. In addition, some of these companies may use hashed customer
              lists that we share with them to deliver ads to you and to similar users on their platforms. You can learn
              more about your choices for limiting interest-based advertising in the &quot;YOUR CHOICES&quot; section
              below.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Customer Testimonials</h3>
            <p>
              We may display personal testimonials of satisfied customers on our Site in addition to other endorsements.
              With your consent, we may post your testimonial along with your name.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">For Compliance, Fraud Prevention, and Safety</h3>
            <p>
              We may use personal information and disclose it to law enforcement, government authorities, and private
              parties as we believe necessary or appropriate to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                maintain the safety, security, and integrity of the Service, business, databases, and other technology
                assets;
              </li>
              <li>
                protect our, your, or others&apos; rights, privacy, safety or property (including by making and
                defending legal claims);
              </li>
              <li>
                audit our internal processes for compliance with legal and contractual requirements and internal
                policies;
              </li>
              <li>enforce the terms and conditions that govern the Service;</li>
              <li>
                prevent, identify, investigate, and deter fraudulent, harmful, unauthorized, unethical or illegal
                activity, including cyberattacks and identity theft.
              </li>
            </ul>
          </section>

          {/* Sharing of Personal Information */}
          <section className="mb-8">
            <h2 id="sharing" className="text-2xl font-semibold mb-4">
              SHARING OF PERSONAL INFORMATION
            </h2>
            <p>
              In addition to the sharing described elsewhere in this Privacy Policy or at the point of collection,
              Financial Planner AI may share your personal information as follows:
            </p>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Related Companies.</strong> We may share your personal information with our affiliates,
                subsidiaries, and other related companies.
              </li>
              <li>
                <strong>Service Providers.</strong> We may share your personal information with third parties who
                perform services on our behalf that are necessary for the orderly operation of our business.
              </li>
              <li>
                <strong>Advertising Partners.</strong> We may share personal information with third parties who we
                partner with for advertising campaigns.
              </li>
              <li>
                <strong>Professional Advisors.</strong> We may share personal information with persons, companies, or
                professional firms providing Financial Planner AI with advice and consulting in accounting,
                administrative, legal, tax, financial, debt collection, and other matters.
              </li>
              <li>
                <strong>Law Enforcement and Government Authorities.</strong> We may be required to disclose personal
                information to law enforcement, government authorities, and other parties if required to do so by law.
              </li>
            </ul>
          </section>

          {/* Your Choices */}
          <section className="mb-8">
            <h2 id="choices" className="text-2xl font-semibold mb-4">
              YOUR CHOICES
            </h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Review and Request Changes to Your Account Personal Information.</strong> If you have an
                Financial Planner AI account, you can log into your account to review, delete, and make changes to
                certain personal information stored in your account.
              </li>
              <li>
                <strong>Marketing Emails.</strong> You may opt-out of marketing-related emails by clicking the
                &quot;unsubscribe&quot; link at the bottom of the email or by contacting us.
              </li>
              <li>
                <strong>Text Messages.</strong> To stop receiving text messages from us, reply STOP to any text message
                you receive from us.
              </li>
              <li>
                <strong>Cookies.</strong> Most browsers let you remove and/or stop accepting cookies from the websites
                you visit. To do this, follow the instructions in your browser&apos;s settings.
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 id="children" className="text-2xl font-semibold mb-4">
              CHILDREN&apos;S PRIVACY
            </h2>
            <p>
              The Service is not intended for use by anyone under the age of 18, and we do not knowingly collect
              personal information from minors under 18.
            </p>
          </section>

          {/* Security */}
          <section className="mb-8">
            <h2 id="security" className="text-2xl font-semibold mb-4">
              SECURITY OF PERSONAL INFORMATION
            </h2>
            <p>
              No method of transmission over the Internet, or method of electronic storage, is fully secure. While we
              use reasonable efforts to protect your personal information from the risks presented by unauthorized
              access or acquisition, we cannot guarantee the security of your personal information.
            </p>
          </section>

          {/* California Residents */}
          <section className="mb-8">
            <h2 id="california" className="text-2xl font-semibold mb-4">
              NOTICE TO CALIFORNIA RESIDENTS
            </h2>
            <p>
              This section applies only to California residents. The California Consumer Privacy Act (CCPA) is a data
              protection law that ensures you have certain rights regarding the Personal Information we collect or
              maintain about you. Please note these rights are not absolute, and there may be cases when we decline your
              request as permitted by law.
            </p>
            <p className="mt-4">You have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Right of Access: you have the right to request that we disclose what Personal Information we have
                collected, used, and disclosed about you in the past 12 months.
              </li>
              <li>
                Right of Deletion: you have the right to request that we delete Personal Information collected or
                maintained by us, subject to certain exceptions.
              </li>
              <li>
                Right to Non-Discrimination: You have the right to not be discriminated against by us because you
                exercised any of your rights under the CCPA.
              </li>
            </ul>
          </section>

          {/* Nevada Residents */}
          <section className="mb-8">
            <h2 id="nevada" className="text-2xl font-semibold mb-4">
              NOTICE TO NEVADA RESIDENTS
            </h2>
            <p>
              Nevada Revised Statutes Chapter 603A allows Nevada residents to opt-out of the &quot;sale&quot; of certain
              types of personal information. Subject to several exceptions, Nevada law defines &quot;sale&quot; to mean
              the exchange of certain types of personal information for monetary consideration to another person. If you
              are a Nevada resident who wishes to exercise your &quot;sale&quot; opt-out rights, you may submit a
              request to us using the contact information listed at the end of this Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mt-12 border-t pt-8">
            <h2 id="contact" className="text-2xl font-semibold mb-4">
              Contact Information
            </h2>
            <div className="space-y-2">
              <p>Financial Planner AI, LLC</p>
              <p>155 Glendale Drive</p>
              <p>Freehold, NJ 07728</p>
              <p className="mt-4">
                Email:{" "}
                <a href="mailto:rpc@financialplanner-ai.com" className="text-primary hover:underline">
                  rpc@financialplanner-ai.com
                </a>
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}

