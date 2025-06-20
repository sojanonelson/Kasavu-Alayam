import { useState, useEffect } from 'react';
import { 
  FiUsers, FiShoppingBag, FiDollarSign, FiPieChart, 
  FiTrendingUp, FiCalendar, FiRefreshCw, FiBox,
  FiArrowUp, FiArrowDown, FiEye, FiMoreHorizontal
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const ModernDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('monthly');

  // Enhanced sample data
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 120, revenue: 45000 },
    { name: 'Feb', sales: 3000, orders: 98, revenue: 38000 },
    { name: 'Mar', sales: 5000, orders: 156, revenue: 62000 },
    { name: 'Apr', sales: 2780, orders: 89, revenue: 34000 },
    { name: 'May', sales: 1890, orders: 67, revenue: 28000 },
    { name: 'Jun', sales: 2390, orders: 78, revenue: 31000 },
  ];

  const categoryData = [
    { name: 'Sarees', value: 35, sales: 15420 },
    { name: 'Mundu', value: 25, sales: 11050 },
    { name: 'Shirts', value: 20, sales: 8840 },
    { name: 'Dhoti', value: 15, sales: 6630 },
    { name: 'Others', value: 5, sales: 2210 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Enhanced stats with animations
  const [stats, setStats] = useState([
    { 
      id: 1, 
      title: "Total Revenue", 
      value: "₹1,42,659", 
      change: "+12%", 
      trend: "up",
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    { 
      id: 2, 
      title: "Total Orders", 
      value: "1,248", 
      change: "+8%", 
      trend: "up",
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      id: 3, 
      title: "New Customers", 
      value: "324", 
      change: "+5%", 
      trend: "up",
      icon: <FiUsers className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    { 
      id: 4, 
      title: "Inventory Items", 
      value: "2,187", 
      change: "-2%", 
      trend: "down",
      icon: <FiBox className="w-6 h-6" />,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
  ]);

  // Enhanced recent orders
  const recentOrders = [
    { id: '#KA-1001', customer: 'Anitha Menon', amount: '₹3,499', status: 'Delivered', date: '12 Jun 2023', items: 2 },
    { id: '#KA-1002', customer: 'Deepa Krishnan', amount: '₹5,999', status: 'Shipped', date: '11 Jun 2023', items: 1 },
    { id: '#KA-1003', customer: 'Meera Nair', amount: '₹2,850', status: 'Processing', date: '10 Jun 2023', items: 3 },
    { id: '#KA-1004', customer: 'Priya Suresh', amount: '₹7,250', status: 'Delivered', date: '09 Jun 2023', items: 2 },
    { id: '#KA-1005', customer: 'Lakshmi Kumar', amount: '₹4,500', status: 'Cancelled', date: '08 Jun 2023', items: 1 },
  ];

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Delivered': return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      case 'Shipped': return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
      case 'Processing': return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' };
      case 'Cancelled': return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Kasavu Aalayam Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <FiRefreshCw className={`mr-2 transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              Refresh
            </button>
            <div className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 shadow-lg">
              <FiCalendar className="mr-2" />
              Last 30 days
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id} 
              className="group relative bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:scale-105 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.textColor} shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                    stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                    <span className="text-sm font-semibold">{stat.change}</span>
                  </div>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart - Larger */}
          <div className="xl:col-span-2 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {['monthly', 'weekly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                      activeTab === tab 
                        ? 'bg-white text-blue-600 shadow-sm font-medium' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Chart */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Sales by Category</h2>
            <div className="h-80 flex flex-col">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="200">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{item.value}%</div>
                      <div className="text-xs text-gray-500">₹{item.sales}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Orders */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
              <span>View All</span>
              <FiEye className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-600">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {order.customer.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                              <div className="text-xs text-gray-500">{order.items} items</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{order.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                            <span>{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <FiMoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FiTrendingUp size={24} />,
              title: "Top Selling Product",
              value: "Kasavu Saree (Gold Border)",
              subtitle: "42 sold this month",
              color: "from-indigo-500 to-blue-600",
              bgColor: "bg-indigo-50"
            },
            {
              icon: <FiPieChart size={24} />,
              title: "Average Order Value",
              value: "₹3,842",
              subtitle: "+8% from last month",
              color: "from-green-500 to-emerald-600",
              bgColor: "bg-green-50"
            },
            {
              icon: <FiUsers size={24} />,
              title: "Customer Retention",
              value: "68%",
              subtitle: "42 repeat customers",
              color: "from-purple-500 to-pink-600",
              bgColor: "bg-purple-50"
            }
          ].map((item, index) => (
            <div key={index} className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} ${item.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">{item.title}</p>
                  <p className="text-xl font-bold text-gray-900 mb-1">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;