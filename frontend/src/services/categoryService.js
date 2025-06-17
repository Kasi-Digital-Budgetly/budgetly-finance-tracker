// frontend/src/services/categoryService.js

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

// You can add more functions here for updateCategory, deleteCategory if needed later

export {
  fetchCategories,
  createCategory
};
