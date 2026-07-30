import axios from "axios";

// Central axios instance so every request goes to the same backend URL
const api = axios.create({
  baseURL: "https://study-sphere-kkvm-ten.vercel.app/",
});

// Interceptor: automatically attach the saved JWT (if any) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
