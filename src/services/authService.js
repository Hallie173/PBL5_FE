import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("data", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi khi đăng nhập" };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi khi đăng ký" };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi khi gửi yêu cầu" };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        message: "Đã xảy ra lỗi khi đặt lại mật khẩu",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("data");
    window.location.href = "/";
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("data"));
  },

  // Updated Google login to handle the full flow
  googleLogin: async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = `${API_URL}/google`;
    } catch (error) {
      throw { message: "Không thể khởi động đăng nhập Google" };
    }
  },
};