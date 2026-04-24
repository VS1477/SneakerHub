import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getSneakerImage, useSneakerFallback } from '../utils/sneakerImage';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.sneaker?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const products = cart.items.map(item => ({
        sneaker: item.sneaker?._id || item.sneaker,
        name: item.sneaker?.name,
        image: item.sneaker?.images?.[0],
        size: item.size,
        quantity: item.quantity,
        price: item.sneaker?.price
      }));

      const { data } = await api.post('/orders', {
        products,
        totalPrice: total,
        shippingAddress: shipping,
        paymentId: 'demo_payment_' + Date.now()
      });

      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { state: { order: data } });
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={shipping.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={shipping.address} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={shipping.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={shipping.state} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code</label>
                <input type="text" name="zipCode" value={shipping.zipCode} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={shipping.country} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment</h2>
            <div className="payment-demo-notice">
              <FiLock />
              <p>This is a demo checkout. No real payment will be processed.</p>
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg place-order-btn" disabled={loading}>
            {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {cart.items.map(item => (
              <div key={item._id} className="checkout-item">
                <img src={getSneakerImage(item.sneaker?.images)} alt="" onError={useSneakerFallback} />
                <div>
                  <p>{item.sneaker?.name}</p>
                  <span>Size {item.size} × {item.quantity}</span>
                </div>
                <span>${((item.sneaker?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-divider"></div>
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
