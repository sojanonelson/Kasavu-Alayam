const Order = require('../models/Order');
const Product = require('../models/Product'); // 🧠 Don't forget to import this
const Cart = require('../models/Cart');


const { v4: uuidv4 } = require('uuid');

// Utility for generating unique orderTrackingId
const generateTrackingId = () => `ORD-${uuidv4().split('-')[0].toUpperCase()}`;

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, deliveryType, paymentMode, transactionId, address } = req.body;
    console.log(transactionId)
    console.log(address)
    console.log(products)

    if (!products || products.length === 0)
      return res.status(400).json({ message: 'No products provided' });

    // 🧮 Total Price Calculation
    let productTotal = products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    let deliveryCharge = 0;

    if (deliveryType === 'online_delivery') {
      deliveryCharge = 35 * products.reduce((acc, item) => acc + item.quantity, 0);
    }

    const totalPrice = productTotal + deliveryCharge;

    // 🧾 Create Order Document
    const newOrder = new Order({
      userId,
      products,
      deliveryType,
      paymentMode,
      transactionId,
      totalPrice,
      address: deliveryType === 'online_delivery' ? address : undefined,
      orderTrackingId: generateTrackingId(),
    });

    const saved = await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    // 🪓 Reduce stock for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Product "${product.title}" is out of stock or not enough quantity`,
        });
      }

      product.stockQuantity -= item.quantity;
      await product.save();
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId userId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get user orders
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};

// Get order by ID (tracking ID)
exports.getOrderByTrackingId = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const order = await Order.findOne({ orderTrackingId: trackingId }).populate('products.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};


// Update packed status
exports.updatePackedStatus = async (req, res) => {
  console.log("packedStatus")
  try {
    const { orderId } = req.params;
    const { packed } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { packed },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating packed status' });
  }
};

exports.getPackedOrders = async (req, res) => {
  console.log("Packed")
  try {
    const orders = await Order.find({ packed: true }).populate('products.productId userId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packed orders' });
  }
};

exports.getUnpackedOrders = async (req, res) => {
  console.log("Unpacked")
  try {
    const orders = await Order.find({ packed: { $ne: true } }).populate('products.productId userId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching unpacked orders' });
  }
};


// Get revenue statistics
exports.getRevenueData = async (req, res) => {
  try {
    // Get all orders
    const orders = await Order.find();
    
    // Calculate totals
    const result = {
      totalRevenue: 0,
      totalOrders: orders.length,
      paymentMethods: {
        cash: { count: 0, amount: 0 },
        upi: { count: 0, amount: 0 }
      },
      deliveryTypes: {
        shop_pickup: { count: 0, amount: 0 },
        online_delivery: { count: 0, amount: 0 }
      },
      combinedStats: {
        shop_pickup_cash: { count: 0, amount: 0 },
        shop_pickup_upi: { count: 0, amount: 0 },
        online_delivery_upi: { count: 0, amount: 0 }
      }
    };

    // Process each order
    orders.forEach(order => {
      result.totalRevenue += order.totalPrice;
      
      // Payment method stats
      result.paymentMethods[order.paymentMode].count++;
      result.paymentMethods[order.paymentMode].amount += order.totalPrice;
      
      // Delivery type stats
      result.deliveryTypes[order.deliveryType].count++;
      result.deliveryTypes[order.deliveryType].amount += order.totalPrice;
      
      // Combined stats
      if (order.deliveryType === 'shop_pickup') {
        const key = `shop_pickup_${order.paymentMode}`;
        result.combinedStats[key].count++;
        result.combinedStats[key].amount += order.totalPrice;
      } else if (order.deliveryType === 'online_delivery') {
        result.combinedStats.online_delivery_upi.count++;
        result.combinedStats.online_delivery_upi.amount += order.totalPrice;
      }
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching revenue data:', err);
    res.status(500).json({ message: 'Error fetching revenue data' });
  }
};
