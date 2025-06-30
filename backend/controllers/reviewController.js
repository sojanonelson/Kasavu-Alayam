const Review = require('../models/Review');

const Order = require('../models/Order');




exports.checkReviewEligibility = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from auth middleware
    const productId = req.params.productId;

    console.log("🧠 userId:", userId);
    console.log("🧠 productId:", productId);

    // ⏱ For testing: allow only after 5 seconds
    const fiveSecondsAgo = new Date(Date.now() - 5 * 1000);

    // ✅ Check if the user has already reviewed the product
    const existingReview = await Review.findOne({
      userId,
      productId,
    });

    if (existingReview) {
      return res.status(200).json({
        success: true,
        eligible: false,
        message: 'You have already reviewed this product.',
      });
    }

    // ✅ Check if user has ordered this product and enough time has passed
    const hasOrdered = await Order.findOne({
      userId,
      'products.productId': productId,
      createdAt: { $lte: fiveSecondsAgo },
    });

    if (!hasOrdered) {
      return res.status(200).json({
        success: true,
        eligible: false,
        message: 'User has not ordered this product or 5 seconds have not passed since the order.',
      });
    }

    // ✅ If both checks pass
    res.status(200).json({
      success: true,
      eligible: true,
      message: 'User is eligible to review this product.',
    });

  } catch (err) {
    console.error("❌ Eligibility check failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, message,userId } = req.body;
    console.log("H")
    

    // // 1. Check if the user has ordered the product at least 1 day ago
    // const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // const order = await Order.findOne({
    //   userId,
    //   'products.productId': productId,
    //   createdAt: { $lte: oneDayAgo }
    // });

    // if (!order) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You can only review this product after 1 day of ordering it."
    //   });
    // }

    // Optional: Prevent duplicate review from same user for same product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You've already reviewed this product." });
    }

    // 2. Create the review
    const review = await Review.create({
      productId,
      userId,
      rating,
      message
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'firstName')
      .populate('productId', 'title');

    const formatted = reviews.map(review => ({
      _id: review._id,
      user: review.userId?.firstName || 'Unknown',
      product: review.productId?.title || 'Unknown',
      rating: review.rating,
      message: review.message,
      createdAt: review.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      reviews: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getReviewsByProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, minRating = 1 } = req.query;
    const productId = req.params.productId;

    const query = {
      productId,
      rating: { $gte: Number(minRating) }
    };

    const reviews = await Review.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName')
      .populate('productId', 'title');

    const totalReviews = await Review.countDocuments(query);

    const formatted = reviews.map(review => ({
      _id: review._id,
      user: review.userId?.firstName || 'Unknown',
      product: review.productId?.title || 'Unknown',
      rating: review.rating,
      message: review.message,
      createdAt: review.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      total: totalReviews,
      page: Number(page),
      limit: Number(limit),
      reviews: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ❌ Delete a review (user/admin only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Check permission
    if (req.user.role !== 'admin' && String(review.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
