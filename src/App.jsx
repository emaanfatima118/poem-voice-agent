"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import AppBar from './components/AppBar'
import Footer from './components/Footer'
import PowerYourMarketingStack from './components/PowerYourMarketingStack'

const StackwiseLanding = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState({
    hero: true,
    heroText: true,
    heroButtons: true,
    dashboard: false,
    integrations: false,
    aiSection: false,
    platformModules: false,
    whyStackwise: false,
    smarterMarketing: false,
    testimonials: false,
    founderSection: false,
    finalCta: false,
  })

  const [hoveredModule, setHoveredModule] = useState(null)

  useEffect(() => {
    // Set mounted to prevent SSR flicker
    setIsMounted(true);
    
    // Only run animations on client-side
    if (typeof window === 'undefined') return;

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
      {
        threshold: 0.05,
        rootMargin: "100px 0px 100px 0px",
      },
    )

    const animatedElements = document.querySelectorAll("[data-animate]")
    animatedElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const logos = [
    '/integrations/Facebook.svg',
    '/integrations/Google.svg',
    '/integrations/Hubspot.svg',
    '/integrations/Marketo.svg',
    '/integrations/salesforce.svg',
    '/integrations/stripe.svg',
    '/integrations/openai.svg',
    '/integrations/Hootsuite.svg',
    '/integrations/6sense.svg',
    '/integrations/ahrefs.svg',
    '/integrations/eloqua.svg',
    '/integrations/salesforce pardot.svg',
    '/integrations/propensity.svg',
    '/integrations/rollworks.svg',
    '/integrations/semrush.svg',
    '/integrations/sproutsocial.svg',
    '/integrations/stackadapt.svg',
    '/integrations/terminus.svg',
    '/integrations/canva1.svg'
  ];

  const logoNames = [
    'Facebook',
    'Google',
    'HubSpot',
    'Marketo', 
    'Salesforce',
    'Stripe',
    'OpenAI',
    'Hootsuite',
    '6sense',
    'Ahrefs',
    'Eloqua',
    'Pardot',
    'Propensity',
    'Rollworks',
    'SEMrush',
    'Sprout Social',
    'StackAdapt',
    'Terminus',
    'Canva'
  ];

  const testimonials = [
    {
      name: "Michael Hayes",
      role: "Chief Executive Officer",
      text: "Stackwise platform is perfect for scaling outreach. The lead database is vast. The AI tools are spot-on, and the warmup ensures all emails land in inboxes. It's an invaluable resource for growing our business without extra overhead.",
    },
    {
      name: "May Capablno",
      role: "Marketing Manager, SaaS Startup",
      text: "It's alone saved me hours each week. It feels like having a strategist on call.",
    },
    {
      name: "Doris Johns",
      role: "Chief Marketing Officer",
      text: "Stackwise's platform is perfect for scaling outreach. The lead database is vast, the AI tools are spot-on, and the warmup ensures all emails land in inboxes. It's an invaluable resource for growing our business without extra overhead.",
    },
    {
      name: "Jimmy Murphy",
      role: "Marketing Associate, Consulting Firm",
      text: "As a one-person marketing team, I was drowning in tools and to-do lists. Stackwise gave me structure — the insights from Pulse Hub alone saved me hours each week. It feels like having a strategist on call.",
    },
    {
      name: "Daniel Forbes",
      text: "Our three-person marketing team was constantly juggling campaigns without a clear roadmap. With Stackwise, we finally have the tools to help us prioritize activities actually moves the needle.",
    },
    {
      name: "Olivia Bradley",
      text: "Stackwise's comprehensive lead database has helped us connect with more clients in weeks than ever before. The platform is intuitive, and the results have been truly impressive!",
    },
  ]

  return (
    <div className="min-h-screen w-full bg-white">
      <style jsx>{`
        /* Replace your existing animation styles with these optimized versions */

@keyframes scrollUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

@keyframes popupIn {
  0% { opacity: 0; transform: scale(0.94); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(98, 24, 223, 0.3); }
  50% { box-shadow: 0 0 40px rgba(98, 24, 223, 0.5), 0 0 60px rgba(98, 24, 223, 0.3); }
}

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

/* FIXED: Add will-change and backface-visibility for iOS */
.ease-in-text {
  will-change: opacity, transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

/* FIXED: Only animate elements that start hidden (scroll-triggered) */
.ease-in-text:not(.opacity-100) {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* FIXED: Prevent animation from running on visible elements */
.ease-in-text.opacity-100 {
  animation: none !important;
  opacity: 1;
  transform: translateY(0);
}

.testimonials-container {
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
}

.testimonials-track {
  animation: scrollUp 30s linear infinite;
}

.testimonials-track:hover {
  animation-play-state: paused;
}

.floating-image {
  animation: float 3s ease-in-out infinite;
}

.glow-hover:hover {
  animation: glow 2s ease-in-out infinite;
}

.dashboard-popup {
  animation: popupIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
  will-change: opacity, transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* FIXED: Make sure dashboard animation doesn't flicker */
.dashboard-popup.opacity-100 {
  animation: none !important;
  opacity: 1;
  transform: scale(1);
}

.purple-card-glow:hover .chart-container {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.purple-card:hover .chart-container {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.chart-container {
  transition: all 0.3s ease;
}

.purple-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
}

body {
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

/* FIXED: Remove conflicting data-animate styles */
[data-animate] {
  /* Don't set initial opacity/transform here - let the component handle it */
}

[data-animate].opacity-100 {
  opacity: 1;
  transform: translateY(0);
}
      `}</style>

      <AppBar />


    <div 
      className="w-full"
      style={{ 
        backgroundImage: 'url("/top-bg-gradient.png")',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0
      }}
    >
      {/* Hero Section */}
      <section className="text-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div
            className={`ease-in-text ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
          
            <div className="inline-block px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full border-2 border-[#6218DF]/20 mb-4 sm:mb-5 md:mb-6 relative z-10" style={{ color: '#05051fff' }}>
              <p className="mb-0 font-medium text-sm sm:text-base" style={{ color: '#6218DF' }}>
                Start your free 14-day trial today
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: '#12122B' }}>
              The Marketing Stack That{' '}
              <span style={{ color: '#6218DF' }}>Works For You</span>
            </h1>
          </div>

          <div
            className={`ease-in-text ${isVisible.heroText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-4">
              Stackwise integrates with your tools to track performance, guide strategy, and streamline execution.
            </p>
          </div>

         <div className="flex justify-center">
            <a
              href="https://share-na2.hsforms.com/131RweUMoR1-tpigPr-l6Ew40e0ev"
              className="ease-in-text px-12 sm:px-16 md:px-24 py-3 sm:py-3.5 md:py-4 rounded-full hover:scale-105 hover:shadow-xl text-center"
              style={{ 
                backgroundColor: '#6218DF', 
                color: '#fff',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontWeight: 500,
                fontSize: '21px',
                lineHeight: 'Line Height/base',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              Join our Waitlist
            </a>
            </div>
        </div>
      </section>

      {/* Dashboard Preview */}
        <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 relative">
          {/* <div className="sm:max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-7xl mx-auto relative z-10"> */}
            <div 
              data-animate="dashboard"
              className={`px-5 sm:px-8 md:px-16 lg:px-20 xl:px-24 2xl:px-28 ${isVisible.dashboard ? 'dashboard-popup' : 'opacity-0 scale-75' }`}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] cursor-pointer group max-w-[1100px] md:max-w-[1200px] lg:max-w-[1300px] mx-auto">
                <div className="relative flex justify-center">
                  <img 
                    src="/main_dashboard.svg" 
                    alt="Stackwise Dashboard Preview"
                    className="w-full h-auto max-w-[1100px] md:max-w-[1200px] lg:max-w-[1300px]"
                    style={{ transform: 'scale(1)', transformOrigin: 'center' }}
                  />
                </div>
              </div>
            </div>
          {/* </div> */}
        </section>

      {/* Available Integrations */}
      <section className="px-8 py-16 relative">
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-60 pointer-events-none z-0"
          style={{
            backgroundImage: 'url("/dot-pattern.png")',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            backgroundSize: 'auto'
          }}
        ></div>
        <div className="relative z-10">
          <div 
            data-animate="integrations"
            className={`transition-all duration-700 ease-out ${isVisible.integrations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <h2 className="text-3xl sm:text-xl font-bold text-center mb-12 text-white">
              Available integrations
            </h2>
            
            <div className="relative overflow-hidden">
              <style dangerouslySetInnerHTML={{
  __html: `
    @keyframes infiniteScroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    .scroll-container {
      mask-image: linear-gradient(
        to right,
        transparent 0%,
        black 8%,
        black 92%,
        transparent 100%
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent 0%,
        black 8%,
        black 92%,
        transparent 100%
      );
      overflow: hidden;
      position: relative;
    }

    .scroll-track {
      animation: infiniteScroll 25s linear infinite;
      will-change: transform;
      white-space: nowrap;
      display: flex;
      align-items: center;
      width: fit-content;
    }

    .scroll-track:hover {
      animation-play-state: paused;
    }

    .logo-item {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 200px;
      margin: 0 32px;
      flex-shrink: 0;
      padding: 15px;
      overflow: visible;
    }

    .logo-item img {
      max-width: 130px;
      max-height: 45px;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    /* Slightly larger, wide logos (normalize to medium) */
     .logo-item img[alt*="hootsuite" i],
     .logo-item img[alt*="marketo" i]{
       height: 45px !important;
       max-height: 45px !important;
       width: auto !important;
       max-width: 200px !important;
     }
     .logo-item img[alt*="Sprout Social"] {
       height: 60px !important;
       max-height: 60px !important;
       width: auto !important;
       max-width: 200px !important;
     }
    /* Medium / balanced logos */
     .logo-item img[alt*="salesforce" i],
     .logo-item img[alt*="pardot" i],
     .logo-item img[alt*="propensity" i] {
       max-width: 180px !important;
       max-height: 60px !important;
     }
     /* Facebook at medium */
     .logo-item img[alt*="Facebook"] {
       height: 32px !important;
       max-height: 32px !important;
       width: auto !important;
       max-width: 180px !important;
     }

     /* Smaller / tall logos that need to shrink a bit */
     .logo-item img[alt*="canva" i] {
       width: 90px !important;
       height: 30px !important;
     }
     /* Ensure SEMrush is medium */
     .logo-item img[alt*="SEMrush"],
     {
       height: 40px !important;
       max-height: 40px !important;
       width: auto !important;
       max-width: 180px !important;
     }

    .logo-item img[alt*="ahrefs" i],
    .logo-item img[alt*="6sense" i],
    .logo-item img[alt*="eloqua" i] {
      width: 100px !important;
      height: 35px !important;
    }

    .logo-text {
      color: white;
      font-size: 12px;
      font-weight: 500;
      margin-left: 12px;
      text-align: left;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }

    .logo-item:hover .logo-text {
      opacity: 1;
    }

      [data-animate] {
    opacity: 0;
    transform: translateY(30px);
  }
  
  [data-animate].opacity-100 {
    opacity: 1;
    transform: translateY(0);
  }
  `
}} />

              
              <div className="scroll-container">
                <div className="scroll-track">
                  {/* First complete set */}
                  {logos.map((logo, index) => (
                    <div key={`set1-${index}`} className="logo-item">
                      <img 
                        src={logo} 
                        alt={logoNames[index]} 
                        className="h-12 opacity-90 hover:opacity-100 transition-all duration-300 filter brightness-0 invert hover:scale-110" 
                      />
                    </div>
                  ))}
                  
                  {/* Second set for seamless loop */}
                  {logos.map((logo, index) => (
                    <div key={`set2-${index}`} className="logo-item">
                      <img 
                        src={logo} 
                        alt={logoNames[index]} 
                        className="h-12 opacity-90 hover:opacity-100 transition-all duration-300 filter brightness-0 invert hover:scale-110" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
</div>

    <section className="px-8 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
       <div className="grid lg:grid-cols-2 gap-12 items-center mb-30">
  {/* Left side text */}
  <div className="max-w-3xl">
    <div className="space-y-2 text-left text-5xl md:text-6xl">
      <h2
        style={{
          color: "#12122B",
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: 700,
          lineHeight: "65.03px",
          letterSpacing: "-1.98px",
        }}
      >
        Powered by AI.
      </h2>
      <h2
        style={{
          color: "#6218DF",
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: 700,
          lineHeight: "65.03px",
          letterSpacing: "-1.98px",
        }}
      >
        Designed for Marketers.
      </h2>
      <p
        className="text-gray-600 leading-relaxed"
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: 400,
          fontSize: "25px",
          lineHeight: "28.82px",
        }}
      >
        Drive pipeline growth and revenue by assessing your marketing performance,
        sharpening your strategy, and turning insight into action.
      </p>
    </div>
  </div>

  {/* Right side image */}
  <div className="relative h-[400px] lg:h-[500px] lg:ml-6 mb-25 -mx-8 sm:-mx-12 lg:-mr-[calc(50vw-100%)]">
  <img
    src="/powered-by-ai-designed-for-makers.svg"
    alt="Annual Analytics"
    className="w-full h-full object-contain"
  />
  </div>

</div>

        <div className="text-left mb-12 mt-32 text-5xl md:text-6xl">
          <h2 
            className="mb-2" 
            style={{ 
              color: "#12122B",
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 700,
              lineHeight: '65.03px',
              letterSpacing: '-1.98px'
            }}
          >
            Prioritize The Work That Actually
          </h2>
          <h2 
            className="mb-6" 
            style={{ 
              color: "#12122B",
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 700,
              lineHeight: '65.03px',
              letterSpacing: '-1.98px'
            }}
          >
            Drives  <span className="works-text" style={{ color: '#6218DF' }}>Revenue and Impact.</span>
          </h2>
          <p 
            className="text-left text-gray-600 max-w-3xl leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 400,
              fontSize: '25px',
              lineHeight: '28.82px',
              letterSpacing: '0px'
            }}
          >
            Get instant visibility into what's working, what's not, and where to focus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="purple-card purple-card-glow rounded-2xl text-white relative overflow-hidden min-h-[500px] sm:min-h-[550px] md:min-h-[430px] lg:min-h-[400px] xl:min-h-[430px]" style={{ backgroundColor: '#6218DF', padding: '24px' }}>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">AI Power, Human Control</h3>
              <p className="text-purple-100 text-lg pr-4">
                Get instant visibility into what's working, what's not, and where to focus.
              </p>
            </div>

            <img
              src="/ai-power-human-control.png"
              alt="AI Power Human Control"
              className="chart-container absolute bottom-0 right-0 rounded-tl-lg rounded-br-2xl"
              style={{ width: '95%', height: 'auto' }}
            />
          </div>
          
          <div className="purple-card purple-card-glow rounded-2xl text-white relative overflow-hidden min-h-[500px] sm:min-h-[550px] md:min-h-[430px] lg:min-h-[400px] xl:min-h-[430px]" style={{ backgroundColor: '#6218DF', padding: '24px' }}>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Insights Into Actions</h3>
              <p className="text-purple-100 text-lg pr-4">Turn data into campaigns that drive real results.</p>
            </div>

            <img
              src="/insights-into-actions.png"
              alt="Visitor Bar Chart"
              className="chart-container absolute bottom-0 right-0 rounded-tl-lg rounded-br-2xl"
              style={{ width: '95%', height: 'auto' }}
            />
          </div>

          <div className="purple-card purple-card-glow rounded-2xl text-white relative overflow-hidden min-h-[500px] sm:min-h-[550px] md:min-h-[430px] lg:min-h-[400px] xl:min-h-[430px]" style={{ backgroundColor: '#6218DF', padding: '24px'}}>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Results You Can See</h3>
              <p className="text-purple-100 text-lg pr-4">Track performance, measure impact, and optimize with confidence.</p>
            </div>

            <img
              src="/results-you-can-see.png"
              alt="Results Dashboard"
              className="chart-container absolute bottom-0 right-0 rounded-tl-lg rounded-br-2xl"
              style={{ width: '95%', height: 'auto'}}
            />
          </div>
        </div>
      </div>
    </section>

<section className="px-8 py-20 bg-white">
  <div className="max-w-7xl mx-auto">
    <div
      data-animate="platformModules"
      className={`transition-all duration-700 ease-out ${isVisible.platformModules ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      <div className="text-left text-5xl md:text-6xl ">
        <h2 
          className="mb-2" 
          style={{ 
            color: "#12122B",
            fontFamily: 'Helvetica Neue, sans-serif',
            fontWeight: 700,
            lineHeight: '65.03px',
            letterSpacing: '-1.98px'
          }}
        >
          Explore the <span style={{ color: "#6218DF" }}>Platform</span>
        </h2>
      </div>
      <p 
        className="text-gray-600 mb-12"
        style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 400,
          fontSize: '25px',
          lineHeight: '28.82px',
          letterSpacing: '0px'
        }}
      >
        Three modules. Endless flexibility. Start simple or go fully stacked.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Pulse Hub",
            icon: "/pulse-hub.png",
            description:
              "Assess your marketing performance across 9 core areas. Surface quick wins, track KPIs, and generate actionable insights and priorities.",
          },
          {
            name: "Brand Craft",
            icon: "/brand-craft.png",
            description:
              "Build a clear brand story and messaging strategy. Align content, refine your narrative, plan campaigns, and strengthen executive visibility across every channel.",
          },
          {
            name: "Flight Deck",
            icon: "/flight-deck.png",
            description:
              "Orchestrate campaigns from one central hub. Manage assets, plan content and calendars, streamline collaboration, and distribute across channels with personalization and insights.",
          },
        ].map((module, index) => {
          const ModuleWrapper = (module.name === "Pulse Hub" || module.name === "Brand Craft" || module.name === "Flight Deck") ? Link : "div";
          const wrapperProps = module.name === "Pulse Hub" 
            ? { 
                href: "/pulse-hub", 
                className: "block",
                onClick: () => {
                  window.scrollTo(0, 0);
                }
              }
            : module.name === "Brand Craft"
            ? {
                href: "/brand-craft",
                className: "block", 
                onClick: () => {
                  window.scrollTo(0, 0);
                }
              }
            : module.name === "Flight Deck"
            ? {
                href: "/flight-deck",
                className: "block",
                onClick: () => {
                  window.scrollTo(0, 0);
                }
              }
            : {};
          
          return (
            <ModuleWrapper
              key={index}
              {...wrapperProps}
              className={`rounded-[2rem] p-8 transition-all duration-300 cursor-pointer ${
                hoveredModule === index
                  ? "text-white shadow-2xl"
                  : "bg-white hover:shadow-xl"
              }`}
              style={{
                background: hoveredModule === index
                  ? 'linear-gradient(to bottom, #6218DF 0%, #9967EB 100%) padding-box, linear-gradient(to bottom, #6218DF 0%, #9967EB 100%) border-box'
                  : 'linear-gradient(white, white) padding-box, linear-gradient(to bottom, #6218DF 0%, #9967EB 100%) border-box',
                border: '3px solid transparent',
                borderRadius: '2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={() => setHoveredModule(index)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <div className="mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl shadow-lg"
                  style={{
                    backgroundColor: hoveredModule === index ? '#693FE7' : '#BBD2EF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <img
                    src={module.icon}
                    alt={`${module.name} icon`}
                    className="w-15 h-15"
                    style={{
                      position: 'absolute',
                      top: '52%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
              <h3 
                className={`mb-4 ${hoveredModule === index ? "text-white" : "text-gray-800"}`}
                style={{
                  fontFamily: 'Aeonik, sans-serif',
                  fontWeight: 700,
                  fontSize: '27.32px',
                  lineHeight: '120%',
                  letterSpacing: '-0.2px'
                }}
              >
                {module.name}
              </h3>
              <p 
                className={`${hoveredModule === index ? "text-white/90" : "text-gray-600"}`}
                style={{
                  fontFamily: 'Aeonik, sans-serif',
                  fontWeight: 500,
                  fontSize: '16.3px',
                  lineHeight: '150%',
                  letterSpacing: '-0.02px',
                  flexGrow: 1
                }}
              >
                {module.description}
              </p>
            </ModuleWrapper>
          );
        })}
      </div>
    </div>
  </div>
</section>

      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div
            data-animate="whyStackwise"
            className={`transition-all duration-700 ease-out ${isVisible.whyStackwise ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="text-left text-5xl md:text-6xl">
              <h2 
                className="mb-2" 
                style={{ 
                  color: "#12122B",
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '65.03px',
                  letterSpacing: '-1.98px'
                }}
              >
                Why <span style={{ color: "#6218DF" }}>Stackwise?</span>
              </h2>
              <p 
                className="text-gray-600 mb-20"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  fontSize: '25px',
                  lineHeight: '28.82px',
                  letterSpacing: '0px'
                }}
              >
                You can't do it all. You shouldn't have to.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-start">
             
            <div className="flex justify-center items-center self-center w-full">
              <img 
                      src="/stop-winging-it.svg" 
                      alt="Mail Summary Dashboard" 
                      className="rounded-lg object-contain w-full h-auto max-h-[520px]"
                    />
            </div>

              {/* Right side - Stop Winging It content */}
              <div className="ml:4 sm:ml-0 ">
                <h3 
                  className="font-bold mb-0 xl:mb-2 text-5xl md:text-6xl"
                  style={{ 
                    color: "#12122B",
                    fontFamily: 'Helvetica Neue, sans-serif',
                    fontWeight: 700,
                    lineHeight: '65.03px',
                    letterSpacing: '-1.98px'
                  }}
                >
                  Stop <span style={{ color: "#6218DF" }}>Winging It.</span>
                </h3>
                <h3 
                  className="font-bold mb-5 xl:mb-8 text-5xl md:text-6xl"
                  style={{ 
                    color: "#12122B",
                    fontFamily: 'Helvetica Neue, sans-serif',
                    fontWeight: 700,
                    lineHeight: '65.03px',
                    letterSpacing: '-1.98px'
                  }}
                >
                  Start Owning It.
                </h3>
                <div className="space-y-4 xl:space-y-6">
                  <div>
                    <h4 className="font-bold mb-1 xl:mb-2 text-[#12122B] text-lg">Solo Marketers → Empowered</h4>
                    <p className="text-gray-600">Stop scrambling and prioritize what matters most.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 xl:mb-2 text-[#12122B] text-lg">Lean Teams → Lift</h4>
                    <p className="text-gray-600">Escape burnout and free up time for high impact work.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 xl:mb-2 text-[#12122B] text-lg">SMBs → Momentum</h4>
                    <p className="text-gray-600">Get out of stop-start cycles and build steady, sustainable growth.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 xl:mb-2 text-[#12122B] text-lg">Growing Brands → Strength</h4>
                    <p className="text-gray-600">Grow stronger with strong systems, strong team, and strong results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div
            data-animate="smarterMarketing"
            className={`grid md:grid-cols-2 gap-6 lg:gap-0 md:gap-4 items-center transition-all duration-700 ease-out ${isVisible.smarterMarketing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="text-left ">
              <h2 
                className="mb-0 text-5xl md:text-6xl" 
                style={{ 
                  color: "#12122B",
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '65.03px',
                  letterSpacing: '-1.98px'
                }}
              >
                Smarter <span style={{ color: "#6218DF" }}>Marketing</span>
              </h2>
              <h3 
                className="mb-5 text-5xl md:text-6xl" 
                style={{ 
                  color: "#12122B",
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '65.03px',
                  letterSpacing: '-1.98px'
                }}
              >
                Starts Here.
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-1 text-[#12122B] text-lg">Audit → Review</h4>
                  <p className="text-gray-600">Analyze your current marketing performance clearly</p>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-[#12122B] text-lg">Focus → Prioritize</h4>
                  <p className="text-gray-600">Pinpoint where your time and effort will have the biggest impact</p>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-[#12122B] text-lg">Execution → Activate</h4>
                  <p className="text-gray-600">Build, align, and launch high-impact campaigns across channels</p>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-[#12122B] text-lg">Confidence → Momentum</h4>
                  <p className="text-gray-600 mb-2">Know your marketing is on track and ready for what's next.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img src="/smarter-marketing.svg" alt="Marketing Dashboard" className="w-full rounded-xl shadow-2xl" />
              
            </div>
          </div>
        </div>
      </section>

<section className="px-8 py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div
          data-animate="testimonials"
          className={`transition-all duration-700 ease-out ${isVisible.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <h2 
            className="mb-5 text-4xl md:text-5xl text-center" 
            style={{ 
              color: "#12122B",
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 700,
              lineHeight: '65.03px',
              letterSpacing: '-1.98px'
            }}
          >
            What Our <span style={{ color: "#6218DF" }}>Customers</span> Are Saying
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg max-w-3xl mx-auto">
            Hear from teams who've transformed their strategy and performance with Stackwise. Real marketers. Real
            results. See how Stackwise makes a difference.
          </p>

          <div className="relative h-[800px] overflow-hidden testimonials-container">
            <div className="absolute w-full testimonials-track">
              <div className="px-4 space-y-6">
                {/* Generate rows with varying proportions */}
                {Array.from({ length: Math.ceil([...testimonials, ...testimonials].length / 2) }, (_, rowIndex) => {
                  const testimonialIndex1 = rowIndex * 2;
                  const testimonialIndex2 = rowIndex * 2 + 1;
                  const testimonial1 = [...testimonials, ...testimonials][testimonialIndex1];
                  const testimonial2 = [...testimonials, ...testimonials][testimonialIndex2];
                  
                  // Skip if no testimonials for this row
                  if (!testimonial1 && !testimonial2) return null;
                  
                  // Define the proportion patterns: 4:6, 5:5, 6:4, repeat
                  const proportionPatterns = [
                    { left: 'md:w-2/5', right: 'md:w-3/5' },    // 4:6 proportion on desktop
                    { left: 'md:w-1/2', right: 'md:w-1/2' },    // 5:5 proportion on desktop
                    { left: 'md:w-3/5', right: 'md:w-2/5' }     // 6:4 proportion on desktop
                  ];
                  
                  const currentPattern = proportionPatterns[rowIndex % 3];
                  
                  return (
                    <div key={`row-${rowIndex}`} className="flex flex-col md:flex-row gap-6 mb-6">
                      {/* Left testimonial */}
                      {testimonial1 && (
                        <div className={`w-full ${currentPattern.left} bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[200px]`}>
                          <p className="text-gray-600 mb-4 flex-1">{testimonial1.text}</p>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mr-3 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {testimonial1.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{testimonial1.name}</p>
                              {testimonial1.role && (
                                <p className="text-gray-500 text-xs">{testimonial1.role}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Right testimonial */}
                      {testimonial2 && (
                        <div className={`w-full ${currentPattern.right} bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[200px]`}>
                          <p className="text-gray-600 mb-4 flex-1">{testimonial2.text}</p>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mr-3 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {testimonial2.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{testimonial2.name}</p>
                              {testimonial2.role && (
                                <p className="text-gray-500 text-xs">{testimonial2.role}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
<section 
  className="px-8 py-20 relative"
  style={{
    backgroundImage: 'url("/purple-bg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="max-w-7xl mx-auto">
    <div
      data-animate="founderSection"
      className={`transition-all duration-700 ease-out ${isVisible.founderSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      <h2 
        className="text-4xl font-bold text-white mb-12"
        style={{ 
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 700,
          fontSize: '55.65px',
          lineHeight: '65.03px',
          letterSpacing: '-1.98px'
        }}
      >
        Why I Built Stackwise
      </h2>

      <div className="flex md:flex-row flex-col items-center md:items-center justify-center md:justify-center max-w-none gap-6 md:gap-0">
  <div className="flex-shrink-0 md:mr-6 flex justify-center">
    <img
      src="/founder.svg"
      alt="Jen Picardo"
      className="w-full max-w-sm rounded-3xl shadow-2xl mx-auto"
    />
  </div>


        <div className="text-white flex-1 md:ml-6 mt-6 md:mt-4">
          <p 
            className="mb-6"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 100,
              fontSize: '22.11px',
              lineHeight: '30.95px',
              letterSpacing: '-0.22px'
            }}
          >
            "I built Stackwise for the version of me who was doing it all: running strategy, content, email, paid,
            demand gen, social, reporting, and brand without a team. I didn't need more dashboards. I needed
            direction and prioritization.
          </p>
          <p 
            className="mb-6"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 100,
              fontSize: '22.11px',
              lineHeight: '30.95px',
              letterSpacing: '-0.22px'
            }}
          >
            Most tools give you data. Stackwise gives you clarity. It tells you what to pay attention to and how
            to act on it.
          </p>
          <p 
            className="mb-8"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 100,
              fontSize: '22.11px',
              lineHeight: '30.95px',
              letterSpacing: '-0.22px'
            }}
          >
            It's built with real-world experience from a marketing professional who has been in your shoes."
          </p>

          <div>
            <p className="font-bold text-xl">Jen Picardo</p>
            <p className="text-purple-200">Founder and Marketing Nerd</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
         <PowerYourMarketingStack 
           isVisible={isVisible.finalCta} 
           dataAnimate="finalCta" 
         />

      <Footer />
    </div>
  )
}

export default StackwiseLanding
