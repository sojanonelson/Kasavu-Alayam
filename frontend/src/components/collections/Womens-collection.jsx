import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Filter,
  ShoppingBag,
  X,
  Search,
  Grid3X3,
  List,
  ChevronUp,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import ScrolledNavbar from "../../components/ScrolledNavbar";
import products from "../../Data/womens-collection";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../pages/Cart/cartSlice";
import { Helmet } from "react-helmet";
import ProductCard from "../ProductCard";
import EmptyResults from "../ui/EmptyResults";
import Pagination from "../ui/Pagination";

const FILTER_OPTIONS = {
  CATEGORIES: ["Dresses", "Tops", "Skirts", "Jackets"],
  COLORS: ["White", "Black", "Pink", "Red"],
  PATTERNS: ["Solid", "Floral", "Polka Dot", "Striped"],
  BRANDS: ["Brand X", "Brand Y", "Brand Z"],
  SORT_OPTIONS: [
    "Popularity",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ],
};

const FilterSidebar = ({
  filters,
  handleFilterChange,
  clearFilters,
  isMobile = false,
}) => {
  return (
    <div className="p-4">
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {FILTER_OPTIONS.CATEGORIES.map((category) => (
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
              onClick={() => handleFilterChange("category", "")}
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
          {FILTER_OPTIONS.COLORS.map((color) => (
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
              onClick={() => handleFilterChange("color", "")}
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
          {FILTER_OPTIONS.PATTERNS.map((pattern) => (
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
              onClick={() => handleFilterChange("pattern", "")}
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
          {FILTER_OPTIONS.BRANDS.map((brand) => (
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
              onClick={() => handleFilterChange("brand", "")}
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

const FilterTags = ({ filters, handleFilterChange, clearFilters }) => (
  <div className="flex flex-wrap items-center gap-2 mb-6">
    <span className="text-sm text-gray-500">Applied filters:</span>
    {Object.entries(filters).map(([key, value]) => {
      if (!value || key === "search" || (key === "price" && value === 100))
        return null;
      return (
        <span
          key={key}
          className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center"
        >
          {key === "price" ? `Under ₹${value}` : value}
          <button
            onClick={() => handleFilterChange(key, key === "price" ? 100 : "")}
            className="ml-2"
          >
            <X size={14} />
          </button>
        </span>
      );
    })}
    <button
      onClick={clearFilters}
      className="text-sm text-blue-600 hover:underline"
    >
      Clear all
    </button>
  </div>
);

const WomensCollection = () => {
  // State management
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    pattern: "",
    brand: "",
    price: 100,
    search: "",
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Popularity");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Redux hooks
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  // Derived state
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(
        ([key, value]) => value && key !== "price" && key !== "search"
      ).length + (filters.price < 100 ? 1 : 0),
    [filters]
  );

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((name, value) => {
    // If name is an event, extract name and value
    if (name.target) {
      const { name: eventName, value: eventValue } = name.target;
      setFilters((prev) => ({ ...prev, [eventName]: eventValue }));
      setCurrentPage(1); // Reset to page 1 when filter changes
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setCurrentPage(1); // Reset to page 1 when filter changes
    }
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      handleFilterChange("search", e.target.value);
      setCurrentPage(1); // Reset to page 1 when search changes
    },
    [handleFilterChange]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      category: "",
      color: "",
      pattern: "",
      brand: "",
      price: 100,
      search: "",
    });
    setCurrentPage(1); // Reset to page 1 when filters are cleared
  }, []);

  // Wishlist and cart handlers
  const toggleWishlist = useCallback(
    (id) =>
      setWishlist((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      ),
    []
  );

  const toggleCart = useCallback(
    (product) => {
      const existingItem = cart.find((item) => item.id === product.id);
      existingItem
        ? dispatch(removeFromCart(product))
        : dispatch(addToCart(product));
    },
    [cart, dispatch]
  );

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          (!filters.category || product.category === filters.category) &&
          (!filters.color || product.color === filters.color) &&
          (!filters.pattern || product.pattern === filters.pattern) &&
          (!filters.brand || product.brand === filters.brand) &&
          product.price <= filters.price &&
          (!filters.search ||
            product.title
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(filters.search.toLowerCase()))
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "Price: Low to High":
            return a.price - b.price;
          case "Price: High to Low":
            return b.price - a.price;
          case "Newest First":
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return b.popularity - a.popularity;
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
        <link
          rel="canonical"
          href="https://kasavuaalayam.com/collections/women"
        />
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
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
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
      <div className="hidden md:block fixed left-0 top-0 pt-28 h-full w-1/5 bg-white shadow-sm overflow-y-auto">
        <FilterSidebar
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />
      </div>

      <div className="md:ml-[20%] px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-28 mb-6 gap-4">
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            / <span>Women's Collection</span>
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
          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${
                  view === "grid"
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                } transition-colors`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${
                  view === "list"
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                } transition-colors`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>

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
                    {FILTER_OPTIONS.SORT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          sortBy === option ? "bg-gray-100 font-medium" : ""
                        }`}
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
        {activeFilterCount > 0 && (
          <FilterTags
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />
        )}

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} results found
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            {view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
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
                {paginatedProducts.map((product) => (
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

            {filteredProducts.length > productsPerPage && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
        ) : (
          <EmptyResults clearFilters={clearFilters} />
        )}
      </div>

      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 md:right-10 z-40 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </div>
  );  
};  

export default WomensCollection;
