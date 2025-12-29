
// import { Icon } from "@iconify/react";
// import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useEffect } from "react";
// import Logo from "../../assets/images/fillopsLogo.png";
// import useAuthStore from "../../store/authStore";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const Login = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { toast } = useToast();
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, loading } = useAuthStore();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   // 🔥 RUNS ONCE → handles backend redirect messages
//   useEffect(() => {
//     const verified = searchParams.get("verified");

//     if (verified === "true") {
//       toast({
//         title: "Email Verified 🎉",
//         description: "You can now log in to your account.",
//       });
//     }

//   }, []);

//   const onSubmit = async (formData) => {
//     setError("");

//     try {
//       const res = await login(formData);

//       // if (res?.success) {
//       //   navigate("/user/dashboard");
//       //   return;
//       // }
//       if (user.onboardingCompleted) {
//         navigate("/user/dashboard");
//         console.log("Onboarding  completed, redirecting to dashboard");
//       }else{
//           navigate("/onboarding");
//           console.log("Onboarding not completed, redirecting to /onboarding");
//       }

//       setError(res?.message || "Invalid email or password");
//     } catch (error) {
//       setError("Network error. Please check your connection.");
//     }
//   };  

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative w-full max-w-sm bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden transition-colors duration-300"
//       >
//         {/* ===== Decorative Star Image ===== */}
//         <div className="absolute -top-11 -right-9 w-32 h-32">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1 }}
//             className="relative"
//           >
//             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-pink-200 to-transparent blur-2xl opacity-100 rounded-full"></div>
//             {[...Array(6)].map((_, i) => (
//               <motion.span
//                 key={i}
//                 className="absolute bg-white rounded-full opacity-80"
//                 style={{
//                   top: `${Math.random() * 80}%`,
//                   left: `${Math.random() * 80}%`,
//                   width: `${Math.random() * 4 + 2}px`,
//                   height: `${Math.random() * 4 + 2}px`,
//                   filter: "blur(1px)",
//                 }}
//                 animate={{ opacity: [0.4, 1, 0.4] }}
//                 transition={{
//                   duration: Math.random() * 3 + 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               />
//             ))}
//             <div
//               className="relative w-32 h-32"
//               style={{
//                 clipPath:
//                   "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
//               }}
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop"
//                 alt="Decorative"
//                 className="w-full h-full object-cover shadow-lg border border-white"
//               />
//             </div>
//           </motion.div>
//         </div>

//         {/* ===== Logo ===== */}
//         <div className="flex justify-center mb-3">
//           <img
//             src={Logo}
//             alt="App Logo"
//             className="h-14 w-14 rounded-full shadow-md object-cover"
//           />
//         </div>

//         {/* ===== Header ===== */}
//         <div className="text-center mb-3">
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//             Welcome Back
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//             Sign in to continue to your dashboard
//           </p>
//         </div>

//         {/* ===== Form ===== */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Email */}
//           <div className="relative">
//             <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
//             <input
//               type="email"
//               placeholder="Email Address"
//               {...register("email")}
//               className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
//                 errors.email
//                   ? "border-red-400"
//                   : "border-gray-300 dark:border-gray-700"
//               }`}
//             />
//             {errors.email && (
//               <p className="text-xs text-red-500 mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Password with Eye Toggle */}
//           <div className="relative">
//             <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               {...register("password")}
//               className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
//                 errors.password
//                   ? "border-red-400"
//                   : "border-gray-300 dark:border-gray-700"
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-5 w-5" />
//               ) : (
//                 <Eye className="h-5 w-5" />
//               )}
//             </button>
//             {errors.password && (
//               <p className="text-xs text-red-500 mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Error Message */}
//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full flex items-center justify-center gap-2 ${
//               loading
//                 ? "bg-indigo-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700"
//             } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200`}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Logging in...
//               </>
//             ) : (
//               "Log In"
//             )}
//           </button>

//           {/* Links */}
//           <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
//             <p className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
//               Forgot Password?
//             </p>
//             <p
//               onClick={() => navigate("/register")}
//               className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
//             >
//               Create Account
//             </p>
//           </div>
//         </form>

//         {/* ===== Social Login ===== */}
//         <div className="mt-6">
//           <div className="flex items-center justify-center mb-4">
//             <span className="h-[1px] w-1/4 bg-gray-300 dark:bg-gray-700"></span>
//             <span className="px-2 text-gray-400 dark:text-gray-500 text-xs">
//               or sign in with
//             </span>
//             <span className="h-[1px] w-1/4 bg-gray-300 dark:bg-gray-700"></span>
//           </div>

//           <div className="flex items-center justify-center gap-4">
//             <a
//               href="https://www.google.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition transform hover:scale-105"
//             >
//               <Icon icon="logos:google-icon" className="h-4 w-4" />
//             </a>
//               {/* Apple (iOS) */}
//         <a
//           href="https://www.apple.com/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="p-2.5 rounded-full border border-gray-300 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-110"
//         >
//           <Icon icon="mdi:apple" className="h-4 w-4 text-black dark:text-white" />
//         </a>
//             <a
//               href="https://www.facebook.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition transform hover:scale-105"
//             >
//               <Icon icon="logos:facebook" className="h-4 w-4 text-blue-600" />
//             </a>
//           </div>
//         </div>

//         {/* ===== Footer ===== */}
//         <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-6">
//           © {new Date().getFullYear()} CBT Project. All rights reserved.
//         </p>
//       </motion.div>
//     </section>
//   );
// };

// export default Login;



// import { Icon } from "@iconify/react";
// import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useEffect } from "react";
// import Logo from "../../assets/images/fillopsLogo.png";
// import useAuthStore from "../../store/authStore";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const Login = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { toast } = useToast();
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
  
//   // ✅ Get both login function and loading state
//   const { login, loading } = useAuthStore();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   // 🔥 RUNS ONCE → handles backend redirect messages
//   useEffect(() => {
//     const verified = searchParams.get("verified");

//     if (verified === "true") {
//       toast({
//         title: "Email Verified 🎉",
//         description: "You can now log in to your account.",
//       });
//     }
//   }, [searchParams, toast]);

//   const onSubmit = async (formData) => {
//     setError("");

//     try {
//       const res = await login(formData);

//       // ✅ Check if login failed
//       if (!res?.success) {
//         setError(res?.message || "Invalid email or password");
//         return;
//       }

//       // ✅ Get user data from the response
//       const user = res.data?.user;

//       console.log("Login successful, user data:", user);

//       // ✅ Check onboarding status and redirect accordingly
//       if (user?.onboardingCompleted) {
//         console.log("Onboarding completed, redirecting to dashboard");
//         navigate("/user/dashboard", { replace: true });
//       } else {
//         console.log("Onboarding not completed, redirecting to preferences");
//         navigate("/onboarding", { replace: true });
//       }

//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Network error. Please check your connection.");
//     }
//   };

  // return (
  //   <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
  //     <motion.div
  //       initial={{ opacity: 0, y: 50 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.8 }}
  //       className="relative w-full max-w-sm bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden transition-colors duration-300"
  //     >
  //       {/* ===== Decorative Star Image ===== */}
  //       <div className="absolute -top-11 -right-9 w-32 h-32">
  //         <motion.div
  //           initial={{ opacity: 0, scale: 0.8 }}
  //           animate={{ opacity: 1, scale: 1 }}
  //           transition={{ duration: 1 }}
  //           className="relative"
  //         >
  //           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-pink-200 to-transparent blur-2xl opacity-100 rounded-full"></div>
  //           {[...Array(6)].map((_, i) => (
  //             <motion.span
  //               key={i}
  //               className="absolute bg-white rounded-full opacity-80"
  //               style={{
  //                 top: `${Math.random() * 80}%`,
  //                 left: `${Math.random() * 80}%`,
  //                 width: `${Math.random() * 4 + 2}px`,
  //                 height: `${Math.random() * 4 + 2}px`,
  //                 filter: "blur(1px)",
  //               }}
  //               animate={{ opacity: [0.4, 1, 0.4] }}
  //               transition={{
  //                 duration: Math.random() * 3 + 2,
  //                 repeat: Infinity,
  //                 ease: "easeInOut",
  //               }}
  //             />
  //           ))}
  //           <div
  //             className="relative w-32 h-32"
  //             style={{
  //               clipPath:
  //                 "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  //             }}
  //           >
  //             <img
  //               src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop"
  //               alt="Decorative"
  //               className="w-full h-full object-cover shadow-lg border border-white"
  //             />
  //           </div>
  //         </motion.div>
  //       </div>

  //       {/* ===== Logo ===== */}
  //       <div className="flex justify-center mb-3">
  //         <img
  //           src={Logo}
  //           alt="App Logo"
  //           className="h-14 w-14 rounded-full shadow-md object-cover"
  //         />
  //       </div>

  //       {/* ===== Header ===== */}
  //       <div className="text-center mb-3">
  //         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
  //           Welcome Back
  //         </h1>
  //         <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
  //           Sign in to continue to your dashboard
  //         </p>
  //       </div>

  //       {/* ===== Form ===== */}
  //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  //         {/* Email */}
  //         <div className="relative">
  //           <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
  //           <input
  //             type="email"
  //             placeholder="Email Address"
  //             {...register("email")}
  //             className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
  //               errors.email
  //                 ? "border-red-400"
  //                 : "border-gray-300 dark:border-gray-700"
  //             }`}
  //           />
  //           {errors.email && (
  //             <p className="text-xs text-red-500 mt-1">
  //               {errors.email.message}
  //             </p>
  //           )}
  //         </div>

  //         {/* Password with Eye Toggle */}
  //         <div className="relative">
  //           <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             placeholder="Password"
  //             {...register("password")}
  //             className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
  //               errors.password
  //                 ? "border-red-400"
  //                 : "border-gray-300 dark:border-gray-700"
  //             }`}
  //           />
  //           <button
  //             type="button"
  //             onClick={() => setShowPassword((prev) => !prev)}
  //             className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
  //           >
  //             {showPassword ? (
  //               <EyeOff className="h-5 w-5" />
  //             ) : (
  //               <Eye className="h-5 w-5" />
  //             )}
  //           </button>
  //           {errors.password && (
  //             <p className="text-xs text-red-500 mt-1">
  //               {errors.password.message}
  //             </p>
  //           )}
  //         </div>

  //         {/* Error Message */}
  //         {error && (
  //           <p className="text-red-500 text-sm text-center">{error}</p>
  //         )}

  //         {/* Login Button */}
  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className={`w-full flex items-center justify-center gap-2 ${
  //             loading
  //               ? "bg-indigo-400 cursor-not-allowed"
  //               : "bg-indigo-600 hover:bg-indigo-700"
  //           } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200`}
  //         >
  //           {loading ? (
  //             <>
  //               <Loader2 className="w-4 h-4 animate-spin" />
  //               Logging in...
  //             </>
  //           ) : (
  //             "Log In"
  //           )}
  //         </button>

  //         {/* Links */}
  //         <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
  //           <p className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
  //             Forgot Password?
  //           </p>
  //           <p
  //             onClick={() => navigate("/register")}
  //             className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
  //           >
  //             Create Account
  //           </p>
  //         </div>
  //       </form>

  //       {/* ===== Social Login ===== */}
  //       <div className="mt-6">
  //         <div className="flex items-center justify-center mb-4">
  //           <span className="h-[1px] w-1/4 bg-gray-300 dark:bg-gray-700"></span>
  //           <span className="px-2 text-gray-400 dark:text-gray-500 text-xs">
  //             or sign in with
  //           </span>
  //           <span className="h-[1px] w-1/4 bg-gray-300 dark:bg-gray-700"></span>
  //         </div>

  //         <div className="flex items-center justify-center gap-4">
  //           <a
  //             href="https://www.google.com/"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition transform hover:scale-105"
  //           >
  //             <Icon icon="logos:google-icon" className="h-4 w-4" />
  //           </a>
  //           {/* Apple (iOS) */}
  //           <a
  //             href="https://www.apple.com/"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="p-2.5 rounded-full border border-gray-300 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-110"
  //           >
  //             <Icon icon="mdi:apple" className="h-4 w-4 text-black dark:text-white" />
  //           </a>
  //           <a
  //             href="https://www.facebook.com/"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition transform hover:scale-105"
  //           >
  //             <Icon icon="logos:facebook" className="h-4 w-4 text-blue-600" />
  //           </a>
  //         </div>
  //       </div>

  //       {/* ===== Footer ===== */}
  //       <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-6">
  //         © {new Date().getFullYear()} CBT Project. All rights reserved.
  //       </p>
  //     </motion.div>
  //   </section>
  // );
// };

// export default Login;





import { Icon } from "@iconify/react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Logo from "../../assets/images/fillopsLogo.png";
import useAuthStore from "../../store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // ✅ Get both login function and loading state
  const { login, loading, accessToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // 🔥 RUNS ONCE → handles backend redirect messages
  useEffect(() => {
    const verified = searchParams.get("verified");

    if (verified === "true") {
      toast({
        title: "Email Verified 🎉",
        description: "You can now log in to your account.",
      });
    }
  }, [searchParams, toast]);

  // ✅ Check onboarding status from preferences endpoint
  const checkOnboardingStatus = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // If preferences endpoint returns 404 or error, user hasn't completed onboarding
        console.log("No preferences found, onboarding not completed");
        return false;
      }

      const data = await response.json();
      console.log("Preferences response:", data);

      // Check if onboardingCompleted is true in the response
      const onboardingCompleted = data.data?.onboardingCompleted || 
                                   data.data?.preferences?.onboardingCompleted ||
                                   false;

      console.log("Onboarding status:", onboardingCompleted);
      return onboardingCompleted;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // If there's an error, assume onboarding not completed
      return false;
    }
  };

  const onSubmit = async (formData) => {
    setError("");

    try {
      const res = await login(formData);

      // ✅ Check if login failed
      if (!res?.success) {
        setError(res?.message || "Invalid email or password");
        return;
      }

      // ✅ Get user data and token from the response
      const user = res.data?.user;
      const token = res.data?.accessToken || useAuthStore.getState().accessToken;

      console.log("Login successful, user data:", user);
      console.log("Access token:", token);

      // ✅ Check onboarding status from the user object first
      let onboardingCompleted = user?.onboardingCompleted || false;

      // 🔥 If not set in user object, check preferences endpoint
      if (!onboardingCompleted && token) {
        console.log("Checking preferences endpoint for onboarding status...");
        onboardingCompleted = await checkOnboardingStatus(token);
        
        // Update the store with the correct status
        if (onboardingCompleted) {
          useAuthStore.setState((state) => ({
            user: { ...state.user, onboardingCompleted: true }
          }));
        }
      }

      // ✅ Redirect based on onboarding status
      if (onboardingCompleted) {
        console.log("Onboarding completed, redirecting to dashboard");
        toast({
          title: "Welcome back! 👋",
          description: "You've been successfully logged in.",
        });
        navigate("/user/dashboard", { replace: true });
      } else {
        console.log("Onboarding not completed, redirecting to preferences");
        toast({
          title: "Welcome! 🎉",
          description: "Let's set up your preferences.",
        });
        navigate("/onboarding", { replace: true });
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection.");
      toast({
        title: "Login Failed",
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-sm bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden transition-colors duration-300"
      >
        {/* ===== Decorative Star Image ===== */}
        <div className="absolute -top-11 -right-9 w-32 h-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-pink-200 to-transparent blur-2xl opacity-100 rounded-full"></div>
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
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop"
                alt="Decorative"
                className="w-full h-full object-cover shadow-lg border border-white"
              />
            </div>
          </motion.div>
        </div>

        {/* ===== Logo ===== */}
        <div className="flex justify-center mb-3">
          <img
            src={Logo}
            alt="App Logo"
            className="h-14 w-14 rounded-full shadow-md object-cover"
          />
        </div>

        {/* ===== Header ===== */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* ===== Form ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
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
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
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
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>

          {/* Links */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
              Forgot Password?
            </p>
            <p
              onClick={() => navigate("/register")}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Create Account
            </p>
          </div>
        </form>

        {/* ===== Social Login ===== */}
        <div className="mt-6">
          <div className="flex items-center justify-center mb-4">
            <span className="h-[1px] w-1/4 bg-gray-300 dark:bg-gray-700"></span>
            <span className="px-2 text-gray-400 dark:text-gray-500 text-xs">
              or sign in with
            </span>
            <span className="h-[1px] w-1/4 bg-gray-300 dark:bg-gray-700"></span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition transform hover:scale-105"
            >
              <Icon icon="logos:google-icon" className="h-4 w-4" />
            </a>
            {/* Apple (iOS) */}
            <a
              href="https://www.apple.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-gray-300 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-110"
            >
              <Icon icon="mdi:apple" className="h-4 w-4 text-black dark:text-white" />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition transform hover:scale-105"
            >
              <Icon icon="logos:facebook" className="h-4 w-4 text-blue-600" />
            </a>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-6">
          © {new Date().getFullYear()} CBT Project. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
};

export default Login;