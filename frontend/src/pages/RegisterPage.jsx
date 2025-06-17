import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState(null);

  const usernameRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Budgetly - Register';
    usernameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (user && submitted) {
      const timeout = setTimeout(() => navigate('/login'), 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, submitted, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError(null);
    setSubmitted(true);
    dispatch(register({ username, email, password }));
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) dispatch(clearAuthError());
    if (localError) setLocalError(null);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Register for Budgetly</h2>

        <AnimatePresence>
          {localError && (
            <motion.div
              className="text-red-500 text-sm mb-4 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {localError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && !localError && (
            <motion.div
              className="text-red-500 text-sm mb-4 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {user && submitted && (
            <motion.div
              className="text-green-600 text-sm mb-4 text-center font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Registration successful! Redirecting to login...
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              value={username}
              onChange={handleChange(setUsername)}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:shadow-outline"
              placeholder="Username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange(setEmail)}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:shadow-outline"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChange(setPassword)}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:shadow-outline"
              placeholder="********"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword)}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:shadow-outline"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-semibold"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
