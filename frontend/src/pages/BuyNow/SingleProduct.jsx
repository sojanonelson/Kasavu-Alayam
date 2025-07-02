import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Truck,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Heart,
  Shield,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import productService from "../../services/productservice";
import cartService from "../../services/cartService";
import {
  createReview,
  eligibilityCheck,
  getReviewOfProduct,
} from "../../services/reviewService";

const SingleProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collectionError, setCollectionError] = useState(null);

  const [reviews, setReviewData] = useState([]);

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [fullscreenZoom, setFullscreenZoom] = useState(1);
  const [fullscreenPan, setFullscreenPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEligible, setIsEligible] = useState(false);
const [showReviewForm, setShowReviewForm] = useState(false);
const [rating, setRating] = useState(0);
const [reviewMessage, setReviewMessage] = useState('');
const [predefinedMessages] = useState([
  "Great product!",
  "Good quality",
  "Average product",
  "Could be better",
  "Not satisfied"
]);
const [selectedPredefined, setSelectedPredefined] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
  try {
    const userStr = localStorage.getItem("user");
    const data = await productService.getProductById(productId);
    const reviewData = await getReviewOfProduct(productId);
    
    setReviewData(reviewData.reviews);
    setProduct(data);
    setActiveImage(data.images[0].url);
    
    if (userStr) {
      const user = JSON.parse(userStr);
      const checkEligible = await eligibilityCheck(productId, user.id);
      setIsEligible(checkEligible.eligible);
      if(checkEligible.eligible){
        setShowReviewForm(true)
      }
    }
    
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};

    fetchProduct();
  }, [productId]);


  const handleReviewSubmit = async () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to submit a review");
      return;
    }
    
    const user = JSON.parse(userStr);
    
    const reviewData = {
      productId: productId,
      userId: user.id,
      rating,
      message: reviewMessage || predefinedMessages[5 - rating],
    };
    const reviewSubmit = await createReview(reviewData)
    
    // Call your API to submit the review
    // await submitReview(reviewData);
    
    // For now, just show a success message
    alert("Thank you for your review!");
    setShowReviewForm(false);
    setRating(0);
    setReviewMessage('');
    
    // Refresh reviews
    const updatedReviews = await getReviewOfProduct(productId);
    setReviewData(updatedReviews.reviews);
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Failed to submit review");
  }
};

const handlePredefinedSelect = (message) => {
  setSelectedPredefined(message);
  setReviewMessage(message);
};

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      try {
        // Replace with actual API call to fetch collection products
        const data = await productService.getCollectionProducts();
        setCollectionProducts(data);
        setCollectionLoading(false);
      } catch (err) {
        setCollectionError(err.message);
        setCollectionLoading(false);
      }
    };

    fetchCollectionProducts();
  }, []);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryDate("April 22-24, 2023");
    }
  };

  const openFullscreen = (index) => {
    setCurrentFullscreenIndex(index);
    setIsFullscreen(true);
    setFullscreenZoom(1);
    setFullscreenPan({ x: 0, y: 0 });
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenZoom(1);
    setFullscreenPan({ x: 0, y: 0 });
  };

  // Advanced zoom handlers
  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
    setMagnifierPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setShowMagnifier(true);
  };

  // Fullscreen zoom handlers
  const handleFullscreenWheel = (e) => {
    e.preventDefault();
    const newZoom = fullscreenZoom + (e.deltaY > 0 ? -0.2 : 0.2);
    setFullscreenZoom(Math.max(1, Math.min(4, newZoom)));

    if (newZoom <= 1) {
      setFullscreenPan({ x: 0, y: 0 });
    }
  };

  const handleFullscreenMouseDown = (e) => {
    if (fullscreenZoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - fullscreenPan.x,
        y: e.clientY - fullscreenPan.y,
      });
    }
  };

  const handleFullscreenMouseMove = (e) => {
    if (isDragging && fullscreenZoom > 1) {
      setFullscreenPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleFullscreenMouseUp = () => {
    setIsDragging(false);
  };

  const handleFullscreenDoubleClick = () => {
    if (fullscreenZoom === 1) {
      setFullscreenZoom(2);
    } else {
      setFullscreenZoom(1);
      setFullscreenPan({ x: 0, y: 0 });
    }
  };

  const addToCart = async () => {
    if (addingToCart) return;

    try {
      setAddingToCart(true);
      const userRaw = localStorage.getItem("user");
      const user = JSON.parse(userRaw);

      if (!user || !user.id) {
        alert("User not logged in");
        return;
      }

      if (!selectedSize && product.productDetails.size) {
        alert("Please select a size first");
        return;
      }

      const cartItem = {
        userId: user.id,
        productId: product._id,
        quantity: 1,
        selectedSize: selectedSize || null,
        selectedColor: selectedColor || product.color,
      };

      const response = await cartService.addToCart(cartItem);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const addMainProductToCart = async () => {
    if (addingToCart) return;

    try {
      setAddingToCart(true);
      const userRaw = localStorage.getItem("user");
      const user = JSON.parse(userRaw);

      if (!user || !user.id) {
        alert("User not logged in");
        return;
      }

      if (!selectedSize && product.productDetails.size) {
        alert("Please select a size first");
        return;
      }

      const cartItem = {
        userId: user.id,
        productId: product._id,
        quantity: 1,
        selectedSize: selectedSize || null,
        selectedColor: selectedColor || product.color,
      };

      const response = await cartService.addToCart(cartItem);
      alert(`${product.title} added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const addSimilarProductToCart = async (similarProduct) => {
    if (addingToCartId === similarProduct.id) return;

    try {
      setAddingToCartId(similarProduct.id);
      const userRaw = localStorage.getItem("user");
      const user = JSON.parse(userRaw);

      if (!user || !user.id) {
        alert("User not logged in");
        return;
      }

      const cartItem = {
        userId: user.id,
        productId: similarProduct.id,
        quantity: 1,
      };

      const response = await cartService.addToCart(cartItem);
      alert(`${similarProduct.title} added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleBuyNow = () => {
    // You can implement the actual buy now logic here, or just redirect to checkout.
    alert("Proceeding to buy now...");
    // For now, just a placeholder action.
  };

  const navigateFullscreen = (direction) => {
    if (direction === "prev") {
      setCurrentFullscreenIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setCurrentFullscreenIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
    // Reset zoom when changing images
    setFullscreenZoom(1);
    setFullscreenPan({ x: 0, y: 0 });
  };

  // Add event listeners for fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") closeFullscreen();
        if (e.key === "ArrowLeft") navigateFullscreen("prev");
        if (e.key === "ArrowRight") navigateFullscreen("next");
      };
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousemove", handleFullscreenMouseMove);
      document.addEventListener("mouseup", handleFullscreenMouseUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousemove", handleFullscreenMouseMove);
        document.removeEventListener("mouseup", handleFullscreenMouseUp);
      };
    }
  }, [isFullscreen, isDragging, dragStart, fullscreenPan]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No product found
      </div>
    );

  return (
    <div className="bg-white">
      {/* Advanced Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-98 z-50 flex items-center justify-center">
          {/* Header with controls */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6 z-10">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">
                  {currentFullscreenIndex + 1} / {product.images.length}
                </span>
                <span className="text-sm opacity-75">
                  Double-click to zoom • Scroll to zoom • Drag to pan
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm opacity-75">
                  Zoom: {Math.round(fullscreenZoom * 100)}%
                </span>
                <button
                  onClick={closeFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
          {/* Main image container */}
          <div
            className="flex-1 h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleFullscreenWheel}
            onMouseDown={handleFullscreenMouseDown}
            onDoubleClick={handleFullscreenDoubleClick}
            style={{
              cursor:
                fullscreenZoom > 1
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "default",
            }}
          >
            <img
              src={product.images[currentFullscreenIndex].url}
              alt={product.title}
              className="max-w-none transition-transform duration-200 ease-out select-none"
              style={{
                transform: `scale(${fullscreenZoom}) translate(${
                  fullscreenPan.x / fullscreenZoom
                }px, ${fullscreenPan.y / fullscreenZoom}px)`,
                maxHeight: fullscreenZoom === 1 ? "90vh" : "none",
                maxWidth: fullscreenZoom === 1 ? "90vw" : "none",
              }}
              draggable={false}
            />
          </div>
          {/* Thumbnail strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="flex justify-center">
              <div className="flex gap-2 overflow-x-auto max-w-full">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFullscreenIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentFullscreenIndex === index
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent hover:border-white/50"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Navigation arrows */}
          <button
            onClick={() => navigateFullscreen("prev")}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => navigateFullscreen("next")}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-sm breadcrumbs mb-6 text-gray-600">
          <ul className="flex space-x-2">
            <li>
              <a>Home</a>/
            </li>
            <li>
              <a>{product.category.name}</a>/
            </li>
            <li>
              <a>{product.subcategory.name}</a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-12 bg-white rounded-xl p-6">
          <div className="lg:w-1/2">
            {/* Main Image with Advanced Zoom */}
            <div className="relative">
              <div
                className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square flex items-center justify-center group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onClick={() =>
                  openFullscreen(
                    product.images.findIndex((img) => img.url === activeImage)
                  )
                }
                style={{ cursor: isZooming ? "none" : "zoom-in" }}
              >
                <img
                  src={activeImage}
                  alt={product.title}
                  className="object-contain w-full h-full transition-transform duration-300 select-none"
                  style={{
                    transform: isZooming ? `scale(1.1)` : "scale(1)",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  draggable={false}
                />

                {/* Zoom indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-20 pointer-events-none">
                  <div className="bg-black/60 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                    <ZoomIn size={16} />
                    Click to zoom
                  </div>
                </div>
                {/* Magnifier */}
                {showMagnifier && isZooming && (
                  <div
                    className="absolute pointer-events-none border-2 border-white shadow-lg rounded-full overflow-hidden bg-white"
                    style={{
                      width: "150px",
                      height: "150px",
                      left: `${magnifierPosition.x - 75}px`,
                      top: `${magnifierPosition.y - 75}px`,
                      backgroundImage: `url(${activeImage})`,
                      backgroundSize: "300%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: "no-repeat",
                      zIndex: 10,
                    }}
                  >
                    <div className="absolute inset-0 border border-gray-300 rounded-full"></div>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWishlisted(!isWishlisted);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    isWishlisted
                      ? "bg-red-100 text-red-500"
                      : "bg-white text-gray-600"
                  } shadow-md hover:scale-110 transition-all z-10`}
                >
                  <Heart
                    size={24}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
              {/* Zoom instruction */}
              <div className="text-xs text-gray-500 text-center mb-2">
                Hover to zoom • Click for fullscreen
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto py-2 px-1">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img.url)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img.url
                      ? "border-primary scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.title} view ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {product.brand}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {product.title}
                </h1>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex items-center mb-4 px-2 py-1 rounded">
              <Star
                size={16}
                className="fill-yellow-400 stroke-yellow-400 mr-1"
              />
              <span className="text-sm font-medium">4.8 (1.2k reviews)</span>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-primary">
                  ₹{product.specialPrice}
                </span>
                {product.price > product.specialPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded">
                      {Math.round(
                        (1 - product.specialPrice / product.price) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <span>Inclusive of all taxes</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-900">
                Color:{" "}
                <span className="font-normal text-gray-700">
                  {product.color}
                </span>
              </h3>
            </div>
            {product.productDetails.size && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Size</h3>
                  <button className="text-sm text-primary hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedSize(product.productDetails.size)}
                    className={`px-5 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                      selectedSize === product.productDetails.size
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {product.productDetails.size}
                  </button>
                </div>
              </div>
            )}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Truck size={20} className="text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Delivery Options
                  </h4>
                  <p className="text-sm text-blue-600 mb-2">
                    ✅ Delivery all over India via <strong>India Post</strong>
                  </p>
                  {deliveryDate && (
                    <p className="text-sm text-green-600 mt-1">
                      Delivery by {deliveryDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Store Pickup
                  </h4>
                  <p className="text-sm text-gray-600">
                    Check availability at nearby stores
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-green-500" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} className="text-green-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500" />
                <span>Easy Returns</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addMainProductToCart}
                disabled={addingToCart}
                className={`flex-1 h-14 text-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  addingToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                <ShoppingCart size={22} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
             
            </div>
          </div>
        </div>
        <div className="mb-12 bg-white  border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b ">
            <button className="px-6 py-4 font-medium text-primary border-b-2 border-primary transition-colors">
              Product Details
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                About this item
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Product Details Column */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Product Details
                </h4>
                <ul className="space-y-4">
                  {Object.entries(product.productDetails).map(
                    ([key, value]) => (
                      <li key={key} className="flex">
                        <span className="text-gray-500 w-40 flex-shrink-0 font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-gray-800 font-medium">
                          {value}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Additional Info Column */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Additional Information
                </h4>
                <ul className="space-y-4">
                  <li className="flex">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">
                      Color
                    </span>
                    <div className="flex items-center">
                      <span className="text-gray-800 font-medium">
                        {product.color}
                      </span>
                      <span
                        className="ml-2 w-4 h-4 rounded-full border border-gray-300 inline-block"
                        style={{ backgroundColor: product.color.toLowerCase() }}
                      />
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">
                      Category
                    </span>
                    <span className="text-gray-800 font-medium">
                      {product.category.name}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">
                      Subcategory
                    </span>
                    <span className="text-gray-800 font-medium">
                      {product.subcategory.name}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">
                      SKU
                    </span>
                    <span className="text-gray-800 font-medium">
                      {product.sku}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12 bg-white p-6 rounded-lg border border-gray-200">
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

  {isEligible ? (
    !showReviewForm && (
      <button
        onClick={() => setShowReviewForm(true)}
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
      >
        Write a Review
      </button>
    )
  ) : (
    <div className="relative flex flex-col items-end group">
      {/* Message only visible on hover */}
      <div className="absolute bottom-12 right-0 bg-red-100 text-red-600 text-sm px-3 py-2 rounded-md shadow-md w-72 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        You already reviewed this product or haven't ordered it yet.
      </div>

      {/* Disabled button */}
      <button
        disabled
        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
      >
        Write a Review
      </button>
    </div>
  )}
</div>


  {/* Review Form */}
  {showReviewForm && (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`cursor-pointer ${
                star <= rating
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "stroke-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Quick Select</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => handlePredefinedSelect(message)}
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedPredefined === message
                  ? "border-primary bg-primary-light text-primary"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Your Review</label>
        <textarea
          value={reviewMessage}
          onChange={(e) => setReviewMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows="4"
          placeholder="Share your thoughts about this product..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowReviewForm(false);
            setRating(0);
            setReviewMessage('');
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReviewSubmit}
          disabled={rating === 0}
          className={`px-4 py-2 rounded-lg text-white ${
            rating === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
          } transition-colors`}
        >
          Submit Review
        </button>
      </div>
    </div>
  )}

  {/* Reviews List */}
  {reviews.length > 0 ? (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border-b pb-6 last:border-b-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold uppercase">
                {review.user?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{review.user}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 pl-13">{review.message}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-500 mb-4">No reviews yet</p>
      {isEligible && (
        <button 
          onClick={() => setShowReviewForm(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          Be the first to review
        </button>
      )}
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default SingleProductPage;
