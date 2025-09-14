// API configuration and base setup
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/lib/types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (will be updated in Step 2 with Clerk)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error('Full API Error:', error);

    if (error.response) {
      const errorData = error.response.data;
      console.error('API Response Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        dataType: typeof errorData,
        data: errorData
      });

      // Try to extract meaningful error message
      try {
        if (typeof errorData === 'string') {
          console.error('Error message (string):', errorData);
        } else if (errorData && typeof errorData === 'object') {
          console.error('Error message (object):', JSON.stringify(errorData, null, 2));
        }
      } catch (e) {
        console.error('Could not parse error data:', e);
      }

      // Log response headers which might contain useful info
      console.error('Response headers:', error.response.headers);

    } else if (error.request) {
      console.error('API Request Error (no response):', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.code === 'ECONNABORTED' ? 'Request timed out' : 'No response',
        request: error.request
      });
    } else {
      console.error('API Setup Error:', error.message);
    }

    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export class ApiService {
  static async get<T>(
    endpoint: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  static async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    // If data is FormData, don't set Content-Type to let browser handle boundary
    const finalConfig = { ...config };
    if (data instanceof FormData && finalConfig.headers) {
      delete finalConfig.headers['Content-Type'];
    }

    const response = await apiClient.post<ApiResponse<T>>(endpoint, data, finalConfig);
    return response.data;
  }

  static async put<T>(
    endpoint: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  static async patch<T>(
    endpoint: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  static async delete<T>(
    endpoint: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  // File upload method
  static async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await apiClient.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Multiple files upload
  static async uploadFiles<T>(
    endpoint: string,
    files: File[],
    additionalData?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await apiClient.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
}

// Export the configured axios instance for direct use if needed
export { apiClient };
export default ApiService;
