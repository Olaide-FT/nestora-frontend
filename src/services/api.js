import axios from "axios";
import { storage } from "../utils/storage";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const api = axios.create({ baseURL: `${apiBaseUrl}/api` });

api.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default api;
