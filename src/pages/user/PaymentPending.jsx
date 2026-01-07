// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Clock,
//   CheckCircle,
//   XCircle,
//   Loader2,
//   RefreshCw,
//   Home,
//   ArrowRight,
//   AlertCircle,
//   CreditCard,
// } from "lucide-react";
// import { usePaymentStore } from "../../store/paymentStore";

// export default function PaymentPending() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const reference = searchParams.get("reference");

//   const { verifyPayment } = usePaymentStore();

//   const [status, setStatus] = useState("verifying"); // verifying | success | failed | pending
//   const [attempts, setAttempts] = useState(0);
//   const [countdown, setCountdown] = useState(5);

//   const verifiedRef = useRef(false);

//   /* ---------------- VERIFY PAYMENT ---------------- */
//   useEffect(() => {
//     if (reference === null) return; // ⛔ wait until params load

//     if (!reference) {
//       navigate("/user/dashboard", { replace: true });
//       return;
//     }

//     if (verifiedRef.current) return; // ⛔ prevent double call
//     verifiedRef.current = true;

//     verifyPaymentStatus();
//   }, [reference]);

//   const verifyPaymentStatus = async () => {
//     try {
//       setStatus("verifying");

//       const result = await verifyPayment(reference);

//       if (result?.data?.status === "success" || result?.success) {
//         setStatus("success");
//       } else if (result?.data?.status === "failed") {
//         setStatus("failed");
//       } else {
//         setStatus("pending");
//       }
//     } catch (err) {
//       console.error("Payment verification error:", err);
//       setStatus("pending");
//     }
//   };

//   /* ---------------- AUTO REDIRECT AFTER SUCCESS ---------------- */
//   useEffect(() => {
//     if (status !== "success") return;

//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           navigate("/user/dashboard", { replace: true });
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [status, navigate]);

//   const handleRetry = () => {
//     if (attempts >= 3) return;
//     setAttempts((a) => a + 1);
//     verifyPaymentStatus();
//   };

//   /* ===================== UI ===================== */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full">

//         {/* VERIFYING */}
//         {status === "verifying" && (
//           <Card>
//             <Loader2 className="icon animate-spin text-blue-600" />
//             <h1>Verifying Payment</h1>
//             <p>Please wait while we confirm your transaction.</p>
//             <Ref reference={reference} color="blue" />
//           </Card>
//         )}

//         {/* SUCCESS */}
//         {status === "success" && (
//           <Card border="emerald">
//             <CheckCircle className="icon text-emerald-600" />
//             <h1>Payment Successful 🎉</h1>
//             <p>Redirecting to dashboard in {countdown}s</p>
//             <Ref reference={reference} color="emerald" />

//             <button
//               onClick={() => navigate("/user/dashboard")}
//               className="btn-primary"
//             >
//               Go to Dashboard <ArrowRight />
//             </button>
//           </Card>
//         )}

//         {/* FAILED */}
//         {status === "failed" && (
//           <Card border="rose">
//             <XCircle className="icon text-rose-600" />
//             <h1>Payment Failed</h1>
//             <p>Your payment could not be completed.</p>
//             <Ref reference={reference} color="rose" />

//             <button onClick={() => navigate("/checkout")} className="btn-primary">
//               <CreditCard /> Try Again
//             </button>

//             <button onClick={() => navigate("/user/dashboard")} className="btn-secondary">
//               <Home /> Dashboard
//             </button>
//           </Card>
//         )}

//         {/* PENDING */}
//         {status === "pending" && (
//           <Card border="amber">
//             <Clock className="icon text-amber-600" />
//             <h1>Payment Pending</h1>
//             <p>Your payment is still processing.</p>

//             <div className="info-box">
//               <AlertCircle />
//               <ul>
//                 <li>Check your email</li>
//                 <li>Wait a few minutes</li>
//                 <li>Try verifying again</li>
//               </ul>
//             </div>

//             <Ref reference={reference} />

//             <button
//               onClick={handleRetry}
//               disabled={attempts >= 3}
//               className="btn-primary"
//             >
//               <RefreshCw /> Verify Again ({attempts}/3)
//             </button>

//             <button onClick={() => navigate("/user/dashboard")} className="btn-secondary">
//               <Home /> Dashboard
//             </button>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ===================== SMALL REUSABLE UI ===================== */

// function Card({ children, border = "blue" }) {
//   return (
//     <div className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-${border}-100 space-y-4`}>
//       {children}
//     </div>
//   );
// }

// function Ref({ reference, color = "gray" }) {
//   return (
//     <div className={`bg-${color}-50 rounded-xl p-4`}>
//       <p className="text-sm">Reference</p>
//       <code className={`text-${color}-700 font-mono text-sm font-semibold`}>
//         {reference}
//       </code>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentPending() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("loading"); // loading | pending | success | failed
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reference) {
      navigate("/user/dashboard");
      return;
    }

    let intervalId;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(
          `/api/payments/status/${reference}`,
          {
            method: "GET",
            credentials: "include", // IMPORTANT if using cookies/auth
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payment status");
        }

        const data = await res.json();
        setStatus(data.status);

        if (data.status === "success") {
          clearInterval(intervalId);
          setTimeout(() => {
            navigate("/user/dashboard");
          }, 1500);
        }

        if (data.status === "failed") {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to check payment status");
        clearInterval(intervalId);
      }
    };

    // run immediately
    checkPaymentStatus();

    // poll every 5 seconds
    intervalId = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(intervalId);
  }, [reference, navigate]);

  // ---------- UI ----------
  if (status === "loading") {
    return <Center text="Checking payment status..." />;
  }

  if (status === "pending") {
    return (
      <Center
        title="Payment Pending"
        text="Your payment is still processing. You can safely leave this page."
      />
    );
  }

  if (status === "success") {
    return (
      <Center
        title="Payment Successful 🎉"
        text="Redirecting you to your dashboard..."
      />
    );
  }

  if (status === "failed") {
    return (
      <Center
        title="Payment Failed"
        text="Your payment did not go through."
        action={{
          label: "Retry Payment",
          onClick: () => navigate("/checkout"),
        }}
      />
    );
  }

  if (error) {
    return <Center title="Error" text={error} />;
  }

  return null;
}

// ---------------- UI COMPONENT ----------------

function Center({ title, text, action }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {title && (
          <h1 className="text-2xl font-bold mb-3">{title}</h1>
        )}
        <p className="text-gray-600 mb-6">{text}</p>

        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
