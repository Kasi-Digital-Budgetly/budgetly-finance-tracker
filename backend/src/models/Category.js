// backend/src/models/Category.js
import mongoose from 'mongoose'; // Changed from require()

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Consider making category names unique per user later
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema); // Define the model first

export default Category; // Changed from module.exports
