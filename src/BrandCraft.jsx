"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import FeatureBox from './FeatureBox'
import AppBar from './components/AppBar'
import Footer from './components/Footer'
import PowerYourMarketingStack from './components/PowerYourMarketingStack'

const BrandCraft = () => {
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
        backgroundImage: 'url("/brandcraft/top-gradient.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
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
              Brand Craft
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
              An AI-Powered Platform for Clear, Confident Brand Messaging
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
              Shape your story, sharpen your voice, and align your channels so every campaign, every message, and every leadership moment creates meaningful impact.
            </p>
            <Link
              href="/stackwise-dashboard/brand-craft"
              className="px-12 sm:px-16 lg:px-20 xl:px-24 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white text-[#C009BA] inline-block text-center"
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
                 Tell a Clearer Story. Build a <span style={{ color: '#C009BA' }}>Stronger Brand.</span>
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
                Craft messaging and content that strengthens your brand at every touchpoint.
              </p>
              <div className="space-y-8 lg:space-y-10 pt-0 lg:pt-2 xl:pt-2 2xl:pt-2">
                <div className="cursor-pointer group">
                     <div 
                       className="text-[#606060] group-hover:text-[#C009BA] transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                       style={{
                         fontFamily: 'Helvetica Neue, sans-serif',
                         fontWeight: 500,
                         lineHeight: '1.1',
                         letterSpacing: '0px'
                       }}
                     >
                       Find your brand voice
                       <div className="h-0.5 bg-[#C009BA] mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                     </div>
                </div>
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-[#C009BA] transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Strengthen executive visibility
                    <div className="h-0.5 bg-[#C009BA] mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                  </div>
                </div>
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-[#C009BA] transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Align content with strategy
                    <div className="h-0.5 bg-[#C009BA] mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
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
               Sharpen Your Voice With <span className="text-[#C009BA]">Brand Craft</span>
             </h2>

             <div className="space-y-12 lg:space-y-16">
               {/* Messaging & Narrative */}
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
                     Messaging & Narrative
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
                     Define your narrative, sharpen your messaging, and craft a voice that leaves a lasting impression.
                   </p>
                 </div>
                 <div className="flex justify-center lg:justify-end">
                   <img 
                     src="/pulsehub/audit-marketing-performance.svg" 
                     alt="Messaging & Narrative"
                     className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                   />
                 </div>
               </div>

               {/* Content Strategy & Activation */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                 <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                   <img 
                     src="/pulsehub/audit-marketing-performance.svg" 
                     alt="Content Strategy & Activation"
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
                     Content Strategy & Activation
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
                     Plan, create, and launch content that aligns with your story and drives real engagement across every channel.
                   </p>
                 </div>
               </div>

               {/* Executive & Brand Presence */}
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
                     Executive & Brand Presence
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
                     Elevate your leadership and brand visibility with consistent messaging that resonates and inspires action.
                   </p>
                 </div>
                 <div className="flex justify-center lg:justify-end">
                   <img 
                     src="/pulsehub/audit-marketing-performance.svg" 
                     alt="Executive & Brand Presence"
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
               className="text-left text-3xl sm:text-4xl lg:text-5xl xl:text-[56.32px]"
               style={{
                 fontFamily: 'Helvetica Neue, sans-serif',
                 fontWeight: 700,
                 lineHeight: '1.17',
                 letterSpacing: '-0.035em',
                 color: '#12122B'
               }}
             >
               Craft a <span className="text-[#C009BA]">Brand Story</span> That Connects
             </h2>
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
              With People
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
                 The core tools to tell your story, organize content, and boost executive presence.
               </p>
               
               <div className="grid md:grid-cols-2 gap-0">
                 <FeatureBox
                   icon="/brandcraft/messaging-house.svg"
                   heading="Messaging House"
                   features={[
                     "Build a clear, repeatable brand story",
                     "Align all teams around shared messaging",
                     "Create a foundation that scales"
                   ]}
                 />
                 <FeatureBox
                   icon="brandcraft/content-strategy.svg"
                   heading="Content Strategy"
                   features={[
                     "Define themes and pillars around core points",
                     "Map content to the buyer's journey",
                     "Ensure consistency"
                   ]}
                 />
                 <FeatureBox
                   icon="brandcraft/content-creation.svg"
                   heading="Content Creation"
                   features={[
                     "Generate campaign-ready assets faster",
                     "Standardize tone and visuals",
                     "Streamline collaboration"
                   ]}
                 />
                 <FeatureBox
                   icon="brandcraft/keyword-research.svg"
                   heading="Keyword Research"
                   features={[
                     "Identify high-value keywords",
                     "Align SEO with brand narrative",
                     "Prioritize topics that fuel strategies"
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
                Fully Stacked adds AI-powered insights, advanced analytics, and strategy support to drive results and fuel growth.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
                <FeatureBox
                  icon="/brandcraft/campaign-builder.svg"
                  heading="Campaign Builder"
                  features={[
                    "Plan and launch multi-channel campaigns",
                    "Build messaging frameworks that scale",
                    "Activate content templates"
                  ]}
                />
                <FeatureBox
                  icon="/brandcraft/content-audit.svg"
                  heading="Content Audit and Gap Analysis"
                  features={[
                    "Evaluate existing assets against your strategy",
                    "Identify gaps in coverage",
                    "Repurpose and refresh high-performing content"
                  ]}
                />
                <FeatureBox
                  icon="/brandcraft/brand-voice.svg"
                  heading="Brand Voice Enforcement"
                  features={[
                    "Keep every asset aligned to brand guidelines",
                    "Flag off-tone messaging",
                    "Ensure consistency across teams and channels"
                  ]}
                />
                <FeatureBox
                  icon="/brandcraft/thought-leadership.svg"
                  heading="Thought Leadership & Executive Visibility"
                  features={[
                    "Benchmark content against competitors"
                  ]}
                />
                <FeatureBox
                  icon="/brandcraft/competitor-content.svg"
                  heading="Competitor Content Analysis"
                  features={[
                    "Benchmark content against competitors",
                    "Spot opportunities where competitors are weak",
                    "Track shifts in positioning and trends"
                  ]}
                />
                <FeatureBox
                  icon="/brandcraft/quarterly-strategy-call.svg"
                  heading="Quarterly Strategy Call"
                  features={[
                    "Get Expert Guidance",
                    "Prioritize High-Impact Work",
                    "Align Your Team & Plan"
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
               <span className="text-[#C009BA]">Brand Craft</span> Brings Your Story to Life
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
               Our brand is more than a logo or a tagline—it's your story, your voice, your presence. That's where Brand Craft steps in. Define your narrative, align your content, and elevate executive visibility—while AI-powered insights and strategic guidance ensure your messaging resonates and drives results.
             </p>
            
            <div className="text-center mb-8">
              <h3 
                className="mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em',
                  color: '#C009BA'
                }}
              >
                Stop guessing. Start Standing out.
              </h3>
              <p 
                className="mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em',
                  color: '#C009BA'
                }}
              >
                Get started with Brand Craft today.
              </p>
              <Link
                href="/stackwise-dashboard/brand-craft"
                className="px-12 sm:px-16 lg:px-20 py-2 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl text-white inline-block text-center"
                style={{ backgroundColor: "#C009BA" }}
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

export default BrandCraft
