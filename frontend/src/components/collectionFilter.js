// components/FilterSidebar.jsx
import React from "react";

const FilterSidebar = ({ filters, selectedFilters, onFilterChange }) => {
  const handleCheckboxChange = (category, value) => {
    const current = selectedFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...selectedFilters, [category]: updated });
  };

  return (
    <div className="w-full md:w-64 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 mb-6 md:mb-0 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
      </div>

      {/* Filter Categories */}
      <div className="space-y-6">
        {Object.entries(filters).map(([category, values]) => (
          <div key={category} className="group">
            {/* Category Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-700 capitalize text-sm uppercase tracking-wide flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {category}
              </h3>
            </div>

            {/* Filter Options */}
            <div className="space-y-2 pl-4 border-l-2 border-gray-100">
              {values.map((value) => {
                const isSelected = selectedFilters[category]?.includes(value) || false;
                return (
                  <label 
                    key={value} 
                    className="flex items-center group/item cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 ease-in-out"
                  >
                    {/* Custom Checkbox */}
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(category, value)}
                        className="sr-only"
                      />
                      <div className={`
                        w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600 shadow-md' 
                          : 'border-gray-300 group-hover/item:border-blue-400 bg-white'
                        }
                      `}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Label Text */}
                    <span className={`
                      text-sm font-medium transition-colors duration-200 select-none
                      ${isSelected 
                        ? 'text-blue-700' 
                        : 'text-gray-600 group-hover/item:text-gray-800'
                      }
                    `}>
                      {value}
                    </span>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with selected count */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {Object.values(selectedFilters).flat().length} filters selected
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;