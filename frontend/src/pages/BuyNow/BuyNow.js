import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { addToCart } from '../Cart/cartSlice';
import QuantitySelector from '../../components/ui/QuantitySelector';
import Navbar from '../../components/Navbar';
import products from '../../Data/womens-collection';

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
              selectedSize === size
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">
        Color: <span className="font-normal">{selectedColor}</span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? 'border-black scale-110'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.toLowerCase() }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
};

const ProductDetails = ({ product }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-gray-600 mb-2">Product Details</h2>
        <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Brand:</span>
            <span className="font-medium">{product.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pattern:</span>
            <span className="font-medium">{product.pattern}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Material:</span>
            <span className="font-medium">{product.material || 'Premium Cotton'}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Features</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Premium quality fabric</li>
          <li>• Comfortable fit</li>
          <li>• Easy care instructions</li>
          <li>• Versatile styling options</li>
        </ul>
      </div>

      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Truck size={16} />
          <span>Free shipping above ₹500</span>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw size={16} />
          <span>7 day returns</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield size={16} />
          <span>1 year warranty</span>
        </div>
      </div>
    </div>
  );
};

const BuyNow = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(productId));
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default variants
      setSelectedSize(foundProduct.sizes?.[0] || 'M');
      setSelectedColor(foundProduct.colors?.[0] || foundProduct.color);
    } else {
      navigate('/collections/women');
    }
  }, [productId, navigate]);

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    dispatch(addToCart(cartItem));
    navigate('/cart');
  };

  const handleBuyNow = () => {
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    dispatch(addToCart(cartItem));
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  // Mock additional images for the gallery
  const productImages = [
    product.image,
    product.image,
    product.image,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{product.title} | Kasavu Aalayam</title>
        <meta name="description" content={`Buy ${product.title} - ${product.category} from Kasavu Aalayam. Premium quality at ₹${product.price}.`} />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-6 mt-20">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/collections/women" className="hover:text-black">Women's Collection</Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Link to="/collections/women">
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft size={20} />
              Back to Collection
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={productImages[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    activeImageIndex === index ? 'border-black' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product.category}</p>
              <div className="text-3xl font-bold text-black mb-4">₹{product.price}</div>
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />
            )}

            {/* Color Selection */}
            {product.colors && (
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity(prev => Math.min(prev + 1, 10))}
                onDecrease={() => setQuantity(prev => Math.max(prev - 1, 1))}
                onQuantityChange={setQuantity}
                min={1}
                max={10}
                size="lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors font-medium text-lg"
              >
                Buy Now - ₹{product.price * quantity}
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full border-2 border-black text-black py-4 rounded-md hover:bg-black hover:text-white transition-colors font-medium text-lg"
              >
                Add to Cart
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md border transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Product Details */}
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Size Guide</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between border-b pb-1">
                <span>Size</span>
                <span>Chest (inches)</span>
              </div>
              <div className="flex justify-between">
                <span>S</span>
                <span>32-34</span>
              </div>
              <div className="flex justify-between">
                <span>M</span>
                <span>36-38</span>
              </div>
              <div className="flex justify-between">
                <span>L</span>
                <span>40-42</span>
              </div>
              <div className="flex justify-between">
                <span>XL</span>
                <span>44-46</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Care Instructions</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Machine wash cold with like colors</li>
              <li>• Do not bleach</li>
              <li>• Tumble dry low</li>
              <li>• Iron on low heat if needed</li>
              <li>• Do not dry clean</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Shipping & Returns</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Free shipping on orders above ₹500</p>
              <p>Standard delivery: 3-5 business days</p>
              <p>Express delivery: 1-2 business days</p>
              <p>Easy returns within 7 days</p>
              <p>No questions asked return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
