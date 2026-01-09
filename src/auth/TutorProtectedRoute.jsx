// // src/auth/TutorProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import useTutorStore from "../store/tutorStore";

// export default function TutorProtectedRoute() {
//   const { checkTutorAuth, isAuthenticated, tutor } = useTutorStore();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         console.log("🔐 Checking tutor authentication...");
//         const isAuth = await checkTutorAuth();
//         console.log("✅ Auth check result:", isAuth);
//       } catch (error) {
//         console.error("❌ Auth check error:", error);
//       } finally {
//         setChecking(false);
//       }
//     };
//     verify();
//   }, [checkTutorAuth]);

//   // 🔹 While verifying auth, show loading spinner
//   if (checking) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-background">
//         <div className="text-center space-y-4">
//           <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
//           <p className="text-muted-foreground">Verifying tutor credentials...</p>
//         </div>
//       </div>
//     );
//   }

//   // 🔹 If not authenticated after checking → redirect to tutor login
//   if (!isAuthenticated || !tutor) {
//     console.log("❌ Not authenticated as tutor, redirecting to /tutor/login");
//     return <Navigate to="/tutor/login" replace />;
//   }

//   console.log("✅ Tutor authenticated:", tutor.email);

//   // 🔹 Otherwise, show the protected content
//   return <Outlet />;
// }




// src/auth/TutorProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import useTutorStore from "../store/tutorStore";

export default function TutorProtectedRoute() {
  const { checkTutorAuth, isAuthenticated, tutor, accessToken } = useTutorStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        // Skip auth check if already authenticated and have user data
        if (isAuthenticated && tutor && accessToken) {
          console.log("✅ Already authenticated, skipping auth check");
          setChecking(false);
          return;
        }

        console.log("🔐 Checking tutor authentication...");
        const isAuth = await checkTutorAuth();
        console.log("✅ Auth check result:", isAuth);
      } catch (error) {
        console.error("❌ Auth check error:", error);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []); // Empty deps to run only once

  // 🔹 While verifying auth, show loading spinner
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

  // 🔹 If not authenticated after checking → redirect to tutor login
  if (!isAuthenticated || !tutor) {
    console.log("❌ Not authenticated as tutor, redirecting to /tutor/login");
    return <Navigate to="/tutor/login" replace />;
  }

  console.log("✅ Tutor authenticated:", tutor.email || tutor.firstName);

  // 🔹 Otherwise, show the protected content
  return <Outlet />;
}