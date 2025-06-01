const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const category = await Category.create({ name });
  res.status(201).json(category);
};

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // Fetch all subcategories and group them by category
    const subcategories = await Subcategory.find();

    // Combine them manually
    const enriched = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      subcategories: subcategories
        .filter(sub => sub.category.toString() === cat._id.toString())
        .map(sub => ({
          _id: sub._id,
          name: sub.name
        }))
    }));

    res.json(enriched);
  } catch (error) {
    console.error("Failed to fetch categories with subcategories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};