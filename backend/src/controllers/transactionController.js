// backend/src/controllers/transactionController.js
import Transaction from '../models/Transaction.js'; // Changed from require(), added .js extension

/**
 * @desc    Get all transactions for the logged-in user
 * @route   GET /api/transactions
 * @access  Private
 */
const getTransactions = async (req, res, next) => { // Changed from exports.getTransactions
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err); // Added specific error logging
    next(err);
  }
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = async (req, res, next) => { // Changed from exports.createTransaction
  try {
    const { type, amount, date, category, notes } = req.body;

    // Basic validation
    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please include all required fields for the transaction (type, amount, category, date).' });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      date,
      category,
      notes,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error("Error creating transaction:", err); // Added specific error logging
    next(err);
  }
};

/**
 * @desc    Update an existing transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
const updateTransaction = async (req, res, next) => { // Changed from exports.updateTransaction
  try {
    // Note: Mongoose's findOneAndUpdate by default returns the original document.
    // { new: true } option returns the modified document.
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true } // runValidators ensures schema validators run on update
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or not authorized to update.' });
    }

    res.status(200).json(transaction); // Use 200 OK for successful update
  } catch (err) {
    console.error("Error updating transaction:", err); // Added specific error logging
    // Handle validation errors specifically for updates if necessary
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
const deleteTransaction = async (req, res, next) => { // Changed from exports.deleteTransaction
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error("Error deleting transaction:", err); // Added specific error logging
    next(err);
  }
};

// Export the functions as named exports
export {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
