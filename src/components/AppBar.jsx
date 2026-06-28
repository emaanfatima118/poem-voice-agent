"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const AppBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const navRef = useRef(null)
  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) {
        setIsMenuOpen(false)
        setIsProductsOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsProductsOpen(false)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsProductsOpen(false)
  }

  const handleNavigation = () => {
    window.scrollTo(0, 0)
    closeMenu()
  }

  return (
    <>
    <nav ref={navRef} className="bg-white/80 backdrop-blur-md sticky top-0 z-[9999]">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 z-50">
          <Link 
            href="/" 
            className="flex items-center"
            onClick={handleNavigation}
          >
            <img 
              src="/full-logo.svg" 
              alt="Stackwise Logo"
              className="h-7 sm:h-9 md:h-10 w-auto"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <div className="relative group">
            <button className="text-gray-700 text-sm md:text-base flex items-center hover:text-purple-600 transition-colors">
              Products
              <img src="/arrow-down.png" alt="dropdown" className="w-3 h-2 ml-1 mt-1" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999999] pointer-events-auto">
              <div className="py-2">
                <Link href="/pulse-hub" className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleNavigation}>
                  <span className="text-sm font-medium">Pulse Hub</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
                <div className="border-t border-gray-100"></div>
                <Link href="/brand-craft" className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleNavigation}>
                  <span className="text-sm font-medium">Brand Craft</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
                <div className="border-t border-gray-100"></div>
                <Link href="/flight-deck" className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleNavigation}>
                  <span className="text-sm font-medium">Flight Deck</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
                <div className="border-t border-gray-100"></div>
                <Link href="/strategy-studio" className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleNavigation}>
                  <span className="text-sm font-medium">Strategy Studio</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
          <Link href="/pricing" className="text-gray-700 text-sm md:text-base hover:text-purple-600 transition-colors duration-300" onClick={handleNavigation}>Pricing</Link>
          <button className="text-gray-700 text-sm md:text-base hover:text-purple-600 transition-colors duration-300">Contact</button>
        </div>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex items-center space-x-3 md:space-x-4 z-50">
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-[#6218DF] transition-colors text-sm md:text-base px-3 py-2"
            onClick={handleNavigation}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-4 md:px-6 py-2 rounded-full text-white text-sm md:text-base transition-all duration-300 hover:opacity-95 hover:scale-105"
            style={{ backgroundColor: '#6218DF' }}
            onClick={handleNavigation}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-50 text-gray-700 hover:text-purple-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>

      {/* Mobile Menu - Outside nav element */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed left-0 right-0 bg-white shadow-lg z-[9998] transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 pointer-events-none'
        }`}
        style={{ top: `${navHeight}px` }}
      >
        <div className="px-4 py-4 space-y-1">
          {/* Products Section */}
          <div className="border-b border-gray-100 pb-3">
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="flex items-center justify-between w-full text-gray-700 hover:text-purple-600 transition-colors py-3"
            >
              <span className="text-base font-medium">Products</span>
              <img 
                src="/arrow-down.png" 
                alt="dropdown" 
                className={`w-3 h-2 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isProductsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-1 pl-4">
                <Link
                  href="/pulse-hub"
                  className="flex items-center justify-between py-2.5 text-gray-600 hover:text-purple-600 transition-colors"
                  onClick={handleNavigation}
                >
                  <span className="text-sm">Pulse Hub</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
                <Link
                  href="/brand-craft"
                  className="flex items-center justify-between py-2.5 text-gray-600 hover:text-purple-600 transition-colors"
                  onClick={handleNavigation}
                >
                  <span className="text-sm">Brand Craft</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
                <Link
                  href="/flight-deck"
                  className="flex items-center justify-between py-2.5 text-gray-600 hover:text-purple-600 transition-colors"
                  onClick={handleNavigation}
                >
                  <span className="text-sm">Flight Deck</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
                <Link
                  href="/strategy-studio"
                  className="flex items-center justify-between py-2.5 text-gray-600 hover:text-purple-600 transition-colors"
                  onClick={handleNavigation}
                >
                  <span className="text-sm">Strategy Studio</span>
                  <img src="/full-vector.png" alt="arrow" className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Other Menu Items */}
          <Link
            href="/pricing"
            className="block py-3 text-gray-700 hover:text-purple-600 transition-colors text-base font-medium border-b border-gray-100"
            onClick={handleNavigation}
          >
            Pricing
          </Link>
          <button className="block w-full text-left py-3 text-gray-700 hover:text-purple-600 transition-colors text-base font-medium border-b border-gray-100">
            Contact
          </button>

          {/* Mobile Auth Buttons */}
          <div className="pt-4 space-y-3">
            <Link
              href="/login"
              className="w-full py-2.5 text-gray-700 hover:text-[#6218DF] transition-colors text-base font-medium border border-gray-200 rounded-full block text-center"
              onClick={handleNavigation}
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="w-full py-2.5 rounded-full text-white text-base font-medium transition-all duration-300 hover:opacity-95 block text-center"
              style={{ backgroundColor: '#6218DF' }}
              onClick={handleNavigation}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppBar