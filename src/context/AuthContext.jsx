import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vibe_user');
    return saved ? JSON.parse(saved) : null;
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const login = async (name, email, password = 'password123') => {
    try {
      // First try to login
      let res;
      try {
        res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      } catch (err) {
        // If login fails (user doesn't exist), try to register
        if (err.response && err.response.status === 401) {
          res = await axios.post(`${API_URL}/api/auth/register`, { name: name || 'Traveler', email, password });
        } else {
          throw err;
        }
      }
      
      setUser(res.data);
      localStorage.setItem('vibe_user', JSON.stringify(res.data));
    } catch (error) {
      console.error('Auth error:', error);
      // Fallback to mock login if backend is down or no DB
      const mockUser = { name: name || 'Traveler', email, token: 'mock-token' };
      setUser(mockUser);
      localStorage.setItem('vibe_user', JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibe_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

