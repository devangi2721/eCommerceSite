const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

const adminDashboardController = (req, res) => {
  res.json({ msg: 'Welcome to the admin dashboard!' });
};

// Dashboard stats for admin
const dashboardStatsController = async (req, res) => {
  try {
    const [users, orders, products, revenueAgg] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      Order.countDocuments(),
      Product.countDocuments({ isDeleted: { $ne: true } }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    res.json({ users, orders, products, revenue });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Recent orders for admin dashboard
const recentOrdersController = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .populate('products.product', 'name price')
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { adminDashboardController, dashboardStatsController, recentOrdersController }; 