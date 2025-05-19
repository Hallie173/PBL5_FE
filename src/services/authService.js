import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

const API_URL = `${BASE_URL}/auth`;

// Thiết lập interceptor để tự động gắn token xác thực
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để làm mới token khi access token hết hạn
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
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
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("data");
        alert("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
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

  // Lưu accessToken, refreshToken và user data
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
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data) {
        return saveUserData(response.data);
      }
      throw new Error("No data returned from login API");
    } catch (error) {
      handleApiError(error, "Đăng nhập thất bại");
    }
  },

  // Lấy thông tin người dùng hiện tại
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

  // Cập nhật thông tin người dùng
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

  // Kiểm tra đã xác thực chưa
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    return !!(token && refreshToken);
  },

  // Lấy token
  getToken: () => localStorage.getItem("token"),

  // Đăng xuất
  logout: async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        await axios.post(`${API_URL}/logout`, { userId: user.user_id });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    }
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
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

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Yêu cầu đặt lại mật khẩu thất bại");
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Đặt lại mật khẩu thất bại");
    }
  },

  // Đăng nhập với Google
  googleLogin: () => {
    window.location.href = `${API_URL}/google`;
  },
};
