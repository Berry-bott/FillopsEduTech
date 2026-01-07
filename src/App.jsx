import { ThemeProvider } from "next-themes";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Supa Admin pages
import ActivityPage from "@/pages/admin/ActivityPage";
import AdminsPage from "@/pages/admin/AdminsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import UsersPage from "@/pages/admin/UsersPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";

// 🧩 Pages
import Login from "@/pages/index/Login";
import Register from "@/pages/index/Register";
import QuizPage from "@/pages/user/QuizPage";
import QuizReport from "@/pages/user/QuizReport";
import QuizHistoryPage from "@/pages/user/QuizHistoryPage ";
import PaymentHistory from "@/pages/user/PaymentHistory";
import PaymentPending from "@/pages/user/PaymentPending";
import StudyPage from "@/pages/user/StudyPage";
import ExamsPage from "@/pages/user/ExamsPage";
import LandingPage from "@/pages/index/LandingPage";
import Unauthorized from "@/pages/index/Unauthorized";
import UserDashboard from "@/pages/user/UserDashboard";
import PreferencePage from "@/pages/user/PreferencePage";
import CheckoutPage from "./payment/Checkout";
import PaymentVerification from "./payment/PaymentVerification";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
import ExamSelector from "./components/DashboardComponents/user/ExamSelector";
import "./App.css";






function App() {

  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
        <Toaster />
        <Routes>
          {/* 🌍 Public routes */}    
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/results" element={<QuizReport />} />
            <Route path="/quiz/history" element={<QuizHistoryPage />} />
            <Route path="/exam" element={<ExamsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/verify" element={<PaymentVerification />} />
            <Route path="/payments/history" element={<PaymentHistory />} />
            <Route path="/orders/pending" element={<PaymentPending />} />
            <Route path="/onboarding" element={<PreferencePage />} />
            <Route path="/exam-selector" element={<ExamSelector />} />
            <Route path="/tutor/dashboard" element={<LecturerDashboard />} />


          </Route>
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;





