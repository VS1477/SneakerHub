import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';

export default function ProductCard({ sneaker, onWishlist }) {
  return (
    <div className="product-card">
      <Link to={`/product/${sneaker._id}`} className="product-card-link">
        <div className="product-card-image">
          <img
            src={sneaker.images?.[0] || 'https://via.placeholder.com/400x400?text=Sneaker'}
            alt={sneaker.name}
            loading="lazy"
          />
          <div className="product-card-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>
      </Link>
      {onWishlist && (
        <button className="wishlist-btn" onClick={() => onWishlist(sneaker._id)} aria-label="Add to wishlist">
          <FiHeart />
        </button>
      )}
      <div className="product-card-info">
        <span className="product-brand">{sneaker.brand}</span>
        <h3 className="product-name">{sneaker.name}</h3>
        <div className="product-card-bottom">
          <span className="product-price">${sneaker.price}</span>
          <div className="product-rating">
            <FiStar className="star-icon" />
            <span>{sneaker.rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
