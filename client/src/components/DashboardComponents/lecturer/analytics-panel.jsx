
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  BookOpen,
  TrendingUp,
  Loader2,
  Mail,
  Award,
  GraduationCap,
  BarChart3,
  PieChart,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  HelpCircle,
  AlertCircle,
  Activity,
  Target,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useTutorStore from "@/store/tutorStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsPanel({ subjects: propSubjects }) {
  const { toast } = useToast();
  const {
    getSubjectEnrolledStudents,
    dashboardData,
    fetchDashboard,
    loading,
    subjects: storeSubjects,
    getSubjects,
  } = useTutorStore();

  const subjects = propSubjects?.length ? propSubjects : storeSubjects || [];
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completionRate: 0,
    averageProgress: 0,
  });
  const [subjectsWithEnrollment, setSubjectsWithEnrollment] = useState([]);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);

  useEffect(() => {
    if (!dashboardData) fetchDashboard();
  }, [fetchDashboard, dashboardData]);

  useEffect(() => {
    if (!subjects?.length) {
      getSubjects().catch(() => {});
    }
  }, [subjects?.length, getSubjects]);

  // ─── Load enrolled students for ALL subjects ───────────────────────────
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

  const loadEnrolledStudents = async () => {
    if (!selectedSubject) return;
    setLoadingStudents(true);

    try {
      const subjectId = String(selectedSubject.subjectId || selectedSubject.id);
      const result = await getSubjectEnrolledStudents(subjectId);

      if (!result?.success) {
        toast({
          title: "Error",
          description: result?.message || "Failed to load students",
          variant: "destructive",
        });
        setEnrolledStudents([]);
        return;
      }

      const students = result.data?.students || result.data || [];
      setEnrolledStudents(students);

      const total = students.length;
      const active = students.filter((s) => s.status === "active").length;
      const totalProgress = students.reduce((sum, s) => sum + getProgressValue(s.progress), 0);

      setStats({
        totalStudents: total,
        activeStudents: active,
        completionRate: total ? Math.round((students.filter((s) => getProgressValue(s.progress) >= 100).length / total) * 100) : 0,
        averageProgress: total ? Math.round(totalProgress / total) : 0,
      });
    } catch (error) {
      console.error("❌ Analytics error:", error);
      toast({
        title: "Error",
        description: "Failed to load enrolled students",
        variant: "destructive",
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (subjects?.length && (!selectedSubject || !subjects.some((subject) => String(subject.subjectId || subject.id) === String(selectedSubject.subjectId || selectedSubject.id)))) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject]);

  useEffect(() => {
    if (selectedSubject) loadEnrolledStudents();
  }, [selectedSubject]);

  const filteredStudents = enrolledStudents.filter((student) => {
    if (!localSearch) return true;
    const q = localSearch.toLowerCase();
    return (
      (student.firstName || "").toLowerCase().includes(q) ||
      (student.lastName || "").toLowerCase().includes(q) ||
      (student.email || "").toLowerCase().includes(q) ||
      (student.studentId || "").toLowerCase().includes(q)
    );
  });

  const handleSubjectChange = (subjectId) => {
    const subject = subjects.find((s) => String(s.subjectId || s.id) === subjectId);
    if (subject) setSelectedSubject(subject);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressValue = (progress) => {
    if (typeof progress === "number") return progress;
    if (progress && typeof progress === "object") {
      return progress.completionPercent ?? 0;
    }
    return 0;
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: { className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      CONFIRMED: { className: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle2 },
      COMPLETED: { className: "bg-green-100 text-green-800 border-green-200", icon: Award },
      CANCELLED: { className: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      CANCELLED_BY_USER: { className: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };
    const config = variants[status] || { className: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle };
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} flex items-center gap-1 border`}>
        <Icon className="size-3" />
        {status?.replace(/_/g, " ")}
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

  if (loading && !dashboardData) {
    return (
      <div className="space-y-6">
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="py-16 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 size-16 text-blue-600" />
            <p className="text-blue-600 font-medium text-lg">Loading analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-8 w-full overflow-x-hidden">
      {/* HEADER */}
      <div className=" ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-primary text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2">
              Analytics Dashboard
            </h2>
          </div>
        </div>
      </div>

      {/* QUESTIONS BY DIFFICULTY */}
      {dashboardData?.questionsByDifficulty && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-5 bg-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800">Questions by Difficulty</h3>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
            <EnhancedStatCard
              title="Easy Questions"
              value={dashboardData.questionsByDifficulty.easy || 0}
              Icon={CheckCircle2}
              gradient="from-green-500 to-green-600"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <EnhancedStatCard
              title="Medium Questions"
              value={dashboardData.questionsByDifficulty.medium || 0}
              Icon={Target}
              gradient="from-blue-500 to-blue-600"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <EnhancedStatCard
              title="Hard Questions"
              value={dashboardData.questionsByDifficulty.hard || 0}
              Icon={TrendingUp}
              gradient="from-red-500 to-red-600"
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
          </div>
        </div>
      )}

      {/* QUESTIONS BY CATEGORY */}
      {dashboardData?.questionsByCategory && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-5 bg-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800">Questions by Category</h3>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardData.questionsByCategory.map((cat, idx) => (
              <EnhancedStatCard
                key={idx}
                title={`${cat.category || "Unknown"} Exam`}
                value={cat._count?.category || 0}
                Icon={HelpCircle}
                gradient={
                  idx === 0
                    ? "from-blue-500 to-blue-600"
                    : idx === 1
                    ? "from-indigo-500 to-indigo-600"
                    : idx === 2
                    ? "from-purple-500 to-purple-600"
                    : "from-cyan-500 to-cyan-600"
                }
                iconBg={
                  idx === 0
                    ? "bg-blue-100"
                    : idx === 1
                    ? "bg-indigo-100"
                    : idx === 2
                    ? "bg-purple-100"
                    : "bg-cyan-100"
                }
                iconColor={
                  idx === 0
                    ? "text-blue-600"
                    : idx === 1
                    ? "text-indigo-600"
                    : idx === 2
                    ? "text-purple-600"
                    : "text-cyan-600"
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING SESSIONS */}
      {dashboardData?.upcomingSessions && dashboardData.upcomingSessions.length > 0 && (
        <Card className="border-blue-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl text-blue-900">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Calendar className="size-6 text-white" />
                  </div>
                  Upcoming Sessions
                </CardTitle>
                <CardDescription className="text-blue-700 mt-2">
                  {dashboardData.upcomingSessions.length} scheduled tutoring session
                  {dashboardData.upcomingSessions.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white border-0 px-4 py-2 text-lg">
                {dashboardData.upcomingSessions.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dashboardData.upcomingSessions.map((session) => (
                <Card
                  key={session.id}
                  className="border-l-4 border-l-blue-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="size-14 border-2 border-blue-200">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                            {session.user?.firstName?.[0]}
                            {session.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg text-gray-800">
                            {session.user?.firstName} {session.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{session.purpose}</p>
                        </div>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-600 font-medium flex items-center gap-2">
                          <Calendar className="size-4" />
                          Scheduled
                        </span>
                        <p className="font-semibold text-gray-800 mt-1">{formatDate(session.scheduledAt)}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-600 font-medium flex items-center gap-2">
                          <Clock className="size-4" />
                          Duration
                        </span>
                        <p className="font-semibold text-gray-800 mt-1">{session.duration} minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RECENT BOOKINGS */}
      {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 && (
        <Card className="border-blue-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl text-blue-900">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Activity className="size-6 text-white" />
                  </div>
                  Recent Bookings
                </CardTitle>
                <CardDescription className="text-blue-700 mt-2">Latest booking activities</CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white border-0 px-4 py-2 text-lg">
                {dashboardData.recentBookings.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {dashboardData.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-md gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <Avatar className="size-12 border-2 border-blue-200">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {booking.user?.firstName?.[0]}
                        {booking.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{booking.purpose}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <span className="text-blue-600 font-medium flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(booking.scheduledAt)}
                        </span>
                        <span className="text-blue-600 font-medium flex items-center gap-1">
                          <Clock className="size-3" />
                          {booking.duration}min
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RECENT QUESTIONS */}
      {dashboardData?.recentQuestions && dashboardData.recentQuestions.length > 0 && (
        <Card className="border-blue-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl text-blue-900">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <HelpCircle className="size-6 text-white" />
                  </div>
                  Recent Questions
                </CardTitle>
                <CardDescription className="text-blue-700 mt-2">Latest created questions</CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white border-0 px-4 py-2 text-lg">
                {dashboardData.recentQuestions.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dashboardData.recentQuestions.map((question) => (
                <div
                  key={question.id}
                  className="p-5 w-full border border-blue-100 rounded-xl hover:bg-blue-50 transition-all
                   duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 px-0">
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-gray-800 text-lg mb-2 [&_p]:m-0 [&_p]:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: question.text || "" }}
                      />
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="size-4 text-blue-600" />
                        <span className="text-blue-700 font-medium">{question.subject?.subjectName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getDifficultyBadge(question.difficulty)}
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                        {question.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-3 pt-3 border-t border-blue-100">
                    <Clock className="size-3" />
                    Created {formatDate(question.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SUBJECT ENROLLMENT ANALYTICS */}
      <Separator className="my-8" />

      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-5 bg-blue-600 rounded-full"></div>
          <h3 className="text-2xl font-bold text-gray-800">Subject Enrollment Analytics</h3>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <p className="text-blue-800 font-medium">
            View and analyze student enrollment across your subjects
          </p>

          <Select
            value={selectedSubject ? String(selectedSubject.subjectId || selectedSubject.id) : ""}
            onValueChange={handleSubjectChange}
          >
            <SelectTrigger className="w-full sm:w-[280px] border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.length ? (
                subjects.map((subject) => (
                  <SelectItem key={subject.subjectId || subject.id} value={String(subject.subjectId || subject.id)}>
                    {subject.subjectName || subject.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No subjects
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* SUBJECT STATS */}
        {selectedSubject && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <EnhancedStatCard
              title="Total Students"
              value={stats.totalStudents}
              Icon={Users}
              gradient="from-blue-500 to-blue-600"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <EnhancedStatCard
              title="Active Students"
              value={stats.activeStudents}
              Icon={TrendingUp}
              gradient="from-green-500 to-green-600"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <EnhancedStatCard
              title="Avg Progress"
              value={`${stats.averageProgress}%`}
              Icon={PieChart}
              gradient="from-purple-500 to-purple-600"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
            <EnhancedStatCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              Icon={Award}
              gradient="from-yellow-500 to-yellow-600"
              iconBg="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>
        )}

        {/* SEARCH */}
        {selectedSubject && enrolledStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-blue-400" />
              <Input
                className="pl-11 h-12 border-blue-300 focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Search students by name or email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <Badge className="bg-blue-600 text-white border-0 px-4 h-12 flex items-center justify-center text-base sm:w-auto">
              {filteredStudents.length}/{enrolledStudents.length}
            </Badge>
          </div>
        )}

        {/* STUDENTS */}
        {loadingStudents ? (
          <Card className="border-blue-200">
            <CardContent className="py-16 text-center">
              <Loader2 className="animate-spin mx-auto mb-4 size-16 text-blue-600" />
              <p className="text-blue-600 font-medium">Loading students...</p>
            </CardContent>
          </Card>
        ) : filteredStudents.length ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student, idx) => (
              <Card
                key={student.id || student.studentId || `${student.email || student.firstName || "student"}-${idx}`}
                className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="bg-gradient-to-br from-blue-50 to-white pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16 border-2 border-blue-300">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                        {student.firstName?.[0]}
                        {student.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-gray-800">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Mail className="size-3 text-blue-600" />
                        <span className="text-blue-700 text-xs break-all">{student.email}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">Progress</span>
                      <span className="text-lg font-bold text-blue-900">{getProgressValue(student.progress)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressValue(student.progress)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedSubject ? (
          <Card className="border-blue-200 shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="size-12 text-blue-600" />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">No students found</p>
              <p className="text-blue-600">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Subjects & Enrolled Students */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects & Enrolled Students</CardTitle>
          <CardDescription>All subjects and their enrolled students</CardDescription>
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

// ENHANCED STAT CARD (unchanged styles)
function EnhancedStatCard({ title, value, Icon, gradient = "from-blue-500 to-blue-600", iconBg = "bg-blue-100", iconColor = "text-blue-600" }) {
  return (
    <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-3">{title}</p>
            <p className="text-4xl font-bold text-gray-900 break-words">{value}</p>
          </div>
          <div className={`${iconBg} p-2 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`size-4 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}