
// RootLayout.jsx
import React from "react";
import "./globals.css"; // keep your global styles

export default function RootLayout({ children }) {
  return (
    <div className="font-sans antialiased">
      {children}
    </div>
  );
}
