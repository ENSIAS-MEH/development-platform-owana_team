import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// FoundersSync API endpoints

export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    changePassword: '/api/auth/change-password',
    health: '/api/auth/health',
  },
  users: {
    me: '/api/users/me',
    byId: (id: string) => `/api/users/${id}`,
    byUsername: (username: string) => `/api/users/username/${username}`,
    update: (id: string) => `/api/users/${id}`,
    updateMe: '/api/users/me',
    search: '/api/users/search',
    delete: (id: string) => `/api/users/${id}`,
    all: '/api/users',
    uploadPicture: '/api/users/me/picture',
    health: '/api/users/health',
  },
  // Admin-only auth-service endpoints
  adminAuth: {
    banUser: (userId: string) => `/api/auth/users/${userId}/ban`,
    unbanUser: (userId: string) => `/api/auth/users/${userId}/unban`,
  },
};
