import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function Cart() {
  const { cart, cartCount, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.sneaker?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <FiShoppingBag className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any sneakers yet.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart <span className="cart-count">({cartCount} items)</span></h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.sneaker?.images?.[0] || 'https://via.placeholder.com/120'}
                  alt={item.sneaker?.name || 'Sneaker'}
                />
              </div>
              <div className="cart-item-info">
                <h3>{item.sneaker?.name || 'Sneaker'}</h3>
                <span className="cart-item-brand">{item.sneaker?.brand}</span>
                <span className="cart-item-size">Size: US {item.size}</span>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                  <FiMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                  <FiPlus />
                </button>
              </div>
              <div className="cart-item-price">
                ${((item.sneaker?.price || 0) * item.quantity).toFixed(2)}
              </div>
              <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {subtotal < 100 && (
            <p className="free-shipping-hint">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
          )}
          <Link
            to={user ? '/checkout' : '/login'}
            className="btn btn-primary btn-lg checkout-btn"
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </Link>
        </div>
      </div>
    </div>
  );
}
