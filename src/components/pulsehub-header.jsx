// import React from "react";

// const DashboardHeader = ({ heading, subtext }) => {
//   return (
//     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
//       <div>
//         <h1
//           className="text-gray-900"
//           style={{
//             fontFamily: 'Helvetica Neue, sans-serif',
//             fontWeight: 700,
//             fontStyle: "Bold",
//             fontSize: "25px",
//             lineHeight: "38px",
//             letterSpacing: "-1%",
//             color: "#272D37",
//           }}
//         >
//           {heading}
//         </h1>

//         {subtext && (
//           <p
//             className="text-gray-700"
//             style={{
//               fontFamily: 'Helvetica Neue, sans-serif',
//               fontWeight: 500,
//               fontStyle: "Medium",
//               fontSize: "18px",
//               lineHeight: "38px",
//               letterSpacing: "-1%",
//               marginTop: "-6px",
//             }}
//           >
//             {subtext}
//           </p>
//         )}
//       </div>

//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
//         {/* Timeframe Button */}
//         <div
//           className="px-4 py-2 bg-white rounded-lg border text-sm text-gray-600"
//           style={{ borderColor: "#DAE0E6" }}
//         >
//           Timeframe w/wo comparison
//         </div>

//         {/* Export Button */}
//         <button
//           className="px-4 py-2 text-white rounded-lg transition-colors"
//           style={{ backgroundColor: "#3D0E8B" }}
//         >
//           Export
//         </button>

//         {/* Three-Dot Button */}
//         <button
//           className="p-2 bg-white hover:bg-gray-50 rounded-lg border transition-colors"
//           style={{ borderColor: "#DAE0E6" }}
//         >
//           <svg
//             className="w-5 h-5 text-gray-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;

"use client"

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const DashboardHeader = ({ heading, subtext, exportOptions, onExport }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportClick = (format) => {
    setIsDropdownOpen(false);
    if (onExport) {
      onExport(format);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
      <div>
        <h1
          className="text-gray-900"
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontWeight: 700,
            fontStyle: "Bold",
            fontSize: "25px",
            lineHeight: "38px",
            letterSpacing: "-1%",
            color: "#272D37",
          }}
        >
          {heading}
        </h1>

        {subtext && (
          <p
            className="text-gray-700"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 500,
              fontStyle: "Medium",
              fontSize: "18px",
              lineHeight: "38px",
              letterSpacing: "-1%",
              marginTop: "-6px",
            }}
          >
            {subtext}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Timeframe Button */}
        <div
          className="px-4 py-2 bg-white rounded-lg border text-sm text-gray-600"
          style={{ borderColor: "#DAE0E6" }}
        >
          Timeframe w/wo comparison
        </div>

        {/* Export Button with Dropdown */}
        {exportOptions && exportOptions.length > 0 ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#3D0E8B" }}
            >
              Export
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {exportOptions.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExportClick(format)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors uppercase"
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: "#3D0E8B" }}
          >
            Export
          </button>
        )}

        {/* Three-Dot Button */}
        <button
          className="p-2 bg-white hover:bg-gray-50 rounded-lg border transition-colors"
          style={{ borderColor: "#DAE0E6" }}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;