import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Heart, X, Search, Grid3X3, List, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import Navbar from '../Navbar';
import ScrolledNavbar from '../ScrolledNavbar';
import FilterSidebar from '../ui/FilterSidebar';

// Update the categories array - only 3 categories as requested
const categories = ['Dhoti', 'Shirts', 'T-Shirts'];
const colors = ['White', 'Black', 'Blue', 'Red'];
const patterns = ['Solid', 'Striped', 'Checked'];
const brands = ['Brand A', 'Brand B', 'Brand C'];
const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest First'];

// Updated product data with Google image URLs
const products = [
  {
    id: 1,
    title: "Traditional Cotton Dhoti",
    category: "Dhoti",
    price: 45,
    originalPrice: 60,
    color: "White",
    pattern: "Solid",
    brand: "Brand A",
    popularity: 4.5,
    createdAt: "2024-09-10",
    image: "https://m.media-amazon.com/images/I/71jvQpjLmML._AC_UL480_FMwebp_QL65_.jpg",
    description: "Traditional pure cotton dhoti with gold border, perfect for festivals and ceremonies."
  },
  {
    id: 2,
    title: "Premium Silk Dhoti",
    category: "Dhoti",
    price: 85,
    originalPrice: 95,
    color: "White",
    pattern: "Solid",
    brand: "Brand B",
    popularity: 4.2,
    createdAt: "2024-09-15",
    image: "https://www.jiomart.com/images/product/original/rvrgwpjvsp/style-360-cotton-white-solid-dhoti-product-images-rvrgwpjvsp-0-202209240121.jpg",
    description: "Luxurious silk dhoti with traditional design, ideal for special occasions."
  },
  {
    id: 3,
    title: "Casual Linen Dhoti",
    category: "Dhoti",
    price: 35,
    originalPrice: 40,
    color: "Blue",
    pattern: "Solid",
    brand: "Brand C",
    popularity: 3.9,
    createdAt: "2024-09-20",
    image: "https://www.jiomart.com/images/product/original/rvbvq9tdwn/s9-store-white-cotton-solid-dhoti-product-images-rvbvq9tdwn-0-202206080522.jpg",
    description: "Lightweight linen dhoti for everyday casual wear."
  },
  {
    id: 4,
    title: "Formal White Shirt",
    category: "Shirts",
    price: 50,
    originalPrice: 65,
    color: "White",
    pattern: "Solid",
    brand: "Brand A",
    popularity: 4.7,
    createdAt: "2024-09-05",
    image: "https://m.media-amazon.com/images/I/61MK+FS84RL._AC_UL480_FMwebp_QL65_.jpg",
    description: "Classic white formal shirt with regular fit, perfect for office and formal events."
  },
  {
    id: 5,
    title: "Casual Checkered Shirt",
    category: "Shirts",
    price: 40,
    originalPrice: 55,
    color: "Blue",
    pattern: "Checked",
    brand: "Brand B",
    popularity: 4.3,
    createdAt: "2024-09-12",
    image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/shirt/b/v/p/l-st2-vebnor-original-imagpv9ahv9rsmnr.jpeg",
    description: "Stylish checkered shirt for casual outings and weekend wear."
  },
  {
    id: 6,
    title: "Linen Cotton Blend Shirt",
    category: "Shirts",
    price: 60,
    originalPrice: 75,
    color: "Black",
    pattern: "Solid",
    brand: "Brand C",
    popularity: 4.0,
    createdAt: "2024-09-18",
    image: "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/17187540/2022/2/17/a0e0dfe4-799c-4ad4-864c-503d3067566d1645099524664RoadsterMenBlackPureCottonSustainableCasualShirt2.jpg",
    description: "Premium linen-cotton blend shirt for maximum comfort in any weather."
  },
  {
    id: 7,
    title: "Basic Crew Neck T-Shirt",
    category: "T-Shirts",
    price: 25,
    originalPrice: 30,
    color: "Black",
    pattern: "Solid",
    brand: "Brand A",
    popularity: 4.6,
    createdAt: "2024-09-08",
    image: "https://assets.ajio.com/medias/sys_master/root/20230602/vHip/6479d136d55b7d0c63421460/-473Wx593H-464419395-black-MODEL.jpg",
    description: "Essential crew neck t-shirt made from 100% cotton for everyday comfort."
  },
  {
    id: 8,
    title: "Graphic Print T-Shirt",
    category: "T-Shirts",
    price: 30,
    originalPrice: 40,
    color: "Red",
    pattern: "Solid",
    brand: "Brand B",
    popularity: 4.1,
    createdAt: "2024-09-14",
    image: "https://www.jiomart.com/images/product/original/rvomvpspvy/eyebogler-men-s-red-typography-printed-cotton-t-shirt-product-images-rvomvpspvy-0-202207051929.jpg",
    description: "Trendy graphic print t-shirt with modern design for a stylish casual look."
  },
  {
    id: 9,
    title: "Striped Polo T-Shirt",
    category: "T-Shirts",
    price: 35,
    originalPrice: 45,
    color: "Blue",
    pattern: "Striped",
    brand: "Brand C",
    popularity: 4.4,
    createdAt: "2024-09-22",
    image: "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/23049302/2023/5/5/9fb21207-ceb9-496c-9508-ae96ee9122871683282682632RoadsterMenWhiteStripedPocketsPoloCollarPureCottonT-shirt1.jpg",
    description: "Classic striped polo t-shirt, perfect for casual outings and semi-formal occasions."
  }
];

// Product Card Component
const ProductCard = ({ product, isListView, wishlist, toggleWishlist }) => {
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const colorDots = ['White', 'Black', 'Blue', 'Red']
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
              className="flex-1 bg-gray-800 hover:bg-black text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300"
              aria-label="Add to cart"
            >
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
            className="flex-1 bg-gray-800 hover:bg-black text-white py-1.5 text-xs rounded-md flex items-center justify-center gap-1 transition-all duration-300"
            aria-label="Add to cart"
          >
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
const MensCollection = () => {
  const [filters, setFilters] = useState({
    category: [],
    color: '',
    pattern: '',
    brand: [],
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
  const [itemsPerPage] = useState(9);
  const [expandedSections, setExpandedSections] = useState(categories.reduce((acc, cat) => {
    acc[cat] = true; // All sections expanded by default
    return acc;
  }, {}));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      if (name === 'category' || name === 'brand') {
        return {
          ...prev,
          [name]: prev[name].includes(value)
            ? prev[name].filter((item) => item !== value)
            : [...prev[name], value]
        };
      }
      return { ...prev, [name]: value };
    });
    setCurrentPage(1); // Reset to the first page when filters change
  }, []);

  const toggleWishlist = useCallback(id => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  }, []);

  const handleSearchChange = useCallback(e => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1); // Reset to the first page when search changes
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ category: [], color: '', pattern: '', brand: [], price: 100, search: '' });
    setCurrentPage(1); // Reset to the first page when filters are cleared
  }, []);

  const toggleSection = (category) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const activeFilterCount = useMemo(() =>
    Object.entries(filters)
      .filter(([key, value]) => (Array.isArray(value) ? value.length > 0 : value) && key !== 'price' && key !== 'search')
      .length + (filters.price < 100 ? 1 : 0),
    [filters]
  );

  // Group products by category
  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = products
        .filter(product => product.category === category)
        .filter(product => {
          return (
            (filters.category.length ? filters.category.includes(product.category) : true) &&
            (filters.color ? product.color === filters.color : true) &&
            (filters.pattern ? product.pattern === filters.pattern : true) &&
            (filters.brand.length ? filters.brand.includes(product.brand) : true) &&
            product.price <= filters.price &&
            (filters.search ?
              product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
              product.category.toLowerCase().includes(filters.search.toLowerCase()) :
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

      return acc;
    }, {});
  }, [filters, sortBy]);

  // Calculate total filtered products
  const totalFilteredProducts = useMemo(() =>
    Object.values(productsByCategory)
      .flat()
      .length,
    [productsByCategory]
  );

  // Pagination calculations
  const paginatedProducts = useMemo(() => {
    const allProducts = Object.values(productsByCategory).flat();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [productsByCategory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);

  return (
    <div className="relative bg-gray-50 min-h-screen">
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
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                handleFilterChange={handleFilterChange}
                categories={categories}
                colors={colors}
                patterns={patterns}
                brands={brands}
                clearFilters={clearFilters}
              />
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-black text-white py-3 rounded-md mt-6"
              >
                Apply Filters ({totalFilteredProducts} results)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        />
      </div>

      <div className="md:ml-[20%] px-4 md:px-10 py-6">
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-28 mb-6 gap-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link> / <span>Men's Collection</span>
          </div>

          {/* Search */}
          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
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

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 w-48"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${sortBy === option ? 'bg-gray-100' : ''}`}
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
          <p className="text-sm text-gray-500">{totalFilteredProducts} results found</p>
        </div>

        {/* Section-based Product Display */}
        {totalFilteredProducts === 0 ? (
          <EmptyResults clearFilters={clearFilters} />
        ) : (
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
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalFilteredProducts > itemsPerPage && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
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

export default MensCollection;
