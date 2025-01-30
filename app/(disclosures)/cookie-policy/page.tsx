import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Financial Planner AI",
  description: "Financial Planner AI cookie policy, effective January 1, 2025",
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>

          <div className="text-sm text-muted-foreground mb-8">Effective: January 1, 2025</div>

          {/* Introduction */}
          <section className="mb-8">
            <p>
              By using our website{" "}
              <a 
                href="https://www.lifeinsuranceplanner-ai.com/"
                className="text-primary hover:underline break-words"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.lifeinsuranceplanner-ai.com/
              </a>
              , you consent to the use of cookies in accordance with this Cookies Policy.
            </p>
            
            <p>
              You will have seen a pop-up to this effect on your first visit to this website. It may not appear on
              subsequent visits, but you may withdraw your consent at any time by following the instructions below.
            </p>
          </section>

          {/* What are Cookies */}
          <section className="mb-8">
            <h2 id="what-are-cookies" className="text-2xl font-semibold mb-4">
              What are Cookies?
            </h2>
            <p>
              A cookie is a text-only string of information that the Services transfer to the &ldquo;cookie&rdquo; file
              of the browser you are using so that the Services can recognize your computer when you re-visit and
              remember certain information about you, such as which pages you visit, choices you make from menus, and
              the time and date of your visit.
            </p>
          </section>
            {/* Types of Cookies */}
          <section className="mb-8">
            <h2 id="types-of-cookies" className="text-2xl font-semibold mb-4">
              Types of Cookies
            </h2>
            <p>Our website uses three types of cookies:</p>
            
            <div className="space-y-4 mt-4">
              <div>
                <p>
                  <span className="font-medium">(i) Session cookies:</span> these are temporary cookies that expire
                  when you close your browser. Session cookies allow the Services to recognize your computer as you
                  navigate between pages during a single browser session, allowing you to use the Services most
                  efficiently.
                </p>
              </div>

              <div>
                <p>
                  <span className="font-medium">(ii) Persistent cookies:</span> these are stored on your computer
                  between browsing sessions until they expire or are deleted. They allow the Services to remember your
                  preferences and tailor services to you.
                </p>
              </div>

              <div>
                <p>
                  <span className="font-medium">(iii) Web beacons:</span> Pages of our website and our emails may
                  contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags,
                  and single-pixel gifs) that permit us, for example, to count users who have visited those pages
                  and for other related website statistics (for example, recording the popularity of certain website
                  content and verifying system and server integrity).
                </p>
              </div>
            </div>
          </section>

          {/* Analytics Information */}
          <section className="mb-8">
            <h2 id="analytics-information" className="text-2xl font-semibold mb-4">
              Information Collected by our Analytics Software
            </h2>
            <p>
              Some of the cookies we use are &lsquo;analytical&rsquo; cookies. Our analytics software (Google
              Analytics, Facebook Pixel and LinkedIn) allows us to recognize and count the number of visitors and
              to see how visitors move around the Services when they are using the Services. This helps us to
              improve the way the Services work, e.g., by making sure that users are finding what they need easily.
            </p>

            <p className="mt-4">
              The following types of information are collected by our analytics software:
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                User&apos;s demographic information, e.g., language preference and location (city,
                country/territory, continent, sub-continental region).
              </li>
              <li>
                User&apos;s behavior, e.g., whether the user is a new or returning visitor, the frequency of
                visits/date of last visit.
              </li>
              <li>
                User&apos;s technology, e.g., operating system, network/service provider (ISP and network host).
              </li>
              <li>
                Mobile information, e.g. whether the user accessed the Services via a mobile device and, if so,
                the type of device (brand, service provider, operating system and input selection method).
              </li>
              <li>
                Traffic source, e.g., direct (i.e., the user typed in the URL themselves) or referral (i.e., the
                user clicked on a link) and for referral traffic, the traffic source (search engine or link);
                also the Google search term (if applicable) that resulted in the link to the Website.
              </li>
              <li>
                Content viewed, e.g., pages, files, and directories clicked on, landing pages/exit pages and
                search words (if any) used on the Website.
              </li>
            </ul>
          </section>
            {/* Changing Cookie Settings */}
          <section className="mb-8">
            <h2 id="cookie-settings" className="text-2xl font-semibold mb-4">
              Changing your cookie settings
            </h2>
            <p>
              Please note that internet browsers allow you to change your cookie settings. These settings are
              usually found in the &lsquo;options&rsquo; or &lsquo;preferences&rsquo; menu of your internet
              browser. In order to understand these settings, the following links may be helpful. Otherwise you
              should use the &lsquo;Help&rsquo; option in your internet browser for more details.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <a 
                  href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" 
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie settings in Internet Explorer
                </a>
              </li>
              <li>
                <a 
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie settings in Firefox
                </a>
              </li>
              <li>
                <a 
                  href="https://support.google.com/chrome/answer/95647"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie settings in Chrome
                </a>
              </li>
              <li>
                <a 
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie settings in Safari
                </a>
              </li>
            </ul>
          </section>

          {/* Disabling Cookies */}
          <section className="mb-8">
            <h2 id="disabling-cookies" className="text-2xl font-semibold mb-4">
              Disabling cookies
            </h2>
            <p>
              If you do not want information collected through the use of cookies, please disable them by following
              the instructions for your browser. Information about the procedure you are required to follow in
              order to disable cookies can be found on{" "}
              <a 
                href="https://www.allaboutcookies.org/manage-cookies/index.html"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.allaboutcookies.org/manage-cookies/index.html
              </a>
              .
            </p>

            <p className="mt-4">
              After your initial visit to this website we may change the cookies we use. This cookies policy will
              always allow you to know who is placing cookies, for what purpose and give you the means to disable
              them so you should check it from time to time.
            </p>

            <p className="mt-4">
              Please be aware that if cookies are disabled not all features of the Services may operate as
              intended.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mt-12 border-t pt-8">
            <h2 id="contact" className="text-2xl font-semibold mb-4">
              Contact for More Information
            </h2>
            <p>
              If you have any questions about Financial Planner AI, LLC&apos;s cookies policies and practices,
              please send an email to:{" "}
              <a 
                href="mailto:rpc@financialplanner-ai.com"
                className="text-primary hover:underline"
              >
                rpc@financialplanner-ai.com
              </a>
              .
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
