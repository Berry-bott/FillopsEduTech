// // components/SimpleNav.jsx
// import React, { useState } from 'react';
// import { Menu, X, User, LogOut, BookOpen } from 'lucide-react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import useAuthStore from '../../store/authStore';
// import Logo from "../../assets/images/fillopsLogo.png"; 
// import { ThemeToggle } from "../../components/DashboardComponents/theme-toggle"

// const PageNav = ({ exams, mood }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuthStore();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const navigationItems = [
//     { name: 'Dashboard', path: '/user/dashboard' },
//     { name: 'Study', path: '/user/study' },
//     { name: 'Practice', path: '/user/practice' },
//   ];

//   const isActiveRoute = (path) => location.pathname === path;

//   return (
//     <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
//       <div className="max-w-7xl mx-auto px-">
//         <div className="flex justify-between items-center h-16">

//           <span className='flex gap-4 '>
//           {/* Logo Section */}
//           <div className="flex items-center border-r-2 px-">
//             <Link to="/" className="flex items-center gap-3">
//               <img
//                 src={Logo}
//                 alt="Fillop Tech"
//                 width={32}
//                 height={32}
//                 className="flex-shrink-0"
//               />
//               <div>
//                 <span className="md:text-2xl font-semibold text-primary  duration-200">
//                   Fillop Tech
//                 </span>
//                 <p className="text-[6.5px] text-destructive/100 ">
//                   Simplifying your tech experience...
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* Exams and Mood Section */}
//           <div className="self-end">
//             <div className="text-left ">
            
//               <span className="text-2xl font-semibold text-red-500  ">
//                 {mood} Mode
//               </span>
//               <span className="text-sm  text-gray-900 dark:text-white px-1">
//                 {exams} 
//               </span>
//             </div>
//           </div>
//           </span>

        

//           {/* User Section */}
//           <div className="flex items-center space-x-4">

//              {/* Theme Toggle */}
//              <ThemeToggle />

//             {/* User Info */}
//             <div className="hidden sm:flex items-center space-x-2">
//               <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <User className="h-4 w-4 text-white" />
//               </div>
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 {user?.firstName || 'User'}
//               </span>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
//               title="Logout"
//             >
//               <LogOut className="h-4 w-4" />
//             </button>

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            
//             {/* Exams Info Mobile */}
//             <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
//               <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                 {exams || "JAMB"} - {mood || "Learning"} Mode
//               </div>
//             </div>

//             {/* Navigation Links */}
//             <div className="space-y-1 py-2">
//               {navigationItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => {
//                     navigate(item.path);
//                     setIsMenuOpen(false);
//                   }}
//                   className={`block w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
//                     isActiveRoute(item.path)
//                       ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
//                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   {item.name}
//                 </button>
//               ))}
//             </div>

//             {/* User Info Mobile */}
//             <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
//               <div className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
//                 <User className="h-4 w-4 mr-2" />
//                 {user?.firstName} {user?.lastName}
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default PageNav;

// components/PageNav.jsx
import { useEffect, useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Logo from "../../assets/images/fillopsLogo.png";
import { ThemeToggle } from "../DashboardComponents/theme-toggle";

export default function PageNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [examType, setExamType] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [ready, setReady] = useState(false);

  /* ===============================
     LOAD LOCAL STORAGE (SAFE)
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setExamType(localStorage.getItem("exams") || "JAMB");
      setStudyMode(localStorage.getItem("studyMode") || "Learning");
      setReady(true);
    }, 10000); // allows skeleton to appear

    return () => clearTimeout(timer);
  }, []);

  const navigationItems = [
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "Study", path: "/user/study" },
    { name: "Practice", path: "/user/practice" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ===============================
     SKELETON NAV (ALWAYS EXITS)
  =============================== */
  if (!ready) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-28 bg-gray-300 rounded animate-pulse" />
              <div className="h-2 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  /* ===============================
     MAIN NAV
  =============================== */
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-0">    
        <div className="h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-2 md:gap-6">
                     {/* Logo Section */}
           <div className="flex items-center border-r-2 pr-2 md:pr-6 dark:border-gray-700">
             <Link to="/" className="flex items-center gap-3">
               <img
                src={Logo}
                alt="Fillop Tech"
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <div>
                <span className="md:text-2xl font-semibold text-primary  duration-200">
                  Fillop Tech
                </span>
                <p className="text-[7.5px] text-destructive/100 dark:text-red-500 ">
                  Simplifying your tech experience...
                </p>
              </div>
            </Link>
          </div>
            {/* Exam Info */}
            <div>
              <p className="text-[11px] font-semibold text-red-500">
                {studyMode} Mode
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {examType}
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* User */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName || "User"}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:block text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen((p) => !p)}
              className="md:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-2">
            {/* <div className="px-3 py-2 text-sm font-semibold">
              {examType} — {studyMode} Mode
            </div> */}

            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
