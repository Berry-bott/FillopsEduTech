import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { usePaymentStore } from "@/store/paymentStore"
import { useToast } from "@/components/ui/use-toast";
import { Check, ShieldCheck, Star, Sparkles, Clock } from "lucide-react"

export default function Checkout() {
  const {
    plans: apiPlans,
    loading: paymentLoading,
    error: paymentError,
    paid,
    expiresAt,
    fetchPlans,
    initializePayment,
    checkStatus,
  } = usePaymentStore()
  const { toast } = useToast();
  const [selectedSubjects, setSelectedSubjects] = useState({})
  const [subjectsByCategory, setSubjectsByCategory] = useState({})
  const [hoveredSubject, setHoveredSubject] = useState(null)
  const [promoCode, setPromoCode] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)

  // Ensure plans is always an array and extract from correct path
  const plansList = Array.isArray(apiPlans?.plans) ? apiPlans.plans : 
                    Array.isArray(apiPlans) ? apiPlans : []

  // Fetch plans and payment status on mount
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true)
      await fetchPlans()
      await checkStatus()
      setInitialLoading(false)
    }
    loadData()
  }, [])

  // Load subjects from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("prefSubjects") || "{}")
    setSubjectsByCategory(stored)
  }, [])

  // Handle subject + plan selection
  const selectSubjectWithPlan = (subjectId, subjectName, category, plan) => {
    setSelectedSubjects((prev) => {
      const newSelection = { ...prev }
      
      const pricePerSubject = plan.price || 0
      
      newSelection[subjectId] = {
        name: subjectName,
        category: category,
        plan: plan.id,
        planName: plan.name,
        price: pricePerSubject,
        duration: plan.isLifetime ? 'Lifetime' : `${plan.durationDays} days`
      }
      
      return newSelection
    })
    
    setHoveredSubject(null)
  }

  // Remove subject
  const removeSubject = (subjectId) => {
    setSelectedSubjects((prev) => {
      const newSelection = { ...prev }
      delete newSelection[subjectId]
      return newSelection
    })
  }

  // Calculate total amount
  const totalAmount = Object.values(selectedSubjects).reduce(
    (sum, subject) => sum + (subject.price || 0),
    0
  )
  
  const originalPrice = totalAmount > 0 ? Math.round(totalAmount * 1.5) : 0
  const discount = originalPrice - totalAmount

  // Handle payment
  const handlePayment = async () => {
    if (Object.keys(selectedSubjects).length === 0) {
      alert("Please select at least one subject with a plan")
      return
    }

    // Group subjects by plan ID
    const subjectsByPlan = {}
    Object.entries(selectedSubjects).forEach(([subjectId, data]) => {
      if (!subjectsByPlan[data.plan]) {
        subjectsByPlan[data.plan] = {
          subjects: [],
          planName: data.planName,
          totalPrice: 0
        }
      }
      subjectsByPlan[data.plan].subjects.push(subjectId)
      subjectsByPlan[data.plan].totalPrice += data.price
    })

    // Get the first plan
    const planEntries = Object.entries(subjectsByPlan)
    const [firstPlanId, planData] = planEntries[0]

    console.log("💳 Initializing payment with:", {
      plan: firstPlanId,
      subjects: planData.subjects,
      amount: totalAmount,
    })

    try {
    const result =  await initializePayment({
        plan: firstPlanId,
        subjects: planData.subjects,
        amount: totalAmount,
      })

        // ✅ Simple toast for already paid
        if (result?.alreadyPaid) {
          toast({
            title: "Already Subscribed!",
            description: result.message || "You already have an active subscription!",
          });
          
          setTimeout(() => navigate("/user/dashboard"), 2000);
          return;
        }

      
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "Failed to initialize payment. Please try again.",
      });
      // alert("Payment failed. Please try again.")
    }
  }

  // Format expiry date
  const formatExpiry = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
  <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
    {/* Loading State */}
    {initialLoading ? (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-lg text-muted-foreground font-medium">Loading plans...</p>
        </div>
      </div>
    ) : (
      <>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Subjects & Plans
          </h1>
          <p className="text-gray-600">
            Hover over any subject to choose a plan
          </p>
        </div>

        {/* Current Status */}
        {paid && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-green-800 font-medium">Active Subscription</p>
                {expiresAt && (
                  <p className="text-green-700 text-sm">
                    Expires on {formatExpiry(expiresAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{paymentError}</p>
          </div>
        )}

    <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
  {/* Main Content - Left Side */}
    <div className="space-y-6">
    {/* Subject Selection by Category */}
    {Object.keys(subjectsByCategory).length > 0 ? (
      <Card className="overflow-hidden border-0 shadow-lg shadow-primary/5">
        <div className="bg-gradient-to-br from-primary to-secondary p-6 text-primary-foreground">
          <h2 className="text-xl font-semibold mb-1">Select Subjects & Plans</h2>
          <p className="text-sm text-primary-foreground/90">
            {Object.keys(selectedSubjects).length} subject(s) selected • Hover to choose plan
          </p>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(subjectsByCategory).map(([category, subjects]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold uppercase text-primary">
                  {category}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({subjects.length} subjects)
                </span>
              </div>

              {/* Subjects Grid */}
              <div className="grid md:grid-cols-2 gap-3">
                {subjects.map((subject) => {
                  const isSelected = selectedSubjects[subject.id]
                  const isHovered = hoveredSubject === subject.id

                  return (
                    <div
                      key={subject.id}
                      className="relative"
                      onMouseEnter={() => setHoveredSubject(subject.id)}
                      onMouseLeave={() => setHoveredSubject(null)}
                    >
                      {/* Subject Card */}
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                            isSelected 
                              ? "bg-primary border-primary" 
                              : "border-border"
                          }`}>
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium block mb-1">
                              {subject.name}
                            </span>
                            {isSelected && (
                              <div className="flex gap-2 justify- items-start">
                                <p className="text-xs text-primary font-semibold">
                                  {selectedSubjects[subject.id].planName}
                                </p>
                                <div className="flex items-center justify-between">
                                  {/* <p className="text-xs text-muted-foreground">
                                    {selectedSubjects[subject.id].duration}
                                  </p> */}
                                  <p className="text-sm font-bold text-primary">
                                    ₦{selectedSubjects[subject.id].price.toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeSubject(subject.id)
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium mt-1"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                            {!isSelected && (
                              <p className="text-xs text-muted-foreground">
                                Hover to select plan
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Plans Menu */}
                  {isHovered && !isSelected && (
                    <div className="absolute left-0 top-0 mt-0 w-full z-[99999] animate-in fade-in slide-in-from-top-2 duration-200">
                      <Card className="border-2 border-primary shadow-xl p-1">
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
                          <p className="text-xs font-semibold text-primary">
                            Choose a plan for {subject.name}
                          </p>
                        </div>
                        <div className="p-1 space-y-1 max-h-30 overflow-y-auto">
                          {plansList.map((plan) => (
                            <button
                              key={plan.id}
                              onClick={() => selectSubjectWithPlan(
                                subject.id,
                                subject.name,
                                category,
                                plan
                              )}
                              className="w-full text-left p-1 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-1 mb-1">
                                    <p className="font-semibold text-sm">
                                      {plan.name}
                                    </p>
                                    {plan.isPopular && (
                                      <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                        POPULAR
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <Clock className="w-3 h-3"/>
                                    <span>
                                      {plan.isLifetime ? 'Lifetime Access' : `${plan.durationDays} days`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs">
                                    <Check className="w-3 h-3 text-green-600" />
                                    <span className="text-muted-foreground">
                                      {plan.description}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-primary">
                                    {plan.priceFormatted}
                                  </div>
                                  {/* <div className="text-xs text-muted-foreground">
                                    full access
                                  </div> */}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    ) : (
      <Card className="p-12 text-center">
        <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No Subjects Found</h3>
        <p className="text-sm text-muted-foreground">
          Please select subjects from the preferences page first.
        </p>
      </Card>
    )}

    {/* Security Badge */}
    <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary/20 bg-card p-5 shadow-sm">
      <ShieldCheck className="h-7 w-7 text-primary" />
      <div>
        <p className="text-sm font-semibold">Secure & Encrypted</p>
        <p className="text-xs text-muted-foreground">
          Your payment information is protected
        </p>
      </div>
    </div>
    </div>

    {/* Order Summary - Right Side */}
    <div className="sticky top-8">
      <Card className="overflow-hidden border-0 shadow-xl shadow-accent/10">
        <div className="bg-gradient-to-br from-accent/90 to-primary/80 p-6 text-accent-foreground">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm text-accent-foreground/90">Review your purchase</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected Subjects List */}
          {Object.keys(selectedSubjects).length > 0 ? (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  Selected Subjects ({Object.keys(selectedSubjects).length}):
                </p>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {Object.entries(selectedSubjects).map(([id, data]) => (
                    <div
                      key={id}
                      className="p-2 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{data.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {data.category.toUpperCase()} • {data.planName}
                          </p>
                        </div>
                        <button
                          onClick={() => removeSubject(id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {data.duration}
                        </span>
                        <span className="font-semi-bold text-sm text-primary">
                          ₦{data.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No subjects selected yet</p>
              <p className="text-xs mt-1">Hover over subjects to choose plans</p>
            </div>
                )}

                {/* Pricing */}
                {Object.keys(selectedSubjects).length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original Price</span>
                      <span className="font-medium line-through text-muted-foreground">
                        ₦{originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Limited Time Discount</span>
                      <span className="font-semibold text-primary">
                        -₦{discount.toLocaleString()}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-semibold">Total Amount</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          ₦{totalAmount.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">one-time payment</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                <div className="rounded-lg border-2 border-dashed border-border p-4">
                  <Label
                    htmlFor="promo"
                    className="text-xs font-medium text-muted-foreground mb-2 block"
                  >
                    Have a promo code?
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 h-10 border-2"
                    />
                    <Button
                      variant="outline"
                      className="h-10 px-5 border-2 bg-transparent font-semibold"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={Object.keys(selectedSubjects).length === 0 || paymentLoading}
                      className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Complete Purchase"
                      )}
                    </Button>

                    {/* Money Back Guarantee */}
                    <div className="text-center rounded-lg bg-muted/50 p-3">
                      <p className="text-xs font-medium text-foreground mb-1">
                        30-Day Money-Back Guarantee
                      </p>
                      <p className="text-xs text-muted-foreground">
                        100% refund if you're not satisfied
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Additional Info */}
                <Card className="mt-4 p-5 space-y-3 border-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    What's Included
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Unlimited question access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Detailed explanations</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Mobile & desktop access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Progress tracking</span>
                  </div>
                </Card>
    </div>
    </div>
      </>
    )}
  </div>
</div>
  )
}