import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});


api.interceptors.request.use((config) => {
    
  const token = typeof window !== 'undefined' ? localStorage.getItem('flowly-token') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});