"use client"

const AuditTopicCard = ({ title, subtitle, isChecked, onChange }) => {
  return (
    <div
      className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg 
      hover:border-[#3D0E8B] hover:bg-[#3D0E8B]/5 transition-all cursor-pointer group"
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-[#3D0E8B] border-gray-300 rounded focus:ring-[#3D0E8B] cursor-pointer"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {/* 🌐 Browser / Globe Icon */}
          <svg
            className="w-5 h-5 text-gray-700 group-hover:text-[#3D0E8B] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.5 0 4.5 4 4.5 9s-2 9-4.5 9-4.5-4-4.5-9 2-9 4.5-9zm0 0v18m9-9H3"
            />
          </svg>

          <h4 className="font-semibold text-gray-900 text-sm group-hover:text-[#3D0E8B] transition-colors">
            {title}
          </h4>
        </div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  )
}

export default AuditTopicCard
