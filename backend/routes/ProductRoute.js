const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Create Product
router.post('/', upload.array('images', 4), productController.createProduct);
router.post('/test', upload.array('images', 4), productController.TestcreateProduct);

// ✅ Update Product - now handles new image uploads
router.put('/:id', productController.updateProduct);

router.put('/:id/images', upload.array('images',4), productController.updateProductImages);


// Delete Product
router.delete('/:id', productController.deleteProduct);

// Get All Products
router.get('/', productController.getAllProducts);

// Search by Name
router.get('/search', productController.getProductByName);

// Get by ID
router.get('/:id', productController.getProductById);

module.exports = router;
