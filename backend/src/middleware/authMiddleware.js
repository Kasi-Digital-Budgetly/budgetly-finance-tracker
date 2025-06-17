import jwt from 'jsonwebtoken'; // Changed from require()
import User from '../models/User.js'; // Changed from require(), added .js extension

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('AUTH_MIDDLEWARE_DEBUG: Token received:', token);
      console.log('AUTH_MIDDLEWARE_DEBUG: JWT_SECRET used for verification (from env):', process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('AUTH_MIDDLEWARE_DEBUG: Token decoded successfully:', decoded);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log('AUTH_MIDDLEWARE_DEBUG: User not found for decoded ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      console.log('AUTH_MIDDLEWARE_DEBUG: User found:', req.user.username);

      next();
    } catch (err) {
      console.error('AUTH_MIDDLEWARE_DEBUG: JWT verification failed!', err); // CRITICAL: Log the full error object
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('AUTH_MIDDLEWARE_DEBUG: No token or invalid format (missing Bearer prefix).');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
}; 

export { protect }; // Changed from module.exports
