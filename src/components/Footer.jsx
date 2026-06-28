"use client"

import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-8 py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-5 gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
          <div>
            <img src="/full-logo.svg" alt="Stackwise" className="h-8 sm:h-10 mb-4" />
          </div>

          <div>
            <h4 className="font-bold mb-3 lg:mb-4 text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl">Product</h4>
            <ul className="space-y-1.5 lg:space-y-2 text-sm sm:text-base md:text-base text-gray-600">
              <li>
                <Link 
                  href="/pulse-hub" 
                  className="hover:text-purple-600"
                  onClick={() => {
                    // Scroll to top when navigating to Pulse Hub
                    window.scrollTo(0, 0);
                  }}
                >
                  Pulse Hub
                </Link>
              </li>
              <li>
                <Link 
                  href="/brand-craft" 
                  className="hover:text-purple-600"
                  onClick={() => {
                    // Scroll to top when navigating to Brand Craft
                    window.scrollTo(0, 0);
                  }}
                >
                  Brand Craft
                </Link>
              </li>
              <li>
                <Link 
                  href="/flight-deck" 
                  className="hover:text-purple-600"
                  onClick={() => {
                    // Scroll to top when navigating to Flight Deck
                    window.scrollTo(0, 0);
                  }}
                >
                  Flight Deck
                </Link>
              </li>
              <li>
              <Link href="/pricing" className="hover:text-purple-600">
  Pricing
</Link>

              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 lg:mb-4 text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl">Company</h4>
            <ul className="space-y-1.5 lg:space-y-2 text-sm sm:text-base md:text-base text-gray-600">
              <li>
                <button className="hover:text-purple-600 text-left">
                  JPMG
                </button>
              </li>
              <li>
                <button className="hover:text-purple-600 text-left">
                  About Jen Picardo
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 lg:mb-4 text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl">Support</h4>
            <ul className="space-y-1.5 lg:space-y-2 text-sm sm:text-base md:text-base text-gray-600">
              <li>
                <button className="hover:text-purple-600 text-left">
                  Manage Subscription
                </button>
              </li>
              <li>
                <button className="hover:text-purple-600 text-left">
                  Account Profile
                </button>
              </li>
              <li>
                <button className="hover:text-purple-600 text-left">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <button
              className="mt-6 lg:mt-8 px-8 sm:px-12 lg:px-16 py-2 rounded-full text-white text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-105 flex items-center gap-2"
              style={{ backgroundColor: "#6218DF" }}
            >
              Contact
              <img src="/arrow-right.png" alt="Arrow" className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="border-t mt-6 lg:mt-8 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm md:text-base text-gray-600">
            <p className="text-sm sm:text-base md:text-base text-gray-600 pr-0 sm:pr-8 lg:pr-20">
              Stackwise is owned and operated by Jen Picardo Marketing Group LLC.
            </p>
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4">
              <button className="text-black hover:text-purple-600 text-left text-sm sm:text-base md:text-base">
                Privacy Policy
              </button>
              <button className="text-black hover:text-purple-600 text-left text-sm sm:text-base md:text-base">
                Terms of use
              </button>
              <span className="text-black text-sm sm:text-base md:text-base">Jen Picardo Marketing Group LLC © 2025</span>
            </div>
          </div>
          <div className="flex space-x-3 sm:space-x-4 mt-4 md:mt-0">
            <button className="hover:scale-110 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(98,24,223,0.8)]">
              <img src="/facebook-footer.png" alt="Facebook" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="hover:scale-110 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(98,24,223,0.8)]">
              <img src="/linkedin-footer.png" alt="LinkedIn" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="hover:scale-110 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(98,24,223,0.8)]">
              <img src="/twitter-footer.png" alt="Twitter" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
