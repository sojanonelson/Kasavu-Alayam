import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';


const ProductCard = ({ 
  product, 
  
  wishlist = [], 
  toggleWishlist, 

}) => {
 

  
  const isWishlisted = wishlist.includes(product.id);



  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };




return (
  <div className="bg-white overflow-hidden group flex flex-col h-full border ">
    {/* Image */}
    <div className="relative w-full h-64">
      <Link to={`/product/${product._id}`} className="block w-full h-full">
        <img
          src={product.images[0]?.url || product.images}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
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

     
      <Link to={`/product/${product._id}`}>
        <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <Eye size={16} />
        </button>
      </Link>
    </div>


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

      
        <div className="flex gap-2 mt-1">
          <p className="text-sm font-semibold text-black">₹{product.specialPrice}</p>
          <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
        </div>
      </div>


    </div>
  </div>
);

};

export default ProductCard;