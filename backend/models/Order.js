const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    sneaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Sneaker', required: true },
    name: String,
    image: String,
    size: Number,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
