    // backend/src/routes/categories.js
    import express from 'express'; // Change: Use import for express
    import {
      getCategories,
      createCategory,
      deleteCategory,
    } from '../controllers/categoryController.js'; // Change: Add .js extension
    import { protect } from '../middleware/authMiddleware.js'; // Change: Add .js extension

    const router = express.Router();

    // GET all & POST new category
    router.route('/')
      .get(protect, getCategories)
      .post(protect, createCategory);

    // DELETE specific category
    router.route('/:id')
      .delete(protect, deleteCategory);

    export default router; // Change: Use export default for the router
    