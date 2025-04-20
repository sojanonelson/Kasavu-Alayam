import { useState, useEffect } from 'react';
import { 
  FiUsers, FiSearch, FiFilter, FiDownload, 
  FiMapPin, FiUser, FiMail, FiPhone, FiCalendar 
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Customers= () => {
  // Sample customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Anitha Menon",
      email: "anitha@example.com",
      phone: "+91 9876543210",
      gender: "Female",
      city: "Kochi",
      state: "Kerala",
      orders: 5,
      totalSpent: "₹24,500",
      lastOrder: "2023-06-12",
      joinedDate: "2022-01-15"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 8765432109",
      gender: "Male",
      city: "Thiruvananthapuram",
      state: "Kerala",
      orders: 3,
      totalSpent: "₹12,750",
      lastOrder: "2023-06-10",
      joinedDate: "2022-03-22"
    },
    {
      id: 3,
      name: "Priya Nair",
      email: "priya@example.com",
      phone: "+91 7654321098",
      gender: "Female",
      city: "Kozhikode",
      state: "Kerala",
      orders: 7,
      totalSpent: "₹38,200",
      lastOrder: "2023-06-08",
      joinedDate: "2021-11-05"
    },
    {
      id: 4,
      name: "Suresh Pillai",
      email: "suresh@example.com",
      phone: "+91 6543210987",
      gender: "Male",
      city: "Kochi",
      state: "Kerala",
      orders: 2,
      totalSpent: "₹9,500",
      lastOrder: "2023-05-28",
      joinedDate: "2023-02-18"
    },
    {
      id: 5,
      name: "Deepa Krishnan",
      email: "deepa@example.com",
      phone: "+91 9432109876",
      gender: "Female",
      city: "Thrissur",
      state: "Kerala",
      orders: 4,
      totalSpent: "₹21,300",
      lastOrder: "2023-06-05",
      joinedDate: "2022-07-30"
    },
    {
      id: 6,
      name: "Mohan Das",
      email: "mohan@example.com",
      phone: "+91 8321098765",
      gender: "Male",
      city: "Kannur",
      state: "Kerala",
      orders: 1,
      totalSpent: "₹4,250",
      lastOrder: "2023-04-15",
      joinedDate: "2023-03-10"
    },
    {
      id: 7,
      name: "Lakshmi Nair",
      email: "lakshmi@example.com",
      phone: "+91 7210987654",
      gender: "Female",
      city: "Kochi",
      state: "Kerala",
      orders: 6,
      totalSpent: "₹32,800",
      lastOrder: "2023-06-11",
      joinedDate: "2021-09-12"
    },
    {
      id: 8,
      name: "Vishnu Pillai",
      email: "vishnu@example.com",
      phone: "+91 6109876543",
      gender: "Male",
      city: "Alappuzha",
      state: "Kerala",
      orders: 3,
      totalSpent: "₹15,750",
      lastOrder: "2023-05-30",
      joinedDate: "2022-11-20"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // Analytics data states
  const [cityDistribution, setCityDistribution] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);

  // Get unique cities for filter dropdown
  const cities = ['All', ...new Set(customers.map(customer => customer.city))];
  const genders = ['All', 'Male', 'Female'];

  // Apply filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'All' || customer.city === cityFilter;
    const matchesGender = genderFilter === 'All' || customer.gender === genderFilter;
    
    return matchesSearch && matchesCity && matchesGender;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Prepare analytics data
  useEffect(() => {
    // City distribution data
    const cityData = customers.reduce((acc, customer) => {
      const cityIndex = acc.findIndex(item => item.city === customer.city);
      if (cityIndex >= 0) {
        acc[cityIndex].count += 1;
        acc[cityIndex].totalSpent += parseInt(customer.totalSpent.replace(/[^0-9]/g, ''));
      } else {
        acc.push({
          city: customer.city,
          count: 1,
          totalSpent: parseInt(customer.totalSpent.replace(/[^0-9]/g, ''))
        });
      }
      return acc;
    }, []);

    setCityDistribution(cityData);

    // Gender distribution data
    const genderData = [
      { name: 'Male', value: customers.filter(c => c.gender === 'Male').length },
      { name: 'Female', value: customers.filter(c => c.gender === 'Female').length }
    ];

    setGenderDistribution(genderData);

    // Customer growth data (simplified)
    const growthData = [
      { month: 'Jan', customers: 120 },
      { month: 'Feb', customers: 145 },
      { month: 'Mar', customers: 180 },
      { month: 'Apr', customers: 210 },
      { month: 'May', customers: 250 },
      { month: 'Jun', customers: 290 }
    ];

    setCustomerGrowth(growthData);
  }, [customers]);

  // Download customer data
  const handleDownload = () => {
    // In a real app, this would generate a CSV or Excel file
    alert('Download functionality would export customer data here');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <div className="flex space-x-3">
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* City Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
            onClick={() => {
              setSearchTerm('');
              setCityFilter('All');
              setGenderFilter('All');
            }}
          >
            <FiFilter className="mr-2" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Growth */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Customer Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Customers by City</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cityDistribution.sort((a, b) => b.count - a.count).slice(0, 5)}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="city" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Gender Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('city')}
                >
                  <div className="flex items-center">
                    Location
                    {sortConfig.key === 'city' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('orders')}
                >
                  <div className="flex items-center">
                    Orders
                    {sortConfig.key === 'orders' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('totalSpent')}
                >
                  <div className="flex items-center">
                    Total Spent
                    {sortConfig.key === 'totalSpent' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lastOrder')}
                >
                  <div className="flex items-center">
                    Last Order
                    {sortConfig.key === 'lastOrder' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <FiUser />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.city}</div>
                    <div className="text-sm text-gray-500">{customer.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedCustomers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No customers found matching your filters
          </div>
        )}
      </div>

      {/* Pagination would go here in a real implementation */}
    </div>
  );
};

export default Customers;