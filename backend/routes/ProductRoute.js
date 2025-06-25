const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const { isAdmin, protect } = require('../middleware/auth');

// Create Product
router.post('/',protect, upload.array('images', 4), productController.createProduct);

// Update Product
router.put('/:id',protect, isAdmin,  productController.updateProduct);
router.put('/:id/images',protect, isAdmin,  upload.array('images', 4), productController.updateProductImages);

// Delete Product
router.delete('/:id',protect, isAdmin,  productController.deleteProduct);

// Get Products by Collection (specific route must come before dynamic `:id`)
router.get('/collection/:collection', productController.getProductsByCollection);

// Get Products by Ideal For
router.get('/ideal/:idealFor', productController.getProductsByIdeal);

// Search by Name
router.get('/search', productController.getProductByName);

// Get All Products
router.get('/', productController.getAllProducts);

// Get Product by ID (keep at the bottom to prevent route conflicts)
router.get('/:id', productController.getProductById);

module.exports = router;
