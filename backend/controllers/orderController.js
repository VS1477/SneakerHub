const Order = require('../models/Order');
const Cart = require('../models/Cart');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, shippingAddress, paymentId } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice,
      shippingAddress,
      paymentId,
      paymentStatus: paymentId ? 'completed' : 'pending'
    });

    // Clear user's cart after order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('products.sneaker');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/admin (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('products.sneaker');
    
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({ orders, totalRevenue, totalOrders: orders.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/analytics (Admin)
const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'completed' });
    
    // Monthly revenue for last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthOrders = orders.filter(o => o.createdAt >= date && o.createdAt <= endDate);
      months.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        orders: monthOrders.length
      });
    }

    // Order status breakdown
    const allOrders = await Order.find({});
    const statusBreakdown = {
      processing: allOrders.filter(o => o.orderStatus === 'processing').length,
      shipped: allOrders.filter(o => o.orderStatus === 'shipped').length,
      delivered: allOrders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: allOrders.filter(o => o.orderStatus === 'cancelled').length
    };

    res.json({
      monthlyData: months,
      statusBreakdown,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
      totalOrders: allOrders.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getAnalytics };
