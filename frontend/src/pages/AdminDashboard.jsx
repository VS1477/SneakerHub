import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiDollarSign, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sneakers, setSneakers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', description: '',
    sizes: '7,8,9,10,11,12', stock: '', category: 'Lifestyle',
    images: '', featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sneakersRes, ordersRes, analyticsRes] = await Promise.all([
        api.get('/sneakers?limit=100'),
        api.get('/orders/admin'),
        api.get('/orders/analytics')
      ]);
      setSneakers(sneakersRes.data.sneakers);
      setOrders(ordersRes.data.orders);
      setAnalytics(analyticsRes.data);
    } catch {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes.split(',').map(Number),
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingSneaker) {
        await api.put(`/sneakers/${editingSneaker._id}`, data);
        toast.success('Sneaker updated!');
      } else {
        await api.post('/sneakers', data);
        toast.success('Sneaker added!');
      }
      setShowForm(false);
      setEditingSneaker(null);
      resetForm();
      fetchData();
    } catch {
      toast.error('Failed to save sneaker');
    }
  };

  const handleEdit = (sneaker) => {
    setEditingSneaker(sneaker);
    setFormData({
      name: sneaker.name,
      brand: sneaker.brand,
      price: sneaker.price.toString(),
      description: sneaker.description,
      sizes: sneaker.sizes.join(','),
      stock: sneaker.stock.toString(),
      category: sneaker.category || 'Lifestyle',
      images: sneaker.images.join(','),
      featured: sneaker.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sneaker?')) return;
    try {
      await api.delete(`/sneakers/${id}`);
      toast.success('Sneaker deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', brand: '', price: '', description: '',
      sizes: '7,8,9,10,11,12', stock: '', category: 'Lifestyle',
      images: '', featured: false
    });
  };

  const revenueChartData = analytics ? {
    labels: analytics.monthlyData.map(m => m.month),
    datasets: [{
      label: 'Revenue ($)',
      data: analytics.monthlyData.map(m => m.revenue),
      backgroundColor: 'rgba(233, 69, 96, 0.8)',
      borderRadius: 8
    }]
  } : null;

  const statusChartData = analytics ? {
    labels: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [
        analytics.statusBreakdown.processing,
        analytics.statusBreakdown.shipped,
        analytics.statusBreakdown.delivered,
        analytics.statusBreakdown.cancelled
      ],
      backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c']
    }]
  } : null;

  if (loading) return <div className="admin-page"><div className="loading-spinner">Loading...</div></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          <FiTrendingUp /> Overview
        </button>
        <button className={activeTab === 'sneakers' ? 'active' : ''} onClick={() => setActiveTab('sneakers')}>
          <FiShoppingBag /> Sneakers
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          <FiPackage /> Orders
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && analytics && (
        <div className="admin-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <FiDollarSign className="stat-icon revenue" />
              <div>
                <h3>${analytics.totalRevenue?.toFixed(2)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <FiPackage className="stat-icon orders" />
              <div>
                <h3>{analytics.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <FiShoppingBag className="stat-icon products" />
              <div>
                <h3>{sneakers.length}</h3>
                <p>Products</p>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Monthly Revenue</h3>
              {revenueChartData && <Bar data={revenueChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
            </div>
            <div className="chart-card">
              <h3>Order Status</h3>
              {statusChartData && <Doughnut data={statusChartData} options={{ responsive: true }} />}
            </div>
          </div>
        </div>
      )}

      {/* Sneakers Tab */}
      {activeTab === 'sneakers' && (
        <div className="admin-sneakers">
          <div className="admin-section-header">
            <h2>Manage Sneakers</h2>
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingSneaker(null); resetForm(); }}>
              <FiPlus /> Add Sneaker
            </button>
          </div>

          {showForm && (
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3>{editingSneaker ? 'Edit Sneaker' : 'Add New Sneaker'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option>Lifestyle</option>
                    <option>Running</option>
                    <option>Basketball</option>
                    <option>Skateboarding</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Sizes (comma-separated)</label>
                <input value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Image URLs (comma-separated)</label>
                <input value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <label className="checkbox-label">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                Featured Product
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingSneaker ? 'Update' : 'Add'} Sneaker
                </button>
                <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingSneaker(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sneakers.map(s => (
                  <tr key={s._id}>
                    <td><img src={s.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="table-img" /></td>
                    <td>{s.name}</td>
                    <td>{s.brand}</td>
                    <td>${s.price}</td>
                    <td><span className={`stock-tag ${s.stock < 10 ? 'low' : ''}`}>{s.stock}</span></td>
                    <td>{s.rating?.toFixed(1)}</td>
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => handleEdit(s)}><FiEdit2 /></button>
                      <button className="delete-btn" onClick={() => handleDelete(s._id)}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-orders">
          <h2>All Orders</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8)}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>${order.totalPrice?.toFixed(2)}</td>
                    <td><span className={`status-badge payment-${order.paymentStatus}`}>{order.paymentStatus}</span></td>
                    <td><span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
