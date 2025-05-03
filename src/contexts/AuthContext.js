import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      if (userData && userData.user_id) {
        setUser(userData);
        setIsLoggedIn(true);
        console.log("Logged in user:", userData); // Debug
        return userData;
      }
      throw new Error("Invalid user data from login");
    } catch (error) {
      console.error("Login error:", error);
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
    console.log("Current user from localStorage:", currentUser); // Debug
    if (currentUser && currentUser.user_id) {
      setUser(currentUser);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
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
