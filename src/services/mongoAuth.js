import axios from 'axios';

const API_BASE = (process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api')).replace(/\/$/, '');
const TOKEN_KEY = 'authToken';

const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

// Decode a (unsigned) JWT payload without a library — enough to read `role`.
const parseJwt = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const binary = atob(payload);
    const json = decodeURIComponent(
      binary
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

// Mirror the param shapes used by hooks/useAuth.js and Login.js.
const signup = async ({ username, password, options = {} } = {}) => {
  const attrs = options?.userAttributes || {};
  const email = username || attrs.email;
  const res = await api.post('/auth/signup', {
    username: email,
    email,
    password,
    role: attrs.role,
  });
  setToken(res.data.token);
  return res.data;
};

const signin = async ({ username, password } = {}) => {
  const res = await api.post('/auth/login', { username, password });
  setToken(res.data.token);
  return res.data;
};

const signout = () => {
  setToken(null);
  return Promise.resolve(true);
};

const getCurrentUser = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error('No session');
  const payload = parseJwt(token);
  if (!payload) throw new Error('Invalid session');
  return {
    username: payload.username || payload.sub,
    role: payload.role,
    exp: payload.exp,
  };
};

const confirmSignUp = async () => true; // MongoDB backend auto-confirms users
const fetchAuthSession = async () => ({
  tokens: { accessToken: { jwt: localStorage.getItem(TOKEN_KEY) } },
});

const authService = {
  signup,
  signin,
  signout,
  getCurrentUser,
  confirmSignUp,
  fetchAuthSession,
};

export { signup, signin, signout, getCurrentUser, confirmSignUp, fetchAuthSession };
export default authService;
