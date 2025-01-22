'use client'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#4B6FEE] mb-3 md:mb-4">
              Insurance Planner AI (IP-AI)
            </h3>
            <p className="text-text-light text-sm md:text-base">
              IP-AI is a proprietary AI-driven service provided by Financial Planner AI, LLC.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#4B6FEE] mb-3 md:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Why Review?
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#4B6FEE] mb-3 md:mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/trust" 
                  className="text-text-light hover:text-text block py-2 md:py-0"
                >
                  Customer Subscription Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 md:mt-8 md:pt-8 border-t border-border text-center">
          <p className="text-text-light text-sm md:text-base">
            © {new Date().getFullYear()} Financial Planner AI, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

