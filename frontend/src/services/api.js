import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000
})

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function getToken() {
  return sessionStorage.getItem('token')
}

function normalizeError(error) {
  const status = error.response?.status
  const message =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    'Erro inesperado'

  const normalized = new Error(message)
  normalized.status = status
  return normalized
}

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler()
    }

    return Promise.reject(normalizeError(error))
  }
)

export default api
