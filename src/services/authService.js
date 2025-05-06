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
  // console.log("API response data:", data); // Debug API response
  if (!data?.user || !data.token) {
    throw new Error("Invalid API response: Missing user or token");
  }

  const userData = {
    user_id: data.user.user_id,
    username: data.user.username || "unknown",
    email: data.user.email || "",
    full_name: data.user.fullName || data.user.full_name || "",
    avatar_url: data.user.avatar || data.user.avatar_url || "",
    role: data.user.role || "user",
    created_at:
      data.user.joinedAt || data.user.created_at || new Date().toISOString(),
    bio: data.user.bio || {},
  };

  if (!userData.user_id) {
    throw new Error("User ID is missing in API response");
  }

  // Lưu token và user data
  localStorage.setItem("token", data.token);
  localStorage.setItem("data", JSON.stringify(userData));
  // console.log("Saved userData:", userData); // Debug saved data
  return userData;
};

const handleApiError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
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
    console.log("Raw userData from localStorage:", userData);
    if (!userData) {
      console.log("No user data in localStorage");
      return null;
    }

    try {
      const parsedData = JSON.parse(userData);
      console.log("Parsed userData:", parsedData);

      // Kiểm tra nếu dữ liệu từ Google auth
      if (parsedData.token && parsedData.user) {
        return {
          user_id: parsedData.user.id || parsedData.user.user_id,
          username: parsedData.user.username || "unknown",
          email: parsedData.user.email || "",
          full_name:
            parsedData.user.full_name || parsedData.user.fullName || "",
          avatar_url:
            parsedData.user.avatar || parsedData.user.avatar_url || "",
          role: parsedData.user.role || "user",
          created_at:
            parsedData.user.created_at ||
            parsedData.user.joinedAt ||
            new Date().toISOString(),
          bio: parsedData.user.bio || {},
        };
      }

      // Dữ liệu từ đăng nhập thông thường
      return {
        ...parsedData,
        bio: parsedData.bio || {},
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },
  // Cập nhật thông tin người dùng
  setCurrentUser: (userData) => {
    const normalizedData = {
      ...userData,
      bio: userData.bio || {},
    };
    localStorage.setItem("data", JSON.stringify(normalizedData));
    // console.log("Updated userData in localStorage:", normalizedData); // Debug
  },

  // Kiểm tra đã xác thực chưa
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (token) return true;
    const data = localStorage.getItem("data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        return !!parsedData.token;
      } catch (error) {
        console.error("Error parsing data for token:", error);
        return false;
      }
    }
    return false;
  },
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
