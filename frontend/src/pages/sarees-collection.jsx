import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, Heart, ShoppingBag, X, Search, Grid3X3, List } from 'lucide-react';
import Navbar from '../components/Navbar';
import ScrolledNavbar from '../components/ScrolledNavbar';
import FilterSidebar from '../components/ui/FilterSidebar';
import sarees from '../Data/sarees-collection';

// Filter options
const categories = ['Silk', 'Cotton', 'Handlooms', 'Kerala Sarees', 'Kanchipuram Sarees'];
const colors = ['Red', 'Blue', 'Darkgreen', 'Yellow', 'White', 'Gold'];
const patterns = ['Floral', 'Striped', 'Solid', 'Polka Dot'];
const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];
const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest First'];

const SareesSection = () => {
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    pattern: '',
    brand: '',
    price: 5000,
    search: ''
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('Popularity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]); // State to manage cart items
  const [activeColorFilter, setActiveColorFilter] = useState('');
  const [blur, setBlur] = useState(false); // State to manage blur effect

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter sarees based on all criteria
  const filteredSarees = sarees
    .filter((saree) => {
      return (
        (filters.category ? saree.category === filters.category : true) &&
        (filters.color ? saree.color === filters.color : true) &&
        (filters.pattern ? saree.pattern === filters.pattern : true) &&
        (filters.brand ? saree.brand === filters.brand : true) &&
        saree.price <= filters.price &&
        (filters.search ?
          saree.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          saree.category.toLowerCase().includes(filters.search.toLowerCase()) :
          true)
      );
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Newest First':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default: // Popularity
          return b.popularity - a.popularity;
      }
    });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color) => {
    if (activeColorFilter === color) {
      setFilters(prev => ({ ...prev, color: '' }));
      setActiveColorFilter('');
    } else {
      setFilters(prev => ({ ...prev, color }));
      setActiveColorFilter(color);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', color: '', pattern: '', brand: '', price: 5000, search: '' });
    setActiveColorFilter('');
  };

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleCart = (id) => {
    setCart(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
    setBlur(true); // Activate blur effect
    setTimeout(() => setBlur(false), 500); // Deactivate blur effect after 500ms
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters)
    .filter(([key, value]) => value && key !== 'price' && key !== 'search')
    .length + (filters.price < 5000 ? 1 : 0);

  return (
    <div className={`relative bg-gray-50 min-h-screen ${blur ? 'blur-sm' : ''}`}>
      {isScrolled ? <ScrolledNavbar /> : <Navbar />}

      {/* Mobile Filter Button */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <Filter size={20} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-auto md:hidden">
          <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
            <h2 className="text-lg font-medium">Filters</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
              <X size={24} />
            </button>
          </div>
          <div className="p-4">
            <FilterSidebar
              filters={filters}
              handleFilterChange={handleFilterChange}
              categories={categories}
              colors={colors}
              patterns={patterns}
              brands={brands}
              clearFilters={clearFilters}
              onColorSelect={handleColorSelect}
              activeColorFilter={activeColorFilter}
            />
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-black text-white py-3 rounded-md mt-6"
            >
              Apply Filters ({filteredSarees.length} results)
            </button>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 pt-28 h-full w-1/5 bg-white border-r overflow-y-auto">
        <FilterSidebar
          filters={filters}
          handleFilterChange={handleFilterChange}
          categories={categories}
          colors={colors}
          patterns={patterns}
          brands={brands}
          clearFilters={clearFilters}
          onColorSelect={handleColorSelect}
          activeColorFilter={activeColorFilter}
        />
      </div>

      <div className="md:ml-[20%] px-4 md:px-10 py-6">
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-28 mb-6 gap-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link> / <span>Sarees Collection</span>
          </div>

          {/* Search */}
          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search sarees..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* View Toggle and Sort */}
          <div className="flex items-center gap-4">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'bg-black text-white' : 'bg-white'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 ${view === 'list' ? 'bg-black text-white' : 'bg-white'}`}
              >
                <List size={18} />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 border rounded-md px-3 py-2"
              >
                <span className="text-sm">Sort: {sortBy}</span>
                <ChevronDown size={16} />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 w-48">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === option ? 'bg-gray-100' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Applied Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Applied filters:</span>
            {filters.category && (
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
                {filters.category}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                  className="ml-2"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.color && (
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
                {filters.color}
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, color: '' }));
                    setActiveColorFilter('');
                  }}
                  className="ml-2"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.pattern && (
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
                {filters.pattern}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, pattern: '' }))}
                  className="ml-2"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.brand && (
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
                {filters.brand}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, brand: '' }))}
                  className="ml-2"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.price < 5000 && (
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
                Under ₹{filters.price}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, price: 5000 }))}
                  className="ml-2"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">{filteredSarees.length} results found</p>
        </div>

        {/* Grid or List View */}
        {view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredSarees.map((saree) => (
              <motion.div
                key={saree.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border rounded-md overflow-hidden group"
              >
                <div className="relative hover:z-10 hover:scale-105 hover:shadow-lg transition-transform duration-300">
                  <img
                    src={saree.image}
                    alt={saree.title}
                    className="w-full object-cover aspect-[3/4]"
                  />
                  <button
                    onClick={() => toggleWishlist(saree.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
                  >
                    <Heart
                      size={16}
                      fill={wishlist.includes(saree.id) ? "#f43f5e" : "none"}
                      stroke={wishlist.includes(saree.id) ? "#f43f5e" : "currentColor"}
                    />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => toggleCart(saree.id)}
                      className="w-full bg-white text-black py-2 rounded-sm font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{saree.category}</p>
                  <h3 className="text-sm font-medium line-clamp-1">{saree.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-sm font-bold">₹{saree.price}</p>
                    {saree.originalPrice && (
                      <p className="text-xs text-gray-500 line-through">₹{saree.originalPrice}</p>
                    )}
                    {saree.originalPrice && (
                      <p className="text-xs text-green-600">
                        {Math.round((1 - saree.price / saree.originalPrice) * 100)}% off
                      </p>
                    )}
                  </div>
                  <div className="flex mt-2 gap-1">
                    {['Red', 'Blue', 'Green', 'Yellow'].slice(0, saree.id % 4 + 1).map(color => (
                      <span
                        key={color}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSarees.map((saree) => (
              <motion.div
                key={saree.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border rounded-md overflow-hidden flex"
              >
                <div className="relative w-1/3 hover:z-10 hover:scale-105 hover:shadow-lg transition-transform duration-300">
                  <img
                    src={saree.image}
                    alt={saree.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(saree.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
                  >
                    <Heart
                      size={16}
                      fill={wishlist.includes(saree.id) ? "#f43f5e" : "none"}
                      stroke={wishlist.includes(saree.id) ? "#f43f5e" : "currentColor"}
                    />
                  </button>
                </div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{saree.category}</p>
                      <h3 className="text-md font-medium">{saree.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-bold">₹{saree.price}</p>
                      {saree.originalPrice && (
                        <div className="flex flex-col">
                          <p className="text-xs text-gray-500 line-through">₹{saree.originalPrice}</p>
                          <p className="text-xs text-green-600">
                            {Math.round((1 - saree.price / saree.originalPrice) * 100)}% off
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {saree.description || `Beautiful ${saree.category} saree with ${saree.pattern} pattern. Perfect for special occasions and celebrations.`}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex gap-1">
                      {['Red', 'Blue', 'Green', 'Yellow'].slice(0, saree.id % 4 + 1).map(color => (
                        <span
                          key={color}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => toggleCart(saree.id)}
                      className="bg-black text-white px-4 py-2 rounded-sm text-sm ml-auto flex items-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredSarees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Search size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No sarees found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              We couldn't find any sarees matching your current filters. Try adjusting your filters or search term.
            </p>
            <button
              onClick={clearFilters}
              className="bg-black text-white px-6 py-2 rounded-md"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredSarees.length > 0 && (
          <div className="flex justify-center mt-10 mb-10">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 border rounded-md flex items-center justify-center bg-gray-100">
                &lt;
              </button>
              <button className="w-10 h-10 border rounded-md flex items-center justify-center bg-black text-white">
                1
              </button>
              <button className="w-10 h-10 border rounded-md flex items-center justify-center">
                2
              </button>
              <button className="w-10 h-10 border rounded-md flex items-center justify-center">
                3
              </button>
              <span className="w-10 h-10 flex items-center justify-center">...</span>
              <button className="w-10 h-10 border rounded-md flex items-center justify-center">
                10
              </button>
              <button className="w-10 h-10 border rounded-md flex items-center justify-center bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SareesSection;
