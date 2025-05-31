const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');  // Import the controller functions
const parser = require('../config/multer');

// Route to create a new product
// router.post('/', productController.createProduct);
router.post('/', parser.array('images', 4), productController.createProduct);

// Route to update an existing product by ID
router.put('/:id', productController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', productController.deleteProduct);

// Route to get all products
router.get('/', productController.getAllProducts);

// Route to get a product by its ID
router.get('/:id', productController.getProductById);

// Route to search products by name
router.get('/search', productController.getProductByName);

module.exports = router;
