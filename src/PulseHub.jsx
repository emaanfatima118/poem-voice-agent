"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import FeatureBox from './FeatureBox'
import AppBar from './components/AppBar'
import Footer from './components/Footer'
import PowerYourMarketingStack from './components/PowerYourMarketingStack'

const PulseHub = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isVisible, setIsVisible] = useState({
    hero: false,
    heroText: false,
    heroButtons: false,
    stopSpinning: false,
    findFocus: false,
    seeWorking: false,
    chaosToClarity: false,
    finalCta: false,
  })

  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, heroText: true })), 400)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, heroButtons: true })), 700)

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

      {/* Hero Section */}
      <section 
        className="py-8 sm:py-12 md:py-16 relative overflow-hidden"
        style={{
          backgroundImage: 'url("/pulsehub/gradient-bg.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '80vh'
        }}
      >
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-15 w-full">
          <div 
          className="grid lg:grid-cols-[1fr_1.2fr] gap-2 sm:gap-4 lg:gap-2 items-center max-w-[1800px] mx-auto"
        >
            <div
            className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
              <div className="inline-block px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-1.5 sm:py-2 rounded-full border border-white bg-white/10 backdrop-blur-sm mb-4 sm:mb-5 md:mb-6">
                <p className="mb-0 font-medium text-sm sm:text-base text-white">
                  Start your free 14-day trial today
                </p>
              </div>

              <h1 
                className="text-white mb-2 text-3xl sm:text-4xl lg:text-5xl xl:text-[50.61px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  letterSpacing: '-0.03em'
                }}
              >
                Pulse Hub
              </h1>
              <h2 
                className="text-white mb-6 text-3xl sm:text-4xl lg:text-5xl xl:text-[50.61px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  letterSpacing: '-0.03em'
                }}
              >
                An AI-Powered Performance Dashboard
              </h2>
              <p 
                className="text-white/90 mb-8 max-w-2xl text-base sm:text-lg lg:text-xl xl:text-[20.47px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.6',
                  letterSpacing: '0px'
                }}
              >
                Audit, track, and optimize campaigns so you can learn rapidly, take action, provide high-impact work, and stay ahead of opportunities.
              </p>
              <Link
                href="/stackwise-dashboard/pulse-hub"
                className="px-12 sm:px-16 lg:px-20 xl:px-24 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white text-[#6218DF] inline-block text-center"
              >
                Start Stacking
              </Link>
            </div>

            <div
            className={`transition-all duration-1000 relative h-[300px] md:h-[500px] lg:h-[500px] 2xl:lg:h-[600px] lg:ml-6 -mx-8 sm:-mx-12 lg:-mr-[calc(54vw-100%)] ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <img 
              src="/pulsehub/top-image.svg" 
              alt="Pulse Hub Dashboard"
              className="w-full block ml-auto mt-8 lg:mt-0 max-w-[370px] md:max-w-[700px] lg:max-w-[800px]"
              style={{
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'right center'
              }}
            />
          </div>
          </div>
        </div>
      </section>

      {/* Stop Spinning Your Wheels Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <div
              data-animate="stopSpinning"
              className={`transition-all duration-1000 ease-in-text ${isVisible.stopSpinning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              <h2 
                className="text-gray-900 mb-6 text-3xl sm:text-4xl lg:text-5xl xl:text-[56.32px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1.17',
                  letterSpacing: '-0.035em'
                }}
              >
                 Stop <span style={{ color: '#2B0ADF' }}>Spinning</span> Your Wheels.
              </h2>
              <p 
                className="text-gray-600 mb-12 lg:mb-18 xl:mb-20 2xl:mb-20 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-[23px] 2xl:text-[24px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.4',
                  letterSpacing: '0px'
                }}
              >
                Go from guesswork to game plan, and turn confusing metrics into strategic moves.
              </p>
              <div className="space-y-8 lg:space-y-10 pt-0 lg:pt-2 xl:pt-2 2xl:pt-2">
                <div className="cursor-pointer group">
                     <div 
                       className="text-[#606060] group-hover:text-[#2B0ADF] transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                       style={{
                         fontFamily: 'Helvetica Neue, sans-serif',
                         fontWeight: 500,
                         lineHeight: '1.1',
                         letterSpacing: '0px'
                       }}
                     >
                       Get clarity fast
                       <div className="h-0.5 bg-[#2B0ADF] mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                     </div>
                </div>
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-[#2B0ADF] transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Stay ahead of problems
                    <div className="h-0.5 bg-[#2B0ADF] mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                  </div>
                </div>
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-[#2B0ADF] transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Prove marketing's value
                    <div className="h-0.5 bg-[#2B0ADF] mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                  </div>
                </div>
              </div>
            </div>

             <div
               data-animate="stopSpinning"
               className={`transition-all duration-1000 ease-in-text flex items-center lg:justify-end ${isVisible.stopSpinning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
             >
               <img 
                 src="/pulsehub/stop-spinning-your-wheels.svg" 
                 alt="Quick Analytics Dashboard"
                 className="mt-4 sm:mt-6 md:mt-8 lg:mt-14 xl:mt-16 2xl:mt-18 w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] h-auto"
                 style={{ 
                   transform: 'scale(1.1)',
                   animation: 'float 3s ease-in-out infinite'
                 }}
               />
             </div>
          </div>
        </div>
      </section>

       {/* Find Your Focus Section */}
       <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
         <div className="max-w-[1800px] mx-auto">
           <div
             data-animate="findFocus"
             className={`transition-all duration-1000 ease-in-text ${isVisible.findFocus ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
           >
             <h2 
               className="text-gray-900 mb-12 lg:mb-16 text-3xl sm:text-4xl lg:text-5xl xl:text-[56.32px]"
               style={{
                 fontFamily: 'Helvetica Neue, sans-serif',
                 fontWeight: 700,
                 lineHeight: '1.17',
                 letterSpacing: '-0.035em'
               }}
             >
               Find Your Focus With <span className="text-[#2B0ADF]">Pulse Hub</span>
             </h2>

             <div className="space-y-12 lg:space-y-16">
               {/* Audit Marketing Performance */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                 <div>
                   <h3 
                     className="text-gray-900 mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                     style={{
                       fontFamily: 'Helvetica Neue, sans-serif',
                       fontWeight: 700,
                       lineHeight: '0.92',
                       letterSpacing: '-0.034em'
                     }}
                   >
                     Audit Marketing Performance
                   </h3>
                   <p 
                     className="text-gray-600 text-lg sm:text-xl lg:text-2xl xl:text-[25px]"
                     style={{
                       fontFamily: 'Helvetica Neue, sans-serif',
                       fontWeight: 400,
                       lineHeight: '1.4',
                       letterSpacing: '0px'
                     }}
                   >
                     AI-powered audits across 9 core areas that reveal strengths, spot red flags, and uncover missed opportunities in your marketing
                   </p>
                 </div>
                 <div className="flex justify-center lg:justify-end">
                   <img 
                     src="/pulsehub/audit-marketing-performance.svg" 
                     alt="Audit Marketing Performance"
                     className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                   />
                 </div>
               </div>

               {/* Insights to Action */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                 <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                   <img 
                     src="/pulsehub/audit-marketing-performance.svg" 
                     alt="Audit Marketing Performance"
                     className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                   />
                 </div>
                 <div className="order-1 lg:order-2">
                   <h3 
                     className="text-gray-900 mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                     style={{
                       fontFamily: 'Helvetica Neue, sans-serif',
                       fontWeight: 700,
                       lineHeight: '0.92',
                       letterSpacing: '-0.034em'
                     }}
                   >
                     Insights → Action
                   </h3>
                   <p 
                     className="text-gray-600 text-lg sm:text-xl lg:text-2xl xl:text-[25px]"
                     style={{
                       fontFamily: 'Helvetica Neue, sans-serif',
                       fontWeight: 400,
                       lineHeight: '1.4',
                       letterSpacing: '0px'
                     }}
                   >
                     AI-powered insights that turn data into clear next steps, helping you focus on what drives impact.
                   </p>
                 </div>
               </div>

               {/* Reporting and Analytics */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                 <div>
                   <h3 
                     className="text-gray-900 mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                     style={{
                       fontFamily: 'Helvetica Neue, sans-serif',
                       fontWeight: 700,
                       lineHeight: '0.92',
                       letterSpacing: '-0.034em'
                     }}
                   >
                     Reporting and Analytics
                   </h3>
                   <p 
                     className="text-gray-600 text-lg sm:text-xl lg:text-2xl xl:text-[25px]"
                     style={{
                       fontFamily: 'Helvetica Neue, sans-serif',
                       fontWeight: 400,
                       lineHeight: '1.4',
                       letterSpacing: '0px'
                     }}
                   >
                     Real-time analytics and streamlined reports that highlight performance, trends, and opportunities, making it easy to share results with leadership and sales.
                   </p>
                 </div>
                 <div className="flex justify-center lg:justify-end">
                   <img 
                     src="/pulsehub/audit-marketing-performance.svg" 
                     alt="Reporting and Analytics"
                     className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                   />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

       {/* See What's Working Section */}
       <section className="px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
         <div className="max-w-[1800px] mx-auto">
           <div
             data-animate="seeWorking"
             className={`transition-all duration-1000 ease-in-text ${isVisible.seeWorking ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
           >
             <h2 
               className="mb-8 lg:mb-12 text-left text-3xl sm:text-4xl lg:text-5xl xl:text-[56.32px]"
               style={{
                 fontFamily: 'Helvetica Neue, sans-serif',
                 fontWeight: 700,
                 lineHeight: '1.17',
                 letterSpacing: '-0.035em',
                 color: '#12122B'
               }}
             >
               See <span className="text-[#2B0ADF]">What's Working.</span> Fix What's Not.
             </h2>

             {/* Stacked Section */}
             <div className="mb-12 lg:mb-16">
               <h3 
                 className="text-gray-900 mb-2 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                 style={{
                   fontFamily: 'Helvetica Neue, sans-serif',
                   fontWeight: 700,
                   lineHeight: '0.92',
                   letterSpacing: '-0.034em'
                 }}
               >
                 Stacked
               </h3>
               <p 
                 className="text-gray-600 mb-6 lg:mb-8 text-base sm:text-lg lg:text-xl xl:text-[20.47px]"
                 style={{
                   fontFamily: 'Helvetica Neue, sans-serif',
                   fontWeight: 400,
                   lineHeight: '1.6',
                   letterSpacing: '0px'
                 }}
               >
                 The essentials to audit, track, and act.
               </p>
               
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
                 <FeatureBox
                   icon="/pulsehub/audit.svg"
                   heading="Audit"
                   features={[
                     "Audit 9 core areas",
                     "Spot trends, strengths, gaps and red flags",
                     "Get actionable insights"
                   ]}
                 />
                 <FeatureBox
                   icon="/pulsehub/real-time-analytics.svg"
                   heading="Real-Time Analytics"
                   features={[
                     "Monitor outcomes",
                     "Identify opportunities & risks",
                     "Make agile decisions"
                   ]}
                 />
                 <FeatureBox
                   icon="/pulsehub/kpi.svg"
                   heading="Custom KPIs"
                   features={[
                     "Track metrics that align to business goals",
                     "Measure performance",
                     "Stay focused on growth KPIs"
                   ]}
                 />
                 <FeatureBox
                   icon="/pulsehub/ai-intelligence.svg"
                   heading="AI Intelligence"
                   features={[
                     "Surface insights",
                     "Recommend next steps",
                     "Prioritize impact activities"
                   ]}
                 />
                 <FeatureBox
                   icon="/pulsehub/roadmaps-recos.svg"
                   heading="Roadmaps + Recos"
                   features={[
                     "Build clear roadmaps for smarter execution"
                   ]}
                 />
               </div>
             </div>

            {/* Fully Stacked Section */}
            <div>
              <h3 
                className="text-gray-900 mb-2 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em'
                }}
              >
                Fully Stacked
              </h3>
              <p 
                className="text-gray-600 mb-6 lg:mb-8 text-base sm:text-lg lg:text-xl xl:text-[20.47px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.6',
                  letterSpacing: '0px'
                }}
              >
                Go beyond the essentials with AI-led reporting and ABM planning to unlock potential and maximize impact.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
                <FeatureBox
                  icon="/pulsehub/abm.svg"
                  heading="ABM Command Center"
                  features={[
                    "Centralize account insights, engagement & signals",
                    "Marketing & sales alignment",
                    "Focus on the right accounts to drive revenue"
                  ]}
                />
                <FeatureBox
                  icon="/pulsehub/competitor-analysis.svg"
                  heading="Competitor Analysis & Benchmarking"
                  features={[
                    "Benchmark performance against competitors",
                    "SWOT & gaps analysis",
                    "Track competitor strategies and market activity"
                  ]}
                />
                <FeatureBox
                  icon="/pulsehub/leadership.svg"
                  heading="Leadership + Sales Reports"
                  features={[
                    "Deliver monthly and quarterly updates for stakeholders",
                    "Share weekly account updates with sales teams",
                    "Align all teams to drive pipeline growth"
                  ]}
                />
                <FeatureBox
                  icon="/pulsehub/g2m.svg"
                  heading="G2M"
                  features={[
                    "Build clear go-to-market strategy",
                    "Prioritize opportunities and campaigns",
                    "Align execution across marketing and sales"
                  ]}
                />
                <FeatureBox
                  icon="/pulsehub/quaterly-call.svg"
                  heading="Quarterly Strategy Call"
                  features={[
                    "Get expert guidance",
                    "Prioritize high-impact work",
                    "Align your team & plan"
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pulse Hub Brings You From Chaos to Clarity Section */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div
            data-animate="chaosToClarity"
            className={`transition-all duration-1000 ease-in-text ${isVisible.chaosToClarity ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
             <h2 
               className="text-[#12122B] mb-2 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-[56.32px]"
               style={{
                 fontFamily: 'Helvetica Neue, sans-serif',
                 fontWeight: 700,
                 lineHeight: '1.17',
                 letterSpacing: '-0.035em'
               }}
             >
               <span className="text-[#2B0ADF]">Pulse Hub</span> Brings You From
             </h2>
             <h2 
               className="text-[#12122B] mb-6 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-[56.32px]"
               style={{
                 fontFamily: 'Helvetica Neue, sans-serif',
                 fontWeight: 700,
                 lineHeight: '1.17',
                 letterSpacing: '-0.035em'
               }}
             >
               Chaos to Clarity
             </h2>
             <p 
               className="text-gray-600 mb-12 lg:mb-16 text-center max-w-6xl mx-auto text-lg sm:text-xl lg:text-2xl xl:text-[25px]"
               style={{
                 fontFamily: 'Helvetica Neue, sans-serif',
                 fontWeight: 400,
                 lineHeight: '1.4',
                 letterSpacing: '0px'
               }}
             >
               Marketing moves fast, data piles up, and priorities get blurred. That's where Pulse Hub steps in. AI-powered insights cut through the noise, reports prove your impact, and clear next steps keep your team focused on what really drives growth.
             </p>
            
            <div className="text-center mb-8">
              <h3 
                className="mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em',
                  color: '#2B0ADF'
                }}
              >
                Stop guessing. Start growing.
              </h3>
              <p 
                className="mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em',
                  color: '#2B0ADF'
                }}
              >
                Get started with Pulse Hub today.
              </p>
              <Link
                href="/stackwise-dashboard/pulse-hub"
                className="px-12 sm:px-16 lg:px-20 py-2 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl text-white inline-block text-center"
                style={{ backgroundColor: "#2B0ADF" }}
              >
                Start Stacking
              </Link>
            </div>

            {/* Space reserved for video */}
            <div className="mt-12 h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500 text-base sm:text-lg">Video placeholder - Video will be added here</p>
            </div>
          </div>
        </div>
      </section>

       <PowerYourMarketingStack isVisible={isVisible.finalCta} dataAnimate="finalCta" />
       <Footer />
    </div>
  )
}

export default PulseHub
