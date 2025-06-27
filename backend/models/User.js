// models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  place: String,
  city: String,
  state: String,
  pincode: String,
  postOffice: String
}, { _id: true }); // default _id helps with editing/deleting

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, sparse: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  dob: Date,
  password: { type: String, required: true },
  addresses: [addressSchema], // 🔥 multiple addresses here
  loginHistory: { type: [Date], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
