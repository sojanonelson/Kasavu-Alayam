import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  Package,
  TrendingUp,
  DollarSign,
  Warehouse,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  IndianRupee
} from 'lucide-react';
import productService from '../../../services/productservice';
import { Link, useNavigate } from 'react-router-dom';

const CollectionProductsScreen = ({ collectionName = "male" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate()

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    stockRange: { min: '', max: '' },
    salesRange: { min: '', max: '' },
    stockStatus: 'all' // all, low, medium, high
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProductByIdeal(collectionName);
        if (response.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [collectionName]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      result = result.filter(product => parseFloat(product.price) >= parseFloat(filters.priceRange.min));
    }
    if (filters.priceRange.max) {
      result = result.filter(product => parseFloat(product.price) <= parseFloat(filters.priceRange.max));
    }

    // Stock range filter
    if (filters.stockRange.min) {
      result = result.filter(product => product.stockQuantity >= parseInt(filters.stockRange.min));
    }
    if (filters.stockRange.max) {
      result = result.filter(product => product.stockQuantity <= parseInt(filters.stockRange.max));
    }

    // Stock status filter
    if (filters.stockStatus !== 'all') {
      result = result.filter(product => {
        if (filters.stockStatus === 'low') return product.stockQuantity <= 10;
        if (filters.stockStatus === 'medium') return product.stockQuantity > 10 && product.stockQuantity <= 50;
        if (filters.stockStatus === 'high') return product.stockQuantity > 50;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, filters, sortBy, sortOrder]);

  const handleFilterChange = (category, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      stockRange: { min: '', max: '' },
      salesRange: { min: '', max: '' },
      stockStatus: 'all'
    });
    setSearchTerm('');
  };

  const getStockStatus = (stock) => {
    if (stock <= 10) return { text: 'Low Stock', color: 'text-red-600 bg-red-100' };
    if (stock <= 50) return { text: 'Medium Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'High Stock', color: 'text-green-600 bg-green-100' };
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortOrder === 'asc' ?
      <ArrowUp size={14} className="text-blue-600" /> :
      <ArrowDown size={14} className="text-blue-600" />;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="mr-2" size={24} />
            {collectionName}
          </h1>
          <p className="text-gray-600 mt-1">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
          </button>
          <div className="flex bg-white rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', 'min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', 'max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Stock Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.stockRange.min}
                  onChange={(e) => handleFilterChange('stockRange', 'min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.stockRange.max}
                  onChange={(e) => handleFilterChange('stockRange', 'max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
              <select
                value={filters.stockStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stock Levels</option>
                <option value="low">Low Stock (≤10)</option>
                <option value="medium">Medium Stock (11-50)</option>
                <option value="high">High Stock (50)</option>
              </select>
            </div>
          </div>
        )}

        {/* Products Content */}
        <div className="flex-1">
          {/* Sort Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { key: 'title', label: 'Name' },
                  { key: 'price', label: 'Price' },
                  { key: 'stockQuantity', label: 'Stock' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => handleSort(option.key)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                      sortBy === option.key ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                    {getSortIcon(option.key)}
                  </button>
                ))}
              </div>
            </div>
           
          </div>

          {/* Products Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stockQuantity);
                return (
                 
                  <div  onClick={() => navigate(`/admin/products/update/${product._id}`)} key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    
                    
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">SKU: {product.sku}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center">
                          <IndianRupee size={16} className="mr-1" />
                          Price
                        </span>
                        <span className="font-semibold text-gray-800">₹{product.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Warehouse size={16} className="mr-1" />
                          Stock
                        </span>
                        <span className="font-semibold text-gray-800">{product.stockQuantity}</span>
                      </div>
                    </div>
                    
                  </div>
                    
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stockQuantity);
                    return (
                      
                      <tr onClick={() => navigate(`/admin/products/update/${product._id}`)} key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stockQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionProductsScreen;
