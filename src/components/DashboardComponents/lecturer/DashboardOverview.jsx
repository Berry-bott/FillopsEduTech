import { useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, FolderOpen, FileText, HelpCircle, Users } from "lucide-react"
import useTutorStore from "@/store/tutorStore"

export default function DashboardOverview({ context, setActiveTab }) {
  const { fetchDashboard, dashboardData, subjects, modules, topics, questions, setDashboardData } = useTutorStore()

  // ---------------- FETCH DASHBOARD ONCE ----------------
  useEffect(() => {
    const loadDashboard = async () => {
      if (!dashboardData) { // fetch only if store is empty
        const data = await fetchDashboard()
        setDashboardData(data) // persist in store
      }
    }
    loadDashboard()
  }, [fetchDashboard, dashboardData, setDashboardData])

  // ---------------- SAFE DATA ----------------
  const safeQuestions = Array.isArray(questions) ? questions : []
  const safeSubjects = Array.isArray(subjects) ? subjects : []
  const safeModules = Array.isArray(modules) ? modules : []
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
            c.module === q.module &&
            c.topic === q.topic
        )
        if (existing) {
          existing.questions.push(q)
          existing.questionCount++
        } else {
          grouped.push({
            id: `${q.category}-${q.year}-${q.subject}-${q.module}-${q.topic}`,
            category: q.category,
            year: q.year,
            subject: q.subject,
            module: q.module,
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
    { title: "Active Modules", value: dashboardData?.overview?.totalModules || safeModules.length, icon: FolderOpen, action: "modules" },
    { title: "Topics Created", value: dashboardData?.overview?.totalTopics || safeTopics.length, icon: FileText, action: "topics" },
    { title: "Complete Content", value: completeContent.length, icon: HelpCircle, action: "questions" },
  ]

  return (
    <div className="space-y-6">

      {/* WELCOME */}
      {dashboardData?.welcome && (
        <Card className="bg-primary text-white">
          <CardContent className="p-6">
           <div className="absolute top-0 right-0 w-[80px] h-[80px]  bg-white/30 rounded-full -mr-[0px] mt-[160px]"></div> 

          </CardContent>
        </Card>
      )}

      {/* API STATS */}
      {dashboardData && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6 mt-20">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview?.totalStudents || 0}</div>
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
        </div>
      )}

      {/* LOCAL + API STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* COMPLETE CONTENT */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Content Overview</CardTitle>
          <CardDescription>
            All content packages with Category, Year, Subject, Module, Topic, and Questions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {completeContent.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="size-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No complete content yet</p>
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
                    <p><b>Module:</b> {content.module}</p>
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
