import { useState } from "react";
import { useFormik } from "formik";
import { registerSchema, initialFormValues } from "../registerSchema";
import { authService } from "../../../services/authService";

export const useRegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra email đã tồn tại chưa

  // Sử dụng formik với yup schema
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: registerSchema,
    validateOnChange: false, // Chỉ validate khi submit hoặc blur
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setFormError("");

      try {
        const userData = {
          fullName: values.fullName,
          username: values.username,
          email: values.email,
          password: values.password,
        };

        // Gọi API đăng ký
        const response = await authService.register(userData);

        // Xử lý khi đăng ký thành công
        if (onRegisterSuccess) {
          onRegisterSuccess(response);
        } else {
          // Nếu không có callback thành công, chuyển sang màn hình đăng nhập
          onSwitchToLogin();
        }
      } catch (error) {
        setFormError(
          error.message || "Đăng ký không thành công. Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle hiển thị xác nhận mật khẩu
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Xử lý khi đóng thông báo lỗi
  const clearFormError = () => {
    setFormError("");
  };

  return {
    formik,
    isLoading,
    formError,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    clearFormError,
  };
};
