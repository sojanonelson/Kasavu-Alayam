const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');  // Import the controller functions

// Route to create a new product
router.post('/products', productController.createProduct);

// Route to update an existing product by ID
router.put('/products/:id', productController.updateProduct);

// Route to delete a product by ID
router.delete('/products/:id', productController.deleteProduct);

// Route to get all products
router.get('/products', productController.getAllProducts);

// Route to get a product by its ID
router.get('/products/:id', productController.getProductById);

// Route to search products by name
router.get('/products/search', productController.getProductByName);

module.exports = router;
