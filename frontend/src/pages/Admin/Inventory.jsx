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
  ListChecks,
  Users,
  UserCheck,
  Baby,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

  // Collections data
  const collections = [
    {
      id: 1,
      title: "Women's Collection",
      icon: Users,
      totalProducts: 245,
      bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      iconColor: "text-pink-100",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Men's Collection",
      icon: UserCheck,
      totalProducts: 189,
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      iconColor: "text-blue-100",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Kids Collection",
      icon: Baby,
      totalProducts: 156,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      iconColor: "text-green-100",
      textColor: "text-white"
    },
    {
      id: 4,
      title: "Traditional Saree Collection",
      icon: Sparkles,
      totalProducts: 98,
      bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
      iconColor: "text-purple-100",
      textColor: "text-white"
    }
  ];

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

      {/* Collections Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Tag className="mr-2" size={20} /> Collections Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => {
            const IconComponent = collection.icon;
            return (
              <div
                key={collection.id}
                className={`${collection.bgColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all duration-300`}>
                    <IconComponent className={`${collection.iconColor} group-hover:scale-110 transition-transform duration-300`} size={24} />
                  </div>
                  <div className={`${collection.textColor} text-right`}>
                    <p className="text-2xl font-bold">{collection.totalProducts}</p>
                    <p className="text-sm opacity-90">Products</p>
                  </div>
                </div>
                <h3 className={`${collection.textColor} text-lg font-semibold mb-2`}>
                  {collection.title}
                </h3>
                <div className="flex items-center justify-between">
                  <Link to="collection" className={`${collection.textColor} text-sm opacity-90`}>
                    View Collection
                  </Link>
                  <ChevronDown className={`${collection.iconColor} group-hover:translate-x-1 transition-transform duration-300`} size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;