import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔍 Token from localStorage:", token ? "Token exists" : "No token found");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set:", config.headers.Authorization);
    } else {
      console.log("❌ No token found, Authorization header not set");
    }
    
    console.log("📤 Request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("📥 Response received:", response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("🚫 Unauthorized - Token might be invalid or expired");
      // Optionally clear token and redirect to login
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    console.error("❌ Response error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
