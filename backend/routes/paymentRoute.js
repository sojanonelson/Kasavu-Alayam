const express = require('express');
const router = express.Router();
const customerServiceController = require('../controllers/userController');

// ✅ Razorpay All Payments Route
router.get('/razorpay/payments', customerServiceController.getAllPaymentTransactions);
// In your paymentRoutes.js or userRoutes.js
router.get('/razorpay/payments/:paymentId', customerServiceController.getPaymentById);

module.exports = router;
