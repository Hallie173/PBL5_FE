// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response) {
        const userData = authService.getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Tự động tải thông tin người dùng từ localStorage khi component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng context
export const useAuth = () => {
  return useContext(AuthContext);
};
