"use client"

const KPICards = ({ data }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      growth: "bg-green-100 text-green-700",
      loss: "bg-red-100 text-red-700",
      neutral: "bg-gray-100 text-gray-700"
    }
    
    const statusLabels = {
      growth: "Growth",
      loss: "Loss",
      neutral: "Neutral"
    }
    
    return (
      <div className={`inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md ${statusStyles[status]}`}>
        {statusLabels[status]}
      </div>
    )
  }

  const getTrendIndicator = (trend) => {
    if (!trend) return null
    
    const isPositive = trend.direction === 'up'
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    
    return (
      <div className="flex items-center ml-1 sm:ml-2">
        <svg
          className={`${color} mr-1`}
          fill="currentColor"
          viewBox="0 0 12 12"
          style={{ width: 'clamp(18px, 3.5vw, 24px)', height: 'clamp(18px, 3.5vw, 24px)' }}
        >
          {isPositive ? (
            <path d="M6 2L10 8H2L6 2Z" />
          ) : (
            <path d="M6 10L2 4H10L6 10Z" />
          )}
        </svg>
        <span className={`text-lg sm:text-xl lg:text-2xl xl:text-4xl ${color} font-bold`}>
          {trend.value}
        </span>
      </div>
    )
  }

  // Determine grid columns class based on data length
  const getGridClass = () => {
    switch(data.length) {
      case 2: return 'md:grid-cols-2'
      case 3: return 'md:grid-cols-3'
      case 4: return 'md:grid-cols-4'
      case 5: return 'md:grid-cols-5'
      case 6: return 'md:grid-cols-6'
      default: return 'md:grid-cols-3'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className={`grid grid-cols-1 ${getGridClass()} relative`}>
        {data.map((item, index) => (
          <div key={index} className="p-4 sm:p-6 text-left relative">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">{item.title}</h3>
            <div className="flex items-center mb-3">
              <div 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold" 
                style={{ color: item.valueColor || '#4323F8' }}
              >
                {item.value}
              </div>
              {getTrendIndicator(item.trend)}
            </div>
            {getStatusBadge(item.status)}

            {/* Vertical divider for md+ screens (not on last item) */}
            {index < data.length - 1 && (
              <div className="hidden md:block absolute top-[10%] right-0 h-[80%] w-[1px] bg-gray-200"></div>
            )}

            {/* Horizontal divider for small screens (not on last item) */}
            {index < data.length - 1 && (
              <div className="block md:hidden absolute bottom-0 left-[10%] w-[80%] h-[1px] bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KPICards

// USAGE EXAMPLES:

// Example 1: 3 cards (like in the dashboard)
/*
<KPICards data={[
  { 
    title: "Overall Grade", 
    value: "B+", 
    status: "growth", 
    valueColor: '#4323F8' 
  },
  { 
    title: "Pipeline", 
    value: "$7.1M", 
    trend: { direction: 'up', value: '5%' }, 
    status: "growth",
    valueColor: '#4323F8' 
  },
  { 
    title: "Revenue", 
    value: "$2.8M", 
    trend: { direction: 'down', value: '3%' }, 
    status: "loss",
    valueColor: '#4323F8' 
  }
]} />
*/

// Example 2: 4 cards
/*
<KPICards data={[
  { title: "Sales", value: "$50K", status: "growth" },
  { title: "Leads", value: "250", trend: { direction: 'up', value: '15%' }, status: "growth" },
  { title: "Conversion", value: "12%", status: "neutral" },
  { title: "ROI", value: "3.2x", trend: { direction: 'up', value: '8%' }, status: "growth" }
]} />
*/

// Example 3: 2 cards
/*
<KPICards data={[
  { title: "Active Users", value: "1,234", trend: { direction: 'up', value: '20%' }, status: "growth" },
  { title: "Churn Rate", value: "2.5%", trend: { direction: 'down', value: '0.5%' }, status: "loss" }
]} />
*/