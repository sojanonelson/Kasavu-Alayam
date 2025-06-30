const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  deleteReview,
  checkReviewEligibility
} = require('../controllers/reviewController');

// 🛡 Add your auth middleware
const { protect, isAdmin } = require('../middleware/auth');

// Create a review
router.post('/', createReview);

// Get all reviews (admin)
router.get('/all', getAllReviews);

// Get reviews of a product
router.get('/product/:productId', getReviewsByProduct);

// Delete a review (admin or owner)
router.delete('/:reviewId', protect, deleteReview);

router.get('/eligible/:productId', protect, checkReviewEligibility);

module.exports = router;
