const Customer = require('../models/Customer');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const customers = await Customer.find(filter)
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Customer.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: customers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { password, email, name, phone } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Customer account created successfully',
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
        phone: customer.phone
      },
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message,
    });
  }
};

// Login customer
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: customer._id, role: customer.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Get customer by ID (with order history and lifetime value)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const orders = await Order.find({ customer: req.params.id })
      .sort('-orderDate')
      .select('orderNumber totalAmount status orderDate');

    const lifetimeValue = orders.reduce((total, order) => {
      if (['shipped', 'delivered'].includes(order.status)) {
        return total + order.totalAmount;
      }
      return total;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        ...customer._doc,
        orderHistory: orders,
        orderCount: orders.length,
        lifetimeValue
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error.message
    });
  }
};

// Update customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message
    });
  }
};
