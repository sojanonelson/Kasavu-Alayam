import React, { useEffect, useState } from 'react';
import { getUserAddresses } from '../services/AddressService';
import { createOrder } from '../services/orderservices';
import { useLocation, useNavigate } from 'react-router-dom';
import { Truck, Store, Home, CreditCard, ChevronRight } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  console.log("ORDER DATA:", orderData)
  console.log("0 AD:", selectedAddress)
  console.log("1 AD:",addresses)
  console.log("2 AD:",selectedAddressId)

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      getUserAddresses(userId)
        .then(data => setAddresses(data.addresses || []))
        .catch(err => console.error('Failed to load addresses:', err));
    }
  }, [userId]);

  const handleMethodChange = (method) => {
    setDeliveryMethod(method);
    setSelectedAddressId(null);
    setSelectedAddress(null);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        resolve();
      };
      document.body.appendChild(script);
    });
  };

  const createNewOrder = async (paymentId, paymentMode) => {
    try {
      const orderItems = orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      console.log("AD:", selectedAddress)


      const orderPayload = {
        userId: userId,
        products: orderItems,
        deliveryType: deliveryMethod === 'shop' ? 'shop_pickup' : 'online_delivery',
        paymentMode: paymentMode,
        transactionId: paymentId,
        totalPrice: orderData.total,
        address: deliveryMethod === 'online' ? selectedAddress : undefined
      };

      const response = await createOrder(orderPayload);
      return response;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  const openRazorpay = async () => {
    if (!orderData) return;

    try {
      setIsProcessingPayment(true);
      
      const options = {
        key: process.env.REACT_APP_RAZOR_API,
        amount: orderData.total * 100,
        currency: "INR",
        name: "Kasavu Aalayam",
        description: "Textile shop purchase",
        image: "https://i.ibb.co/xKCdHHPc/TEST.png",
        handler: async function (response) {
          try {
            const order = await createNewOrder(response.razorpay_payment_id, 'upi');
            navigate("/thank-you", { 
              state: { 
                orderId: order.orderTrackingId,
                amount: orderData.total,
                items: orderData.items 
              } 
            });
          } catch (error) {
            alert("Order creation failed. Please contact support with your payment ID.");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#e63946",
        },
      };

      await loadRazorpay();
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

const handlePayment = async () => {
  if (deliveryMethod === 'shop') {
    const useRazorpay = window.confirm(
      'Would you like to pay now with Razorpay? Click OK for online payment or Cancel to pay cash at store.'
    );
    if (useRazorpay) {
      await openRazorpay();
    } else {
      try {
        const order = await createNewOrder(`cash-${Date.now()}`, 'cash');
        navigate("my-account/orders", { 
          state: { 
            orderId: order.orderTrackingId,
            amount: orderData.total,
            items: orderData.items,
            pickup: true
          } 
        });
      } catch (error) {
        alert("Order creation failed. Please try again.");
      }
    }
  } else if (deliveryMethod === 'online') {
    if (!selectedAddressId) {
      alert('Please select an address');
      return;
    }
    
    // Find the selected address and set it before proceeding
    const selected = addresses.find(a => a._id === selectedAddressId);
    if (!selected) {
      alert('Invalid address selected');
      return;
    }
    
    // Set the selected address in state
    setSelectedAddress({
      place: selected.place,
      city: selected.city,
      state: selected.state,
      postOffice: selected.postOffice,
      pincode: selected.pincode
    });

    // Wait for state to update if needed, then proceed
    await new Promise(resolve => setTimeout(resolve, 0));
    
    await openRazorpay();
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Order Details & Delivery Options */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                  Your Order
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {orderData ? (
                  <>
                    {orderData.items.map((item, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500">Loading order details...</div>
                )}
              </div>
            </div>

            {/* Delivery Method Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 p-1 rounded-full">
                    <Truck className="w-4 h-4" />
                  </span>
                  Delivery Method
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleMethodChange('shop')}
                    className={`p-4 border-2 rounded-lg transition-all ${deliveryMethod === 'shop' ? 
                      'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    disabled={isProcessingPayment}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${deliveryMethod === 'shop' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Store Pickup</h3>
                        <p className="text-sm text-gray-500">Collect from our shop</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleMethodChange('online')}
                    className={`p-4 border-2 rounded-lg transition-all ${deliveryMethod === 'online' ? 
                      'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    disabled={isProcessingPayment}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${deliveryMethod === 'online' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Home className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Home Delivery</h3>
                        <p className="text-sm text-gray-500">Shipped to your address</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Details Section */}
            {deliveryMethod === 'shop' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 p-1 rounded-full">
                      <Store className="w-4 h-4" />
                    </span>
                    Pickup Information
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Idukki Kasavu Alayam</h4>
                    <p className="text-gray-600 mt-1">123 Main Street, Idukki, Kerala</p>
                    <p className="text-sm text-gray-500 mt-2">Open: Mon-Sat, 9AM-6PM</p>
                    <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                      <p className="text-sm font-medium">Payment Options:</p>
                      <p className="text-sm text-gray-600">Cash or Razorpay</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {deliveryMethod === 'online' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 p-1 rounded-full">
                      <Home className="w-4 h-4" />
                    </span>
                    Delivery Address
                  </h3>
                  
                  {addresses.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-gray-700">No address found</p>
                      <a 
                        href="/account/address" 
                        className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add a new address
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map(addr => (
                        <div
                          key={addr._id}
                         onClick={() => {
      if (!isProcessingPayment) {
        setSelectedAddressId(addr._id);
        setSelectedAddress({
          place: addr.place,
          city: addr.city,
          state: addr.state,
          postOffice: addr.postOffice,
          pincode: addr.pincode
        });
      }
    }}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr._id ? 
                            'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                            ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${selectedAddressId === addr._id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
                              <Home className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{addr.place}</h4>
                              <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                              {selectedAddressId === addr._id && (
                                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium">Delivery Information:</p>
                    <p className="text-sm text-gray-600">Shipped via India Post (3-5 business days)</p>
                    <p className="text-sm text-gray-600 mt-1">Payment: Razorpay only</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="lg:col-span-4 mt-6 lg:mt-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  {orderData ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>₹{orderData.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery</span>
                          <span>₹{orderData.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{orderData.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {deliveryMethod && (
                        <button
                          onClick={handlePayment}
                          disabled={isProcessingPayment || (deliveryMethod === 'online' && !selectedAddressId)}
                          className={`w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2
                            ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}
                            ${deliveryMethod === 'online' && !selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isProcessingPayment ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5" />
                              Place Order
                            </>
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">Loading order details...</p>
                  )}

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Secure checkout with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;