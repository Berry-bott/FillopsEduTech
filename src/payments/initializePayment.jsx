import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"



export default function InitializePayment(){
    return(
        <div>
        <Card className="overflow-y-auto flex flex-col border-2 border-border shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Crown className="size-8 text-education-orange" />
                    <h1 className="text-2xl font-bold text-primary">Go Premium</h1>
                </div>
                <p className="text-center text-sm text-muted-foreground text-balance">Unlock unlimited learning potential</p>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 p-4 space-y-4">
                {/* Premium Features */}
                <div className="space-y-3">
                    <h2 className="text-lg text-primary-hover font-semibold flex items-center gap-2">
                    <Sparkles className="size-5 text-education-orange" />
                    Premium Benefits
                    </h2>
                    <div className="space-y-2 text-muted-foreground">
                    {[
                        "Unlimited access to 10,000+ courses",
                        "Premium exclusive content",
                        "Ad-free learning experience",
                        "Verified certificates",
                        "Offline downloads",
                        "Priority 24h support",
                    ].map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                        <Check className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Pricing Card */}
                <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-accent/50 relative">
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-primary-hover text-xs hover:text-white">
                    Most Popular
                    </Badge>
                    <div className="text-center space-y-4 mt-2">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Premium Plan</div>
                        <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                            #500
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <Button className="w-full" size="lg">
                        Start Premium Trial
                        </Button>
                        {/* <p className="text-xs text-muted-foreground text-center">7-day free trial • Cancel anytime</p> */}
                    </div>
                    </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                    <div className="text-center">
                    <div className="text-xl font-bold text-education-orange">10K+</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                    </div>
                    <div className="text-center">
                    <div className="text-xl font-bold text-sidebar-ring">500K+</div>
                    <div className="text-xs text-muted-foreground">Learners</div>
                    </div>
                    <div className="text-center">
                    <div className="text-xl font-bold text-destructive">95%</div>
                    <div className="text-xs text-muted-foreground">Satisfied</div>
                    </div>
                </div>
                </div>

        </Card>
        </div>
    )
}