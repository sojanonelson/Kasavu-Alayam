const Product = require("../models/Product"); 
const Category = require("../models/Category");
const SubCategory = require("../models/Subcategory");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const generateSKU = require("../utils/generateSKU");
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      stockQuantity,
      color,
      sku,
      productDetails,
      subcategory,
      price,
      specialPrice,
      category,
      review,
      collection,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader
        .upload(file.path, {
          folder: "products",
          use_filename: true,
          quality: "100",
          unique_filename: false,
        })
        .then((result) => {
          fs.unlinkSync(file.path);
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        });
    });
    const imageData = await Promise.all(uploadPromises);

    console.log("Uploaded Image URLs:");
    imageData.forEach((img, index) => {
      console.log(`Image ${index + 1}: ${img.url}`);
    });

    console.log("Color:", color);
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }
    const subcategoryExists = await SubCategory.findById(subcategory);
    if (!subcategoryExists) {
      return res.status(400).json({ message: "SubCategory not found" });
    }
    const newProduct = new Product({
      title,
      description,
      stockQuantity,
      color,
      productDetails,
      category,
      price,
      specialPrice,
      subcategory,
      collection,
      review,
      images: imageData,
      sku:
        req.body.sku ||
        generateSKU({ title: req.body.title, category: categoryExists.name }),
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(500).json({
      message: "Server error while creating product",
      error: error.message,
    });
  }
};

const TestcreateProduct = async (req, res) => {
  try {
    console.log("Product image test");

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader
        .upload(file.path, {
          folder: "products", 
          use_filename: true,
          quality: "100",
          unique_filename: false,
        })
        .then((result) => {
          fs.unlinkSync(file.path);
          return result;
        });
    });
    const results = await Promise.all(uploadPromises);
    const imageData = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    console.log("Uploaded Image URLs:");
    imageData.forEach((img, index) => {
      console.log(`Image ${index + 1}: ${img.url}`);
    });

    return res.status(201).json({
      message: "Created",
      images: imageData,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(500).json({
      error: error.message || "Image upload failed",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      stockQuantity,
      price,
      specialPrice,
      color,
      productDetails,
      category,
      subcategory,
      collection, 
    } = req.body;

    const updates = {
      title,
      description,
      stockQuantity,
      price,
      specialPrice,
      color,
      productDetails,
      category,
      subcategory,
      collection, // ✅
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating product" });
  }
};

const getProductsByIdeal = async (req, res) => {
  try {
    const { idealFor } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      category,
      subcategory,
      color,
      search,
    } = req.query;
    const filter = {
      "productDetails.idealFor": { $regex: idealFor, $options: "i" },
    };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minStock || maxStock) {
      filter.stockQuantity = {};
      if (minStock) filter.stockQuantity.$gte = parseInt(minStock);
      if (maxStock) filter.stockQuantity.$lte = parseInt(maxStock);
    }

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const stats = await Product.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stockQuantity" },
          averagePrice: { $avg: { $toDouble: "$price" } },
          minPrice: { $min: { $toDouble: "$price" } },
          maxPrice: { $max: { $toDouble: "$price" } },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ["$stockQuantity", 10] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: `Products for ${idealFor} retrieved successfully`,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit),
        },
        stats: stats[0] || {
          totalProducts: 0,
          totalStock: 0,
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0,
          lowStockCount: 0,
        },
        filters: {
          idealFor,
          appliedFilters: {
            priceRange:
              minPrice || maxPrice ? { min: minPrice, max: maxPrice } : null,
            stockRange:
              minStock || maxStock ? { min: minStock, max: maxStock } : null,
            category,
            subcategory,
            color,
            search,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products by ideal:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const updateProductImages = async (req, res) => {
  try {
    console.log("Image Uploadddd:", req.body);
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { removeExistingImages } = req.body;

    let shouldRemoveExisting = false;
    if (typeof removeExistingImages === "string") {
      try {
        const parsed = JSON.parse(removeExistingImages);
        if (typeof parsed === "boolean") {
          shouldRemoveExisting = parsed;
        } else if (Array.isArray(parsed)) {
          for (const publicId of parsed) {
            await cloudinary.uploader.destroy(publicId);
            product.images = product.images.filter(
              (img) => img.public_id !== publicId
            );
          }
        }
      } catch (err) {
        shouldRemoveExisting = removeExistingImages === "true";
      }
    }
    let newImageData = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader
          .upload(file.path, {
            folder: "products",
            use_filename: true,
            quality: "100",
            unique_filename: false,
          })
          .then((result) => {
            fs.unlinkSync(file.path);
            return {
              url: result.secure_url,
              public_id: result.public_id,
            };
          });
      });

      newImageData = await Promise.all(uploadPromises);
    }
    if (removeExistingImages === "true") {
      product.images = newImageData;
    } else {
      product.images = [...product.images, ...newImageData];
    }

    await product.save();

    return res.status(200).json({
      message: "Product images updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating images:", error);
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(500).json({
      message: "Server error while updating product images",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while deleting product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("subcategory");

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId)
      .populate("category")
      .populate("subcategory");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while fetching product" });
  }
};

const getProductByName = async (req, res) => {
  try {
    const { name } = req.query; 

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const products = await Product.find({ title: new RegExp(name, "i") })
      .populate("category")
      .populate("review");

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found with that name" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while searching for products" });
  }
};

const getProductsByCollection = async (req, res) => {
  console.log("API called")
  try {
   
    const { collection } = req.body;
    const validCollections = ["mens", "womens", "kids"];
    if (!collection || !validCollections.includes(collection)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid or missing collection. Valid values: mens, womens, kids",
        });
    }
    const products = await Product.find({ collection })
      .populate("category", "name")
      .populate("subcategory", "name")
      .lean();

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found for collection: ${collection}` });
    }

    return res.status(200).json({
      success: true,
      message: `Products for collection '${collection}' retrieved successfully`,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching collection products",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  updateProductImages,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByIdeal,
  TestcreateProduct,
  getProductsByCollection,
};
