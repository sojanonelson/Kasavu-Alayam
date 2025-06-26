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
    <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm mb-6 md:mb-0">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      {Object.entries(filters).map(([category, values]) => (
        <div key={category} className="mb-4">
          <p className="font-medium capitalize">{category}</p>
          {values.map((value) => (
            <label key={value} className="flex items-center mt-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFilters[category]?.includes(value) || false}
                onChange={() => handleCheckboxChange(category, value)}
                className="mr-2"
              />
              {value}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;
