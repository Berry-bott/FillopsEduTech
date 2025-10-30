// // src/pages/VerifyEmail.jsx
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

// const API_BASE = "https://fillops-server.onrender.com/api/auth";

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("loading"); // "loading", "success", "error", "no-token"
//   const [message, setMessage] = useState("Verifying your email...");
//   const token = searchParams.get("token");

//   useEffect(() => {
//     if (!token) {
//       setStatus("no-token");
//       setMessage("No verification token found.");
//       return;
//     }

//     fetch(`${API_BASE}/verify-email?token=${token}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setStatus("success");
//           setMessage("Your email has been successfully verified!");
//         } else {
//           setStatus("error");
//           setMessage("Verification failed or the link has expired.");
//         }
//       })
//       .catch(() => {
//         setStatus("error");
//         setMessage("An error occurred while verifying your email.");
//       });
//   }, [token]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/10">
//       <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-[90%] max-w-md p-8 text-center animate-fade-in">
//         {/* Status Icon */}
//         <div className="flex justify-center mb-4">
//           {status === "loading" && (
//             <Loader2 className="w-12 h-12 text-primary animate-spin" />
//           )}
//           {status === "success" && (
//             <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
//           )}
//           {(status === "error" || status === "no-token") && (
//             <XCircle className="w-12 h-12 text-red-500 animate-shake" />
//           )}
//         </div>

//         {/* Message */}
//         <h1 className="text-xl font-semibold text-gray-800 mb-2">{message}</h1>
//         <p className="text-gray-500 mb-6">
//           {status === "success"
//             ? "You can now log in to your account."
//             : "Please check your email or try again later."}
//         </p>

//         {/* Buttons */}
//         <div className="flex justify-center">
//           {status === "success" ? (
//             <button
//               onClick={() => navigate("/login")}
//               className="px-6 py-2 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition-all duration-300"
//             >
//               Go to Login
//             </button>
//           ) : (
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-all duration-300"
//             >
//               Retry
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
// import { CheckCircle, Loader2, XCircle } from "lucide-react";

// const API_BASE = "https://fillops-server.onrender.com/api/auth"; // 🔗 your backend base URL

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();
//   const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
//   const [message, setMessage] = useState("Verifying your email...");
//   const token = searchParams.get("token");

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/verify-email?token=${token}`);
//         const data = await res.json();

//         if (res.ok) {
//           setStatus("success");
//           setMessage("Your email has been verified successfully!");
//           setTimeout(() => {
//             window.location.href = "/login";
//           }, 3000);
//         } else {
//           setStatus("error");
//           setMessage(data.message || "Verification failed. Invalid or expired token.");
//         }
//       } catch (err) {
//         setStatus("error");
//         setMessage("Something went wrong. Please try again later.");
//       }
//     };

//     if (token) verifyEmail();
//   }, [token]);

//   const renderIcon = () => {
//     if (status === "loading") return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
//     if (status === "success") return <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />;
//     if (status === "error") return <XCircle className="w-12 h-12 text-red-500" />;
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
//       <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700">
//         <div className="flex flex-col items-center space-y-4">
//           {renderIcon()}
//           <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//             {status === "success" ? "Email Verified 🎉" : status === "error" ? "Verification Failed" : "Please wait..."}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">{message}</p>

//           {status === "success" && (
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
//               Redirecting to login page...
//             </p>
//           )}

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
import { CheckCircle, Loader2, XCircle, Mail } from "lucide-react";

const API_BASE = "https://fillops-server.onrender.com/api/auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("notice"); // 'notice', 'loading', 'success', 'error'
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      // No token in URL → just show notice
      setStatus("notice");
      setMessage("Please check your email inbox and click the link to verify your account.");
      return;
    }

    // Has token → verify it
    const verifyEmail = async () => {
      setStatus("loading");
      setMessage("Verifying your email...");

      try {
        const res = await fetch(`${API_BASE}/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully! Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
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
  }, [token]);

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
