import { API_ENDPOINTS } from '../config/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const customerService = {
  getAll: async () => {
    const response = await fetch(API_ENDPOINTS.CUSTOMERS);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(API_ENDPOINTS.CUSTOMER_BY_ID(id));
    return handleResponse(response);
  },

  create: async (customer) => {
    const response = await fetch(API_ENDPOINTS.CUSTOMERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse(response);
  },

  update: async (id, customer) => {
    const response = await fetch(API_ENDPOINTS.CUSTOMER_BY_ID(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(API_ENDPOINTS.CUSTOMER_BY_ID(id), {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
