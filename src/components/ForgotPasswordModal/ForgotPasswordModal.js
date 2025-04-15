import React, { useEffect } from "react";
import { AlertCircle, ArrowLeft, Check, Loader2, X } from "lucide-react";
import { useForgotPasswordForm } from "./hooks/useforgotPasswordForm";

const ForgotPasswordModal = ({ onClose, onBackToLogin }) => {
  const {
    // Current step
    step,

    // Email form
    email,
    setEmail,
    emailLoading,
    emailSuccess,
    emailError,
    handleEmailSubmit,

    // Password form
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,
    passwordSuccess,
    passwordError,
    handlePasswordSubmit,

    // Navigation
    goToPasswordStep,
    goToEmailStep,
    redirectToHome,

    // Initialization
    initializeFromUrl,
  } = useForgotPasswordForm();

  // Kiểm tra token từ URL khi component được mount
  useEffect(() => {
    initializeFromUrl();
  }, [initializeFromUrl]);

  // Chuyển hướng khi đổi mật khẩu thành công
  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => {
        redirectToHome();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess, redirectToHome]);

  // Email Form Component
  const renderEmailForm = () => (
    <div className="p-6 rounded-lg shadow-lg bg-white w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt
        lại mật khẩu.
      </p>

      <form onSubmit={handleEmailSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Địa chỉ Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            disabled={emailLoading || emailSuccess}
          />
        </div>

        {emailError && (
          <div className="mb-4 flex items-center text-red-500">
            <AlertCircle className="mr-2" size={16} />
            <span>{emailError}</span>
          </div>
        )}

        {emailSuccess ? (
          <div className="mb-6 p-4 bg-green-50 rounded-md flex items-center text-green-700">
            <Check className="mr-2" size={20} />
            <span>
              Đã gửi liên kết đặt lại! Vui lòng kiểm tra email của bạn.
            </span>
          </div>
        ) : (
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium text-white ${
              emailLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={emailLoading}
          >
            {emailLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" size={16} />
                Đang gửi...
              </span>
            ) : (
              "Gửi liên kết đặt lại"
            )}
          </button>
        )}
      </form>

      {/* Back to login button */}
      {onBackToLogin && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onBackToLogin}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1" />
            Quay lại đăng nhập
          </button>
        </div>
      )}
    </div>
  );

  // Password Form Component
  const renderNewPasswordForm = () => (
    <div className="p-6 rounded-lg shadow-lg bg-white w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Đặt mật khẩu mới</h2>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Vui lòng nhập và xác nhận mật khẩu mới của bạn.
      </p>

      <form onSubmit={handlePasswordSubmit}>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            disabled={passwordLoading || passwordSuccess}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            disabled={passwordLoading || passwordSuccess}
          />
        </div>

        {passwordError && (
          <div className="mb-4 flex items-center text-red-500">
            <AlertCircle className="mr-2" size={16} />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess ? (
          <div className="mb-6 p-4 bg-green-50 rounded-md flex items-center text-green-700">
            <Check className="mr-2" size={20} />
            <span>
              Mật khẩu đã được đặt lại thành công! Bạn sẽ được chuyển về trang
              chủ trong giây lát.
            </span>
          </div>
        ) : (
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium text-white ${
              passwordLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={passwordLoading}
          >
            {passwordLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" size={16} />
                Đang cập nhật...
              </span>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        )}
      </form>
    </div>
  );

  // Render the appropriate form based on the current step
  return <>{step === "email" ? renderEmailForm() : renderNewPasswordForm()}</>;
};

export default ForgotPasswordModal;
