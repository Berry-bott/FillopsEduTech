import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes"; // ✅ Theme handling
import ProtectedRoute from "./auth/ProtectedRoute";


// Supa Admin pages
import ActivityPage from "@/pages/admin/ActivityPage";
import AdminsPage from "@/pages/admin/AdminsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import UsersPage from "@/pages/admin/UsersPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";



// 🧩 Pages
import Login from "@/pages/index/Login";
import Learning from "@/pages/user/Learning";
import Register from "@/pages/index/Register";
import QuizPage from "@/pages/user/QuizPage";
import ExamsPage from "@/pages/user/ExamsPage";
import VerifyEmail from "@/pages/index/VerifyEmail";
import LandingPage from "@/pages/index/LandingPage";
import Unauthorized from "@/pages/index/Unauthorized";
import UserDashboard from "@/pages/user/UserDashboard";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
import ExamSelector from "./components/DashboardComponents/user/ExamSelector";
import "./App.css";
// import Profile from "@/pages/Profile";


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
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/QuizPage" element={<QuizPage />} />
          <Route path="/ExamsPage" element={<ExamsPage />} />
          <Route path="/exam-selector" element={<ExamSelector />} />
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
          {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}

          {/* SUPA ADMIN ROUTES */}
          <Route path="/manage-users" element={<UsersPage />} />
          <Route path="/manage-admins" element={<AdminsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
            


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
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
