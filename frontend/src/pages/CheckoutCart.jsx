// src/pages/Cart/Cart.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';

const CheckoutCart = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg  p-6 flex flex-col md:flex-row gap-8">
        {/* Left: Products */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingCart /> Cart Items
          </h2>
          <div className="space-y-4">
            {/* Dummy Products */}
            {[ 
              { id: 1, name: 'Shirt', image: 'https://res.cloudinary.com/dcr8mot4u/image/upload/v1750444095/products/images-1750444090537-246875254.png', quantity: 2, price: 499 },
              { id: 2, name: 'Pant', image: 'https://res.cloudinary.com/dcr8mot4u/image/upload/v1750513812/products/images-1750513810587-583737850.png', quantity: 1, price: 799 },
              { id: 3, name: 'Saree', image: 'https://res.cloudinary.com/dcr8mot4u/image/upload/v1750513465/products/images-1750513463197-951074017.png', quantity: 1, price: 1299 }
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-700">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Invoice */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{getTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹50</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{(parseFloat(getTotal()) + 50).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Delivery Location: <strong>123, MG Road, Bengaluru</strong></p>
            <p>Delivery by: <strong>India Post</strong></p>
          </div>
          <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2  font-medium">
            Place Order & Secure Pay 
          </button>
        </div>
      </div>

      {/* Trending Products */}
      <div className="w-full max-w-6xl mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Trending Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[ 
            { id: 4, name: 'Kurti', image: '/images/kurti.jpg' },
            { id: 5, name: 'Jeans', image: '/images/jeans.jpg' },
            { id: 6, name: 'Lehenga', image: '/images/lehenga.jpg' }
          ].map((product) => (
            <div key={product.id} className="p-4 bg-white border rounded-lg shadow-sm flex flex-col items-center">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded mb-2" />
              <p className="text-gray-700 font-medium">{product.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutCart;