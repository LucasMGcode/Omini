import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// interceptor para token / erros globais
api.interceptors.response.use(
  (r) => r,
  (error) => {
    console.error('API error', error.response);
    return Promise.reject(error);
  }
);
