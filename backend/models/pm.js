const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  fabricType: {
    type: String,
    required: true
  },
  availableColors: [String],
  pricePerUnit: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['meter', 'yard', 'piece'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
