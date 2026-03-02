const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/prod';

export const API_ENDPOINTS = {
  CUSTOMERS: `${API_BASE_URL}/vehicles`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/vehicles/${id}`,
};

export default API_BASE_URL;
