const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categorySlug: String,
  price: Number,
  specialPrice:Number,
  description: String,
  stock: Number,
  images: [String],
});

module.exports = mongoose.model('Product', productSchema);