import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCategories } from '../services/categoryService';
import axios from '../api/axios'; // Import axios for API calls
import { toast } from 'react-toastify';  // <-- added toast import
import './BudgetPage.css'; // Create this CSS file for styling

const BudgetPage = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Function to fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories.");
        console.error("Error fetching categories:", err);
        toast.error("Failed to fetch categories."); // toast error
      }
    };
    getCategories();
  }, [isAuthenticated]);

  // Function to fetch all budgets for the user
  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/budgets');
      setBudgets(res.data);
    } catch (err) {
      setError("Failed to fetch budgets. Please ensure your backend is running.");
      console.error("Error fetching budgets:", err);
      toast.error("Failed to fetch budgets. Please ensure your backend is running."); // toast error
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all transactions for the user
  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions for tips:", err);
      // no toast here as budgets fetch might still succeed
    }
  };

  // Fetch budgets and transactions when the component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handler for setting a new budget
  const handleSetBudget = async (e) => {
    e.preventDefault();
    console.log('handleSetBudget function called!');

    if (!isAuthenticated) {
      setError("You must be logged in to set a budget.");
      toast.error("You must be logged in to set a budget."); // toast error
      return;
    }
    if (!newBudget.category || !newBudget.amount || !newBudget.startDate || !newBudget.endDate) {
      setError("Please fill in all budget fields.");
      toast.error("Please fill in all budget fields."); // toast error
      return;
    }

    try {
      const response = await axios.post('/budgets', newBudget);
      console.log('Budget creation response:', response.data);
      setNewBudget({ category: '', amount: '', startDate: '', endDate: '' });
      setMessage("Budget set successfully!");
      toast.success("Budget set successfully!"); // toast success
      setError(null);
      fetchBudgets();
      fetchTransactions();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error setting budget:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Failed to set budget. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg); // toast error
    }
  };

  // Function to format amount to ZAR
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculates the percentage of the budget spent
  const calculateProgress = (budget) => {
    if (budget.amount === 0) return 0;
    const spentPercentage = (budget.spent / budget.amount) * 100;
    return Math.min(spentPercentage, 100);
  };

  // Calculate total income and expenses for the tip
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Generate a simple tip based on income and expenses
  const getSimpleBudgetTip = () => {
    if (transactions.length === 0) {
      return "Start by logging all your income and expenses to get a clear financial picture!";
    }

    if (totalExpenses > totalIncome) {
      const difference = totalExpenses - totalIncome;
      return `Your expenses currently exceed your income by ${formatAmount(difference)}. Review your spending categories and look for areas to cut back.`;
    } else if (totalIncome > totalExpenses) {
      const savings = totalIncome - totalExpenses;
      return `Great job! You're currently saving ${formatAmount(savings)}. Consider setting specific savings goals or investing some of your surplus.`;
    } else {
      return "Your income and expenses are balanced. Look for small adjustments to start saving more!";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="budget-page container">
        <h1>Budget Overview</h1>
        <p>Please log in to manage your budgets.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="budget-page container">
        <h1>Budget Overview</h1>
        <p>Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="budget-page container">
      <h1>Budget Overview</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <section className="budget-form-section card">
        <h2>Set New Budget</h2>
        <form onSubmit={handleSetBudget} className="budget-form">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={newBudget.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (R):</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newBudget.amount}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newBudget.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newBudget.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Set Budget</button>
        </form>
      </section>

      <section className="current-budgets-section card">
        <h2>Current Budgets</h2>
        {budgets.length === 0 ? (
          <p>No budgets set yet. Set one above!</p>
        ) : (
          <div className="budgets-list">
            {budgets.map(budget => (
              <div key={budget._id} className="budget-item">
                <h3>{budget.category} Budget</h3>
                <p>Period: {new Date(budget.startDate).toLocaleDateString()} to {new Date(budget.endDate).toLocaleDateString()}</p>
                <p>Budgeted: {formatAmount(budget.amount)}</p>
                <p>Spent: {formatAmount(budget.spent)}</p>
                <p>Remaining: {formatAmount(budget.amount - budget.spent)}</p>
                <div className="budget-progress-bar-container">
                  <div
                    className="budget-progress-bar"
                    style={{
                      width: `${calculateProgress(budget)}%`,
                      backgroundColor: calculateProgress(budget) > 90
                        ? 'var(--danger-color)'
                        : (calculateProgress(budget) > 70
                          ? 'var(--warning-color)'
                          : 'var(--success-color)')
                    }}
                  ></div>
                </div>
                <p className="progress-text">{calculateProgress(budget).toFixed(1)}% Spent</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="budget-tips-section card">
        <h2>Budget Optimization Tips ✨</h2>
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap text-sm">
          <h3 className="font-semibold text-lg mb-2">Your Personalized Tip:</h3>
          <p>{getSimpleBudgetTip()}</p>
        </div>
      </section>
    </div>
  );
};

export default BudgetPage;
