// backend/src/controllers/categoryController.js
import Category from '../models/Category.js'; // Changed from require(), added .js extension

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => { // Changed from exports.getCategories
  try {
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => { // Changed from exports.createCategory
  try {
    const { name } = req.body;

    // Check if category already exists for this user (case-insensitive name check)
    const existing = await Category.findOne({ user: req.user.id, name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      // Use 409 Conflict for existing resource
      return res.status(409).json({ message: 'Category with this name already exists for your account.' });
    }

    const category = new Category({
      user: req.user.id,
      name,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error creating category:", err); // Add specific error logging
    // Mongoose validation error might be handled by errorMiddleware, but specific check here can be useful too
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err); // Pass to general error handler
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => { // Changed from exports.deleteCategory
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error("Error deleting category:", err); // Add specific error logging
    next(err);
  }
};

// Export the functions as named exports
export {
  getCategories,
  createCategory,
  deleteCategory,
};
