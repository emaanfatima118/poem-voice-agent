import React from 'react'

const PowerYourMarketingStack = ({ isVisible, dataAnimate }) => {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .floating-image {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      <section
        className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-8 text-white relative overflow-x-clip"
        style={{
          backgroundImage: 'url("/darkblue-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto relative z-10 overflow-visible">
          <div
            data-animate={dataAnimate}
            className={`grid md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 transition-all duration-1000 ease-in-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="order-1 md:order-1 md:col-span-2 flex flex-col justify-center py-8 md:py-12 pb-4 md:pb-12">
              <h2
                className="mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[48px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 500,
                  lineHeight: '1.2',
                  letterSpacing: '-0.04em'
                }}
              >
                Power Your Marketing Stack With Stackwise
              </h2>
              <p
                className="mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg xl:text-[18px]"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.5',
                  color: '#E5E5E5'
                }}
              >
                The simplest way to manage and scale your marketing. Turn strategy into results that grow pipeline.
              </p>

              <button
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl mb-4 lg:mb-6 w-fit"
                style={{
                  backgroundColor: "#6218DF",
                  color: "#fff",
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 500
                }}
              >
                Try our free 14 day trial 
                <img src='./arrow-right.png' alt="->" className="w-4 h-4" />
              </button>

              <p
                className="text-xs sm:text-sm flex items-center"
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  color: '#B3B3B3'
                }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                New integrations added regularly
              </p>
            </div>

            <div className="order-2 md:order-2 md:col-span-3 relative py-4 md:py-12 pt-0 md:pt-12 -mr-4 sm:-mr-6 md:-mr-12 lg:-mr-24 xl:-mr-32 2xl:-mr-40">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
                {/* Image 1 - Left Column */}
                <div className="floating-image flex items-start justify-end pt-10 sm:pt-14 md:pt-16 lg:pt-20 xl:pt-24" style={{ animationDelay: "0s" }}>
                  <img
                    src="/marketing-1.svg"
                    alt="Marketing Dashboard 1"
                    className="w-full min-w-[160px] max-w-[200px] sm:max-w-[230px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[340px] 2xl:max-w-[380px] h-auto"
                  />
                  
                </div>
                
                {/* Image 2 - Right Column */}
                <div className="floating-image flex items-start justify-start" style={{ animationDelay: "0.5s" }}>
                  <img
                    src="/marketing-2.svg"
                    alt="Marketing Dashboard 2"
                    className="w-full min-w-[180px] max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[360px] xl:max-w-[420px] 2xl:max-w-[480px] h-auto ml-auto"
                  />
                </div>
                
                {/* Image 3 - Spans Both Columns */}
                <div className="col-span-2 floating-image flex items-start justify-center mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8" style={{ animationDelay: "1s" }}>
                  <img
                    src="/marketing-3.svg"
                    alt="Marketing Dashboard 3"
                    className="w-full min-w-[160px] max-w-[180px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] xl:max-w-[340px] 2xl:max-w-[400px] h-auto"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  )
}

export default PowerYourMarketingStack