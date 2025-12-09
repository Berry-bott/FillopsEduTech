// components/SimpleNav.jsx
import React, { useState } from 'react';
import { Menu, X, User, LogOut, BookOpen } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Logo from "../../assets/images/fillopsLogo.png"; 
import { ThemeToggle } from "../../components/DashboardComponents/theme-toggle"

const PageNav = ({ exams, mood }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/user/dashboard' },
    { name: 'Study', path: '/user/study' },
    { name: 'Practice', path: '/user/practice' },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-">
        <div className="flex justify-between items-center h-16">

          <span className='flex gap-4 '>
          {/* Logo Section */}
          <div className="flex items-center border-r-2 px-">
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
                <p className="text-[6.5px] text-destructive/100 ">
                  Simplifying your tech experience...
                </p>
              </div>
            </Link>
          </div>

          {/* Exams and Mood Section */}
          <div className="self-end">
            <div className="text-left ">
            
              <span className="text-2xl font-semibold text-red-500  ">
                {mood} Mode
              </span>
              <span className="text-sm  text-gray-900 dark:text-white px-1">
                {exams} 
              </span>
            </div>
          </div>
          </span>

        

          {/* User Section */}
          <div className="flex items-center space-x-4">

             {/* Theme Toggle */}
             <ThemeToggle />

            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            
            {/* Exams Info Mobile */}
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {exams || "JAMB"} - {mood || "Learning"} Mode
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1 py-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* User Info Mobile */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4 mr-2" />
                {user?.firstName} {user?.lastName}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PageNav;