import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { appConfig } from "../config/appConfig";
import { getAccessToken, clearTokens } from "../utils/storage";

const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ── Request interceptor – attach JWT ──────────────── */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor – handle 401 ─────────────── */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearTokens();
      // Navigation to login is handled by AuthContext listener
    }
    return Promise.reject(error);
  }
);

export default api;
