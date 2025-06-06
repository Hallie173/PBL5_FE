import React from "react";
import { Navigate } from "react-router-dom";
import Unauthorized from "../Unauthorized/Unauthorized";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoggedIn } = useAuth();

  // Check both authentication status and token
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Check role if required
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Unauthorized />;
  }

  return children;
};

export default ProtectedRoute;
