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
            <div key={p._id} className="bg-white border border-gray-200   transition p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <img
                    src={p.images[0]?.url}
                    alt={p.title}
                    className="w-full h-64 object-cover rounded-lg mb-2"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-lg font-bold text-gray-800">SKU: {p.sku}</h2>
                  <h3 className="text-md font-semibold text-gray-700">{p.title}</h3>
                   <h3 className="text-md  text-gray-700">Stock available:{p.stockQuantity}</h3>
                  
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <p className="text-sm text-gray-600">Color: {p.color}</p>
                  <p className="text-sm text-gray-600">Ideal For: {p.productDetails?.idealFor}</p>
                  <p className="text-sm text-gray-600">Category: {p.category?.name}</p>
                  <p className="text-sm text-gray-600">Subcategory: {p.subcategory?.name}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm transition"
                      onClick={() => navigate(`update/${p._id}`)}
                    >
                      Update
                    </button>
                    <button
                      className=" hover:border-red-600 border text-red-600 px-4 py-2 rounded-md transition"
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
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-600">
            <p>No products found.</p>
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
