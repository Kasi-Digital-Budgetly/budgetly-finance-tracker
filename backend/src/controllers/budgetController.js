// backend/src/controllers/budgetController.js
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js'; // Need to import Transaction model

/**
 * @desc    Create a new budget
 * @route   POST /api/budgets
 * @access  Private
 */
const createBudget = async (req, res) => {
  const { category, amount, startDate, endDate } = req.body;

  // Basic validation
  if (!category || !amount || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please enter all required fields for the budget.' });
  }

  // Ensure amount is a positive number
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  // Convert dates to Date objects for proper comparison
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Basic date validation
  if (start >= end) {
    return res.status(400).json({ message: 'End date must be after start date.' });
  }

  try {
    const budget = await Budget.create({
      user: req.user._id, // User ID from protect middleware
      category,
      amount,
      startDate: start,
      endDate: end,
    });
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    // Check for duplicate key error (e.g., if you later add unique constraints)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A budget for this category and period already exists.' });
    }
    res.status(500).json({ message: 'Server error while creating budget.' });
  }
};

/**
 * @desc    Get all budgets for the authenticated user, with spent amounts
 * @route   GET /api/budgets
 * @access  Private
 */
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .populate('category', 'name') // Populate the category field to get its name
      .sort({ endDate: -1 }); // Sort by end date, most recent first

    console.log('Fetched budgets before spent calculation:', budgets); // DEBUG LOG 1

    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      // IMPORTANT FIX: Use budget.category.name for matching, as Transaction.category is a String
      const categoryNameForMatch = budget.category.name;
      const budgetStartDate = new Date(budget.startDate);
      const budgetEndDate = new Date(budget.endDate);

      console.log(`Calculating spent for budget: ${categoryNameForMatch} from ${budgetStartDate.toISOString()} to ${budgetEndDate.toISOString()}`); // DEBUG LOG 2

      const transactions = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            type: 'expense',
            category: categoryNameForMatch, // <-- FIX: Use category name (string) here
            date: { $gte: budgetStartDate, $lte: budgetEndDate }, // Match within date range
          },
        },
        {
          $group: {
            _id: null, // Group all matching documents
            totalSpent: { $sum: '$amount' }, // Sum the amounts
          },
        },
      ]);

      const spent = transactions.length > 0 ? transactions[0].totalSpent : 0;
      console.log(`Category: ${categoryNameForMatch}, Total Spent: ${spent}`); // DEBUG LOG 3

      return {
        ...budget.toObject(), // Convert Mongoose document to plain JS object
        spent, // Add the calculated spent amount
        category: budget.category.name, // Ensure category is just the name for frontend
      };
    }));

    res.status(200).json(budgetsWithSpent);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Server error while fetching budgets.' });
  }
};


/**
 * @desc    Update a budget
 * @route   PUT /api/budgets/:id
 * @access  Private
 */
const updateBudget = async (req, res) => {
  const { category, amount, startDate, endDate } = req.body;

  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Ensure the budget belongs to the authenticated user
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this budget' });
    }

    // Update fields
    budget.category = category || budget.category;
    budget.amount = amount || budget.amount;
    budget.startDate = startDate ? new Date(startDate) : budget.startDate; // Convert to Date object
    budget.endDate = endDate ? new Date(endDate) : budget.endDate;       // Convert to Date object

    // Optional: Add date validation here if both start and end are provided for update
    if (budget.startDate && budget.endDate && budget.startDate >= budget.endDate) {
      return res.status(400).json({ message: 'End date must be after start date.' });
    }

    const updatedBudget = await budget.save();

    // The frontend will re-fetch to get the spent amount
    res.status(200).json(updatedBudget);

  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Server error while updating budget.' });
  }
};

/**
 * @desc    Delete a budget
 * @route   DELETE /api/budgets/:id
 * @access  Private
 */
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Ensure the budget belongs to the authenticated user
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this budget' });
    }

    await budget.deleteOne();

    res.status(200).json({ message: 'Budget removed' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Server error while deleting budget.' });
  }
};

export {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
