const Customer = require('../models/customerModel');
const Order = require('../models/orderModel');

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const {
      search,
      customerType,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = {};
    if (customerType) filter.customerType = customerType;

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get customers
    const customers = await Customer.find(filter)
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    // Count total
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

// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
};

// Get customer by ID with order history
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer's orders
    const orders = await Order.find({ customer: req.params.id })
      .sort('-orderDate')
      .select('orderNumber totalAmount status orderDate');

    // Calculate lifetime value
    const lifetimeValue = orders.reduce((total, order) => {
      // Only count completed orders
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

// Update customer
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
