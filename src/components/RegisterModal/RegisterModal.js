import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaUser,
  FaLock,
  FaUserPlus,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import { useRegisterForm } from "./hooks/useRegisterForm";

export default function RegisterModal({
  onSwitchToLogin,
  onClose,
  onRegisterSuccess,
}) {
  // Sử dụng custom hook để xử lý form logic
  const {
    formik,
    isLoading,
    formError,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    clearFormError,
  } = useRegisterForm({ onSwitchToLogin, onRegisterSuccess });

  // Custom color scheme
  const primaryColor = "bg-[#2d7a61]";
  const primaryHoverColor = "hover:bg-[#236c53]";
  const primaryTextColor = "text-[#2d7a61]";
  const primaryFocusRing = "focus:ring-[#2d7a61]";
  const primaryBorderColor = "focus:border-[#2d7a61]";

  // Hàm tiện ích để hiển thị lỗi từ formik
  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="mt-1 text-xs text-red-500">
        {formik.errors[fieldName]}
      </div>
    ) : null;
  };

  // Hàm tạo class cho input field dựa vào tình trạng validation
  const getInputClass = (fieldName) => {
    const baseClass = `pl-10 pr-3 py-2.5 w-full border rounded-lg ${primaryFocusRing} focus:outline-none transition-colors`;

    return formik.touched[fieldName] && formik.errors[fieldName]
      ? `${baseClass} border-red-300 focus:border-red-500`
      : `${baseClass} border-gray-300 ${primaryBorderColor}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md animate-fadeIn">
      {/* Header */}
      <div className={`${primaryColor} px-6 py-5 relative`}>
        <h1 className="text-white text-xl font-bold">Đăng Ký</h1>
        <p className="text-white text-sm mt-1 opacity-90">Tạo tài khoản mới</p>
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

      {/* Form Container */}
      <div className="p-6 sm:p-8">
        {/* Error message */}
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

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Full Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("fullName")}
                placeholder="Nhập họ và tên của bạn"
              />
            </div>
            {getFieldError("fullName")}
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserPlus className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("username")}
                placeholder="Chọn tên đăng nhập"
              />
            </div>
            {getFieldError("username")}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("email")}
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>
            {getFieldError("email")}
          </div>

          {/* Password Field */}
          <div className="mb-4">
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
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${getInputClass("password")} pr-10`}
                placeholder="Tạo mật khẩu"
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
            {getFieldError("password") || (
              <div className="mt-1 text-xs text-gray-500">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và
                số
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${getInputClass("confirmPassword")} pr-10`}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {getFieldError("confirmPassword")}
          </div>

          {/* Register Button */}
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
                <FaUserPlus className="h-5 w-5 mr-2" />
                Đăng Ký
              </>
            )}
          </button>
        </form>

        {/* Toggle to Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={`${primaryTextColor} hover:underline font-medium focus:outline-none`}
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
