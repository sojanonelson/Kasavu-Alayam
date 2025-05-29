import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';

const MyAccount = () => {
  // Example user data
  const user = {
    name: 'Achu',
    email: 'anandhu292@gmail.com',
    joinDate: 'May 30, 2025',
  };

  // Example order history
  const orderHistory = [
    { id: 1, date: '2023-10-01', total: '₹1,200', status: 'Delivered' },
    { id: 2, date: '2023-09-15', total: '₹800', status: 'Delivered' },
    { id: 3, date: '2023-08-20', total: '₹1,500', status: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500 text-sm">Member since {user.joinDate}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-2">
              <Link to="/account/profile" className="flex items-center gap-2 text-gray-700 hover:text-black">
                <User size={18} />
                <span>Profile Information</span>
              </Link>
              <Link to="/account/orders" className="flex items-center gap-2 text-gray-700 hover:text-black">
                <ShoppingBag size={18} />
                <span>Order History</span>
              </Link>
              <Link to="/account/wishlist" className="flex items-center gap-2 text-gray-700 hover:text-black">
                <Heart size={18} />
                <span>Wishlist</span>
              </Link>
              <Link to="/account/settings" className="flex items-center gap-2 text-gray-700 hover:text-black">
                <Settings size={18} />
                <span>Settings</span>
              </Link>
              <Link to="/logout" className="flex items-center gap-2 text-gray-700 hover:text-black">
                <LogOut size={18} />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order History</h3>
          <div className="space-y-4">
            {orderHistory.map((order) => (
              <div key={order.id} className="border-b pb-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-gray-600 text-sm">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <p className={`text-sm ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.status}
                    </p>
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

export default MyAccount;
