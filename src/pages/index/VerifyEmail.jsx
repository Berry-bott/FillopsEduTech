
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");
  const reason = searchParams.get("reason");
  const token = searchParams.get("token");
  console.log(reason);
  console.log(verifiesd);
  

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Checking verification status...");

  useEffect(() => {
    // Hide token immediately for security
    if (token) {
      window.history.replaceState({}, document.title, "/verify-email");
    }

    // Backend indicates success
    if (verified === "true") {
      setStatus("success");
      setMessage("Email verified successfully! Redirecting to login...");
      console.log("Email verified successfully! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"), 500);
      return;
    }

    // Backend indicates failure
    if (verified === "false") {
      setStatus("error");
      setMessage(reason || "Verification failed.");
      console.log(reason || "Verification failed.");
      
      return;
    }

    // No query param → assume backend verified instantly
    // if (!verified) {
    //   setStatus("success");
    //   setMessage("Email verified! Redirecting to login...");
    //   setTimeout(() => (window.location.href = "/login"), 500);
    //   return;
    // }
  }, [verified, reason, token]);

  // Show blank page immediately if token exists
  // if (token && status === "loading") return null;

  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Mail className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          {renderIcon()}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {status === "success"
              ? "Email Verified 🎉"
              : status === "error"
              ? "Verification Failed"
              : "Verifying..."}
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
