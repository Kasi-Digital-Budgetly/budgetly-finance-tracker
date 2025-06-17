import axios from 'axios';

// Use environment variable or fallback to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // optional: 10-second timeout
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Handle unauthorized errors
    if (status === 401) {
      console.warn('Session expired. Logging out.');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }

    // Optional: show global error toasts here (e.g., using a toast library)
    return Promise.reject(error); // Re-throw the error for component-specific handling if needed
  }
);

export default api;
