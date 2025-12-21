import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useStudyStore } from "@/store/studyStore"
import { CreditCard, Check, ShieldCheck, Star, Sparkles } from "lucide-react"

export default function checkoutPage() {
   const { initializePayment, paymentLoading } = useStudyStore();
  const [selectedPayment, setSelectedPayment] = useState("card")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Secure Checkout</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <span className="text-sm font-medium hidden sm:inline">Billing</span>
              </div>
              <div className="h-px w-8 bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <span className="text-sm font-medium hidden sm:inline">Payment</span>
              </div>
              <div className="h-px w-8 bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border text-sm font-medium text-muted-foreground">
                  3
                </div>
                <span className="text-sm text-muted-foreground hidden sm:inline">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Main Content - Left Side */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg shadow-primary/5">
              <div className="bg-gradient-to-br from-primary to-secondary p-6 text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Billing Information</h2>
                    <p className="text-sm text-primary-foreground/90">Complete your personal details</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input id="firstName" placeholder="Enter first name" className="h-11 border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input id="lastName" placeholder="Enter last name" className="h-11 border-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="h-11 border-2" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country / Region
                  </Label>
                  <select
                    id="country"
                    className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  >
                    <option value="">Select your country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg shadow-secondary/5">
              <div className="bg-gradient-to-br from-secondary to-primary p-6 text-secondary-foreground">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Payment Method</h2>
                    <p className="text-sm text-secondary-foreground/90">Choose how you want to pay</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-foreground/20 backdrop-blur-sm">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Payment Method Selection */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setSelectedPayment("card")}
                    className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                      selectedPayment === "card"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border hover:border-primary/40 bg-card"
                    }`}
                  >
                    <CreditCard
                      className={`h-8 w-8 ${selectedPayment === "card" ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="font-semibold">Credit Card</span>
                    {selectedPayment === "card" && (
                      <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPayment("paypal")}
                    className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                      selectedPayment === "paypal"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border hover:border-primary/40 bg-card"
                    }`}
                  >
                    <svg
                      className={`h-8 w-8 ${selectedPayment === "paypal" ? "text-primary" : "text-muted-foreground"}`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21l1.518-9.636.04-.221a.805.805 0 0 1 .794-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327-.02-.035-.04-.07-.06-.104a5.23 5.23 0 0 1 3.643 6.566z" />
                    </svg>
                    <span className="font-semibold">PayPal</span>
                    {selectedPayment === "paypal" && (
                      <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Card Details Form */}
                {selectedPayment === "card" && (
                  <div className="space-y-5 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-sm font-medium">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="h-11 border-2 font-mono tracking-wider"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-sm font-medium">
                          Expiration Date
                        </Label>
                        <Input id="expiry" placeholder="MM / YY" className="h-11 border-2 font-mono" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="text-sm font-medium">
                          CVV / CVC
                        </Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          maxLength={3}
                          className="h-11 border-2 font-mono text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName" className="text-sm font-medium">
                        Name on Card
                      </Label>
                      <Input id="cardName" placeholder="Full name as shown on card" className="h-11 border-2" />
                    </div>
                  </div>
                )}

                {selectedPayment === "paypal" && (
                  <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21l1.518-9.636.04-.221a.805.805 0 0 1 .794-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327-.02-.035-.04-.07-.06-.104a5.23 5.23 0 0 1 3.643 6.566z" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      Click below to securely log in to PayPal and complete your purchase
                    </p>
                    <Button variant="outline" className="h-11 px-8 border-2 bg-card font-medium">
                      Continue with PayPal
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary/20 bg-card p-5 shadow-sm">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <div>
                <p className="text-sm font-semibold">Secure & Encrypted</p>
                <p className="text-xs text-muted-foreground">Your payment information is protected</p>
              </div>
            </div>
          </div>

          <div>
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
                  {/* Course Item */}
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0 overflow-hidden border-2 border-border">
                      <img src="/online-learning-platform.png" alt="Course" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-snug mb-2 text-balance">
                        Complete Web Development Bootcamp 2024
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">by Sarah Johnson</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <Star className="h-3.5 w-3.5 fill-primary/30 text-primary/30" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">4.8</span>
                        <span className="text-xs text-muted-foreground">(12,450)</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original Price</span>
                      <span className="font-medium line-through text-muted-foreground">$199.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course Discount</span>
                      <span className="font-semibold text-primary">-$150.00</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-semibold">Total Amount</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          $49.99
                        </div>
                        <p className="text-xs text-muted-foreground">one-time payment</p>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="rounded-lg border-2 border-dashed border-border p-4">
                    <Label htmlFor="promo" className="text-xs font-medium text-muted-foreground mb-2 block">
                      Have a promo code?
                    </Label>
                    <div className="flex gap-2">
                      <Input id="promo" placeholder="Enter code" className="flex-1 h-10 border-2" />
                      <Button variant="outline" className="h-10 px-5 border-2 bg-transparent font-semibold">
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <Button 
                   onClick={initializePayment}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                    {paymentLoading ? "Redirecting..." : "Complete Purchase"}
                  </Button>

                  {/* Money Back Guarantee */}
                  <div className="text-center rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-foreground mb-1">30-Day Money-Back Guarantee</p>
                    <p className="text-xs text-muted-foreground">100% refund if you're not satisfied</p>
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
                  <span className="font-medium">Lifetime course access</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Mobile & desktop access</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
