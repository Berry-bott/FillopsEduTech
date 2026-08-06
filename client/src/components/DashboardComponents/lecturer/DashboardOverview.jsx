import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Users,
  AlertCircle,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  GraduationCap,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useTutorStore from "@/store/tutorStore";

// Treat these values as "no filter" — show everything
const ALL_CATS_VALUES = new Set(["all-catigories", "all", "", null, undefined]);
const isAllCategories = (examBody) => ALL_CATS_VALUES.has(examBody);

const DIFFICULTY_COLORS = {
  EASY: "#22c55e",
  MEDIUM: "#eab308",
  HARD: "#ef4444",
};

const CATEGORY_COLORS = ["#3b82f6", "#6366f1", "#a855f7", "#06b6d4"];

export default function DashboardOverview({ context, setActiveTab }) {
  const {
    fetchDashboard,
    dashboardData,
    questions,
    loading,
    error,
    getQuestions,
  } = useTutorStore();

  const [showTooltip, setShowTooltip] = useState(false);

  const showAll = isAllCategories(context?.examBody);

  // ─── Load core dashboard & question data ──────────────────────────────
  useEffect(() => {
    let ignore = false;

    const loadCoreData = async () => {
      if (ignore) return;
      if (!dashboardData) await fetchDashboard();
      await getQuestions();
    };

    loadCoreData().catch(console.error);
    return () => { ignore = true; };
  }, [dashboardData, fetchDashboard, getQuestions]);

  // Safe arrays
  const safeQuestions = Array.isArray(questions) ? questions : [];

  // ─── Group questions into content packages ────────────────────────────
  // When showAll → include ALL questions regardless of category
  // When specific category → filter to match context.examBody + context.year
  const completeContent = useMemo(() => {
    const map = new Map();

    const toString = (val, ...keys) => {
      if (!val) return null;
      if (typeof val === "object") {
        for (const key of keys) { if (val[key]) return String(val[key]); }
        return val.name || val.id || JSON.stringify(val);
      }
      return String(val);
    };

    safeQuestions.forEach((q) => {
      const categoryStr = toString(q?.category, "name");
      const subjectStr  = toString(q?.subject,  "subjectName", "name");
      const topicStr    = toString(q?.topic,    "topicName",   "name");
      const yearStr     = String(q?.year || "");

      // ── Filter logic ──────────────────────────────────────────────────
      // All categories: only filter by year (if set)
      // Specific category: filter by both category AND year
      const yearMatch     = !context?.year || yearStr === String(context.year);
      const categoryMatch = showAll || categoryStr?.toLowerCase() === context?.examBody?.toLowerCase();

      if (!yearMatch || !categoryMatch) return;

      const key = `${categoryStr}-${yearStr}-${subjectStr}-${topicStr}`;
      if (!map.has(key)) {
        map.set(key, {
          id:            key,
          category:      categoryStr,
          year:          yearStr,
          subject:       subjectStr || "Unnamed Subject",
          topic:         topicStr   || "Unnamed Topic",
          questions:     [],
          questionCount: 0,
        });
      }

      const group = map.get(key);
      group.questions.push(q);
      group.questionCount++;
    });

    return Array.from(map.values());
  }, [safeQuestions, context?.examBody, context?.year, showAll]);

  // ─── Stats cards from dashboardData.overview ─────────────────────────
  const stats = useMemo(() => {
    const overview = dashboardData?.overview || {};
    return [
      {
        title:  "Total Subjects",
        value:  overview.totalSubjects ?? 0,
        icon:   BookOpen,
        action: "subjects",
      },
      {
        title:  "Total Topics",
        value:  overview.totalTopics ?? 0,
        icon:   FileText,
        action: "topics",
      },
      {
        title:  "Total Questions",
        value:  overview.totalQuestions ?? safeQuestions.length,
        icon:   HelpCircle,
        action: "questions",
      },
      {
        title:  "Total Bookings",
        value:  overview.totalBookings ?? 0,
        icon:   Calendar,
        action: null,
      },
      {
        title:  "Total Students",
        value:  overview.totalStudents ?? 0,
        icon:   Users,
        action: null,
      },
      {
        title:  "Students Studying",
        value:  overview.studentsStudying ?? 0,
        icon:   GraduationCap,
        action: null,
      },
      {
        title:  "Active Subscribers",
        value:  overview.activeSubscribers ?? 0,
        icon:   UserCheck,
        action: null,
      },
      {
        title:  "Total Selected By",
        value:  overview.totalSelectedBy ?? 0,
        icon:   TrendingUp,
        action: null,
      },
    ];
  }, [dashboardData, safeQuestions.length]);

  // ─── Booking stats card data ─────────────────────────────────────────
  const bookingStats = useMemo(() => {
    const bs = dashboardData?.bookingStats || {};
    return [
      { title: "Pending",    value: bs.pending ?? 0,    icon: Clock,        color: "text-yellow-600", bg: "bg-yellow-100" },
      { title: "Confirmed",  value: bs.confirmed ?? 0,  icon: CheckCircle2, color: "text-blue-600",   bg: "bg-blue-100" },
      { title: "Completed",  value: bs.completed ?? 0,  icon: CheckCircle2, color: "text-green-600",  bg: "bg-green-100" },
      { title: "Cancelled",  value: bs.cancelled ?? 0,  icon: XCircle,     color: "text-red-600",     bg: "bg-red-100" },
      { title: "Rescheduled", value: bs.rescheduled ?? 0, icon: Activity,  color: "text-purple-600", bg: "bg-purple-100" },
    ];
  }, [dashboardData]);

  // ─── Chart data ──────────────────────────────────────────────────────
  const difficultyData = useMemo(() => {
    const d = dashboardData?.questionsByDifficulty || {};
    const easy = d.easy ?? 0;
    const medium = d.medium ?? 0;
    const hard = d.hard ?? 0;
    const total = easy + medium + hard;
    const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);
    return [
      { name: "Easy",   value: 1, count: easy,   percentage: pct(easy) },
      { name: "Medium", value: 1, count: medium, percentage: pct(medium) },
      { name: "Hard",   value: 1, count: hard,   percentage: pct(hard) },
    ];
  }, [dashboardData]);

  const categoryData = useMemo(() => {
    const cats = dashboardData?.questionsByCategory || [];
    return cats.map((c) => ({
      name: c.category || "Unknown",
      questions: c._count?.category ?? 0,
    }));
  }, [dashboardData]);

  // ─── Recent bookings / upcoming sessions tables ──────────────────────
  const recentBookings = dashboardData?.recentBookings || [];
  const upcomingSessions = dashboardData?.upcomingSessions || [];

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      CANCELLED_BY_USER: "bg-red-100 text-red-800 border-red-200",
      RESCHEDULED: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return (
      <Badge className={`${variants[status] || "bg-gray-100 text-gray-800 border-gray-200"} border`}>
        {status?.replace(/_/g, " ") || "—"}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      EASY: "bg-green-100 text-green-800 border-green-200",
      MEDIUM: "bg-blue-100 text-blue-800 border-blue-200",
      HARD: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge className={`${variants[difficulty] || "bg-gray-100 text-gray-800 border-gray-200"} border`}>
        {difficulty}
      </Badge>
    );
  };

  // ─── Loading / Error states ───────────────────────────────────────────
  if (loading && !dashboardData && safeQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !dashboardData && safeQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error || "Unknown error"}</p>
            <button
              onClick={() => fetchDashboard()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Main UI ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Overview stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={stat.action ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
            onClick={() => stat.action && setActiveTab(stat.action)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Booking Statistics
          </CardTitle>
          <CardDescription>Overview of all tutoring session bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {bookingStats.map((stat) => (
              <div
                key={stat.title}
                className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
              >
                <div className={`${stat.bg} p-2.5 rounded-lg flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complete Content Overview */}
      <Card>
        <CardHeader className="flex pb-5 flex-row items-center justify-between">
          <div>
            <CardTitle>Complete Content Overview</CardTitle>
            <CardDescription>
              {showAll
                ? "All exam categories grouped by subject and topic"
                : `${context?.examBody?.toUpperCase()} — grouped by subject and topic`}
            </CardDescription>
          </div>
          <div className="relative">
            <button
              onClick={() => setActiveTab("subjects")}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Questions
            </button>

            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 z-50 pointer-events-none">
                <div className="bg-gray-900 text-white text-sm rounded p-4 shadow-xl">
                  <p className="font-semibold mb-2">Quick Start:</p>
                  <ol className="list-decimal pl-5 text-xs space-y-1">
                    <li>Create a Subject</li>
                    <li>Add Topics</li>
                    <li>Create Questions under Topics</li>
                  </ol>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {completeContent.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No complete content packages yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completeContent.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader className="pb-3">
                    <Badge variant="secondary">
                      {pkg.category?.toUpperCase() || "—"} • {pkg.year || "—"}
                    </Badge>
                    <CardTitle className="mt-2 text-lg">{pkg.subject || "Unnamed"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Topic:</strong> {pkg.topic || "—"}</p>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Questions</span>
                      <Badge variant="outline">{pkg.questionCount}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts: Difficulty (pie) + Category (bar) in flex */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Questions by Difficulty — Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Questions by Difficulty
            </CardTitle>
            <CardDescription>Distribution of questions by difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={95}
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DIFFICULTY_COLORS[entry.name.toUpperCase()] || "#94a3b8"}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active }) => {
                      if (!active) return null;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
                          <p className="font-semibold text-gray-800 mb-2">Questions by Difficulty</p>
                          <div className="space-y-1.5">
                            {difficultyData.map((d) => (
                              <div key={d.name} className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="w-3 h-3 rounded-full" style={{ background: DIFFICULTY_COLORS[d.name.toUpperCase()] || "#94a3b8" }} />
                                  {d.name}
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {d.count} ({d.percentage}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Questions by Category — Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Questions by Category
            </CardTitle>
            <CardDescription>Number of questions per exam category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 || categoryData.every((c) => c.questions === 0) ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(59, 130, 246, 0.08)" }} />
                  <Legend />
                  <Bar dataKey="questions" name="Questions" radius={[6, 6, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions Table */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>{upcomingSessions.length} scheduled tutoring session{upcomingSessions.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.user?.firstName} {session.user?.lastName}
                    </TableCell>
                    <TableCell>{session.purpose || "—"}</TableCell>
                    <TableCell>{formatDate(session.scheduledAt)}</TableCell>
                    <TableCell>{session.duration ? `${session.duration} min` : "—"}</TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings Table */}
      {recentBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </TableCell>
                    <TableCell>{booking.purpose || "—"}</TableCell>
                    <TableCell>{formatDate(booking.scheduledAt)}</TableCell>
                    <TableCell>{booking.duration ? `${booking.duration} min` : "—"}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
