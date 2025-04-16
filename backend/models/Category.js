const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    categorySlug: { type: String, unique: true }
  });
  
  module.exports = mongoose.model('Category', categorySchema);
  