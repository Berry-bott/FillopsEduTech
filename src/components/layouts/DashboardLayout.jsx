// src/layouts/DashboardLayout.jsx
"use client"

import Navbar from "../DashboardComponents/Navbar"

export default function DashboardLayout({ user, currentPage, onNavigate, onLogout, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
