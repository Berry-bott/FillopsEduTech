// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
// import { Mail, Lock, User, Eye, EyeOff, MailCheck, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Logo from "../../assets/images/fillopsLogo.png";
// import useAuthStore from "../../store/authStore"; 
// import { useToast } from "@/components/ui/use-toast";

// // ----------------------------------------
// // VALIDATION
// // ----------------------------------------
// const schema = z
//   .object({
//     firstName: z.string().min(1, "First name is required"),
//     lastName: z.string().min(1, "Last name is required"),
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Please confirm your password"),
//     phoneNumber: z.string().min(10, "Phone number is required"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// // ----------------------------------------
// // EMAIL VERIFICATION NOTICE COMPONENT
// // ----------------------------------------
// const EmailVerificationNotice = ({ email }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7 }}
//       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 text-center w-full max-w-md"
//     >
//       <MailCheck className="mx-auto h-12 w-12 text-indigo-600" />

//       <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-3">
//         Verify Your Email
//       </h2>

//       <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
//         We've sent a verification link to:
//       </p>

//       <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
//         {email}
//       </p>

//       <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
//         Please check your inbox or spam folder and click the link to activate your account.
//       </p>
//     </motion.div>
//   );
// };

// const defaultValues = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
//   phoneNumber: "",
// };

// // ----------------------------------------
// // MAIN REGISTER COMPONENT
// // ----------------------------------------

// const Register = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const location = useLocation();
//   const { toast } = useToast();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showVerifyNotice, setShowVerifyNotice] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");
//   const {
//     register: registerUser,
//     loading,
//     error,
//     success,
//     clearMessages,
//   } = useAuthStore();

//   const [formKey, setFormKey] = useState(Date.now());

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({ resolver: zodResolver(schema),   defaultValues });

//   // ----------------------------------------
//   // HANDLE REDIRECT MESSAGES (error + verified)
//   // ----------------------------------------
//   useEffect(() => {
//     reset(defaultValues);
//     clearMessages?.();
//   }, [reset, clearMessages, formKey]);

//   useEffect(() => {
//     const verified = searchParams.get("verified");
//     const errorParam = searchParams.get("error");
//     const reason = searchParams.get("reason");

//     console.log("URL Params:", { verified, errorParam, reason }); // Debug log

//     // ✅ If user returns from email link with verified=true
//     if (verified === "true") {
//       reset();
//       clearMessages?.();

//       toast({
//         title: "Email Verified 🎉",
//         description: "You can now log in to your account.",
//       });

//       // Clear URL params after showing toast
//       navigate(location.pathname, { replace: true });
//     }

//     // ❌ Verification failed or any other error
//     if (errorParam) {
//       reset(); // Clear all input fields
//       clearMessages?.(); // Clear store messages
      
//       let title = "Error";
//       let description = "Your verification link is invalid or has expired. Please request a new verification email.";
      
//       // Customize messages based on error reason
//       if (errorParam === "verification_failed") {
//         title = "Verification Failed";
//         if (reason === "invalid-or-expired") {
//           description = "Your verification link is invalid or has expired. Please request a new verification email.";
//         } else if (reason) {
//           // Convert kebab-case to readable text
//           description = reason.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
//         }
//       } else if (reason) {
//         // Handle other error reasons
//         description = reason.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
//       }

//       toast({
//         variant: "destructive",
//         title: `${title} ❌`,
//         description,
//       });

//       // Clear URL params after showing toast
//       navigate(location.pathname, { replace: true });
//     }
//   }, [searchParams, reset, clearMessages, toast, navigate, location]);

//   const onSubmit = async (data) => {
//     clearMessages?.();

//     const { confirmPassword, ...payload } = data;

//     console.log("Submitting form..."); // Debug log

//     try {
//       const result = await registerUser(payload);

//       if (result?.success) {
//         reset(defaultValues);
//         setRegisteredEmail(payload.email);
//         setShowVerifyNotice(true);

//         toast({
//           title: "Registration Successful",
//           description: "Check your email to verify your account 🔐",
//         });
//         key={formKey}
//       } else if (error) {
//         // Show error from auth store if registration fails
//         toast({
//           variant: "destructive",
//           title: "Registration Failed",
//           description: error || "Please check your details and try again.",
//         });
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//       toast({
//         variant: "destructive",
//         title: "Registration Failed",
//         description: "An unexpected error occurred. Please try again.",
//       });
//     }
//   };

//   // ----------------------------------------
//   // SHOW EMAIL VERIFICATION PAGE IF NEEDED
//   // ----------------------------------------
//   if (showVerifyNotice) {
//     return (
//       <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
//         <EmailVerificationNotice email={registeredEmail} />
//       </section>
//     );
//   }

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, MailCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../../store/authStore"; 
import { useToast } from "@/components/ui/use-toast";
import Logo from "../../assets/images/fillopsLogo.png";

// ----------------------------------------
// VALIDATION
// ----------------------------------------
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

// ----------------------------------------
// EMAIL VERIFICATION NOTICE COMPONENT
// ----------------------------------------
const EmailVerificationNotice = ({ email }) => (
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
      We've sent a verification link to:
    </p>
    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{email}</p>
    <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
      Please check your inbox or spam folder and click the link to activate your account.
    </p>
  </motion.div>
);

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
};

// ----------------------------------------
// MAIN REGISTER COMPONENT
// ----------------------------------------
// ----------------------------------------
// MAIN REGISTER COMPONENT
// ----------------------------------------
const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { register: registerUser, loading, error, success, clearMessages } = useAuthStore();

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // -----------------------------
  // Reset form on mount
  // -----------------------------
  useEffect(() => {
    reset(defaultValues); // ensures all fields are empty on load
    clearMessages?.();
  }, [reset, clearMessages]);

  // -----------------------------
  // Handle URL param messages
  // -----------------------------
  useEffect(() => {
    const verified = searchParams.get("verified");
    const errorParam = searchParams.get("error");
    const reason = searchParams.get("reason");

    if (verified === "true") {
      reset(defaultValues);  // clear form
      clearMessages?.();

      toast({
        title: "Email Verified 🎉",
        description: "You can now log in to your account.",
      });

      navigate(location.pathname, { replace: true });
    }

    if (errorParam) {
      reset(defaultValues); // clear form
      clearMessages?.();

      let title = "Error";
      let description = "Your verification link is invalid or has expired.";

      if (errorParam === "verification_failed") {
        title = "Verification Failed";
        if (reason === "invalid-or-expired") {
          description = "Your verification link is invalid or has expired. Please request a new verification email.";
        } else if (reason) {
          description = reason.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        }
      } else if (reason) {
        description = reason.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      }

      toast({
        variant: "destructive",
        title: `${title} ❌`,
        description,
      });

      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, reset, clearMessages, toast, navigate, location]);

  // -----------------------------
  // Submit handler
  // -----------------------------
  const onSubmit = async (data) => {
    clearMessages?.();
    const { confirmPassword, ...payload } = data;

    try {
      const result = await registerUser(payload);

      if (result?.success) {
        reset(defaultValues);  // clear form
        setRegisteredEmail(payload.email);
        setShowVerifyNotice(true);

        toast({
          title: "Registration Successful",
          description: "Check your email to verify your account 🔐",
        });
      } else if (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error || "Please check your details and try again.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // -----------------------------
  // Show email verification notice
  // -----------------------------
  if (showVerifyNotice) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
        <EmailVerificationNotice email={registeredEmail} />
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white dark:bg-background border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 overflow-hidden"
      >

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
    </section>
  );
};

export default Register;