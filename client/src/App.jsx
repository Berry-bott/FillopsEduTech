import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Auth Providers & Protected Routes
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import TutorAuthProvider from "./auth/TutorAuthProvider";
import TutorProtectedRoute from "./auth/TutorProtectedRoute";
import AdminAuthProvider from "./auth/AdminAuthProvider";
import AdminProtectedRoute from "./auth/Adminprotectedroute";

// Socket
import UseSocket from "./hooks/useSocket";
import SocketInitializer from "./hooks/SocketInitializer";

// ========== ADMIN PAGES (Lazy Loaded) ==========
const AdminLogin = lazy(() => import("@/pages/index/AdminLogin"));
const ActivityPage = lazy(() => import("@/pages/admin/ActivityPage"));
const TutorsPage = lazy(() => import("@/pages/admin/TutorsPage"));
const MessagesPage = lazy(() => import("@/pages/admin/MessagesPage"));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));
const Pricing = lazy(() => import("@/pages/admin/Pricing"));
const UsersPage = lazy(() => import("@/pages/admin/UsersPage"));
const AdminTicketPage = lazy(() => import("@/pages/admin/TicketPage"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminNotificationPage = lazy(() => import("@/pages/admin/Notification"));
const UserPromoPage = lazy(() => import("@/pages/admin/UsersPromoPage"));

// ========== TUTOR PAGES (Lazy Loaded) ==========
const TutorLogin = lazy(() => import("@/pages/index/TutorLogin"));
const TutorRegister = lazy(() => import("@/pages/index/TutorRegister"));
const LecturerDashboard = lazy(() => import("@/pages/lecturer/LecturerDashboard"));

// ========== USER / PUBLIC PAGES (Lazy Loaded) ==========
const LandingPage = lazy(() => import("@/pages/index/LandingPage"));
const Login = lazy(() => import("@/pages/index/Login"));
const ForgotPassword = lazy(() => import("@/pages/index/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/index/ResetPassword"));
const Register = lazy(() => import("@/pages/index/Register"));
const TermsOfUse = lazy(() => import("@/pages/index/TermsOfUse"));
const Unauthorized = lazy(() => import("@/pages/index/Unauthorized"));
const Fillopwelcome = lazy(() => import("@/pages/index/Fillopwelcome"));
const RefundPolicyPage = lazy(() => import("@/pages/user/RefundPolicyPage.jsx"));
const UserDashboard = lazy(() => import("@/pages/user/UserDashboard"));
const PreferencePage = lazy(() => import("@/pages/user/PreferencePage"));
const MyProfile = lazy(() => import("@/pages/user/MyProfile"));
const UserSettings = lazy(() => import("@/pages/user/UserSetting"));
const StudyPage = lazy(() => import("@/pages/user/StudyPage"));
const QuizPage = lazy(() => import("@/pages/user/QuizPage"));
const QuizReport = lazy(() => import("@/pages/user/QuizReport"));
const QuizHistoryPage = lazy(() => import("@/pages/user/QuizHistoryPage "));
const FinancialReport = lazy(() => import("@/pages/user/FinancialReport"));
const Analyticspage = lazy(() => import("@/pages/user/Analyticspage"));
const ExamsPage = lazy(() => import("@/pages/user/ExamsPage"));
const ExamResultPage = lazy(() => import("@/pages/user/ExamResultPage"));
const ExamSelector = lazy(() => import("./components/DashboardComponents/user/ExamSelector"));
const PaymentHistory = lazy(() => import("@/pages/user/PaymentHistory"));
const PaymentPending = lazy(() => import("@/pages/user/PaymentPending"));
const TicketPage = lazy(() => import("@/pages/user/TicketPage"));
const CheckoutPage = lazy(() => import("./payment/Checkout"));
const PaymentVerification = lazy(() => import("./payment/PaymentVerification"));
const UserCommunity = lazy(() => import("./pages/community/UserCommunity"));
const UserChatPage = lazy(() => import("./pages/chat/UserChatPage"));
const NotificationsPage = lazy(() => import("@/pages/user/NotificationsPage"));

// ========== NEWS PAGES (Lazy Loaded) ==========
const NewsPage = lazy(() => import("./pages/news/admin/NewsPage"));
const NewsDetailPage = lazy(() => import("./pages/news/admin/NewsDetailPage"));
const AdminNewsPage = lazy(() => import("./components/DashboardComponents/admin/news/AdminNewsSetup"));

// ========== BLOG PAGES (Lazy Loaded) ==========
const AdminBlogPage = lazy(() => import("./pages/blog/admin/AdminBlogPage"));
const BlogDetailPage = lazy(() => import("./pages/blog/admin/BlogDetailPage"));

// ========== PUBLIC BLOG PAGES (Lazy Loaded) ==========
const BlogPage = lazy(() => import("./pages/index/BlogPage"));

import "./App.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Toaster />
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* ========== PUBLIC ROUTES ========== */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/tutor/welcomeTutor" element={<Fillopwelcome />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/payments/refunds" element={<RefundPolicyPage />} />

              {/* ========== USER AUTH (PUBLIC) ========== */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />

              {/* ========== TUTOR AUTH (PUBLIC) ========== */}
              <Route path="/tutor/login" element={<TutorLogin />} />
              <Route path="/tutor/register" element={<TutorRegister />} />

              {/* ========== ADMIN AUTH (PUBLIC) ========== */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ========== NEWS — PUBLIC routes (anyone can read) ========== */}
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/news" element={<NewsPage />} />

              {/* ========== BLOG — PUBLIC routes (anyone can read) ========== */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />

              {/* ========== PROTECTED USER ROUTES ========== */}
              <Route
                element={
                  <AuthProvider>
                    <SocketInitializer />
                    <UseSocket />
                    <ProtectedRoute />
                  </AuthProvider>
                }
              >
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/onboarding" element={<PreferencePage />} />
                <Route path="/study" element={<StudyPage key={location.key} />} />
                <Route path="/reports/financial" element={<FinancialReport />} />
                <Route path="/dashboard/analytics" element={<Analyticspage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/users-settings" element={<UserSettings />} />
                <Route path="/quiz/results" element={<QuizReport />} />
                <Route path="/quiz/history" element={<QuizHistoryPage />} />
                <Route path="/exam" element={<ExamsPage />} />
                <Route path="/exam-results/:examId" element={<ExamResultPage />} />
                <Route path="/exam-selector" element={<ExamSelector />} />
                <Route path="/chat/community" element={<UserCommunity />} />
                <Route path="/chat/tutor" element={<UserChatPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/verify" element={<PaymentVerification />} />
                <Route path="/payments/history" element={<PaymentHistory />} />
                <Route path="/orders/pending" element={<PaymentPending />} />
                <Route path="/support" element={<TicketPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>

              {/* ========== PROTECTED TUTOR ROUTES ========== */}
              <Route
                element={
                  <TutorAuthProvider>
                    <TutorProtectedRoute />
                  </TutorAuthProvider>
                }
              >
                <Route path="/tutor/dashboard" element={<LecturerDashboard />} />
              </Route>

              {/* ========== PROTECTED ADMIN ROUTES ========== */}
              <Route
                element={
                  <AdminAuthProvider>
                    <AdminProtectedRoute />
                  </AdminAuthProvider>
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/manage-users" element={<UsersPage />} />
                <Route path="/manage-tutors" element={<TutorsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/supports" element={<AdminTicketPage />} />
                <Route path="/admin/notifications" element={<AdminNotificationPage />} />
                <Route path="/user-promo" element={<UserPromoPage />} />
                <Route path="/news/admin" element={<AdminNewsPage />} />
                <Route path="/blog/admin" element={<AdminBlogPage />} />
              </Route>

            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
