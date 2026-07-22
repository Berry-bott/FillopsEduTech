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
  BookOpen,
  FileText,
  HelpCircle,
  Users,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import useTutorStore from "@/store/tutorStore";
import useTutorAuthStore from "@/store/tutorAuthStore";

// Treat these values as "no filter" — show everything
const ALL_CATS_VALUES = new Set(["all-catigories", "all", "", null, undefined]);
const isAllCategories = (examBody) => ALL_CATS_VALUES.has(examBody);

export default function DashboardOverview({ context, setActiveTab }) {
  const {
    fetchDashboard,
    dashboardData,
    subjects,
    topics,
    questions,
    loading,
    error,
    getSubjects,
    getTopics,
    getQuestions,
    getSubjectEnrolledStudents,
  } = useTutorStore();

  const { tutor } = useTutorAuthStore();

  const [subjectsWithEnrollment, setSubjectsWithEnrollment] = useState([]);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const showAll = isAllCategories(context?.examBody);

  // ─── Load core dashboard & content data ───────────────────────────────
  useEffect(() => {
    let ignore = false;

    const loadCoreData = async () => {
      if (ignore) return;
      if (!dashboardData) await fetchDashboard();
      await Promise.all([getSubjects(), getTopics(), getQuestions()]);
    };

    loadCoreData().catch(console.error);
    return () => { ignore = true; };
  }, [dashboardData, fetchDashboard, getSubjects, getTopics, getQuestions]);

  // ─── Load enrolled students for ALL subjects ───────────────────────────
  // Runs whenever subjects list changes — not filtered by exam body so
  // switching to "all-catigories" still shows enrollment data
  useEffect(() => {
    if (!Array.isArray(subjects) || subjects.length === 0) return;

    let ignore = false;
    setLoadingEnrollment(true);

    const loadEnrollments = async () => {
      try {
        const enriched = await Promise.all(
          subjects.map(async (subject) => {
            const subjectId = subject._id || subject.id;
            if (!subjectId) return { ...subject, enrolledStudents: [], enrollmentCount: 0 };

            const res = await getSubjectEnrolledStudents(subjectId);
            if (res?.success && Array.isArray(res.data?.students)) {
              return {
                ...subject,
                enrolledStudents: res.data.students,
                enrollmentCount:  res.data.students.length,
              };
            }
            return { ...subject, enrolledStudents: [], enrollmentCount: 0 };
          })
        );
        if (!ignore) setSubjectsWithEnrollment(enriched);
      } catch (err) {
        console.error("Enrollment loading failed:", err);
      } finally {
        if (!ignore) setLoadingEnrollment(false);
      }
    };

    loadEnrollments();
    return () => { ignore = true; };
  }, [subjects, getSubjectEnrolledStudents]);

  // Safe arrays
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeSubjects  = Array.isArray(subjects)  ? subjects  : [];
  const safeTopics    = Array.isArray(topics)     ? topics    : [];

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

  // ─── Subjects filtered for enrolled students section ─────────────────
  // All categories → show all subjects
  // Specific category → filter subjects that belong to that exam body
  const filteredSubjectsWithEnrollment = useMemo(() => {
    if (showAll) return subjectsWithEnrollment;
    return subjectsWithEnrollment.filter((s) => {
      const cat = (s.category || s.examBody || s.examType || "").toLowerCase();
      return !cat || cat === context?.examBody?.toLowerCase();
    });
  }, [subjectsWithEnrollment, context?.examBody, showAll]);

  const stats = useMemo(() => {
    const uniqueStudentIds = new Set(
      filteredSubjectsWithEnrollment.flatMap((s) =>
        (s.enrolledStudents || []).map((e) => e.student?.id || e.student?._id || e.studentId).filter(Boolean)
      )
    )
    const totalEnrolled = uniqueStudentIds.size || filteredSubjectsWithEnrollment.reduce((acc, s) => acc + (s.enrollmentCount || 0), 0)

    return [
      {
        title:  "Total Questions",
        value:  dashboardData?.overview?.totalQuestions ?? safeQuestions.length,
        icon:   HelpCircle,
        action: "questions",
      },
      {
        title:  "Total Bookings",
        value:  dashboardData?.overview?.totalBookings ?? 0,
        icon:   Users,
        action: null,
      },
      {
        title:  "Total Subjects",
        value:  dashboardData?.overview?.totalSubjects ?? safeSubjects.length,
        icon:   BookOpen,
        action: "subjects",
      },
      {
        title:  "Topics Created",
        value:  dashboardData?.overview?.totalTopics ?? safeTopics.length,
        icon:   FileText,
        action: "topics",
      },
      {
        title:  "Complete Content",
        value:  completeContent.length,
        icon:   HelpCircle,
        action: "questions",
      },
      {
        title:  "Enrolled Students",
        value:  totalEnrolled,
        icon:   UserCheck,
        action: null,
      },
    ]
  }, [dashboardData, safeQuestions.length, safeSubjects.length, safeTopics.length, completeContent.length, filteredSubjectsWithEnrollment]);

  // ─── Loading / Error states ───────────────────────────────────────────
  if (loading && !dashboardData && safeSubjects.length === 0) {
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

  if (error && !dashboardData && safeSubjects.length === 0) {
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

      {/* Local stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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

      {/* Complete Content Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
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

      {/* Subjects & Enrolled Students */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects & Enrolled Students</CardTitle>
          <CardDescription>
            {showAll
              ? "All subjects and their enrolled students"
              : `Subjects and enrolled students for ${context?.examBody?.toUpperCase()}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingEnrollment ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading enrollment data...</p>
            </div>
          ) : filteredSubjectsWithEnrollment.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No subjects yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjectsWithEnrollment.map((subject) => (
                <Card key={subject._id || subject.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg leading-tight">
                        {typeof subject.name === "object"
                          ? subject.name?.subjectName || subject.name?.id || "Unnamed Subject"
                          : subject.name || subject.subjectName || "Unnamed Subject"}
                      </CardTitle>
                      <Badge
                        variant={subject.enrollmentCount > 0 ? "default" : "secondary"}
                        className="whitespace-nowrap"
                      >
                        <UserCheck className="mr-1 h-3.5 w-3.5" />
                        {subject.enrollmentCount} student{subject.enrollmentCount !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    {subject.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {subject.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="text-sm space-y-4">
                    {subject.enrolledStudents?.length > 0 ? (
                      <>
                        <Separator />
                        <div>
                          <p className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                            Enrolled Students
                          </p>
                          <ul className="space-y-2.5">
                            {subject.enrolledStudents.slice(0, 5).map((enroll, i) => {
                              const s    = enroll.student || {};
                              const name =
                                [s.firstName, s.lastName].filter(Boolean).join(" ") ||
                                s.email ||
                                `Student ${i + 1}`;
                              return (
                                <li key={s.id || enroll.enrolledAt || i} className="flex items-center gap-3 text-xs">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium truncate">{name}</div>
                                    {s.email && name !== s.email && (
                                      <div className="text-muted-foreground text-[10px] truncate">{s.email}</div>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {enroll.enrolledAt ? new Date(enroll.enrolledAt).toLocaleDateString() : "—"}
                                  </span>
                                </li>
                              );
                            })}
                            {subject.enrolledStudents.length > 5 && (
                              <li className="text-xs text-muted-foreground italic pl-5">
                                + {subject.enrolledStudents.length - 5} more
                              </li>
                            )}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator />
                        <p className="text-xs text-muted-foreground italic">No students enrolled yet</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}