//   import { Mail, Lock, User, Globe, Eye, EyeOff, Loader2 } from "lucide-react";
//   import { motion } from "framer-motion";
//   import { useForm } from "react-hook-form";
//   import { z } from "zod";
//   import { zodResolver } from "@hookform/resolvers/zod";
//   import Logo from "../../assets/images/fillopsLogo.png";
//   import { useState } from "react";
//   import { Icon } from "@iconify/react";
//   import { useNavigate } from "react-router-dom";
//   import useAuthStore from "../../store/authStore";

//   // ✅ Schema
//   const schema = z
//     .object({
//       firstName: z.string().min(1, "First name is required"),
//       lastName: z.string().min(1, "Last name is required"),
//       email: z.string().email("Invalid email address"),
//       password: z.string().min(6, "Password must be at least 6 characters"),
//       confirmPassword: z.string().min(6, "Please confirm your password"),
//       phoneNumber: z.string().min(10, "Phone number is required"),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Passwords do not match",
//       path: ["confirmPassword"],
//     });

//   const Register = () => {
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
    
//     // Use auth store
//     const { register: registerUser, loading, error, success, clearMessages } = useAuthStore();

//     const {
//       register,
//       handleSubmit,
//       formState: { errors },
//       reset,
//     } = useForm({ resolver: zodResolver(schema) });

//     const onSubmit = async (data) => {
//       // Clear previous messages
//       clearMessages?.();
      
//       const { confirmPassword, ...payload } = data;

//       const result = await registerUser(payload);
      
//       if (result?.success) {
        
//         reset();
//         setTimeout(() => navigate("/login"), 1500);
//       }
//     };

//   // You can also use the error and success states from the store in your JSX
//   // const { error, success } = useAuthStore();



//   return (
//     <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
//       <motion.div
//         initial={{ opacity: 0, y: 60 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative w-full max-w-md bg-white dark:bg-background border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 overflow-hidden"
//       >
       
//         {/* ===== Decorative Star Image (Embedded Glow) ===== */}
//         <div className="absolute -top-11 -right-9 w-32 h-32">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1 }}
//             className="relative"
//           >
//             {/*  Star Glow Backdrop */}
//             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-pink-200 to-transparent blur-2xl opacity-100 rounded-full"></div>

//             {/* ✨ Twinkling light points */}
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

//             {/* 🌠 Star-Shaped Image */}
//             <div
//               className="relative w-32 h-32 "
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


//         {/* Logo */}
//         <div className="flex justify-center mb-3">
//           <img
//             src={Logo}
//             alt="App Logo"
//             className="h-14 w-14 rounded-full shadow-md border border-gray-300 dark:border-gray-600 object-cover"
//           />
//         </div>

//         {/* Header */}
//         <div className="text-center mb-3">
//           <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
//             Create Account
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 text-sm">
//             Join us and access your dashboard instantly
//           </p>
//         </div>

//         {/* Error & Success Messages */}
//         {success && (
//           <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
//         )}
//         {error && (
//           <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//           {/* First Name */}
//           <div className="relative">
//             <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//             <input
//               {...register("firstName")}
//               type="text"
//               placeholder="First Name"
//               className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
//             />
//             {errors.firstName && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.firstName.message}
//               </p>
//             )}
//           </div>

//           {/* Last Name */}
//           <div className="relative">
//             <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//             <input
//               {...register("lastName")}
//               type="text"
//               placeholder="Last Name"
//               className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
//             />
//             {errors.lastName && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.lastName.message}
//               </p>
//             )}
//           </div>

//           {/* Email */}
//           <div className="relative">
//             <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//             <input
//               {...register("email")}
//               type="email"
//               placeholder="Email Address"
//               className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Password with Eye */}
//           <div className="relative">
//             <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//             <input
//               {...register("password")}
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password with Eye */}
//           <div className="relative">
//             <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//             <input
//               {...register("confirmPassword")}
//               type={showConfirm ? "text" : "password"}
//               placeholder="Confirm Password"
//               className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//             >
//             </button>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           {/* Phone */}
//           <div className="relative">
//             <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//             <input
//               {...register("phoneNumber")}
//               type="tel"
//               placeholder="Phone Number"
//               className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
//             />
//             {errors.phoneNumber && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.phoneNumber.message}
//               </p>
//             )}
//           </div>

//           {/* Submit */}
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
//                 <Loader2 className="w-4 h-4 animate-spin" /> Registering...
//               </>
//             ) : (
//               "Register"
//             )}
//           </button>

//           {/* Link */}
//           <div className="text-center mt-2">
//             <p
//               onClick={() => navigate("/login")}
//               className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm cursor-pointer"
//             >
//               Already have an account? Sign in
//             </p>
//           </div>
//         </form>

//               {/* ===== Social Login Section ===== */}
//       <div className="mt-8">
//         {/* Divider */}
//         <div className="flex items-center justify-center">
//           <span className="h-[1px] w-1/4 bg-gray-300"></span>
//           <span className="px-3 text-gray-400 text-sm">or sign in with</span>
//           <span className="h-[1px] w-1/4 bg-gray-300"></span>
//         </div>

//         {/* Social Login Buttons */}
//         <div className="flex items-center justify-center gap-6 mt-6">
//           {/* Google */}
//           <a
//             href="https://www.google.com/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition transform hover:scale-105"

//           >
//             <Icon icon="logos:google-icon" className="h-4 w-4" />
//           </a>

//          {/* Apple (iOS) */}
//         <a
//           href="https://www.apple.com/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="p-2.5 rounded-full border border-gray-300 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-110"
//         >
//           <Icon icon="mdi:apple" className="h-4 w-4 text-black dark:text-white" />
//         </a>


//           {/* Facebook */}
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

//         {/* Footer */}
//         <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
//           © {new Date().getFullYear()} CBT Project. All rights reserved.
//         </p>
//       </motion.div>
//     </section>
//   );
// };

// export default Register;


import { Mail, Lock, User, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "../../assets/images/fillopsLogo.png";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

// ✅ Schema
const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    phoneNumber: z.string().min(10, "Phone number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ✅ Email Verification Notice Component
const EmailVerificationNotice = ({ email }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 text-center w-full max-w-md"
    >
      <MailCheck className="mx-auto h-12 w-12 text-indigo-600" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-3">
        Verify Your Email
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
        We’ve sent a verification link to:
      </p>
      <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
        {email}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
        Please check your inbox or spam folder and click the link to activate your account.
      </p>
    </motion.div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Use auth store
  const { register: registerUser, loading, error, success, clearMessages } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    clearMessages?.();

    const { confirmPassword, ...payload } = data;

    const result = await registerUser(payload);

    if (result?.success) {
      setRegisteredEmail(payload.email);
      setShowVerifyNotice(true);
      reset();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      {showVerifyNotice ? (
        <EmailVerificationNotice email={registeredEmail} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md bg-white dark:bg-background border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 overflow-hidden"
        >
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img
              src={Logo}
              alt="App Logo"
              className="h-14 w-14 rounded-full shadow-md border border-gray-300 dark:border-gray-600 object-cover"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Join us and access your dashboard instantly
            </p>
          </div>

          {/* Error & Success Messages */}
          {success && (
            <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
          )}
          {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* First Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                {...register("phoneNumber")}
                type="tel"
                placeholder="Phone Number"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Submit */}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Link */}
            <div className="text-center mt-2">
              <p
                onClick={() => navigate("/login")}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm cursor-pointer"
              >
                Already have an account? Sign in
              </p>
            </div>
          </form>
        </motion.div>
      )}
    </section>
  );
};

export default Register;
