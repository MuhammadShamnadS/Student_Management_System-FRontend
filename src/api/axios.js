import axios from "axios";

// Create Axios instance
const instance = axios.create({
  baseURL: "http://localhost:8000", // Django backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("http://localhost:8000/api/token/refresh", {
          refresh: refreshToken,
        });
        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
