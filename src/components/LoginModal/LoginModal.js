import React, { useState, useEffect } from "react";
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
import { authService } from "../../services/authService";
import loginBackground from "../../assets/images/vietnam-tg.png";

export default function LoginModal({
  onSwitchToRegister,
  onClose,
  onLoginSuccess,
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Auto focus email field on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const emailInput = document.getElementById("email");
      if (emailInput) emailInput.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
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

    // Simple validation
    if (!email) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

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
      <div className="mt-1 text-xs text-red-500 flex items-center">
        <FaExclamationCircle className="mr-1" /> {error}
      </div>
    ) : null;
  };

  return (
    <div className="flex items-stretch rounded-xl overflow-hidden max-w-5xl mx-auto shadow-xl">
      {/* Left side - Image */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="h-full w-full p-8 flex flex-col justify-end relative z-10">
          <h2 className="text-white text-4xl font-bold">
            Welcome to TripGuide
          </h2>
          <p className="text-white/90 mt-2 text-lg">
            Discover amazing destinations and plan your perfect getaway
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-white">
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-8 py-6 relative">
            <h1 className="text-white text-2xl font-bold">Sign In</h1>
            <p className="text-white text-sm mt-1 opacity-90">
              Access your TripGuide account
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors bg-white/10 rounded-full p-1 hover:bg-white/20"
                aria-label="Close"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="p-8 flex-grow flex flex-col">
            {formError && (
              <div className="mb-5 bg-red-50 text-red-700 p-3 rounded-lg flex items-start border border-red-100">
                <FaExclamationCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">{formError}</div>
                <button
                  className="ml-auto"
                  onClick={clearFormError}
                  aria-label="Close error message"
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
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm mb-6 hover:shadow"
            >
              <FcGoogle className="h-5 w-5 mr-3" />
              <span className="font-medium text-gray-700">
                Sign in with Google
              </span>
            </button>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail
                      className={`h-5 w-5 ${
                        focusedField === "email"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      } transition-colors duration-200`}
                    />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none transition-all duration-200 ${
                      focusedField === "email"
                        ? "border-emerald-600 shadow-sm ring-1 ring-emerald-200"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                {getFieldError("email")}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock
                      className={`h-5 w-5 ${
                        focusedField === "password"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      } transition-colors duration-200`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none transition-all duration-200 ${
                      focusedField === "password"
                        ? "border-emerald-600 shadow-sm ring-1 ring-emerald-200"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {getFieldError("password")}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleOpenForgotPassword}
                    className="text-sm text-emerald-700 hover:text-emerald-900 hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <div className="relative w-10 h-5 inline-flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="opacity-0 absolute w-0 h-0"
                    />
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-10 h-5 rounded-full shadow-inner ${
                        rememberMe ? "bg-emerald-500" : "bg-gray-300"
                      } transition-colors duration-200 cursor-pointer`}
                    >
                      <div
                        className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                          rememberMe ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="rememberMe"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="ml-2 block text-sm text-gray-700 select-none cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-emerald-800 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center font-medium shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
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
                    Sign In
                  </>
                )}
              </button>

              <div className="mt-6 text-center mt-auto">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-emerald-700 hover:text-emerald-900 hover:underline font-medium focus:outline-none transition-colors"
                  >
                    Sign up now
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
