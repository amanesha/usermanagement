import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import departmentReducer from './departmentSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    departments: departmentReducer,
    auth: authReducer,
  },
});

export default store;
