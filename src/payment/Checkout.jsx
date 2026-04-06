// import { useState, useEffect } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import useAuthStore from "@/store/authStore";
// import { usePaymentStore } from "@/store/paymentStore"
// import { useToast } from "@/components/ui/use-toast";
// import { Check, ShieldCheck, Star, Sparkles, 
//   Clock, ChevronRight,
//    ShoppingCart, X, Trash2 }
//   from "lucide-react"

// export default function Checkout() {
//   const { accessToken } = useAuthStore();
//   const {
//     plans: apiPlans,
//     loading: paymentLoading,
//     error: paymentError,
//     paid,
//     expiresAt,
//     fetchPlans,
//     initializePayment,
//     checkStatus,
//   } = usePaymentStore()
//   const { toast } = useToast();
  
//   // Step-based state
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
  
//   const [subjectsByCategory, setSubjectsByCategory] = useState({});
//   const [promoCode, setPromoCode] = useState("");
//   const [initialLoading, setInitialLoading] = useState(true);
  
//   // Pending cart state
//   const [pendingCart, setPendingCart] = useState({});
//   const [showCartNotification, setShowCartNotification] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

//   // Ensure plans is always an array
//   const plansList = Array.isArray(apiPlans?.plans) ? apiPlans.plans : 
//                     Array.isArray(apiPlans) ? apiPlans : [];

//   // Load pending cart from localStorage
//   useEffect(() => {
//     const savedCart = localStorage.getItem('pendingCheckoutCart');
//     if (savedCart) {
//       try {
//         const cart = JSON.parse(savedCart);
//         setPendingCart(cart);
        
//         const hasPendingItems = Object.keys(cart).length > 0;
//         setShowCartNotification(hasPendingItems);
//       } catch (err) {
//         console.error('Failed to load cart:', err);
//       }
//     }
//   }, []);

//   // Save pending cart to localStorage whenever it changes
//   useEffect(() => {
//     if (Object.keys(pendingCart).length > 0) {
//       localStorage.setItem('pendingCheckoutCart', JSON.stringify(pendingCart));
//       setShowCartNotification(true);
//     } else {
//       localStorage.removeItem('pendingCheckoutCart');
//       setShowCartNotification(false);
//     }
//   }, [pendingCart]);

//   // Restore cart when switching exams
//   useEffect(() => {
//     if (selectedExam && pendingCart[selectedExam]) {
//       const examCart = pendingCart[selectedExam];
//       if (examCart.plan) {
//         setSelectedPlan(plansList.find(p => p.id === examCart.plan));
//       }
//       if (examCart.subjects) {
//         setSelectedSubjects(examCart.subjects);
//       }
//       if (examCart.plan) {
//         setCurrentStep(3);
//       }
//     }
//   }, [selectedExam, pendingCart, plansList]);

//   // Close cart when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isCartOpen && !event.target.closest('.cart-container')) {
//         setIsCartOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isCartOpen]);

//   // Fetch plans and payment status on mount
//   useEffect(() => {
//     const loadData = async () => {
//       setInitialLoading(true);
//       await fetchPlans();
//       await checkStatus();
//       setInitialLoading(false);
//     };
//     loadData();
//   }, []);

//   // Load subjects from preferences
//   useEffect(() => {
//     if (!accessToken) return;

//     const loadSubjectsFromPreferences = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/preferences`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch preferences");

//         const data = await res.json();
//         console.log(data);
        
//         const preferences = data.data?.preferences || {};
//         const selectedSubjects = preferences.selectedSubjects || {};

//         const formatted = {};
//         Object.entries(selectedSubjects).forEach(([exam, subjects]) => {
//           formatted[exam] = subjects.map((s) => ({
//             id: s.id || s._id,
//             name: s.name || s.subjectName || "Unknown Subject",
//           }));
//         });

//         setSubjectsByCategory(formatted);
//       } catch (err) {
//         console.error("❌ Failed to load subjects:", err);
//         setSubjectsByCategory({});
//       }
//     };

//     loadSubjectsFromPreferences();
//   }, [accessToken]);

//   // Get available exams
//   const availableExams = Object.keys(subjectsByCategory);

//   // Handle exam selection
//   const handleExamSelect = (exam) => {
//     if (selectedExam && (selectedPlan || selectedSubjects.length > 0)) {
//       setPendingCart(prev => ({
//         ...prev,
//         [selectedExam]: {
//           plan: selectedPlan?.id,
//           subjects: selectedSubjects,
//           planName: selectedPlan?.name,
//           pricePerSubject: selectedPlan?.pricePerSubject,
//         }
//       }));
//     }

//     setSelectedExam(exam);
    
//     if (pendingCart[exam]) {
//       const examCart = pendingCart[exam];
//       const plan = plansList.find(p => p.id === examCart.plan);
//       setSelectedPlan(plan);
//       setSelectedSubjects(examCart.subjects || []);
//       setCurrentStep(3);
//     } else {
//       setSelectedPlan(null);
//       setSelectedSubjects([]);
//       setCurrentStep(2);
//     }
//   };

//   // Handle plan selection
//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan);
    
//     if (plan.isLifetime || plan.id === 'PREMIUM') {
//       const examSubjects = subjectsByCategory[selectedExam] || [];
//       setSelectedSubjects(examSubjects.map(s => s.id));
//     } else {
//       setSelectedSubjects([]);
//     }
    
//     setCurrentStep(3);
    
//     setPendingCart(prev => ({
//       ...prev,
//       [selectedExam]: {
//         plan: plan.id,
//         subjects: plan.isLifetime ? (subjectsByCategory[selectedExam] || []).map(s => s.id) : [],
//         planName: plan.name,
//         pricePerSubject: plan.pricePerSubject,
//       }
//     }));
//   };

//   // Toggle subject selection
//   const toggleSubject = (subjectId) => {
//     setSelectedSubjects(prev => {
//       const newSubjects = prev.includes(subjectId)
//         ? prev.filter(id => id !== subjectId)
//         : [...prev, subjectId];
      
//       setPendingCart(prevCart => ({
//         ...prevCart,
//         [selectedExam]: {
//           ...prevCart[selectedExam],
//           subjects: newSubjects,
//         }
//       }));
      
//       return newSubjects;
//     });
//   };

//   // Calculate totals
//   const calculateTotal = () => {
//     if (!selectedPlan || selectedSubjects.length === 0) return 0;
//     return selectedPlan.pricePerSubject * selectedSubjects.length;
//   };

//   const calculateCartTotal = () => {
//     let total = 0;
//     Object.entries(pendingCart).forEach(([exam, cart]) => {
//       if (cart.pricePerSubject && cart.subjects) {
//         total += cart.pricePerSubject * cart.subjects.length;
//       }
//     });
//     return total;
//   };

//   const totalAmount = calculateTotal();
//   const cartTotal = calculateCartTotal();
//   const originalPrice = totalAmount > 0 ? Math.round(totalAmount * 1.5) : 0;
//   const discount = originalPrice - totalAmount;

//   const clearCart = () => {
//     setPendingCart({});
//     localStorage.removeItem('pendingCheckoutCart');
//     setShowCartNotification(false);
//     setIsCartOpen(false);
//     toast({
//       title: "Cart cleared",
//       description: "All items have been removed from your cart.",
//     });
//   };

//   const removeFromCart = (exam) => {
//     setPendingCart(prev => {
//       const newCart = { ...prev };
//       delete newCart[exam];
//       return newCart;
//     });
    
//     toast({
//       title: "Removed from cart",
//       description: `${exam} items removed from cart.`,
//     });
//   };

//   const getCartItemCount = () => {
//     return Object.keys(pendingCart).length;
//   };

//   const loadCartItem = (exam) => {
//     const examCart = pendingCart[exam];
//     if (!examCart) return;

//     setSelectedExam(exam);
//     const plan = plansList.find(p => p.id === examCart.plan);
//     setSelectedPlan(plan);
//     setSelectedSubjects(examCart.subjects || []);
//     setCurrentStep(3);
//     setIsCartOpen(false);
    
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle payment
//   const handlePayment = async () => {
//     if (!selectedExam || !selectedPlan || selectedSubjects.length === 0) {
//       toast({
//         variant: "destructive",
//         title: "Incomplete Selection",
//         description: "Please select exam, plan, and at least one subject.",
//       });
//       return;
//     }

//     try {
//       const result = await initializePayment({
//         plan: selectedPlan.id,
//         subjects: selectedSubjects,
//         amount: totalAmount,
//       });

//       if (result?.alreadyPaid) {
//         toast({
//           title: "Already Subscribed!",
//           description: result.message || "You already have an active subscription!",
//         });
        
//         clearCart();
        
//         setTimeout(() => window.location.href = "/user/dashboard", 2000);
//       } else {
//         setPendingCart(prev => {
//           const newCart = { ...prev };
//           delete newCart[selectedExam];
//           return newCart;
//         });
//       }
//     } catch (error) {
//       console.error("Payment initialization failed:", error);
//       toast({
//         variant: "destructive",
//         title: "Payment Failed",
//         description: error.message || "Failed to initialize payment. Please try again.",
//       });
//     }
//   };

//   // Format expiry date
//   const formatExpiry = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const examSubjects = selectedExam ? (subjectsByCategory[selectedExam] || []) : [];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      

//       <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
//         {/* Loading State */}
//         {initialLoading ? (
//           <div className="flex items-center justify-center min-h-[60vh]">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
//               <p className="mt-6 text-lg text-muted-foreground font-medium">Loading plans...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//        {/* Fixed Header with Cart */}
//       <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
//         <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          
//           {/* Title Section */}
//           <div className="text-left">
//             <h1 className="text-xl md:text-4xl font-bold text-gray-900">
//               Choose Your Learning Path
//             </h1>
//             <p className="text-gray-600 text-xs md:text-base">
//               Select exam → Choose plan → Pick subjects
//             </p>
//           </div>

//           {/* Cart Section */}
//           <div className="relative z-50 cart-container">
//        <button
//               onClick={() => setIsCartOpen(!isCartOpen)}
//               className="relative bg-white hover:bg-gray-50 text-gray-900 rounded-full p-3 shadow-md border-2 border-gray-200 transition-all hover:scale-105"
//             >
//           <ShoppingCart className="h-6 w-6" />
//           {getCartItemCount() > 0 && (
//            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
//            {getCartItemCount()}
//          </span>
//           )}
//         </button>

//         {/* Cart Dropdown */}
//         {isCartOpen && (
//          <div className="absolute top-full right-0 mt-5 min-w-[270px] sm:w-80 md:w-96 bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-h-[70vh] md:max-h-[80vh] overflow-auto flex flex-col z-50">
//                   {/* Cart Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <ShoppingCart className="h-5 w-5" />
//                 <h3 className="font-bold text-lg">Your Cart</h3>
//               </div>
//               <button
//                 onClick={() => setIsCartOpen(false)}
//                 className="hover:bg-white/20 rounded-full p-1 transition-colors"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Cart Content */}
//             <div className="flex-1 overflow-y-auto p-4">
//               {getCartItemCount() === 0 ? (
//                 <div className="text-center py-12">
//                   <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                   <p className="text-gray-500 font-medium">Your cart is empty</p>
//                   <p className="text-gray-400 text-sm mt-1">Add items to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {Object.entries(pendingCart).map(([exam, cart]) => {
//                     const itemTotal = cart.pricePerSubject * (cart.subjects?.length || 0);
//                     return (
//                       <div key={exam} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex-1">
//                             <h4 className="font-bold text-lg text-gray-900">{exam}</h4>
//                             <p className="text-sm text-gray-600">{cart.planName}</p>
//                           </div>
//                           <button
//                             onClick={() => removeFromCart(exam)}
//                             className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors"
//                             title="Remove from cart"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Subjects:</span>
//                             <span className="font-semibold text-gray-900">{cart.subjects?.length || 0}</span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Price per subject:</span>
//                             <span className="font-semibold text-gray-900">₦{cart.pricePerSubject?.toLocaleString()}</span>
//                           </div>
//                           <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
//                             <span className="font-bold text-gray-900">Subtotal:</span>
//                             <span className="font-bold text-blue-600 text-lg">₦{itemTotal.toLocaleString()}</span>
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => loadCartItem(exam)}
//                           className="w-full mt-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg text-sm transition-colors"
//                         >
//                           Continue Editing
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Cart Footer */}
//             {getCartItemCount() > 0 && (
//               <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="font-bold text-gray-900">Total:</span>
//                   <span className="font-black text-2xl text-blue-600">₦{cartTotal.toLocaleString()}</span>
//                 </div>
//                 <button
//                   onClick={clearCart}
//                   className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//         </div>

//           </div>
//         </div>

//         {/* Add spacing so page content doesn't go under the fixed header */}
//         <div className="h-28"></div>


//             {/* Active Subscription Banner */}
//             {paid && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//                 <div className="flex items-center">
//                   <Check className="w-5 h-5 text-green-600 mr-2" />
//                   <div>
//                     <p className="text-green-800 font-medium">Active Subscription</p>
//                     {expiresAt && (
//                       <p className="text-green-700 text-sm">
//                         Expires on {formatExpiry(expiresAt)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error Message */}
//             {paymentError && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                 <p className="text-red-800">{paymentError}</p>
//               </div>
//             )}

//             {/* Progress Steps */}
//             <div className="flex items-center justify-center mb-8 gap-2">
//               <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
//                 <span className="font-bold">1</span>
//                 <span className="text-sm font-medium">Exam</span>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400" />
//               <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
//                 <span className="font-bold">2</span>
//                 <span className="text-sm font-medium">Plan</span>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400" />
//               <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
//                 <span className="font-bold">3</span>
//                 <span className="text-sm font-medium">Subjects</span>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
//               {/* Main Content */}
//               <div className="space-y-6">
//                 {/* STEP 1: Select Exam */}
//                 <Card className="overflow-hidden border-0 shadow-lg">
//                   <div className={`p-6 ${currentStep === 1 ? 'bg-primary-hover text-white' : 'bg-gray-100'}`}>
//                     <h2 className="text-xl font-semibold mb-1">Step 1: Choose Exam Type</h2>
//                     <p className="text-sm opacity-90">
//                       {selectedExam ? `Selected: ${selectedExam}` : 'Select the exam you\'re preparing for'}
//                     </p>
//                   </div>

//                   <div className="p-6">
//                     {availableExams.length > 0 ? (
//                       <div className="grid md:grid-cols-2 gap-3">
//                         {availableExams.map((exam) => (
//                           <button
//                             key={exam}
//                             onClick={() => handleExamSelect(exam)}
//                             className={`py-2 px-4 rounded-xl border-2 text-left transition-all ${
//                               selectedExam === exam
//                                 ? 'border-primary bg-primary/10 shadow-lg'
//                                 : 'border-border hover:border-primary/50 hover:shadow-md'
//                             }`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <h3 className="text-2xl font-bold mb-1">{exam}</h3>
//                                 <p className="text-sm text-muted-foreground">
//                                   {subjectsByCategory[exam]?.length || 0} subjects available
//                                 </p>
//                               </div>
//                               {selectedExam === exam && (
//                                 <Check className="w-8 h-8 text-primary" />
//                               )}
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//                         <p className="text-muted-foreground">No exams available</p>
//                       </div>
//                     )}
//                   </div>
//                 </Card>

//                 {/* STEP 2: Select Plan */}
//                 {currentStep >= 2 && (
//                   <Card className="overflow-hidden border-0 shadow-lg">
//                     <div className={`p-6 ${currentStep === 2 ? 'bg-primary-hover text-white' : 'bg-gray-100'}`}>
//                       <h2 className="text-xl font-semibold mb-1">Step 2: Choose Your Plan</h2>
//                       <p className="text-sm opacity-90">
//                         {selectedPlan ? `Selected: ${selectedPlan.name}` : 'Pick the plan that suits you best'}
//                       </p>
//                     </div>

//                     <div className="p-">
//                       <div className="grid md:grid-cols-3 gap-4">
//                         {plansList.map((plan) => (
//                           <button
//                             key={plan.id}
//                             onClick={() => handlePlanSelect(plan)}
//                             className={`p-4 rounded-xl border-2 text-left transition-all relative ${
//                               selectedPlan?.id === plan.id
//                                 ? 'border-primary bg-primary/10 shadow-lg'
//                                 : 'border-border hover:border-primary/50 hover:shadow-md'
//                             }`}
//                           >
//                             {plan.isPopular && (
//                               <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
//                                 POPULAR
//                               </div>
//                             )}
                            
//                             <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
//                             <div  className="flex justify-between items-center ">

//                             <div className="flex items-baseline mb-1">
//                               <span className="text-3xl font-black">{plan.pricePerSubjectFormatted}</span>
//                               <span className="text-sm text-muted-foreground">/subject</span>
//                             </div>

//                             <div className="flex items-center gap-2 text-sm text-muted-foreground mt-">
//                               <Clock className="w-4 h-4" />
//                               <span className="text-xs text-red-900">{plan.isLifetime ? 'Lifetime Access' : `${plan.durationDays} days`}</span>
//                             </div>
//                             </div>

//                             <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>

//                             {selectedPlan?.id === plan.id && (
//                               <div className="flex items-center gap-2 text-primary font-semibold">
//                                 <Check className="w-5 h-5" />
//                                 <span>Selected</span>
//                               </div>
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </Card>
//                 )}

//                 {/* STEP 3: Select Subjects */}
//                 {currentStep >= 3 && (
//                   <Card className="overflow-hidden border-0 shadow-lg">
//                     <div className="bg-primary-hover p-6 text-white">
//                       <h2 className="text-xl font-semibold mb-1">Step 3: Select Subjects</h2>
//                       <p className="text-sm opacity-90">
//                         {selectedSubjects.length} of {examSubjects.length} subjects selected
//                         {selectedPlan?.isLifetime && ' (All auto-selected for Premium)'}
//                       </p>
//                     </div>

//                     <div className="p-6">
//                       <div className="grid md:grid-cols-2 gap-3">
//                         {examSubjects.map((subject) => {
//                           const isSelected = selectedSubjects.includes(subject.id);
//                           const isDisabled = selectedPlan?.isLifetime;

//                           return (
//                             <button
//                               key={subject.id}
//                               onClick={() => !isDisabled && toggleSubject(subject.id)}
//                               disabled={isDisabled}
//                               className={`py-2 px-4  rounded-lg border-2 text-left transition-all ${
//                                 isSelected
//                                   ? 'border-primary bg-primary/10'
//                                   : 'border-border hover:border-primary/30'
//                               } ${isDisabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
//                                   isSelected ? 'bg-primary border-primary' : 'border-border'
//                                 }`}>
//                                   {isSelected && <Check className="w-4 h-4 text-white" />}
//                                 </div>
//                                 <div className="flex-1">
//                                   <p className="font-semibold">{subject.name || subject.subjectName}</p>
//                                   <p className="text-xs text-muted-foreground">
//                                     {selectedPlan?.pricePerSubjectFormatted}
//                                   </p>
//                                 </div>
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </Card>
//                 )}

//                 {/* Security Badge */}
//                 <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary/20 bg-card p-5 shadow-sm">
//                   <ShieldCheck className="h-7 w-7 text-primary" />
//                   <div>
//                     <p className="text-sm font-semibold">Secure & Encrypted</p>
//                     <p className="text-xs text-muted-foreground">
//                       Your payment information is protected
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Summary - Right Side */}
//               <div className="lg:sticky lg:top-4 h-fit">
//                 <Card className="overflow-hidden border border-gray-200 shadow-lg">
//                   <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-3 sm:p-4 text-white">
//                     <div className="flex items-center justify-between mb-0.5">
//                       <h3 className="text-base sm:text-lg font-bold">Order Summary</h3>
//                       <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
//                     </div>
//                     <p className="text-xs opacity-90">Review your purchase</p>
//                   </div>

//                   <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//                     {/* Selected Details */}
//                     {selectedExam && (
//                       <div className="space-y-2">
//                         <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg border border-blue-100">
//                           <p className="text-xs text-gray-500 mb-0.5">Exam</p>
//                           <p className="font-black text-sm sm:text-base text-gray-900 truncate">{selectedExam}</p>
//                         </div>

//                         {selectedPlan && (
//                           <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg border border-blue-100">
//                             <p className="text-xs text-gray-500 mb-0.5">Plan</p>
//                             <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{selectedPlan.name}</p>
//                             <p className="text-xs text-gray-600 truncate">
//                               {selectedPlan.isLifetime ? 'Lifetime Access' : `${selectedPlan.durationDays} days`}
//                             </p>
//                           </div>
//                         )}

//                         {selectedSubjects.length > 0 && (
//                           <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg border border-blue-100">
//                             <p className="text-xs text-gray-500 mb-1.5 sm:mb-2">
//                               Subjects ({selectedSubjects.length})
//                             </p>
//                             <div className="space-y-1 sm:space-y-1.5 max-h-32 sm:max-h-36 overflow-y-auto">
//                               {selectedSubjects.map(subjectId => {
//                                 const subject = examSubjects.find(s => s.id === subjectId);
//                                 const subjectName = subject?.name || subject?.subjectName || 'Unknown Subject';
//                                 return subject ? (
//                                   <div key={subjectId} className="flex items-center justify-between text-xs p-1.5 sm:p-2 bg-white rounded border border-blue-200">
//                                     <div className="flex-1 min-w-0 mr-2">
//                                       <p className="font-semibold text-gray-900 truncate text-xs">{subjectName}</p>
//                                       <p className="text-xs text-gray-400 truncate">ID: {subject.id.substring(0, 6)}...</p>
//                                     </div>
//                                     <span className="text-blue-600 font-bold text-xs whitespace-nowrap">
//                                       {selectedPlan?.pricePerSubjectFormatted}
//                                     </span>
//                                   </div>
//                                 ) : null;
//                               })}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Pricing */}
//                     {totalAmount > 0 && (
//                       <>
//                         <Separator className="bg-gray-200" />
//                         <div className="space-y-1.5 sm:space-y-2">
//                           <div className="flex justify-between text-xs">
//                             <span className="text-gray-500">Original Price</span>
//                             <span className="font-medium line-through text-gray-400">
//                               ₦{originalPrice.toLocaleString()}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-xs">
//                             <span className="text-gray-500">Discount</span>
//                             <span className="font-bold text-blue-600">
//                               -₦{discount.toLocaleString()}
//                             </span>
//                           </div>

//                           <Separator className="bg-gray-200" />

//                           <div className="flex justify-between items-baseline pt-1 sm:pt-2">
//                             <span className="text-xs sm:text-sm font-bold text-gray-900">Total</span>
//                             <div className="text-right">
//                               <div className="text-xl sm:text-2xl font-black text-blue-600">
//                                 ₦{totalAmount.toLocaleString()}
//                               </div>
//                               <p className="text-xs text-gray-500">one-time</p>
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     )}

//                     {/* Promo Code */}
//                     <div className="rounded-lg border-2 border-dashed border-gray-200 p-2 sm:p-3">
//                       <Label htmlFor="promo" className="text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 block">
//                         Promo code?
//                       </Label>
//                       <div className="flex gap-1 sm:gap-1.5">
//                         <Input
//                           id="promo"
//                           placeholder="Enter code"
//                           value={promoCode}
//                           onChange={(e) => setPromoCode(e.target.value)}
//                           className="flex-1 h-8 sm:h-9 text-xs sm:text-sm border-gray-300"
//                         />
//                         <Button variant="outline" className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm border-gray-300 font-semibold whitespace-nowrap">
//                           Apply
//                         </Button>
//                       </div>
//                     </div>

//                     {/* Purchase Button */}
//                     <Button
//                       onClick={handlePayment}
//                       disabled={!selectedExam || !selectedPlan || selectedSubjects.length === 0 || paymentLoading}
//                       className="w-full h-10 sm:h-12 text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
//                     >
//                       {paymentLoading ? (
//                         <span className="flex items-center">
//                           <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                           </svg>
//                           Processing...
//                         </span>
//                       ) : (
//                         "Complete Purchase"
//                       )}
//                     </Button>

//                     {/* Money Back Guarantee */}
//                     <div className="text-center rounded-lg bg-green-50 border border-green-200 p-2 sm:p-2.5">
//                       <p className="text-xs font-bold text-green-800 mb-0.5">
//                         30-Day Money-Back Guarantee
//                       </p>
//                       <p className="text-xs text-green-600">
//                         100% refund if not satisfied
//                       </p>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }







import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import useAuthStore from "@/store/authStore";
import { usePaymentStore } from "@/store/paymentStore"
import { useToast } from "@/components/ui/use-toast";
import {
  Check, ShieldCheck, Star, Sparkles,
  Clock, ChevronRight,
  ShoppingCart, X, Trash2, Tag, Loader2
} from "lucide-react"

export default function Checkout() {
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
    verifyPromo,
  } = usePaymentStore()
  const { toast } = useToast();

  // Step-based state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [subjectsByCategory, setSubjectsByCategory] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null); // { valid, discount, discountedTotal, message }

  // Pending cart state
  const [pendingCart, setPendingCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

  const plansList = Array.isArray(apiPlans?.plans) ? apiPlans.plans :
                    Array.isArray(apiPlans) ? apiPlans : [];

  // Load pending cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('pendingCheckoutCart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setPendingCart(cart);
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    }
  }, []);

  // Save pending cart to localStorage
  useEffect(() => {
    if (Object.keys(pendingCart).length > 0) {
      localStorage.setItem('pendingCheckoutCart', JSON.stringify(pendingCart));
    } else {
      localStorage.removeItem('pendingCheckoutCart');
    }
  }, [pendingCart]);

  // Restore cart when switching exams
  useEffect(() => {
    if (selectedExam && pendingCart[selectedExam]) {
      const examCart = pendingCart[selectedExam];
      if (examCart.plan) {
        setSelectedPlan(plansList.find(p => p.id === examCart.plan));
      }
      if (examCart.subjects) {
        setSelectedSubjects(examCart.subjects);
      }
      if (examCart.plan) {
        setCurrentStep(3);
      }
    }
  }, [selectedExam, pendingCart, plansList]);

  // Close cart on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartOpen && !event.target.closest('.cart-container')) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen]);

  // Fetch plans and payment status on mount
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
    const loadSubjectsFromPreferences = async () => {
      try {
        const res = await fetch(`${API_BASE}/preferences`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const data = await res.json();
        const preferences = data.data?.preferences || {};
        const selectedSubjects = preferences.selectedSubjects || {};
        const formatted = {};
        Object.entries(selectedSubjects).forEach(([exam, subjects]) => {
          formatted[exam] = subjects.map((s) => ({
            id: s.id || s._id,
            name: s.name || s.subjectName || "Unknown Subject",
          }));
        });
        setSubjectsByCategory(formatted);
      } catch (err) {
        console.error("❌ Failed to load subjects:", err);
        setSubjectsByCategory({});
      }
    };
    loadSubjectsFromPreferences();
  }, [accessToken]);

  const availableExams = Object.keys(subjectsByCategory);

  const handleExamSelect = (exam) => {
    if (selectedExam && (selectedPlan || selectedSubjects.length > 0)) {
      setPendingCart(prev => ({
        ...prev,
        [selectedExam]: {
          plan: selectedPlan?.id,
          subjects: selectedSubjects,
          planName: selectedPlan?.name,
          pricePerSubject: selectedPlan?.pricePerSubject,
        }
      }));
    }
    setSelectedExam(exam);
    setPromoResult(null);
    setPromoCode("");
    if (pendingCart[exam]) {
      const examCart = pendingCart[exam];
      const plan = plansList.find(p => p.id === examCart.plan);
      setSelectedPlan(plan);
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
    setPromoResult(null);
    if (plan.isLifetime || plan.id === 'PREMIUM') {
      const examSubjects = subjectsByCategory[selectedExam] || [];
      setSelectedSubjects(examSubjects.map(s => s.id));
    } else {
      setSelectedSubjects([]);
    }
    setCurrentStep(3);
    setPendingCart(prev => ({
      ...prev,
      [selectedExam]: {
        plan: plan.id,
        subjects: plan.isLifetime ? (subjectsByCategory[selectedExam] || []).map(s => s.id) : [],
        planName: plan.name,
        pricePerSubject: plan.pricePerSubject,
      }
    }));
  };

  const toggleSubject = (subjectId) => {
    setPromoResult(null);
    setSelectedSubjects(prev => {
      const newSubjects = prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId];
      setPendingCart(prevCart => ({
        ...prevCart,
        [selectedExam]: { ...prevCart[selectedExam], subjects: newSubjects }
      }));
      return newSubjects;
    });
  };

  // ✅ Promo code verification
  const handleVerifyPromo = async () => {
    if (!promoCode.trim()) return;
    if (!selectedPlan) {
      toast({ variant: "destructive", title: "Select a plan first", description: "Please select a plan before applying a promo code." });
      return;
    }
    setPromoLoading(true);
    setPromoResult(null);
    try {
      const result = await verifyPromo({
        code: promoCode.trim(),
        plan: selectedPlan.id,
        subjectCount: selectedSubjects.length || 1,
      });
      if (result.success) {
        setPromoResult({ valid: true, ...result.data, message: result.message });
        toast({ title: "Promo Applied! 🎉", description: result.message || "Discount applied successfully." });
      } else {
        setPromoResult({ valid: false, message: result.message });
        toast({ variant: "destructive", title: "Invalid Promo Code", description: result.message });
      }
    } catch (err) {
      setPromoResult({ valid: false, message: "Failed to verify promo code" });
    } finally {
      setPromoLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan || selectedSubjects.length === 0) return 0;
    return selectedPlan.pricePerSubject * selectedSubjects.length;
  };

  const calculateCartTotal = () => {
    let total = 0;
    Object.entries(pendingCart).forEach(([exam, cart]) => {
      if (cart.pricePerSubject && cart.subjects) {
        total += cart.pricePerSubject * cart.subjects.length;
      }
    });
    return total;
  };

  const totalAmount = calculateTotal();
  const cartTotal = calculateCartTotal();
  const originalPrice = totalAmount > 0 ? Math.round(totalAmount * 1.5) : 0;
  const discountedTotal = promoResult?.valid ? (promoResult.discountedTotal ?? promoResult.finalAmount ?? totalAmount) : totalAmount;
  const promoDiscount = promoResult?.valid ? (totalAmount - discountedTotal) : 0;
  const baseDiscount = originalPrice - totalAmount;

  const clearCart = () => {
    setPendingCart({});
    localStorage.removeItem('pendingCheckoutCart');
    setIsCartOpen(false);
    setPromoResult(null);
    setPromoCode("");
    toast({ title: "Cart cleared", description: "All items have been removed from your cart." });
  };

  const removeFromCart = (exam) => {
    setPendingCart(prev => {
      const newCart = { ...prev };
      delete newCart[exam];
      return newCart;
    });
    toast({ title: "Removed from cart", description: `${exam} items removed from cart.` });
  };

  const getCartItemCount = () => Object.keys(pendingCart).length;

  const loadCartItem = (exam) => {
    const examCart = pendingCart[exam];
    if (!examCart) return;
    setSelectedExam(exam);
    const plan = plansList.find(p => p.id === examCart.plan);
    setSelectedPlan(plan);
    setSelectedSubjects(examCart.subjects || []);
    setCurrentStep(3);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async () => {
    if (!selectedExam || !selectedPlan || selectedSubjects.length === 0) {
      toast({ variant: "destructive", title: "Incomplete Selection", description: "Please select exam, plan, and at least one subject." });
      return;
    }
    try {
      const result = await initializePayment({
        plan: selectedPlan.id,
        subjects: selectedSubjects,
        amount: discountedTotal,
        promoCode: promoResult?.valid ? promoCode.trim() : undefined,
      });
      if (result?.alreadyPaid) {
        toast({ title: "Already Subscribed!", description: result.message || "You already have an active subscription!" });
        clearCart();
        setTimeout(() => window.location.href = "/user/dashboard", 2000);
      } else {
        setPendingCart(prev => {
          const newCart = { ...prev };
          delete newCart[selectedExam];
          return newCart;
        });
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast({ variant: "destructive", title: "Payment Failed", description: error.message || "Failed to initialize payment. Please try again." });
    }
  };

  const formatExpiry = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const examSubjects = selectedExam ? (subjectsByCategory[selectedExam] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">

      {/* ── Fixed Header ── */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Choose Your Learning Path
            </h1>
            <p className="text-gray-500 text-[11px] sm:text-sm hidden sm:block">
              Select exam → Choose plan → Pick subjects
            </p>
          </div>

          {/* Cart */}
          <div className="relative cart-container flex-shrink-0">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative bg-white hover:bg-gray-50 text-gray-900 rounded-full p-2.5 shadow-md border-2 border-gray-200 transition-all hover:scale-105"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute top-full right-0 mt-3 w-[calc(100vw-1.5rem)] sm:w-80 md:w-96 max-w-sm bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-h-[75vh] overflow-hidden flex flex-col z-50">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <h3 className="font-bold text-base">Your Cart</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="hover:bg-white/20 rounded-full p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {getCartItemCount() === 0 ? (
                    <div className="text-center py-10">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 font-medium text-sm">Your cart is empty</p>
                      <p className="text-gray-400 text-xs mt-1">Add items to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(pendingCart).map(([exam, cart]) => {
                        const itemTotal = cart.pricePerSubject * (cart.subjects?.length || 0);
                        return (
                          <div key={exam} className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-sm text-gray-900">{exam}</h4>
                                <p className="text-xs text-gray-500">{cart.planName}</p>
                              </div>
                              <button onClick={() => removeFromCart(exam)} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Subjects:</span>
                                <span className="font-semibold">{cart.subjects?.length || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Per subject:</span>
                                <span className="font-semibold">₦{cart.pricePerSubject?.toLocaleString()}</span>
                              </div>
                              <div className="pt-1.5 border-t flex justify-between items-center">
                                <span className="font-bold text-gray-900">Subtotal:</span>
                                <span className="font-bold text-blue-600">₦{itemTotal.toLocaleString()}</span>
                              </div>
                            </div>
                            <button onClick={() => loadCartItem(exam)} className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-1.5 rounded-lg text-xs transition-colors">
                              Continue Editing
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {getCartItemCount() > 0 && (
                  <div className="border-t-2 border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm text-gray-900">Total:</span>
                      <span className="font-black text-xl text-blue-600">₦{cartTotal.toLocaleString()}</span>
                    </div>
                    <button onClick={clearCart} className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 rounded-lg transition-all text-sm">
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20 sm:h-24" />

      <div className="mx-auto max-w-6xl px-3 sm:px-6 py-6 md:py-10">
        {initialLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-primary mx-auto" />
              <p className="mt-5 text-base text-muted-foreground font-medium">Loading plans...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Active Subscription Banner */}
            {paid && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-semibold text-sm">Active Subscription</p>
                  {expiresAt && <p className="text-green-700 text-xs mt-0.5">Expires on {formatExpiry(expiresAt)}</p>}
                </div>
              </div>
            )}

            {/* Error */}
            {paymentError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-800 text-sm">{paymentError}</p>
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6 gap-1.5 sm:gap-2">
              {[{ n: 1, label: "Exam" }, { n: 2, label: "Plan" }, { n: 3, label: "Subjects" }].map(({ n, label }, i) => (
                <div key={n} className="flex items-center gap-1.5 sm:gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm transition-colors ${currentStep >= n ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <span className="font-bold">{n}</span>
                    <span className="font-medium hidden xs:inline sm:inline">{label}</span>
                  </div>
                  {i < 2 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
              {/* ── Main Content ── */}
              <div className="space-y-5">

                {/* STEP 1: Select Exam */}
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className={`p-4 sm:p-6 ${currentStep === 1 ? 'bg-primary-hover text-white' : 'bg-gray-100'}`}>
                    <h2 className="text-base sm:text-xl font-semibold mb-0.5">Step 1: Choose Exam Type</h2>
                    <p className="text-xs sm:text-sm opacity-90">
                      {selectedExam ? `Selected: ${selectedExam}` : "Select the exam you're preparing for"}
                    </p>
                  </div>
                  <div className="p-4 sm:p-6">
                    {availableExams.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableExams.map((exam) => (
                          <button
                            key={exam}
                            onClick={() => handleExamSelect(exam)}
                            className={`py-3 px-4 rounded-xl border-2 text-left transition-all ${
                              selectedExam === exam ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-0.5">{exam}</h3>
                                <p className="text-xs text-muted-foreground">{subjectsByCategory[exam]?.length || 0} subjects available</p>
                              </div>
                              {selectedExam === exam && <Check className="w-6 h-6 text-primary flex-shrink-0" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground text-sm">No exams available</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* STEP 2: Select Plan */}
                {currentStep >= 2 && (
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className={`p-4 sm:p-6 ${currentStep === 2 ? 'bg-primary-hover text-white' : 'bg-gray-100'}`}>
                      <h2 className="text-base sm:text-xl font-semibold mb-0.5">Step 2: Choose Your Plan</h2>
                      <p className="text-xs sm:text-sm opacity-90">
                        {selectedPlan ? `Selected: ${selectedPlan.name}` : 'Pick the plan that suits you best'}
                      </p>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 ">
                        {plansList.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => handlePlanSelect(plan)}
                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                              selectedPlan?.id === plan.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50 hover:shadow-md'
                            }`}
                          >
                            {plan.isPopular && (
                              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                                POPULAR
                              </div>
                            )}
                            <h3 className="text-lg sm:text-2xl font-bold mb-1.5">{plan.name}</h3>
                            <div className="grid grid-cols-1 justify-between items-center mb-1">
                              <div className="flex items-baseline">
                                <span className="text-2xl sm:text-3xl font-black">{plan.pricePerSubjectFormatted}</span>
                                <span className="text-xs text-muted-foreground">/subject</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span className="text-red-900">{plan.isLifetime ? 'Lifetime' : `${plan.durationDays}d`}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
                            {selectedPlan?.id === plan.id && (
                              <div className="flex items-center gap-1.5 text-primary font-semibold text-sm">
                                <Check className="w-4 h-4" />
                                <span>Selected</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* STEP 3: Select Subjects */}
                {currentStep >= 3 && (
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="bg-primary-hover p-4 sm:p-6 text-white">
                      <h2 className="text-base sm:text-xl font-semibold mb-0.5">Step 3: Select Subjects</h2>
                      <p className="text-xs sm:text-sm opacity-90">
                        {selectedSubjects.length} of {examSubjects.length} subjects selected
                        {selectedPlan?.isLifetime && ' (All auto-selected for Premium)'}
                      </p>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {examSubjects.map((subject) => {
                          const isSelected = selectedSubjects.includes(subject.id);
                          const isDisabled = selectedPlan?.isLifetime;
                          return (
                            <button
                              key={subject.id}
                              onClick={() => !isDisabled && toggleSubject(subject.id)}
                              disabled={isDisabled}
                              className={`py-2.5 px-3 sm:px-4 rounded-lg border-2 text-left transition-all ${
                                isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                              } ${isDisabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                                  {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">{subject.name || subject.subjectName}</p>
                                  <p className="text-xs text-muted-foreground">{selectedPlan?.pricePerSubjectFormatted}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Secure & Encrypted</p>
                    <p className="text-xs text-muted-foreground">Your payment information is protected</p>
                  </div>
                </div>
              </div>

              {/* ── Order Summary ── */}
              <div className="lg:sticky lg:top-24 h-fit">
                <Card className="overflow-hidden border border-gray-200 shadow-lg">
                  <div className="bg-primary p-4 text-white">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-base sm:text-lg font-bold">Order Summary</h3>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    </div>
                    <p className="text-xs opacity-90">Review your purchase</p>
                  </div>

                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Selected Details */}
                    {selectedExam && (
                      <div className="space-y-2">
                        <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-gray-500 mb-0.5">Exam</p>
                          <p className="font-black text-sm text-gray-900 truncate">{selectedExam}</p>
                        </div>

                        {selectedPlan && (
                          <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-gray-500 mb-0.5">Plan</p>
                            <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{selectedPlan.name}</p>
                            <p className="text-xs text-gray-500">{selectedPlan.isLifetime ? 'Lifetime Access' : `${selectedPlan.durationDays} days`}</p>
                          </div>
                        )}

                        {selectedSubjects.length > 0 && (
                          <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-gray-500 mb-2">Subjects ({selectedSubjects.length})</p>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {selectedSubjects.map(subjectId => {
                                const subject = examSubjects.find(s => s.id === subjectId);
                                if (!subject) return null;
                                return (
                                  <div key={subjectId} className="flex items-center justify-between text-xs p-1.5 bg-white rounded border border-blue-200">
                                    <p className="font-semibold text-gray-900 truncate flex-1 mr-2">{subject.name || subject.subjectName}</p>
                                    <span className="text-blue-600 font-bold whitespace-nowrap">{selectedPlan?.pricePerSubjectFormatted}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pricing */}
                    {totalAmount > 0 && (
                      <>
                        <Separator className="bg-gray-200" />
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Original Price</span>
                            <span className="font-medium line-through text-gray-400">₦{originalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Discount</span>
                            <span className="font-bold text-blue-600">-₦{baseDiscount.toLocaleString()}</span>
                          </div>
                          {promoResult?.valid && (
                            <div className="flex justify-between text-xs">
                              <span className="text-green-600 font-semibold flex items-center gap-1">
                                <Tag className="w-3 h-3" /> Promo ({promoCode})
                              </span>
                              <span className="font-bold text-green-600">-₦{promoDiscount.toLocaleString()}</span>
                            </div>
                          )}
                          <Separator className="bg-gray-200" />
                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-sm font-bold text-gray-900">Total</span>
                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-black text-blue-600">₦{discountedTotal.toLocaleString()}</div>
                              <p className="text-xs text-gray-500">one-time</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Promo Code */}
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-3">
                      <Label className="text-xs font-semibold text-gray-600 mb-1.5 block">Promo code?</Label>
                      <div className="flex gap-1.5">
                        <Input
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value.toUpperCase());
                            setPromoResult(null);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleVerifyPromo()}
                          className={`flex-1 h-8 text-xs border-gray-300 ${promoResult?.valid ? 'border-green-400' : promoResult?.valid === false ? 'border-red-400' : ''}`}
                        />
                        <Button
                          variant="outline"
                          onClick={handleVerifyPromo}
                          disabled={promoLoading || !promoCode.trim()}
                          className="h-8 px-3 text-xs border-gray-300 font-semibold whitespace-nowrap"
                        >
                          {promoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                        </Button>
                      </div>
                      {promoResult && (
                        <p className={`text-xs mt-1.5 font-medium ${promoResult.valid ? 'text-green-600' : 'text-red-500'}`}>
                          {promoResult.valid ? `✓ ${promoResult.message || 'Promo applied!'}` : `✗ ${promoResult.message}`}
                        </p>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={!selectedExam || !selectedPlan || selectedSubjects.length === 0 || paymentLoading}
                      className="w-full h-10 sm:h-12 text-sm font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                      ) : "Complete Purchase"}
                    </Button>

                    {/* Money Back */}
                    <div className="text-center rounded-lg bg-green-50 border border-green-200 p-2.5">
                      <p className="text-xs font-bold text-green-800 mb-0.5">30-Day Money-Back Guarantee</p>
                      <p className="text-xs text-green-600">100% refund if not satisfied</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}