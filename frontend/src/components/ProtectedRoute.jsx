import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user?.id) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}