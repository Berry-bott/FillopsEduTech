import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api/auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("notice"); 
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // No token in URL → just show notice
      setStatus("notice");
      setMessage("Please check your email inbox and click the link to verify your account.");
      return;
    }

    // Has token → verify it
    const verifyEmail = async () => {
      setStatus("loading..");
      setMessage("Verifying your email...");

      try {
        const res = await fetch(`${API_BASE}/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully! Redirecting to login...");
          window.history.replaceState({}, document.title, "/verified");
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Invalid or expired token.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderIcon = () => {
    switch (status) {
      case "notice":
        return <Mail className="w-12 h-12 text-blue-500" />;
      case "loading":
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          {renderIcon()}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {status === "notice"
              ? "Confirm Your Email"
              : status === "success"
              ? "Email Verified 🎉"
              : status === "error"
              ? "Verification Failed"
              : "Please wait..."}
          </h1>

          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          {status === "error" && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
