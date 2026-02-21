import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from "recharts";
import {
  ArrowLeft,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const gradeColor = (acc) => acc >= 70 ? "#22c55e" : acc >= 45 ? "#f59e0b" : "#ef4444";
const gradeLabel = (acc) => acc >= 70 ? "Strong" : acc >= 45 ? "Average" : "Weak";

const SUBJECT_COLORS = {
  "English Language": "#6366f1",
  Chemistry: "#f59e0b",
  Biology: "#10b981",
  Mathematics: "#3b82f6",
};
const getColor = (subject) => SUBJECT_COLORS[subject] || "#8b5cf6";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
      <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{label}</span>
      <span className="text-3xl font-black" style={{ color: accent }}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}{p.name?.toLowerCase().includes("acc") ? "%" : ""}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Topic Row ────────────────────────────────────────────────────────────────
function TopicRow({ topic, subject, accuracy, totalQuestions }) {
  const color = gradeColor(accuracy);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{topic}</p>
        <p className="text-xs text-gray-400">{subject} · {totalQuestions} questions</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${accuracy}%`, backgroundColor: color }} />
        </div>
        <span className="text-xs font-bold w-10 text-right" style={{ color }}>{accuracy}%</span>
      </div>
    </div>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ subject, accuracy, totalQuestions, color }) {
  const c = gradeColor(accuracy);
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="w-3 h-3 rounded-full mt-0.5" style={{ backgroundColor: color }} />
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: c + "20", color: c }}
        >
          {gradeLabel(accuracy)}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-0.5">{subject}</p>
      <p className="text-xs text-gray-400 mb-3">{totalQuestions} questions answered</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${accuracy}%`, backgroundColor: color }} />
        </div>
        <span className="text-sm font-black" style={{ color }}>{accuracy}%</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [topicTab, setTopicTab] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const { fetchWithAuth } = useAuthStore.getState();
        const res = await fetchWithAuth(`${API_BASE}/users/analytics/performance`);
        if (res?.data) {
          setData(res.data);
          setActiveSubject(res.data.charts?.subjectTrends?.[0]?.subject || null);
        } else {
          setError("No data returned");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-sm text-gray-400">{error || "Failed to load analytics"}</p>
        </div>
      </div>
    );
  }

  const { charts, highlights, topicAnalysis } = data;
  const progressData = charts?.progressOverTime || [];
  const subjectPerf = charts?.subjectPerformance || [];
  const subjectTrends = charts?.subjectTrends || [];
  const weaknesses = highlights?.weaknesses || [];
  const strengths = highlights?.strengths || [];
  const mostUsed = highlights?.mostUsedSubjects || [];
  const allTopics = topicAnalysis?.all || [];
  const weakTopics = topicAnalysis?.weakTopics || [];
  const strongTopics = topicAnalysis?.strongTopics || [];
  const failedTopics = topicAnalysis?.frequentlyFailedTopics || [];

  const totalQuestions = subjectPerf.reduce((s, x) => s + x.totalQuestions, 0);
  const avgAccuracy = subjectPerf.length
    ? Math.round(subjectPerf.reduce((s, x) => s + x.accuracy, 0) / subjectPerf.length)
    : 0;
  const totalMinutes = mostUsed.reduce((s, x) => s + (x.minutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const bestSubject = [...subjectPerf].sort((a, b) => b.accuracy - a.accuracy)[0];

  const activeTrend = subjectTrends.find(s => s.subject === activeSubject);

  const topicsToShow =
    topicTab === "weak" ? weakTopics
    : topicTab === "strong" ? strongTopics
    : allTopics;

  const radarData = subjectPerf.map(s => ({
    subject: s.subject.length > 10 ? s.subject.split(" ")[0] : s.subject,
    accuracy: s.accuracy,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Performance Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Your study data at a glance</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 self-start sm:self-auto">
             {/* Back Button */}
        <button
          onClick={() => navigate('/user/dashboard')}
          className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-300"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700">Back to Dashboard</span>
        </button>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live data
          </div>
        </div>

        {/* ── Top Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Questions" value={totalQuestions} sub="across all subjects" accent="#6366f1" />
          <StatCard label="Avg Accuracy" value={`${avgAccuracy}%`} sub="all subjects combined" accent={gradeColor(avgAccuracy)} />
          <StatCard label="Study Time" value={`${totalHours}h`} sub={`${totalMinutes} minutes total`} accent="#10b981" />
          <StatCard label="Best Subject" value={`${bestSubject?.accuracy}%`} sub={bestSubject?.subject || "—"} accent="#3b82f6" />
        </div>

        {/* ── Progress Over Time + Radar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Progress Over Time" sub="Accuracy & questions answered per session" />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={progressData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="questionsAnswered" name="Questions" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Subject Radar" sub="Performance across subjects" />
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Radar name="Accuracy %" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Subject Performance Cards ── */}
        <div>
          <SectionHeader title="Subject Performance" sub="Accuracy breakdown by subject" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjectPerf.map(s => (
              <SubjectCard key={s.subject} {...s} color={getColor(s.subject)} />
            ))}
          </div>
        </div>

        {/* ── Subject Trend + Bar Chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Subject Trend" sub="Accuracy over time per subject" />
            <div className="flex flex-wrap gap-2 mb-4">
              {subjectTrends.map(s => (
                <button
                  key={s.subject}
                  onClick={() => setActiveSubject(s.subject)}
                  className="text-xs px-3 py-1 rounded-full font-semibold transition-all border"
                  style={
                    activeSubject === s.subject
                      ? { backgroundColor: getColor(s.subject), borderColor: getColor(s.subject), color: "#fff" }
                      : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
                  }
                >
                  {s.subject.split(" ")[0]}
                </button>
              ))}
            </div>
            {activeTrend && (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={activeTrend.trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy %"
                    stroke={getColor(activeSubject)}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: getColor(activeSubject) }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Study Time by Subject" sub="Total minutes spent per subject" />
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={mostUsed} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" tickFormatter={s => s.split(" ")[0]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="minutes" name="Minutes" radius={[6, 6, 0, 0]}>
                  {mostUsed.map((entry, i) => (
                    <Cell key={i} fill={getColor(entry.subject)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Topic Analysis ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Topic Analysis</h2>
              <p className="text-xs text-gray-400 mt-0.5">Accuracy per topic across all subjects</p>
            </div>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 self-start sm:self-auto">
              {[["all", "All"], ["weak", "Weak"], ["strong", "Strong"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTopicTab(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    topicTab === val
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            {topicsToShow.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No topics in this category</p>
            ) : (
              topicsToShow.map((t, i) => <TopicRow key={i} {...t} />)
            )}
          </div>
        </div>

        {/* ── Frequently Failed + Weaknesses / Strengths ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Frequently Failed Topics" sub="Topics you get wrong most often" />
            <div className="space-y-3">
              {failedTopics.map((t, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-black flex items-center justify-center">
                      {/* {i + 1} */}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{t.topic}</span>
                  </div>
                  <span className="flex-shrink-0 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                    {t.failedAttempts} fails
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {weaknesses.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 shadow-sm">
                <SectionHeader title="⚠️ Areas to Improve" sub="Subjects below 40% accuracy" />
                <div className="space-y-2">
                  {weaknesses.map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: w.color }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{w.subject}</span>
                      <span className="text-sm font-black text-red-500">{w.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {strengths.length > 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900/30 rounded-2xl p-5 shadow-sm">
                <SectionHeader title="✅ Strengths" sub="Subjects above 70% accuracy" />
                <div className="space-y-2">
                  {strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{s.subject}</span>
                      <span className="text-sm font-black text-green-500">{s.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center gap-2 min-h-[100px]">
                <span className="text-2xl">🎯</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No strengths yet</p>
                <p className="text-xs text-gray-400">Score above 70% in a subject to unlock a strength</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}