import axios from 'axios';
import { decryptKey } from './bcrypt';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const encryptedToken = localStorage.getItem('_tth-auth-token');
      if (encryptedToken) {
        const decryptedToken = await decryptKey(encryptedToken);
        if (decryptedToken) {
          config.headers['Authorization'] = `Bearer ${decryptedToken}`;
        }
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default API;