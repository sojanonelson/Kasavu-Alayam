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
  address: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
