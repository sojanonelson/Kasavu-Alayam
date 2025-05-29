const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      size: { type: String },
      color: { type: String },
      quantity: { type: Number },
      productQuality: { type: String }
    }
  ],
  orderAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  contactNumber: { type: String },
  orderStatus: { type: String, enum: ['confirmed', 'declined'], default: 'confirmed' },
  deliveryStatus: { type: String, enum: ['delivered', 'pending'], default: 'pending' },
  paymentType: { type: String, enum: ['upi/cards', 'cod'], required: true },
  transactionId: { type: String },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
