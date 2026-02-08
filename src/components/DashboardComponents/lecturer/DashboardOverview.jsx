 import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, FileText, HelpCircle, Users, AlertCircle, UserCheck } from "lucide-react"
import useTutorStore from "@/store/tutorStore"
import useTutorAuthStore from "@/store/tutorAuthStore"

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
    getSubjectEnrolledStudents
  } = useTutorStore()

  const { tutor } = useTutorAuthStore();

  const [subjectsWithEnrollment, setSubjectsWithEnrollment] = useState([]);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);

  useEffect(() => {
    console.log("👨‍🏫 Tutor profile (state change):", tutor);
  }, [tutor]);

  const [showTooltip, setShowTooltip] = useState(false)



  // ---------------- FETCH DASHBOARD ONCE ----------------
  useEffect(() => {
    const loadDashboard = async () => {
      if (!dashboardData) {
        console.log("📊 Fetching dashboard data...");
        const result = await fetchDashboard();
        
        if (!result || !result.success) {
          console.log("⚠️ Dashboard fetch failed, loading individual data...");
          // Fallback: fetch individual data if dashboard fails
          await Promise.all([
            getSubjects(),
            getTopics(),
            getQuestions()
          ]);
        }
      }
    };
    loadDashboard();
  }, []); // Only run once on mount

  // ---------------- FETCH DASHBOARD ONCE ----------------
useEffect(() => {
  const loadDashboard = async () => {
    console.log("📊 Starting dashboard load...");
    
    // Fetch all data in parallel
    const [dashResult, subjectsResult, topicsResult, questionsResult] = await Promise.all([
      dashboardData ? Promise.resolve({ success: true }) : fetchDashboard(),
      getSubjects(),
      getTopics(),
      getQuestions()
    ]);
    
    console.log("✅ Dashboard load complete");
    console.log("📊 Subjects loaded:", subjectsResult);
  };
  
  loadDashboard();
}, []); // Only run once on mount

// ---------------- FETCH ENROLLED STUDENTS FOR EACH SUBJECT ----------------
useEffect(() => {
  const loadEnrolledStudents = async () => {
    console.log("🔍 subjects:", subjects);
    console.log("🔍 subjects.length:", subjects.length);
    
    if (!subjects || subjects.length === 0) {
      console.log("⚠️ No subjects available, skipping enrollment fetch");
      return;
    }

    setLoadingEnrollment(true);
    console.log("👥 Fetching enrolled students for", subjects.length, "subjects...");
    
    const subjectsWithStudents = await Promise.all(
      subjects.map(async (subject) => {
        console.log(`🔍 Fetching students for: ${subject.name} (${subject._id})`);
        
        const result = await getSubjectEnrolledStudents(subject._id);
        
        console.log(`📊 Enrollment result for ${subject.name}:`, result);
        
        if (result.success) {
          const enrolledStudents = result.data || [];
          
          console.log(`
╔════════════════════════════════════════════╗
║  Subject: ${subject.name.padEnd(33)} ║
╠════════════════════════════════════════════╣
║  Enrolled Students: ${enrolledStudents.length.toString().padEnd(24)} ║
╚════════════════════════════════════════════╝
          `);
          
          if (enrolledStudents.length > 0) {
            console.log(`📚 Students in "${subject.name}":`);
            enrolledStudents.forEach((student, idx) => {
              console.log(`   ${idx + 1}. ${student.name || student.email || 'Unknown'} (ID: ${student._id})`);
            });
          } else {
            console.log(`   No students enrolled in ${subject.name}`);
          }
          
          return {
            ...subject,
            enrolledStudents,
            enrollmentCount: enrolledStudents.length
          };
        }
        
        console.warn(`⚠️ Failed to fetch students for ${subject.name}`);
        
        return {
          ...subject,
          enrolledStudents: [],
          enrollmentCount: 0
        };
      })
    );

    console.log("✅ Final subjectsWithEnrollment:", subjectsWithStudents);
    setSubjectsWithEnrollment(subjectsWithStudents);
    setLoadingEnrollment(false);
  };

  loadEnrolledStudents();
}, [subjects]); // ✅ Watch entire subjects array, not just length

  // ---------------- SAFE DATA ----------------
  const safeQuestions = Array.isArray(questions) ? questions : []
  const safeSubjects = Array.isArray(subjects) ? subjects : []
  const safeTopics = Array.isArray(topics) ? topics : []

  // ---------------- COMPLETE CONTENT ----------------
  const completeContent = useMemo(() => {
    const grouped = []

    safeQuestions.forEach((q) => {
      if (
        q.category?.toLowerCase() === context.examBody &&
        q.year === context.year
      ) {
        const existing = grouped.find(
          (c) =>
            c.category === q.category &&
            c.year === q.year &&
            c.subject === q.subject &&
            c.topic === q.topic
        )
        if (existing) {
          existing.questions.push(q)
          existing.questionCount++
        } else {
          grouped.push({
            id: `${q.category}-${q.year}-${q.subject}-${q.topic}`,
            category: q.category,
            year: q.year,
            subject: q.subject,
            topic: q.topic,
            questions: [q],
            questionCount: 1,
          })
        }
      }
    })

    return grouped
  }, [safeQuestions, context.examBody, context.year])

  // ---------------- STATS ----------------
  const stats = [
    { title: "Total Subjects", value: dashboardData?.overview?.totalSubjects || safeSubjects.length, icon: BookOpen, action: "subjects" },
    { title: "Topics Created", value: dashboardData?.overview?.totalTopics || safeTopics.length, icon: FileText, action: "topics" },
    { title: "Complete Content", value: completeContent.length, icon: HelpCircle, action: "questions" },
  ]

  // ---------------- LOADING STATE ----------------
  if (loading && !dashboardData && safeSubjects.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------- ERROR STATE ----------------
  if (error && !dashboardData && safeSubjects.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => fetchDashboard()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add this right before the return statement
console.log("🎨 Render state:", {
  loadingEnrollment,
  subjectsWithEnrollment,
  subjectsWithEnrollmentLength: subjectsWithEnrollment.length
});



  return (
   <div className="space-y-6 w-full max-w-full overflow-x-hidden">

      {/* API STATS */}
      {dashboardData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6 mt-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.overview?.totalStudents ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Questions</CardTitle>
              <HelpCircle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview?.totalQuestions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Booking</CardTitle>
              <HelpCircle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview?.totalBookings || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* LOCAL + API STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab(stat.action)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SUBJECTS WITH ENROLLED STUDENTS */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects & Enrolled Students</CardTitle>
          <CardDescription>
            View all subjects with their enrolled students
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingEnrollment ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <p className="text-muted-foreground">Loading enrollment data...</p>
            </div>
          ) : subjectsWithEnrollment.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="size-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No subjects yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create subjects to see enrollment data
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {subjectsWithEnrollment.map((subject) => (
                <Card key={subject._id} className="hover:shadow-md transition">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <Badge variant={subject.enrollmentCount > 0 ? "default" : "secondary"}>
                        <UserCheck className="size-3 mr-1" />
                        {subject.enrollmentCount} {subject.enrollmentCount === 1 ? 'student' : 'students'}
                      </Badge>
                    </div>
                    {subject.description && (
                      <CardDescription className="mt-2">{subject.description}</CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm">
                    {subject.enrolledStudents && subject.enrolledStudents.length > 0 ? (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <p className="font-semibold text-xs text-muted-foreground">Enrolled Students:</p>
                          <ul className="space-y-1">
                            {subject.enrolledStudents.slice(0, 5).map((student, idx) => (
                              <li key={student._id} className="flex items-center gap-2 text-xs">
                                <div className="size-2 rounded-full bg-primary/60" />
                                <span>{student.name || student.email || 'Unknown Student'}</span>
                              </li>
                            ))}
                            {subject.enrolledStudents.length > 5 && (
                              <li className="text-xs text-muted-foreground italic">
                                +{subject.enrolledStudents.length - 5} more...
                              </li>
                            )}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator />
                        <p className="text-muted-foreground text-xs italic">No students enrolled yet</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* COMPLETE CONTENT */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Complete Content Overview</CardTitle>
              <CardDescription>
                All content packages with Category, Year, Subject, Topic, and Questions
              </CardDescription>
            </div>
            <button
              onClick={() => setActiveTab("subjects")}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Questions
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 z-10">
                  <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg">
                    <div className="font-semibold mb-2">Quick Start Guide:</div>
                    <ol className="space-y-1 text-xs">
                      <li>1. Create a Subject</li>
                      <li>2. Add Topics to the Subject</li>
                      <li>3. Create Questions under Topics</li>
                    </ol>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {completeContent.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="size-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No complete content yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create subjects, topics, and questions to see them here
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completeContent.map((content) => (
                <Card key={content.id}>
                  <CardHeader className="pb-3">
                    <Badge variant="secondary">{content.category?.toUpperCase()} • {content.year}</Badge>
                    <CardTitle className="text-lg mt-2">{content.subject}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm">
                    <p><b>Topic:</b> {content.topic}</p>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Questions</span>
                      <Badge>{content.questionCount}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}