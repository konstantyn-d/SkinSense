/**
 * API Client
 * 
 * Centralized HTTP client for backend API communication
 * Uses Axios with automatic auth token injection
 */

import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get auth store
    const authStore = useAuthStore()
    const token = authStore.accessToken

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message)
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Get auth store
      const authStore = useAuthStore()

      // Sign out user
      await authStore.signOut()

      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }

      return Promise.reject(error)
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred'
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    })
  }
)

// API methods

/**
 * GET request
 */
export const get = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message, status: error.status }
  }
}

/**
 * POST request
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message, status: error.status }
  }
}

/**
 * PATCH request
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.patch(url, data, config)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message, status: error.status }
  }
}

/**
 * PUT request
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message, status: error.status }
  }
}

/**
 * DELETE request
 */
export const del = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message, status: error.status }
  }
}

/**
 * Upload file (multipart/form-data)
 */
export const upload = async (url, formData, onUploadProgress = null) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress
    }

    const response = await apiClient.post(url, formData, config)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message, status: error.status }
  }
}

// Export default API client
export default {
  get,
  post,
  patch,
  put,
  delete: del,
  upload,
  // Direct access to axios instance if needed
  client: apiClient
}

