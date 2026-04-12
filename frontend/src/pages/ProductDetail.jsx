import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SneakerViewer3D from '../components/SneakerViewer3D';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import { FiStar, FiHeart, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('images');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSneaker = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/sneakers/${id}`);
      setSneaker(data);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (user) {
        api.post('/auth/recently-viewed', { sneakerId: id }).catch(() => {});
      }
    } catch {
      toast.error('Failed to load sneaker');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchSneaker();
  }, [fetchSneaker]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(sneaker._id, selectedSize, quantity, sneaker);
    toast.success(`${sneaker.name} added to cart!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/sneakers/${id}/reviews`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/sneakers/${id}`);
      setSneaker(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="page-container"><SkeletonLoader type="detail" /></div>;
  if (!sneaker) return <div className="page-container"><h2>Sneaker not found</h2></div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Image / 3D Section */}
        <div className="product-media">
          <div className="media-tabs">
            <button className={activeTab === 'images' ? 'active' : ''} onClick={() => setActiveTab('images')}>
              Photos
            </button>
            <button className={activeTab === '3d' ? 'active' : ''} onClick={() => setActiveTab('3d')}>
              3D View
            </button>
          </div>

          {activeTab === 'images' ? (
            <div className="image-gallery">
              <div className="main-image">
                <img src={sneaker.images?.[activeImage] || 'https://via.placeholder.com/600'} alt={sneaker.name} />
              </div>
              <div className="image-thumbnails">
                {sneaker.images?.map((img, i) => (
                  <button
                    key={i}
                    className={`thumbnail ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${sneaker.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <SneakerViewer3D />
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="product-brand-label">{sneaker.brand}</span>
          <h1>{sneaker.name}</h1>

          <div className="product-rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <FiStar key={star} className={star <= Math.round(sneaker.rating) ? 'star-filled' : ''} />
              ))}
            </div>
            <span>{sneaker.rating?.toFixed(1)} ({sneaker.numReviews} reviews)</span>
          </div>

          <div className="product-price-tag">${sneaker.price}</div>

          <p className="product-description">{sneaker.description}</p>

          {/* Size Selection */}
          <div className="size-selection">
            <h3>Select Size</h3>
            <div className="size-options">
              {sneaker.sizes?.map(size => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  US {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}><FiPlus /></button>
            </div>
          </div>

          {/* Actions */}
          <div className="product-actions">
            <button className="btn btn-primary btn-lg add-to-cart-btn" onClick={handleAddToCart}>
              <FiShoppingCart /> Add to Cart
            </button>
            {user && (
              <button className="btn btn-outline wishlist-action-btn" onClick={() => toggleWishlist(sneaker._id)}>
                <FiHeart /> Wishlist
              </button>
            )}
          </div>

          <div className="product-meta">
            <span className={`stock-status ${sneaker.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {sneaker.stock > 0 ? `✓ In Stock (${sneaker.stock} left)` : '✗ Out of Stock'}
            </span>
            <span className="product-category">Category: {sneaker.category}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {user && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Write a Review</h3>
            <div className="review-rating-input">
              <label>Rating:</label>
              <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <textarea
              placeholder="Share your thoughts..."
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="reviews-list">
          {sneaker.reviews?.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            sneaker.reviews?.map((rev, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <strong>{rev.name}</strong>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} className={s <= rev.rating ? 'star-filled' : ''} />
                    ))}
                  </div>
                </div>
                <p>{rev.comment}</p>
                <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
