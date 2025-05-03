const Category = require('../models/Category');

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({ name, slug });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create category", error: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch categories", error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete category", error: err.message });
  }
};
