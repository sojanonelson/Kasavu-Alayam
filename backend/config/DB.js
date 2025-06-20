// Import mongoose
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config(); 
const MONGODB_URI = process.env.MONGODB_URI ;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
