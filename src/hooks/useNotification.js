import { useState, useRef } from "react";
import { Alert } from "@mui/material";

const useNotification = () => {
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const timeoutRef = useRef(null);

  const showSuccess = (message) => {
    if (notification.message === message) return; // Prevent duplicate notifications
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setNotification({ message, severity: "success" });
    timeoutRef.current = setTimeout(
      () => setNotification({ message: "", severity: "" }),
      3000
    );
  };

  const showError = (message) => {
    if (notification.message === message) return; // Prevent duplicate notifications
    setNotification({ message, severity: "error" });
  };

  const Notification = () =>
    notification.message ? (
      <Alert
        severity={notification.severity}
        sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}
        onClose={() => setNotification({ message: "", severity: "" })}
      >
        {notification.message}
      </Alert>
    ) : null;

  return { showSuccess, showError, Notification };
};

export default useNotification;
