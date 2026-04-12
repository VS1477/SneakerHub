import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-card">
        <FiCheckCircle className="confirmation-icon" />
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>

        {order && (
          <div className="order-details">
            <div className="order-id">
              <FiPackage />
              <span>Order ID: {order._id}</span>
            </div>
            <div className="order-total">
              <span>Total: ${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/profile" className="btn btn-primary">View Orders</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
