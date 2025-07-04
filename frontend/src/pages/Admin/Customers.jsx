import { useState, useEffect } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiDownload,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomerService from "../../services/customerservice";

const Customers = ({ userRole }) => {
  // Assuming userRole is passed as a prop
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "ascending",
  });

  // Analytics data states
  const [cityDistribution, setCityDistribution] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await CustomerService.getAllCustomers();
        const customerData = response.map((user) => ({
          id: user._id,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Anonymous",
          email: user.email || "No email",
          phone: user.phone,
          role: user.role,
          gender: user.gender || "unknown",
          city: user.addresses?.[0]?.city || "Unknown",
          state: user.addresses?.[0]?.state || "Unknown",
          orders: Math.floor(Math.random() * 20),
          totalSpent: `₹${Math.floor(Math.random() * 50000)}`,
          accountCreated: new Date(user.createdAt),
          addresses: user.addresses || [],
        }));
        setCustomers(customerData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError("Failed to load customer data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Prepare analytics data when customers change
  useEffect(() => {
    if (customers.length === 0) return;

    // City distribution data
    const cityData = customers.reduce((acc, customer) => {
      const city = customer.city || "Unknown";
      const existingCity = acc.find((item) => item.city === city);
      if (existingCity) {
        existingCity.count += 1;
      } else {
        acc.push({ city, count: 1 });
      }
      return acc;
    }, []);
    setCityDistribution(cityData);

    // Gender distribution data
    const genderData = [
      {
        name: "Male",
        value: customers.filter((c) => c.gender === "male").length,
      },
      {
        name: "Female",
        value: customers.filter((c) => c.gender === "female").length,
      },
      {
        name: "Unknown",
        value: customers.filter((c) => !c.gender || c.gender === "unknown")
          .length,
      },
    ];
    setGenderDistribution(genderData);

    // Customer growth data (simplified - would come from API in real app)
    const growthData = [
      { month: "Jan", customers: Math.floor(Math.random() * 100) + 50 },
      { month: "Feb", customers: Math.floor(Math.random() * 100) + 75 },
      { month: "Mar", customers: Math.floor(Math.random() * 100) + 100 },
      { month: "Apr", customers: Math.floor(Math.random() * 100) + 125 },
      { month: "May", customers: Math.floor(Math.random() * 100) + 150 },
      { month: "Jun", customers: Math.floor(Math.random() * 100) + 175 },
    ];
    setCustomerGrowth(growthData);
  }, [customers]);

  // Get unique cities for filter dropdown
  const cities = [
    "All",
    ...new Set(customers.map((customer) => customer.city)),
  ];
  const genders = ["All", "male", "female", "unknown"];

  // Apply filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesCity = cityFilter === "All" || customer.city === cityFilter;
    const matchesGender =
      genderFilter === "All" || customer.gender === genderFilter;

    return matchesSearch && matchesCity && matchesGender;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Request sort
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Refresh customer data
  const refreshCustomers = async () => {
    try {
      setLoading(true);
      const response = await CustomerService.getAllCustomers();
      const customerData = response.map((user) => ({
        id: user._id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Anonymous",
        email: user.email || "No email",
        phone: user.phone,
        gender: user.gender || "unknown",
        city: user.addresses?.[0]?.city || "Unknown",
        state: user.addresses?.[0]?.state || "Unknown",
        orders: Math.floor(Math.random() * 20),
        totalSpent: `₹${Math.floor(Math.random() * 50000)}`,
        accountCreated: new Date(user.createdAt),
        addresses: user.addresses || [],
      }));
      setCustomers(customerData);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh customers:", err);
      setError("Failed to refresh customer data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // View address details
  const [selectedAddress, setSelectedAddress] = useState(null);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <div className="flex space-x-3">
          <button
            onClick={refreshCustomers}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() =>
              alert("Export functionality would be implemented here")
            }
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

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
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
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
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender === "male"
                    ? "Male"
                    : gender === "female"
                    ? "Female"
                    : "Unknown"}
                </option>
              ))}
            </select>
          </div>
          {/* Reset Filters */}
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
            onClick={() => {
              setSearchTerm("");
              setCityFilter("All");
              setGenderFilter("All");
            }}
          >
            <FiFilter className="mr-2" />
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Customer Growth */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-700 mb-4">
                Customer Growth
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="customers"
                      fill="#4F46E5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* City Distribution */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-700 mb-4">
                Customers by City
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cityDistribution
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                    />
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
              <h3 className="font-medium text-gray-700 mb-4">
                Gender Distribution
              </h3>
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
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortConfig.key === "name" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("city")}
                    >
                      <div className="flex items-center">
                        Location
                        {sortConfig.key === "city" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Addresses
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("orders")}
                    >
                      <div className="flex items-center">
                        Orders
                        {sortConfig.key === "orders" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("accountCreated")}
                    >
                      <div className="flex items-center">
                        Account Created
                        {sortConfig.key === "accountCreated" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-white`}
                            >
                              {customer.role === "admin" ? (
                                <FiUser color="red"  />
                              ) : (
                                <FiUser />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {customer.role}
                              </div>
                            </div>
                          </div>
                        </td>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiMail className="mr-1" /> {customer.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiPhone className="mr-1" /> {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.city}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedAddress(customer.addresses)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          disabled={customer.addresses.length === 0}
                        >
                          {customer.addresses.length === 0
                            ? "No addresses"
                            : customer.addresses.length === 1
                            ? "View Address"
                            : `View ${customer.addresses.length} Addresses`}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.accountCreated.toLocaleDateString()}
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
        </>
      )}

      {/* Address Modal */}
      {selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Customer Addresses
              </h3>
              {selectedAddress.length === 0 ? (
                <p className="text-gray-500">No addresses available</p>
              ) : (
                <div className="space-y-4">
                  {selectedAddress.map((address, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                    >
                      <h4 className="font-medium text-gray-700 mb-2">
                        Address {index + 1}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Place:</span>{" "}
                          {address.place || "Not specified"}
                        </p>
                        <p>
                          <span className="font-medium">City:</span>{" "}
                          {address.city || "Not specified"}
                        </p>
                        <p>
                          <span className="font-medium">State:</span>{" "}
                          {address.state || "Not specified"}
                        </p>
                        <p>
                          <span className="font-medium">Post Office:</span>{" "}
                          {address.postOffice || "Not specified"}
                        </p>
                        <p>
                          <span className="font-medium">Pincode:</span>{" "}
                          {address.pincode || "Not specified"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setSelectedAddress(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
