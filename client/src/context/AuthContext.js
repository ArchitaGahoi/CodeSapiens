import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      loadUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      loadUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication error');
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, error, register, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;