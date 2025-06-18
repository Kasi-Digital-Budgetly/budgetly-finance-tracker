import axios from '../api/axios'; // Import your configured Axios instance

/**
 * Fetches all categories from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 */
const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error; // Re-throw to allow the calling component to handle it
  }
};

/**
 * Creates a new category in the backend.
 * @param {string} categoryName - The name of the new category.
 * @returns {Promise<Object>} A promise that resolves to the created category object.
 */
const createCategory = async (categoryName) => {
  try {
    const response = await axios.post('/categories', { name: categoryName });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates a category by its ID.
 * @param {string} categoryId - The ID of the category to update.
 * @param {string} newName - The new name for the category.
 * @returns {Promise<Object>} A promise that resolves to the updated category object.
 */
const updateCategory = async (categoryId, newName) => {
  try {
    const response = await axios.put(`/categories/${categoryId}`, { name: newName });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Deletes a category by its ID.
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
const deleteCategory = async (categoryId) => {
  try {
    await axios.delete(`/categories/${categoryId}`);
  } catch (error) {
    console.error('Error deleting category:', error.response?.data || error.message);
    throw error;
  }
};

export {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
