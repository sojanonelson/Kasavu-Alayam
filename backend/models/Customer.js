const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  pincode: { type: String, required: true },
  place: { type: String, required: true },
  landmark: { type: String },
  address: { type: String, required: true },
  houseName: { type: String },
  phoneNumber: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  addressType: { 
    type: String, 
    enum: ['home', 'office'], 
    required: true 
  }
});

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false // password should not be included in the output
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
  addresses: [AddressSchema]
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
