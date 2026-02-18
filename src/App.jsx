import { ThemeProvider } from "next-themes";
import AuthProvider from "./auth/AuthProvider";
// import TutorAuthProvider from "./auth/TutorAuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import TutorProtectedRoute from "./auth/TutorProtectedRoute";
import { Toaster } from "@/components/ui/toaster"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Supa Admin pages
import ActivityPage from "@/pages/admin/ActivityPage";
import AdminsPage from "@/pages/admin/AdminsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import UsersPage from "@/pages/admin/UsersPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
// chats
// import TutorChatPage from "./pages/chat/TutorChatPage" 
import UserChatPage from "./pages/chat/UserChatPage"
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
import ExamResultPage  from "@/pages/user/ExamResultPage";
import LandingPage from "@/pages/index/LandingPage";
import TutorRegister from "@/pages/index/TutorRegister";
import TutorLogin from "@/pages/index/TutorLogin";
import Unauthorized from "@/pages/index/Unauthorized";
import UserDashboard from "@/pages/user/UserDashboard";
import PreferencePage from "@/pages/user/PreferencePage";
import CheckoutPage from "./payment/Checkout";
import PaymentVerification from "./payment/PaymentVerification";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
import ExamSelector from "./components/DashboardComponents/user/ExamSelector";

// community
import UserCommunity from "./pages/community/UserCommunity";

import "./App.css";




function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
         {/* <TutorAuthProvider> */}
          <Toaster />
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ========== STUDENT/USER AUTH ROUTES ========== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ========== TUTOR AUTH ROUTES (PUBLIC) ========== */}
            <Route path="/tutor/login" element={<TutorLogin />} />
            <Route path="/tutor/register" element={<TutorRegister />} />

            {/* ========== ADMIN ROUTES (Consider adding AdminProtectedRoute) ========== */}
            <Route path="/manage-users" element={<UsersPage />} />
            <Route path="/manage-admins" element={<AdminsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* ========== PROTECTED STUDENT/USER ROUTES ========== */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/onboarding" element={<PreferencePage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/quiz/results" element={<QuizReport />} />
              <Route path="/quiz/history" element={<QuizHistoryPage />} />
              <Route path="/exam" element={<ExamsPage />} />
              <Route path="exam-results/:examId" element={<ExamResultPage />} />
              <Route path="/exam-selector" element={<ExamSelector />} />
              <Route path="/chat/community" element={<UserCommunity />} />

              {/* chats */}
              <Route path="/chat/tutor" element={<UserChatPage/>} />
              {/* <Route path="/chat/user" element={<TutorChatPage/>} /> */}
              
              
              {/* Payment routes */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/verify" element={<PaymentVerification />} />
              <Route path="/payments/history" element={<PaymentHistory />} />
              <Route path="/orders/pending" element={<PaymentPending />} />
            </Route>

            {/* ========== PROTECTED TUTOR ROUTES ========== */}
            <Route element={<TutorProtectedRoute />}>
              <Route path="/tutor/dashboard" element={<LecturerDashboard />} />
              {/* Add more tutor-specific routes here */}
            </Route>
            
        {/* ========== FALLBACK ROUTES ========== */}
        {/* <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} /> */}
          </Routes>
          {/* </TutorAuthProvider> */}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;