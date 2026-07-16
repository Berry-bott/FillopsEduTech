import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../assets/images/fillopsLogo.png";
import { resetPassword } from "../../api/auth";
import { useToast } from "@/components/ui/use-toast";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password, confirmPassword }) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await resetPassword({ token, password, confirmPassword });

      if (!res?.success) {
        const message = res?.message || "Unable to reset password. The link may have expired.";
        setError(message);
        toast({
          title: "Reset failed",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const message = res?.message || "Password reset successful!";
      setSuccess(message);
      toast({
        title: "Password Reset Successful 🎉",
        description: "You can now log in with your new password.",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const message = "Network error. Please check your connection and try again.";
      setError(message);
      toast({
        title: "Reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If no token is present in the URL, show an error state
  if (!token) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-sm bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden transition-colors duration-300 text-center"
        >
          <div className="flex justify-center mb-3">
            <img
              src={Logo}
              alt="App Logo"
              className="h-14 w-14 rounded-full shadow-md object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200"
          >
            Request New Reset Link
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-sm bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden transition-colors duration-300"
      >
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        <div className="flex justify-center mb-3">
          <img
            src={Logo}
            alt="App Logo"
            className="h-14 w-14 rounded-full shadow-md object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Reset Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                errors.confirmPassword
                  ? "border-red-400"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm text-center">
              <CheckCircle2 className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!success}
            className={`w-full flex items-center justify-center gap-2 ${
              loading || success
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting...
              </>
            ) : success ? (
              "Redirecting to login..."
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default ResetPassword;