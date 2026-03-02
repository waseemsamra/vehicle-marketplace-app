const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/dev';

export const sellerApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/sellers`);
    if (!response.ok) throw new Error('Failed to fetch sellers');
    const data = await response.json();
    return data.items || data || [];
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/sellers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch seller');
    return response.json();
  },

  create: async (sellerData) => {
    const response = await fetch(`${API_URL}/sellers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sellerData)
    });
    if (!response.ok) throw new Error('Failed to create seller');
    return response.json();
  },

  update: async (id, sellerData) => {
    const response = await fetch(`${API_URL}/sellers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sellerData)
    });
    if (!response.ok) throw new Error('Failed to update seller');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/sellers/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete seller');
    return response.json();
  }
};
