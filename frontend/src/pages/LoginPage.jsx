import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../features/auth/authSlice';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Budgetly - Login';
    if (user && user.token) {
      navigate('/');
    }
  }, [user, navigate]);

  // Optional autofocus on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        // Navigation handled via useEffect
      })
      .catch(() => {
        // Error is handled via Redux
      });
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login to Budgetly</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={handleChange(setUsername)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={handleChange(setPassword)}
              required
            />
          </div>
          <div className="mb-4 text-right">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
              Forgot Password?
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
