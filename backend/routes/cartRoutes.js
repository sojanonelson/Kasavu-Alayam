const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart); // Add or update item
router.post('/remove', cartController.removeFromCart); // Remove item
router.get('/:userId', cartController.getCartByUser); // Get cart
router.post('/update', cartController.updateCartItemQuantity); 

module.exports = router;
