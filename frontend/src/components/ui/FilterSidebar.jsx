// components/FilterSidebar.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Sliders } from 'lucide-react';

const FilterSidebar = ({ filters, handleFilterChange, categories, colors, patterns, brands }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    colors: true,
    patterns: true,
    brands: true,
    price: true
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleClearFilters = () => {
   
    if (typeof handleFilterChange === 'function') {
      const event = {
        target: { name: 'clear', value: '' }
      };
      handleFilterChange(event);
    }
  };

  const FilterSection = ({ title, name, children }) => (
    <div className="border-b border-gray-200 py-4">
      <div
        className="flex justify-between items-center cursor-pointer poppins-regular"
        onClick={() => toggleSection(name)}
      >
        <h3 className="font-medium text-gray-800">{title}</h3>
        {expandedSections[name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {expandedSections[name] && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center poppins-regular"
        >
          <Sliders size={24} />
        </button>
      </div>

      {/* Main Sidebar */}
      <div className={`fixed top-32 left-0 w-full md:w-1/5 h-full bg-white z-20 transform transition-transform duration-300 ease-in-out overflow-y-auto border-r border-gray-200 ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 poppins-regular">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <div className="flex gap-2">
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
              <button
                className="md:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <FilterSection title="Categories" name="categories">
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category === cat}
                    onChange={() => {
                      const event = {
                        target: { name: 'category', value: filters.category === cat ? '' : cat }
                      };
                      handleFilterChange(event);
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Colors" name="colors">
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => {
                // Convert color names to actual CSS colors
                const colorMap = {
                  'Red': '#ff0000',
                  'Blue': '#0000ff',
                  'Green': '#00ff00',
                  'Yellow': '#ffff00',
                  'Black': '#000000',
                  'White': '#ffffff',
                  'Purple': '#800080',
                  'Orange': '#ffa500',
                  'Pink': '#ffc0cb',
                  'Gray': '#808080'
                };

                const bgColor = colorMap[color] || color;

                return (
                  <div
                    key={color}
                    onClick={() => {
                      const event = {
                        target: { name: 'color', value: filters.color === color ? '' : color }
                      };
                      handleFilterChange(event);
                    }}
                    className={`relative h-8 w-8 rounded-full cursor-pointer flex items-center justify-center ${color === 'White' ? 'border border-gray-200' : ''}`}
                    style={{ backgroundColor: bgColor }}
                  >
                    {filters.color === color && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <span className={`text-xs ${['White', 'Yellow'].includes(color) ? 'text-black' : 'text-white'}`}>✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FilterSection>

          <FilterSection title="Patterns" name="patterns">
            <div className="space-y-2">
              {patterns.map((pat) => (
                <label key={pat} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pattern"
                    checked={filters.pattern === pat}
                    onChange={() => {
                      const event = {
                        target: { name: 'pattern', value: pat }
                      };
                      handleFilterChange(event);
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{pat}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Brands" name="brands">
            <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
              {brands.map((b) => (
                <label key={b} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands && filters.brands.includes(b)}
                    onChange={() => {
                      const currentBrands = filters.brands || [];
                      let newBrands;

                      if (currentBrands.includes(b)) {
                        newBrands = currentBrands.filter(brand => brand !== b);
                      } else {
                        newBrands = [...currentBrands, b];
                      }

                      const event = {
                        target: { name: 'brands', value: newBrands }
                      };
                      handleFilterChange(event);
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{b}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price Range" name="price">
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>₹10</span>
                <span>₹{filters.price || 200}</span>
              </div>
              <input
                type="range"
                name="price"
                min="10"
                max="200"
                value={filters.price || 200}
                onChange={handleFilterChange}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between mt-4">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="700"
                    max="8000"
                    value={filters.minPrice || 10}
                    onChange={(e) => {
                      const event = {
                        target: { name: 'minPrice', value: e.target.value }
                      };
                      handleFilterChange(event);
                    }}
                    className="pl-7 pr-2 py-1 border rounded w-24 text-sm"
                  />
                </div>
                <span className="text-gray-500 mx-2">-</span>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500">$</span>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={filters.price || 200}
                    onChange={(e) => {
                      const event = {
                        target: { name: 'price', value: e.target.value }
                      };
                      handleFilterChange(event);
                    }}
                    className="pl-7 pr-2 py-1 border rounded w-24 text-sm"
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          <div className="mt-6">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors md:hidden poppins-regular"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
