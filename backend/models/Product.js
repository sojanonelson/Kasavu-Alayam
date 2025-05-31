const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  color: { type: String, required: true },

  productDetails: {
    type: { type: String },
    fabric: { type: String },
    idealFor: { type: String },
    size: { type: String },
    netQuantity: { type: String }
  },

    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  
  // Array of image URLs for product images
  imageUrls: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);