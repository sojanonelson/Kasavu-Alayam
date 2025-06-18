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
import collectionService from '../../services/collectionService';

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [collections, setCollections] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    price: '',
    threshold: ''
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await collectionService.getAllCollection();
      setCollections(res);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Categories for filtering
  const categories = ['All', ...new Set(items.map(item => item.category))];

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
       
      </div>

      {/* Collections Grid */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <div
              key={collection._id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-200 rounded-lg group-hover:bg-opacity-30 transition-all duration-300">
                  <Package className="text-gray-800 group-hover:scale-110 transition-transform duration-300" size={24} />
                </div>
                <div className="text-gray-800 text-right">
                  <p className="text-2xl font-bold">{collection.categories.length}</p>
                  <p className="text-sm opacity-90">Products</p>
                </div>
              </div>
              <h3 className="text-gray-800 text-lg font-semibold mb-2">
                {collection.title}
              </h3>
              <div className="flex items-center justify-between">
                <Link
  to={`collection/${collection._id}`}
  className="text-gray-800 text-sm opacity-90"
>
  View Collection
</Link>

                <ChevronDown className="text-gray-800 group-hover:translate-x-1 transition-transform duration-300" size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
