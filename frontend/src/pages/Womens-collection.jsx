import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronDown, Filter, Heart, ShoppingBag, X, Search, 
  Grid3X3, List, ChevronLeft, ChevronRight, ChevronUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ScrolledNavbar from '../components/ScrolledNavbar';
import products from '../Data/womens-collection';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/features/cart/cartSlice';
import { Helmet } from 'react-helmet';

// Constants moved to separate object for better organization
const FILTER_OPTIONS = {
  CATEGORIES: ['Dresses', 'Tops', 'Skirts', 'Jackets'],
  COLORS: ['White', 'Black', 'Pink', 'Red'],
  PATTERNS: ['Solid', 'Floral', 'Polka Dot', 'Striped'],
  BRANDS: ['Brand X', 'Brand Y', 'Brand Z'],
  SORT_OPTIONS: ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest First']
};

// Separate FilterSidebar component
const FilterSidebar = ({ filters, handleFilterChange, clearFilters, isMobile = false }) => {
  return (
    <div className="p-4">
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {FILTER_OPTIONS.CATEGORIES.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
          {filters.category && (
            <button
              onClick={() => handleFilterChange('category', '')}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Color</h3>
        <div className="space-y-2">
          {FILTER_OPTIONS.COLORS.map(color => (
            <label key={color} className="flex items-center">
              <input
                type="radio"
                name="color"
                value={color}
                checked={filters.color === color}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <div className="flex items-center">
                <span 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                <span className="text-sm">{color}</span>
              </div>
            </label>
          ))}
          {filters.color && (
            <button
              onClick={() => handleFilterChange('color', '')}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Pattern Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Pattern</h3>
        <div className="space-y-2">
          {FILTER_OPTIONS.PATTERNS.map(pattern => (
            <label key={pattern} className="flex items-center">
              <input
                type="radio"
                name="pattern"
                value={pattern}
                checked={filters.pattern === pattern}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <span className="text-sm">{pattern}</span>
            </label>
          ))}
          {filters.pattern && (
            <button
              onClick={() => handleFilterChange('pattern', '')}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Brand</h3>
        <div className="space-y-2">
          {FILTER_OPTIONS.BRANDS.map(brand => (
            <label key={brand} className="flex items-center">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={filters.brand === brand}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
          {filters.brand && (
            <button
              onClick={() => handleFilterChange('brand', '')}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium">Price</h3>
          <span className="text-sm">₹{filters.price}</span>
        </div>
        <input
          type="range"
          name="price"
          min="10"
          max="100"
          value={filters.price}
          onChange={handleFilterChange}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">₹10</span>
          <span className="text-xs text-gray-500">₹100</span>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={clearFilters}
        className="w-full bg-gray-100 text-gray-800 border py-2 rounded-md mt-4 hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>

      {isMobile && (
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => {}}
            className="w-full bg-black text-white py-3 rounded-md"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, isListView, wishlist, toggleWishlist, toggleCart }) => {
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const colorDots = ['White', 'Black', 'Pink', 'Red']
    .slice(0, product.id % 4 + 1)
    .map(color => (
      <span
        key={color}
        className={`${isListView ? 'w-4 h-4' : 'w-3 h-3'} rounded-full`}
        style={{ backgroundColor: color.toLowerCase() }}
      />
    ));

  if (isListView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden flex"
      >
        <div className="relative w-1/3 group">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-all duration-300" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              fill={wishlist.includes(product.id) ? "#f43f5e" : "none"}
              stroke={wishlist.includes(product.id) ? "#f43f5e" : "currentColor"}
            />
          </button>
        </div>
        <div className="p-4 flex-1">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className="text-md font-medium">{product.title}</h3>
            </div>
            <div className="text-right">
              <p className="text-md font-bold">₹{product.price}</p>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 line-through">₹{product.originalPrice}</p>
                  <p className="text-xs text-green-600">{discountPercent}% off</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {product.description || `Stylish ${product.category} with a ${product.pattern} pattern.`}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-1">{colorDots}</div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCart(product)}
              className="flex-1 bg-gray-800 hover:bg-black text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300"
              aria-label="Buy now"
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden group relative"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md z-10 transform transition-transform duration-300 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            size={16}
            fill={wishlist.includes(product.id) ? "#f43f5e" : "none"}
            stroke={wishlist.includes(product.id) ? "#f43f5e" : "currentColor"}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-sm font-medium line-clamp-1">{product.title}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-sm font-bold">₹{product.price}</p>
          {product.originalPrice && (
            <>
              <p className="text-xs text-gray-500 line-through">₹{product.originalPrice}</p>
              <p className="text-xs text-green-600">{discountPercent}% off</p>
            </>
          )}
        </div>
        <div className="flex mt-2 gap-1">{colorDots}</div>
        <div className="flex gap-2 mt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCart(product)}
            className="flex-1 bg-gray-800 hover:bg-black text-white py-1.5 text-xs rounded-md flex items-center justify-center gap-1 transition-all duration-300"
            aria-label="Add to cart"
          >
            <ShoppingBag size={12} />
            Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 text-xs rounded-md flex items-center justify-center transition-all duration-300"
            aria-label="Buy now"
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Tags Component
const FilterTags = ({ filters, handleFilterChange, clearFilters }) => (
  <div className="flex flex-wrap items-center gap-2 mb-6">
    <span className="text-sm text-gray-500">Applied filters:</span>
    {Object.entries(filters).map(([key, value]) => {
      if (!value || key === 'search' || (key === 'price' && value === 100)) return null;
      return (
        <span key={key} className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center">
          {key === 'price' ? `Under ₹${value}` : value}
          <button onClick={() => handleFilterChange(key, key === 'price' ? 100 : '')} className="ml-2">
            <X size={14} />
          </button>
        </span>
      );
    })}
    <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
      Clear all
    </button>
  </div>
);

// Pagination Component
const Pagination = ({ currentPage = 1, totalPages = 10 }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page and nearby pages, last page
      pages.push(1);
      
      // Show ellipsis if current page is far from first page
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Show ellipsis if current page is far from last page
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center mt-10 mb-10">
      <div className="flex items-center gap-2">
        <button 
          className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {renderPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              className={`w-10 h-10 border rounded-md flex items-center justify-center transition-colors ${
                page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Empty Results Component
const EmptyResults = ({ clearFilters }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Search size={48} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium mb-3">No products found</h3>
    <p className="text-gray-500 text-center max-w-md mb-8">
      We couldn't find any products matching your current filters. 
      Try adjusting your filters or search term.
    </p>
    <button
      onClick={clearFilters}
      className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
    >
      Clear All Filters
    </button>
  </div>
);

// Main Component
const WomensCollection = () => {
  // State management
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    pattern: '',
    brand: '',
    price: 100,
    search: ''
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('Popularity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Redux hooks
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);

  // Derived state
  const cartCount = useMemo(() => (
    cart.reduce((total, item) => total + item.quantity, 0)
  ), [cart]);
  
  const activeFilterCount = useMemo(() =>
    Object.entries(filters)
      .filter(([key, value]) => value && key !== 'price' && key !== 'search')
      .length + (filters.price < 100 ? 1 : 0),
    [filters]
  );

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((name, value) => {
    // If name is an event, extract name and value
    if (name.target) {
      const { name: eventName, value: eventValue } = name.target;
      setFilters(prev => ({ ...prev, [eventName]: eventValue }));
      setCurrentPage(1); // Reset to page 1 when filter changes
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
      setCurrentPage(1); // Reset to page 1 when filter changes
    }
  }, []);
  
  const handleSearchChange = useCallback(e => {
    handleFilterChange('search', e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  }, [handleFilterChange]);
  
  const clearFilters = useCallback(() => {
    setFilters({ category: '', color: '', pattern: '', brand: '', price: 100, search: '' });
    setCurrentPage(1); // Reset to page 1 when filters are cleared
  }, []);

  // Wishlist and cart handlers
  const toggleWishlist = useCallback(id => 
    setWishlist(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]), 
  []);

  const toggleCart = useCallback(product => {
    const existingItem = cart.find(item => item.id === product.id);
    existingItem ? dispatch(removeFromCart(product)) : dispatch(addToCart(product));
  }, [cart, dispatch]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => (
        (!filters.category || product.category === filters.category) &&
        (!filters.color || product.color === filters.color) &&
        (!filters.pattern || product.pattern === filters.pattern) &&
        (!filters.brand || product.brand === filters.brand) &&
        product.price <= filters.price &&
        (!filters.search ||
          product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.category.toLowerCase().includes(filters.search.toLowerCase()))
      ))
      .sort((a, b) => {
        switch(sortBy) {
          case 'Price: Low to High': return a.price - b.price;
          case 'Price: High to Low': return b.price - a.price;
          case 'Newest First': return new Date(b.createdAt) - new Date(a.createdAt);
          default: return b.popularity - a.popularity;
        }
      });
  }, [filters, sortBy]);

  // Pagination calculations
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Kasavu Aalayam | Women's Collection</title>
        <meta 
          name="description" 
          content="Discover the finest traditional Indian wear at Kasavu Aalayam. Explore premium silk sarees, ethnic wear collections for women, and exquisite bridal wear." 
        />
        <meta 
          name="keywords" 
          content="kasavu, sarees, traditional wear, indian fashion, silk sarees, ethnic wear, women's collection" 
        />
        <link rel="canonical" href="https://kasavuaalayam.com/collections/women" />
      </Helmet>

      {isScrolled ? <ScrolledNavbar /> : <Navbar />}

      {/* Mobile Filter Button */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg flex items-center justify-center transform transition-transform hover:scale-105"
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
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-auto md:hidden"
          >
            <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-lg font-medium">Filters</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 pt-28 h-full w-1/5 bg-white shadow-sm overflow-y-auto">
        <FilterSidebar
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />
      </div>

      <div className="md:ml-[20%] px-4 md:px-10 py-6">
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-28 mb-6 gap-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link> / <span>Women's Collection</span>
          </div>

          <div className="top-4 right-4 z-10 flex items-center">
            <Link to="/cart">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* View Toggle and Sort */}
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'} transition-colors`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 ${view === 'list' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'} transition-colors`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm">Sort: {sortBy}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 w-48"
                  >
                    {FILTER_OPTIONS.SORT_OPTIONS.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${sortBy === option ? 'bg-gray-100 font-medium' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Applied Filters */}
        {activeFilterCount > 0 && (
          <FilterTags 
            filters={filters} 
            handleFilterChange={handleFilterChange} 
            clearFilters={clearFilters} 
          />
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">{filteredProducts.length} results found</p>
        </div>

        {/* Grid or List View */}
        {filteredProducts.length > 0 ? (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isListView={false}
                    wishlist={wishlist} 
                    toggleWishlist={toggleWishlist}
                    toggleCart={toggleCart}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isListView={true}
                    wishlist={wishlist} 
                    toggleWishlist={toggleWishlist}
                    toggleCart={toggleCart}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
        ) : (
          <EmptyResults clearFilters={clearFilters} />
        )}
      </div>
      
      {/* Floating "Back to top" button */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 md:right-10 z-40 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </div>
  );
};

export default WomensCollection;