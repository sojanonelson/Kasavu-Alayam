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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product Overview</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
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
        className="border p-2 rounded w-full mb-4"
      />

      <div className="grid grid-cols-1 gap-4">
        {currentItems.map((p) => (
          <div key={p._id} className="border p-4 ">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <img
                  src={p.images[0]?.url}
                  alt={p.title}
                  className="w-32 h-auto object-cover mb-2 "
                />
              </div>
              <div className="w-full md:w-3/3">
                <h2 className="text-lg font-extrabold">SKU:{p.sku}</h2>
                <h2 className="text-sm">Title:{p.title}</h2>
                <p className="text-sm">{p.description}</p>
                <p className="text-sm">Color: {p.color}</p>
                <p className="text-sm">Ideal For: {p.productDetails?.idealFor}</p>
                <p className="text-sm">Category: {p.category?.name}</p>
                <p className="text-sm">Subcategory: {p.subcategory?.name}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`update/${p._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductOverview;
