import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../services/productservice";
import catergoryService from "../../services/categoryService";

const ProductOverview = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts();
      setProducts(res);
      setFilteredProducts(res);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await catergoryService.getAllCategoriesWithSubcategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(val) ||
        p.description.toLowerCase().includes(val) ||
        p.color.toLowerCase().includes(val) ||
        p?.category?.name?.toLowerCase().includes(val) ||
        p?.sku?.toLowerCase().includes(val)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Overview</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2  shadow-md hover:bg-blue-700 transition"
          onClick={() => navigate("create")}
        >
          Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearch}
        className="border border-gray-300 p-3 rounded-lg w-2/5 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {currentItems.length > 0 ? (
    currentItems.map((p) => (
      <div key={p._id} className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-6 rounded-xl">
        <div className="flex gap-4">
          <div className="w-1/3 flex-shrink-0">
            <img
              src={p.images[0]?.url}
              alt={p.title}
              className="w-auto lg:h-64 object-cover rounded-lg shadow-sm"
            />
          </div>
          <div className="w-2/3 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {p.sku}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  p.stockQuantity > 10 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {p.stockQuantity}
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{p.title}</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{p.description}</p>
              
              <div className="space-y-1 text-xs text-gray-500">
                <p><span className="font-medium">Color:</span> {p.color}</p>
                <p><span className="font-medium">For:</span> {p.productDetails?.idealFor}</p>
                <p><span className="font-medium">Category:</span> {p.category?.name}</p>
                <p><span className="font-medium">Sub:</span> {p.subcategory?.name}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                onClick={() => navigate(`update/${p._id}`)}
              >
                Update
              </button>
              <button
                className="flex-1 bg-white border border-red-300 hover:border-red-400 hover:bg-red-50 text-red-600 text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-600 py-12">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6a2 2 0 00-2 2v3" />
        </svg>
      </div>
      <p className="text-lg font-medium text-gray-700">No products found.</p>
      <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
    </div>
  )}
</div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 rounded-lg transition ${
              currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            } hover:bg-blue-500 hover:text-white`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductOverview;
