import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";

const FilterBar = ({ filters, selectedFilters, onFilterChange }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const initial = {};
      Object.keys(filters).forEach((key) => {
        initial[key] = true;
      });
      setExpandedCategories(initial);
    }
  }, [filters]);

  const handleCheckboxChange = (category, value) => {
    const current = selectedFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...selectedFilters, [category]: updated });
  };

  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };

  return (
    <>
      {/* Mobile Filter Button and Modal */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="w-full p-2 bg-white border-b border-gray-200 flex items-center justify-between"
        >
          <div className="flex items-center">
            <Filter className="mr-2" size={20} />
            <span className="font-bold">Filters</span>
          </div>
          {isMobileFilterOpen ? <X size={20} /> : <Filter size={20} />}
        </button>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-sm h-full p-2 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-1">
                {Object.entries(filters).map(([category, values]) => (
                  <div key={category} className="border-b border-gray-200 py-1">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      <h3 className="font-semibold text-gray-700 capitalize flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {category}
                      </h3>
                      <span className="lg:hidden">
                        {expandedCategories[category] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    </div>
                    {expandedCategories[category] && (
                      <div className="space-y-1 pl-4">
                        {values.map((value) => {
                          const isSelected =
                            selectedFilters[category]?.includes(value) || false;
                          return (
                            <label
                              key={value}
                              className="flex items-center cursor-pointer p-1"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleCheckboxChange(category, value)
                                }
                                className="mr-2"
                              />
                              <span
                                className={`text-sm font-medium ${
                                  isSelected
                                    ? "text-blue-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {value}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-1 border-t border-gray-200 text-center">
                <div className="text-xs text-gray-500">
                  {Object.values(selectedFilters).flat().length} filters selected
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="w-64 bg-white p-2 border-r border-gray-200 h-screen overflow-y-auto fixed">
        
          <div className="space-y-1">
            {Object.entries(filters).map(([category, values]) => (
              <div key={category} className="border-b border-gray-200 py-1">
                <div className="py-1">
                  <h3 className="font-semibold text-gray-700 capitalize flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {category}
                  </h3>
                </div>
                {expandedCategories[category] && (
                  <div className="space-y-1 pl-4">
                    {values.map((value) => {
                      const isSelected =
                        selectedFilters[category]?.includes(value) || false;
                      return (
                        <label
                          key={value}
                          className="flex items-center cursor-pointer p-1"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleCheckboxChange(category, value)
                            }
                            className="mr-2"
                          />
                          <span
                            className={`text-sm font-medium ${
                              isSelected
                                ? "text-blue-700"
                                : "text-gray-600"
                            }`}
                          >
                            {value}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 pt-1 border-t border-gray-200 text-center">
            <div className="text-xs text-gray-500">
              {Object.values(selectedFilters).flat().length} filters selected
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
