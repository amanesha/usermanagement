import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users/', { params }),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
  getStatistics: () => api.get('/users/statistics/'),
  changeStatus: (id, status) => api.post(`/users/${id}/change_status/`, { status }),
};

// Departments API
export const departmentsAPI = {
  getAll: () => api.get('/departments/'),
  getById: (id) => api.get(`/departments/${id}/`),
  create: (data) => api.post('/departments/', data),
  update: (id, data) => api.put(`/departments/${id}/`, data),
  delete: (id) => api.delete(`/departments/${id}/`),
  getStats: () => api.get('/departments/stats/'),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  changePassword: (data) => api.post('/auth/change-password/', data),
};

// Admin Management API
export const adminsAPI = {
  getAll: () => api.get('/admins/'),
  create: (data) => api.post('/admins/create/', data),
  delete: (id) => api.delete(`/admins/${id}/delete/`),
  changeUserPassword: (userId, password) => api.post(`/admins/${userId}/change-password/`, { new_password: password }),
};

// Positions API
export const positionsAPI = {
  getAll: () => api.get('/positions-crud/'),
  getById: (id) => api.get(`/positions-crud/${id}/`),
  create: (data) => api.post('/positions-crud/', data),
  update: (id, data) => api.put(`/positions-crud/${id}/`, data),
  delete: (id) => api.delete(`/positions-crud/${id}/`),
};

export default api;
