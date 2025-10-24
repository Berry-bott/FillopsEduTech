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
} from "lucide-react"
import logo from "../../assets/images/fillops-logo.png"

export default function Navbar({ user, currentPage, onNavigate, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications] = useState([
    { id: 1, text: "New course added: Advanced Physics" },
    { id: 2, text: "You’ve completed your English quiz!" },
  ])

  const toggleDropdown = () => setShowDropdown((prev) => !prev)
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev)
  const isAdmin = user?.role === "admin"

  // Helper for fallback avatar
  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=0D8ABC&color=fff`

  return (
    <nav className="border-b border-border bg-card backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* === Left: Logo + Links === */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Fillop"
              className="w-8 h-8 rounded-md object-cover"
            />
            <h1 className="text-xl font-bold text-primary">Fillop</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 ml-8">
            {!isAdmin ? (
              <>
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
              </>
            ) : (
              <NavButton
                label="Admin Panel"
                active={currentPage === "admin"}
                onClick={() => onNavigate?.("admin")}
              />
            )}
          </div>
        </div>

        {/* === Right: Notification + Profile + Mobile === */}
        <div className="flex items-center gap-3">
          {/* 🔔 Notifications */}
          <div className="relative">
            <button
              className="relative p-2 rounded-lg hover:bg-blue-100 transition"
              onClick={() => alert("Notifications panel coming soon")}
            >
              <Bell className="w-6 h-6 text-blue-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>

          {/* 👤 Profile Avatar */}
          <div className="relative hidden md:block">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition"
            >
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-blue-300"
              />
              <ChevronDown className="w-4 h-4 text-blue-600" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 border-b">
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
                <DropdownItem
                  icon={<UserIcon className="w-4 h-4" />}
                  label="Profile"
                  onClick={() => {
                    onNavigate?.("profile")
                    setShowDropdown(false)
                  }}
                />
                <DropdownItem
                  icon={<Settings className="w-4 h-4" />}
                  label="Settings"
                  onClick={() => {
                    onNavigate?.("settings")
                    setShowDropdown(false)
                  }}
                />
                <DropdownItem
                  icon={<LogOut className="w-4 h-4" />}
                  label="Logout"
                  destructive
                  onClick={() => {
                    onLogout?.()
                    setShowDropdown(false)
                  }}
                />
              </div>
            )}
          </div>

          {/* 🍔 Mobile Menu */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-blue-100 transition"
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
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-4 animate-fadeIn">
          {!isAdmin ? (
            <>
              <NavButton
                label="Dashboard"
                active={currentPage === "dashboard"}
                onClick={() => {
                  onNavigate?.("dashboard")
                  setShowMobileMenu(false)
                }}
                mobile
              />
              <NavButton
                label="Community"
                active={currentPage === "community"}
                onClick={() => {
                  onNavigate?.("community")
                  setShowMobileMenu(false)
                }}
                mobile
              />
            </>
          ) : (
            <NavButton
              label="Admin Panel"
              active={currentPage === "admin"}
              onClick={() => {
                onNavigate?.("admin")
                setShowMobileMenu(false)
              }}
              mobile
            />
          )}

          {/* Mobile Profile Info */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-3">
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-blue-300"
              />
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
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

/* 🔹 Reusable NavButton */
function NavButton({ label, active, onClick, mobile }) {
  const base =
    "block w-full text-left px-4 py-2 rounded-lg transition font-medium"
  const activeClass = active
    ? "bg-blue-600 text-white"
    : "text-foreground hover:bg-blue-100 hover:text-blue-700"
  const size = mobile ? "text-base" : "text-sm"
  return (
    <button onClick={onClick} className={`${base} ${activeClass} ${size}`}>
      {label}
    </button>
  )
}

/* 🔹 Reusable DropdownItem */
function DropdownItem({ icon, label, onClick, destructive }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${
        destructive ? "text-red-600 hover:bg-red-50" : "text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
