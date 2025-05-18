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

const categories = ["Dhoti", "Shirts", "T-Shirts"];
const colors = ["White", "Black", "Blue", "Red"];
const patterns = ["Solid", "Striped", "Checked"];
const brands = ["Brand A", "Brand B", "Brand C"];
const sortOptions = [
  "Popularity",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
];

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
    image:
      "https://m.media-amazon.com/images/I/71jvQpjLmML._AC_UL480_FMwebp_QL65_.jpg",
    description:
      "Traditional pure cotton dhoti with gold border, perfect for festivals and ceremonies.",
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
    image:
      "https://www.jiomart.com/images/product/original/rvrgwpjvsp/style-360-cotton-white-solid-dhoti-product-images-rvrgwpjvsp-0-202209240121.jpg",
    description:
      "Luxurious silk dhoti with traditional design, ideal for special occasions.",
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
    image:
      "https://www.jiomart.com/images/product/original/rvbvq9tdwn/s9-store-white-cotton-solid-dhoti-product-images-rvbvq9tdwn-0-202206080522.jpg",
    description: "Lightweight linen dhoti for everyday casual wear.",
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
    image:
      "https://m.media-amazon.com/images/I/61MK+FS84RL._AC_UL480_FMwebp_QL65_.jpg",
    description:
      "Classic white formal shirt with regular fit, perfect for office and formal events.",
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
    image:
      "https://rukminim2.flixcart.com/image/850/1000/xif0q/shirt/b/v/p/l-st2-vebnor-original-imagpv9ahv9rsmnr.jpeg",
    description: "Stylish checkered shirt for casual outings and weekend wear.",
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
    image:
      "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/17187540/2022/2/17/a0e0dfe4-799c-4ad4-864c-503d3067566d1645099524664RoadsterMenBlackPureCottonSustainableCasualShirt2.jpg",
    description:
      "Premium linen-cotton blend shirt for maximum comfort in any weather.",
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
    image:
      "https://assets.ajio.com/medias/sys_master/root/20230602/vHip/6479d136d55b7d0c63421460/-473Wx593H-464419395-black-MODEL.jpg",
    description:
      "Essential crew neck t-shirt made from 100% cotton for everyday comfort.",
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
    image:
      "https://www.jiomart.com/images/product/original/rvomvpspvy/eyebogler-men-s-red-typography-printed-cotton-t-shirt-product-images-rvomvpspvy-0-202207051929.jpg",
    description:
      "Trendy graphic print t-shirt with modern design for a stylish casual look.",
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
    image:
      "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/23049302/2023/5/5/9fb21207-ceb9-496c-9508-ae96ee9122871683282682632RoadsterMenWhiteStripedPocketsPoloCollarPureCottonT-shirt1.jpg",
    description:
      "Classic striped polo t-shirt, perfect for casual outings and semi-formal occasions.",
  },
];

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

// Main Component
const MensCollection = () => {
  const [filters, setFilters] = useState({
    category: [],
    color: "",
    pattern: "",
    brand: [],
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
          clearFilters={clearFilters}
        />
      </div>

      <div className="md:ml-[20%] px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-28 mb-6 gap-4">
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            / <span>Men's Collection</span>
          </div>

          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
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
              <Pagination currentPage={currentPage} totalPages={totalPages} />
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

export default MensCollection;
