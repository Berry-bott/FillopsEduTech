// // src/auth/ProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react"; // optional spinner
// import useAuthStore from "../store/authStore";

// export default function ProtectedRoute() {
//   const { checkAuth, isAuthenticated } = useAuthStore();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const verify = async () => {
//       await checkAuth(); // 🧠 Ask backend if token is still valid
//       setChecking(false);
//     };
//     verify();
//   }, [checkAuth]);

//   // 🔹 While verifying auth, show loading spinner
//   if (checking) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-20 h-20 animate-spin text-gray-600" />
//       </div>
//     );
//   }

//   // 🔹 If not authenticated after checking → redirect
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // 🔹 Otherwise, show the protected content
//   return <Outlet />;
// }




import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setChecking(false);
    };
    verify();
  }, [checkAuth]);

  if (checking)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-20 h-20 animate-spin text-gray-600" />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
