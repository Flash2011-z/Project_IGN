import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  authHeader,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  setStoredUser,
} from "../utils/auth";

const API_BASE = "http://localhost:4000";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();

  const [status, setStatus] = useState("checking");
  const [validatedUser, setValidatedUser] = useState(null);

  useEffect(() => {
    let active = true;

    async function validateAuth() {
      const token = getStoredToken();
      const localUser = getStoredUser();

      if (!token || !localUser?.id) {
        if (active) {
          setValidatedUser(null);
          setStatus("unauthenticated");
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: authHeader(),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data?.user?.id) {
          clearStoredUser();
          if (active) {
            setValidatedUser(null);
            setStatus("unauthenticated");
          }
          return;
        }

        setStoredUser(data.user);

        if (active) {
          setValidatedUser(data.user);
          setStatus("authenticated");
        }
      } catch {
        clearStoredUser();
        if (active) {
          setValidatedUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    validateAuth();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (status === "checking") {
    return <div className="container">Checking authentication...</div>;
  }

  if (status !== "authenticated" || !validatedUser?.id) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && validatedUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}