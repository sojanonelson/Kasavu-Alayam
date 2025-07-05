import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, MapPin, Truck, CreditCard, ArrowLeft } from 'lucide-react';
import cartService from '../services/cartService';
import { useToast } from '../components/ui/ToastContext';
import { useNavigate } from 'react-router-dom';

const CheckoutCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { addToast } = useToast();
  const navigate = useNavigate()
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getTotal = () => {
    return cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.productId.specialPrice || item.productId.price);
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const fetchCart = async () => {
    try {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const data = await cartService.getUserCart(user.id);
      setCartItems(data.items || []);
      setTotalPrice(data.totalPrice || 0);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      addToast && addToast("Failed to load cart items", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    // Optimistic update
    const updatedCart = cartItems.map((item) => {
      if (item.productId._id === productId) {
        const newQty = item.quantity + change;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedCart);

    try {
      const changedItem = updatedCart.find(i => i.productId._id === productId);
      if (!changedItem || !user?.id) return;

      await cartService.updateCartItemQuantity(user.id, productId, changedItem.quantity);
      // Refresh cart to get updated totals
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity', err);
      addToast && addToast("Failed to update quantity", "error");
      // Revert optimistic update on error
      await fetchCart();
    }
  };

  const handleDelete = async (productId) => {
    try {
      if (!user?.id) return;

      await cartService.removeFromCart(user.id, productId);
      setCartItems(prev => prev.filter(item => item.productId._id !== productId));
      addToast && addToast("Item removed from cart", "success");
      // Refresh cart to get updated totals
      await fetchCart();
    } catch (err) {
      console.error('Failed to delete item', err);
      addToast && addToast("Failed to remove item", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = parseFloat(getTotal());
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
  const orderData = {
    items: cartItems.map(item => ({
      productId: item.productId._id,
      title: item.productId.title,
      price: item.productId.specialPrice || item.productId.price,
      quantity: item.quantity,
      image: item.productId.images[0]?.url || '/placeholder.jpg'
    })),
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    total: total,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
  
  navigate('/checkout', { state: { orderData } });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {cartItems.length} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items - Mobile: Full width, Desktop: 8 columns */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500">Add some items to get started!</p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const product = item.productId;
                    const price = product.specialPrice || product.price;
                    const originalPrice = product.price;
                    const hasDiscount = product.specialPrice && product.specialPrice < product.price;

                    return (
                      <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.images[0]?.url || '/placeholder.jpg'}
                              alt={product.title}
                              className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg border"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-medium text-gray-900 leading-tight">
                                {product.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-gray-900">₹{price}</span>
                                {hasDiscount && (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                      {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Mobile Layout: Quantity and Delete in one row */}
                            <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                              {/* Quantity Controls */}
                              <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(product._id, -1)}
                                  disabled={item.quantity <= 1 || loading}
                                  className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(product._id, 1)}
                                  disabled={loading}
                                  className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(product._id)}
                                disabled={loading}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right sm:text-left">
                              <span className="text-sm text-gray-500">Item total: </span>
                              <span className="font-semibold text-gray-900">
                                ₹{(price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        
          {cartItems.length > 0 && (
            <div className="mt-6 lg:mt-0 lg:col-span-4">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
                    
                 
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Delivery Fee
                        </span>
                        <span>₹{deliveryFee}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">Delivery Address</p>
                          <p className="text-gray-600 mt-1">123, MG Road, Bengaluru</p>
                          <p className="text-gray-500 mt-2 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            Delivered by India Post
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button onClick={()=>handlePlaceOrder()} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Checkout
                    </button>

                    {/* Security Badge */}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">🔒 Secure checkout with 256-bit SSL encryption</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutCart;