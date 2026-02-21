
// src/pages/FinancialReport.jsx
import { useEffect } from 'react';
import useReportStore from '../../store/reportStore';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Wallet,
  BookOpen,
  XCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowLeft
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (amount, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount ?? 0);

const fmtDate = (dateStr) =>
  dateStr
    ? new Intl.DateTimeFormat('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateStr))
    : '—';

const PAYMENT_STATUS_STYLES = {
  SUCCESS: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  FAILED:  'bg-red-100 text-red-700',
};

const PAYMENT_STATUS_ICON = {
  SUCCESS: <CheckCircle2 size={13} />,
  PENDING: <Clock size={13} />,
  FAILED:  <XCircle size={13} />,
};

const SUB_STATUS_STYLES = {
  Active:   'bg-green-100 text-green-700',
  Expired:  'bg-gray-100 text-gray-500',
  Inactive: 'bg-red-100 text-red-500',
};

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, iconBg }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FinancialReport() {
  const {
    summary,
    subscriptions,
    paymentHistory,
    loading,
    error,
    fetchFinancialReport,
    clearError,
  } = useReportStore();

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFinancialReport();
  }, []);

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      clearError();
    }
  }, [error]);

  // ── Loading ───────────────────────────────────────────────────
  if (loading && !summary) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading financial report...</p>
        </div>
      </div>
    );
  }

  // ── No data ───────────────────────────────────────────────────
  if (!loading && !summary) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={56} />
        <h2 className="text-xl font-semibold mb-2">Could not load report</h2>
        <p className="text-gray-500 mb-6">Please check your connection and try again.</p>
        <button
          onClick={fetchFinancialReport}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Report</h1>
          <div className='flex gap-1'>
          <button
            onClick={fetchFinancialReport}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
             {/* Back Button */}
            <button
            onClick={() => navigate('/user/dashboard')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-300"
            >
            <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-gray-700">Back to Dashboard</span>
            </button>
          </div>
            
        </div>

        {/* ── Summary stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Total Spent"
            value={fmt(summary?.totalSpent)}
            icon={Wallet}
            iconBg="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Active Subscriptions"
            value={summary?.activeSubscriptions ?? 0}
            icon={BookOpen}
            iconBg="bg-green-100 text-green-600"
          />
          <StatCard
            label="Failed Payments"
            value={fmt(summary?.totalFailed)}
            icon={XCircle}
            iconBg="bg-red-100 text-red-500"
          />
        </div>

        {/* ── Subscriptions table ── */}
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-5">Active Subscriptions</h3>

          {subscriptions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No subscriptions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="pb-3 font-medium">Subject</th>
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Start Date</th>
                    <th className="pb-3 font-medium">Expiry Date</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscriptions.map((sub, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-800">{sub.subject}</td>
                      <td className="py-3 text-gray-500 capitalize">{sub.plan?.toLowerCase()}</td>
                      <td className="py-3 text-gray-500 whitespace-nowrap">{fmtDate(sub.startDate)}</td>
                      <td className="py-3 text-gray-500 whitespace-nowrap">{fmtDate(sub.expiryDate)}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SUB_STATUS_STYLES[sub.status] || 'bg-gray-100 text-gray-600'}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Payment history table ── */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-5">Payment History</h3>

          {paymentHistory.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Reference</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paymentHistory.map((tx, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-gray-500 whitespace-nowrap">{fmtDate(tx.date)}</td>
                      <td className="py-3 text-gray-700 max-w-[180px] truncate" title={tx.items}>
                        {tx.items || '—'}
                      </td>
                      <td className="py-3 text-gray-500">
                        <span className="inline-flex items-center gap-1 capitalize">
                          {tx.method ? <><CreditCard size={13} /> {tx.method}</> : '—'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 font-mono text-xs truncate max-w-[140px]" title={tx.reference}>
                        {tx.reference}
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-800 whitespace-nowrap">
                        {fmt(tx.amount, tx.currency)}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${PAYMENT_STATUS_STYLES[tx.status] || 'bg-gray-100 text-gray-600'}`}>
                          {PAYMENT_STATUS_ICON[tx.status]}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}