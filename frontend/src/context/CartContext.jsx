import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

// Context hooks are intentionally colocated with their providers here.
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Use local storage for guests
      const local = JSON.parse(localStorage.getItem('sneakerhub_cart') || '{"items":[]}');
      setCart(local);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {
      console.error('Failed to fetch cart');
    }
  };

  const addToCart = async (sneakerId, size, quantity = 1, sneakerData = null) => {
    setLoading(true);
    try {
      if (user) {
        const { data } = await api.post('/cart/add', { sneakerId, size, quantity });
        setCart(data);
      } else {
        const local = { ...cart, items: [...cart.items] };
        const existing = local.items.find(
          i => (i.sneaker?._id || i.sneaker) === sneakerId && i.size === size
        );
        if (existing) {
          existing.quantity += quantity;
        } else {
          const sneakerInfo = sneakerData
            ? { _id: sneakerId, name: sneakerData.name, brand: sneakerData.brand, price: sneakerData.price, images: sneakerData.images }
            : { _id: sneakerId };
          local.items.push({ sneaker: sneakerInfo, size, quantity, _id: Date.now().toString() });
        }
        setCart(local);
        localStorage.setItem('sneakerhub_cart', JSON.stringify(local));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (user) {
        const { data } = await api.put('/cart/update', { itemId, quantity });
        setCart(data);
      } else {
        const local = { ...cart };
        const item = local.items.find(i => i._id === itemId);
        if (item) {
          if (quantity <= 0) {
            local.items = local.items.filter(i => i._id !== itemId);
          } else {
            item.quantity = quantity;
          }
        }
        setCart(local);
        localStorage.setItem('sneakerhub_cart', JSON.stringify(local));
      }
    } catch {
      console.error('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (user) {
        const { data } = await api.delete(`/cart/remove/${itemId}`);
        setCart(data);
      } else {
        const local = { ...cart };
        local.items = local.items.filter(i => i._id !== itemId);
        setCart(local);
        localStorage.setItem('sneakerhub_cart', JSON.stringify(local));
      }
    } catch {
      console.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.delete('/cart/clear');
      }
      setCart({ items: [] });
      localStorage.removeItem('sneakerhub_cart');
    } catch {
      console.error('Failed to clear cart');
    }
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
