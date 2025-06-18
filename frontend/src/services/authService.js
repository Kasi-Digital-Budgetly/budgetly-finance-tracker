import api from '../api/axios'; // your configured axios instance

// Register user
const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
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
