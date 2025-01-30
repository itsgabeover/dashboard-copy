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
              This Privacy Policy (&ldquo;Privacy Policy&rdquo;) describes how Financial Planner AI, LLC and its
              subsidiaries and affiliates (&ldquo;Financial Planner AI,&rdquo; &ldquo;us,&rdquo; &ldquo;we,&rdquo; or
              &ldquo;our&rdquo;) may collect, use, and share your personal information in connection with our website at{" "}
              <a
                href="https://www.lifeinsuranceplanner-ai.com/"
                className="text-primary hover:underline break-words"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.lifeinsuranceplanner-ai.com/
              </a>{" "}
              and any other websites we own and operate that link to this Privacy Policy (collectively, the
              &ldquo;Site&rdquo;) together with our products, services, social media pages, events, emails, and other
              electronic communications (collectively, the &ldquo;Services&rdquo;), and the choices you have with
              respect to your personal information. Financial Planner AI is based in the United States.
            </p>
            <p>
              This Privacy Policy does not apply to personal information that we may store, maintain, or process as a
              data processor/service provider on behalf of Financial Planner AI customers. For more information about
              the privacy practices of Financial Planner AI customers, please contact the relevant customer.
            </p>
            <p>
              Financial Planner AI reserves the right, at any time, to modify this Privacy Policy. If we modify how we
              collect, use, or share personal information, we will notify you by revising the &ldquo;Last Updated&rdquo;
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
                <span className="font-medium">Contact information</span>, such as first and last name and company email
                address, phone number, and mailing address.
              </li>

              <li>
                <span className="font-medium">Professional information</span>, such as company name, job title, company
                location, and other details we may collect about your business or profession.
              </li>

              <li>
                <span className="font-medium">Account information</span>, such as information you provide during
                registration or agreement submission, records of products and services you have purchased from us, and
                other details about your use of the Service.
              </li>

              <li>
                <span className="font-medium">Personal Information Contained in Insurance Policies</span>, such as Life
                insurance policy illustrations may include an owner&apos;s and/or the insured&apos;s name,
                insured&apos;s date of birth, address information, agent or agency name, address and phone number. This
                information is redacted/removed from the policy illustration before illustration data is passed to
                OpenAI and Anthropic for AI analysis.
              </li>

              <li>
                <span className="font-medium">Payment information</span>, such as bank account number, credit or debit
                card number, or financial account details used for payments. All payment processing services connected
                with your use of the Service are provided to you by third-party payment processors. We accept payment
                from Clients in the form of credit cards, debit cards, and e-checks. Financial Planner AI does not store
                any credit card or banking information. We are not responsible nor have any liability if you suffer any
                damages of any kind from your use of the products and services offered by Stripe, OpenAI and Anthropic.
                You agree that you are subject to the terms and conditions and privacy policies of these companies:
                <ul className="list-none mt-2 space-y-1">
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
                We may also store your billing address to calculate any sales tax due in the United States, to maintain
                records that may be used for investigations of potentially fraudulent credit card transactions, and to
                print on your invoices. We may collect commercial information such as your purchase history, including
                records of products or services you have purchased, provided, returned, or are considering purchasing
                from us.
              </li>

              <li>
                <span className="font-medium">Preferences</span>, such as any marketing or communications preferences.
              </li>

              <li>
                <span className="font-medium">Survey responses</span>, such as the information you provide in response
                to our surveys or questionnaires.
              </li>

              <li>
                <span className="font-medium">Communications</span>, such as the information associated with your
                requests or inquiries, including for support, assistance, or order information, and any feedback you
                provide when you communicate with us. We and our service providers may also record or monitor any call
                or chat you have with us for quality control or training purposes, or to enforce our rights.
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
                <span className="font-medium">Device data</span>, such as your computer or mobile device operating
                system type and version number, manufacturer and model, browser type, screen resolution, IP address,
                unique identifiers, the website you visited before browsing to our website, and general location
                information such as city, state, or geographic area.
              </li>

              <li>
                <span className="font-medium">Online activity data</span>, such as pages or screens you viewed, how long
                you spent on a page or screen, navigation paths between pages or screens, information about your
                activity on a page or screen, access times, and duration of access.
              </li>
            </ul>

            <p className="mt-4">
              Like many online services, we use the following technologies to facilitate some of our automatic data
              collection:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Cookies</span>, which are text files that websites store on a
                visitor&apos;s device to uniquely identify the visitor&apos;s browser or to store information or
                settings in the browser for the purpose of helping you navigate between pages efficiently, remembering
                your preferences, enabling functionality, helping us understand user activity and patterns, and
                facilitating online advertising.
              </li>

              <li>
                <span className="font-medium">Web beacons</span>, also known as pixel tags or clear GIFs, which are
                typically used to demonstrate that a webpage or email was accessed or opened, or that certain content
                was viewed or clicked, typically to compile statistics about usage of websites and the success of
                marketing campaigns.
              </li>

              <li>
                <span className="font-medium">Local storage</span>, which is used to save data on a visitor&apos;s
                device. We may use data from local storage to, for example, turn on web navigation, store multimedia
                preferences, customize what we show you based on your past interactions with our Service, and remember
                your preferences.
              </li>

              <li>
                <span className="font-medium">Session-replay technologies</span>, which are third-party software
                programs that we may use on the Site to record a video replay of user&apos;s interactions with the Site.
                The video replay may include users&apos; clicks, mouse movements, scrolls, mobile app touches, typing,
                and other activity taken during the session. We use these replays for research and development purposes,
                such as to help us troubleshoot problems with the Site, understand how users interact with and use the
                Site, and identify areas for improvement.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Referrals</h3>
            <p>
              Customers and other users of the Service may have the opportunity to refer friends, colleagues, or other
              contacts to us and share their contact information with us. Please do not refer someone to us or share
              their contact information with us unless you have their permission to do so.
            </p>
          </section>

          {/* Chatbot Interactions and Data Collection */}
          <section className="mb-8">
            <h2 id="chatbot" className="text-2xl font-semibold mb-4">
              CHATBOT INTERACTIONS AND DATA COLLECTION
            </h2>
            <p>
              Our Service includes an AI-powered chatbot feature that allows users to interact with our platform through
              conversational interfaces on our website and mobile applications. This section describes how we collect,
              use, and protect information gathered through your interactions with our chatbot.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Information We Collect Through Chatbot Interactions</h3>
            <p>When you engage with our chatbot, we collect and process the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chat conversation content, including messages you send and receive</li>
              <li>Time and date of interactions</li>
              <li>Device information and session identifiers</li>
              <li>Authentication and account information when you&apos;re logged in</li>
              <li>Technical information about your chatbot interaction, such as session duration and feature usage</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Use and Processing of Chatbot Data</h3>
            <p>We use information collected through chatbot interactions for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and improving our chatbot service</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Maintaining security and preventing fraud</li>
              <li>Training and improving our AI models (using anonymized data only)</li>
              <li>Quality assurance and customer support</li>
              <li>Compliance with legal obligations</li>
            </ul>
            <p>
              We may engage third-party service providers to help us deliver and improve our chatbot services. These
              service providers are contractually bound to protect your information and may only use it for the specific
              purposes we designate.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Data Retention and Security</h3>
            <p>
              Chat interaction data is retained for a period of 12 months from the date of creation, after which it is
              automatically deleted unless:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Longer retention is required by law</li>
              <li>The data is part of an ongoing investigation or dispute</li>
              <li>You have requested data preservation for legal or compliance purposes</li>
            </ul>
            <p>
              We implement appropriate technical and organizational measures to protect chatbot interaction data,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption of chat sessions</li>
              <li>Secure data storage with restricted access</li>
              <li>Regular security assessments and monitoring</li>
              <li>Employee training on data protection</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Your Rights and Choices Regarding Chatbot Data</h3>
            <p>You have the following rights regarding your chatbot interaction data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your chat history (when logged into your account)</li>
              <li>Request deletion of your chat history</li>
              <li>Opt-out of non-essential data collection</li>
              <li>Object to automated decision-making processes</li>
              <li>Request human review of significant decisions made by the chatbot</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Automated Decision-Making</h3>
            <p>
              Our chatbot may make automated decisions based on your interactions to provide personalized responses and
              recommendations. You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request human intervention in any automated decision-making process</li>
              <li>Express your point of view regarding automated decisions</li>
              <li>Contest any automated decisions that affect your rights or interests</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Special Categories of Data</h3>
            <p>
              Please do not share sensitive personal information (such as health information, financial account details,
              or government identification numbers) through the chatbot unless specifically requested through a secure,
              authenticated session. We implement additional safeguards for any sensitive data collected through
              authenticated chatbot sessions.
            </p>
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
              <li>provide maintenance and support;</li>
              <li>facilitate and improve chatbot interactions and automated assistance; and</li>
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
              business partners. You may opt-out of our marketing communications as described in the &ldquo;YOUR
              CHOICES&rdquo; section below.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Interest-Based Advertising</h3>
            <p>
              We work with third-party advertising companies and social media companies to help us advertise our
              business and to display ads for our Service. These companies may use cookies and similar technologies to
              collect information about you (including the online activity information and device information described
              above in the section called &ldquo;Personal Information Automatically Collected&rdquo;) over time across
              our Site and other websites and services or your interaction with our emails, and use that information to
              serve ads that they think will interest you. In addition, some of these companies may use hashed customer
              lists that we share with them to deliver ads to you and to similar users on their platforms. You can learn
              more about your choices for limiting interest-based advertising in the &ldquo;YOUR CHOICES&rdquo; section
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
              <li>enforce the terms and conditions that govern the Service; and</li>
              <li>
                prevent, identify, investigate, and deter fraudulent, harmful, unauthorized, unethical or illegal
                activity, including cyberattacks and identity theft.
              </li>
            </ul>
            <p className="mt-4">
              We will also use personal information as we believe necessary or appropriate to comply with applicable
              laws, lawful requests, and legal process, such as to respond to subpoenas or requests from government
              authorities.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">With Your Consent</h3>
            <p>
              We will disclose your personal information in accordance with your prior direction or, in some cases, we
              may specifically ask you for your consent to collect, use, or share your personal information, such as
              when required by law.
            </p>
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

            <h3 className="text-xl font-medium mt-6 mb-3">Related Companies</h3>
            <p>
              We may share your personal information with our affiliates, subsidiaries, and other related companies.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Service Providers</h3>
            <p>
              We may share your personal information with third parties who perform services on our behalf that are
              necessary for the orderly operation of our business. For example, we work with service providers that help
              us perform website hosting, maintenance services, database management, analytics, payment processing,
              marketing, email marketing, customer relationship management, finances, and other purposes.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Advertising Partners</h3>
            <p>
              We may also share personal information with third parties who we partner with for advertising campaigns or
              that collect information about your activity on the Service for the purposes described in the
              &ldquo;Interest-Based Advertising&rdquo; section above.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Contest and Joint Marketing Partners</h3>
            <p>
              We may also share your personal information with other partners in order to provide you with content and
              other features through the Service, and such partners may send you promotional materials or otherwise
              contact you regarding products and services that they offer. When you choose to enter a contest or sign up
              for a promotion, if applicable, we may share the personal information you provide as part of the offer
              with the named co-sponsors or other third parties affiliated with such offer.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Professional Advisors</h3>
            <p>
              We may share personal information with persons, companies, or professional firms providing Financial
              Planner AI with advice and consulting in accounting, administrative, legal, tax, financial, debt
              collection, and other matters.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Law Enforcement, Government Authorities, and Private Parties
            </h3>
            <p>
              Under certain circumstances, we may be required to disclose personal information to law enforcement,
              government authorities, and other parties if required to do so by law or in response to valid requests by
              public authorities (e.g., a court or a government agency). We may also disclose personal information in
              the good faith belief that such action is necessary to comply with a legal obligation or for the purposes
              described above in the section titled &ldquo;For Compliance, Fraud Prevention, and Safety.&rdquo;
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Business Transaction Participants</h3>
            <p>
              We may disclose personal information to third parties in connection with any business transaction (or
              potential transaction) involving a merger, acquisition, sale of shares or assets, financing,
              consolidation, reorganization, divestiture, or dissolution of all or a portion of our business (including
              in connection with a bankruptcy or similar proceedings).
            </p>
          </section>

          {/* Your Choices */}
          <section className="mb-8">
            <h2 id="choices" className="text-2xl font-semibold mb-4">
              YOUR CHOICES
            </h2>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                <span className="font-medium">Review and Request Changes to Your Account Personal Information.</span> If
                you have a Financial Planner AI account, you can log into your account to review, delete, and make
                changes to certain personal information stored in your account. If you need to make a change and are
                unable to do this through your account settings, please email us using the contact information at the
                end of this Privacy Policy. We rely on you to update and correct the personal information contained in
                your account. Note that we may keep historical information in our backup files as permitted by law.
              </li>

              <li>
                <span className="font-medium">Marketing Emails.</span> You may opt-out of marketing-related emails by
                clicking the &ldquo;unsubscribe&rdquo; link at the bottom of the email or by contacting us as described
                below. You may still receive service-related communications, such as those relating to your account.
              </li>

              <li>
                <span className="font-medium">Text Messages.</span> We may offer communications via text messages sent
                by Financial Planner AI or any of our service providers. To stop receiving text messages from us, reply
                STOP to any text message you receive from us, or send your request and mobile telephone number to the
                email address listed at the end of this Privacy Policy. Note that we may send you a message to confirm
                receipt of your STOP request.
              </li>

              <li>
                <span className="font-medium">Cookies.</span> Most browsers let you remove and/or stop accepting cookies
                from the websites you visit. To do this, follow the instructions in your browser&apos;s settings. Many
                browsers accept cookies by default until you change your settings. If you do not accept cookies,
                however, you may not be able to use all functionality of the Site and it may not work properly. For more
                information about cookies, including how to see what cookies have been set on your browser and how to
                manage and delete them, visit{" "}
                <a href="http://www.allaboutcookies.org" className="text-primary hover:underline">
                  www.allaboutcookies.org
                </a>
                .
              </li>

              <li>
                <span className="font-medium">Analytics.</span> We use Google Analytics to help us analyze how our Site
                is being accessed and used. You can learn more about Google Analytics cookies by clicking{" "}
                <a
                  href="https://developers.google.com/analytics/resources/concepts/gaConceptsCookies"
                  className="text-primary hover:underline"
                >
                  here
                </a>{" "}
                and about how Google protects your data by clicking{" "}
                <a href="https://support.google.com/analytics/answer/6004245" className="text-primary hover:underline">
                  here
                </a>
                . To opt-out of Google Analytics, you can download and install the Google Analytics Opt-out Browser
                Add-on, available{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">
                  here
                </a>
                .
              </li>

              <li>
                <span className="font-medium">Advertising Choices.</span> You can limit the use of your information for
                interest-based advertising by blocking third-party cookies in your browser settings, using browser
                plug-ins/extensions, or using your mobile device settings to limit the use of the advertising ID
                associated with your mobile device. You can also opt out of interest-based ads from companies
                participating in the following industry opt-out programs by visiting:{" "}
                <ul className="list-none mt-2 space-y-2">
                  <li>
                    the Network Advertising Initiative (
                    <a
                      href="http://www.networkadvertising.org/managing/opt_out.asp"
                      className="text-primary hover:underline"
                    >
                      http://www.networkadvertising.org/managing/opt_out.asp
                    </a>
                    )
                  </li>
                  <li>
                    the Digital Advertising Alliance (
                    <a href="https://optout.aboutads.info" className="text-primary hover:underline">
                      https://optout.aboutads.info
                    </a>
                    )
                  </li>
                  <li>
                    the European Interactive Digital Advertising Alliance (
                    <a href="http://www.youronlinechoices.eu" className="text-primary hover:underline">
                      http://www.youronlinechoices.eu
                    </a>
                    )
                  </li>
                </ul>
              </li>
            </ul>

            <p className="mt-4">
              Some of the companies we work with may offer their own opt-out mechanisms. For example, you can learn more
              about how Google uses cookies for advertising purposes by clicking{" "}
              <a href="https://policies.google.com/technologies/ads" className="text-primary hover:underline">
                here
              </a>{" "}
              and opt-out of ad personalization by Google by clicking{" "}
              <a href="https://adssettings.google.com/authenticated" className="text-primary hover:underline">
                here
              </a>
              .
            </p>

            <p className="mt-4">
              Many of the opt-out preferences described in this section must be set on each device or browser for which
              you want them to apply. Please note that some of the advertising companies we work with may not
              participate in the opt-out mechanisms described above, so even after opting-out, you may still receive
              interest-based advertisements from other companies. If you opt-out of interest-based advertisements, you
              will still see advertisements online but they may be less relevant to you.
            </p>

            <p className="mt-4">
              <span className="font-medium">Do Not Track.</span> Some browsers may be configured to send &ldquo;Do Not
              Track&rdquo; signals to the online services that you visit. The Site currently does not respond to
              &ldquo;Do Not Track&rdquo; or similar signals. To find out more about &ldquo;Do Not Track,&rdquo; please
              visit{" "}
              <a href="http://www.allaboutdnt.com" className="text-primary hover:underline">
                http://www.allaboutdnt.com
              </a>
              .
            </p>
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

          {/* Third Party Websites and Services */}
          <section className="mb-8">
            <h2 id="third-party" className="text-2xl font-semibold mb-4">
              THIRD PARTY WEBSITES AND SERVICES
            </h2>
            <p>
              The Service may contain links to other websites and online services operated by third parties. These links
              are not an endorsement of, or representation that we are affiliated with, any third party. In addition,
              our content may be included on web pages or online services that are not associated with us. We do not
              control third party websites or online services, and we are not responsible for their actions. Other
              websites and services follow different rules regarding the collection, use, and sharing of your personal
              information. We encourage you to read the privacy policies of the other websites and online services you
              use.
            </p>
          </section>

          {/* Notice to California Residents */}
          <section className="mb-8">
            <h2 id="california" className="text-2xl font-semibold mb-4">
              NOTICE TO CALIFORNIA RESIDENTS (SHINE THE LIGHT LAW)
            </h2>
            <p>
              This section applies only to California residents. The California Consumer Privacy Act (CCPA) is a data
              protection law that ensures you have certain rights regarding the Personal Information we collect or
              maintain about you. Please note these rights are not absolute, and there may be cases when we decline your
              request as permitted by law.
            </p>
            <p className="mt-4">
              Under California Civil Code sections 1798.83-1798.84, California residents who have an established
              business relationship with Financial Planner AI are entitled to ask us for a notice describing what
              categories of personal information we share with third parties for the third parties&apos; direct
              marketing purposes. If you are a California resident and would like a copy of this notice, please submit
              your request to the email address listed at the end of this Privacy Policy with &ldquo;Shine the
              Light&rdquo; in the subject line.
            </p>
            <p className="mt-4">In addition, you also have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Right of Access:</span> you have the right to request that we disclose
                what Personal Information we have collected, used, and disclosed about you in the past 12 months.
              </li>
              <li>
                <span className="font-medium">Right of Deletion:</span> you have the right to request that we delete
                Personal Information collected or maintained by us, subject to certain exceptions.
              </li>
              <li>
                <span className="font-medium">Right to Non-Discrimination:</span> You have the right to not be
                discriminated against by us because you exercised any of your rights under the CCPA.
              </li>
            </ul>
          </section>

          {/* Notice to Nevada Residents */}
          <section className="mb-8">
            <h2 id="nevada" className="text-2xl font-semibold mb-4">
              NOTICE TO NEVADA RESIDENTS
            </h2>
            <p>
              Nevada Revised Statutes Chapter 603A allows Nevada residents to opt-out of the &ldquo;sale&rdquo; of
              certain types of personal information. Subject to several exceptions, Nevada law defines
              &ldquo;sale&rdquo; to mean the exchange of certain types of personal information for monetary
              consideration to another person. If you are a Nevada resident who wishes to exercise your
              &ldquo;sale&rdquo; opt-out rights, you may submit a request to us using the contact information listed at
              the end of this Privacy Policy.
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

