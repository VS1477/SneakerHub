const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getAnalytics } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/admin', protect, admin, getAllOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
