import { useEffect, useState } from 'react';
import stockService from '../../../services/stockService';
import { useNavigate, useParams } from 'react-router-dom';

const InventoryCollections = () => {
  const { id: collectionId } = useParams();
  const [threshold, setThreshold] = useState(5);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate()

  const loadData = async () => {
    setLoading(true);
    try {
      const [stockRes, categoryRes] = await Promise.all([
        stockService.getAllLowStockCollection(collectionId, threshold),
        stockService.getAllLowStockCategory(collectionId),
      ]);

      setData(stockRes);
      setCategoryOptions(categoryRes);
      if (categoryRes.length > 0) setSelectedCategory(categoryRes[0]);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionId) {
      loadData();
    }
  }, [collectionId, threshold]);

  const productsToDisplay = selectedCategory ? data[selectedCategory] || [] : [];

  const sortedProducts = [...productsToDisplay].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.stockQuantity - b.stockQuantity
      : b.stockQuantity - a.stockQuantity;
  });

  return (

  
    <div className="p-0 w-full bg-white min-h-screen">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-screen text-gray-600 ">
      <div className="text-6xl custom-font animate-pulse">Kasavu Aalayam</div>
      <div className="text-base mt-2 text-gray-800 font-light tracking-wide">Data is being loaded from the server...</div>
    </div>
      ) : (
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-white p-4 h-screen border-r-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Stock Threshold:</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {categoryOptions.length > 1 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Filter by Category:</label>
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="md:col-span-3 bg-white p-0 rounded-lg">
            {productsToDisplay.length > 0 ? (
              <div className="overflow-x-auto py-3">
                <h3 className="text-2xl font-semibold text-yellow-800 mb-4">
                  Low stock of {selectedCategory}
                </h3>

                <div className="flex justify-end mb-2 pr-4">
                  <label className="mr-2 text-gray-700 font-medium">Sort by Stock:</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border px-3 py-1 rounded"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <table className="w-full bg-white">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="text-left px-4 py-2">Image</th>
                      <th className="text-left px-4 py-2">Title</th>
                      <th className="text-left px-4 py-2">Description</th>
                      <th className="text-left px-4 py-2">Stock</th>
                      <th className="text-left px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product) => (
                      <tr key={product._id}  onClick={() => navigate(`/admin/products/update/${product._id}`)} className="border-t cursor-pointer hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <img
                            src={product.images[0]?.url}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold">{product.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.description}</td>
                        <td className="px-4 py-3 text-red-600 font-bold">{product.stockQuantity}</td>
                        <td className="px-4 py-3 text-green-600">₹{product.specialPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No low stock products found for this category.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryCollections;
