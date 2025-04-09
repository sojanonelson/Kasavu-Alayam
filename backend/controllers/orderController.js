const Order = require('../models/Order');
const Product = require('../models/Product');

// Generate a unique order number
const generateOrderNumber = async () => {
  const date = new Date();
  const prefix = 'TX' + date.getFullYear().toString().substr(-2) +
                (date.getMonth() + 1).toString().padStart(2, '0');

  // Find the highest order number with this prefix
  const lastOrder = await Order.findOne(
    { orderNumber: new RegExp('^' + prefix) },
    {},
    { sort: { 'orderNumber': -1 } }
  );

  let sequence = '0001';
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.substr(-4));
    sequence = (lastSequence + 1).toString().padStart(4, '0');
  }

  return prefix + sequence;
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, shippingAddress, notes } = req.body;

    // Calculate total amount and update product stock
    let totalAmount = 0;
    for (const item of items) {
      // Get product details
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
        });
      }

      // Update stock
      product.stock -= item.quantity;
      await product.save();

      // Calculate item price
      item.unitPrice = product.pricePerUnit;
      totalAmount += item.unitPrice * item.quantity;
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create new order
    const newOrder = new Order({
      orderNumber,
      customer,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      notes
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get all orders with pagination and filtering
exports.getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      customer,
      fromDate,
      toDate,
      sort = '-createdAt'  // Default sort by newest
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;

    // Date range filter
    if (fromDate || toDate) {
      filter.orderDate = {};
      if (fromDate) filter.orderDate.$gte = new Date(fromDate);
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setDate(endDate.getDate() + 1);  // Include the end date
        filter.orderDate.$lte = endDate;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get orders
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customer', 'name email')
      .populate('items.product', 'name fabricType');

    // Count total orders for pagination
    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name description fabricType');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, deliveryDate, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update fields if provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryDate) order.deliveryDate = deliveryDate;
    if (notes) order.notes = notes;

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in '${order.status}' status`
      });
    }

    // Return items to inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Generate order report
exports.getOrdersReport = async (req, res) => {
  try {
    const { fromDate, toDate, groupBy = 'day' } = req.query;

    // Set date range
    const filter = {};
    if (fromDate || toDate) {
      filter.orderDate = {};
      if (fromDate) filter.orderDate.$gte = new Date(fromDate);
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.orderDate.$lte = endDate;
      }
    }

    // Group by date format
    let dateFormat;
    if (groupBy === 'month') {
      dateFormat = { $dateToString: { format: '%Y-%m', date: '$orderDate' } };
    } else if (groupBy === 'year') {
      dateFormat = { $dateToString: { format: '%Y', date: '$orderDate' } };
    } else {
      // Default to day
      dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } };
    }

    const report = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            date: dateFormat,
            status: '$status'
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          statusBreakdown: {
            $push: {
              status: '$_id.status',
              count: '$count',
              totalAmount: '$totalAmount'
            }
          },
          totalOrders: { $sum: '$count' },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Order report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};
