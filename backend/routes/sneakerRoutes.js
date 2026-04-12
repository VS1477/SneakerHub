const express = require('express');
const router = express.Router();
const {
  getSneakers, getFeaturedSneakers, getBrands, getSneakerById,
  createSneaker, updateSneaker, deleteSneaker, addReview
} = require('../controllers/sneakerController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getSneakers);
router.get('/featured', getFeaturedSneakers);
router.get('/brands', getBrands);
router.get('/:id', getSneakerById);
router.post('/', protect, admin, createSneaker);
router.put('/:id', protect, admin, updateSneaker);
router.delete('/:id', protect, admin, deleteSneaker);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
