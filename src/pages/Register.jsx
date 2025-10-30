import { Mail, Lock, User, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "../assets/images/fillopsLogo.png";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
// Zod Schema
const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    // dateOfBirth: z.string().min(4, "Date of birth is required"),
    // state: z.string().min(1, "State is required"),
    // lga: z.string().min(1, "LGA is required"),
    // residentialAddress: z.string().min(3, "Address is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Backend API
const API_BASE = "https://fillops-server.onrender.com/api/auth";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
  
    try {
      // Exclude confirmPassword before sending
      const { confirmPassword, ...payload } = data;
  
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include" // optional
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Registration failed");
      }

      if (res.ok) {
        navigate("/verify-email"); // 👈 Redirect to a verification notice page
      }
      
  
      const result = await res.json();
      setSuccess("Registration successful! You can now login.");
      reset();
      console.log("Backend response:", result);

      // setTimeout(() => {
      //   navigate("/login");
      // }, 1500); // 1.5 seconds delay so user can see the success message

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-3xl p-8 overflow-hidden"

      >
        {/* ===== Decorative Star Image (Embedded Glow) ===== */}
        <div className="absolute -top-11 -right-9 w-32 h-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/*  Star Glow Backdrop */}
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
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="App Logo"
            className="h-16 w-16 rounded-full shadow-md border border-gray-200 object-cover"
          />
        </div>

        {/* ===== Header ===== */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Join us and access your dashboard instantly
          </p>
        </div>

                 {/* Success/Error */}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">{success}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          {/* <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("dateOfBirth")}
              type="date"
              placeholder="Date of Birth"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div> */}

          {/* State */}
          {/* <div className="relative">
            <Globe className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("state")}
              type="text"
              placeholder="State"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div> */}

          {/* LGA */}
          {/* <div className="relative">
            <Globe className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("lga")}
              type="text"
              placeholder="LGA"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.lga && (
              <p className="text-red-500 text-sm mt-1">{errors.lga.message}</p>
            )}
          </div> */}

          {/* Residential Address */}
          {/* <div className="relative">
            <Globe className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              {...register("residentialAddress")}
              type="text"
              placeholder="Residential Address"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors.residentialAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.residentialAddress.message}
              </p>
            )}
          </div> */}

          {/* Submit Button */}
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
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
          </button>

          {/* Already have account */}
          <div className="text-center mt-4">
            <a href="/login" className="text-indigo-600 hover:underline text-sm">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      
      {/* ===== Social Login Section ===== */}
      <div className="mt-8">
        {/* Divider */}
        <div className="flex items-center justify-center">
          <span className="h-[1px] w-1/4 bg-gray-300"></span>
          <span className="px-3 text-gray-400 text-sm">or sign in with</span>
          <span className="h-[1px] w-1/4 bg-gray-300"></span>
        </div>

        {/* Social Login Buttons */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {/* Google */}
          <a
            href="https://www.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50 transition transform hover:scale-110"
          >
            <Icon icon="logos:google-icon" className="h-5 w-5" />
          </a>

          {/* Apple (iOS) */}
          <a
            href="https://www.apple.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-gray-300 hover:border-black hover:bg-gray-100 transition transform hover:scale-110"
          >
            <Icon icon="logos:apple" className="h-5 w-5 text-black" />
          </a>

          {/* Facebook */}
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

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} CBT Project. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
};

export default Register;
