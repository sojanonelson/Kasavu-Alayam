import { useState, useEffect } from "react";
import { getDashboardData } from "../../services/dashboardService";
import Lottie from 'react-lottie';
import loadingAnimation from '../../assets/dashboard.json';
import {
  DollarSign,
  ShoppingBag,
  CreditCard,
  Truck,
  AlertCircle,
  RefreshCw,
  Calendar,
  ShoppingCart,
  Users,
  User,
  Package,
  Box,
  PieChart,
  BarChart2,
  Activity,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const ModernDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    paymentMethods: { cash: { amount: 0 }, upi: { amount: 0 } },
    deliveryTypes: { shop_pickup: { count: 0 }, online_delivery: { count: 0 } },
    combinedStats: {},
    lowStockProducts: [],
    recentPayments: [],
    recentOrders: [],
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await getDashboardData();
      setDashboardData({
        totalUsers: response.overview.totalUsers,
        maleUsers: response.overview.maleUsers,
        femaleUsers: response.overview.femaleUsers,
        totalRevenue: response.overview.totalRevenue,
        totalOrders: response.overview.totalOrders,
        paymentMethods: response.revenueStats.paymentMethods,
        deliveryTypes: response.revenueStats.deliveryTypes,
        combinedStats: response.revenueStats.combinedStats,
        lowStockProducts: response.lowStockProducts,
        recentPayments: response.recentPayments,
        recentOrders: response.recentOrders,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-96 h-96"> {/* 384px = w-96 */}
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
        <p className="text-xl font-semibold text-gray-700 ">
          Loading dashboard data...
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-2 text-indigo-600" />
            Kasavu Aalayam Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Revenue */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ₹{dashboardData.totalRevenue.toLocaleString("en-IN")}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Total Orders */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {dashboardData.totalOrders.toLocaleString("en-IN")}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Total Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {dashboardData.totalUsers.toLocaleString("en-IN")}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Low Stock Items */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {dashboardData.lowStockProducts.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second Row - Gender Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
          {/* Male Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Male Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {dashboardData.maleUsers.toLocaleString("en-IN")}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Female Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-pink-500 rounded-md p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Female Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {dashboardData.femaleUsers.toLocaleString("en-IN")}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Third Row - Payment and Delivery */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-8">
          {/* Payment Methods */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <CreditCard className="mr-2 text-indigo-600" />
                Payment Methods
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 text-green-500" />
                    <span className="text-sm font-medium text-gray-500">Cash</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{dashboardData.paymentMethods.cash?.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 text-purple-500" />
                    <span className="text-sm font-medium text-gray-500">UPI</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{dashboardData.paymentMethods.upi?.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Delivery Types */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Truck className="mr-2 text-indigo-600" />
                Delivery Types
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <Package className="mr-2 text-blue-500" />
                    <span className="text-sm font-medium text-gray-500">Shop Pickup</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {dashboardData.deliveryTypes.shop_pickup?.count}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <Truck className="mr-2 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-500">Online Delivery</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {dashboardData.deliveryTypes.online_delivery?.count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Fourth Row - Low Stock Products */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <AlertCircle className="mr-2 text-red-500" />
              Low Stock Products
            </h3>
          </div>
          <div className="bg-white overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {dashboardData.lowStockProducts.map((product, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Box className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <p className="ml-4 text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {product.stockQuantity} left
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Fifth Row - Recent Activity */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Recent Payments */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <CreditCard className="mr-2 text-green-500" />
                Recent Payments
              </h3>
            </div>
            <div className="bg-white overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {dashboardData.recentPayments.map((payment, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${payment.status === 'captured' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {payment.status === 'captured' ? (
                            <DollarSign className="h-4 w-4 mx-auto mt-0.5" />
                          ) : (
                            <Activity className="h-4 w-4 mx-auto mt-0.5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{payment.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.method} • {new Date(payment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'captured' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ShoppingBag className="mr-2 text-blue-500" />
                Recent Orders
              </h3>
            </div>
            <div className="bg-white overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-800">
                          <ShoppingBag className="h-4 w-4 mx-auto mt-0.5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customer} • ₹{order.amount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {order.items} items
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernDashboard;
