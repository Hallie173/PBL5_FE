import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { registerSchema, initialFormValues } from "../registerSchema";
import { authService } from "../../../services/authService";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";

export const useRegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setIsCitiesLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/cities`);
        setCities(response.data);
      } catch (error) {
        setFormError(
          "Không thể tải danh sách thành phố. Vui lòng thử lại sau."
        );
      } finally {
        setIsCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: registerSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setFormError("");

      try {
        const userData = {
          fullName: values.fullName, // Changed to fullName
          username: values.username,
          email: values.email,
          password: values.password,
          bio: {
            currentCity: values.currentCity,
            about: "",
            website: "",
            location_preferences: [],
          },
        };

        const response = await authService.register(userData);
        onRegisterSuccess(response);
      } catch (error) {
        setFormError(
          error.message || "Đăng ký không thành công. Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

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
    cities,
    isCitiesLoading,
  };
};
