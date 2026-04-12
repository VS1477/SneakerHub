const Sneaker = require('../models/Sneaker');

// GET /api/sneakers
const getSneakers = async (req, res) => {
  try {
    const { search, brand, minPrice, maxPrice, size, rating, sort, page = 1, limit = 12 } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (brand) {
      query.brand = { $in: brand.split(',') };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) {
      query.sizes = { $in: size.split(',').map(Number) };
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const total = await Sneaker.countDocuments(query);
    const sneakers = await Sneaker.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      sneakers,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sneakers/featured
const getFeaturedSneakers = async (req, res) => {
  try {
    const sneakers = await Sneaker.find({ featured: true }).limit(8);
    res.json(sneakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sneakers/brands
const getBrands = async (req, res) => {
  try {
    const brands = await Sneaker.distinct('brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sneakers/:id
const getSneakerById = async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id);
    if (!sneaker) {
      return res.status(404).json({ message: 'Sneaker not found' });
    }
    res.json(sneaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sneakers (Admin)
const createSneaker = async (req, res) => {
  try {
    const sneaker = await Sneaker.create(req.body);
    res.status(201).json(sneaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/sneakers/:id (Admin)
const updateSneaker = async (req, res) => {
  try {
    const sneaker = await Sneaker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sneaker) {
      return res.status(404).json({ message: 'Sneaker not found' });
    }
    res.json(sneaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/sneakers/:id (Admin)
const deleteSneaker = async (req, res) => {
  try {
    const sneaker = await Sneaker.findByIdAndDelete(req.params.id);
    if (!sneaker) {
      return res.status(404).json({ message: 'Sneaker not found' });
    }
    res.json({ message: 'Sneaker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sneakers/:id/reviews
const addReview = async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id);
    if (!sneaker) {
      return res.status(404).json({ message: 'Sneaker not found' });
    }

    const alreadyReviewed = sneaker.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Already reviewed this sneaker' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment
    };

    sneaker.reviews.push(review);
    sneaker.numReviews = sneaker.reviews.length;
    sneaker.rating = sneaker.reviews.reduce((acc, r) => acc + r.rating, 0) / sneaker.reviews.length;

    await sneaker.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSneakers, getFeaturedSneakers, getBrands, getSneakerById,
  createSneaker, updateSneaker, deleteSneaker, addReview
};
