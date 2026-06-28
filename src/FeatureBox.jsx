import React from 'react'

// Reusable Feature Box Component
const FeatureBox = ({ icon, heading, features, className = "" }) => {
  return (
    <div className={`bg-white p-10 shadow-sm transition-colors duration-300 flex flex-col border border-gray-200 relative hover:bg-[#FCFCFD] group ${className}`}>
      <div className="flex-shrink-0 mb-4">
        <img src={icon} alt={`${heading} icon`} className="w-12 h-12" />
      </div>
      <div className="flex-1">
        <h3 
          className="mb-3"
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontWeight: 500,
            fontSize: '25.28px',
            lineHeight: '150%',
            letterSpacing: '0%',
            color: '#0A0C29'
          }}
        >
          {heading}
        </h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#697896' }}></span>
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  fontSize: '15.85px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  color: '#697896'
                }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-28 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300" style={{ backgroundColor: '#C009BA' }}></div>
    </div>
  )
}

export default FeatureBox