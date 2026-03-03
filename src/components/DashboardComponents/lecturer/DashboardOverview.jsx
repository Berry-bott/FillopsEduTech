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
  
  // ─── Load core dashboard & content data ────────────────────────────────
  useEffect(() => {
    let ignore = false;

    const loadCoreData = async () => {
      if (ignore) return;

      // Try dashboard endpoint first
      if (!dashboardData) {
        await fetchDashboard();
      }

      // Always make sure we have fresh subjects/topics/questions
      await Promise.all([
        getSubjects(),
        getTopics(),
        getQuestions(),
      ]);
    };

    loadCoreData().catch(console.error);

    return () => {
      ignore = true;
    };
  }, [dashboardData, fetchDashboard, getSubjects, getTopics, getQuestions]);

  // ─── Load enrolled students for each subject ───────────────────────────
  useEffect(() => {
    if (!Array.isArray(subjects) || subjects.length === 0) return;

    let ignore = false;

    const loadEnrollments = async () => {
      if (ignore) return;
      setLoadingEnrollment(true);

      try {
        const enriched = await Promise.all(
          subjects.map(async (subject) => {
            // Support both _id and id — depending on how getSubjects returns data
            const subjectId = subject._id || subject.id;

            if (!subjectId) {
              console.warn("Subject missing ID → skipping enrollment fetch", subject);
              return { ...subject, enrolledStudents: [], enrollmentCount: 0 };
            }

            const res = await getSubjectEnrolledStudents(subjectId);

            if (res?.success && res.data?.students && Array.isArray(res.data.students)) {
              const enrollments = res.data.students;
              return {
                ...subject,
                enrolledStudents: enrollments,
                enrollmentCount: enrollments.length,
              };
            }

            // Fallback when fetch fails or structure is unexpected
            return {
              ...subject,
              enrolledStudents: [],
              enrollmentCount: 0,
            };
          })
        );

        if (!ignore) {
          setSubjectsWithEnrollment(enriched);
        }
      } catch (err) {
        console.error("Enrollment loading failed:", err);
      } finally {
        if (!ignore) {
          setLoadingEnrollment(false);
        }
      }
    };

    loadEnrollments();

    return () => {
      ignore = true;
    };
  }, [subjects, getSubjectEnrolledStudents]);

  // Safe arrays
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeTopics = Array.isArray(topics) ? topics : [];

  // ─── Group questions into content packages ─────────────────────────────
  const completeContent = useMemo(() => {
    const map = new Map();

    safeQuestions.forEach((q) => {
      if (
        q?.category?.toLowerCase() === context?.examBody?.toLowerCase() &&
        String(q?.year) === String(context?.year)
      ) {
        const key = `${q.category || "unknown"}-${q.year || "unknown"}-${q.subject || "unknown"}-${q.topic || "unknown"}`;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            category: q.category,
            year: q.year,
            subject: q.subject,
            topic: q.topic,
            questions: [],
            questionCount: 0,
          });
        }

        const group = map.get(key);
        group.questions.push(q);
        group.questionCount++;
      }
    });

    return Array.from(map.values());
  }, [safeQuestions, context?.examBody, context?.year]);

  const stats = useMemo(
    () => [
      {
        title: "Total Subjects",
        value: dashboardData?.overview?.totalSubjects ?? safeSubjects.length,
        icon: BookOpen,
        action: "subjects",
      },
      {
        title: "Topics Created",
        value: dashboardData?.overview?.totalTopics ?? safeTopics.length,
        icon: FileText,
        action: "topics",
      },
      {
        title: "Complete Content",
        value: completeContent.length,
        icon: HelpCircle,
        action: "questions",
      },
    ],
    [dashboardData, safeSubjects.length, safeTopics.length, completeContent.length]
  );

  // ─── Loading / Error states ────────────────────────────────────────────
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

  // ─── Main UI ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Global stats from dashboard endpoint */}
      {dashboardData?.overview && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Students" value={dashboardData.overview.totalStudents ?? 0} icon={Users} />
          <StatCard title="Total Questions" value={dashboardData.overview.totalQuestions ?? 0} icon={HelpCircle} />
          <StatCard title="Total Bookings" value={dashboardData.overview.totalBookings ?? 0} icon={HelpCircle} />
        </div>
      )}

      {/* Local stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab(stat.action)}
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

      {/* Content packages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Complete Content Overview</CardTitle>
            <CardDescription>Grouped by exam body, year, subject and topic</CardDescription>
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

      {/* Subjects with enrollment */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects & Enrolled Students</CardTitle>
          <CardDescription>Overview of your subjects and student enrollment</CardDescription>
        </CardHeader>

        <CardContent>
          {loadingEnrollment ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading enrollment data...</p>
            </div>
          ) : subjectsWithEnrollment.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No subjects yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjectsWithEnrollment.map((subject) => (
                <Card key={subject._id || subject.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg leading-tight">
                        {subject.name || subject.subjectName || "Unnamed Subject"}
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
                              const s = enroll.student || {};
                              const name =
                                [s.firstName, s.lastName].filter(Boolean).join(" ") ||
                                s.email ||
                                `Student ${i + 1}`;

                              return (
                                <li key={s.id || enroll.enrolledAt} className="flex items-center gap-3 text-xs">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium truncate">{name}</div>
                                    {s.email && name !== s.email && (
                                      <div className="text-muted-foreground text-[10px] truncate">
                                        {s.email}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {new Date(enroll.enrolledAt).toLocaleDateString()}
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
                        <p className="text-xs text-muted-foreground italic">
                          No students enrolled yet
                        </p>
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