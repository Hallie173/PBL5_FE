import { useState, useCallback, useEffect } from "react";
import { emailSchema, passwordSchema } from "../forgotPasswordSchema";
import { authService } from "../../../services/authService";

export const useForgotPasswordForm = () => {
  // Form states
  const [step, setStep] = useState("email"); // 'email' or 'new-password'

  // Token for password reset
  const [resetToken, setResetToken] = useState("");

  // Email form states
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Password form states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Email submission handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // Reset previous errors
      setEmailError("");

      // Validate with Yup
      await emailSchema.validate({ email }, { abortEarly: false });

      setEmailLoading(true);

      // Call API
      await authService.forgotPassword(email);
      setEmailSuccess(true);
    } catch (error) {
      if (error.name === "ValidationError") {
        setEmailError(error.errors[0]);
      } else if (error.message) {
        // Handle API error message
        setEmailError(error.message);
      } else {
        setEmailError("Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // Password submission handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      // Reset previous errors
      setPasswordError("");

      // Validate with Yup
      await passwordSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );

      setPasswordLoading(true);

      // Call API to reset the password
      await authService.resetPassword(resetToken, password);
      setPasswordSuccess(true);
    } catch (error) {
      if (error.name === "ValidationError") {
        setPasswordError(error.errors[0]);
      } else if (error.message) {
        // Handle API error message
        setPasswordError(error.message);
      } else {
        setPasswordError("Đã xảy ra lỗi khi đặt lại mật khẩu");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Extract token from URL for direct access to reset page
  const initializeFromUrl = useCallback(() => {
    // Check if we're on a reset password page with a token
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setStep("new-password");
      // Optional: validate token with a backend API call here
    }
  }, []);

  // Effect to initialize from URL automatically
  useEffect(() => {
    initializeFromUrl();
  }, [initializeFromUrl]);

  // Step control
  const goToPasswordStep = () => setStep("new-password");
  const goToEmailStep = () => setStep("email");

  // Function to redirect to home page
  const redirectToHome = useCallback(() => {
    window.location.href = "http://localhost:3000/";
  }, []);

  return {
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
  };
};
