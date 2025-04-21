// src/components/LoginModal/LoginModal.js
import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../contexts/AuthContext";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";
import { authService } from "../../services/authService"; // Import authService
export default function LoginModal({
  onSwitchToRegister,
  onClose,
  onLoginSuccess,
}) {
  const { login } = useAuth(); // Sử dụng hàm login từ AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    // Gọi hàm googleLogin từ authService
    authService.googleLogin();
  };

  const clearFormError = () => {
    setFormError(null);
  };

  const handleOpenForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response) {
        onLoginSuccess(response);
        onClose();
      }
    } catch (error) {
      setFormError(
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu modal quên mật khẩu được hiển thị, render nó thay vì form đăng nhập
  if (showForgotPassword) {
    return (
      <ForgotPasswordModal
        onClose={handleCloseForgotPassword}
        onBackToLogin={handleCloseForgotPassword}
      />
    );
  }

  const getFieldError = (fieldName) => {
    let error = null;
    if (fieldName === "email" && !email) {
      error = "Email là bắt buộc.";
    } else if (fieldName === "password" && !password) {
      error = "Mật khẩu là bắt buộc.";
    }
    return error ? (
      <div className="mt-1 text-xs text-red-500">{error}</div>
    ) : null;
  };

  const getInputClass = (fieldName) => {
    const baseClass = `pl-10 pr-3 py-2.5 w-full border rounded-lg focus:ring-[#2d7a61] focus:outline-none transition-colors`;
    const error = getFieldError(fieldName);
    return error
      ? `${baseClass} border-red-300 focus:border-red-500`
      : `${baseClass} border-gray-300 focus:border-[#2d7a61]`;
  };

  const primaryColor = "bg-[#2d7a61]";
  const primaryHoverColor = "hover:bg-[#236c53]";
  const primaryTextColor = "text-[#2d7a61]";
  const primaryFocusRing = "focus:ring-[#2d7a61]";
  const primaryBorderColor = "focus:border-[#2d7a61]";

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md animate-fadeIn">
      <div className={`${primaryColor} px-6 py-5 relative`}>
        <h1 className="text-white text-xl font-bold">Sign In</h1>
        <p className="text-white text-sm mt-1 opacity-90">
          Welcome to TripGuide!
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Đóng"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {formError && (
          <div className="mb-5 bg-red-50 text-red-700 p-3 rounded-lg flex items-start border border-red-100">
            <FaExclamationCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">{formError}</div>
            <button
              className="ml-auto"
              onClick={clearFormError}
              aria-label="Đóng thông báo lỗi"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm mb-6 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FcGoogle className="h-5 w-5 mr-3" />
          <span className="font-medium text-gray-700">
            Đăng nhập bằng Google
          </span>
        </button>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">Hoặc</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={getInputClass("email")}
                placeholder="Nhập email"
              />
            </div>
            {getFieldError("email")}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${getInputClass("password")} pr-10`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {getFieldError("password")}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleOpenForgotPassword}
                className={`text-sm ${primaryTextColor} hover:underline font-medium`}
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={false} // Bạn có thể quản lý trạng thái này nếu cần
                onChange={() => {}}
                className={`h-4 w-4 rounded border-gray-300 ${primaryTextColor} ${primaryFocusRing}`}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Duy trì đăng nhập
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${primaryColor} text-white py-2.5 px-4 rounded-lg ${primaryHoverColor} focus:outline-none focus:ring-2 ${primaryFocusRing} focus:ring-offset-2 transition-colors flex items-center justify-center font-medium shadow-sm ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <FaSignInAlt className="h-5 w-5 mr-2" />
                Đăng Nhập
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={`${primaryTextColor} hover:underline font-medium focus:outline-none`}
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
