// import {
//     BookOpen,
//     FolderOpen,
//     FileText,
//     HelpCircle,
//     Users,
//   } from "lucide-react"
//   import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card"
//   import { Badge } from "@/components/ui/badge"
//   import { Separator } from "@/components/ui/separator"
//   import useTutorStore from "@/store/tutorStore"
//   import { useEffect } from "react"




  
//   export default function DashboardOverview({
//     context,
//     setActiveTab,
//     subjects,
//     modules,
//     topics,
//     questions,
//     dashboardStats,
//   }) {
//     const completeContent = []

//     const { fetchDashboard, dashboardData, loading } = useTutorStore()

//     useEffect(() => {
//       fetchDashboard()
//     }, [])
  
//     questions.forEach((question) => {
//       if (
//         question.category?.toLowerCase() === context.examBody &&
//         question.year === context.year
//       ) {
//         const existing = completeContent.find(
//           (c) =>
//             c.category === question.category &&
//             c.year === question.year &&
//             c.subject === question.subject &&
//             c.module === question.module &&
//             c.topic === question.topic
//         )
  
//         if (existing) {
//           existing.questions.push(question)
//           existing.questionCount++
//         } else {
//           completeContent.push({
//             id: `${question.category}-${question.year}-${question.subject}-${question.module}-${question.topic}`,
//             category: question.category,
//             year: question.year,
//             subject: question.subject,
//             module: question.module,
//             topic: question.topic,
//             questions: [question],
//             questionCount: 1,
//           })
//         }
//       }
//     })
  
//     const stats = [
//       { title: "Total Subjects", value: subjects.length, icon: BookOpen, action: "subjects" },
//       { title: "Active Modules", value: modules.length, icon: FolderOpen, action: "modules" },
//       { title: "Topics Created", value: topics.length, icon: FileText, action: "topics" },
//       { title: "Complete Content", value: completeContent.length, icon: HelpCircle, action: "questions" },
//     ]
  
//     return (
//       <div className="space-y-6">
  
//         {/* API Stats */}
//         {dashboardStats && (
//           <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
//                 <Users className="size-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{dashboardStats.totalStudents || 0}</div>
//               </CardContent>
//             </Card>
  
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">Total Questions</CardTitle>
//                 <HelpCircle className="size-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{dashboardStats.totalQuestions || 0}</div>
//               </CardContent>
//             </Card>
//           </div>
//         )}
  
//         {/* Stat Cards */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat, i) => (
//             <Card
//               key={i}
//               className="cursor-pointer hover:shadow-md transition"
//               onClick={() => setActiveTab(stat.action)}
//             >
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <stat.icon className="size-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
  
//         {/* Complete Content */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Complete Content Overview</CardTitle>
//             <CardDescription>
//               All content packages with Category, Year, Subject, Module, Topic, and Questions
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {completeContent.length === 0 ? (
//               <div className="text-center py-12">
//                 <HelpCircle className="size-16 mx-auto text-muted-foreground/30 mb-4" />
//                 <p className="text-muted-foreground text-lg">No complete content yet</p>
//               </div>
//             ) : (
//               <div className="grid gap-4 md:grid-cols-2">
//                 {completeContent.map((content) => (
//                   <Card key={content.id}>
//                     <CardHeader className="pb-3">
//                       <Badge variant="secondary">
//                         {content.category?.toUpperCase()} • {content.year}
//                       </Badge>
//                       <CardTitle className="text-lg mt-2">{content.subject}</CardTitle>
//                     </CardHeader>
  
//                     <CardContent className="space-y-2 text-sm">
//                       <p><b>Module:</b> {content.module}</p>
//                       <p><b>Topic:</b> {content.topic}</p>
//                       <Separator />
//                       <div className="flex justify-between items-center">
//                         <span>Questions</span>
//                         <Badge>{content.questionCount}</Badge>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }
  


import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, FolderOpen, FileText, HelpCircle, Users } from "lucide-react"
import useTutorStore from "@/store/tutorStore"

export default function DashboardOverview({ context, setActiveTab, subjects, modules, topics, questions }) {

  const { fetchDashboard, dashboardData, loading } = useTutorStore()

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // Compute complete content
  const completeContent = []

  questions.forEach((question) => {
    if (
      question.category?.toLowerCase() === context.examBody &&
      question.year === context.year
    ) {
      const existing = completeContent.find(
        (c) =>
          c.category === question.category &&
          c.year === question.year &&
          c.subject === question.subject &&
          c.module === question.module &&
          c.topic === question.topic
      )

      if (existing) {
        existing.questions.push(question)
        existing.questionCount++
      } else {
        completeContent.push({
          id: `${question.category}-${question.year}-${question.subject}-${question.module}-${question.topic}`,
          category: question.category,
          year: question.year,
          subject: question.subject,
          module: question.module,
          topic: question.topic,
          questions: [question],
          questionCount: 1,
        })
      }
    }
  })

  const stats = [
    { title: "Total Subjects", value: subjects.length, icon: BookOpen, action: "subjects" },
    { title: "Active Modules", value: modules.length, icon: FolderOpen, action: "modules" },
    { title: "Topics Created", value: topics.length, icon: FileText, action: "topics" },
    { title: "Complete Content", value: completeContent.length, icon: HelpCircle, action: "questions" },
  ]

  return (
    <div className="space-y-6">

      {/* API Stats */}
      {dashboardData && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalStudents || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Questions</CardTitle>
              <HelpCircle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalQuestions || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => setActiveTab(stat.action)}
          >
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

      {/* Complete Content */}
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
                    <Badge variant="secondary">
                      {content.category?.toUpperCase()} • {content.year}
                    </Badge>
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
