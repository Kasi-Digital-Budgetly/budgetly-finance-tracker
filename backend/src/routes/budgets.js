// backend/src/routes/budgets.js
import express from 'express';
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js'; // Note the .js extension
import { protect } from '../middleware/authMiddleware.js'; // Note the .js extension

const router = express.Router();

// Routes for /api/budgets
router.route('/')
  .post(protect, createBudget) // Create new budget
  .get(protect, getBudgets);   // Get all budgets for the user

// Routes for /api/budgets/:id
router.route('/:id')
  .put(protect, updateBudget)   // Update a specific budget
  .delete(protect, deleteBudget); // Delete a specific budget

export default router;