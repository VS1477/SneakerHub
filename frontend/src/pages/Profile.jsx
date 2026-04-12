import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiUser, FiPackage, FiHeart, FiClock } from 'react-icons/fi';

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/user');
        setOrders(data);
      } catch {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <FiUser />
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          <FiPackage /> Orders
        </button>
        <button className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveTab('wishlist')}>
          <FiHeart /> Wishlist
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'orders' && (
          <div className="orders-list">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <FiPackage className="empty-icon" />
                <h3>No orders yet</h3>
                <p>Your order history will appear here.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">Order #{order._id.slice(-8)}</span>
                      <span className="order-date">
                        <FiClock /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="order-status-badges">
                      <span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span>
                      <span className={`status-badge payment-${order.paymentStatus}`}>{order.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.products?.map((p, i) => (
                      <div key={i} className="order-item">
                        <img src={p.image || 'https://via.placeholder.com/50'} alt={p.name} />
                        <div>
                          <span>{p.name}</span>
                          <span className="order-item-details">Size {p.size} × {p.quantity}</span>
                        </div>
                        <span className="order-item-price">${(p.price * p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total: ${order.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="empty-state">
            <FiHeart className="empty-icon" />
            <h3>Wishlist</h3>
            <p>Save your favorite sneakers here. Click the heart icon on any product to add it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
