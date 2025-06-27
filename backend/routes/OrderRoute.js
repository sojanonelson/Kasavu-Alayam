const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create Order
router.post('/create', orderController.createOrder);

// Get all orders (admin use)
router.get('/all', orderController.getAllOrders);

// Get orders of a specific user
router.get('/user/:userId', orderController.getOrdersByUser);

// Get order by tracking ID
router.get('/:trackingId', orderController.getOrderByTrackingId);

module.exports = router;
