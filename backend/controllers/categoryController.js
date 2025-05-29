const Category = require('../models/Category');  // Import the Category model
const Admin = require('../models/Customer');  // Import the Admin model (for validation)

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { title, types, createdBy } = req.body;

    // Check if the Admin exists
    const adminExists = await Admin.findById(createdBy);
    if (!adminExists) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    // Create a new category
    const newCategory = new Category({
      title,
      types,
      createdBy
    });

    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while creating category' });
  }
};

// Update an existing category by ID
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updates = req.body;

    // Find and update the category by its ID
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updates, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while updating category' });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find and delete the category by its ID
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while deleting category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find().populate('createdBy');  // Populate createdBy (admin) details

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// Get a category by its ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by its ID
    const category = await Category.findById(categoryId).populate('createdBy');  // Populate createdBy (admin)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching category' });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById
};
