const Product = require('../models/Product'); // Import Product model
const Category = require('../models/Category'); // Import Category model (if needed for validation)
const SubCategory = require('../models/Subcategory');

const createProduct = async (req, res) => {
  try {
    const { title, description, stockQuantity, color, productDetails,subcategory, category, review, imageUrls } = req.body;

    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }
    const subcategoryExists = await SubCategory.findById(subcategory);
    if (!subcategoryExists) {
      return res.status(400).json({ message: 'SubCategory not found' });
    }

    // Create a new product
    const newProduct = new Product({
      title,
      description,
      stockQuantity,
      color,
      productDetails,
      category,
      subcategory,
      review,
      imageUrls
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while creating product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    // Find the product by its ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by its ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while deleting product' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Get all products
    const products = await Product.find().populate('category').populate('review');

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Get product by its ID
    const product = await Product.findById(productId).populate('category').populate('review');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching product' });
  }
};

const getProductByName = async (req, res) => {
  try {
    const { name } = req.query; // Search query by product name

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Get products by name (case-insensitive search)
    const products = await Product.find({ title: new RegExp(name, 'i') }).populate('category').populate('review');

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found with that name' });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while searching for products' });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductByName
};
