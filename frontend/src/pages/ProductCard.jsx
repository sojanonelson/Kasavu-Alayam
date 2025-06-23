import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProductCard = ({ 
  product, 
  isListView = false, 
  wishlist = [], 
  toggleWishlist, 
  toggleCart 
}) => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  
  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cart.some(item => item.id === product.id);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/buy-now/${product.id}`);
  };

const handleAddToCart = (e, productData) => {
  e.preventDefault();
  e.stopPropagation();
  toggleCart(productData);
};

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };
  const getDiscountPercent = (price, specialPrice) => {
  if (!price || !specialPrice || price <= specialPrice) return 0;
  return Math.round(((price - specialPrice) / price) * 100);
};


  if (isListView) {
    return (
      <div className="bg-red-600 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0].url}
                alt={product.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </Link>
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isWishlisted
                  ? 'bg-red-100 text-red-500'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-lg hover:text-gray-600 transition-colors">
                    {product.title}
                  </h3>
                </Link>
                {/* <p className="text-gray-500 text-sm">{product.category}</p> */}
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">₹{product.price}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.brand}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.productDetails.fabric}
              </span>
              {product.color && (
                <div className="flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  <span
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                  />
                  {product.color}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isInCart
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
              <Link to={`/product/${product._id}`}>
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Eye size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
return (
  <div className="bg-white overflow-hidden transition-shadow group flex flex-col h-full border rounded-lg shadow-sm">
    {/* Image */}
    <div className="relative w-full h-64">
      <Link to={`/product/${product._id}`} className="block w-full h-full">
        <img
          src={product.images[0]?.url || product.images}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isWishlisted
            ? 'bg-red-100 text-red-500'
            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Quick View */}
      <Link to={`/product/${product._id}`}>
        <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <Eye size={16} />
        </button>
      </Link>
    </div>

    {/* Info Section */}
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-medium text-xs poppins-regular hover:text-gray-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs sm:text-sm">{product.productDetails.fabric}</p>

        <div className="flex flex-wrap gap-1 mt-1">
          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {product.sku}
          </span>
          {product.color && (
            <div className="flex items-center text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: product.color.toLowerCase() }}
              />
              {product.color}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex gap-2 mt-1">
          <p className="text-sm font-semibold text-black">₹{product.specialPrice}</p>
          <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
        </div>
      </div>

      {/* Add to Cart */}
      <button
       onClick={(e) => handleAddToCart(e, product)}

        className={`w-full mt-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isInCart
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  </div>
);

};

export default ProductCard;