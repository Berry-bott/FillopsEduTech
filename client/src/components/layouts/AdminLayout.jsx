// import React from "react";
// import "./globals.css";

// // You can include Google Fonts in index.html or via CSS
// // Example for globals.css:
// // @import url('https://fonts.googleapis.com/css2?family=Geist&family=Geist+Mono&display=swap');

// export default function RootLayout({ children }) {
//   return (
//     <div className="min-h-screen flex flex-col font-sans antialiased">
//       {/* Header placeholder */}
//       <header className="w-full bg-background border-b p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">EduAdmin</h1>
//         {/* You can add nav or user profile here */}
//       </header>

//       {/* Main content area */}
//       <main className="flex-1 w-full p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>

//       {/* Footer placeholder */}
//       <footer className="w-full border-t p-4 text-center text-sm text-muted-foreground">
//         &copy; {new Date().getFullYear()} EduAdmin. All rights reserved.
//       </footer>

//       {/* Analytics script placeholder */}
//       <script
//         async
//         defer
//         src="https://cdn.vercel-insights.com/script.js"
//         data-token="YOUR_ANALYTICS_TOKEN"
//       ></script>
//     </div>
//   );
// }


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
