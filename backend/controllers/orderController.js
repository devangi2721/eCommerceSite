const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Get all orders with user and product details
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name')
      .populate('products.product', 'name price category image');
    console.log(orders,"orders from getOrders");
    res.json(orders);
  } catch (err) {
    console.log(err,"error from getOrders");
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized: No user found in token' });
    }
    const { products, total } = req.body;
    if (!Array.isArray(products) || products.length === 0 || typeof total !== 'number') {
      return res.status(400).json({ msg: 'Invalid products or total' });
    }
    // Optionally, validate product IDs and details here
    const order = new Order({
      user: userId,
      products,
      total,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get order history for a user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized: No user found in token' });
    }
    const orders = await Order.find({ user: userId })
      .populate('products.product', 'name price category image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel an order by user
const cancelOrderByUser = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized: No user found in token' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to cancel this order' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getOrders,
  cancelOrder,
  placeOrder,
  getUserOrders,
  cancelOrderByUser
}; 