import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePaymentStore } from "@/store/PaymentStore";

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, checkStatus, paid } = usePaymentStore();
  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [retrying, setRetrying] = useState(false);

  const handleRetryVerification = async () => {
    setRetrying(true);
    try {
      console.log("🔄 Manually retrying verification...");
      await checkStatus();
      
      const currentPaid = usePaymentStore.getState().paid;
      console.log("📊 Current payment status:", currentPaid);
      
      if (currentPaid) {
        setStatus("success");
        setTimeout(() => navigate("/user/dashboard"), 2000);
      } else {
        setErrorMessage("Payment status not updated yet. Please contact support if you were charged.");
      }
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    
    console.log("🔍 Payment verification started");
    console.log("📋 All params:", Object.fromEntries(searchParams.entries()));
    console.log("🎫 Reference:", reference);
    
    if (!reference) {
      console.error("❌ No reference found in URL");
      setStatus("failed");
      setErrorMessage("No payment reference found");
      return;
    }

    const verify = async () => {
      try {
        console.log("⏳ Verifying payment...");
        const result = await verifyPayment(reference);
        console.log("✅ Verification successful:", result);
        
        // Double check the payment status
        await checkStatus();
        const currentPaid = usePaymentStore.getState().paid;
        console.log("📊 Payment status after verification:", currentPaid);
        
        if (currentPaid) {
          setStatus("success");
          setTimeout(() => navigate("/user/dashboard"), 3000);
        } else {
          console.warn("⚠️ Verification succeeded but paid status is still false");
          setStatus("pending");
          setErrorMessage("Payment is being processed. This may take a few moments.");
        }
      } catch (error) {
        console.error("❌ Verification failed:", error);
        setStatus("failed");
        setErrorMessage(error.message || "Payment verification failed");
      }
    };

    verify();
  }, [searchParams, verifyPayment, checkStatus, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="text-center max-w-md px-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Verifying Payment...</h2>
          <p className="text-muted-foreground text-lg">Please wait while we confirm your payment</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-yellow-600 mb-3">Payment Processing</h2>
          <p className="text-muted-foreground text-lg mb-2">Your payment is being confirmed</p>
          {errorMessage && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">{errorMessage}</p>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleRetryVerification}
              disabled={retrying}
              className="w-full px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              {retrying ? "Checking..." : "Check Status Again"}
            </button>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="w-full px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="text-center max-w-md px-6">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">Payment Successful!</h2>
          <p className="text-muted-foreground text-lg mb-6">Your subscription has been activated</p>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800 font-medium">
              Redirecting to your dashboard in a moment...
            </p>
          </div>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="text-center max-w-md px-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-red-600 mb-3">Payment Failed</h2>
        <p className="text-muted-foreground text-lg mb-2">We couldn't verify your payment</p>
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="w-full px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}







// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { usePaymentStore } from "@/store/PaymentStore";

// export default function PaymentVerification() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { verifyPayment } = usePaymentStore();
//   const [status, setStatus] = useState("verifying");
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const reference = searchParams.get("reference") || searchParams.get("trxref");
    
//     console.log("🔍 Payment verification started");
//     console.log("📋 All params:", Object.fromEntries(searchParams.entries()));
//     console.log("🎫 Reference:", reference);
    
//     if (!reference) {
//       console.error("❌ No reference found in URL");
//       setStatus("failed");
//       setErrorMessage("No payment reference found");
//       return;
//     }

//     const verify = async () => {
//       try {
//         console.log("⏳ Verifying payment...");
//         const result = await verifyPayment(reference);
//         console.log("✅ Verification successful:", result);
        
//         setStatus("success");
        
//         // Redirect to dashboard after 3 seconds
//         setTimeout(() => {
//           navigate("/user/dashboard");
//         }, 3000);
//       } catch (error) {
//         console.error("❌ Verification failed:", error);
//         setStatus("failed");
//         setErrorMessage(error.message || "Payment verification failed");
//       }
//     };

//     verify();
//   }, [searchParams, verifyPayment, navigate]);

//   if (status === "verifying") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
//         <div className="text-center max-w-md px-6">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary mx-auto mb-6"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-16 h-16 rounded-full bg-primary/10"></div>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold mb-3">Verifying Payment...</h2>
//           <p className="text-muted-foreground text-lg">Please wait while we confirm your payment</p>
//           <div className="mt-6 flex items-center justify-center gap-2">
//             <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//             <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//             <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (status === "success") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
//         <div className="text-center max-w-md px-6">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
//               <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold text-green-600 mb-3">Payment Successful!</h2>
//           <p className="text-muted-foreground text-lg mb-6">Your subscription has been activated</p>
//           <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
//             <p className="text-sm text-green-800 font-medium">
//               Redirecting to your dashboard in a moment...
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/user/dashboard")}
//             className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
//           >
//             Go to Dashboard Now
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
//       <div className="text-center max-w-md px-6">
//         <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//           <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </div>
//         <h2 className="text-3xl font-bold text-red-600 mb-3">Payment Failed</h2>
//         <p className="text-muted-foreground text-lg mb-2">We couldn't verify your payment</p>
//         {errorMessage && (
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
//             <p className="text-sm text-red-800">{errorMessage}</p>
//           </div>
//         )}
//         <div className="space-y-3">
//           <button
//             onClick={() => navigate("/checkout")}
//             className="w-full px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
//           >
//             Try Again
//           </button>
//           <button
//             onClick={() => navigate("/user/dashboard")}
//             className="w-full px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }