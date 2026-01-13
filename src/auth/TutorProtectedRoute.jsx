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




// // src/auth/TutorProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import useTutorAuthStore from "../store/tutorAuthStore";

// export default function TutorProtectedRoute() {
//   const { checkTutorAuth, isAuthenticated, tutor, accessToken } = useTutorAuthStore();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         // Skip auth check if already authenticated and have user data
//         if (isAuthenticated && tutor && accessToken) {
//           console.log("✅ Already authenticated, skipping auth check");
//           setChecking(false);
//           return;
//         }

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

//   console.log("✅ Tutor authenticated:", tutor.email || tutor.firstName);

//   // 🔹 Otherwise, show the protected content
//   return <Outlet />;
// }



// // src/auth/TutorProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import useTutorAuthStore from "../store/tutorAuthStore";

// export default function TutorProtectedRoute() {
//   const { checkTutorAuth, isAuthenticated } = useTutorAuthStore();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const verify = async () => {
//       await checkTutorAuth(); // 🧠 Ask backend if token is still valid
//       setChecking(false);
//     };
//     verify();
//   }, []);

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
//   if (!isAuthenticated) {
//     return <Navigate to="/tutor/login" replace />;
//   }

//   // 🔹 Otherwise, show the protected content
//   return <Outlet />;
// }


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