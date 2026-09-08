import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Logo from "../../assets/images/fillopsLogo.png";
import useTutorAuthStore from "@/store/tutorAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import CookieConsent, { hasCookieConsent } from "@/components/CookieConsent";

const tutorLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const TutorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, isAuthenticated } = useTutorAuthStore(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tutorLoginSchema),
  });

  // ✅ Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tutor/dashboard", { replace: true });
    }
  }, [isAuthenticated]);

  const onSubmit = async (formData) => {
  if (!hasCookieConsent()) {
    setError("Please accept the Cookie Policy before signing in.");
    return;
  }
  setError("");

  try {
    const res = await login(formData);

    if (res?.success) {
      toast({
        title: "Welcome back! 👨‍🏫",
        description: "Successfully logged in as tutor.",
      });

      // ✅ Only fetch profile if login succeeded
      const profileRes = await getProfile(res.data.accessToken);
      if (profileRes.success) {
        useTutorAuthStore.getState().setTutor(profileRes.data);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      navigate("/tutor/dashboard", { replace: true });
      return;
    }

    // ✅ Handle failed login properly
    setError(res?.message || "Invalid email or password");
  } catch (error) {
    console.error("Tutor login error:", error);
    setError("Network error. Please check your connection.");
  }
};

  // ✅ Don't render form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-sm bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg px-6 py-12 overflow-hidden transition-colors duration-300"
      >
        {/* ===== Decorative Star Image ===== */}
        <div className="absolute -top-11 -right-9 w-32 h-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 via-blue-200 to-transparent blur-2xl opacity-100 rounded-full"></div>
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
            <div
              className="relative w-32 h-32"
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=1080&fit=crop"
                alt="Decorative"
                className="w-full h-full object-cover shadow-lg border border-white"
              />
            </div>
          </motion.div>
        </div>

        {/* ===== Logo & Badge ===== */}
        <div className="flex justify-center mb-3 relative">
          <div className="relative">
            <img
              src={Logo}
              alt="App Logo"
              className="h-14 w-14 rounded-full shadow-md object-cover"
            />
            {/* Tutor Badge */}
            <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1.5 shadow-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* ===== Header ===== */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome Back <span className="text-purple-600 dark:text-purple-400">Tutor</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Sign in to your tutor dashboard
          </p>
        </div>

        {/* ===== Form ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type="email"
              placeholder="Tutor Email Address"
              {...register("email")}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
                errors.password
                  ? "border-red-400"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
            >
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            </motion.div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                Log In as Tutor
              </>
            )}
          </button>

          {/* Links */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
              Forgot Password?
            </p>
            <p
              onClick={() => navigate("/tutor/register")}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline cursor-pointer"
            >
              Register as Tutor
            </p>
          </div>

          {/* Terms of Use */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
            By signing in, you agree to our{" "}
            <a
              href="/terms#your-content"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline font-medium"
            >
              Terms of Use
            </a>
          </p>

          {/* Switch to Student Login */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Not a tutor?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer font-medium"
              >
                Student Login
              </span>
            </p>
          </div>
        </form>

        {/* ===== Footer ===== */}
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-6">
          © {new Date().getFullYear()} CBT Project. All rights reserved.
        </p>
      </motion.div>
      <CookieConsent />
    </section>
  );
};

export default TutorLogin;