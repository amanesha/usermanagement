import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { departmentsAPI } from '../services/api';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDepartmentStats = createAsyncThunk(
  'departments/fetchDepartmentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    stats: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.results || action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDepartmentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDepartmentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
      });
  },
});

export const { clearError } = departmentSlice.actions;
export default departmentSlice.reducer;
