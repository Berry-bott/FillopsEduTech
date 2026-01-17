import React, { useEffect, useState } from "react";
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
  Download,
  Sparkles,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { history = [], fetchHistory, loading } = usePaymentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = history
    .filter((payment) => {
      const matchesSearch =
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.subjects?.some((s) =>
          s.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" ||
        payment.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      if (sortBy === "date-desc") return dateB - dateA;
      if (sortBy === "date-asc") return dateA - dateB;
      if (sortBy === "amount-desc") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "amount-asc") return (a.amount || 0) - (b.amount || 0);
      return 0;
    });

  const statusConfig = {
    success: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, color: "emerald" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, color: "emerald" },
    failed: { bg: "bg-rose-50", text: "text-rose-700", icon: XCircle, color: "rose" },
    cancelled: { bg: "bg-rose-50", text: "text-rose-700", icon: XCircle, color: "rose" },
    pending: { bg: "bg-sky-50", text: "text-sky-700", icon: Clock, color: "sky" },
  };

  const StatusIcon = ({ status }) => {
    const s = status?.toLowerCase() || "pending";
    const config = statusConfig[s] || statusConfig.pending;
    const Icon = config.icon;
    return <Icon className={`w-5 h-5 ${config.text}`} />;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatAmount = (amount) => {
    // Divide by 100 to convert from kobo to Naira
    const amountInNaira = (amount || 0) / 100;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountInNaira);
  };

  const totalSpent = filteredHistory
    .filter((p) => ["success", "completed"].includes(p.status?.toLowerCase()))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const successCount = history.filter((p) =>
    ["success", "completed"].includes(p.status?.toLowerCase())
  ).length;

  const thisMonthTotal = history
    .filter((p) => {
      const paymentDate = new Date(p.createdAt || p.date);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear() &&
        ["success", "completed"].includes(p.status?.toLowerCase())
      );
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading && history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 
      via-sky-50 to-cyan-50">
        
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading your payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/user/dashboard')}
          className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-300"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700">Back to Dashboard</span>
        </button>
        
        {/* Header with Glassmorphism */}
          <div className="col-span-2 bg-primary rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute inset-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Receipt className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Payment History</h1>
            </div>
            <p className="text-blue-100">Track and manage all your transactions</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(totalSpent)}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{successCount}</p>
              <p className="text-xs text-gray-500 mt-1">Transactions</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-100">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <CreditCard className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(thisMonthTotal)}</p>
              <p className="text-xs text-gray-500 mt-1">Current period</p>
            </div>
          </div>
        </div>

        {/* Filters with Modern Design */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search payments..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Payment List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
              <Receipt className="w-12 h-12 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Your payment history will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 animate-pulse" />
                </div>
              </div>
            )}
            {filteredHistory.map((payment, index) => {
              const status = payment.status?.toLowerCase() || "pending";
              const config = statusConfig[status] || statusConfig.pending;

              return (
                <div
                  key={payment.id || payment.reference || index}
                  className="group relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      
                      {/* Left Section */}
                      <div className="flex gap-4 flex-1">
                        <div className={`flex-shrink-0 p-3 rounded-xl ${config.bg} group-hover:scale-110 transition-transform`}>
                          <StatusIcon status={payment.status} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {payment.plan || "Subscription Payment"}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} uppercase tracking-wide`}>
                              {status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="font-medium">Ref:</span>
                            <code className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">
                              {payment.reference}
                            </code>
                          </div>

                          {payment.subjects?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {payment.subjects.map((s) => (
                                <span
                                  key={s.id}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-start lg:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {formatAmount(payment.amount)}
                          </span>
                          <ArrowUpRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(payment.createdAt || payment.date)}</span>
                        </div>
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
};

export default PaymentHistory;