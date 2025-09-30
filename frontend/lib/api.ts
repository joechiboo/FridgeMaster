import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
}

// Fridge API
export const fridgeApi = {
  getAll: () => api.get('/fridges'),
  getOne: (id: string) => api.get(`/fridges/${id}`),
  create: (data: { name: string }) => api.post('/fridges', data),
  delete: (id: string) => api.delete(`/fridges/${id}`),
}

// Item API
export const itemApi = {
  getAll: (fridgeId: string, params?: { category?: string; search?: string }) =>
    api.get(`/fridges/${fridgeId}/items`, { params }),
  getOne: (id: string) => api.get(`/items/${id}`),
  create: (fridgeId: string, data: any) =>
    api.post(`/fridges/${fridgeId}/items`, data),
  update: (id: string, data: any) => api.patch(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
  getExpiringSoon: (days?: number) =>
    api.get('/fridges/items/expiring-soon', { params: { days } }),
}
