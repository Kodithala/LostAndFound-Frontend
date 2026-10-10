import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchUnreadCount();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      setUser(res.data);
    } catch (err) {
      // Cleanly logout if token is invalid or expired
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      setUnreadCount(0);
    }
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password, phone, role) => {
    const res = await API.post('/auth/register', { name, email, password, phone, role });
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        login,
        register,
        logout,
        fetchProfile,
        fetchUnreadCount,
        updateUserData,
        isAdmin: user?.role === 'ADMIN',
        isStaff: user?.role === 'STAFF',
        isAdminOrStaff: user?.role === 'ADMIN' || user?.role === 'STAFF',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
