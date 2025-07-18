import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";
import { useToast } from "../../components/ui/ToastContext";
import catergoryService from "../../services/categoryService";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const { showToast } = useToast();
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingSubCategory, setLoadingSubCategory] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [loadingUpdateId, setLoadingUpdateId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response =
        await catergoryService.getAllCategoriesWithSubcategories();
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }
    setLoadingCategory(true);
    try {
      const response = await catergoryService.createCategory(
        newCategory.trim()
      );
      if (response._id) {
        showToast(`Category "${newCategory.trim()}" added!`, "success");
        setNewCategory("");
        fetchCategories();
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to add category", "error");
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete category "${name}"?`
    );
    if (!confirmDelete) return;
    setLoadingDelete(id);
    try {
      await catergoryService.deleteCategory(id);
      showToast(`Category "${name}" Deleted!`, "success");
      fetchCategories();
    } catch (err) {
      console.log("Failed to delete category:", err);
      showToast("Failed to delete category", "error");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditValue(name);
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) {
      showToast("Category name cannot be empty", "error");
      return;
    }
    setLoadingUpdateId(id);
    try {
      await catergoryService.updateCategory(id, editValue.trim());
      showToast(`Category "${editValue.trim()}" Updated!`, "success");
      setEditId(null);
      setEditValue("");
      fetchCategories();
    } catch (err) {
      console.log("Failed to update category:", err);
      showToast("Failed to update category", "error");
    } finally {
      setLoadingUpdateId(null);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim() || !selectedCategoryId) {
      showToast("Please select a category and enter subcategory name", "error");
      return;
    }
    setLoadingSubCategory(true);
    try {
      const response = await catergoryService.createSubCategory(
        newSubCategory.trim(),
        selectedCategoryId
      );
      if (response._id) {
        showToast(`Subcategory "${newSubCategory.trim()}" added!`, "success");
        setNewSubCategory("");
        setSelectedCategoryId("");
        fetchCategories();
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to add subcategory", "error");
    } finally {
      setLoadingSubCategory(false);
    }
  };

  // Added onKeyDown handlers to allow enter key to add categories/subcategories
  const onCategoryKeyDown = (e) => {
    if (e.key === "Enter" && !loadingCategory) {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const onSubCategoryKeyDown = (e) => {
    if (e.key === "Enter" && !loadingSubCategory) {
      e.preventDefault();
      handleAddSubCategory();
    }
  };

  return (
    <div className="w-full mx-auto mt pt-10 p-6 bg-white rounded-2xl shadow-xl overflow-auto h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 select-none">
        Manage Categories
      </h2>

      {/* Add Category */}
    <div className="flex flex-col md:flex-row justify-between p-4 gap-4">
  {/* Add Category Section */}
  <div className="w-full md:w-2/5 ">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">
      Add Category
    </h3>
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="New category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        onKeyDown={onCategoryKeyDown}
        className="flex-grow border border-gray-300 px-4 py-2  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        disabled={loadingCategory}
        aria-label="New category name"
      />
      <button
        type="button"
        onClick={handleAddCategory}
        disabled={loadingCategory}
        className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2  hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          loadingCategory ? "cursor-not-allowed opacity-70" : ""
        }`}
        title="Add Category"
        aria-live="polite"
      >
        <Plus size={20} />
        {loadingCategory ? "Adding..." : "Add Category"}
      </button>
    </div>
  </div>

  {/* Add Subcategory Section */}
  <div className="w-full md:w-3/5 border-l-2 p-2">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">
      Add Subcategory
    </h3>
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        className="w-full sm:w-1/3 border border-gray-300 px-4 py-2  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        disabled={loadingSubCategory}
        aria-label="Select category for subcategory"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="New subcategory name"
        value={newSubCategory}
        onChange={(e) => setNewSubCategory(e.target.value)}
        onKeyDown={onSubCategoryKeyDown}
        className="flex-grow border border-gray-300 px-4 py-2  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        disabled={loadingSubCategory}
        aria-label="New subcategory name"
      />
      <button
        type="button"
        onClick={handleAddSubCategory}
        disabled={loadingSubCategory}
        className={`flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2  hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
          loadingSubCategory ? "cursor-not-allowed opacity-70" : ""
        }`}
        title="Add Subcategory"
        aria-live="polite"
      >
        <Plus size={20} />
        {loadingSubCategory ? "Adding..." : "Add Subcategory"}
      </button>
    </div>
  </div>
</div>



      {/* Category List */}
      <ul className="space-y-4 border-t-2 pt-5 mt-10">
        <h1 className="text-2xl font-bold mb-4">Available Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="bg-gray-50 p-4  shadow transition cursor-default select-text "
              tabIndex={-1}
            >
              <div className="flex flex-col justify-between items-center gap-2">
                {editId === cat._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2  shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    disabled={loadingUpdateId === cat._id}
                    aria-label="Edit category name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loadingUpdateId) {
                        e.preventDefault();
                        handleUpdate(cat._id);
                      } else if (e.key === "Escape") {
                        setEditId(null);
                        setEditValue("");
                      }
                    }}
                  />
                ) : (
                  <h4 className="flex items-center gap-3 font-semibold text-lg text-gray-900 select-text">
                    Main: {cat.name}
                  </h4>
                )}
                <div className="flex gap-2">
                  {editId === cat._id ? (
                    <button
                      type="button"
                      onClick={() => handleUpdate(cat._id)}
                      disabled={loadingUpdateId === cat._id}
                      className={`text-green-600 font-semibold px-3 py-1 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        loadingUpdateId === cat._id
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:text-green-800"
                      }`}
                      title="Save Category Name"
                    >
                      {loadingUpdateId === cat._id ? "Saving..." : "Save"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEdit(cat._id, cat.name)}
                      className="text-blue-600 hover:text-blue-800 rounded-lg p-1 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Edit category ${cat.name}`}
                      title="Edit Category"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(cat._id, cat.name)}
                    disabled={loadingDelete === cat._id}
                    className={`text-red-600 hover:text-red-800 rounded-lg p-1 transition focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      loadingDelete === cat._id
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label={`Delete category ${cat.name}`}
                    title="Delete Category"
                  >
                    {loadingDelete === cat._id ? "..." : <Trash2 size={18} />}
                  </button>
                </div>
              </div>
              {/* Subcategories */}
              <ul className="mt-2 grid grid-cols-1 gap-2 select-text">
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub) => (
                    <ol
                      key={sub._id}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 transition select-text"
                      tabIndex={0}
                      title={`Subcategory: ${sub.name}`}
                    >
                      <span className="text-gray-700 truncate">{sub.name}</span>
                    </ol>
                  ))
                ) : (
                  <p className="italic text-gray-500 px-3 py-1 select-text">
                    No subcategory yet created
                  </p>
                )}
              </ul>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default ManageCategory;
