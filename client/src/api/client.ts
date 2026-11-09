import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/dailymotion';

export function createClient(baseURL = API_BASE): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 20000,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.error ??
        error.response?.statusText ??
        error.message ??
        'An unexpected error occurred';
      return Promise.reject(new Error(message));
    }
  );

  return client;
}
