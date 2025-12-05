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



// import { useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();

//   const reason = searchParams.get("reason");
//   const alreadyVerified = searchParams.get("alreadyVerified");

//   const [status, setStatus] = useState("loading");
//   const [message, setMessage] = useState("Checking verification status...");

//   useEffect(() => {
//     // --- 1. REMOVE ONLY TOKEN, KEEP OTHER PARAMS ---
//     // if (searchParams.get("token")) {
//     //   const params = new URLSearchParams(searchParams);
//     //   params.delete("token");

//     //   window.history.replaceState(
//     //     {},
//     //     document.title,
//     //     `/verify-email?${params.toString()}`
//     //   );
//     // }

//     // --- 2. CASE: Already verified ---
//     if (alreadyVerified === "true") {
//       setStatus("success");
//       setMessage("Your email was already verified. Redirecting...");
//       setTimeout(() => (window.location.href = "/login"), 800);
//       return;
//     }

//     // --- 3. CASE: Backend returned a failure reason ---
//     if (reason) {
//       setStatus("error");
//       switch (reason) {
//         case "invalid-or-expired":
//           setMessage("This verification link is invalid or has expired.");
//           break;
//         case "missing-token":
//           setMessage("Verification token missing.");
//           break;
//         case "server-error":
//           setMessage("A server error occurred. Please try again later.");
//           break;
//         default:
//           setMessage(reason.replace(/-/g, " "));
//       }
//       return;
//     }

//     // --- 4. CASE: No params at all -> success redirect ---
//     if (!reason && !alreadyVerified) {
//       setStatus("success");
//       setMessage("Email verified successfully! Redirecting to login...");
//       setTimeout(() => (window.location.href = "/login"), 800);
//       return;
//     }

//   }, [reason, alreadyVerified, searchParams]);

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

//           {/* TITLE */}
//           <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//             {status === "success"
//               ? alreadyVerified === "true"
//                 ? "Already Verified"
//                 : "Email Verified 🎉"
//               : status === "error"
//               ? "Verification Failed"
//               : "Verifying..."}
//           </h1>

//           {/* MESSAGE */}
//           <p className="text-gray-600 dark:text-gray-400">{message}</p>

//           {/* BUTTON ON ERROR */}
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


import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Mail, X } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Checking verification status...");

  useEffect(() => {
   

    // Hide token immediately if it's still in the URL
    // if (searchParams.get("token")) {
    //   window.history.replaceState({}, document.title, "/verify-email");
    //   return;
    // }

    if (reason) {
      setStatus("error");
      switch (reason) {
        case "missing-token":
          setMessage("Verification token is missing."); n
          break;
        case "invalid-or-expired":
          setMessage("Verification link is invalid or expired. Please request a new one.");
          break;
        case "server-error":
          setMessage("Server error occurred. Please try again later.");
          break;
        default:
          setMessage(reason.replace(/-/g, " "));
      }
      return;
    }

    // No params → verification success
    // setStatus("success");
    // setMessage("Email verified successfully! Redirecting to login...");
    // setTimeout(() => (window.location.href = "/login"), 1000);
  }, [reason, searchParams]);

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
            { status === "error"
              ? "Verification link is invalid or expired. Please request a new one."
              : "Verifying..."}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          {/* {status === "error" && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Go to Login
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
