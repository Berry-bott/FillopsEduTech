import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes"; // ✅ Theme handling
import ProtectedRoute from "./auth/ProtectedRoute";
import { useEffect } from "react";

// 🧩 Pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserDashboard from "@/pages/UserDashboard";
import VerifyEmail from "@/pages/VerifyEmail";
import Learning from "@/pages/Learning";
import ExamSelector from "./components/DashboardComponents/user/index/ExamSelector";
// import Profile from "@/pages/Profile";


// import AdminDashboard from "@/pages/AdminDashboard";
import Unauthorized from "@/pages/Unauthorized";

import "./App.css";

function App() {


  return (
    <BrowserRouter>
      {/* ✅ Global Theme Provider */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Routes>
          {/* 🌍 Public routes */}    
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/exam-selector" element={<ExamSelector />} />


          {/* 👤 User routes */}
          <Route element={<ProtectedRoute />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
          {/* <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* 🛠️ Admin routes */}
          {/* <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
