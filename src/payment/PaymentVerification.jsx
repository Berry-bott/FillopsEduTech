// pages/PaymentVerification.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePaymentStore } from "@/store/paymentStore";

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment } = usePaymentStore();
  const [status, setStatus] = useState("verifying"); 

  useEffect(() => {
    const reference = searchParams.get("reference");
    
    if (!reference) {
      setStatus("failed");
      return;
    }

    // Verify the payment
    const verify = async () => {
      try {
        await verifyPayment(reference);
        setStatus("success");
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams, verifyPayment, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">We couldn't verify your payment</p>
        <button
          onClick={() => navigate("/checkout")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}