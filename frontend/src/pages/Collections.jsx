import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { addToCart, removeFromCart } from "../pages/Cart/cartSlice";
import collectionService from "../services/collectionService";
import ProductCard from "./ProductCard";
import Pagination from "../components/ui/Pagination";
import FilterSidebar from "../components/collectionFilter";
import EmptyResults from "../components/ui/EmptyResults";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-20 w-full">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 relative"
    >
      <div className="absolute inset-0 border-4 border-gradient-to-r from-red-200 via-rose-200 to-pink-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-red-600 border-r-rose-600 rounded-full"></div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.2}}
      className="mt-6 text-center"
    >
      <p className="text-lg font-medium text-gray-700 mb-1">Loading Collection</p>
      <p className="text-sm text-gray-500">Please wait while we fetch the latest products...</p>
    </motion.div>
  </div>
);

const CollectionsShowCase = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { collection } = useParams();

const extractFilters = (products) => {
  const typeSet = new Set();
  const colorSet = new Set();
  const sizeSet = new Set();

  products.forEach((product) => {
    // Type from productDetails
    if (product.productDetails?.type) {
      typeSet.add(product.productDetails.type);
    }
    // Color directly from root
    if (product.color) {
      colorSet.add(product.color);
    }
    // Size from productDetails
    if (product.productDetails?.size) {
      sizeSet.add(product.productDetails.size);
    }
  });

  return {
    type: [...typeSet],
    color: [...colorSet],
    size: [...sizeSet],
  };
};

const filters = useMemo(() => extractFilters(apiData), [apiData]);

  const applyFilters = (products, filters) => {
    return products.filter((product) =>
      Object.entries(filters).every(([category, values]) => {
        if (!values.length) return true;
        const price = parseInt(product.specialPrice || product.price);
        const getTarget = {
          price,
          type: product.productDetails.type,
          fabric: product.productDetails.fabric,
          size: product.productDetails.size,
          color: product.color.toLowerCase(),
        }[category];

        if (category === "price") {
          return values.some((range) => {
            if (range === "Below ₹500") return price < 500;
            if (range === "₹500-₹1000") return price >= 500 && price <= 1000;
            if (range === "₹1000+") return price > 1000;
            return false;
          });
        }

        return values.includes(getTarget);
      })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const lowerParam = collection?.toLowerCase() || "";
      let collectionId = "";

      if (lowerParam.startsWith("mens")) {
        collectionId = "6855a746cd5b892bfbd0b0bf";
      } else if (lowerParam.startsWith("womens")) {
        collectionId = "6855a771cd5b892bfbd0b0cd";
      } else if (lowerParam.startsWith("kids")) {
        collectionId = "6855a746cd5b892bfb3434";
      } else {
        console.warn("Unknown collection route param:", collection);
        setApiData([]);
        setIsLoading(false);
        return;
      }

      try {
        const res = await collectionService.getProductByCollectionId(collectionId);
        const allProducts = Object.values(res).flat();
        setApiData(allProducts);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collection]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleWishlist = (id) => {
    if (!id) return;
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCart = (product) => {
    const exists = cart.find((item) => item.id === product._id);
    exists ? dispatch(removeFromCart(product)) : dispatch(addToCart(product));
  };

  const productsPerPage = 12;
  const filteredProducts = useMemo(
    () => applyFilters(apiData, selectedFilters),
    [apiData, selectedFilters]
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 min-h-screen lg:px-28 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-200 to-rose-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-br from-red-300 to-pink-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-40 left-20 w-36 h-36 bg-gradient-to-br from-rose-200 to-red-200 rounded-full opacity-20 blur-xl"></div>
      </div>

      <Helmet>
        <title>Kasavu Aalayam | {collection?.toUpperCase()} Collection</title>
        <meta
          name="description"
          content="Discover premium Indian traditional collections at Kasavu Aalayam — elegant silk sarees, designer kurtas, and festive attire for every occasion."
        />
        <link
          rel="canonical"
          href={`https://kasavuaalayam.com/collections/${collection}`}
        />
      </Helmet>

      <div className="px-4 md:px-10 py-6 relative z-10">
        {/* Enhanced Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <div className="text-sm text-gray-600 flex items-center">
              <Link 
                to="/" 
                className="text-red-600 hover:text-red-800 transition-all duration-300 font-medium hover:underline decoration-2 underline-offset-4"
              >
                Home
              </Link>
              <span className="mx-3 text-gray-400">/</span>
              <span className="font-semibold text-gray-800 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {collection?.toUpperCase()} COLLECTIONS
              </span>
            </div>
          </div>
        </motion.div>

        {/* Collection Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent mb-6 leading-tight">
              {collection?.toUpperCase()}
            </h1>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-red-400 to-rose-400 rounded-full opacity-60"></div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full lg:w-1/4 lg:py-4"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
                <h3 className="text-white font-bold text-lg">Filter Products</h3>
              </div>
              <div className="p-6">
                <FilterSidebar
                  filters={filters}
                  selectedFilters={selectedFilters}
                  onFilterChange={setSelectedFilters}
                />
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full lg:w-3/4"
          >
            {/* Results Header */}
            <div className="mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-rose-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold text-gray-800">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading / Products */}
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <EmptyResults />
              </motion.div>
            ) : (
              <>
                {/* Product Grid */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6"
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        y: -8, 
                        transition: { duration: 0.3 }
                      }}
                      className="group"
                    >
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-red-200 transition-all duration-500">
                        <ProductCard
                          product={product}
                          isListView={false}
                          wishlist={wishlist}
                          toggleWishlist={toggleWishlist}
                          toggleCart={toggleCart}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {filteredProducts.length > productsPerPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12"
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Back to Top Button */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ 
            scale: 1.1
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className="fixed bottom-8 right-8 md:right-12 z-50 group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-full border border-gray-200">
            <ChevronUp size={24} className="transform group-hover:-translate-y-1 transition-transform" />
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default CollectionsShowCase;