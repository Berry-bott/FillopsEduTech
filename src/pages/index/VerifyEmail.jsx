// import { useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { CheckCircle, Loader2, XCircle, Mail, X } from "lucide-react";

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();

//   const alreadyVerified = searchParams.get("alreadyVerified");
//   const reason = searchParams.get("reason");

//   const [status, setStatus] = useState("loading");
//   const [message, setMessage] = useState("Checking verification status...");
//   const [showDebug, setShowDebug] = useState(false); // New state for modal

//   useEffect(() => {
//     // Hide token immediately if it's still in the URL
//     // if (searchParams.get("token")) {
//     //   window.history.replaceState({}, document.title, "/verify-email");
//     //   return;
//     // }

//     if (verified === "true") {
//       setStatus("success");
//       setMessage("This email is already verified. Redirecting to login...");
//       return;
//     }

//     if (reason) {
//       setStatus("error");
//       switch (reason) {
//         case "missing-token":
//           setMessage("Verification token is missing.");
//           break;
//         case "invalid-or-expired":
//           setMessage("Verification link is invalid or expired. Please request a new one.");
//           break;
//         case "server-error":
//           setMessage("Server error occurred. Please try again later.");
//           break;
//         default:
//           setMessage(reason.replace(/-/g, " "));
//       }
//       return;
//     }
//   }, [reason, searchParams]);

//   const renderIcon = () => {
//     switch (status) {
//       case "loading":
//         return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
//       case "success":
//         return <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />;
//       case "error":
//         return <XCircle className="w-12 h-12 text-red-500" />;
//       default:
//         return <Mail className="w-12 h-12 text-gray-400" />;
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
//       <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700">
//         <div className="flex flex-col items-center space-y-4">
//           {renderIcon()}
//           <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//             {status === "success"
//               ? verified === "true"
//               ? "Email Verified 🎉"
//               : "Already Verified ✅"
//               : status === "error"
//               ? "Verification link is invalid or expired. Please request a new one."
//               : "Verifying..."}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">{message}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;



import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const verified = searchParams.get("verified"); 
  const reason = searchParams.get("reason");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Checking verification status...");

  useEffect(() => {
    // If backend says verified=true
    if (verified === "true") {
      setStatus("success");
      setMessage("Your email has been successfully verified. Redirecting...");
      return;
    }

    // If backend sends an error reason
    if (reason) {
      setStatus("error");
      switch (reason) {
        case "missing-token":
          setMessage("Verification token is missing.");
          break;
        case "invalid-or-expired":
          setMessage("Verification link is invalid or expired.");
          break;
        case "server-error":
          setMessage("A server error occurred. Please try again.");
          break;
        default:
          setMessage(reason.replace(/-/g, " "));
      }
      return;
    }

    // Otherwise still checking
    setStatus("loading");
    setMessage("Checking verification status...");
  }, [verified, reason]);

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
              ? "Verification link is invalid or expired. Please request a new one.❌"
              : "Verifying..."}
          </h1>

          <p className="text-gray-600 dark:text-gray-400">{message}</p>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
