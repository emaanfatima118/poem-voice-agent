"use client"

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import AppBar from "./components/AppBar"
import PricingCard from "./components/PricingCard"
import SelectionSummary from "./components/SelectionSummary"
import PowerYourMarketingStack from "./components/PowerYourMarketingStack"
import Footer from "./components/Footer"

function Pricing() {
  const [selections, setSelections] = useState([])
  const [isVisible, setIsVisible] = useState({
    hero: false,
    pricingGrid: false,
    selectionSummary: false,
    finalCta: false,
    herotop: false,
  })

  // Animate hero on mount
  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 200)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-animate")
            if (id) {
              setIsVisible((prev) => ({ ...prev, [id]: true }))
            }
          }
        })
      },
      { threshold: 0.05, rootMargin: "100px 0px 100px 0px" }
    )

    const animatedElements = document.querySelectorAll("[data-animate]")
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

const handleSelectPlan = (name, price) => {
  setSelections((prev) => {
    // Extract feature name (works for “Stacked” and “Fully Stacked”)
    const featureName = name.replace(/( Stacked| Fully Stacked)$/, '').trim()

    // Check if exact plan already selected
    const exists = prev.find((item) => item.name === name)
    if (exists) {
      return prev.filter((item) => item.name !== name)
    }

    // Check if same feature plan selected
    const sameFeaturePlan = prev.find((item) => {
      const itemFeatureName = item.name.replace(/( Stacked| Fully Stacked)$/, '').trim()
      return itemFeatureName === featureName
    })

    if (sameFeaturePlan) {
      // Replace existing plan from same feature
      return prev.map((item) => {
        const itemFeatureName = item.name.replace(/( Stacked| Fully Stacked)$/, '').trim()
        if (itemFeatureName === featureName) {
          return { name, price }
        }
        return item
      })
    }

    // Add new plan
    return [...prev, { name, price }]
  })
}

  const isSelected = (name) => selections.some((item) => item.name === name)

  return (
    <div className="min-h-screen w-full bg-white">
       <style jsx>{`
         @keyframes fadeInUp {
           from {
             opacity: 0;
             transform: translateY(30px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
         
         @keyframes float {
           0%, 100% {
             transform: translateY(0px) scale(1.1);
           }
           50% {
             transform: translateY(-10px) scale(1.1);
           }
         }
         
         .floating-image {
           animation: float 3s ease-in-out infinite;
         }
         
         .ease-in-text {
           /* Animation removed - using transition-all instead */
         }
       `}</style>

      <AppBar />
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20 ">
        <section
          data-animate="herotop"
          className={`relative text-white py-24 sm:py-28 w-screen overflow-hidden ${
            isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{
            backgroundImage: "url('/pricing/dot-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
      }}
    >
      <div className={`relative max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 text-center transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="inline-block px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-1.5 sm:py-2 rounded-full border border-white bg-white/10 backdrop-blur-sm mb-4 sm:mb-5 md:mb-6">
          <p className="mb-0 font-medium text-sm sm:text-base text-white">
            Start your free 14-day trial today
          </p>
        </div>

        {/* Heading */}
        <h1
          className="font-bold max-w-6xl text-center mb-4 tracking-tight text-5xl sm:text-6xl md:text-7xl"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontWeight: 700,
            fontStyle: "bold",
            lineHeight: "84.34px",
            letterSpacing: "-3.05px",
          }}
        >
          Mix, Match, and Make it Your Own
        </h1>

        {/* Paragraph */}
        <p
          className="text-center max-w-4xl mx-auto mb-8"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "20.47px",
            lineHeight: "32.86px",
            letterSpacing: "0px",
            color: "#E5D9FA",
          }}
        >
          Stackwise is modular, flexible, and made to scale with you — whether
          you're flying solo, growing a small team, or focusing on the tool that
          matters most right now. Upgrade when you're ready, and never pay for
          what you don't need.
        </p>

        {/* Button */}
        <Link
          href="/stackwise-dashboard"
          className="px-12 sm:px-16 lg:px-20 xl:px-24 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white text-[#6218DF] inline-block text-center"
        >
          Start Stacking
        </Link>
      </div>
    </section>
        {/* Heading Section */}
        <div
          data-animate="hero"
          className={`transition-all duration-1000 ease-in-text text-center mb-12 py-16 sm:py-20 ${
            isVisible.hero
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <h2
            className="mx-auto leading-tight text-center"
            style={{
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 500,
              letterSpacing: "-2px",
              fontSize: "clamp(32px, 6vw, 56.32px)",
              lineHeight: "clamp(40px, 7vw, 65.82px)",
            }}
          >
            Stackwise Pricing & Plans
          </h2>

          <p
            className="max-w-3xl mx-auto mt-4 text-gray-600"
            style={{
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(16px, 2.5vw, 20.47px)",
              lineHeight: "clamp(26px, 4vw, 32.86px)",
              letterSpacing: "0px",
              textAlign: "center",
            }}
          >
            Pick any module on its own or combine multiple. Choose between the
            Stacked or Fully Stacked version for each. Click to select (or
            deselect) below. Bundle 2 or more modules and save 5%.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          data-animate="pricingGrid"
          className={`transition-all duration-1000 ease-in-text space-y-10 mb-12 ${
            isVisible.pricingGrid
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* First Row - Stacked Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <PricingCard
              badge="Most Popular"
              title="Pulse Hub Stacked"
              price={99}
              features={[
                "Marketing Audit & Performance",
                "Real-time Analytics",
                "Performance Tracking and custom KPIs",
                "AI Intelligence",
                "Roadmaps and Recommendations",
                "3 Users",
              ]}
              onSelect={() => handleSelectPlan("Pulse Hub Stacked", 99)}
              isSelected={isSelected("Pulse Hub Stacked")}
            />

            <PricingCard
              title="Brand Craft Stacked"
              price={79}
              features={[
                "Messaging Framework",
                "Content Strategy",
                "Keyword Research",
                "Content Creation",
                "3 Users",
              ]}
              onSelect={() => handleSelectPlan("Brand Craft Stacked", 79)}
              isSelected={isSelected("Brand Craft Stacked")}
            />

            <PricingCard
              badge="Most Popular"
              title="Flight Deck Stacked"
              price={59}
              features={[
                "Content & Campaign Calendar",
                "Multi-channel Distribution",
                "3 Users",
              ]}
              onSelect={() => handleSelectPlan("Flight Deck Stacked", 59)}
              isSelected={isSelected("Flight Deck Stacked")}
            />
          </div>

          {/* Second Row - Fully Stacked Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <PricingCard
              badge="Must Have for ABM"
              title="Pulse Hub Fully Stacked"
              price={229}
              features={[
                "Everything in Stacked",
                "ABM Command Center",
                "Competitor Analysis & Benchmarking",
                "Sales & Leadership Reports",
                "G2M",
                "Quarterly Strategy Call",
                "5 Users",
              ]}
              onSelect={() =>
                handleSelectPlan("Pulse Hub Fully Stacked", 229)
              }
              isSelected={isSelected("Pulse Hub Fully Stacked")}
            />

            <PricingCard
              badge="Most Popular"
              title="Brand Craft Fully Stacked"
              price={149}
              features={[
                "Everything in Stacked",
                "Campaign Builder",
                "Content Audit & Gap Analysis",
                "Brand Voice Enforcement",
                "Competitor Content Analysis",
                "Thought Leadership & Executive Visibility",
                "Quarterly Strategy Call",
                "5 Users",
              ]}
              onSelect={() =>
                handleSelectPlan("Brand Craft Fully Stacked", 149)
              }
              isSelected={isSelected("Brand Craft Fully Stacked")}
            />

            <PricingCard
              title="Flight Deck Fully Stacked"
              price={129}
              features={[
                "Everything in Stacked",
                "Asset Management",
                "Collab Tools & Workflows",
                "Campaign Insights",
                "Personalization Engine",
                "Quarterly Strategy Call",
                "5 Users",
              ]}
              onSelect={() => handleSelectPlan("Flight Deck Fully Stacked", 129)}
              isSelected={isSelected("Flight Deck Fully Stacked")}
            />
          </div>
        </div>

        {/* Selection Summary */}
        <div
          data-animate="selectionSummary"
          className={`transition-all duration-1000 ease-in-text max-w-md mx-auto ${
            isVisible.selectionSummary
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <SelectionSummary selections={selections} />
        </div>
      </main>

      {/* Final CTA + Footer */}
      <PowerYourMarketingStack
        isVisible={isVisible.finalCta}
        dataAnimate="finalCta"
      />
      <Footer />
    </div>
  )
}

export default Pricing
