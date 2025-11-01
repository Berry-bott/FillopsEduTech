
// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ User exists, so allow access
  return children;
};

export default ProtectedRoute;


// import { Navigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const { user, loading } = useAuthStore();

//   if (loading) return <div>Loading...</div>;

//   if (!user) return <Navigate to="/login" replace />;

//   if (allowedRoles && !allowedRoles.includes(user.role))
//     return <Navigate to="/" replace />;

//   return children;
// }
