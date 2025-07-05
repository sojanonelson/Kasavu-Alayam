const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create Order
router.get("/:trackingId", orderController.getOrderByTrackingId);
router.post("/create", orderController.createOrder);
router.get("/packed", orderController.getPackedOrders);
router.get("/unpacked", orderController.getUnpackedOrders);

// Get all orders (admin use)
router.get("/all", orderController.getAllOrders);

// Get orders of a specific user
router.get("/user/:userId", orderController.getOrdersByUser);


router.patch("/:orderId/packed", orderController.updatePackedStatus);

router.get("/revenue", orderController.getRevenueData);



module.exports = router;
