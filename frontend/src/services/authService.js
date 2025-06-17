import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; // Ensure this matches your backend URL

// Register user
// UPDATE THIS FUNCTION SIGNATURE AND DATA SENT
const register = async (username, email, password) => {
  const response = await axios.post(API_URL + 'register', { username, email, password });
  // If registration is successful, store user data and token in localStorage
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (username, password) => {
  const response = await axios.post(API_URL + 'login', { username, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;