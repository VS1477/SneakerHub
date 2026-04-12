import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/sneakers/featured');
        setFeatured(data);
      } catch {
        console.error('Failed to fetch featured sneakers');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const brands = [
    { name: 'Nike', emoji: '✓' },
    { name: 'Adidas', emoji: '⊿' },
    { name: 'Jordan', emoji: '🏀' },
    { name: 'New Balance', emoji: 'NB' },
    { name: 'Puma', emoji: '🐆' },
    { name: 'Converse', emoji: '★' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">NEW ARRIVALS 2024</div>
          <h1>Step Into <span className="gradient-text">Greatness</span></h1>
          <p>Discover the latest drops, iconic classics, and limited editions. Your next pair awaits.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/shop?featured=true" className="btn btn-outline btn-lg">
              View Drops
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>500+</strong>
              <span>Sneakers</span>
            </div>
            <div className="stat">
              <strong>50+</strong>
              <span>Brands</span>
            </div>
            <div className="stat">
              <strong>10K+</strong>
              <span>Customers</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-shoe-card">
            <img
              src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600"
              alt="Featured Sneaker"
            />
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <div className="section-header">
          <h2>Shop by Brand</h2>
          <p>Your favorite brands, all in one place</p>
        </div>
        <div className="brands-grid">
          {brands.map(brand => (
            <Link key={brand.name} to={`/shop?brand=${brand.name}`} className="brand-card">
              <span className="brand-emoji">{brand.emoji}</span>
              <span className="brand-name">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Sneakers</h2>
          <Link to="/shop" className="see-all">
            See All <FiArrowRight />
          </Link>
        </div>
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="products-grid">
            {featured.slice(0, 8).map(sneaker => (
              <ProductCard key={sneaker._id} sneaker={sneaker} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <FiTruck className="feature-icon" />
          <h3>Free Shipping</h3>
          <p>On orders over $100</p>
        </div>
        <div className="feature-card">
          <FiShield className="feature-icon" />
          <h3>Authenticity Guaranteed</h3>
          <p>100% verified products</p>
        </div>
        <div className="feature-card">
          <FiRefreshCw className="feature-icon" />
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Join the SneakerHub Community</h2>
          <p>Get early access to limited drops, exclusive discounts, and more.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Sign Up Free <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
