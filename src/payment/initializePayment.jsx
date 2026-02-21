import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"
import { useNavigate, useLocation, Link } from "react-router-dom";


export default function InitializePayment() {
  // const { initializePayment, paymentLoading } = useStudyStore();
  const navigate = useNavigate();




  return (
    <Card className="flex flex-col h-[91vh] border-2 border-border shadow-2xl">
      
      {/* HEADER */}
      <div className="p-2 border-b bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="size-8 text-education-orange" />
          <h1 className="text-2xl font-bold text-primary">Go Premium</h1>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Unlock unlimited learning potential
        </p>

        <p className="text-primary-hover text-sm text-center mt-2">
          You have exhausted your <span className="text-2xl font-bold text-destructive">50</span> free questions. Please subscribe to continue.
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Benefits */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primary-hover">
            <Sparkles className="size-5 text-education-orange" />
            Premium Benefits
          </h2>

          <div className="space-y-2 text-muted-foreground">
            {[
              "Unlimited access to 10,000+ courses",
              "Premium exclusive content",
              "Ad-free learning experience",
              "Verified certificates",
              "Priority 24h support",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="size-4 mt-1" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-accent/50 relative">
          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
            Most Popular
          </Badge>

          <div className="text-center space-y-2 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Premium Plan</p>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">₦500</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              // onClick={initializePayment}
              onClick={() => {
                console.log("navigating");
                navigate("/checkout")
              }}
              // disabled={paymentLoading}
            >
               Subscribe Now!
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <p className="text-xl font-bold text-education-orange">10K+</p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">500K+</p>
            <p className="text-xs text-muted-foreground">Learners</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-destructive">95%</p>
            <p className="text-xs text-muted-foreground">Satisfied</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
