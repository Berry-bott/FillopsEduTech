import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes"; // ✅ import the theme provider
import LandingPage from "@pages/LandingPage";
import UsersDashboard from "@pages/UserDashboard";
import Login from "@pages/Login";
import Register from "@pages/Register";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ Wrap everything with ThemeProvider */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UsersDashboard />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
