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
    <div className="bg-gradient-to-b from-slate-50 via-white to-gray-50 min-h-screen relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Modern Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-100/30 to-rose-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-60 h-60 bg-gradient-to-br from-rose-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-red-100/25 to-rose-100/25 rounded-full blur-2xl"></div>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Professional Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-6 pb-4"
        >
          {/* Breadcrumb */}
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-red-600 font-semibold">
                {collection?.charAt(0).toUpperCase() + collection?.slice(1)} Collection
              </span>
            </div>
          </div>

          {/* Compact Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {collection?.charAt(0).toUpperCase() + collection?.slice(1)}
                <span className="text-red-600 ml-2">Collection</span>
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
            </div>
            
            {!isLoading && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
                <div className="text-sm text-gray-500 font-medium">Products</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 pb-12">
          {/* Enhanced Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-80 flex-shrink-0"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm sticky top-6">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Filter Products
                </h3>
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

          {/* Enhanced Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 min-w-0"
          >
            {/* Results Summary */}
            {!isLoading && (
              <div className="mb-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        Showing {paginatedProducts.length} of {filteredProducts.length} products
                      </span>
                    </div>
                    {totalPages > 1 && (
                      <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        Page {currentPage} of {totalPages}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                <LoadingSpinner />
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50"
              >
                <EmptyResults />
              </motion.div>
            ) : (
              <>
                {/* Enhanced Product Grid */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.03,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        y: -4, 
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      className="group"
                    >
                      <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden hover:border-red-200 hover:shadow-lg transition-all duration-300 hover:shadow-red-100/50">
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

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10"
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
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

      {/* Modern Back to Top Button */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ 
            scale: 1.05,
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="fixed bottom-6 right-6 z-50 group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <div className="bg-white border border-gray-200 text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
            <ChevronUp size={20} className="transform group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default CollectionsShowCase;