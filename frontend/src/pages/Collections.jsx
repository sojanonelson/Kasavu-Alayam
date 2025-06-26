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
  <div className="flex justify-center items-center py-20 w-full">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
    />
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
console.log(filters);

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
    <div className="bg-gray-50 min-h-screen lg:px-28">
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

      <div className="px-4 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>{" "}
          / <span>{collection?.toUpperCase()} COLLECTIONS</span>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 lg:py-10">
            <FilterSidebar
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-500">
              {filteredProducts.length} results found
            </div>

            {/* Loading / Products */}
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredProducts.length === 0 ? (
              <EmptyResults />
            ) : (
              <>
                {/* Grid View Only */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isListView={false}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                      toggleCart={toggleCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {filteredProducts.length > productsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 md:right-10 z-40 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </div>
  );
};

export default CollectionsShowCase;
