// import { useEffect, useState, useCallback } from "react";
// import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
// import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAdminStore } from "@/store/adminStore";
// import {
//   Users, Search, Tag, ToggleLeft, ToggleRight,
//   Plus, TrendingUp, AlertCircle, CheckCircle2,
//   ChevronDown, ChevronLeft, ChevronRight, X,
//   BarChart2, Percent, DollarSign, Loader2,
// } from "lucide-react";

// // ─── BADGE HELPERS ────────────────────────────────────────────────────────────

// const PLAN_COLORS = {
//   FREE:    "bg-slate-100 text-slate-600",
//   MONTHLY: "bg-blue-100 text-blue-700",
//   YEARLY:  "bg-violet-100 text-violet-700",
//   PREMIUM: "bg-amber-100 text-amber-700",
//   ALL:     "bg-gray-100 text-gray-700",
// };

// const EXAM_COLORS = {
//   WAEC:  "bg-green-100 text-green-700",
//   JAMB:  "bg-orange-100 text-orange-700",
//   NECO:  "bg-teal-100 text-teal-700",
//   PUTME: "bg-pink-100 text-pink-700",
// };

// function PlanBadge({ plan }) {
//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_COLORS[plan] ?? "bg-gray-100 text-gray-600"}`}>
//       {plan ?? "—"}
//     </span>
//   );
// }

// function ExamBadge({ category }) {
//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${EXAM_COLORS[category] ?? "bg-gray-100 text-gray-600"}`}>
//       {category ?? "—"}
//     </span>
//   );
// }

// function StatusDot({ active }) {
//   return (
//     <span className={`inline-flex h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
//   );
// }

// function SkeletonRow({ cols = 6 }) {
//   return (
//     <tr>
//       {[...Array(cols)].map((_, i) => (
//         <td key={i} className="px-4 py-3">
//           <div className="h-4 rounded bg-gray-200 animate-pulse" style={{ width: `${55 + i * 8}%` }} />
//         </td>
//       ))}
//     </tr>
//   );
// }

// // ─── NATIVE DROPDOWN (avoids Dialog / overflow clipping) ─────────────────────

// function NativeSelect({ value, onChange, options, placeholder, disabled }) {
//   const [open, setOpen] = useState(false);
//   const selected = options.find((o) => o.value === value);

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => setOpen((p) => !p)}
//         className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
//       >
//         <span className={selected ? "text-foreground" : "text-muted-foreground"}>
//           {selected ? selected.label : placeholder}
//         </span>
//         <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
//       </button>

//       {open && (
//         <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
//           <div className="max-h-48 overflow-y-auto py-1">
//             {options.map((o) => (
//               <button
//                 key={o.value}
//                 type="button"
//                 onClick={() => { onChange(o.value); setOpen(false); }}
//                 className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${value === o.value ? "bg-accent font-medium" : ""}`}
//               >
//                 {o.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── CREATE PROMO MODAL ───────────────────────────────────────────────────────

// const EMPTY_FORM = {
//   code: "",
//   discountType: "PERCENTAGE",
//   value: "",
//   validForPlan: "ALL",
//   expiresAt: "",
//   maxUses: "",
//   unlimited: false,
// };

// function CreatePromoModal({ open, onClose, onSuccess }) {
//   const { createPromoCode } = useAdminStore();

//   const [code, setCode]               = useState("");
//   const [discountType, setDiscountType] = useState("PERCENTAGE");
//   const [value, setValue]             = useState("");
//   const [validForPlan, setValidForPlan] = useState("ALL");
//   const [expiresAt, setExpiresAt]     = useState("");
//   const [maxUses, setMaxUses]         = useState("");
//   const [unlimited, setUnlimited]     = useState(false);
//   const [submitting, setSubmitting]   = useState(false);
//   const [feedback, setFeedback]       = useState(null);

//   // Reset all fields when modal opens/closes
//   useEffect(() => {
//     if (!open) {
//       setCode(""); setDiscountType("PERCENTAGE"); setValue("");
//       setValidForPlan("ALL"); setExpiresAt(""); setMaxUses("");
//       setUnlimited(false); setSubmitting(false); setFeedback(null);
//     }
//   }, [open]);

//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       setFeedback({ type: "error", message: "Promo code is required." });
//       return;
//     }
//     if (!value) {
//       setFeedback({ type: "error", message: "Discount value is required." });
//       return;
//     }
//     if (!expiresAt) {
//       setFeedback({ type: "error", message: "Expiry date is required." });
//       return;
//     }

//     setSubmitting(true);
//     setFeedback(null);

//     const payload = {
//       code: code.toUpperCase().trim(),
//       discountType,
//       value: Number(value),
//       validForPlan,
//       expiresAt: new Date(expiresAt).toISOString(),
//     };
//     if (!unlimited && maxUses) payload.maxUses = Number(maxUses);

//     const res = await createPromoCode(payload);

//     if (res?.success) {
//       setFeedback({ type: "success", message: "Promo code created successfully!" });
//       onSuccess?.();
//       setTimeout(onClose, 1100);
//     } else {
//       setFeedback({ type: "error", message: res?.message || "Failed to create promo code." });
//       setSubmitting(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="w-full max-w-md rounded-xl border bg-background shadow-xl">

//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <h2 className="flex items-center gap-2 text-lg font-semibold">
//             <Tag className="h-5 w-5 text-primary" />
//             Create Promo Code
//           </h2>
//           <button onClick={onClose} className="rounded-md p-1 hover:bg-accent">
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-4 px-6 py-5">

//           {/* Code */}
//           <div className="space-y-1.5">
//             <Label htmlFor="promo-code">Code *</Label>
//             <Input
//               id="promo-code"
//               placeholder="e.g. WELCOME50"
//               value={code}
//               onChange={(e) => setCode(e.target.value.toUpperCase())}
//             />
//           </div>

//           {/* Discount Type + Value */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1.5">
//               <Label>Discount Type *</Label>
//               <NativeSelect
//                 value={discountType}
//                 onChange={setDiscountType}
//                 placeholder="Select type"
//                 options={[
//                   { value: "PERCENTAGE", label: "Percentage (%)" },
//                   { value: "FIXED", label: "Fixed (Kobo)" },
//                 ]}
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="promo-value">
//                 Value * {discountType === "FIXED" ? "(Kobo)" : "(%)"}
//               </Label>
//               <Input
//                 id="promo-value"
//                 type="number"
//                 placeholder={discountType === "PERCENTAGE" ? "50" : "50000"}
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Valid For Plan + Expires */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1.5">
//               <Label>Valid For Plan</Label>
//               <NativeSelect
//                 value={validForPlan}
//                 onChange={setValidForPlan}
//                 placeholder="Select plan"
//                 options={[
//                   { value: "ALL",     label: "All Plans" },
//                   { value: "MONTHLY", label: "Monthly" },
//                   { value: "YEARLY",  label: "Yearly" },
//                   { value: "PREMIUM", label: "Premium" },
//                 ]}
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="promo-expires">Expires At *</Label>
//               <Input
//                 id="promo-expires"
//                 type="datetime-local"
//                 value={expiresAt}
//                 onChange={(e) => setExpiresAt(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Max Uses */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="promo-maxuses">Max Uses</Label>
//               <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
//                 <input
//                   type="checkbox"
//                   checked={unlimited}
//                   onChange={(e) => setUnlimited(e.target.checked)}
//                   className="rounded"
//                 />
//                 Unlimited
//               </label>
//             </div>
//             <Input
//               id="promo-maxuses"
//               type="number"
//               placeholder="100"
//               value={maxUses}
//               disabled={unlimited}
//               onChange={(e) => setMaxUses(e.target.value)}
//               className={unlimited ? "opacity-50" : ""}
//             />
//           </div>

//           {/* Feedback */}
//           {feedback && (
//             <div className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm ${
//               feedback.type === "success"
//                 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                 : "bg-red-50 text-red-700 border-red-200"
//             }`}>
//               {feedback.type === "success"
//                 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
//                 : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               }
//               {feedback.message}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-2 border-t px-6 py-4">
//           <Button variant="outline" onClick={onClose} disabled={submitting}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={submitting}>
//             {submitting
//               ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
//               : "Create Promo Code"
//             }
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────

// export default function UsersPromoPage() {
//   const {
//     users,         fetchUsers,
//     userStats,     fetchUserStats,
//     promoCodes,    fetchPromoCodes,
//     promoStats,    fetchPromoStats,
//     togglePromoCode,
//     loading,
//   } = useAdminStore();

//   const [tab, setTab]             = useState("users");
//   const [pageLoading, setPageLoading] = useState(true);

//   // ── Users filter state ──
//   const [search, setSearch]           = useState("");
//   const [planFilter, setPlanFilter]   = useState("");
//   const [examFilter, setExamFilter]   = useState("");
//   const [verifiedFilter, setVerified] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination]   = useState(null);
//   const [statsPeriod, setStatsPeriod] = useState("daily");

//   // ── Promo filter state ──
//   const [promoSearch, setPromoSearch] = useState("");
//   const [promoActive, setPromoActive] = useState("");
//   const [createOpen, setCreateOpen]   = useState(false);

//   // ── Initial load ──
//   useEffect(() => {
//     const t = setTimeout(() => setPageLoading(false), 500);

//     Promise.all([
//       fetchUsers({ page: 1, limit: 10 }).then((r) => {
//         if (r?.data?.pagination) setPagination(r.data.pagination);
//       }),
//       fetchUserStats("daily"),
//       fetchPromoCodes({ page: 1, limit: 50 }),
//       fetchPromoStats(),
//     ]);

//     return () => { clearTimeout(t); setPageLoading(true); };
//   }, []);

//   // ── Apply user filters ──
//   const applyUserFilters = useCallback(async (overrides = {}) => {
//     const params = { page: currentPage, limit: 10 };
//     if (search)               params.search           = search;
//     if (planFilter)           params.subscriptionPlan = planFilter;
//     if (examFilter)           params.examCategory     = examFilter;
//     if (verifiedFilter !== "") params.emailVerified   = verifiedFilter;
//     Object.assign(params, overrides);

//     const res = await fetchUsers(params);
//     if (res?.data?.pagination) setPagination(res.data.pagination);
//   }, [search, planFilter, examFilter, verifiedFilter, currentPage]);

//   // ── Apply promo filters ──
//   const applyPromoFilters = useCallback(() => {
//     const params = { page: 1, limit: 50 };
//     if (promoSearch)        params.search   = promoSearch;
//     if (promoActive !== "") params.isActive = promoActive;
//     fetchPromoCodes(params);
//   }, [promoSearch, promoActive]);

//   const safeUsers  = Array.isArray(users)      ? users      : [];
//   const safePromos = Array.isArray(promoCodes) ? promoCodes : [];

//   // ─── FULL PAGE SKELETON ───────────────────────────────────────────────────────
//   if (pageLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Sidebar />
//         <main className="pl-64">
//           <Header title="Users & Promo Codes" description="Manage users and promotional codes" />
//           <div className="p-6 space-y-6">
//             <div className="grid grid-cols-4 gap-4">
//               {[...Array(4)].map((_, i) => (
//                 <Card key={i}><CardContent className="p-4 space-y-2">
//                   <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
//                   <div className="h-8 w-16 rounded bg-gray-200 animate-pulse" />
//                 </CardContent></Card>
//               ))}
//             </div>
//             <Card><CardContent className="p-4 space-y-3">
//               {[...Array(7)].map((_, i) => <div key={i} className="h-12 rounded bg-gray-200 animate-pulse" />)}
//             </CardContent></Card>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />

//       <main className="pl-64">
//         <Header title="Users & Promo Codes" description="Manage users and promotional codes" />

//         <div className="p-6 space-y-6">

//           {/* ── Tab switcher ── */}
//           <div className="flex gap-1 rounded-lg border bg-muted p-1 w-fit">
//             {[
//               { key: "users",  label: "Users",       Icon: Users },
//               { key: "promos", label: "Promo Codes",  Icon: Tag   },
//             ].map(({ key, label, Icon }) => (
//               <button
//                 key={key}
//                 onClick={() => setTab(key)}
//                 className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
//                   tab === key
//                     ? "bg-background shadow text-foreground"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 <Icon className="h-4 w-4" /> {label}
//               </button>
//             ))}
//           </div>

//           {/* ══════════════════ USERS TAB ══════════════════ */}
//           {tab === "users" && (
//             <div className="space-y-6">

//               {/* Acquisition stats */}
//               {userStats && (
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                   {[
//                     { label: "Total New Users", value: userStats.total ?? userStats.totalNewUsers ?? "—",  Icon: Users,     color: "text-blue-600"   },
//                     { label: "Verified",        value: userStats.verified ?? "—",                           Icon: CheckCircle2, color: "text-emerald-600" },
//                     { label: "Period",          value: statsPeriod.charAt(0).toUpperCase() + statsPeriod.slice(1), Icon: BarChart2, color: "text-violet-600"  },
//                     { label: "Growth",          value: userStats.growth ?? userStats.change ?? "—",         Icon: TrendingUp, color: "text-amber-600"  },
//                   ].map(({ label, value, Icon, color }) => (
//                     <Card key={label}><CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm text-muted-foreground">{label}</p>
//                         <Icon className={`h-4 w-4 ${color}`} />
//                       </div>
//                       <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
//                     </CardContent></Card>
//                   ))}
//                 </div>
//               )}

//               {/* Period switcher */}
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-sm text-muted-foreground">Acquisition period:</span>
//                 {["daily", "weekly", "monthly", "yearly"].map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => { setStatsPeriod(p); fetchUserStats(p); }}
//                     className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
//                       statsPeriod === p
//                         ? "bg-primary text-primary-foreground"
//                         : "bg-muted text-muted-foreground hover:bg-accent"
//                     }`}
//                   >
//                     {p.charAt(0).toUpperCase() + p.slice(1)}
//                   </button>
//                 ))}
//               </div>

//               {/* Filters */}
//               <Card>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-base">Filter Users</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
//                     <div className="relative xl:col-span-2">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         placeholder="Search name or email…"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="pl-9"
//                       />
//                     </div>

//                     <NativeSelect
//                       value={planFilter}
//                       onChange={setPlanFilter}
//                       placeholder="All Plans"
//                       options={[
//                         { value: "",        label: "All Plans" },
//                         { value: "FREE",    label: "Free"      },
//                         { value: "MONTHLY", label: "Monthly"   },
//                         { value: "YEARLY",  label: "Yearly"    },
//                         { value: "PREMIUM", label: "Premium"   },
//                       ]}
//                     />

//                     <NativeSelect
//                       value={examFilter}
//                       onChange={setExamFilter}
//                       placeholder="All Exams"
//                       options={[
//                         { value: "",      label: "All Exams" },
//                         { value: "WAEC",  label: "WAEC"      },
//                         { value: "JAMB",  label: "JAMB"      },
//                         { value: "NECO",  label: "NECO"      },
//                         { value: "PUTME", label: "PUTME"     },
//                       ]}
//                     />

//                     <NativeSelect
//                       value={verifiedFilter}
//                       onChange={setVerified}
//                       placeholder="Verification"
//                       options={[
//                         { value: "",       label: "All Users"   },
//                         { value: "true",   label: "Verified"    },
//                         { value: "false",  label: "Unverified"  },
//                       ]}
//                     />
//                   </div>

//                   <div className="mt-3 flex gap-2">
//                     <Button
//                       size="sm"
//                       onClick={() => { setCurrentPage(1); applyUserFilters({ page: 1 }); }}
//                     >
//                       Apply Filters
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => {
//                         setSearch(""); setPlanFilter(""); setExamFilter("");
//                         setVerified(""); setCurrentPage(1);
//                         fetchUsers({ page: 1, limit: 10 }).then((r) => {
//                           if (r?.data?.pagination) setPagination(r.data.pagination);
//                         });
//                       }}
//                     >
//                       Clear
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Users table */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>
//                     Users {pagination ? `(${pagination.total})` : `(${safeUsers.length})`}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-0">
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b bg-muted/30">
//                           {["Name", "Email", "Plan", "Exam", "Verified", "Joined"].map((h) => (
//                             <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y">
//                         {loading && safeUsers.length === 0
//                           ? [...Array(8)].map((_, i) => <SkeletonRow key={i} cols={6} />)
//                           : safeUsers.length === 0
//                           ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No users found</td></tr>
//                           : safeUsers.map((u) => (
//                             <tr key={u.id} className="hover:bg-muted/20 transition-colors">
//                               <td className="px-4 py-3 font-medium">{u.firstName ?? ""} {u.lastName ?? ""}</td>
//                               <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
//                               <td className="px-4 py-3"><PlanBadge plan={u.subscriptionPlan} /></td>
//                               <td className="px-4 py-3"><ExamBadge category={u.examCategory} /></td>
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center gap-1.5">
//                                   <StatusDot active={u.emailVerified} />
//                                   <span className="text-xs text-muted-foreground">{u.emailVerified ? "Yes" : "No"}</span>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-xs text-muted-foreground">
//                                 {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
//                               </td>
//                             </tr>
//                           ))
//                         }
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   {pagination && pagination.pages > 1 && (
//                     <div className="flex items-center justify-between border-t px-4 py-3">
//                       <p className="text-sm text-muted-foreground">
//                         Page {pagination.page} of {pagination.pages} · {pagination.total} total
//                       </p>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm" variant="outline"
//                           disabled={currentPage <= 1}
//                           onClick={() => { const p = currentPage - 1; setCurrentPage(p); applyUserFilters({ page: p }); }}
//                         >
//                           <ChevronLeft className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           size="sm" variant="outline"
//                           disabled={currentPage >= pagination.pages}
//                           onClick={() => { const p = currentPage + 1; setCurrentPage(p); applyUserFilters({ page: p }); }}
//                         >
//                           <ChevronRight className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* ══════════════════ PROMO CODES TAB ══════════════════ */}
//           {tab === "promos" && (
//             <div className="space-y-6">

//               {/* Promo stats */}
//               {promoStats && (
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                   {[
//                     { label: "Total Codes", value: promoStats.total ?? promoStats.totalCodes ?? "—",         Icon: Tag,          color: "text-blue-600"   },
//                     { label: "Active",      value: promoStats.active ?? promoStats.activeCodes ?? "—",        Icon: CheckCircle2, color: "text-emerald-600" },
//                     { label: "Total Uses",  value: promoStats.totalUses ?? promoStats.usageCount ?? "—",      Icon: TrendingUp,   color: "text-violet-600"  },
//                     { label: "Expired",     value: promoStats.expired ?? "—",                                 Icon: AlertCircle,  color: "text-red-500"    },
//                   ].map(({ label, value, Icon, color }) => (
//                     <Card key={label}><CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm text-muted-foreground">{label}</p>
//                         <Icon className={`h-4 w-4 ${color}`} />
//                       </div>
//                       <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
//                     </CardContent></Card>
//                   ))}
//                 </div>
//               )}

//               {/* Promo filters + create */}
//               <div className="flex items-center gap-3 flex-wrap">
//                 <div className="relative flex-1 min-w-[200px]">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search promo codes…"
//                     value={promoSearch}
//                     onChange={(e) => setPromoSearch(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//                 <div className="w-40">
//                   <NativeSelect
//                     value={promoActive}
//                     onChange={setPromoActive}
//                     placeholder="All Status"
//                     options={[
//                       { value: "",      label: "All Status" },
//                       { value: "true",  label: "Active"     },
//                       { value: "false", label: "Inactive"   },
//                     ]}
//                   />
//                 </div>
//                 <Button variant="outline" size="sm" onClick={applyPromoFilters}>Apply</Button>
//                 <Button onClick={() => setCreateOpen(true)}>
//                   <Plus className="h-4 w-4 mr-2" /> Create Promo Code
//                 </Button>
//               </div>

//               {/* Promo table */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Promo Codes ({safePromos.length})</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-0">
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b bg-muted/30">
//                           {["Code", "Type", "Value", "Valid For", "Max Uses", "Used", "Expires", "Status", ""].map((h) => (
//                             <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y">
//                         {loading && safePromos.length === 0
//                           ? [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={9} />)
//                           : safePromos.length === 0
//                           ? <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">No promo codes found</td></tr>
//                           : safePromos.map((p) => (
//                             <tr key={p.id} className="hover:bg-muted/20 transition-colors">
//                               <td className="px-4 py-3 font-mono font-semibold tracking-wider">{p.code}</td>
//                               <td className="px-4 py-3">
//                                 <span className="inline-flex items-center gap-1 text-xs">
//                                   {p.discountType === "PERCENTAGE"
//                                     ? <><Percent className="h-3 w-3" /> Percent</>
//                                     : <><DollarSign className="h-3 w-3" /> Fixed</>
//                                   }
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 font-medium">
//                                 {p.discountType === "PERCENTAGE"
//                                   ? `${p.value}%`
//                                   : `₦${(p.value / 100).toLocaleString()}`
//                                 }
//                               </td>
//                               <td className="px-4 py-3"><PlanBadge plan={p.validForPlan} /></td>
//                               <td className="px-4 py-3 text-muted-foreground">{p.maxUses ?? "∞"}</td>
//                               <td className="px-4 py-3 text-muted-foreground">{p.usedCount ?? p.uses ?? 0}</td>
//                               <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
//                                 {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "—"}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center gap-1.5">
//                                   <StatusDot active={p.isActive} />
//                                   <span className="text-xs">{p.isActive ? "Active" : "Inactive"}</span>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => togglePromoCode(p.id)}
//                                   className="h-8 gap-1.5 text-xs"
//                                 >
//                                   {p.isActive
//                                     ? <><ToggleRight className="h-4 w-4 text-emerald-500" /> Disable</>
//                                     : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /> Enable</>
//                                   }
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))
//                         }
//                       </tbody>
//                     </table>
//                   </div>
//                 </CardContent>
//               </Card>

//             </div>
//           )}
//         </div>
//       </main>

//       <CreatePromoModal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         onSuccess={() => {
//           fetchPromoCodes({ page: 1, limit: 50 });
//           fetchPromoStats();
//         }}
//       />
//     </div>
//   );
// }






import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/store/adminStore";
import {
  Users, Search, Tag, ToggleLeft, ToggleRight,
  Plus, TrendingUp, AlertCircle, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, X,
  BarChart2, Percent, DollarSign, Loader2, Wallet,
} from "lucide-react";

// ─── BADGE HELPERS ─────────────────────────────────────────────────────────────

const PLAN_COLORS = {
  FREE:    "bg-slate-100 text-slate-600",
  MONTHLY: "bg-blue-100 text-blue-700",
  YEARLY:  "bg-violet-100 text-violet-700",
  PREMIUM: "bg-amber-100 text-amber-700",
  ALL:     "bg-gray-100 text-gray-700",
};

const EXAM_COLORS = {
  WAEC:  "bg-green-100 text-green-700",
  JAMB:  "bg-orange-100 text-orange-700",
  NECO:  "bg-teal-100 text-teal-700",
  PUTME: "bg-pink-100 text-pink-700",
};

function PlanBadge({ plan }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_COLORS[plan] ?? "bg-gray-100 text-gray-600"}`}>
      {plan ?? "—"}
    </span>
  );
}

function ExamBadge({ category }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${EXAM_COLORS[category] ?? "bg-gray-100 text-gray-600"}`}>
      {category ?? "—"}
    </span>
  );
}

function StatusDot({ active }) {
  return (
    <span className={`inline-flex h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
  );
}

function SkeletonRow({ cols = 6 }) {
  return (
    <tr>
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-gray-200 animate-pulse" style={{ width: `${55 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── NATIVE DROPDOWN ───────────────────────────────────────────────────────────

function NativeSelect({ value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${value === o.value ? "bg-accent font-medium" : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CREATE PROMO MODAL ────────────────────────────────────────────────────────

function CreatePromoModal({ open, onClose, onSuccess }) {
  const { createPromoCode } = useAdminStore();

  const [code, setCode]                 = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [value, setValue]               = useState("");
  const [validForPlan, setValidForPlan] = useState("ALL");
  const [expiresAt, setExpiresAt]       = useState("");
  const [maxUses, setMaxUses]           = useState("");
  const [unlimited, setUnlimited]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [feedback, setFeedback]         = useState(null);

  useEffect(() => {
    if (!open) {
      setCode(""); setDiscountType("PERCENTAGE"); setValue("");
      setValidForPlan("ALL"); setExpiresAt(""); setMaxUses("");
      setUnlimited(false); setSubmitting(false); setFeedback(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!code.trim())  { setFeedback({ type: "error", message: "Promo code is required." }); return; }
    if (!value)        { setFeedback({ type: "error", message: "Discount value is required." }); return; }
    if (!expiresAt)    { setFeedback({ type: "error", message: "Expiry date is required." }); return; }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      code: code.toUpperCase().trim(),
      discountType,
      value: Number(value),
      validForPlan,
      expiresAt: new Date(expiresAt).toISOString(),
    };
    if (!unlimited && maxUses) payload.maxUses = Number(maxUses);

    const res = await createPromoCode(payload);
    if (res?.success) {
      setFeedback({ type: "success", message: "Promo code created successfully!" });
      onSuccess?.();
      setTimeout(onClose, 1100);
    } else {
      setFeedback({ type: "error", message: res?.message || "Failed to create promo code." });
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Tag className="h-5 w-5 text-primary" /> Create Promo Code
          </h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="promo-code">Code *</Label>
            <Input id="promo-code" placeholder="e.g. WELCOME50" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Discount Type *</Label>
              <NativeSelect
                value={discountType} onChange={setDiscountType} placeholder="Select type"
                options={[{ value: "PERCENTAGE", label: "Percentage (%)" }, { value: "FIXED", label: "Fixed (Kobo)" }]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-value">Value * {discountType === "FIXED" ? "(Kobo)" : "(%)"}</Label>
              <Input id="promo-value" type="number" placeholder={discountType === "PERCENTAGE" ? "50" : "50000"} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Valid For Plan</Label>
              <NativeSelect
                value={validForPlan} onChange={setValidForPlan} placeholder="Select plan"
                options={[
                  { value: "ALL", label: "All Plans" }, { value: "MONTHLY", label: "Monthly" },
                  { value: "YEARLY", label: "Yearly" }, { value: "PREMIUM", label: "Premium" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-expires">Expires At *</Label>
              <Input id="promo-expires" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="promo-maxuses">Max Uses</Label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={unlimited} onChange={(e) => setUnlimited(e.target.checked)} className="rounded" />
                Unlimited
              </label>
            </div>
            <Input id="promo-maxuses" type="number" placeholder="100" value={maxUses} disabled={unlimited} onChange={(e) => setMaxUses(e.target.value)} className={unlimited ? "opacity-50" : ""} />
          </div>

          {feedback && (
            <div className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {feedback.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              {feedback.message}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</> : "Create Promo Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function UsersPromoPage() {
  const {
    users,          fetchUsers,
    userStats,      fetchUserStats,
    promoCodes,     fetchPromoCodes,
    promoStats,     fetchPromoStats,
    togglePromoCode,
    loading,
  } = useAdminStore();

  const [tab, setTab]               = useState("users");
  const [pageLoading, setPageLoading] = useState(true);

  // ── Users filter state ──
  const [search, setSearch]           = useState("");
  const [planFilter, setPlanFilter]   = useState("");
  const [examFilter, setExamFilter]   = useState("");
  const [verifiedFilter, setVerified] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination]   = useState(null);
  const [statsPeriod, setStatsPeriod] = useState("daily");

  // ── Promo filter state ──
  const [promoSearch, setPromoSearch] = useState("");
  const [promoActive, setPromoActive] = useState("");
  const [createOpen, setCreateOpen]   = useState(false);

  // debounce ref for search inputs
  const debounceRef = useRef(null);

  // ── Initial load ──
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 500);
    Promise.all([
      fetchUsers({ page: 1, limit: 10 }).then((r) => {
        if (r?.data?.pagination) setPagination(r.data.pagination);
      }),
      fetchUserStats("daily"),
      fetchPromoCodes({ page: 1, limit: 50 }),
      fetchPromoStats(),
    ]);
    return () => { clearTimeout(t); setPageLoading(true); };
  }, []);

  // ── Fetch users whenever any filter or page changes ──
  const runUserFetch = useCallback((overrides = {}) => {
    const params = { page: currentPage, limit: 10 };
    if (search)                params.search           = search;
    if (planFilter)            params.subscriptionPlan = planFilter;
    if (examFilter)            params.examCategory     = examFilter;
    if (verifiedFilter !== "") params.emailVerified    = verifiedFilter;
    Object.assign(params, overrides);
    fetchUsers(params).then((r) => { if (r?.data?.pagination) setPagination(r.data.pagination); });
  }, [search, planFilter, examFilter, verifiedFilter, currentPage]);

  // search with debounce
  useEffect(() => {
    if (pageLoading) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setCurrentPage(1); runUserFetch({ page: 1 }); }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // dropdowns fire immediately
  useEffect(() => {
    if (pageLoading) return;
    setCurrentPage(1);
    runUserFetch({ page: 1 });
  }, [planFilter, examFilter, verifiedFilter]);

  // page change
  useEffect(() => {
    if (pageLoading) return;
    runUserFetch({ page: currentPage });
  }, [currentPage]);

  // ── Fetch promos whenever promo filters change ──
  const runPromoFetch = useCallback(() => {
    const params = { page: 1, limit: 50 };
    if (promoSearch)        params.search   = promoSearch;
    if (promoActive !== "") params.isActive = promoActive;
    fetchPromoCodes(params);
  }, [promoSearch, promoActive]);

  // promo search debounced
  useEffect(() => {
    if (pageLoading) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runPromoFetch, 400);
    return () => clearTimeout(debounceRef.current);
  }, [promoSearch]);

  // promo active filter fires immediately
  useEffect(() => {
    if (pageLoading) return;
    runPromoFetch();
  }, [promoActive]);

  const safeUsers  = Array.isArray(users)      ? users      : [];
  const safePromos = Array.isArray(promoCodes) ? promoCodes : [];

  // ─── SKELETON ─────────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64">
          <Header title="Users & Promo Codes" description="Manage users and promotional codes" />
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}><CardContent className="p-4 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  <div className="h-8 w-16 rounded bg-gray-200 animate-pulse" />
                </CardContent></Card>
              ))}
            </div>
            <Card><CardContent className="p-4 space-y-3">
              {[...Array(7)].map((_, i) => <div key={i} className="h-12 rounded bg-gray-200 animate-pulse" />)}
            </CardContent></Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <Header title="Users & Promo Codes" description="Manage users and promotional codes" />

        <div className="p-6 space-y-6">

          {/* ── Tab switcher ── */}
          <div className="flex gap-1 rounded-lg border bg-muted p-1 w-fit">
            {[
              { key: "users",  label: "Users",      Icon: Users },
              { key: "promos", label: "Promo Codes", Icon: Tag   },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  tab === key ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          {/* ══════════════════ USERS TAB ══════════════════ */}
          {tab === "users" && (
            <div className="space-y-6">

              {/* Acquisition stats cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Total New Users",
                    value: userStats?.totalNewUsers ?? "—",
                    Icon: Users,
                    color: "text-blue-600",
                  },
                  {
                    label: "Paying Users",
                    value: userStats?.conversion?.paying ?? "—",
                    Icon: Wallet,
                    color: "text-emerald-600",
                  },
                  {
                    label: "Free Users",
                    value: userStats?.conversion?.free ?? "—",
                    Icon: BarChart2,
                    color: "text-violet-600",
                  },
                  {
                    label: "Conversion Rate",
                    value: userStats?.conversion?.rate ?? "—",
                    Icon: TrendingUp,
                    color: "text-amber-600",
                  },
                ].map(({ label, value, Icon, color }) => (
                  <Card key={label}><CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                  </CardContent></Card>
                ))}
              </div>

              {/* Period switcher */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground font-medium">Period:</span>
                {["daily", "weekly", "monthly", "yearly"].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setStatsPeriod(p); fetchUserStats(p); }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      statsPeriod === p
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              {/* Plan breakdown pills from stats */}
              {userStats?.breakdown && (
                <div className="flex flex-wrap gap-3">
                  {Object.entries(userStats.breakdown).map(([plan, count]) => (
                    <div key={plan} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${PLAN_COLORS[plan.toUpperCase()] ?? "bg-gray-100 text-gray-600"}`}>
                      <span className="capitalize">{plan}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Filters — all fire instantly */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Filter Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    <div className="relative xl:col-span-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <NativeSelect
                      value={planFilter} onChange={setPlanFilter} placeholder="All Plans"
                      options={[
                        { value: "",        label: "All Plans" },
                        { value: "FREE",    label: "Free"      },
                        { value: "MONTHLY", label: "Monthly"   },
                        { value: "YEARLY",  label: "Yearly"    },
                        { value: "PREMIUM", label: "Premium"   },
                      ]}
                    />

                    <NativeSelect
                      value={examFilter} onChange={setExamFilter} placeholder="All Exams"
                      options={[
                        { value: "",      label: "All Exams" },
                        { value: "WAEC",  label: "WAEC"      },
                        { value: "JAMB",  label: "JAMB"      },
                        { value: "NECO",  label: "NECO"      },
                        { value: "PUTME", label: "PUTME"     },
                      ]}
                    />

                    <NativeSelect
                      value={verifiedFilter} onChange={setVerified} placeholder="Verification"
                      options={[
                        { value: "",      label: "All Users"  },
                        { value: "true",  label: "Verified"   },
                        { value: "false", label: "Unverified" },
                      ]}
                    />
                  </div>

                  {/* Active filters display */}
                  {(search || planFilter || examFilter || verifiedFilter !== "") && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active filters:</span>
                      {search && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                          "{search}"
                          <button onClick={() => setSearch("")}><X className="h-3 w-3" /></button>
                        </span>
                      )}
                      {planFilter && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                          {planFilter}
                          <button onClick={() => setPlanFilter("")}><X className="h-3 w-3" /></button>
                        </span>
                      )}
                      {examFilter && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                          {examFilter}
                          <button onClick={() => setExamFilter("")}><X className="h-3 w-3" /></button>
                        </span>
                      )}
                      {verifiedFilter !== "" && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                          {verifiedFilter === "true" ? "Verified" : "Unverified"}
                          <button onClick={() => setVerified("")}><X className="h-3 w-3" /></button>
                        </span>
                      )}
                      <button
                        onClick={() => { setSearch(""); setPlanFilter(""); setExamFilter(""); setVerified(""); }}
                        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Users table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Users {pagination ? `(${pagination.total})` : `(${safeUsers.length})`}
                    {loading && <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-muted-foreground" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          {["Name", "Email", "Plan", "Exam", "Verified", "Joined"].map((h) => (
                            <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {loading && safeUsers.length === 0
                          ? [...Array(8)].map((_, i) => <SkeletonRow key={i} cols={6} />)
                          : safeUsers.length === 0
                          ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No users found</td></tr>
                          : safeUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3 font-medium">{u.firstName ?? ""} {u.lastName ?? ""}</td>
                              <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                              <td className="px-4 py-3"><PlanBadge plan={u.subscriptionPlan} /></td>
                              <td className="px-4 py-3"><ExamBadge category={u.examCategory} /></td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <StatusDot active={u.emailVerified} />
                                  <span className="text-xs text-muted-foreground">{u.emailVerified ? "Yes" : "No"}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-muted-foreground">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between border-t px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages} · {pagination.total} total
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={currentPage <= 1 || loading}
                          onClick={() => setCurrentPage((p) => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled={currentPage >= pagination.pages || loading}
                          onClick={() => setCurrentPage((p) => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ══════════════════ PROMO CODES TAB ══════════════════ */}
          {tab === "promos" && (
            <div className="space-y-6">

              {/* Promo stats cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Total Codes",
                    value: promoStats?.overview?.totalPromoCodes ?? "—",
                    Icon: Tag,
                    color: "text-blue-600",
                  },
                  {
                    label: "Active Codes",
                    value: promoStats?.overview?.activePromoCodes ?? "—",
                    Icon: CheckCircle2,
                    color: "text-emerald-600",
                  },
                  {
                    label: "Successful Uses",
                    value: promoStats?.overview?.totalSuccessfulUses ?? "—",
                    Icon: TrendingUp,
                    color: "text-violet-600",
                  },
                  {
                    label: "Discount Given",
                    value: promoStats?.overview?.totalDiscountGivenNaira != null
                      ? `₦${promoStats.overview.totalDiscountGivenNaira.toLocaleString()}`
                      : "—",
                    Icon: Wallet,
                    color: "text-amber-600",
                  },
                ].map(({ label, value, Icon, color }) => (
                  <Card key={label}><CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                  </CardContent></Card>
                ))}
              </div>

              {/* Promo filters — fire instantly */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search promo codes…"
                    value={promoSearch}
                    onChange={(e) => setPromoSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="w-44">
                  <NativeSelect
                    value={promoActive} onChange={setPromoActive} placeholder="All Status"
                    options={[
                      { value: "",      label: "All Status" },
                      { value: "true",  label: "Active"     },
                      { value: "false", label: "Inactive"   },
                    ]}
                  />
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Promo Code
                </Button>
              </div>

              {/* Promo table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Promo Codes ({safePromos.length})
                    {loading && <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-muted-foreground" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          {["Code", "Type", "Value", "Valid For", "Max Uses", "Used", "Expires", "Status", ""].map((h) => (
                            <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {loading && safePromos.length === 0
                          ? [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={9} />)
                          : safePromos.length === 0
                          ? <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">No promo codes found</td></tr>
                          : safePromos.map((p) => (
                            <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3 font-mono font-semibold tracking-wider">{p.code}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 text-xs">
                                  {p.discountType === "PERCENTAGE"
                                    ? <><Percent className="h-3 w-3" /> Percent</>
                                    : <><DollarSign className="h-3 w-3" /> Fixed</>}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium">
                                {p.discountType === "PERCENTAGE" ? `${p.value}%` : `₦${(p.value / 100).toLocaleString()}`}
                              </td>
                              <td className="px-4 py-3"><PlanBadge plan={p.validForPlan} /></td>
                              <td className="px-4 py-3 text-muted-foreground">{p.maxUses ?? "∞"}</td>
                              <td className="px-4 py-3 text-muted-foreground">{p.currentUses ?? p.usedCount ?? 0}</td>
                              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <StatusDot active={p.isActive && !p.isExpired} />
                                  <span className="text-xs">
                                    {p.isExpired ? "Expired" : p.isActive ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Button variant="ghost" size="sm" onClick={() => togglePromoCode(p.id)} className="h-8 gap-1.5 text-xs">
                                  {p.isActive
                                    ? <><ToggleRight className="h-4 w-4 text-emerald-500" /> Disable</>
                                    : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /> Enable</>}
                                </Button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <CreatePromoModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => { fetchPromoCodes({ page: 1, limit: 50 }); fetchPromoStats(); }}
      />
    </div>
  );
}