import express from 'express';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js'; // ✅ Named import

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword); // ✅ Use protect middleware

export default router;
