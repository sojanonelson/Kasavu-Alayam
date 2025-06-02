const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({

  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },

}, { timestamps: true });

module.exports = mongoose.model('Banner', CustomerSchema);
