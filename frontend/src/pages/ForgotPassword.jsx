import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Reset link sent. Check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          aria-required="true"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {message && (
        <>
          <p className="success-msg" role="alert">{message}</p>
          <Link to="/login">
            <button className="login-btn">Back to Login</button>
          </Link>
        </>
      )}
      
      {error && <p className="error-msg" role="alert">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
