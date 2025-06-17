// backend/src/models/Budget.js
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // References the Category model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Budget amount should not be negative
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Ensure that a user can only have one active budget per category at a given time period
// This can be enforced via backend logic if needed, but for Mongoose, uniqueness is more complex with date ranges
// For simplicity, we'll rely on frontend validation for now and allow multiple if date ranges don't perfectly overlap.
// A more robust approach would involve custom validation or aggregation pipelines.

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
