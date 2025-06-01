import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await catergoryService.getAllCategoriesWithSubcategories();
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await catergoryService.createCategory(newCategory);
      if (response._id) {
        showToast(`Category "${newCategory}" added!`, "success");
        setNewCategory("");
        fetchCategories();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await catergoryService.deleteCategory(id);
      showToast(`Category "${name}" Deleted!`, "success");
      fetchCategories();
    } catch (err) {
      console.log("Failed to delete category:", err);
      showToast("Failed to delete category", "error");
    }
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditValue(name);
  };

  const handleUpdate = async (id) => {
    try {
      await catergoryService.updateCategory(id, editValue);
      showToast(`Category "${editValue}" Updated!`, "success");
      setEditId(null);
      setEditValue("");
      fetchCategories();
    } catch (err) {
      console.log("Failed to update category:", err);
      showToast("Failed to update category", "error");
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory || !selectedCategoryId) {
      showToast("Please select a category and enter subcategory name", "error");
      return;
    }
    try {
      const response = await catergoryService.createSubCategory(
        newSubCategory,
        selectedCategoryId
      );
      if (response._id) {
        showToast(`Subcategory "${newSubCategory}" added!`, "success");
        setNewSubCategory("");
        setSelectedCategoryId("");
        fetchCategories();
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to add subcategory", "error");
    }
  };

  return (
    <div className="max-w-xl h-screen mx-auto mt-10 p-4 bg-white rounded-xl shadow-md overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Add Subcategory</h3>
        <div className="flex gap-2">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border px-3 py-2 rounded w-1/2"
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
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleAddSubCategory}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <ul className="divide-y">
        {categories.map((cat) => (
          <li key={cat._id} className="py-2">
            <div className="flex justify-between items-center">
              {editId === cat._id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border px-2 py-1 rounded w-1/2"
                />
              ) : (
                <span className="font-medium">{cat.name}</span>
              )}
              <div className="flex gap-2">
                {editId === cat._id ? (
                  <button
                    onClick={() => handleUpdate(cat._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(cat._id, cat.name)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Subcategories list */}
            {cat.subcategories && cat.subcategories.length > 0 ? (
              <ul className="pl-5 mt-1 list-disc text-sm text-gray-600">
                {cat.subcategories.map((sub) => (
                  <li key={sub._id}>{sub.name}</li>
                ))}
              </ul>
            ) : (
              <p className="pl-5 mt-1 text-sm text-gray-400 italic">No subcategory yet created</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategory;