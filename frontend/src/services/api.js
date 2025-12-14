import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data)
};

// Plans API
export const plansAPI = {
  getAll: async () => {
    // Make request with optional token
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/plans', config);
  },
  getMyPlans: () => api.get('/plans?myPlans=true'),
  getById: (id) => api.get(`/plans/${id}`)
};

// Subscriptions API
export const subscriptionsAPI = {
  subscribe: (planId) => api.post(`/subscriptions/${planId}`),
  getMySubscriptions: () => api.get('/subscriptions/my-subscriptions')
};

// Follows API
export const followsAPI = {
  follow: (trainerId) => api.post(`/follows/${trainerId}`),
  unfollow: (trainerId) => api.delete(`/follows/${trainerId}`),
  getMyFollows: () => api.get('/follows/my-follows'),
  checkFollow: (trainerId) => api.get(`/follows/check/${trainerId}`)
};

// Feed API
export const feedAPI = {
  getFeed: () => api.get('/feed')
};

// Trainers API
export const trainersAPI = {
  getTrainer: (trainerId) => api.get(`/trainers/${trainerId}`)
};

export default api;
