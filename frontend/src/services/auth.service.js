import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser   = (data) => API.post('/auth/login', data)
export const getMe       = ()     => API.get('/auth/me')

export default API
