import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import CartItem from './CartItem';

const Cart = ({ onClose }) => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full md:w-1/3 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Shopping Cart</h2>
          <button onClick={onClose} className="p-1">
            <X size={24} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
            <div className="mt-4 p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">₹{totalPrice}</span>
              </div>
              <button className="w-full bg-black text-white py-2 rounded-md">Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
