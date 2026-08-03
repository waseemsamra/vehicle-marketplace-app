import axios from 'axios';
import { fetchAuthSession } from '../config/amplify';
import { monitoring } from './monitoring';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const TOKEN_KEY = 'authToken';

// Custom error class
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.message);
    
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const status = error.response?.status || 500;
    const data = error.response?.data;
    
    const apiError = new ApiError(message, status, data);
    return Promise.reject(apiError);
  }
);

// Retry logic
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || error.status < 500) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

// API methods
export const vehicleApi = {
  // Get all customers with pagination
  getAll: async (lastKey = null, limit = 20) => {
    return retryRequest(async () => {
      const offset = lastKey || 0;
      const params = { limit, offset };
      
      const response = await apiClient.get('/vehicles', { params });
      const vehicles = response.data.vehicles || response.data.items || response.data;
      const totalCount = response.data.totalCount || vehicles.length;
      const hasMore = response.data.hasMore || (offset + vehicles.length < totalCount);
      
      return {
        items: vehicles,
        totalCount: totalCount,
        lastKey: hasMore ? offset + limit : null,
        hasMore: hasMore,
      };
    });
  },

  getById: async (id) => {
    return retryRequest(async () => {
      const response = await apiClient.get(`/vehicles/${id}`);
      return response.data;
    });
  },

  create: async (customer) => {
    const response = await apiClient.post('/vehicles', customer);
    return response.data;
  },

  update: async (id, customer) => {
    const response = await apiClient.put(`/vehicles/${id}`, customer);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  },

  search: async (query) => {
    return retryRequest(async () => {
      const response = await apiClient.get('/vehicles', { 
        params: { search: query }
      });
      return response.data.vehicles || response.data.items || response.data;
    });
  },

  filter: async (filters) => {
    return retryRequest(async () => {
      const response = await apiClient.get('/vehicles', { params: filters });
      return response.data.vehicles || response.data.items || response.data;
    });
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/vehicles/${id}`, { status });
    return response.data;
  },
};

export default apiClient;
