import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  AlertTriangle, 
  Filter, 
  ChevronDown,
  ChevronUp,
  Package,
  Tag,
  Warehouse,
  BarChart2,
  ListChecks
} from 'lucide-react';

const InventoryManagement = () => {
  // Sample initial data
  const initialItems = [
    { id: 1, name: 'Cotton Fabric', category: 'Fabric', sku: 'FAB-001', quantity: 150, price: 12.99, threshold: 50 },
    { id: 2, name: 'Silk Scarf', category: 'Accessories', sku: 'ACC-002', quantity: 45, price: 24.99, threshold: 20 },
    { id: 3, name: 'Denim Jeans', category: 'Clothing', sku: 'CLO-003', quantity: 12, price: 39.99, threshold: 15 },
    { id: 4, name: 'Wool Yarn', category: 'Yarn', sku: 'YRN-004', quantity: 8, price: 8.99, threshold: 10 },
  ];

  const [items, setItems] = useState(initialItems);
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    price: '',
    threshold: ''
  });

  // Categories for filtering
  const categories = ['All', ...new Set(initialItems.map(item => item.category))];

  // Check for low stock items
  useEffect(() => {
    const lowStockItems = items.filter(item => item.quantity < item.threshold);
    setAlerts(lowStockItems);
  }, [items]);

  // Filter items based on search and category
  useEffect(() => {
    let result = items;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, items]);

  // Sort items
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: items.length + 1,
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      threshold: parseInt(formData.threshold)
    };
    setItems([...items, newItem]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: '',
      sku: '',
      quantity: '',
      price: '',
      threshold: ''
    });
  };

  // Edit item
  const handleEditItem = (e) => {
    e.preventDefault();
    const updatedItems = items.map(item => 
      item.id === currentItem.id ? { ...item, ...formData } : item
    );
    setItems(updatedItems);
    setIsEditModalOpen(false);
  };

  // Delete item
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Open edit modal with item data
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      threshold: item.threshold
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Package className="mr-2" size={24} /> Inventory Management
        </h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} className="mr-1" /> Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <Package className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <Tag className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="text-2xl font-bold">
                ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </p>
            </div>
            <BarChart2 className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <AlertTriangle className="text-yellow-500 mr-2" size={20} />
            <h3 className="font-semibold text-gray-700">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {alerts.map(item => (
              <div key={item.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-yellow-700">Only {item.quantity} left (threshold: {item.threshold})</p>
                </div>
                <button 
                  onClick={() => openEditModal(item)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <Edit size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Filter className="text-gray-500 mr-2" size={18} />
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1" size={16} /> : 
                        <ChevronDown className="ml-1" size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.key === 'category' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1" size={16} /> : 
                        <ChevronDown className="ml-1" size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortConfig.key === 'quantity' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1" size={16} /> : 
                        <ChevronDown className="ml-1" size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortConfig.key === 'price' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="ml-1" size={16} /> : 
                        <ChevronDown className="ml-1" size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.length > 0 ? (
                sortedItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="text-blue-600" size={18} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{item.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity < item.threshold ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No items found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Inventory Item</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddItem}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.sku}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      name="threshold"
                      required
                      min="1"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.threshold}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Inventory Item</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditItem}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.sku}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      name="threshold"
                      required
                      min="1"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.threshold}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;