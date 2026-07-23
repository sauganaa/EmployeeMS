import React, { createContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const hasValidated = useRef(false);

  // Validate session ONLY on initial mount
  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await api.get('/users/profile');
          if (response.data.success) {
            const profileData = response.data.data;
            setUser(profileData);
            setToken(storedToken);
          } else {
            // Token is invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
      hasValidated.current = true;
    };
    validateSession();
  }, []); // Empty dependency array - only runs once on mount

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data.data;
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, user: receivedUser };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (fullname, email, password) => {
    try {
      const response = await api.post('/auth/register', { fullname, email, password });
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfileState = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...lsUser, ...updatedUser }));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfileState, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
