import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
} from 'axios';
import { ENV } from '../config/env';
import { type ApiError } from '../types/api.types';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Configurar interceptores
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        // ✨ MODIFICAR: Agregar token JWT automáticamente
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError<ApiError>) => {
        // Manejar errores de timeout
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          const timeoutError: ApiError = {
            message: 'La petición ha excedido el tiempo límite',
            statusCode: 408,
            error: 'Request Timeout',
          };
          return Promise.reject(timeoutError);
        }

        // Manejar error 401 (no autorizado)
        if (error.response?.status === 401) {
          // Limpiar autenticación y redirigir al login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }

        // Construir error detallado
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Error en la petición',
          statusCode: error.response?.status || 500,
          error: error.response?.data?.error,
        };
        
        // Log para debugging (solo en desarrollo)
        if (import.meta.env.DEV) {
          console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: apiError.message,
            error: apiError.error,
            data: error.response?.data
          });
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  // Métodos HTTP
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

// Exportar instancia única
export const apiService = new ApiService();
