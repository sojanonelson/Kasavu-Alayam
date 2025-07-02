import React, { useEffect, useState } from 'react';
import { getOrdersByUser } from '../../services/orderservices';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) {
          navigate('/login');
          return;
        }
        
        const data = await getOrdersByUser(userId);
        setOrders(data || []);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500">You haven't placed any orders yet.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl  mx-auto  sm:px-6 lg:px-8">
        <div className="bg-white   overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Your Orders</h1>
          </div>
          
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-xs">Order #{order.orderTrackingId}</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.orderStatus)}
                        <span className="text-sm capitalize">{order.orderStatus}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={product.productId?.images?.[0]?.url || '/placeholder-product.png'}
                              alt={product.productId?.title}
                              className="w-16 h-16 object-cover rounded border"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-xs">
                              {product.productId?.title || 'Product not available'}
                            </h3>
                            <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                            <p className="text-sm font-medium">₹{product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="sm:text-right">
                    <p className="text-lg font-semibold">₹{order.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {order.deliveryType === 'shop_pickup' ? 'Store Pickup' : 'Home Delivery'}
                    </p>
                    <button
                      onClick={() => navigate(`/my-account/order/${order.orderTrackingId}`)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;