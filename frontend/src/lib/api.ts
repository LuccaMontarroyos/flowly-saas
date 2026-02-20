import axios from 'axios';
import { parseCookies, destroyCookie } from "nookies";

const { "flowly.token": token } = parseCookies();

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
});

if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        destroyCookie(undefined, "flowly.token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  });