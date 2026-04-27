import axios from 'axios';
import type { Product, LoginCredentials, RegisterData } from '../types';

// ─── Axios Instance ───────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Product API ───────────────────────────────────────────────────────────────────
export const productService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  getCategories: () => api.get<string[]>('/products/categories'),
  getByCategory: (cat: string) => api.get<Product[]>(`/products/category/${cat}`),
};

// ─── Auth API ──────────────────────────────────────────────────────────────────────
export const authService = {
  login: (creds: LoginCredentials) =>
    api.post<{ token: string }>('/auth/login', creds),

  // FakeStore doesn't have real register, simulate it
  register: async (data: RegisterData) => {
    const res = await api.post('/users', data);
    return res;
  },

  getUser: (id: number) => api.get(`/users/${id}`),
};

export default api;
