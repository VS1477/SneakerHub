const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const sneakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sneaker name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  sizes: [{
    type: Number,
    required: true
  }],
  images: [{
    type: String
  }],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    default: 'Lifestyle'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

sneakerSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Sneaker', sneakerSchema);
