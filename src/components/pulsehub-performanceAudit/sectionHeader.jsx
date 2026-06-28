"use client"

const SectionHeader = ({ title, actions }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {actions && (
        <div className="flex space-x-2">
          {actions}
        </div>
      )}
    </div>
  )
}

export default SectionHeader