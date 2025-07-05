import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LoaderCircle, PackageCheck, Truck, IndianRupee, MapPin, ShoppingBag, BadgeCheck, CreditCard } from 'lucide-react';
import { getOrderByTrackingId } from '../../services/orderservices';

const OrderDetails = () => {
  const { id } = useParams(); // get order id from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("DDDD")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByTrackingId(id)
        console.log("RES:", res)
        setOrder(res);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

   if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center text-red-500 mt-10">Order not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto lg:p-6 bg-white mt-10">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <PackageCheck className="text-green-500  hidden lg:block" /> Order Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 text-xs gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-600 hidden lg:block" />
            <span className="font-semibold">Order ID:</span> {order._id}
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="text-emerald-500 hidden lg:block" />
            <span className="font-semibold">Tracking ID:</span> {order.orderTrackingId}
          </div>
          <div className="flex items-center gap-2">
            <Truck className="text-purple-600 hidden lg:block" />
            <span className="font-semibold">Delivery Type:</span> {order.deliveryType.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="text-pink-600 hidden lg:block" />
            <span className="font-semibold">Payment Mode:</span> {order.paymentMode.toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="text-yellow-600 hidden lg:block" />
            <span className="font-semibold">Total:</span> ₹{order.totalPrice}
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="text-green-600 hidden lg:block" />
            <span className="font-semibold">Status:</span> {order.orderStatus.toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="text-gray-600 hidden lg:block" />
            <span className="font-semibold">Transaction ID:</span> {order.transactionId}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="text-red-600 hidden lg:block" /> Shipping Address
          </h2>
          <p>{order.address?.place}</p>
          <p>{order.address?.city}, {order.address?.state}</p>
          <p>{order.address?.postOffice} - {order.address?.pincode}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 hidden lg:block">🧾 Ordered Products</h2>
      <div className="space-y-4">
        {order.products.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4 bg-gray-50 lg:p-4 p-2 rounded-lg shadow-sm">
            <img
              src={item.productId.images[0]?.url}
              alt={item.productId.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold text-md">{item.productId.title}</h3>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
              <p className="text-sm text-gray-600">Color: {item.productId.color}</p>
              <p className="text-sm text-gray-600">Fabric: {item.productId.productDetails.fabric}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;