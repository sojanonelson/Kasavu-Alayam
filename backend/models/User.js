const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  dob: Date,
  address: {
    place: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  password: {
    type: String,
    required: true
  },
  loginHistory: {
    type: [Date], // Array of login timestamps
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
