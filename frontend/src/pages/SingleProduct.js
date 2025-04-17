import { Star, Truck, MapPin, Check, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { useState } from 'react';

const SingleProductPage = () => {
  // Product data - this would typically come from props or API
  const product = {
    id: 1,
    title: 'Premium Comfort Sneakers',
    brand: 'UrbanSteps',
    price: 89.99,
    discountPrice: 69.99,
    rating: 4.5,
    reviewCount: 124,
    description: 'Experience ultimate comfort with our premium sneakers featuring advanced cushioning technology and breathable materials for all-day wear.',
    details: [
      'Breathable mesh upper',
      'Cushioned insole for all-day comfort',
      'Durable rubber outsole',
      'Available in multiple colors',
      'Machine washable'
    ],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: ['Black', 'White', 'Blue', 'Red'],
    deliveryOptions: [
      { type: 'standard', price: 0, days: '3-5' },
      { type: 'express', price: 4.99, days: '1-2' }
    ],
    images: [
      'https://kalyansilks.com/_next/image?url=https%3A%2F%2Fcdn.pixelbin.io%2Fv2%2Froyal-sound-8c7142%2Foriginal%2Fcatalog%2Fproduct%2F2%2F_%2F2_528.jpg&w=640&q=75',
      'https://kalyansilks.com/_next/image?url=https%3A%2F%2Fcdn.pixelbin.io%2Fv2%2Froyal-sound-8c7142%2Foriginal%2Fcatalog%2Fproduct%2F4%2F_%2F4_507.jpg&w=640&q=75',
      'https://kalyansilks.com/_next/image?url=https%3A%2F%2Fcdn.pixelbin.io%2Fv2%2Froyal-sound-8c7142%2Foriginal%2Fcatalog%2Fproduct%2F4%2F_%2F4_486.jpg&w=640&q=75',
      'https://kalyansilks.com/_next/image?url=https%3A%2F%2Fcdn.pixelbin.io%2Fv2%2Froyal-sound-8c7142%2Foriginal%2Fcatalog%2Fproduct%2F4%2F_%2F4_510.jpg&w=640&q=75'
    ]
  };

  const similarProducts = [
    { id: 2, title: 'Casual Walking Shoes', brand: 'UrbanSteps', price: 59.99, image: '/product2.jpg', rating: 4.2 },
    { id: 3, title: 'Athletic Running Shoes', brand: 'FitRun', price: 79.99, image: '/product3.jpg', rating: 4.7 },
    { id: 4, title: 'Classic Canvas Sneakers', brand: 'RetroWear', price: 49.99, image: '/product4.jpg', rating: 4.3 },
    { id: 5, title: 'Hiking Boots', brand: 'TrailMaster', price: 99.99, image: '/product5.jpg', rating: 4.8 }
  ];

  // State for active image and selected options
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState(0);

  // Check delivery availability
  const checkDelivery = () => {
    // This would typically be an API call
    if (pincode.length === 6) {
      setDeliveryDate('April 22-24, 2023');
    }
  };

  // Open fullscreen viewer
  const openFullscreen = (index: number) => {
    setCurrentFullscreenIndex(index);
    setIsFullscreen(true);
  };

  // Close fullscreen viewer
  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // Navigate between images in fullscreen
  const navigateFullscreen = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentFullscreenIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setCurrentFullscreenIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="container mx-auto px-4 mt-32 py-8 max-w-7xl">
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
          
          <div className="flex items-center w-full max-w-6xl h-full">
            {/* Main image */}
            <div className="flex-1 h-full flex items-center justify-center">
              <img 
                src={product.images[currentFullscreenIndex]} 
                alt={product.title} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            {/* Thumbnail sidebar */}
            <div className="w-24 ml-4 h-full overflow-y-auto">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFullscreenIndex(index)}
                  className={`w-full mb-2 rounded-md overflow-hidden border-2 ${currentFullscreenIndex === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} view ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={() => navigateFullscreen('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={() => navigateFullscreen('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb navigation */}
   
      {/* Main product display */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Product images */}
        <div className="md:w-1/2">
          {/* Main active image */}
          <div 
            className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center cursor-zoom-in"
            onClick={() => openFullscreen(product.images.indexOf(activeImage))}
          >
            <img 
              src={activeImage} 
              alt={product.title} 
              className="object-contain w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30">
              <ZoomIn size={48} className="text-white" />
            </div>
          </div>
          
          {/* Thumbnail gallery */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
              >
                <img 
                  src={img} 
                  alt={`${product.title} view ${index + 1}`} 
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center mb-4">
            <span className="text-gray-600">Brand: </span>
            <span className="font-medium ml-1">{product.brand}</span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  size={16}
                  className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-primary">${product.discountPrice}</span>
            {product.discountPrice < product.price && (
              <>
                <span className="text-gray-500 line-through ml-2">${product.price}</span>
                <span className="bg-red-100 text-red-800 text-xs font-medium ml-2 px-2 py-0.5 rounded">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Color selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Color</h3>
            <div className="flex gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          
          {/* Size selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Delivery options */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Delivery Options</h3>
            <div className="space-y-2">
              {product.deliveryOptions.map(option => (
                <div key={option.type} className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    id={`delivery-${option.type}`}
                    name="delivery" 
                    className="radio radio-primary"
                    defaultChecked={option.type === 'standard'}
                  />
                  <label htmlFor={`delivery-${option.type}`} className="flex items-center">
                    <Truck size={16} className="mr-1" />
                    {option.type === 'standard' ? 'Standard' : 'Express'} Delivery: 
                    {option.price > 0 ? `$${option.price}` : 'Free'} - {option.days} business days
                  </label>
                </div>
              ))}
            </div>
            
            {/* Pincode check */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="input input-bordered input-sm w-32"
                />
                <button 
                  onClick={checkDelivery}
                  className="btn btn-sm btn-primary"
                >
                  Check
                </button>
              </div>
              {deliveryDate && (
                <div className="text-sm text-success mt-1 flex items-center">
                  <Check size={16} className="mr-1" />
                  Delivery available by {deliveryDate}
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4">
            <button className="btn btn-primary flex-1">Add to Cart</button>
            <button className="btn btn-outline btn-primary flex-1">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Product details and reviews */}
      <div className="mb-12">
        <div className="tabs">
          <a className="tab tab-lifted tab-active">Product Details</a>
          <a className="tab tab-lifted">Customer Reviews</a>
        </div>
        
        <div className="p-6 border border-t-0 rounded-b-lg">
          <h3 className="text-xl font-medium mb-4">About this item</h3>
          <p className="mb-6">{product.description}</p>
          
          <h4 className="text-lg font-medium mb-2">Features:</h4>
          <ul className="list-disc pl-6 space-y-1">
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Similar products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts.map(product => (
            <div key={product.id} className="card bg-base-100 border">
              <figure className="px-4 pt-4">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="rounded-xl h-40 object-contain"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-sm">{product.title}</h3>
                <p className="text-gray-600 text-sm">{product.brand}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={12}
                        className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <div className="mt-2">
                  <span className="font-bold">${product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;