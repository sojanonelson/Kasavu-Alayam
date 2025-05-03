const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [String], // URLs to image files
  retailPrice: { type: Number, required: true },
  sku: { type: String, unique: true, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  reviewCollectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReviewCollection' // Assuming you're using this for reviews
  },

  specifications: {
    fabrics: String,
    pattern: String,
    occasion: String,
    ornamentation: String,
    border: String,
    blouse: String,
    blouseFabric: String,
    sareeFabric: String,
    washCare: String,
    length: String,
    width: String,
  },

  stockByVariant: [
    {
      color: String,
      size: String,
      quantity: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
