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

// Các hàm hỗ trợ
const saveUserData = (data) => {
  // Lưu token
  localStorage.setItem("token", data.token);

  // Chuẩn hóa cấu trúc dữ liệu người dùng
  const userData = {
    user_id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    full_name: data.user.fullName,
    avatar_url: data.user.avatar,
    role: data.user.role,
    created_at: data.user.joinedAt,
    bio: data.user.bio || {},
  };

  localStorage.setItem("data", JSON.stringify(userData));
  return userData;
};

const handleApiError = (error, defaultMessage) => {
  throw error.response?.data || { message: defaultMessage };
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
        saveUserData(response.data);
      }
      return response.data;
    } catch (error) {
      handleApiError(error, "Đăng nhập thất bại");
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    const userData = localStorage.getItem("data");
    if (!userData) return null;

    const user = JSON.parse(userData);
    return {
      ...user,
      bio: user.bio || {},
    };
  },

  // Cập nhật thông tin người dùng
  setCurrentUser: (userData) => {
    const normalizedData = {
      ...userData,
      bio: userData.bio || {},
    };
    localStorage.setItem("data", JSON.stringify(normalizedData));
  },

  // Kiểm tra đã xác thực chưa
  isAuthenticated: () => !!localStorage.getItem("token"),

  // Lấy token
  getToken: () => localStorage.getItem("token"),

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    window.location.href = "/";
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
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
