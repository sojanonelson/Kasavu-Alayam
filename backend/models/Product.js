const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: String, required: true },
  specialPrice: { type: String, required: true },

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

  sku: {
    type: String,
    required: true,
    unique: true,
  },

  collection: {
    type: String,
    enum: ['womens', 'kids', 'mens'],
    required: true,
  },

  review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

  images: [
    {
      url: String,
      public_id: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
