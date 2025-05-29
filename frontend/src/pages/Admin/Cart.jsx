// src/pages/Cart/Cart.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import { ShoppingCart, Trash2, Package, X } from 'lucide-react';

const Cart = ({ onClose }) => {
  // Access cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const hasItems = cartItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black bg-opacity-40 backdrop-blur-sm" />
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-lg flex flex-col px-4 sm:px-6 py-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          Your Cart
        </h2>

        {!hasItems ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 flex-1 mt-20">
            <Package className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-xl font-semibold">No products found</p>
            <p className="text-sm">Looks like you haven’t added anything yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white p-4 shadow-sm rounded-xl border hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-28 object-cover rounded-xl mr-4 border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-md font-bold text-green-700">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Total: ₹{getTotal()}</h3>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
                Checkout
              </button>
            </div>
          </>
        )}

        <div className="w-full mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Cart;
