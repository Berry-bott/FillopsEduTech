
// src/auth/TutorProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import useTutorAuthStore from "../store/tutorAuthStore";

export default function TutorProtectedRoute() {
  const isAuthenticated = useTutorAuthStore((state) => state.isAuthenticated);
  const tutor = useTutorAuthStore((state) => state.tutor); // ✅ Also get tutor
  const checkTutorAuth = useTutorAuthStore((state) => state.checkTutorAuth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      console.log("🔐 Starting tutor auth check...");
      console.log("📍 Current state - isAuth:", isAuthenticated, "tutor:", !!tutor);
      
      // Skip check if already authenticated with valid tutor data
      if (isAuthenticated && tutor) {
        console.log("✅ Already authenticated with tutor data, skipping check");
        if (mounted) setChecking(false);
        return;
      }

      const result = await checkTutorAuth();
      console.log("✅ Auth check completed:", result);
      
      if (mounted) setChecking(false);
    };

    verify();

    return () => {
      mounted = false;
    };
  }, []); // ✅ Empty deps - only run on mount

  console.log("🎬 Render state:", { checking, isAuthenticated, hasTutor: !!tutor });

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying tutor credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !tutor) { // ✅ Check both
    console.log("❌ Not authenticated or no tutor data, redirecting");
    return <Navigate to="/tutor/login" replace />;
  }

  console.log("✅ Authenticated with tutor data, showing content");
  return <Outlet />;
}