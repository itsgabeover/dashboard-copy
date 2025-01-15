'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ChatInterface } from '@/components/ChatInterface'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/mission', label: 'About' },
    { href: '/resources', label: 'Resources' }
  ]

  const isActivePath = (path: string) => pathname === path

  return (
    <>
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 text-base transition-colors duration-200 
                    ${isActivePath(link.href) 
                      ? 'text-[#4B6FEE] font-semibold' 
                      : 'text-gray-600 hover:text-[#4B6FEE]'
                    }
                    group
                  `}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#4B6FEE] transform origin-left transition-transform duration-200 
                      ${isActivePath(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `}
                  />
                </Link>
              ))}

              {/* Chat with Sage Button */}
              <button
                onClick={() => setShowChat(true)}
                className="bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path 
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.87279 20C9.10904 20.6391 10.5124 21 12 21Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Chat with Sage
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Modified for better visibility */}
          {isOpen && (
            <div className="md:hidden border-t border-border">
              <div className="px-4 py-2 space-y-1 bg-white shadow-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 text-base transition-colors duration-200 rounded-md
                      ${isActivePath(link.href)
                        ? 'text-[#4B6FEE] font-semibold bg-blue-50'
                        : 'text-gray-600 hover:text-[#4B6FEE] hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Chat Button */}
                <button
                  onClick={() => {
                    setShowChat(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white rounded-full px-6 py-2 flex items-center justify-center gap-2 my-2"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path 
                      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.87279 20C9.10904 20.6391 10.5124 21 12 21Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  Chat with Sage
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Chat Interface */}
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
    </>
  )
}
