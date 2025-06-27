const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const addressSchema = new Schema({
  place: String,
  city: String,
  state: String,
  postOffice: String,
  pincode: String,
});

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [productSchema],
  deliveryType: { type: String, enum: ['shop_pickup', 'online_delivery'], required: true },
  address: { type: addressSchema, required: function() { return this.deliveryType === 'online_delivery'; } },
  paymentMode: { type: String, enum: ['cash', 'upi'], required: true },
  transactionId: { type: String },
  totalPrice: { type: Number, required: true },
  orderStatus: { type: String, enum: ['confirmed'], default: 'confirmed' },
  orderTrackingId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
