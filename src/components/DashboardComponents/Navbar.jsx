

"use client"

import { useState } from "react"
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  BookOpen,
  Download,
} from "lucide-react"
import logo from "../../assets/images/fillops-logo.png"

export default function Navbar({ user, currentPage, onNavigate, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications] = useState([
    { id: 1, text: "New course added: Advanced Physics" },
    { id: 2, text: "You’ve completed your English quiz!" },
  ])

  const toggleDropdown = () => setShowDropdown((p) => !p)
  const toggleMobileMenu = () => setShowMobileMenu((p) => !p)
  const isAdmin = user?.role === "admin"

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=2563eb&color=fff`

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* === Left: Logo + Links === */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="Fillop" className="w-8 h-8 rounded-md" />
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Fillop
            </h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 ml-6">
            <NavButton
              label="Dashboard"
              active={currentPage === "dashboard"}
              onClick={() => onNavigate?.("dashboard")}
            />
            <NavButton
              label="Community"
              active={currentPage === "community"}
              onClick={() => onNavigate?.("community")}
            />
            <NavButton
              label="Study for WAEC/NECO"
              icon={<BookOpen className="w-4 h-4" />}
              onClick={() => onNavigate?.("waec")}
            />
            <NavButton
              label="Study for JAMB/PUTME"
              icon={<BookOpen className="w-4 h-4" />}
              onClick={() => onNavigate?.("jamb")}
            />
            <NavButton
              label="Install CBT Guru"
              icon={<Download className="w-4 h-4" />}
              highlight
              onClick={() => alert("Installing CBT Guru...")}
            />
          </div>
        </div>

        {/* === Right: Notification + Profile + Mobile === */}
        <div className="flex items-center gap-3">
          {/* 🔔 Notifications */}
          <button className="relative p-2 rounded-full hover:bg-blue-50 transition">
            <Bell className="w-6 h-6 text-blue-600" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* 👤 Profile */}
          <div className="relative hidden md:block">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition"
            >
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-blue-300"
              />
              <ChevronDown className="w-4 h-4 text-blue-600" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-blue-50">
                  <p className="font-semibold text-sm text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <DropdownItem
                  icon={<UserIcon className="w-4 h-4" />}
                  label="Profile"
                  onClick={() => onNavigate?.("profile")}
                />
                <DropdownItem
                  icon={<Settings className="w-4 h-4" />}
                  label="Settings"
                  onClick={() => onNavigate?.("settings")}
                />
                <DropdownItem
                  icon={<LogOut className="w-4 h-4" />}
                  label="Logout"
                  destructive
                  onClick={onLogout}
                />
              </div>
            )}
          </div>

          {/* 🍔 Mobile Menu */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-blue-600" />
            ) : (
              <Menu className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* === Mobile Menu === */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 py-4 space-y-4 animate-fadeIn">
          <MobileLink label="Dashboard" onClick={() => onNavigate?.("dashboard")} />
          <MobileLink label="Community" onClick={() => onNavigate?.("community")} />
          <MobileLink label="Study for WAEC/NECO" onClick={() => onNavigate?.("waec")} />
          <MobileLink label="Study for JAMB/PUTME" onClick={() => onNavigate?.("jamb")} />
          <MobileLink
            label="Install CBT Guru"
            icon={<Download className="w-4 h-4" />}
            highlight
            onClick={() => alert("Installing CBT Guru...")}
          />

          <div className="border-t border-blue-100 pt-3">
            <div className="flex items-center gap-3">
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-blue-300"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-3 flex items-center gap-2 text-red-500 text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* 🔹 NavButton */
function NavButton({ label, icon, active, highlight, onClick }) {
  const base =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
  const activeClass = active
    ? "bg-blue-600 text-white"
    : highlight
    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md hover:opacity-90"
    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"

  return (
    <button onClick={onClick} className={`${base} ${activeClass}`}>
      {icon}
      {label}
    </button>
  )
}

/* 🔹 Dropdown Item */
function DropdownItem({ icon, label, destructive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-blue-50 transition ${
        destructive ? "text-red-600 hover:bg-red-50" : "text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

/* 🔹 MobileLink */
function MobileLink({ label, icon, highlight, onClick }) {
  const base =
    "flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition"
  const style = highlight
    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
  return (
    <button onClick={onClick} className={`${base} ${style}`}>
      {icon}
      {label}
    </button>
  )
}
