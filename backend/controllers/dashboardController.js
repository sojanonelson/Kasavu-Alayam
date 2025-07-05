const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config(); // Make sure this is at the top
const Razorpay = require('razorpay');



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.getDashboardData = async (req, res) => {
  try {
    // Get all data in parallel
    const [
      totalUsers,
      userGenderStats,
      orders,
      lowStockProducts,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments(),
      this.getUserGenderStats(),
      Order.find().sort({ createdAt: -1 }).populate('products.productId userId'),
      this.getLowStockProducts(),
      this.getRecentPayments(),
    ]);

    // Calculate revenue stats
    const revenueStats = this.calculateRevenueStats(orders);

    // Prepare recent orders (already sorted by createdAt descending)
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.orderTrackingId,
      customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest Customer',
      amount: order.totalPrice,
      status: order.orderStatus,
      date: order.createdAt,
      items: order.products.reduce((total, product) => total + product.quantity, 0),
      paymentMethod: order.paymentMode,
      deliveryType: order.deliveryType
    }));

    // Prepare response
    const dashboardData = {
      overview: {
        totalUsers,
        maleUsers: userGenderStats.male,
        femaleUsers: userGenderStats.female,
        totalOrders: orders.length,
        totalRevenue: revenueStats.totalRevenue,
        lowStockProductCount: this.countLowStockProducts(lowStockProducts),
      },
      revenueStats,
      lowStockProducts,
      recentPayments: recentPayments.slice(0, 5),
      recentOrders,
    };

    res.json(dashboardData);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
// Helper methods
exports.calculateRevenueStats = (orders) => {
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

  return result;
};

exports.getLowStockProducts = async (threshold = 5) => {
  const lowStockProducts = await Product.find({
    stockQuantity: { $lte: threshold }
  }).populate('category');

  return lowStockProducts;
};

exports.countLowStockProducts = (lowStockProducts) => {
  return lowStockProducts.length;
};

exports.getRecentPayments = async () => {
  try {
    const payments = await razorpay.payments.all({
      count: 100,
      from: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000), // Last 30 days
      to: Math.floor(Date.now() / 1000)
    });

    return payments.items.map(payment => ({
      id: payment.id,
      amount: payment.amount / 100, // Convert to rupees
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      createdAt: new Date(payment.created_at * 1000),
      orderId: payment.order_id
    }));
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    return [];
  }
};

exports.getUserGenderStats = async () => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert array to object with male/female properties
    const stats = {
      male: 0,
      female: 0
    };

    result.forEach(item => {
      if (item._id === 'male') {
        stats.male = item.count;
      } else if (item._id === 'female') {
        stats.female = item.count;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching user gender stats:', error);
    return {
      male: 0,
      female: 0
    };
  }
};