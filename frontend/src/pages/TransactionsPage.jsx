import React, { useEffect, useState, useRef } from 'react';
import Modal from '../components/Modal';
import './TransactionsPage.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCategories, // from categorySlice
  addCategory,     // from categorySlice
  deleteCategory,  // from categorySlice
} from '../features/categories/categorySlice';
import {
  fetchTransactions, // from transactionSlice
  addTransaction,    // from transactionSlice
  updateTransaction, // from transactionSlice
  deleteTransaction, // from transactionSlice
} from '../features/transactions/transactionSlice'; // FIXED: Changed to 'transactionSlice' (singular)

function TransactionsPage() {
  const dispatch = useDispatch();

  // Redux state for categories
  const { categories, loading: categoriesLoading, error: categoryError } = useSelector((state) => state.categories);
  // Redux state for transactions
  const { transactions, loading: transactionsLoading, error: transactionError } = useSelector((state) => state.transactions); // Use transactionSlice loading/error

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  // Removed local loading and error states as they are now managed by Redux slices
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Modal states for all alerts/confirms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '', // This is the correct property name
    type: 'alert',
    onConfirm: null,
  });

  // State for category submission loading
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const deleteCategoryRef = useRef(null);
  const formRef = useRef(null);

  // Set document title and fetch initial data on component mount
  useEffect(() => {
    document.title = 'Budgetly - Transactions';
    dispatch(fetchTransactions()); // Dispatch Redux thunk for transactions
    dispatch(fetchCategories()); // Dispatch Redux thunk for categories
  }, [dispatch]); // Depend only on dispatch


  // No longer need a local fetchTransactions function, it's a Redux thunk now
  // const fetchTransactions = async () => { ... };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle adding a new category (still uses local axios, or could be moved to categorySlice)
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      setModalContent({
        title: 'Input Error',
        message: 'Category name cannot be empty.',
        type: 'alert',
        onConfirm: null,
      });
      setIsModalOpen(true);
      return;
    }

    setIsAddingCategory(true);
    try {
      // Dispatch Redux thunk for adding category
      await dispatch(addCategory({ name: trimmedName })).unwrap();
      setNewCategoryName('');
      dispatch(fetchCategories()); // Refresh categories after adding
      setModalContent({
        title: 'Success',
        message: 'Category added successfully!',
        type: 'alert',
        onConfirm: null,
      });
    } catch (err) {
      console.error('Failed to add category:', err);
      setModalContent({
        title: 'Error',
        message: err.message || err.response?.data?.message || 'Failed to add category.',
        type: 'alert',
        onConfirm: null,
      });
    } finally {
      setIsAddingCategory(false);
      setIsModalOpen(true);
    }
  };


  const handleSubmit = async (e) => {
    console.log('--- handleSubmit triggered! ---');
    e.preventDefault();
    console.log('handleSubmit called. FormData:', formData);
    const { _id, ...dataToSubmit } = formData;
    console.log('Data to submit:', dataToSubmit);

    if (formData.type === 'expense' && !formData.category) {
      setModalContent({
        title: 'Missing Information',
        message: 'Please select a category for expenses.',
        type: 'alert',
        onConfirm: null,
      });
      setIsModalOpen(true);
      return;
    }

    try {
      if (_id) {
        // Dispatch Redux thunk for updating transaction
        await dispatch(updateTransaction({ id: _id, data: dataToSubmit })).unwrap();
      } else {
        // Dispatch Redux thunk for adding transaction
        await dispatch(addTransaction(dataToSubmit)).unwrap();
      }

      resetForm();
      // No need to call fetchTransactions() directly here,
      // the thunks' fulfilled actions will update the state.
      // However, if you want immediate re-sort or filter, you might refetch
      // For now, relying on Redux store updates.

      setModalContent({
        title: 'Success',
        message: _id ? 'Transaction updated successfully!' : 'Transaction added successfully!',
        type: 'alert',
        onConfirm: null,
      });
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setModalContent({
        title: 'Error',
        message: err.message || err.response?.data?.message || 'Error saving transaction.',
        type: 'alert',
        onConfirm: null,
      });
    } finally {
      setIsModalOpen(true);
      console.log('Modal should now be open!');
    }
  };

  const handleDelete = (id) => {
    console.log("handleDelete called for transaction ID:", id);
    setModalContent({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete this transaction with ID: ${id}?`,
      type: 'confirm',
      onConfirm: async () => {
        console.log("onConfirm for delete triggered for transaction ID:", id);
        try {
          // Dispatch Redux thunk for deleting transaction
          await dispatch(deleteTransaction(id)).unwrap();
          // No need to call fetchTransactions() directly here
          setModalContent({
            title: 'Deleted',
            message: 'Transaction deleted successfully!',
            type: 'alert',
            onConfirm: null,
          });
        } catch (err) {
          console.error('Delete failed in onConfirm:', err);
          setModalContent({
            title: 'Error',
            message: err.message || err.response?.data?.message || 'Error deleting transaction.',
            type: 'alert',
            onConfirm: null,
          });
        } finally {
            setIsModalOpen(true);
        }
      },
    });

    setIsModalOpen(true);
    console.log("TransactionsPage: Setting isModalOpen to TRUE.");
  };


  const handleDeleteCategory = (categoryId, categoryName) => {
    deleteCategoryRef.current = async () => {
      try {
        // Dispatch Redux thunk for deleting category
        await dispatch(deleteCategory(categoryId)).unwrap();
        setModalContent({
          title: 'Category Deleted',
          message: `Category "${categoryName}" deleted successfully!`,
          type: 'alert',
          onConfirm: null,
        });
      } catch (err) {
        console.error('Failed to delete category:', err);
        setModalContent({
          title: 'Error',
          message: err.message || err.response?.data?.message || 'Failed to delete category.',
          type: 'alert',
          onConfirm: null,
        });
      } finally {
        setIsModalOpen(true);
      }
    };

    setModalContent({
      title: 'Confirm Category Deletion',
      message: `Are you sure you want to delete the category "${categoryName}"? This cannot be undone.`,
      type: 'confirm',
      onConfirm: deleteCategoryRef.current,
    });

    setIsModalOpen(true);
  };


  const handleEdit = (tx) => {
    setFormData({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      date: tx.date.slice(0, 10),
      notes: tx.notes || '',
      _id: tx._id,
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      date: '',
      notes: '',
      _id: null,
    });
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="transactions-page-container max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Transactions</h1>

      {/* Use Redux loading and error states for transactions */}
      {transactionsLoading && <p className="text-center text-blue-500">Loading transactions...</p>}
      {transactionError && <p className="text-center text-red-500">{transactionError}</p>}

      {/* Display Transactions */}
      {!transactionsLoading && !transactionError && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions yet. Add one below!</p>
          ) : (
            <ul className="space-y-6">
              {transactions.map((tx) => (
                <li key={tx._id} className="transaction-item">
                  <div className="content-wrapper">
                    <div className="font-semibold text-lg" style={{ color: tx.type === 'income' ? '#00C49F' : '#FF4D4F' }}>
                      {tx.type.toUpperCase()}
                    </div>
                    <div className="text-gray-800">Amount: {formatZAR(tx.amount)}</div>
                    <div className="text-gray-700">Category: {tx.category || 'N/A'}</div>
                    <div className="text-gray-700">Date: {new Date(tx.date).toLocaleDateString()}</div>
                    {tx.notes && <div className="text-gray-600 text-sm">Note: {tx.notes}</div>}
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(tx)}
                      className="transaction-btn text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="transaction-btn text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Category Management */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Manage Categories</h2>

        {/* Add Category Form */}
        <form onSubmit={handleCategorySubmit} className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-grow min-w-[200px]"
            required
          />
          <button
            type="submit"
            disabled={!newCategoryName.trim() || isAddingCategory}
            className="btn-primary"
          >
            {isAddingCategory ? 'Adding...' : 'Add Category'}
          </button>
        </form>

        {/* List of Existing Categories */}
        {categoriesLoading && <p className="text-center text-blue-500 mt-4">Loading categories...</p>}
        {categoryError && <p className="text-center text-red-500 mt-4">Failed to load categories.</p>}
        {!categoriesLoading && !categoryError && categories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Existing Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat._id} className="category-pill flex items-center">
                  {cat.name}
                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="ml-1"
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <FaTrashAlt size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Transaction Form */}
      <div ref={formRef} className={`card transaction-form ${formData._id ? 'edit-mode' : ''}`}>
        <h2 className="text-2xl font-semibold mb-4">{formData._id ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required={formData.type === 'expense'}
            >
              <option value="">Select a category</option>
              {categories.length === 0 ? (
                <option value="" disabled>No categories available. Add one above!</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn-primary flex-grow">
              {formData._id ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {formData._id && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Clear Form
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Global Modal for alerts/confirms */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalContent.onConfirm}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </div>
  );
}

export default TransactionsPage;
