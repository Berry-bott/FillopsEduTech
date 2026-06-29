// src/auth/AdminProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAdminAuthStore from "@/store/adminAuthStore";
import { Loader2 } from "lucide-react";

export default function AdminProtectedRoute() {
  const { isAuthenticated, loading, checkAuth, accessToken } = useAdminAuthStore();
  const location = useLocation();

  // Local state to track if we finished verification
  const [verificationDone, setVerificationDone] = useState(!!accessToken && isAuthenticated);

  // Debug logs
  useEffect(() => {
    console.log("[AdminProtectedRoute] Render cycle", {
      pathname: location.pathname,
      isAuthenticated,
      loading,
      hasToken: !!accessToken,
      verificationDone,
    });
  }, [isAuthenticated, loading, accessToken, verificationDone, location.pathname]);

  // Only verify if we don't already trust the persisted state
  useEffect(() => {
    // If we already have token + marked authenticated → trust it, no need to block
    if (accessToken && isAuthenticated) {
      console.log("[AdminProtectedRoute] Trusting persisted authenticated state");
      setVerificationDone(true);
      return;
    }

    // Otherwise — verify in background
    if (!loading && !verificationDone) {
      console.log("[AdminProtectedRoute] Starting background auth verification");
      checkAuth().finally(() => {
        setVerificationDone(true);
      });
    }
  }, [accessToken, isAuthenticated, loading, checkAuth, verificationDone]);

  // Show loading only during actual verification (not on trusted refresh)
  if (!verificationDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-14 h-14 animate-spin text-primary mb-6" />
        <p className="text-lg font-medium text-muted-foreground">
          Verifying session...
        </p>
      </div>
    );
  }

  // After verification — decide
  if (!isAuthenticated) {
    console.log("[AdminProtectedRoute] Not authenticated after check → redirect to login");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log("[AdminProtectedRoute] Access granted → rendering dashboard");
  return <Outlet />;
}