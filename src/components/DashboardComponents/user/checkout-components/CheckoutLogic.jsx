import { useState, useEffect } from "react";
import CheckoutUI from "./CheckoutUI";
import useAuthStore from "@/store/authStore";
import { usePaymentStore } from "@/store/PaymentStore";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

export default function CheckoutLogic() {
  const { accessToken } = useAuthStore();
  const {
    plans: apiPlans,
    loading: paymentLoading,
    error: paymentError,
    paid,
    expiresAt,
    fetchPlans,
    initializePayment,
    checkStatus,
  } = usePaymentStore();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectsByCategory, setSubjectsByCategory] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const [pendingCart, setPendingCart] = useState({});
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ensure plans is always an array
  const plansList = Array.isArray(apiPlans?.plans)
    ? apiPlans.plans
    : Array.isArray(apiPlans)
    ? apiPlans
    : [];

  // Load pending cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("pendingCheckoutCart");
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setPendingCart(cart);
        setShowCartNotification(Object.keys(cart).length > 0);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    }
  }, []);

  // Save pending cart to localStorage
  useEffect(() => {
    if (Object.keys(pendingCart).length > 0) {
      localStorage.setItem("pendingCheckoutCart", JSON.stringify(pendingCart));
      setShowCartNotification(true);
    } else {
      localStorage.removeItem("pendingCheckoutCart");
      setShowCartNotification(false);
    }
  }, [pendingCart]);

  // Fetch plans & status
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      await fetchPlans();
      await checkStatus();
      setInitialLoading(false);
    };
    loadData();
  }, []);

  // Load subjects from preferences
  useEffect(() => {
    if (!accessToken) return;

    const loadSubjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/preferences`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const data = await res.json();
        const selectedSubjects = data.data?.preferences?.selectedSubjects || {};
        const formatted = {};
        Object.entries(selectedSubjects).forEach(([exam, subjects]) => {
          formatted[exam] = subjects.map((s) => ({
            id: s.id || s._id,
            name: s.name || s.subjectName || "Unknown Subject",
          }));
        });
        setSubjectsByCategory(formatted);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        setSubjectsByCategory({});
      }
    };

    loadSubjects();
  }, [accessToken]);

  // ======= Functions =======
  const handleExamSelect = (exam) => {
    if (selectedExam && (selectedPlan || selectedSubjects.length > 0)) {
      setPendingCart((prev) => ({
        ...prev,
        [selectedExam]: {
          plan: selectedPlan?.id,
          subjects: selectedSubjects,
          planName: selectedPlan?.name,
          pricePerSubject: selectedPlan?.pricePerSubject,
        },
      }));
    }
    setSelectedExam(exam);
    if (pendingCart[exam]) {
      const examCart = pendingCart[exam];
      setSelectedPlan(plansList.find((p) => p.id === examCart.plan));
      setSelectedSubjects(examCart.subjects || []);
      setCurrentStep(3);
    } else {
      setSelectedPlan(null);
      setSelectedSubjects([]);
      setCurrentStep(2);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (plan.isLifetime || plan.id === "PREMIUM") {
      const examSubjects = subjectsByCategory[selectedExam] || [];
      setSelectedSubjects(examSubjects.map((s) => s.id));
    } else {
      setSelectedSubjects([]);
    }
    setCurrentStep(3);
    setPendingCart((prev) => ({
      ...prev,
      [selectedExam]: {
        plan: plan.id,
        subjects: plan.isLifetime ? (subjectsByCategory[selectedExam] || []).map((s) => s.id) : [],
        planName: plan.name,
        pricePerSubject: plan.pricePerSubject,
      },
    }));
  };

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) => {
      const newSubjects = prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId];
      setPendingCart((prevCart) => ({
        ...prevCart,
        [selectedExam]: { ...prevCart[selectedExam], subjects: newSubjects },
      }));
      return newSubjects;
    });
  };

  const calculateTotal = () => (selectedPlan && selectedSubjects.length ? selectedPlan.pricePerSubject * selectedSubjects.length : 0);
  const calculateCartTotal = () => {
    let total = 0;
    Object.entries(pendingCart).forEach(([_, cart]) => {
      if (cart.pricePerSubject && cart.subjects) total += cart.pricePerSubject * cart.subjects.length;
    });
    return total;
  };
  const totalAmount = calculateTotal();
  const cartTotal = calculateCartTotal();
  const originalPrice = totalAmount > 0 ? Math.round(totalAmount * 1.5) : 0;
  const discount = originalPrice - totalAmount;

  const clearCart = () => {
    setPendingCart({});
    setShowCartNotification(false);
    setIsCartOpen(false);
    localStorage.removeItem("pendingCheckoutCart");
    toast({ title: "Cart cleared", description: "All items removed." });
  };

  const removeFromCart = (exam) => {
    setPendingCart((prev) => {
      const newCart = { ...prev };
      delete newCart[exam];
      return newCart;
    });
    toast({ title: "Removed from cart", description: `${exam} items removed` });
  };

  const getCartItemCount = () => Object.keys(pendingCart).length;

  const loadCartItem = (exam) => {
    const examCart = pendingCart[exam];
    if (!examCart) return;
    setSelectedExam(exam);
    setSelectedPlan(plansList.find((p) => p.id === examCart.plan));
    setSelectedSubjects(examCart.subjects || []);
    setCurrentStep(3);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = async () => {
    if (!selectedExam || !selectedPlan || selectedSubjects.length === 0) {
      toast({ variant: "destructive", title: "Incomplete Selection", description: "Select exam, plan & subjects." });
      return;
    }
    try {
      const result = await initializePayment({ plan: selectedPlan.id, subjects: selectedSubjects, amount: totalAmount });
      if (result?.alreadyPaid) {
        toast({ title: "Already Subscribed!", description: result.message });
        clearCart();
        setTimeout(() => (window.location.href = "/user/dashboard"), 2000);
      } else {
        setPendingCart((prev) => {
          const newCart = { ...prev };
          delete newCart[selectedExam];
          return newCart;
        });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Payment Failed", description: error.message || "Try again." });
    }
  };

  const formatExpiry = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <CheckoutUI
      {...{
        currentStep,
        setCurrentStep,
        selectedExam,
        selectedPlan,
        selectedSubjects,
        subjectsByCategory,
        availableExams: Object.keys(subjectsByCategory),
        plansList,
        promoCode,
        setPromoCode,
        initialLoading,
        paid,
        expiresAt,
        paymentError,
        paymentLoading,
        isCartOpen,
        setIsCartOpen,
        pendingCart,
        showCartNotification,
        handleExamSelect,
        handlePlanSelect,
        toggleSubject,
        handlePayment,
        clearCart,
        removeFromCart,
        loadCartItem,
        getCartItemCount,
        totalAmount,
        cartTotal,
        discount,
        originalPrice,
        formatExpiry,
      }}
    />
  );
}
