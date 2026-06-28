"use client"

const AppBar = ({ userName = "Brian Ford", userInitials = "CC", userFullName = "Cristopher Calzoni", userRole = "Admin" }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 
            className="text-gray-900"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(16px, 3.5vw, 23.08px)',
              lineHeight: '31.32px',
              letterSpacing: '-1%'
            }}
          >
            Hey there, {userName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Pulse check — your data's got something to say.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button 
            className="px-4 py-2 text-white rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#3D0E8B' }}
          >
            Customize
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">{userInitials}</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">{userFullName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppBar