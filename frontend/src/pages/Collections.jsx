import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import ScrolledNavbar from "../components/ScrolledNavbar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../pages/Cart/cartSlice";
import { Helmet } from "react-helmet";
import ProductCard from "./ProductCard";
import EmptyResults from "../components/ui/EmptyResults";
import Pagination from "../components/ui/Pagination";
import collectionService from "../services/collectionService";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
    />
  </div>
);

const CollectionsShowCase = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [view, setView] = useState("grid");
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { collection } = useParams();

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

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
        const groupedData = res;
        const allProducts = Object.values(groupedData).flat();
        setApiData(allProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };


  console.log("jjj")
  const toggleCart = (product) => {
    const existingItem = cart.find((item) => item.id === product._id);
    existingItem
      ? dispatch(removeFromCart(product))
      : dispatch(addToCart(product));
  };

  const productsPerPage = 12;
  const totalPages = Math.ceil(apiData.length / productsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return apiData.slice(startIndex, startIndex + productsPerPage);
  }, [apiData, currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen lg:px-28">
      <Helmet>
        <title>Kasavu Aalayam | {collection?.toUpperCase()} Collection</title>
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
          href={`https://kasavuaalayam.com/collections/${collection}`}
        />
      </Helmet>

     

      <div className="px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 mb-6 gap-4">
          <div className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            / <span>{collection?.toUpperCase()} COLLECTIONS </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">{apiData.length} results found</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : apiData.length > 0 ? (
          <>
            {view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
            ) : (
              <div className="space-y-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isListView={true}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    toggleCart={toggleCart}
                  />
                ))}
              </div>
            )}

            {apiData.length > productsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <EmptyResults />
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

export default CollectionsShowCase;
