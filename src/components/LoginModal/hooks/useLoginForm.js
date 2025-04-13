import { useState } from "react";
import { useFormik } from "formik";
import { loginSchema, initialFormValues } from "../loginSchema";
import { authService } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

export const useLoginForm = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Formik setup for email/password login
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setFormError("");

      try {
        const response = await authService.login(values.email, values.password);
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }
        if (onClose) {
          onClose(); // Close the modal
        }
        navigate("/", { replace: true }); // Redirect to main screen
      } catch (error) {
        setFormError(
          error.message ||
            "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Trigger Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setFormError("");
    try {
      await authService.googleLogin();
      // Lưu ý: Không cần set isLoading = false ở đây vì
      // chúng ta sẽ chuyển hướng đến trang Google Auth
    } catch (error) {
      setFormError(error.message || "Không thể khởi động đăng nhập Google.");
      setIsLoading(false);
    }
  };

  // Clear form error
  const clearFormError = () => {
    setFormError("");
  };

  return {
    formik,
    isLoading,
    formError,
    showPassword,
    togglePasswordVisibility,
    handleGoogleLogin,
    clearFormError,
  };
};
