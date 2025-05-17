import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../../redux/features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
        <div className="ml-4">
          <h3 className="text-sm font-medium">{item.title}</h3>
          <p className="text-sm text-gray-500">₹{item.price}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => dispatch(decrementQuantity(item))}
          className="px-2 py-1 border rounded"
        >
          -
        </button>
        <span className="px-4">{item.quantity}</span>
        <button
          onClick={() => dispatch(incrementQuantity(item))}
          className="px-2 py-1 border rounded"
        >
          +
        </button>
        <button
          onClick={() => dispatch(removeFromCart(item))}
          className="ml-4 text-red-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
