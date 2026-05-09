import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pb_token');
      localStorage.removeItem('pb_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
};

// Users
export const usersApi = {
  me: () => api.get('/users/me').then((r) => r.data),
  admins: () => api.get('/users/admins').then((r) => r.data),
  tenants: () => api.get('/users/tenants').then((r) => r.data),
  all: () => api.get('/users').then((r) => r.data),
};

// Messages
export const messagesApi = {
  send: (data) => api.post('/messages', data).then((r) => r.data),
  threads: () => api.get('/messages/threads').then((r) => r.data),
  thread: (threadId) => api.get(`/messages/thread/${threadId}`).then((r) => r.data),
  markRead: (messageId) => api.patch('/messages/read', { messageId }).then((r) => r.data),
};

// Maintenance
export const maintenanceApi = {
  create: (data) => api.post('/maintenance', data).then((r) => r.data),
  list: () => api.get('/maintenance').then((r) => r.data),
  get: (id) => api.get(`/maintenance/${id}`).then((r) => r.data),
  update: (id, data) => api.patch(`/maintenance/${id}`, data).then((r) => r.data),
  stats: () => api.get('/maintenance/stats').then((r) => r.data),
};

export default api;
