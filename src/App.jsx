

// import { useEffect } from "react";
// import { ThemeProvider } from "next-themes";
// import AuthProvider from "./auth/AuthProvider";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import TutorProtectedRoute from "./auth/TutorProtectedRoute";
// import { Toaster } from "@/components/ui/toaster";
// import { BrowserRouter, Routes, Route } from "react-router-dom";


// // Supa Admin pages
// import ActivityPage from "@/pages/admin/ActivityPage";
// import AdminsPage from "@/pages/admin/AdminsPage";
// import MessagesPage from "@/pages/admin/MessagesPage";
// import SettingsPage from "@/pages/admin/SettingsPage";
// import UsersPage from "@/pages/admin/UsersPage";
// import AdminDashboard from "@/pages/admin/AdminDashboard";
// // import { getUserSocket } from "@/lib/userChatSocket";

// // Chat pages
// import UserChatPage from "./pages/chat/UserChatPage";

// // User pages
// import Login from "@/pages/index/Login";
// import Register from "@/pages/index/Register";
// import TermsOfUse from "@/pages/index/TermsOfUse";
// import MyProfile from "@/pages/user/MyProfile";
// import UserSettings from "@/pages/user/UserSetting";
// import QuizPage from "@/pages/user/QuizPage";
// import FinancialReport from "@/pages/user/FinancialReport";
// import Analyticspage  from "@/pages/user/Analyticspage";
// import QuizReport from "@/pages/user/QuizReport";
// import QuizHistoryPage from "@/pages/user/QuizHistoryPage ";
// import PaymentHistory from "@/pages/user/PaymentHistory";
// import PaymentPending from "@/pages/user/PaymentPending";
// import StudyPage from "@/pages/user/StudyPage";
// import ExamsPage from "@/pages/user/ExamsPage";
// import ExamResultPage from "@/pages/user/ExamResultPage";
// import LandingPage from "@/pages/index/LandingPage";
// import TutorRegister from "@/pages/index/TutorRegister";
// import TutorLogin from "@/pages/index/TutorLogin";
// import Unauthorized from "@/pages/index/Unauthorized";
// import UserDashboard from "@/pages/user/UserDashboard";
// import PreferencePage from "@/pages/user/PreferencePage";
// import CheckoutPage from "./payment/Checkout";
// import PaymentVerification from "./payment/PaymentVerification";
// import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
// import ExamSelector from "./components/DashboardComponents/user/ExamSelector";

// // Community
// import UserCommunity from "./pages/community/UserCommunity";
// import UseSocket from "./hooks/useSocket";
// import SocketInitializer from "./hooks/SocketInitializer";
// import RefundPolicyPage from "@/pages/user/RefundPolicyPage.jsx"; 

// import "./App.css";



// function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <AuthProvider>
//           <SocketInitializer />
//           <UseSocket />
//           <Toaster />
//           <Routes>
//             {/* ========== PUBLIC ROUTES ========== */}
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />

//             {/* ========== STUDENT/USER AUTH ROUTES ========== */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/payments/refunds" element={<RefundPolicyPage />} />
//             <Route path="/terms" element={<TermsOfUse />} />

//             {/* ========== TUTOR AUTH ROUTES (PUBLIC) ========== */}
//             <Route path="/tutor/login" element={<TutorLogin />} />
//             <Route path="/tutor/register" element={<TutorRegister />} />


//             {/* ========== ADMIN ROUTES ========== */}
//             <Route path="/manage-users" element={<UsersPage />} />
//             <Route path="/manage-admins" element={<AdminsPage />} />
//             <Route path="/messages" element={<MessagesPage />} />
//             <Route path="/activity" element={<ActivityPage />} />
//             <Route path="/settings" element={<SettingsPage />} />
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />

//             {/* ========== PROTECTED STUDENT/USER ROUTES ========== */}
//             <Route element={<ProtectedRoute />}>
//               <Route path="/user/dashboard" element={<UserDashboard />} />
//               <Route path="/onboarding" element={<PreferencePage />} />
//               <Route path="/study" element={<StudyPage />} />
//               <Route path="/reports/financial" element={<FinancialReport />} />
//               <Route path="/dashboard/analytics" element={<Analyticspage  />} />
//               <Route path="/quiz" element={<QuizPage />} />
//               <Route path="/myprofile" element={<MyProfile />} />
//               <Route path="users-settings" element={<UserSettings />} />
//               <Route path="/quiz/results" element={<QuizReport />} />
//               <Route path="/quiz/history" element={<QuizHistoryPage />} />
//               <Route path="/exam" element={<ExamsPage />} />
//               <Route path="exam-results/:examId" element={<ExamResultPage />} />
//               <Route path="/exam-selector" element={<ExamSelector />} />
//               <Route path="/chat/community" element={<UserCommunity />} />
//               <Route path="/chat/tutor" element={<UserChatPage />} />

//               {/* Payment routes */}
//               <Route path="/checkout" element={<CheckoutPage />} />
//               <Route path="/payment/verify" element={<PaymentVerification />} />
//               <Route path="/payments/history" element={<PaymentHistory />} />
//               <Route path="/orders/pending" element={<PaymentPending />} />
//             </Route>

//             {/* ========== PROTECTED TUTOR ROUTES ========== */}
//             <Route element={<TutorProtectedRoute />}>
//               <Route path="/tutor/dashboard" element={<LecturerDashboard />} />
//             </Route>

//             {/* ========== FALLBACK ROUTES ========== */}
//             {/* <Route path="/404" element={<NotFound />} />
//             <Route path="*" element={<Navigate to="/404" replace />} /> */}
//           </Routes>
//         </AuthProvider>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }

// export default App;






// import { ThemeProvider } from "next-themes";
// import { Toaster } from "@/components/ui/toaster";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // Auth Providers & Protected Routes
// import AuthProvider from "./auth/AuthProvider";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import TutorAuthProvider from "./auth/TutorAuthProvider";
// import TutorProtectedRoute from "./auth/TutorProtectedRoute";
// import AdminAuthProvider from "./auth/AdminAuthProvider";
// import AdminProtectedRoute from "./auth/Adminprotectedroute";

// // Socket
// import UseSocket from "./hooks/useSocket";
// import SocketInitializer from "./hooks/SocketInitializer";

// // ========== ADMIN PAGES ==========
// import AdminLogin from "@/pages/index/AdminLogin";
// import ActivityPage from "@/pages/admin/ActivityPage";
// import TutorsPage from "@/pages/admin/TutorsPage";
// import MessagesPage from "@/pages/admin/MessagesPage";
// import SettingsPage from "@/pages/admin/SettingsPage";
// import Pricing from "@/pages/admin/Pricing";
// import UsersPage from "@/pages/admin/UsersPage";
// import AdminTicketPage from "@/pages/admin/TicketPage";
// import AdminDashboard from "@/pages/admin/AdminDashboard";
// import AdminNotificationPage from "@/pages/admin/notification";

// // ========== TUTOR PAGES ==========
// import TutorLogin from "@/pages/index/TutorLogin";
// import TutorRegister from "@/pages/index/TutorRegister";
// import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";

// // ========== USER / PUBLIC PAGES ==========
// import LandingPage from "@/pages/index/LandingPage";
// import Login from "@/pages/index/Login";
// import Register from "@/pages/index/Register";
// import TermsOfUse from "@/pages/index/TermsOfUse";
// import Unauthorized from "@/pages/index/Unauthorized";
// import Fillopwelcome from "@/pages/index/Fillopwelcome";
// import RefundPolicyPage from "@/pages/user/RefundPolicyPage.jsx";
// import UserDashboard from "@/pages/user/UserDashboard";
// import PreferencePage from "@/pages/user/PreferencePage";
// import MyProfile from "@/pages/user/MyProfile";
// import UserSettings from "@/pages/user/UserSetting";
// import StudyPage from "@/pages/user/StudyPage";
// import QuizPage from "@/pages/user/QuizPage";
// import QuizReport from "@/pages/user/QuizReport";
// import QuizHistoryPage from "@/pages/user/QuizHistoryPage ";
// import FinancialReport from "@/pages/user/FinancialReport";
// import Analyticspage from "@/pages/user/Analyticspage";
// import ExamsPage from "@/pages/user/ExamsPage";
// import ExamResultPage from "@/pages/user/ExamResultPage";
// import ExamSelector from "./components/DashboardComponents/user/ExamSelector";
// import PaymentHistory from "@/pages/user/PaymentHistory";
// import PaymentPending from "@/pages/user/PaymentPending";
// import TicketPage from "@/pages/user/TicketPage";
// import CheckoutPage from "./payment/Checkout";
// import PaymentVerification from "./payment/PaymentVerification";
// import UserCommunity from "./pages/community/UserCommunity";
// import UserChatPage from "./pages/chat/UserChatPage";
// import NotificationsPage from "./pages/user/NotificationsPage";

// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <Toaster />
//         <Routes>

//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />
//           <Route path="/tutor/welcomeTutor" element={<Fillopwelcome />} />
//           <Route path="/terms" element={<TermsOfUse />} />
//           <Route path="/payments/refunds" element={<RefundPolicyPage />} />

//           {/* ========== USER AUTH (PUBLIC) ========== */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* ========== TUTOR AUTH (PUBLIC) ========== */}
//           <Route path="/tutor/login" element={<TutorLogin />} />
//           <Route path="/tutor/register" element={<TutorRegister />} />

//           {/* ========== ADMIN AUTH (PUBLIC) ========== */}
//           <Route path="/admin/login" element={<AdminLogin />} />

//           {/* ========== PROTECTED USER ROUTES ========== */}
//           <Route
//             element={
//               <AuthProvider>
//                 <SocketInitializer />
//                 <UseSocket />
//                 <ProtectedRoute />
//               </AuthProvider>
//             }
//           >
//             <Route path="/user/dashboard" element={<UserDashboard />} />
//             <Route path="/onboarding" element={<PreferencePage />} />
//            <Route path="/study" element={<StudyPage key={location.key} />} />
//             <Route path="/reports/financial" element={<FinancialReport />} />
//             <Route path="/dashboard/analytics" element={<Analyticspage />} />
//             <Route path="/quiz" element={<QuizPage />} />
//             <Route path="/myprofile" element={<MyProfile />} />
//             <Route path="/users-settings" element={<UserSettings />} />
//             <Route path="/quiz/results" element={<QuizReport />} />
//             <Route path="/quiz/history" element={<QuizHistoryPage />} />
//             <Route path="/exam" element={<ExamsPage />} />
//             <Route path="/exam-results/:examId" element={<ExamResultPage />} />
//             <Route path="/exam-selector" element={<ExamSelector />} />
//             <Route path="/chat/community" element={<UserCommunity />} />
//             <Route path="/chat/tutor" element={<UserChatPage />} />
//             <Route path="/checkout" element={<CheckoutPage />} />
//             <Route path="/payment/verify" element={<PaymentVerification />} />
//             <Route path="/payments/history" element={<PaymentHistory />} />
//             <Route path="/orders/pending" element={<PaymentPending />} />
//             <Route path="/support" element={<TicketPage />} />
//             <Route path="/notifications" element={<NotificationsPage />} />
//           </Route>

//           {/* ========== PROTECTED TUTOR ROUTES ========== */}
//           <Route
//             element={
//               <TutorAuthProvider>
//                 <TutorProtectedRoute />
//               </TutorAuthProvider>
//             }
//           >
//             <Route path="/tutor/dashboard" element={<LecturerDashboard />} />
//           </Route>

//           {/* ========== PROTECTED ADMIN ROUTES ========== */}
//           <Route
//             element={
//               <AdminAuthProvider>
//                 <AdminProtectedRoute />
//               </AdminAuthProvider>
//             }
//           >
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//             <Route path="/manage-users" element={<UsersPage />} />
//             <Route path="/manage-tutors" element={<TutorsPage />} />
//             <Route path="/messages" element={<MessagesPage />} />
//             <Route path="/activity" element={<ActivityPage />} />
//             <Route path="/pricing" element={<Pricing />} />
//             <Route path="/settings" element={<SettingsPage />} />
//             <Route path="/supports" element={<AdminTicketPage />} />
//             <Route path="/admin/notifications" element={<AdminNotificationPage />} />


//           </Route>

//         </Routes>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }

// export default App;











// import { ThemeProvider } from "next-themes";
// import { Toaster } from "@/components/ui/toaster";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // Auth Providers & Protected Routes
// import AuthProvider from "./auth/AuthProvider";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import TutorAuthProvider from "./auth/TutorAuthProvider";
// import TutorProtectedRoute from "./auth/TutorProtectedRoute";
// import AdminAuthProvider from "./auth/AdminAuthProvider";
// import AdminProtectedRoute from "./auth/Adminprotectedroute";

// // Socket
// import UseSocket from "./hooks/useSocket";
// import SocketInitializer from "./hooks/SocketInitializer";

// // ========== ADMIN PAGES ==========
// import AdminLogin from "@/pages/index/AdminLogin";
// import ActivityPage from "@/pages/admin/ActivityPage";
// import TutorsPage from "@/pages/admin/TutorsPage";
// import MessagesPage from "@/pages/admin/MessagesPage";
// import SettingsPage from "@/pages/admin/SettingsPage";
// import Pricing from "@/pages/admin/Pricing";
// import UsersPage from "@/pages/admin/UsersPage";
// import AdminTicketPage from "@/pages/admin/TicketPage";
// import AdminDashboard from "@/pages/admin/AdminDashboard";
// import AdminNotificationPage from "@/pages/admin/Notification"
// import UserPromoPage from "@/pages/admin/UsersPromoPage";

// // ========== TUTOR PAGES ==========
// import TutorLogin from "@/pages/index/TutorLogin";
// import TutorRegister from "@/pages/index/TutorRegister";
// import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";

// // ========== USER / PUBLIC PAGES ==========
// import LandingPage from "@/pages/index/LandingPage";
// import Login from "@/pages/index/Login";
// import Register from "@/pages/index/Register";
// import TermsOfUse from "@/pages/index/TermsOfUse";
// import Unauthorized from "@/pages/index/Unauthorized";
// import Fillopwelcome from "@/pages/index/Fillopwelcome";
// import RefundPolicyPage from "@/pages/user/RefundPolicyPage.jsx";
// import UserDashboard from "@/pages/user/UserDashboard";
// import PreferencePage from "@/pages/user/PreferencePage";
// import MyProfile from "@/pages/user/MyProfile";
// import UserSettings from "@/pages/user/UserSetting";
// import StudyPage from "@/pages/user/StudyPage";
// import QuizPage from "@/pages/user/QuizPage";
// import QuizReport from "@/pages/user/QuizReport";
// import QuizHistoryPage from "@/pages/user/QuizHistoryPage ";
// import FinancialReport from "@/pages/user/FinancialReport";
// import Analyticspage from "@/pages/user/Analyticspage";
// import ExamsPage from "@/pages/user/ExamsPage";
// import ExamResultPage from "@/pages/user/ExamResultPage";
// import ExamSelector from "./components/DashboardComponents/user/ExamSelector";
// import PaymentHistory from "@/pages/user/PaymentHistory";
// import PaymentPending from "@/pages/user/PaymentPending";
// import TicketPage from "@/pages/user/TicketPage";
// import CheckoutPage from "./payment/Checkout";
// import PaymentVerification from "./payment/PaymentVerification";
// import UserCommunity from "./pages/community/UserCommunity";
// import UserChatPage from "./pages/chat/UserChatPage";
// import NotificationsPage from "./pages/user/NotificationsPage";

// // ========== NEWS PAGES ==========
// import NewsPage from "./pages/news/admin/NewsPage";
// import NewsDetailPage from "./pages/news/admin/NewsDetailPage";
// import AdminNewsPage from "./components/DashboardComponents/admin/news/AdminNewsSetup";

// // ========== BLOG PAGES ==========
// import AdminBlogPage from "./pages/blog/admin/AdminBlogPage";
// import BlogDetailPage from "./pages/blog/admin/BlogDetailPage";


// // ========== PUBLIC BLOG PAGES ==========
// import BlogPage from "./pages/index/BlogPage";


// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <Toaster />
//         <Routes>

//           {/* ========== PUBLIC ROUTES ========== */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />
//           <Route path="/tutor/welcomeTutor" element={<Fillopwelcome />} />
//           <Route path="/terms" element={<TermsOfUse />} />
//           <Route path="/payments/refunds" element={<RefundPolicyPage />} />

//           {/* ========== USER AUTH (PUBLIC) ========== */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* ========== TUTOR AUTH (PUBLIC) ========== */}
//           <Route path="/tutor/login" element={<TutorLogin />} />
//           <Route path="/tutor/register" element={<TutorRegister />} />

//           {/* ========== ADMIN AUTH (PUBLIC) ========== */}
//           <Route path="/admin/login" element={<AdminLogin />} />

//           {/* ========== NEWS — PUBLIC routes (anyone can read) ========== */}
   
//           <Route path="/news/:id"   element={<NewsDetailPage />} />
//           <Route path="/news"       element={<NewsPage />} />

//           {/* ========== BLOG — PUBLIC routes (anyone can read) ========== */}
//           <Route path="/blog"       element={<BlogPage />} />
//           <Route path="/blog/:slug" element={<BlogDetailPage />} />

//           {/* ========== PROTECTED USER ROUTES ========== */}
//           <Route
//             element={
//               <AuthProvider>
//                 <SocketInitializer />
//                 <UseSocket />
//                 <ProtectedRoute />
//               </AuthProvider>
//             }
//           >
//             <Route path="/user/dashboard" element={<UserDashboard />} />
//             <Route path="/onboarding" element={<PreferencePage />} />
//             <Route path="/study" element={<StudyPage key={location.key} />} />
//             <Route path="/reports/financial" element={<FinancialReport />} />
//             <Route path="/dashboard/analytics" element={<Analyticspage />} />
//             <Route path="/quiz" element={<QuizPage />} />
//             <Route path="/myprofile" element={<MyProfile />} />
//             <Route path="/users-settings" element={<UserSettings />} />
//             <Route path="/quiz/results" element={<QuizReport />} />
//             <Route path="/quiz/history" element={<QuizHistoryPage />} />
//             <Route path="/exam" element={<ExamsPage />} />
//             <Route path="/exam-results/:examId" element={<ExamResultPage />} />
//             <Route path="/exam-selector" element={<ExamSelector />} />
//             <Route path="/chat/community" element={<UserCommunity />} />
//             <Route path="/chat/tutor" element={<UserChatPage />} />
//             <Route path="/checkout" element={<CheckoutPage />} />
//             <Route path="/payment/verify" element={<PaymentVerification />} />
//             <Route path="/payments/history" element={<PaymentHistory />} />
//             <Route path="/orders/pending" element={<PaymentPending />} />
//             <Route path="/support" element={<TicketPage />} />
//             <Route path="/notifications" element={<NotificationsPage />} />

//             {/* <Route path="/news/:id"   element={<UserNewsDetailPage />} /> */}
//           {/* <Route path="/news"       element={<UserNewsPage />} /> */}
//           </Route>

//           {/* ========== PROTECTED TUTOR ROUTES ========== */}
//           <Route
//             element={
//               <TutorAuthProvider>
//                 <TutorProtectedRoute />
//               </TutorAuthProvider>
//             }
//           >
//             <Route path="/tutor/dashboard" element={<LecturerDashboard />} />
//           </Route>

//           {/* ========== PROTECTED ADMIN ROUTES ========== */}
//           <Route
//             element={
//               <AdminAuthProvider>
//                 <AdminProtectedRoute /> 
//               </AdminAuthProvider>
//             }
//           >
//             <Route path="/admin/dashboard"      element={<AdminDashboard />} />
//             <Route path="/manage-users"         element={<UsersPage />} />
//             <Route path="/manage-tutors"        element={<TutorsPage />} />
//             <Route path="/messages"             element={<MessagesPage />} />
//             <Route path="/activity"             element={<ActivityPage />} />
//             <Route path="/pricing"              element={<Pricing />} />
//             <Route path="/settings"             element={<SettingsPage />} />
//             <Route path="/supports"             element={<AdminTicketPage />} />
//             <Route path="/admin/notifications"  element={<AdminNotificationPage />} />
//             <Route path="/user-promo"  element={<UserPromoPage />} />
//                 {/* ✅ Admin-only news management — protected */}
//             <Route path="/news/admin" element={<AdminNewsPage />} />


//             <Route path="/blog/admin" element={<AdminBlogPage />} />
//             {/* <Route path="/blog/:slug" element={<BlogDetailPage />} /> */}
            
//           </Route>

//         </Routes>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

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

// ========== ADMIN PAGES ==========
import AdminLogin from "@/pages/index/AdminLogin";
import ActivityPage from "@/pages/admin/ActivityPage";
import TutorsPage from "@/pages/admin/TutorsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import Pricing from "@/pages/admin/Pricing";
import UsersPage from "@/pages/admin/UsersPage";
import AdminTicketPage from "@/pages/admin/TicketPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminNotificationPage from "@/pages/admin/Notification";
import UserPromoPage from "@/pages/admin/UsersPromoPage";

// ========== TUTOR PAGES ==========
import TutorLogin from "@/pages/index/TutorLogin";
import TutorRegister from "@/pages/index/TutorRegister";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";

// ========== USER / PUBLIC PAGES ==========
import LandingPage from "@/pages/index/LandingPage";
import Login from "@/pages/index/Login";
import Register from "@/pages/index/Register";
import TermsOfUse from "@/pages/index/TermsOfUse";
import Unauthorized from "@/pages/index/Unauthorized";
import Fillopwelcome from "@/pages/index/Fillopwelcome";
import RefundPolicyPage from "@/pages/user/RefundPolicyPage.jsx";
import UserDashboard from "@/pages/user/UserDashboard";
import PreferencePage from "@/pages/user/PreferencePage";
import MyProfile from "@/pages/user/MyProfile";
import UserSettings from "@/pages/user/UserSetting";
import StudyPage from "@/pages/user/StudyPage";
import QuizPage from "@/pages/user/QuizPage";
import QuizReport from "@/pages/user/QuizReport";
import QuizHistoryPage from "@/pages/user/QuizHistoryPage ";
import FinancialReport from "@/pages/user/FinancialReport";
import Analyticspage from "@/pages/user/Analyticspage";
import ExamsPage from "@/pages/user/ExamsPage";
import ExamResultPage from "@/pages/user/ExamResultPage";
import ExamSelector from "./components/DashboardComponents/user/ExamSelector";
import PaymentHistory from "@/pages/user/PaymentHistory";
import PaymentPending from "@/pages/user/PaymentPending";
import TicketPage from "@/pages/user/TicketPage";
import CheckoutPage from "./payment/Checkout";
import PaymentVerification from "./payment/PaymentVerification";
import UserCommunity from "./pages/community/UserCommunity";
import UserChatPage from "./pages/chat/UserChatPage";
import NotificationsPage from "./pages/user/NotificationsPage";

// ========== NEWS PAGES ==========
import NewsPage from "./pages/news/admin/NewsPage";
import NewsDetailPage from "./pages/news/admin/NewsDetailPage";
import AdminNewsPage from "./components/DashboardComponents/admin/news/AdminNewsSetup";

// ========== BLOG PAGES ==========
import AdminBlogPage from "./pages/blog/admin/AdminBlogPage";
import BlogDetailPage from "./pages/blog/admin/BlogDetailPage";

// ========== PUBLIC BLOG PAGES ==========
import BlogPage from "./pages/index/BlogPage";

import "./App.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <Routes>

            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/tutor/welcomeTutor" element={<Fillopwelcome />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/payments/refunds" element={<RefundPolicyPage />} />

            {/* ========== USER AUTH (PUBLIC) ========== */}
            <Route path="/login" element={<Login />} />
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
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;