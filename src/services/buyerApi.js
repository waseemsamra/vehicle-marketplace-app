const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/dev';

export const buyerApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/buyers`);
    if (!response.ok) throw new Error('Failed to fetch buyers');
    const data = await response.json();
    return data.items || data || [];
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/buyers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch buyer');
    return response.json();
  },

  create: async (buyerData) => {
    const response = await fetch(`${API_URL}/buyers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyerData)
    });
    if (!response.ok) throw new Error('Failed to create buyer');
    return response.json();
  },

  update: async (id, buyerData) => {
    const response = await fetch(`${API_URL}/buyers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyerData)
    });
    if (!response.ok) throw new Error('Failed to update buyer');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/buyers/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete buyer');
    return response.json();
  }
};
