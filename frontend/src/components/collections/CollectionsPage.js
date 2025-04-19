import React from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import collectionsData from '../../Data/collections-data'; 

const CollectionsPage = () => {
  const { id } = useParams();
  const product = collectionsData.find(item => item.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleBuyNow = () => {
    alert(`Buying ${product.title} now!`);
  };

  const handleAddToCart = () => {
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 md:px-10 py-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-lg font-bold">₹{product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
            )}
            {product.originalPrice && (
              <p className="text-sm text-green-600">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
              </p>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBuyNow}
              className="bg-black text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="border border-black text-black px-6 py-2 rounded-md flex items-center gap-2"
            >
              <Heart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
