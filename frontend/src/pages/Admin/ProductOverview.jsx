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
  const [itemsPerPage] = useState(10);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await productService.getProducts();
      setProducts(res);
      setFilteredProducts(res);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await catergoryService.getAllCategoriesWithSubcategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setIsLoadingCategories(false);
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

if (isLoadingProducts || isLoadingCategories) {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-gray-600 ">
      <div className="text-6xl custom-font animate-pulse">Kasavu Aalayam</div>
      <div className="text-base mt-2 text-gray-500 font-light tracking-wide">Data is being loaded from the server...</div>
    </div>
  );
}


 

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Overview</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 shadow-md hover:bg-blue-700 transition"
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

     <div className="overflow-x-auto bg-white ">
  {currentItems.length > 0 ? (
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
        <tr>
          <th className="px-4 py-3">Image</th>
          <th className="px-4 py-3">SKU</th>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3">Description</th>
          <th className="px-4 py-3">Color</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Subcategory</th>
          <th className="px-4 py-3">Ideal For</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((p) => (
          <tr key={p._id} className="border-t border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">
              <img
                src={p.images[0]?.url}
                alt={p.title}
                className="w-16 h-16 object-cover rounded"
              />
            </td>
            <td className="px-4 py-3">{p.sku}</td>
            <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
            <td className="px-4 py-3 text-gray-500">{p.description}</td>
            <td className="px-4 py-3">{p.color}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                p.stockQuantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {p.stockQuantity}
              </span>
            </td>
            <td className="px-4 py-3">{p.category?.name}</td>
            <td className="px-4 py-3">{p.subcategory?.name}</td>
            <td className="px-4 py-3">{p.productDetails?.idealFor}</td>
            <td className="px-4 py-3 flex gap-2 justify-center">
              <button
                onClick={() => navigate(`update/${p._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="border border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="text-center text-gray-600 py-12">
      <p className="text-lg font-medium">No products found.</p>
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
