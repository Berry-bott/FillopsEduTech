// import { useEffect, useState } from "react";
// import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
// import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
// import { useAdminStore } from "@/store/adminStore";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   DollarSign,
//   TrendingUp,
//   Zap,
//   Loader2,
//   CheckCircle2,
//   Calendar,
//   RefreshCw,
//   Save,
//   CreditCard,
//   PencilLine,
//   Clock,
//   BarChart3
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "Free / —");

// const durationText = (days) => {
//   if (days === null) return "Lifetime";
//   if (days === 30) return "30 days";
//   if (days === 365) return "1 year";
//   return days ? `${days} days` : "—";
// };

// // ─── SKELETON PLACEHOLDERS ───────────────────────────────────────────────────

// function TabButtonSkeleton() {
//   return (
//     <div className="flex items-center gap-3 rounded-xl border p-4">
//       <div className="rounded-lg p-2.5 h-10 w-10 bg-gray-200 animate-pulse" />
//       <div className="space-y-1 flex-1">
//         <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
//         <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
//       </div>
//     </div>
//   );
// }

// function PricingCardSkeleton() {
//   return (
//     <Card className="overflow-hidden">
//       <CardContent className="p-6 space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
//           <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
//         </div>
//         <div className="space-y-3">
//           <div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
//           <div className="h-10 w-32 rounded bg-gray-200 animate-pulse" />
//           <div className="space-y-2 mt-3">
//             <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
//             <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function UpdateFormCardSkeleton() {
//   return (
//     <Card className="overflow-hidden">
//       <CardHeader className="pb-3">
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
//           <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
//         </div>
//         <div className="h-4 w-48 rounded bg-gray-200 animate-pulse mt-2" />
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div>
//           <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-1.5" />
//           <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
//         </div>
//         <div className="space-y-2">
//           <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
//           <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
//         </div>
//         <div className="h-9 w-full rounded bg-gray-200 animate-pulse" />
//       </CardContent>
//     </Card>
//   );
// }

// function StatsCardSkeleton() {
//   return (
//     <Card>
//       <CardContent className="p-5">
//         <div className="flex items-start justify-between">
//           <div className="space-y-2">
//             <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
//             <div className="h-9 w-24 rounded bg-gray-200 animate-pulse" />
//           </div>
//           <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ─── VIEW 1: GET PRICING ──────────────────────────────────────────────────────
// function GetPricingView() {
//   const { pricing, loading } = useAdminStore();
//   const p = pricing?.raw;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">Current Pricing</h2>
//           <p className="text-sm text-muted-foreground">
//             {pricing?.updatedAt && `Last updated: ${new Date(pricing.updatedAt).toLocaleString()}`}
//             {pricing?.isDefault && " • Default configuration"}
//           </p>
//         </div>
//         <Button variant="outline" size="sm" onClick={() => useAdminStore.getState().fetchPricing()} disabled={loading}>
//           {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <RefreshCw className="h-3.5 w-3.5 mr-2" />}
//           Refresh
//         </Button>
//       </div>

//       {loading ? (
//         <div className="grid gap-6 md:grid-cols-3">
//           {[...Array(3)].map((_, i) => <PricingCardSkeleton key={i} />)}
//         </div>
//       ) : p ? (
//         <div className="grid gap-6 md:grid-cols-3">
//           {[
//             { key: "monthly", label: "Monthly Plan", desc: "Billed every month", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
//             { key: "yearly", label: "Yearly Plan", desc: "Billed once per year", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
//             { key: "premium", label: "Premium Plan", desc: "Full access forever", icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
//           ].map((plan) => {
//             const item = p[plan.key];
//             return (
//               <Card key={plan.key} className={cn("border", plan.border)}>
//                 <CardContent className="p-6 space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className={cn("rounded-xl p-3", plan.bg)}>
//                       <plan.icon className={cn("h-5 w-5", plan.color)} />
//                     </div>
//                     <Badge variant="outline" className="text-xs">Active</Badge>
//                   </div>
//                   <div>
//                     <p className="text-lg font-semibold">{plan.label}</p>
//                     <p className="text-3xl font-bold mt-1">{fmt(item?.priceNaira)}</p>
//                     <div className="mt-3 space-y-1 text-sm">
//                       <p className="text-muted-foreground flex items-center gap-1.5">
//                         <Clock className="h-3.5 w-3.5" />
//                         {durationText(item?.durationDays)}
//                       </p>
//                       <p className="text-muted-foreground">{item?.description || "—"}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="py-20 text-center">
//           <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/30" />
//           <p className="mt-3 text-sm text-muted-foreground">No pricing data found</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── VIEW 2: UPDATE PRICING ───────────────────────────────────────────────────
// function UpdatePricingView() {
//   const { updatePricing, pricing, loading } = useAdminStore();
//   const [form, setForm] = useState({
//     monthly: { priceNaira: "" },
//     yearly: { priceNaira: "" },
//     premium: { priceNaira: "" }
//   });
//   const [saving, setSaving] = useState(null);
//   const [saved, setSaved] = useState(null);

//   const p = pricing?.raw;

//   useEffect(() => {
//     if (p) {
//       setForm({
//         monthly: { priceNaira: p.monthly?.priceNaira ?? "" },
//         yearly: { priceNaira: p.yearly?.priceNaira ?? "" },
//         premium: { priceNaira: p.premium?.priceNaira ?? "" }
//       });
//     }
//   }, [p]);

//   const handleChange = (plan, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [plan]: { ...prev[plan], priceNaira: value }
//     }));
//   };

//   const handleSaveOne = async (planKey) => {
//     setSaving(planKey);
//     const payload = { [planKey]: { priceNaira: Number(form[planKey].priceNaira) } };
//     await updatePricing(payload);
//     setSaving(null);
//     setSaved(planKey);
//     setTimeout(() => setSaved(null), 2000);
//   };

//   const handleSaveAll = async () => {
//     setSaving("all");
//     const payload = {
//       monthly: { priceNaira: Number(form.monthly.priceNaira) },
//       yearly: { priceNaira: Number(form.yearly.priceNaira) },
//       premium: { priceNaira: Number(form.premium.priceNaira) }
//     };
//     await updatePricing(payload);
//     setSaving(null);
//     setSaved("all");
//     setTimeout(() => setSaved(null), 2000);
//   };

//   const plans = [
//     { key: "monthly", label: "Monthly Price", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10" },
//     { key: "yearly", label: "Yearly Price", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
//     { key: "premium", label: "Premium Price", icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10" }
//   ];

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-1">
//           <div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
//           <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
//         </div>

//         <div className="grid gap-6 md:grid-cols-3">
//           {[...Array(3)].map((_, i) => <UpdateFormCardSkeleton key={i} />)}
//         </div>

//         <div className="h-20 rounded-lg border-2 border-dashed border-gray-300 animate-pulse" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-semibold text-foreground">Update Pricing</h2>
//         <p className="text-sm text-muted-foreground">Change prices (₦). Descriptions & durations are currently read-only.</p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         {plans.map((plan) => {
//           const item = p?.[plan.key];
//           return (
//             <Card key={plan.key} className={cn("border", plan.border || "border-border")}>
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-2">
//                   <div className={cn("rounded-lg p-2", plan.bg)}>
//                     <plan.icon className={cn("h-4 w-4", plan.color)} />
//                   </div>
//                   <CardTitle className="text-base">{plan.label}</CardTitle>
//                 </div>
//                 {item && (
//                   <CardDescription className="text-xs mt-1">
//                     Current: <strong>{fmt(item.priceNaira)}</strong> • {durationText(item.durationDays)}
//                   </CardDescription>
//                 )}
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label className="text-xs text-muted-foreground mb-1.5 block">New Price (₦)</Label>
//                   <Input
//                     type="number"
//                     value={form[plan.key].priceNaira}
//                     onChange={(e) => handleChange(plan.key, e.target.value)}
//                     placeholder="Enter amount"
//                     className="font-mono"
//                   />
//                 </div>
//                 <div className="text-xs text-muted-foreground space-y-0.5">
//                   <p>{item?.description || "No description"}</p>
//                   <p className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" /> {durationText(item?.durationDays)}
//                   </p>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => handleSaveOne(plan.key)}
//                   disabled={saving === plan.key}
//                 >
//                   {saving === plan.key ? (
//                     <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
//                   ) : saved === plan.key ? (
//                     <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" />
//                   ) : (
//                     <Save className="h-3.5 w-3.5 mr-2" />
//                   )}
//                   {saved === plan.key ? "Saved!" : "Update Price"}
//                 </Button>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <Card className="border-dashed border-2">
//         <CardContent className="flex items-center justify-between p-6">
//           <div>
//             <p className="text-base font-semibold">Save All Prices at Once</p>
//             <p className="text-sm text-muted-foreground mt-1">Update all three plans in a single request</p>
//           </div>
//           <Button onClick={handleSaveAll} disabled={saving === "all"} className="min-w-[180px]">
//             {saving === "all" ? (
//               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//             ) : saved === "all" ? (
//               <CheckCircle2 className="h-4 w-4 mr-2" />
//             ) : (
//               <Save className="h-4 w-4 mr-2" />
//             )}
//             {saved === "all" ? "All Saved!" : "Save All"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // ─── VIEW 3: SUBSCRIPTION STATS ───────────────────────────────────────────────
// function SubscriptionStatsView() {
//   const { subscriptionStats, loading } = useAdminStore();

//   const s = subscriptionStats || {};

//   const statCards = [
//     { label: "Total Subscriptions", value: s.subscriptions?.total ?? "—", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
//     { label: "Active", value: s.subscriptions?.active ?? s.subscriptions?.total ?? "—", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
//     { label: "Monthly", value: s.subscriptions?.monthly ?? "—", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10" },
//     { label: "Yearly", value: s.subscriptions?.yearly ?? "—", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-500/10" },
//     { label: "Premium", value: s.subscriptions?.premium ?? "—", icon: Zap, color: "text-purple-600", bg: "bg-purple-500/10" },
//     { label: "Total Revenue", value: s.revenue?.totalNaira != null ? fmt(s.revenue.totalNaira) : "—", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" },
//   ];

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="space-y-2">
//             <div className="h-7 w-56 rounded bg-gray-200 animate-pulse" />
//             <div className="h-4 w-80 rounded bg-gray-200 animate-pulse" />
//           </div>
//           <div className="h-9 w-28 rounded bg-gray-200 animate-pulse" />
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {[...Array(6)].map((_, i) => <StatsCardSkeleton key={i} />)}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">Subscription Statistics</h2>
//           <p className="text-sm text-muted-foreground">Overview of all subscriber activity</p>
//         </div>
//         <Button variant="outline" size="sm" onClick={() => useAdminStore.getState().fetchSubscriptionStats()} disabled={loading}>
//           {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <RefreshCw className="h-3.5 w-3.5 mr-2" />}
//           Refresh
//         </Button>
//       </div>

//       {subscriptionStats ? (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {statCards.map((card) => (
//             <Card key={card.label}>
//               <CardContent className="p-5">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
//                       {card.label}
//                     </p>
//                     <p className="text-3xl font-bold text-foreground">{card.value}</p>
//                   </div>
//                   <div className={cn("rounded-xl p-3", card.bg)}>
//                     <card.icon className={cn("h-5 w-5", card.color)} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="py-20 text-center">
//           <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/30" />
//           <p className="mt-3 text-sm text-muted-foreground">No subscription data available</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// const VIEWS = [
//   { id: "get-pricing", label: "Get Pricing", icon: DollarSign },
//   { id: "update-pricing", label: "Update Pricing", icon: PencilLine },
//   { id: "subscription-stats", label: "Subscription Stats", icon: BarChart3},
// ];

// export default function PricingPage() {
//   const [activeView, setActiveView] = useState("get-pricing");
//   const [initialLoading, setInitialLoading] = useState(true);

//   const loading = useAdminStore((s) => s.loading);

//   // Fetch data only once when component mounts
//   useEffect(() => {
//     const { fetchPricing, fetchSubscriptionStats } = useAdminStore.getState();

//     // Fetch both datasets (covers all tabs)
//     fetchPricing();
//     fetchSubscriptionStats();

//     // Consider initial load done after a short delay (to show skeleton briefly)
//     const timer = setTimeout(() => {
//       setInitialLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   // Reset data when leaving the page (next visit → show skeleton again)
//   useEffect(() => {
//     return () => {
//       useAdminStore.setState({
//         pricing: null,
//         subscriptionStats: null,
//       });
//       setInitialLoading(true);
//     };
//   }, []);

//   const showSkeleton = initialLoading || loading;

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
//       <main className="pl-64">
//         <Header title="Pricing & Subscriptions" description="Manage plan prices and view subscriber statistics" />

//         <div className="p-6 space-y-8">
//           {/* Tab selector */}
//           {showSkeleton ? (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {[...Array(3)].map((_, i) => <TabButtonSkeleton key={i} />)}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {VIEWS.map((v) => {
//                 const isActive = activeView === v.id;
//                 return (
//                   <button
//                     key={v.id}
//                     onClick={() => setActiveView(v.id)}
//                     className={cn(
//                       "flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer",
//                       isActive
//                         ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
//                         : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/70"
//                     )}
//                   >
//                     <div className={cn(
//                       "rounded-lg p-2.5 shrink-0 transition-colors",
//                       isActive ? "bg-white/25" : "bg-muted"
//                     )}>
//                       <v.icon className="h-5 w-5" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className={cn(
//                         "text-sm font-semibold",
//                         isActive ? "text-primary-foreground" : ""
//                       )}>
//                         {v.label}
//                       </p>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           )}

//           {/* Render views */}
//           {activeView === "get-pricing" && <GetPricingView />}
//           {activeView === "update-pricing" && <UpdatePricingView />}
//           {activeView === "subscription-stats" && <SubscriptionStatsView />}
//         </div>
//       </main>
//     </div>
//   );
// }










import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { useAdminStore } from "@/store/adminStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Zap,
  Loader2,
  CheckCircle2,
  Calendar,
  RefreshCw,
  Save,
  CreditCard,
  PencilLine,
  Clock,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "Free / —");

const durationText = (days) => {
  if (days === null) return "Lifetime";
  if (days === 30) return "30 days";
  if (days === 365) return "1 year";
  return days ? `${days} days` : "—";
};

// ─── SKELETON PLACEHOLDERS ───────────────────────────────────────────────────

function TabButtonSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4">
      <div className="rounded-lg p-2.5 h-10 w-10 bg-gray-200 animate-pulse" />
      <div className="space-y-1 flex-1">
        <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

function PricingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-10 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="space-y-2 mt-3">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpdateFormCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-1.5" />
          <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-9 w-full rounded bg-gray-200 animate-pulse" />
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-9 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── VIEW 1: GET PRICING ──────────────────────────────────────────────────────
function GetPricingView() {
  const { pricing, loading } = useAdminStore();
  const p = pricing?.raw;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Current Pricing</h2>
          <p className="text-sm text-muted-foreground">
            {pricing?.updatedAt && `Last updated: ${new Date(pricing.updatedAt).toLocaleString()}`}
            {pricing?.isDefault && " • Default configuration"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => useAdminStore.getState().fetchPricing()} disabled={loading}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <RefreshCw className="h-3.5 w-3.5 mr-2" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <PricingCardSkeleton key={i} />)}
        </div>
      ) : p ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { key: "monthly", label: "Monthly Plan", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { key: "yearly", label: "Yearly Plan", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { key: "premium", label: "Premium Plan", icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          ].map((plan) => {
            const item = p[plan.key];
            return (
              <Card key={plan.key} className={cn("border", plan.border)}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("rounded-xl p-3", plan.bg)}>
                      <plan.icon className={cn("h-5 w-5", plan.color)} />
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{plan.label}</p>
                    <p className="text-3xl font-bold mt-1">{fmt(item?.priceNaira)}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {durationText(item?.durationDays)}
                      </p>
                      <p className="text-muted-foreground">{item?.description || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">No pricing data found</p>
        </div>
      )}
    </div>
  );
}

// ─── VIEW 2: UPDATE PRICING ───────────────────────────────────────────────────
function UpdatePricingView() {
  const { updatePricing, pricing, loading } = useAdminStore();

  // ✅ FIX: form starts EMPTY so the placeholder text is visible and
  // the user types the new price from scratch. Previously the form was
  // pre-filled with current prices, so Number(value) just re-sent the
  // same price back to the server — making it look like nothing changed.
  const [form, setForm] = useState({
    monthly: { priceNaira: "" },
    yearly:  { priceNaira: "" },
    premium: { priceNaira: "" },
  });
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const [errors, setErrors] = useState({});

  // We still need the ref so the skeleton only shows on true first load
  const initializedRef = useRef(false);
  const p = pricing?.raw;

  useEffect(() => {
    if (p) initializedRef.current = true;
  }, [p]);

  const handleChange = (plan, value) => {
    setErrors((prev) => ({ ...prev, [plan]: null }));
    setForm((prev) => ({
      ...prev,
      [plan]: { priceNaira: value },
    }));
  };

  const handleSaveOne = async (planKey) => {
    const val = Number(form[planKey].priceNaira);
    if (!form[planKey].priceNaira || isNaN(val) || val <= 0) {
      setErrors((prev) => ({ ...prev, [planKey]: "Enter a valid price greater than 0" }));
      return;
    }

    setSaving(planKey);
    const result = await updatePricing({ [planKey]: { priceNaira: val } });
    setSaving(null);

    if (result?.success) {
      setSaved(planKey);
      // Clear only this plan's input after successful save
      setForm((prev) => ({ ...prev, [planKey]: { priceNaira: "" } }));
      setTimeout(() => setSaved(null), 2000);
    }
  };

  const handleSaveAll = async () => {
    const newErrors = {};
    ["monthly", "yearly", "premium"].forEach((key) => {
      const val = Number(form[key].priceNaira);
      if (!form[key].priceNaira || isNaN(val) || val <= 0) {
        newErrors[key] = "Enter a valid price greater than 0";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving("all");
    const result = await updatePricing({
      monthly: { priceNaira: Number(form.monthly.priceNaira) },
      yearly:  { priceNaira: Number(form.yearly.priceNaira) },
      premium: { priceNaira: Number(form.premium.priceNaira) },
    });
    setSaving(null);

    if (result?.success) {
      setSaved("all");
      setForm({ monthly: { priceNaira: "" }, yearly: { priceNaira: "" }, premium: { priceNaira: "" } });
      setTimeout(() => setSaved(null), 2000);
    }
  };

  const plans = [
    { key: "monthly", label: "Monthly Price", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10" },
    { key: "yearly",  label: "Yearly Price",  icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { key: "premium", label: "Premium Price", icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10" },
  ];

  if (loading && !initializedRef.current) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <UpdateFormCardSkeleton key={i} />)}
        </div>
        <div className="h-20 rounded-lg border-2 border-dashed border-gray-300 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Update Pricing</h2>
        <p className="text-sm text-muted-foreground">
          Type the new price below each plan and click Update Price. Descriptions & durations are read-only.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const item = p?.[plan.key];
          return (
            <Card key={plan.key} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("rounded-lg p-2", plan.bg)}>
                    <plan.icon className={cn("h-4 w-4", plan.color)} />
                  </div>
                  <CardTitle className="text-base">{plan.label}</CardTitle>
                </div>
                {item && (
                  <CardDescription className="text-xs mt-1">
                    {/* This updates live from the store after a successful save */}
                    Current: <strong>{fmt(item.priceNaira)}</strong> • {durationText(item.durationDays)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">New Price (₦)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form[plan.key].priceNaira}
                    onChange={(e) => handleChange(plan.key, e.target.value)}
                    // placeholder shows the current price as a hint
                    placeholder={item?.priceNaira ? `e.g. ${item.priceNaira}` : "Enter amount"}
                    className={cn("font-mono", errors[plan.key] && "border-red-500")}
                  />
                  {errors[plan.key] && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors[plan.key]}
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>{item?.description || "No description"}</p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {durationText(item?.durationDays)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSaveOne(plan.key)}
                  disabled={saving === plan.key}
                >
                  {saving === plan.key ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  ) : saved === plan.key ? (
                    <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                  ) : (
                    <Save className="h-3.5 w-3.5 mr-2" />
                  )}
                  {saved === plan.key ? "Saved!" : "Update Price"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-base font-semibold">Save All Prices at Once</p>
            <p className="text-sm text-muted-foreground mt-1">Fill in all three fields above then click Save All</p>
          </div>
          <Button onClick={handleSaveAll} disabled={saving === "all"} className="min-w-[180px]">
            {saving === "all" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : saved === "all" ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saved === "all" ? "All Saved!" : "Save All"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── VIEW 3: SUBSCRIPTION STATS ───────────────────────────────────────────────
function SubscriptionStatsView() {
  const { subscriptionStats, loading } = useAdminStore();

  const s = subscriptionStats || {};

  const statCards = [
    { label: "Total Subscriptions", value: s.subscriptions?.total ?? "—", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active", value: s.subscriptions?.active ?? s.subscriptions?.total ?? "—", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Monthly", value: s.subscriptions?.monthly ?? "—", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Yearly", value: s.subscriptions?.yearly ?? "—", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Premium", value: s.subscriptions?.premium ?? "—", icon: Zap, color: "text-purple-600", bg: "bg-purple-500/10" },
    { label: "Total Revenue", value: s.revenue?.totalNaira != null ? fmt(s.revenue.totalNaira) : "—", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-56 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-80 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Subscription Statistics</h2>
          <p className="text-sm text-muted-foreground">Overview of all subscriber activity</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => useAdminStore.getState().fetchSubscriptionStats()} disabled={loading}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <RefreshCw className="h-3.5 w-3.5 mr-2" />}
          Refresh
        </Button>
      </div>

      {subscriptionStats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className={cn("rounded-xl p-3", card.bg)}>
                    <card.icon className={cn("h-5 w-5", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">No subscription data available</p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const VIEWS = [
  { id: "get-pricing", label: "Get Pricing", icon: DollarSign },
  { id: "update-pricing", label: "Update Pricing", icon: PencilLine },
  { id: "subscription-stats", label: "Subscription Stats", icon: BarChart3 },
];

export default function PricingPage() {
  const [activeView, setActiveView] = useState("get-pricing");
  const [initialLoading, setInitialLoading] = useState(true);
  const loading = useAdminStore((s) => s.loading);

  useEffect(() => {
    const { fetchPricing, fetchSubscriptionStats } = useAdminStore.getState();
    fetchPricing();
    fetchSubscriptionStats();
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      useAdminStore.setState({ pricing: null, subscriptionStats: null });
    };
  }, []);

  const showSkeleton = initialLoading || loading;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Pricing & Subscriptions" description="Manage plan prices and view subscriber statistics" />

        <div className="p-6 space-y-8">
          {showSkeleton ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <TabButtonSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VIEWS.map((v) => {
                const isActive = activeView === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/70"
                    )}
                  >
                    <div className={cn("rounded-lg p-2.5 shrink-0 transition-colors", isActive ? "bg-white/25" : "bg-muted")}>
                      <v.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", isActive ? "text-primary-foreground" : "")}>
                        {v.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeView === "get-pricing" && <GetPricingView />}
          {activeView === "update-pricing" && <UpdatePricingView />}
          {activeView === "subscription-stats" && <SubscriptionStatsView />}
        </div>
      </main>
    </div>
  );
}