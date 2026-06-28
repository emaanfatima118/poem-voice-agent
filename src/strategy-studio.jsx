"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Compass, CheckCircle2, Users, Calendar, TrendingUp, Brain, Award } from 'lucide-react';
import AppBar from './components/AppBar';
import Footer from './components/Footer';
import PowerYourMarketingStack from './components/PowerYourMarketingStack';

const StrategyStudio = () => {
  const [, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    heroText: false,
    heroButtons: false,
    stopSpinning: false,
    findFocus: false,
    seeWorking: false,
    chaosToClarity: false,
    finalCta: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Initial animations
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, heroText: true })), 400);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, heroButtons: true })), 700);

    // Intersection observer for scroll animations
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

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      <style>{`
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
        
        .floating-image-scale {
          animation: float 3s ease-in-out infinite;
        }
        
        .ease-in-text {
          /* Animation removed - using transition-all instead */
        }

        .gradient-text {
          background: linear-gradient(135deg, hsl(267, 83%, 48%) 0%, hsl(314, 93%, 39%) 50%, hsl(229, 88%, 53%) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gradient-bg {
          background: linear-gradient(135deg, hsl(267, 83%, 48%) 0%, hsl(314, 93%, 39%) 50%, hsl(229, 88%, 53%) 100%);
        }

        .gradient-stroke {
          stroke: url(#icon-gradient);
        }
      `}</style>

      <AppBar />

      {/* Hero Section - Using SVG Background Placeholder */}
      <section 
        className="py-8 sm:py-12 md:py-16 relative overflow-hidden"
        style={{
          backgroundImage: 'url("/strategy-studio/gradient-bg.svg")',
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
                Strategy Studio
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
                A human-driven strategy workspace.
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
                Lay your foundation, build clarity around your goals, revisit them with rhythm, and keep strategy grounded in human judgment.
              </p>
              <Link
                href="/stackwise-dashboard/strategy-studio"
                className="px-12 sm:px-16 lg:px-20 xl:px-24 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white text-purple-600 inline-block text-center"
              >
                Start Stacking
              </Link>
            </div>

            <div className="flex justify-center">
              <img 
                src="/strategy-studio/dashboard.png" 
                alt="Strategy Studio Dashboard" 
                className="w-full max-w-2xl rounded-lg shadow-2xl"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>
     

  {/* Strategy Starts With You Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <div
              data-animate="strategyStarts"
              className={`transition-all duration-1000 ease-in-text ${isVisible.strategyStarts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
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
                Strategy Starts <span className="gradient-text">With You</span>
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
                Humans bring the insight, creativity, context, and judgment needed to build and evolve your path. You are the differentiator — not the AI.
              </p>
              <div className="space-y-8 lg:space-y-10 pt-0 lg:pt-2 xl:pt-2 2xl:pt-2">
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-purple-600 transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Lay Your Foundation
                    <div className="h-0.5 bg-purple-600 mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                  </div>
                </div>
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-purple-600 transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Bridge Insight and Instinct
                    <div className="h-0.5 bg-purple-600 mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                  </div>
                </div>
                <div className="cursor-pointer group">
                  <div 
                    className="text-[#606060] group-hover:text-purple-600 transition-all duration-300 text-[22px] sm:text-[26px] md:text-[26px] lg:text-3xl xl:text-3xl 2xl:text-3xl"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 500,
                      lineHeight: '1.1',
                      letterSpacing: '0px'
                    }}
                  >
                    Make the Call
                    <div className="h-0.5 bg-purple-600 mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[55%] sm:w-[50%] md:w-[40%] lg:w-[70%] xl:w-[60%] 2xl:w-[55%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              data-animate="strategyStarts"
              className={`transition-all duration-1000 ease-in-text flex items-center lg:justify-end ${isVisible.strategyStarts ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              <img 
                src="/strategy-studio/stack-navigator.png" 
                alt="Stack Navigator Interface"
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

       {/* How Strategy Studio Works Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div
            data-animate="howItWorks"
            className={`transition-all duration-1000 ease-in-text ${isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
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
              How <span className="gradient-text">Strategy Studio</span> Works
            </h2>

            <div className="space-y-12 lg:space-y-16">
              {/* Build the Base */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mb-6">
                    <Compass className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    className="text-gray-900 mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 700,
                      lineHeight: '0.92',
                      letterSpacing: '-0.034em'
                    }}
                  >
                    Build the Base for What's Next
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
                    Set your direction in motion and create a flexible framework that evolves as your business and goals do.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <img 
                    src="/strategy-studio/onboarding.png" 
                    alt="Build the Base"
                    className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                  />
                </div>
              </div>

              {/* Bridge Insight and Instinct */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                  <img 
                    src="/strategy-studio/playbook.png" 
                    alt="Bridge Insight and Instinct"
                    className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    className="text-gray-900 mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 700,
                      lineHeight: '0.92',
                      letterSpacing: '-0.034em'
                    }}
                  >
                    Bridge Insight and Instinct
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
                    Close the gap between data and human thinking by evaluating effort, impact, and priority — then use context and instinct to shape your 30/60/90 plan.
                  </p>
                </div>
              </div>

              {/* Because Strategy Can't Be Automated */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    className="text-gray-900 mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontWeight: 700,
                      lineHeight: '0.92',
                      letterSpacing: '-0.034em'
                    }}
                  >
                    Because Strategy Can't Be Automated
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
                    AI can surface patterns — but only you can decide what matters and why it matters. Backed by data and insights, quarterly reviews keeps decision-making human.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <img 
                    src="/strategy-studio/quarterly-review.png" 
                    alt="Strategy Can't Be Automated"
                    className="w-3/4 lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div
            data-animate="features"
            className={`transition-all duration-1000 ease-in-text ${isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
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
              Explore <span className="gradient-text">Strategy Studio</span>
            </h2>
            <p 
              className="mb-8 lg:mb-12 text-left text-lg sm:text-xl lg:text-2xl xl:text-[25px]"
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontWeight: 400,
                lineHeight: '1.4',
                letterSpacing: '0px',
                color: '#606060'
              }}
            >
              Included with every Stackwise subscription.
            </p>

            {/* Features Grid */}
            <div className="space-y-12 lg:space-y-16">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Guided Onboarding */}
                <div className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                    <h4 
                      className="text-xl text-gray-900"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 700 }}
                    >
                      Guided Onboarding
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>6-step setup wizard to define goals, focus areas, and audience</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Select GTM motions, channels, and sample plays with coaching built in</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Save and sync automatically across your workspace</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* My Playbook */}
                <div className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h4 
                      className="text-xl text-gray-900"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 700 }}
                    >
                      My Playbook
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Your personal action layer for capturing, refining, and repeating your best moves</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Turn recommendations into plays with one click</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Track progress and outcomes with simple status cards</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Stack Navigator */}
                <div className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h4 
                      className="text-xl text-gray-900"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 700 }}
                    >
                      Stack Navigator
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Evaluate effort, impact, and need in the Eval Matrix to prioritize next steps</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Auto-populate your 30/60/90 plan — drag, drop, add, delete, and reprioritize anytime</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Human-in-the-loop by design: context, creativity, and judgment always lead</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Quarterly Review */}
                <div className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h4 
                      className="text-xl text-gray-900"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 700 }}
                    >
                      Quarterly Review & Refresh
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Automatic prompt at day 90 to review your strategy</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Capture wins, lessons, and shifts before locking your next 90-day plan</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Seamlessly roll refreshed strategy into your next cycle to keep goals, plays, and priorities aligned</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Quarterly Strategy Calls */}
                <div className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 gradient-bg text-white rounded-full text-xs font-semibold">
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Fully Stacked only</span>
                      </div>
                    </div>
                    <h4 
                      className="text-xl text-gray-900"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 700 }}
                    >
                      Quarterly Strategy Calls
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Live working session with an experienced marketing strategist to review trends, sharpen focus, and update priorities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Agenda: wins/misses → direction shifts → 30/60/90 commits → enablement</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Action items are documented and tracked for accountability</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation for Focus Section */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div
            data-animate="foundation"
            className={`transition-all duration-1000 ease-in-text ${isVisible.foundation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
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
              Your Foundation for <span className="gradient-text">Focus and Forward Motion</span>
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
              Marketing shouldn't live in a file or fade into a deck no one ever opens. <strong>Start here.</strong> Build something that lives, breathes, and moves with you. Strategy Studio helps you set the foundation, My Playbook keeps it evolving, and quarterly reviews keep reflection and direction in sync.
            </p>
            
            <div className="text-center mb-8">
              <h3 
                className="mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em'
                }}
              >
                <span className="gradient-text">Because the real competitive advantage comes from humans, not automation.</span>
              </h3>
              <p 
                className="mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-[43.65px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 700,
                  lineHeight: '0.92',
                  letterSpacing: '-0.034em'
                }}
              >
                <span className="gradient-text">Your next move starts here.</span>
              </p>
              <Link
                href="/stackwise-dashboard/strategy-studio"
                className="px-12 sm:px-16 lg:px-20 py-2 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl text-white gradient-bg inline-block text-center"
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
  );
}
export default StrategyStudio;