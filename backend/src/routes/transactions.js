// backend/src/routes/transactions.js
import express from 'express'; // Changed from require()
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js'; // Note the .js extension
import { protect } from '../middleware/authMiddleware.js'; // Note the .js extension

const router = express.Router();

// GET all & POST new transaction
router.route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

// GET, PUT, DELETE specific transaction by ID
router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

export default router; // Changed from module.exports
