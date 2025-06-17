import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To manage initial loading state

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const isAuthenticated = !!user; // true if user is not null, false otherwise

  const register = async (username, email, password) => {
    try {
      const userData = await authService.register(username, email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // <-- ADDED THIS LINE
      return userData;
    } catch (error) {
      console.error('Registration failed in AuthContext:', error);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // <-- ADDED THIS LINE
      return userData;
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout(); // This service function should also clear localStorage
    localStorage.removeItem('user'); // <-- ENSURE THIS IS ALSO CALLED ON LOGOUT
    setUser(null);
  };

  // If still loading user from localStorage, you might want a loading spinner or similar
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
