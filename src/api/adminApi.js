import axios from 'axios';
import { INITIAL_PACKAGES } from '../data/initialPackages';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:8080');
const cleanHost = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '') : '';
const AUTH_BASE_URL = import.meta.env.VITE_API_AUTH_URL || (cleanHost ? `${cleanHost}/api/auth` : '/api/auth');
const ADMIN_BASE_URL = import.meta.env.VITE_API_ADMIN_URL || (cleanHost ? `${cleanHost}/api/admin` : '/api/admin');

export const adminApi = axios.create({
  baseURL: ADMIN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alzain_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Expired / Unauthorized JWTs
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('alzain_admin_token');
      localStorage.removeItem('alzain_admin_user');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const adminLogin = async (emailOrUsername, password) => {
  try {
    const isEmail = emailOrUsername.includes('@');
    const payload = isEmail
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };

    const response = await axios.post(`${AUTH_BASE_URL}/admin/login`, payload);
    if (response.data && response.data.token) {
      localStorage.setItem('alzain_admin_token', response.data.token);
      localStorage.setItem(
        'alzain_admin_user',
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        })
      );
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Invalid username, email, or password');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/admin/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Unable to process password reset request.');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/admin/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Password reset failed. Token may be invalid or expired.');
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await adminApi.put('/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Dashboard APIs
export const fetchDashboardMetrics = async () => {
  const response = await adminApi.get('/dashboard');
  return response.data;
};

export const fetchRecentBookings = async () => {
  const response = await adminApi.get('/bookings/recent');
  return response.data;
};

// Package Management APIs
export const fetchAdminPackages = async () => {
  try {
    const response = await adminApi.get('/packages');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Admin packages fetch failed, using fallback:', error.message);
  }
  return INITIAL_PACKAGES;
};

export const fetchPackageById = async (id) => {
  const response = await adminApi.get(`/packages/${id}`);
  return response.data;
};

export const createPackage = async (packageData) => {
  const response = await adminApi.post('/packages', packageData);
  return response.data;
};

export const updatePackage = async (id, packageData) => {
  const response = await adminApi.put(`/packages/${id}`, packageData);
  return response.data;
};

export const togglePackageStatus = async (id) => {
  const response = await adminApi.patch(`/packages/${id}/toggle-status`);
  return response.data;
};

export const deletePackage = async (id) => {
  const response = await adminApi.delete(`/packages/${id}`);
  return response.data;
};

// Test Master Management APIs
export const fetchAdminTests = async () => {
  try {
    const response = await adminApi.get('/tests');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Admin tests fetch failed:', error.message);
  }
  return [];
};

export const createTest = async (testData) => {
  const response = await adminApi.post('/tests', testData);
  return response.data;
};

export const updateTest = async (id, testData) => {
  const response = await adminApi.put(`/tests/${id}`, testData);
  return response.data;
};

export const deleteTest = async (id) => {
  const response = await adminApi.delete(`/tests/${id}`);
  return response.data;
};

// Booking Management APIs
export const fetchAdminBookings = async (statusFilter = 'ALL') => {
  try {
    const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
    const response = await adminApi.get('/bookings', { params });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Admin bookings fetch failed:', error.message);
  }
  return [];
};

export const fetchBookingById = async (id) => {
  const response = await adminApi.get(`/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id, newStatus) => {
  const response = await adminApi.put(`/bookings/${id}/status`, { status: newStatus });
  return response.data;
};

export const deleteAdminBooking = async (id) => {
  const response = await adminApi.delete(`/bookings/${id}`);
  return response.data;
};
