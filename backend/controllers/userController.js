const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config(); // Make sure this is at the top
const Razorpay = require('razorpay');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const register = async (req, res) => {
  try {
    const { phone, firstName, lastName, email, gender, dob, password } = req.body;

    if (!phone || !gender || !password) {
      return res.status(400).json({ message: "Phone, gender, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      phone,
      firstName,
      lastName,
      email,
      gender,
      dob,
      
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const now = new Date();
    user.loginHistory = [now, ...user.loginHistory].slice(0, 2);
    await user.save();

    const accessToken = generateAccessToken(user);

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
        loginHistory: user.loginHistory
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;
  // console.log("Token:",token)
  if (!token) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    
    // Additional verification
    if (!decoded.id || !decoded.role) {
      throw new Error('Invalid token payload');
    }

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.clearCookie('refreshToken');
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.json({ message: "Logged out successfully" });
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(address);
    await user.save();
    res.json({ message: "Address added", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    res.json({ message: "Address deleted", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId, addressId, updatedAddress } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.set(updatedAddress); // update fields
    await user.save();
    res.json({ message: "Address updated", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllPaymentTransactions = async (req, res) => {
  try {
    const payments = await razorpay.payments.all({
      count: 100, // Max per call, pagination possible
      // Optional filters:
      // from: Math.floor(new Date('2024-01-01').getTime() / 1000),
      // to: Math.floor(Date.now() / 1000)
    });

    res.status(200).json({
      message: 'Razorpay payment transactions fetched successfully',
      total: payments.count,
      data: payments.items,
    });
  } catch (error) {
    console.error('🔥 Error fetching Razorpay payments:', error);
    res.status(500).json({ message: 'Failed to fetch payment transactions' });
  }
};


// In your userController.js
const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const payment = await razorpay.payments.fetch(paymentId);
    
    res.status(200).json({
      message: 'Payment details fetched successfully',
      data: payment
    });
  } catch (error) {
    console.error('🔥 Error fetching payment details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch payment details',
      error: error.error ? error.error.description : error.message
    });
  }
};





module.exports = {
  getAddresses,
  getAllPaymentTransactions,
  getPaymentById,
  updateAddress,
  deleteAddress,
  addAddress,
  register,
  loginUser,
  deleteAccount,
  updateAccount,
  getAccountById,
  getAllAccounts,
  refreshAccessToken,
  setRefreshTokenCookie,
  logout
};
