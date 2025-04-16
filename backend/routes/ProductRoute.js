const express = require('express');
const { createProduct, getProducts, getProductBySlug } = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);
module.exports = router;