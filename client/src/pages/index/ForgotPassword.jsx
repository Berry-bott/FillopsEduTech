import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/fillopsLogo.png";
import { forgotPassword } from "../../api/auth";
import { useToast } from "@/components/ui/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());

      if (!res?.success) {
        const message = res?.message || "Unable to send password reset email.";
        setError(message);
        toast({
          title: "Reset request failed",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const message =
        res?.message || "We sent password reset instructions to your email.";
      setSuccess(message);
      toast({
        title: "Check your email",
        description: message,
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      const message = "Network error. Please check your connection and try again.";
      setError(message);
      toast({
        title: "Reset request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            Forgot Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter your email to get password reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
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
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center">
              {success}
            </p>
          )}

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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default ForgotPassword;
