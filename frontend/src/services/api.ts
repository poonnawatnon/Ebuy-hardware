import axios, { AxiosError, AxiosResponse } from 'axios';
import { showToast } from '../utils/toast';
import { Product, ProductDetailResponse, ProductResponse, UpdateProductDTO } from '../types/product';
interface ApiErrorResponse {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

const API_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && originalRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Show error toast
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    showToast.error(errorMessage);

    return Promise.reject(error);
  }
);

// API methods
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: { email: string; password: string; username: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const productApi = {
  getProducts: async (params?: {
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

   getSellerProducts: async (params?: {
    status?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductResponse> => {
    const response = await api.get('/products/seller', { params });
    return response.data;
  },

  // get a single product
  getProduct: async (id: string): Promise<ProductDetailResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: {
    title: string;
    description?: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs?: Record<string, any>;
  }) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, updateData: Partial<{
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs: Record<string, any>;
    status: string;
  }>) => {
    const response = await api.put(`/products/${id}`, updateData);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  }
};

export const profileApi = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData: {
    username?: string;
    email?: string;
    bio?: string;
  }) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  }
};

// Cart API
export const cartApi = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (productId: string, quantity: number = 1) => {
    try {
      const response = await api.post('/cart/items', { 
        productId, 
        quantity 
      });
      return response.data;
    } catch (error) {
      // Explicitly handle 403 Forbidden error
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error(error.response.data.message || 'You cannot add this item to cart');
      }
      // Handle other errors
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to add item to cart');
      }
      throw error;
    }
  },
  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },
  removeFromCart: async (itemId: string) => {
    await api.delete(`/cart/items/${itemId}`);
  },
  getSellerOrders: async () => {
    const response = await api.get('/orders/seller/orders');
    return response.data;
  },

  getBuyerOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  updateProduct: async (id: string, productData: UpdateProductDTO) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  
};

export default api;