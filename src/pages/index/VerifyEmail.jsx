

import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const verified = searchParams.get("verified");
  const error = searchParams.get("error"); 
  const reason = searchParams.get("reason");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Checking verification status...");

  useEffect(() => {
    // -------------------------------------
    // SUCCESS (EXACT URL: ?verified=true)
    // -------------------------------------
    if (verified === "true") {
      setStatus("success");
      setMessage("Your email has been verified successfully.");

      toast({
        title: "Email Verified 🎉",
        description: "You can now log in to your account.",
      });

      return;
    }

    // -------------------------------------
    // FAILED (EXACT URL you pasted)
    // error = "verification_failed?reason=invalid-or-expired"
    // reason = null
    // -------------------------------------
    if (error === "verification_failed?reason=invalid-or-expired") {
      setStatus("error");
      setMessage("Verification link is invalid or expired.");

      toast({
        variant: "destructive",
        title: "Verification Failed ❌",
        description: "Your verification link is invalid or expired.",
      });

      return;
    }

    // -------------------------------------
    // If backend ever sends ?reason=value
    // -------------------------------------
    if (reason) {
      setStatus("error");

      toast({
        variant: "destructive",
        title: "Email Verification Failed",
        description: reason.replace(/-/g, " "),
      });

      switch (reason) {
        case "invalid-or-expired":
          setMessage("Verification link is invalid or expired.");
          break;
        case "missing-token":
          setMessage("Verification token is missing.");
          break;
        default:
          setMessage(reason.replace(/-/g, " "));
      }

      return;
    }

    // DEFAULT
    setStatus("loading");
    setMessage("Checking verification status...");
  }, [verified, error, reason, toast]);

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
              ? "Verification link is invalid or expired. Please request a new one. ❌"
              : "Verifying..."}
          </h1>

          <p className="text-gray-600 dark:text-gray-400">{message}</p>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
