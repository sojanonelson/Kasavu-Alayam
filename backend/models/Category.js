const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },  // e.g., "Saree", "Men's Wear"
  types: [{ type: String, required: true }], // Array of types for the category, e.g., ["Silk Saree", "Kanjivaram", etc.]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true } // Admin who created the category
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
