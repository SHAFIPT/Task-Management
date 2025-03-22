  import axios, { AxiosError } from "axios";

  // Get the API URL from environment
  const API_URL = import.meta.env.VITE_API_URL;

  // Ensure the base URL is properly formatted
  const normalizeBaseURL = (url: string) => {
    if (!url) {
      throw new Error("API_URL is not defined in environment variables");
    }

    const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;

    try {
      new URL(cleanUrl);
    } catch (error) {
        console.error(error)
      throw new Error(
        `Invalid API_URL: ${url}. URL must include protocol (e.g., http:// or https://)`
      );
    }

    return cleanUrl;
  };

  // Create axios instance with normalized base URL
  export const axiosInstance = axios.create({
    baseURL: normalizeBaseURL(API_URL),
    withCredentials: true,
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await getNewAccessToken();
          
          if (!newAccessToken) {
            return Promise.reject(error);
          }

          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token Refresh Failed:', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  async function getNewAccessToken() {
  try {
    // Log the API URL to debug
    console.log('Attempting to refresh token at:', `${normalizeBaseURL(API_URL)}/api/auth/refresh-token`);
    
    const response = await axios.get(
      `${normalizeBaseURL(API_URL)}/api/auth/refresh-token`,
      { withCredentials: true }
    );
    
    console.log('Refresh Token Response:', response.data);
    
    if (!response.data?.data?.accessToken) {
      throw new Error("No access token received from refresh token endpoint");
    }

    return response.data.data.accessToken;
  } catch (error: unknown) {
  const err = error as AxiosError;  // 👈 Type assertion

  console.error("Token refresh error:", err);

  if (err.response) {
    console.error("Server responded with:", err.response.status, err.response.data);
  }

  throw new Error(`Failed to refresh token. Please check API_URL: ${API_URL}`);
}
}
