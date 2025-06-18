import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/categories');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

// Add a new category
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post('/categories', data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add category'
      );
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete category'
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    addLoading: false,
    addError: null,
    deleteLoading: false,
    deleteError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.addLoading = false;
        const exists = state.categories.some(
          (cat) => cat.name.toLowerCase() === action.payload.name.toLowerCase()
        );
        if (!exists) {
          state.categories.push(action.payload);
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export default categorySlice.reducer;
