const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
});


module.exports = mongoose.model('Collection', collectionSchema);
