import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

const API_URL = `${BASE_URL}/auth`;

// Thiết lập Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Quản lý hàng đợi khi làm mới token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor làm mới token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await axios.post(`${API_URL}/refresh`, {
          refreshToken,
        });
        const { accessToken } = response.data;
        localStorage.setItem("token", accessToken);
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("data");
        alert("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Các hàm hỗ trợ
const saveUserData = (data) => {
  if (!data?.user || !data.accessToken || !data.refreshToken) {
    throw new Error(
      "Invalid API response: Missing user, accessToken, or refreshToken"
    );
  }

  const userData = {
    user_id: data.user.user_id,
    username: data.user.username || "unknown",
    email: data.user.email || "",
    full_name: data.user.fullName || "",
    avatar_url: data.user.avatar || "",
    role: data.user.role || "user",
    created_at: data.user.joinedAt || new Date().toISOString(),
    bio: data.user.bio || null,
  };

  if (!userData.user_id) {
    throw new Error("User ID is missing in API response");
  }

  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("data", JSON.stringify(userData));
  return userData;
};

const handleApiError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.error || defaultMessage;
  throw new Error(errorMessage);
};

// Dịch vụ xác thực
export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/login", { email, password });
      if (response.data) {
        return saveUserData(response.data);
      }
      throw new Error("No data returned from login API");
    } catch (error) {
      handleApiError(error, "Đăng nhập thất bại");
    }
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem("data");
    if (!userData) {
      return null;
    }

    try {
      const parsedData = JSON.parse(userData);
      return {
        user_id: parsedData.user_id,
        username: parsedData.username,
        email: parsedData.email,
        full_name: parsedData.full_name,
        avatar_url: parsedData.avatar_url,
        role: parsedData.role,
        created_at: parsedData.created_at,
        bio: parsedData.bio || null,
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  setCurrentUser: (userData) => {
    const normalizedData = {
      user_id: userData.user_id,
      username: userData.username || "unknown",
      email: userData.email || "",
      full_name: userData.full_name || "",
      avatar_url: userData.avatar_url || "",
      role: userData.role || "user",
      created_at: userData.created_at || new Date().toISOString(),
      bio: userData.bio || null,
    };
    localStorage.setItem("data", JSON.stringify(normalizedData));
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    return !!(token && refreshToken);
  },

  getToken: () => localStorage.getItem("token"),

  logout: async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        await apiClient.post("/logout", { userId: user.user_id });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    }
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post("/register", {
        fullName: userData.full_name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || "user",
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Đăng ký thất bại");
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/forgot-password", { email });
      return response.data;
    } catch (error) {
      handleApiError(error, "Yêu cầu đặt lại mật khẩu thất bại");
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await apiClient.post(`/reset-password/${token}`, {
        password,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Đặt lại mật khẩu thất bại");
    }
  },

  googleLogin: () => {
    window.location.href = `${API_URL}/google`;
  },
};

export default apiClient;
