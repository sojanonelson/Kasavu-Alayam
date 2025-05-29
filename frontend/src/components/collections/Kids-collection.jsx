import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Filter,
  X,
  Search,
  Grid3X3,
  List,
  ChevronUp,
} from "lucide-react";
import Navbar from "../Navbar";
import ScrolledNavbar from "../ScrolledNavbar";
import FilterSidebar from "../ui/FilterSidebar";
import ProductCard from "../ProductCard";
import EmptyResults from "../ui/EmptyResults";
import Pagination from "../ui/Pagination";

const categories = ["Dhoti", "Shirts", "Kurtha", "Festival Wear"];
const colors = ["White", "Blue", "Yellow", "Red", "Green", "Pink"];
const patterns = ["Solid", "Printed", "Embroidered", "Traditional"];
const brands = ["Kidsy", "Little Stars", "Junior Fashions", "Tiny Traditions"];
const ageGroups = ["2-4 years", "4-6 years", "6-8 years", "8-12 years"];
const sortOptions = [
  "Popularity",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
];

const products = [
  {
    id: 1,
    title: "Kids Cotton Dhoti",
    category: "Dhoti",
    price: 25,
    originalPrice: 35,
    color: "White",
    pattern: "Solid",
    brand: "Tiny Traditions",
    ageGroup: "4-6 years",
    popularity: 4.5,
    createdAt: "2024-09-15",
    image: "/api/placeholder/400/500",
    description: "Pure cotton dhoti with golden border for special occasions.",
  },
  {
    id: 2,
    title: "Festive Silk Dhoti",
    category: "Dhoti",
    price: 40,
    originalPrice: 50,
    color: "Yellow",
    pattern: "Traditional",
    brand: "Junior Fashions",
    ageGroup: "6-8 years",
    popularity: 4.7,
    createdAt: "2024-09-18",
    image: "/api/placeholder/400/500",
    description: "Premium silk dhoti with traditional design for festivals.",
  },
  {
    id: 3,
    title: "Boys Casual Dhoti",
    category: "Dhoti",
    price: 20,
    originalPrice: 30,
    color: "White",
    pattern: "Solid",
    brand: "Kidsy",
    ageGroup: "2-4 years",
    popularity: 4.0,
    createdAt: "2024-08-25",
    image: "/api/placeholder/400/500",
    description: "Comfortable cotton dhoti for everyday wear.",
  },
  {
    id: 4,
    title: "Kids Formal Shirt",
    category: "Shirts",
    price: 30,
    originalPrice: 40,
    color: "Blue",
    pattern: "Solid",
    brand: "Little Stars",
    ageGroup: "8-12 years",
    popularity: 4.6,
    createdAt: "2024-09-10",
    image: "/api/placeholder/400/500",
    description: "Stylish formal shirt for special occasions and events.",
  },
  {
    id: 5,
    title: "Boys Printed Shirt",
    category: "Shirts",
    price: 25,
    originalPrice: 35,
    color: "Green",
    pattern: "Printed",
    brand: "Kidsy",
    ageGroup: "4-6 years",
    popularity: 4.3,
    createdAt: "2024-09-05",
    image: "/api/placeholder/400/500",
    description: "Colorful printed shirt for casual outings and playdates.",
  },
  {
    id: 6,
    title: "Kids Linen Shirt",
    category: "Shirts",
    price: 35,
    originalPrice: 45,
    color: "White",
    pattern: "Solid",
    brand: "Junior Fashions",
    ageGroup: "6-8 years",
    popularity: 4.1,
    createdAt: "2024-08-30",
    image: "/api/placeholder/400/500",
    description: "Breathable linen shirt, perfect for summer days.",
  },
  {
    id: 7,
    title: "Boys Traditional Kurtha",
    category: "Kurtha",
    price: 45,
    originalPrice: 60,
    color: "Yellow",
    pattern: "Embroidered",
    brand: "Tiny Traditions",
    ageGroup: "8-12 years",
    popularity: 4.8,
    createdAt: "2024-09-20",
    image: "/api/placeholder/400/500",
    description: "Elegant embroidered kurtha for festivals and celebrations.",
  },
  {
    id: 8,
    title: "Kids Cotton Kurtha",
    category: "Kurtha",
    price: 35,
    originalPrice: 45,
    color: "Blue",
    pattern: "Solid",
    brand: "Little Stars",
    ageGroup: "4-6 years",
    popularity: 4.2,
    createdAt: "2024-09-12",
    image: "/api/placeholder/400/500",
    description: "Comfortable cotton kurtha with classic design.",
  },
  {
    id: 9,
    title: "Boys Festive Kurtha",
    category: "Kurtha",
    price: 50,
    originalPrice: 65,
    color: "Red",
    pattern: "Traditional",
    brand: "Junior Fashions",
    ageGroup: "6-8 years",
    popularity: 4.5,
    createdAt: "2024-09-08",
    image: "/api/placeholder/400/500",
    description: "Premium kurtha with traditional design for special occasions.",
  },
  {
    id: 10,
    title: "Kids Diwali Special Set",
    category: "Festival Wear",
    price: 65,
    originalPrice: 80,
    color: "Yellow",
    pattern: "Embroidered",
    brand: "Tiny Traditions",
    ageGroup: "4-6 years",
    popularity: 4.9,
    createdAt: "2024-09-25",
    image: "/api/placeholder/400/500",
    description: "Complete festive set for Diwali celebrations with kurtha and dhoti.",
  },
  {
    id: 11,
    title: "Boys Wedding Collection",
    category: "Festival Wear",
    price: 70,
    originalPrice: 90,
    color: "Pink",
    pattern: "Embroidered",
    brand: "Little Stars",
    ageGroup: "6-8 years",
    popularity: 4.7,
    createdAt: "2024-09-22",
    image: "/api/placeholder/400/500",
    description: "Elegant wedding outfit with designer embroidery.",
  },
  {
    id: 12,
    title: "Kids Traditional Festival Set",
    category: "Festival Wear",
    price: 60,
    originalPrice: 75,
    color: "Green",
    pattern: "Traditional",
    brand: "Kidsy",
    ageGroup: "2-4 years",
    popularity: 4.4,
    createdAt: "2024-09-14",
    image: "/api/placeholder/400/500",
    description: "Traditional festival wear with comfortable fit for younger kids.",
  },
];

const FilterTags = ({ filters, handleFilterChange, clearFilters }) => (
  <div className="flex flex-wrap items-center gap-2 mb-6">
    <span className="text-sm text-gray-500">Applied filters:</span>
    {Object.entries(filters).map(([key, value]) => {
      if (!value || key === "search" || (Array.isArray(value) && value.length === 0) || (key === "price" && value === 100))
        return null;
      return (
        <span
          key={key}
          className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center"
        >
          {key === "price" 
            ? `Under ₹${value}` 
            : Array.isArray(value) 
              ? value.join(", ") 
              : value}
          <button
            onClick={() => handleFilterChange({ target: { 
              name: key, 
              value: key === "price" ? 100 : (Array.isArray(value) ? [] : "") 
            }})}
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

// Main Component
const KidsCollection = () => {
  const [filters, setFilters] = useState({
    category: [],
    color: "",
    pattern: "",
    brand: [],
    ageGroup: "",
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
  const [itemsPerPage] = useState(9);
  const [expandedSections, setExpandedSections] = useState(
    categories.reduce((acc, cat) => {
      acc[cat] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      if (name === "category" || name === "brand") {
        return {
          ...prev,
          [name]: prev[name].includes(value)
            ? prev[name].filter((item) => item !== value)
            : [...prev[name], value],
        };
      }
      return { ...prev, [name]: value };
    });
    setCurrentPage(1);
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      color: "",
      pattern: "",
      brand: [],
      ageGroup: "",
      price: 100,
      search: "",
    });
    setCurrentPage(1);
  }, []);

  const toggleSection = (category) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(
        ([key, value]) =>
          (Array.isArray(value) ? value.length > 0 : value) &&
          key !== "price" &&
          key !== "search"
      ).length + (filters.price < 100 ? 1 : 0),
    [filters]
  );

  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = products
        .filter((product) => product.category === category)
        .filter((product) => {
          return (
            (filters.category.length
              ? filters.category.includes(product.category)
              : true) &&
            (filters.color ? product.color === filters.color : true) &&
            (filters.pattern ? product.pattern === filters.pattern : true) &&
            (filters.brand.length
              ? filters.brand.includes(product.brand)
              : true) &&
            (filters.ageGroup ? product.ageGroup === filters.ageGroup : true) &&
            product.price <= filters.price &&
            (filters.search
              ? product.title
                  .toLowerCase()
                  .includes(filters.search.toLowerCase()) ||
                product.category
                  .toLowerCase()
                  .includes(filters.search.toLowerCase())
              : true)
          );
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "Price: Low to High":
              return a.price - b.price;
            case "Price: High to Low":
              return b.price - a.price;
            case "Newest First":
              return new Date(b.createdAt) - new Date(a.createdAt);
            default: // Popularity
              return b.popularity - a.popularity;
          }
        });

      return acc;
    }, {});
  }, [filters, sortBy]);

  const totalFilteredProducts = useMemo(
    () => Object.values(productsByCategory).flat().length,
    [productsByCategory]
  );

  const paginatedProducts = useMemo(() => {
    const allProducts = Object.values(productsByCategory).flat();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [productsByCategory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);

  return (
    <div className="relative bg-gray-50 min-h-screen">
      {isScrolled ? <ScrolledNavbar /> : <Navbar />}
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
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                handleFilterChange={handleFilterChange}
                categories={categories}
                colors={colors}
                patterns={patterns}
                brands={brands}
                ageGroups={ageGroups}
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

      <div className="hidden md:block fixed left-0 top-0 pt-28 h-full w-1/5 bg-white border-r overflow-y-auto">
        <FilterSidebar
          filters={filters}
          handleFilterChange={handleFilterChange}
          categories={categories}
          colors={colors}
          patterns={patterns}
          brands={brands}
          ageGroups={ageGroups}
          clearFilters={clearFilters}
        />
      </div>

      <div className="md:ml-[20%] px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-28 mb-6 gap-4">
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            / <span>Kids Collection</span>
          </div>

          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search kids products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
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
                  view === "grid" ? "bg-black text-white" : "bg-white"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${
                  view === "list" ? "bg-black text-white" : "bg-white"
                }`}
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
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          sortBy === option ? "bg-gray-100" : ""
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
            {totalFilteredProducts} results found
          </p>
        </div>

        {totalFilteredProducts === 0 ? (
          <EmptyResults clearFilters={clearFilters} />
        ) : (
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
                  />
                ))}
              </div>
            )}

            {totalFilteredProducts > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}
          </>
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

export default KidsCollection;