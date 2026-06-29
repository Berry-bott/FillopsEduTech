// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { usePaymentStore } from "@/store/paymentStore";
// import {
//   Receipt,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Search,
//   Filter,
//   TrendingUp,
//   CreditCard,
//   Download,
//   Sparkles,
//   ArrowUpRight,
//   ArrowLeft,
// } from "lucide-react";

// const PaymentHistory = () => {
//   const navigate = useNavigate();
//   const { history = [], fetchHistory, loading } = usePaymentStore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("date-desc");

//   useEffect(() => {
//     fetchHistory();
//   }, [fetchHistory]);

//   const filteredHistory = history
//     .filter((payment) => {
//       const matchesSearch =
//         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         payment.subjects?.some((s) =>
//           s.name?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       const matchesStatus =
//         statusFilter === "all" ||
//         payment.status?.toLowerCase() === statusFilter.toLowerCase();
//       return matchesSearch && matchesStatus;
//     })
//     .sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.date);
//       const dateB = new Date(b.createdAt || b.date);
//       if (sortBy === "date-desc") return dateB - dateA;
//       if (sortBy === "date-asc") return dateA - dateB;
//       if (sortBy === "amount-desc") return (b.amount || 0) - (a.amount || 0);
//       if (sortBy === "amount-asc") return (a.amount || 0) - (b.amount || 0);
//       return 0;
//     });

//   const statusConfig = {
//     success: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, color: "emerald" },
//     completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, color: "emerald" },
//     failed: { bg: "bg-rose-50", text: "text-rose-700", icon: XCircle, color: "rose" },
//     cancelled: { bg: "bg-rose-50", text: "text-rose-700", icon: XCircle, color: "rose" },
//     pending: { bg: "bg-sky-50", text: "text-sky-700", icon: Clock, color: "sky" },
//   };

//   const StatusIcon = ({ status }) => {
//     const s = status?.toLowerCase() || "pending";
//     const config = statusConfig[s] || statusConfig.pending;
//     const Icon = config.icon;
//     return <Icon className={`w-5 h-5 ${config.text}`} />;
//   };

//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   const formatAmount = (amount) => {
//     // Divide by 100 to convert from kobo to Naira
//     const amountInNaira = (amount || 0) / 100;
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amountInNaira);
//   };

//   const totalSpent = filteredHistory
//     .filter((p) => ["success", "completed"].includes(p.status?.toLowerCase()))
//     .reduce((sum, p) => sum + (p.amount || 0), 0);

//   const successCount = history.filter((p) =>
//     ["success", "completed"].includes(p.status?.toLowerCase())
//   ).length;

//   const thisMonthTotal = history
//     .filter((p) => {
//       const paymentDate = new Date(p.createdAt || p.date);
//       const now = new Date();
//       return (
//         paymentDate.getMonth() === now.getMonth() &&
//         paymentDate.getFullYear() === now.getFullYear() &&
//         ["success", "completed"].includes(p.status?.toLowerCase())
//       );
//     })
//     .reduce((sum, p) => sum + (p.amount || 0), 0);

//   if (loading && history.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 
//       via-sky-50 to-cyan-50">
        
//         <div className="text-center space-y-4">
//           <div className="relative">
//             <div className="animate-spin h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
//             <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
//           </div>
//           <p className="text-gray-600 font-medium">Loading your payments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/user/dashboard')}
//           className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-300"
//         >
//           <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
//           <span className="font-medium text-gray-700">Back to Dashboard</span>
//         </button>
        
//         {/* Header with Glassmorphism */}
//           <div className="col-span-2 bg-primary rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
//           <div className="absolute inset-0"></div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
//                 <Receipt className="w-6 h-6" />
//               </div>
//               <h1 className="text-3xl sm:text-4xl font-bold">Payment History</h1>
//             </div>
//             <p className="text-blue-100">Track and manage all your transactions</p>
//           </div>
//           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//           <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"></div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-medium text-gray-600">Total Spent</p>
//                 <TrendingUp className="w-5 h-5 text-blue-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{formatAmount(totalSpent)}</p>
//               <p className="text-xs text-gray-500 mt-1">All time</p>
//             </div>
//           </div>

//           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-medium text-gray-600">Successful</p>
//                 <CheckCircle className="w-5 h-5 text-emerald-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{successCount}</p>
//               <p className="text-xs text-gray-500 mt-1">Transactions</p>
//             </div>
//           </div>

//           <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-100">
//             <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-medium text-gray-600">This Month</p>
//                 <CreditCard className="w-5 h-5 text-cyan-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{formatAmount(thisMonthTotal)}</p>
//               <p className="text-xs text-gray-500 mt-1">Current period</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters with Modern Design */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-blue-100">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//               <input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search payments..."
//                 className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//               />
//             </div>

//             <div className="relative group">
//               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none bg-white cursor-pointer"
//               >
//                 <option value="all">All Status</option>
//                 <option value="success">Success</option>
//                 <option value="failed">Failed</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none bg-white cursor-pointer"
//             >
//               <option value="date-desc">Newest First</option>
//               <option value="date-asc">Oldest First</option>
//               <option value="amount-desc">Highest Amount</option>
//               <option value="amount-asc">Lowest Amount</option>
//             </select>
//           </div>
//         </div>

//         {/* Payment List */}
//         {filteredHistory.length === 0 ? (
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-blue-100">
//             <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
//               <Receipt className="w-12 h-12 text-blue-300" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
//             <p className="text-gray-500">
//               {searchTerm || statusFilter !== "all"
//                 ? "Try adjusting your filters"
//                 : "Your payment history will appear here"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {loading && (
//               <div className="flex items-center justify-center py-8">
//                 <div className="relative">
//                   <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
//                   <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 animate-pulse" />
//                 </div>
//               </div>
//             )}
//             {filteredHistory.map((payment, index) => {
//               const status = payment.status?.toLowerCase() || "pending";
//               const config = statusConfig[status] || statusConfig.pending;

//               return (
//                 <div
//                   key={payment.id || payment.reference || index}
//                   className="group relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
//                   <div className="relative z-10 p-6">
//                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      
//                       {/* Left Section */}
//                       <div className="flex gap-4 flex-1">
//                         <div className={`flex-shrink-0 p-3 rounded-xl ${config.bg} group-hover:scale-110 transition-transform`}>
//                           <StatusIcon status={payment.status} />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <h3 className="font-bold text-gray-900 text-lg">
//                               {payment.plan || "Subscription Payment"}
//                             </h3>
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} uppercase tracking-wide`}>
//                               {status}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                             <span className="font-medium">Ref:</span>
//                             <code className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">
//                               {payment.reference}
//                             </code>
//                           </div>

//                           {payment.subjects?.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mt-3">
//                               {payment.subjects.map((s) => (
//                                 <span
//                                   key={s.id}
//                                   className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
//                                 >
//                                   <Sparkles className="w-3 h-3" />
//                                   {s.name}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Right Section */}
//                       <div className="flex flex-col items-start lg:items-end gap-2">
//                         <div className="flex items-center gap-2">
//                           <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                             {formatAmount(payment.amount)}
//                           </span>
//                           <ArrowUpRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
//                         </div>
                        
//                         <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
//                           <Calendar className="w-4 h-4" />
//                           <span>{formatDate(payment.createdAt || payment.date)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentHistory;

















// src/pages/user/PaymentHistory.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "@/store/paymentStore";
import {
  Receipt,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  TrendingUp,
  CreditCard,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (amountKobo, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format((amountKobo || 0) / 100);

const fmtDate = (dateStr) =>
  dateStr
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateStr))
    : "—";

const STATUS_CONFIG = {
  success:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle, dot: "bg-emerald-500" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle, dot: "bg-emerald-500" },
  failed:    { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    icon: XCircle,     dot: "bg-rose-500" },
  cancelled: { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    icon: XCircle,     dot: "bg-rose-500" },
  pending:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   icon: Clock,       dot: "bg-amber-500" },
};

const EXAM_COLORS = {
  JAMB:  "bg-blue-100 text-blue-700 border-blue-200",
  WAEC:  "bg-violet-100 text-violet-700 border-violet-200",
  PUTME: "bg-orange-100 text-orange-700 border-orange-200",
  NECO:  "bg-teal-100 text-teal-700 border-teal-200",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-9 w-40 bg-gray-200 rounded-xl" />
        <div className="h-32 w-full bg-gray-200 rounded-2xl" />
        {/* 4 stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-64 bg-gray-200 rounded" />
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 w-20 bg-gray-200 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="h-7 w-28 bg-gray-200 rounded" />
                  <div className="h-5 w-36 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PaymentHistory() {
  const navigate = useNavigate();
  const { history = [], fetchHistory, loading } = usePaymentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = history
    .filter((p) => {
      const status = p.status?.toLowerCase();
      const subjects = Object.values(p.subjectsByCategory ?? {})
        .flat()
        .map((s) => s.name?.toLowerCase());

      const matchesSearch =
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subjects.some((name) => name.includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortBy === "date-desc") return dateB - dateA;
      if (sortBy === "date-asc") return dateA - dateB;
      if (sortBy === "amount-desc") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "amount-asc") return (a.amount || 0) - (b.amount || 0);
      return 0;
    });

  // ── Stats ─────────────────────────────────────────────────────
  const totalSpent = history
    .filter((p) => ["success", "completed"].includes(p.status?.toLowerCase()))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const successCount = history.filter((p) =>
    ["success", "completed"].includes(p.status?.toLowerCase())
  ).length;

  const thisMonthTotal = history
    .filter((p) => {
      const d = new Date(p.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        ["success", "completed"].includes(p.status?.toLowerCase())
      );
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // ✅ Pending count + total
  const pendingPayments = history.filter(
    (p) => p.status?.toLowerCase() === "pending"
  );
  const pendingCount = pendingPayments.length;
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading && history.length === 0) return <Skeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* ── Header ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/15 backdrop-blur rounded-xl border border-white/20">
              <Receipt className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
              <p className="text-blue-200 text-sm mt-1">Track and manage all your transactions</p>
            </div>
          </div>
        </div>

        {/* ── Stat cards — 4 columns ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Spent",
              value: fmt(totalSpent),
              sub: "All time",
              icon: TrendingUp,
              accent: "text-blue-600",
              ring: "ring-blue-100",
              iconBg: "bg-blue-50",
            },
            {
              label: "Successful",
              value: successCount,
              sub: "Transactions",
              icon: BadgeCheck,
              accent: "text-emerald-600",
              ring: "ring-emerald-100",
              iconBg: "bg-emerald-50",
            },
            {
              label: "This Month",
              value: fmt(thisMonthTotal),
              sub: "Current period",
              icon: CreditCard,
              accent: "text-violet-600",
              ring: "ring-violet-100",
              iconBg: "bg-violet-50",
            },
            {
              label: "Pending",
              value: pendingCount,
              sub: fmt(pendingTotal) + " awaiting",
              icon: AlertCircle,
              accent: "text-amber-600",
              ring: "ring-amber-100",
              iconBg: "bg-amber-50",
            },
          ].map(({ label, value, sub, icon: Icon, accent, ring, iconBg }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <div className={`p-2 rounded-xl ring-2 ${ring} ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${accent}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Filter bar ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by reference or subject..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm appearance-none bg-white cursor-pointer transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm appearance-none bg-white cursor-pointer transition-all"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Payment list ── */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
              <Receipt className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No payments found</h3>
            <p className="text-sm text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Your payment history will appear here once you make a payment"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((payment, index) => {
              const status = payment.status?.toLowerCase() || "pending";
              const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
              const Icon = config.icon;
              const subjectEntries = Object.entries(payment.subjectsByCategory ?? {});

              return (
                <div
                  key={payment.id || payment.reference || index}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className={`h-0.5 w-full ${config.dot}`} />

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                      {/* ── Left ── */}
                      <div className="flex gap-4 flex-1">
                        <div className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border ${config.bg} ${config.border}`}>
                          <Icon className={`w-5 h-5 ${config.text}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900">
                              {payment.planName || payment.plan || "Subscription"}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {payment.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                            <span>Ref:</span>
                            <code className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded font-mono">
                              {payment.reference}
                            </code>
                          </div>

                          {subjectEntries.length > 0 && (
                            <div className="space-y-2">
                              {subjectEntries.map(([examType, subjects]) => (
                                <div key={examType} className="flex flex-wrap items-center gap-2">
                                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${EXAM_COLORS[examType] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                    {examType}
                                  </span>
                                  {subjects.map((s) => (
                                    <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg">
                                      <Sparkles className="w-3 h-3 text-gray-400" />
                                      {s.name}
                                    </span>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Right ── */}
                      <div className="flex flex-col items-start lg:items-end gap-2 flex-shrink-0">
                        <span className="text-2xl font-bold text-gray-900">
                          {payment.amountFormatted || fmt(payment.amount)}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <Calendar className="w-3.5 h-3.5" />
                          {fmtDate(payment.createdAt)}
                        </div>
                        {payment.paymentChannel && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span className="capitalize">{payment.paymentChannel}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}