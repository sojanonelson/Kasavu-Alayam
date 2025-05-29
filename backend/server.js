const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const orderRoutes = require('./routes/OrderRoute');
const productRoutes = require('./routes/ProductRoute');
const customerRoutes = require('./routes/CustomerRoute');
const categoryRoutes =require('./routes/CategoryRoute')
const connectDB = require('./config/DB');

// Load environment variables
dotenv.config(); // Only one call is needed

const app = express();
const PORT = process.env.PORT || 5000;
console.log("PORT:", process.env.PORT)

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api', productRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
