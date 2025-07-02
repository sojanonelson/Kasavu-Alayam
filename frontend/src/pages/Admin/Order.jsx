import { useEffect, useState } from 'react';
import { 
  FiPackage, FiTruck, FiCheckCircle, FiXCircle, 
  FiClock, FiSearch, FiFilter, FiRefreshCw 
} from 'react-icons/fi';
import { getAllOrders } from '../../services/orderservices';

const OrdersPage = () => {
  // Order status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: <FiClock className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', icon: <FiPackage className="text-blue-500" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', icon: <FiTruck className="text-indigo-500" />, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', icon: <FiCheckCircle className="text-green-500" />, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', icon: <FiXCircle className="text-red-500" />, color: 'bg-red-100 text-red-800' },
    { value: 'confirmed', label: 'Confirmed', icon: <FiCheckCircle className="text-green-500" />, color: 'bg-green-100 text-green-800' }
  ];

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Transform API data to match component structure
  const transformOrderData = (apiOrders) => {
    return apiOrders.map(order => ({
      id: order.orderTrackingId,
      customer: `${order.userId.firstName} ${order.userId.lastName}`,
      date: order.createdAt,
      items: order.products.reduce((total, product) => total + product.quantity, 0),
      amount: `₹${order.totalPrice}`,
      payment: order.paymentMode === 'cash' ? 'Pending' : 'Paid',
      status: order.orderStatus.toLowerCase(),
      // address: `${order.address.place}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
    }));
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        const transformedOrders = transformOrderData(response);
        console.log(response.addresses)
        setOrders(transformedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSelectedOrder(null);
  };

  // Get status details
  const getStatusDetails = (statusValue) => {
    return statusOptions.find(option => option.value === statusValue) || 
           { value: statusValue, label: statusValue, icon: <FiClock className="text-gray-500" />, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={async () => {
              try {
                const response = await getAllOrders();
                const transformedOrders = transformOrderData(response);
                setOrders(transformedOrders);
              } catch (error) {
                console.error("Failed to refresh orders:", error);
              }
            }}
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.payment === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusDetails(order.status).color}`}>
                      {getStatusDetails(order.status).icon}
                      <span className="ml-1">{getStatusDetails(order.status).label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders found matching your filters
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Order Status - {selectedOrder.id}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Current Status:</p>
                <span className={`px-3 py-1 rounded-full inline-flex items-center mt-1 ${getStatusDetails(selectedOrder.status).color}`}>
                  {getStatusDetails(selectedOrder.status).icon}
                  <span className="ml-1">{getStatusDetails(selectedOrder.status).label}</span>
                </span>
              </div>
              <div className="space-y-3">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateOrderStatus(selectedOrder.id, option.value)}
                    disabled={selectedOrder.status === option.value}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg ${
                      selectedOrder.status === option.value 
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </div>
                    {selectedOrder.status === option.value && (
                      <span className="text-sm text-gray-500">Current</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;