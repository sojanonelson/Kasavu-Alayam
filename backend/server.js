const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const orderRoutes = require('./routes/OrderRoute');
const productRoutes = require('./routes/ProductRoute');
const userRoutes = require('./routes/UserRoute');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const categoryRoutes =require('./routes/CategoryRoute')
const websettingRoutes =require('./routes/websiteSettingRoutes')
const collectionRoutes =require('./routes/CollectionRoute')
const otpRoutes = require('./routes/otpRoute')
const cartRoutes = require('./routes/cartRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const paymentRoute = require('./routes/paymentRoute')
const cookieParser = require('cookie-parser');

const connectDB = require('./config/DB');

// Load environment variables
dotenv.config(); // Only one call is needed

const app = express();
const PORT = process.env.PORT || 5000;
console.log("PORT:", process.env.PORT)
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'public/uploads/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const corsOptions = {
  origin: ['http://localhost:3000', 'https://kasavualayam.vercel.app','http://192.168.82.114:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
connectDB();


// Routes
app.use('/api/collections', collectionRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/websetting', websettingRoutes);
app.use('/api/otp',otpRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/product/reviews', reviewRoutes)
app.use('/api/payment', paymentRoute)




app.use('/api/subcategories', subcategoryRoutes);

app.get('/', (req, res) => {
  res.send('✅ Server running');
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
