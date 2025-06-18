import axios from 'axios';

// Base URL from environment or fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // optional timeout
});

// Attach token to each request if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global response errors (e.g., token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('🔒 Session expired or unauthorized. Redirecting to login.');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // You can plug in a toast here if needed (e.g., toast.error)
    return Promise.reject(error);
  }
);

export default api;
