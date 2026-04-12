const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, toggleWishlist, addRecentlyViewed } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/wishlist', protect, toggleWishlist);
router.post('/recently-viewed', protect, addRecentlyViewed);

module.exports = router;
