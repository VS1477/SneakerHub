import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Context hooks are intentionally colocated with their providers here.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sneakerhub_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sneakerhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sneakerhub_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      toast.success('Welcome back!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      toast.success('Account created!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out');
  };

  const toggleWishlist = async (sneakerId) => {
    try {
      const { data } = await api.post('/auth/wishlist', { sneakerId });
      return data;
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}
