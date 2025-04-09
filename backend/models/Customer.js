const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  customerType: {
    type: String,
    enum: ['retail', 'wholesale', 'corporate'],
    default: 'retail'
  },
  discount: {
    type: Number,
    default: 0
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
