import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react'

const ProductCard = ({ product, isListView, wishlist, toggleWishlist, toggleCart }) => {
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const colorDots = ['White', 'Black', 'Pink', 'Red']
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
              onClick={() => toggleCart(product)}
              className="flex-1 bg-gray-800 hover:bg-black text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} />
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
            onClick={() => toggleCart(product)}
            className="flex-1 bg-gray-800 hover:bg-black text-white py-1.5 text-xs rounded-md flex items-center justify-center gap-1 transition-all duration-300"
            aria-label="Add to cart"
          >
            <ShoppingBag size={12} />
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

export default ProductCard