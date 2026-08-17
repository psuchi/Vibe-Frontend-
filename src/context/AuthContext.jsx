import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('vibe_token');
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error('Session invalid or expired:', err);
          logout();
        }
      }
      setLoading(false);
    };
    validateSession();
  }, [API_URL]);

  const login = async (email, password = 'password123') => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setUser(res.data);
      localStorage.setItem('vibe_token', res.data.token);
      localStorage.setItem('vibe_user', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password = 'password123') => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      setUser(res.data);
      localStorage.setItem('vibe_token', res.data.token);
      localStorage.setItem('vibe_user', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibe_token');
    localStorage.removeItem('vibe_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

