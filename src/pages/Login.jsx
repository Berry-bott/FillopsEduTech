import { Icon } from "@iconify/react";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Logo from "../assets/images/fillopsLogo.png";
import { CheckCircle, Loader2, XCircle } from "lucide-react";


// ✅ Validation Schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      console.log("Login success:", user);
  
      if (user && user.role) {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        console.warn("No role found in response:", user);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 overflow-hidden"
      >

       {/* ===== Decorative Star Image (Embedded Glow) ===== */}
      <div className="absolute -top-11 -right-9 w-32 h-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* 🌟 Star Glow Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-pink-200 to-transparent blur-2xl opacity-100 rounded-full"></div>

            {/* ✨ Twinkling light points */}
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute bg-white rounded-full opacity-80"
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  filter: "blur(1px)",
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* 🌠 Star-Shaped Image */}
            <div
              className="relative w-32 h-32 "
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop"
                alt="Decorative"
                className="w-full h-full object-cover shadow-lg border border-white"
              />
            </div>
          </motion.div>
        </div>

        {/* ===== Logo ===== */}
        <div className="flex justify-center mb-6 mt-6">
          <img
            src={Logo}
            alt="App Logo"
            className="h-16 w-16 rounded-full shadow-md object-cover"
          />
        </div>

        {/* ===== Header ===== */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* ===== Form ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className={`w-full pl-10 pr-3 py-3 border rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full pl-10 pr-3 py-3 border rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold py-3 rounded-lg shadow-md transition duration-200`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> {/* 🔄 Spinner animation */}
                    Logging in..
                  </>
                ) : (
                  "Log In"
                )}
          </button>
          {/* <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
          > {loading ? 
            (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in..
              </>
            ) : (
              "Log In"
            )}
          </button> */}

          {/* Links */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <a href="#" className="hover:text-indigo-600">
              Forgot Password?
            </a>
            <a href="/register" className="hover:text-indigo-600">
              Create Account
            </a>
          </div>
        </form>

        {/* ===== Social Login Section ===== */}
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <span className="h-[1px] w-1/4 bg-gray-300"></span>
            <span className="px-3 text-gray-400 text-sm">or sign in with</span>
            <span className="h-[1px] w-1/4 bg-gray-300"></span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <a
              href="https://www.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50 transition transform hover:scale-110"
            >
              <Icon icon="logos:google-icon" className="h-5 w-5" />
            </a>

            <a
              href="https://www.apple.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-gray-300 hover:border-black hover:bg-gray-100 transition transform hover:scale-110"
            >
              <Icon icon="logos:apple" className="h-5 w-5 text-black" />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition transform hover:scale-110"
            >
              <Icon icon="logos:facebook" className="h-5 w-5 text-blue-600" />
            </a>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} CBT Project. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
