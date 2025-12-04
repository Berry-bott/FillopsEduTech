// import { useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();
//   const verified = searchParams.get("verified");
//   const reason = searchParams.get("reason");

//   // console.log(`is reason status:`${reason}) 
//   // console.log(`is verified status:`${verified}) 

//   const [status, setStatus] = useState("loading");
//   const [message, setMessage] = useState("Checking verification status...");

//   useEffect(() => {
//       // Hide token immediately for security
//   if (searchParams.get("token")) {
//     window.history.replaceState({}, document.title, "/verify-email");
//   }

//     // CASE 1: Backend sent explicit success
//     if (verified === "true") {
//       setStatus("success");
//       setMessage("Email verified successfully! Redirecting to login...");
//       setTimeout(() => (window.location.href = "/login"), 500);
//       return;
//     }

//     // CASE 2: Backend sent explicit failure
//     if (verified === "false" ) {
//       setStatus("error");
//       setMessage(reason || "Verification failed.");
//       console.log(reason || "Verification failed.");
//       return;
//     }

//     // CASE 3: Backend did NOT add any query parameter
//     // Assume instant backend redirect = verification success
//     if (!verified) {
//       setStatus("success");
//       setMessage("Email verified! Redirecting to login...");
//       setTimeout(() => (window.location.href = "/login"), 500);
//       return;
//     }
//   }, [verified, reason]);

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
//               ? "Email Verified 🎉"
//               : status === "error"
//               ? "Verification Failed"
//               : "Verifying..."}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">{message}</p>

//           {status === "error" && (
//             <button
//               onClick={() => (window.location.href = "/login")}
//               className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
//             >
//               Go to Login
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;



// import { useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();

//   // Get parameters sent by backend
//   const reason = searchParams.get("reason");
//   const alreadyVerified = searchParams.get("alreadyVerified");
//   const verified = searchParams.get("verified");
//   const verification = searchParams.get("verification");
//   const notVerification = searchParams.get("!verification");

//   const [status, setStatus] = useState("loading");
//   const [message, setMessage] = useState("Checking verification status...");

//   useEffect(() => {
//     // 🔎 Debug to see what backend sends
//     console.log("Received params:", {
//       reason,
//       Verification,
//       notVerification,
//       alreadyVerified,
//       verified,
//       allParams: Object.fromEntries([...searchParams.entries()])
//     });

//     // 🔐 Remove token from URL instantly
//     // if (searchParams.get("token")) {
//     //   window.history.replaceState({}, document.title, "/verify-email");
//     // }

//     // ✅ CASE 1: Email was already verified earlier
//     if (alreadyVerified === "true") {
//       setStatus("success");
//       setMessage("This email is already verified. Redirecting...SHIT O");
//       setTimeout(() => (window.location.href = "/login"), 50000);
//       return;
//     }

//     // ❌ CASE 2: Backend returned error
//     if (reason) {
//       setStatus("error");
//       setMessage(getErrorMessage(reason));
//       return;
//     }

//     // ✅ CASE 3: Backend explicitly says verified=true
//     if (verified === "true") {
//       setStatus("success");
//       setMessage("Email verified! Redirecting... FUCK..");
//       setTimeout(() => (window.location.href = "/login"), 50000);
//       return;
//     }

//     // 🟢 CASE 4: No params → backend auto-verified
//     // if (!reason && !alreadyVerified && !verified) {
//     //   setStatus("success");
//     //   setMessage("Email verified! Redirecting...");
//     //   setTimeout(() => (window.location.href = "/login"), 10000);
//     //   return;
//     // }

//     // If nothing matched → still loading
//     setStatus("loading");
//     setMessage("Processing verification...");
//   }, [reason, alreadyVerified, verified, searchParams]);

//   // ---------------------------------------------------------
//   // ERROR MESSAGE HELPERS
//   // ---------------------------------------------------------
//   const getErrorMessage = (reason) => {
//     if (!reason) return "Verification failed. Please try again.";

//     const map = {
//       "invalid-or-expired": "This verification link is invalid or expired. WOW",
//       "token-not-found": "Verification token not found. It may have been used already. SHIT",
//       "user-not-found": "We couldn't find a user with this email.",
//       "already-verified": "This email is already verified. TYPE SHIT",
//       "server-error": "Server error. Please try again later."
//     };

//     return map[reason] || reason.replace(/-/g, " ");
//   };

//   const getErrorTitle = (reason) => {
//     if (!reason) return "Verification Failed";
//     const map = {
//       "invalid-or-expired": "Link Expired",
//       "already-verified": "Already Verified SHH.."
//     };
//     return map[reason] || "Verification Failed";
//   };

//   const getErrorHelpText = (reason) => {
//     if (!reason) return "Please try again or contact support.";

//     const map = {
//       "invalid-or-expired": "Request a new verification email.",
//       "already-verified": "You can log in now.",
//       "user-not-found": "Make sure you registered with the correct email."
//     };

//     return map[reason] || "Please try again or contact support.";
//   };

//   const getActionButtons = (reason) => {
//     if (reason === "invalid-or-expired") {
//       return (
//         <div className="flex flex-col gap-3 w-full">
//           <button
//             onClick={() => (window.location.href = "/login")}
//             className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           >
//             Go to Login
//           </button>
//           <button
//             onClick={() => (window.location.href = "/resend-verification")}
//             className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
//           >
//             Resend Verification Email
//           </button>
//         </div>
//       );
//     }

//     return (
//       <button
//         onClick={() => (window.location.href = "/login")}
//         className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
//       >
//         Go to Login
//       </button>
//     );
//   };

//   // ---------------------------------------------------------
//   // RENDER UI
//   // ---------------------------------------------------------

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
//               ? alreadyVerified === "true"
//                 ? "Already Verified"
//                 : "Email Verified 🎉 SHIT AM FUCKED"
//               : status === "error"
//               ? getErrorTitle(reason)
//               : "Verifying..."}
//           </h1>

//           <div className="space-y-3">
//             <p className="text-gray-600 dark:text-gray-400">
//               {status === "error" ? getErrorMessage(reason) : message}
//             </p>

//             {status === "error" && (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {getErrorHelpText(reason)}
//               </p>
//             )}
//           </div>

//           {status === "error" && (
//             <div className="mt-6 w-full">{getActionButtons(reason)}</div>
//           )}

//           {status === "success" && alreadyVerified === "true" && (
//             <button
//               onClick={() => (window.location.href = "/login")}
//               className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
//             >
//               Continue to Login
//             </button>
//           )}

//           {status === "success" && !alreadyVerified && (
//             <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
//               You will be redirected shortly...
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;

import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Mail, AlertCircle } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // All possible parameters from backend
  const token = searchParams.get("token");
  const reason = searchParams.get("reason");
  const alreadyVerified = searchParams.get("alreadyVerified");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(5);

  // Debug logging
  useEffect(() => {
    console.log("Email verification parameters:", {
      token: token ? "Present (hidden for security)" : "Not present",
      reason,
      alreadyVerified,
      allParams: Object.fromEntries([...searchParams.entries()])
    });
  }, []);

  useEffect(() => {
    // Remove token from URL for security immediately
    if (token) {
      console.log("Token detected, removing from URL for security");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check which scenario we're in
    checkVerificationStatus();
  }, [token, reason, alreadyVerified]);

  const checkVerificationStatus = () => {
    // SCENARIO 1: Already verified (backend returns ?alreadyVerified=true)
    if (alreadyVerified === "true") {
      console.log("Case: Email already verified");
      setStatus("success");
      setMessage("Your email is already verified. You can now log in.");
      startRedirect("/login", 3);
      return;
    }

    // SCENARIO 2: Error with specific reason (backend returns ?reason=...)
    if (reason) {
      console.log("Case: Error - reason:", reason);
      setStatus("error");
      
      const errorMessages = {
        "invalid-or-expired": "This verification link is invalid or has expired.",
        "missing-token": "Verification link is missing a token. Please use the full link from your email.",
        "server-error": "A server error occurred. Please try again later.",
        // Add more reasons as needed
      };
      
      setMessage(errorMessages[reason] || "Verification failed. Please try again.");
      return;
    }

    // SCENARIO 3: Success - just verified (backend returns no parameters)
    // This happens when the backend verifies the email and redirects without query params
    console.log("Case: Success - email just verified");
    setStatus("success");
    setMessage("Email verified successfully! Redirecting to login...");
    startRedirect("/login", 3);
  };

  const startRedirect = (path, seconds) => {
    let counter = seconds;
    setCountdown(counter);
    
    const timer = setInterval(() => {
      counter--;
      setCountdown(counter);
      
      if (counter <= 0) {
        clearInterval(timer);
        navigate(path);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const handleManualRedirect = (path) => {
    navigate(path);
  };

  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />;
      case "error":
        return reason === "server-error" 
          ? <AlertCircle className="w-16 h-16 text-yellow-500 animate-pulse" />
          : <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Mail className="w-16 h-16 text-gray-400" />;
    }
  };

  const getTitle = () => {
    if (status === "success") {
      return alreadyVerified === "true" 
        ? "Already Verified ✅" 
        : "Email Verified 🎉";
    }
    if (status === "error") {
      return reason === "server-error" 
        ? "Server Error" 
        : "Verification Failed";
    }
    return "Verifying Email...";
  };

  const getHelpText = () => {
    if (status === "error") {
      switch (reason) {
        case "invalid-or-expired":
          return "Verification links are valid for 24 hours. Please request a new verification email.";
        case "missing-token":
          return "Make sure you're using the full link from your email. If you copied just part of it, please use the complete URL.";
        case "server-error":
          return "Our servers are experiencing issues. Please try again in a few minutes.";
        default:
          return "Please try again or contact support if the problem persists.";
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-6">
          {renderIcon()}
          
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {getTitle()}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400">
              {message}
            </p>
            
            {getHelpText() && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {getHelpText()}
              </p>
            )}
            
            {status === "success" && countdown > 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mt-4">
            {status === "success" && (
              <button
                onClick={() => handleManualRedirect("/login")}
                className="w-full px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium"
              >
                {alreadyVerified === "true" 
                  ? "Continue to Login" 
                  : `Go to Login ${countdown > 0 ? `(${countdown})` : ''}`
                }
              </button>
            )}
            
            {status === "error" && (
              <>
                <button
                  onClick={() => handleManualRedirect("/login")}
                  className="w-full px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium"
                >
                  Go to Login
                </button>
                
                {(reason === "invalid-or-expired" || reason === "missing-token") && (
                  <button
                    onClick={() => handleManualRedirect("/resend-verification")}
                    className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Request New Verification Email
                  </button>
                )}
                
                {reason === "server-error" && (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Try Again
                  </button>
                )}
              </>
            )}
            
            {status === "loading" && (
              <button
                onClick={() => handleManualRedirect("/")}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Return Home
              </button>
            )}
          </div>

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left w-full">
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                <strong>Debug Info:</strong><br />
                Status: {status}<br />
                Reason: {reason || 'none'}<br />
                Already Verified: {alreadyVerified || 'false'}<br />
                Token Present: {token ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;