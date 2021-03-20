
import axios from 'axios';
import { getToken } from "./auth";

const api = axios.create({
  baseURL: 'https://diversify.app.br/api',
});

api.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
      config.headers.Authorization = `${token}`;
  }
  return config;
});

export default api;