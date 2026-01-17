// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { 
//   Search, 
//   Users, 
//   BookOpen, 
//   TrendingUp, 
//   Filter,
//   Loader2,
//   Mail,
//   Calendar,
//   Award,
//   GraduationCap,
//   BarChart3,
//   PieChart
// } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// export default function AnalyticsPanel({ subjects }) {
//   const { toast } = useToast()
//   const { getSubjectEnrolledStudents, loading } = useTutorStore()

//   const [selectedSubject, setSelectedSubject] = useState(null)
//   const [enrolledStudents, setEnrolledStudents] = useState([])
//   const [localSearch, setLocalSearch] = useState("")
//   const [loadingStudents, setLoadingStudents] = useState(false)
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     activeStudents: 0,
//     completionRate: 0,
//     averageProgress: 0
//   })

//   // Load first subject on mount
//   useEffect(() => {
//     if (subjects && subjects.length > 0 && !selectedSubject) {
//       setSelectedSubject(subjects[0])
//     }
//   }, [subjects])

//   // Fetch enrolled students when subject changes
//   useEffect(() => {
//     if (selectedSubject) {
//       loadEnrolledStudents()
//     }
//   }, [selectedSubject])

//     const loadEnrolledStudents = async () => {
//       if (!selectedSubject) return;

//       setLoadingStudents(true);

//       try {
//         const subjectId = selectedSubject.subjectId || selectedSubject.id;

//         const result = await getSubjectEnrolledStudents(subjectId);

//         if (!result.success) {
//           toast({
//             title: "Error",
//             description: result.message,
//             variant: "destructive",
//           });
//           setEnrolledStudents([]);
//           return;
//         }

//         const students = result.data?.students || result.data || [];

//         setEnrolledStudents(students);

//         const totalStudents = students.length;
//         const activeStudents = students.filter(s => s.status === "active").length;
//         const totalProgress = students.reduce((sum, s) => sum + (s.progress || 0), 0);

//         const averageProgress = totalStudents
//           ? Math.round(totalProgress / totalStudents)
//           : 0;

//         const completionRate = totalStudents
//           ? Math.round(students.filter(s => (s.progress || 0) >= 100).length / totalStudents * 100)
//           : 0;

//         setStats({
//           totalStudents,
//           activeStudents,
//           completionRate,
//           averageProgress,
//         });

//         console.log("✅ Tutor subject students loaded:", students);

//       } catch (error) {
//         console.error("❌ Analytics error:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load enrolled students",
//           variant: "destructive",
//         });
//       } finally {
//         setLoadingStudents(false);
//       }
//     };


//   // Filter students based on search
//   const filteredStudents = enrolledStudents.filter((student) => {
//     if (!localSearch) return true
//     const searchLower = localSearch.toLowerCase()
//     return (
//       (student.firstName || "").toLowerCase().includes(searchLower) ||
//       (student.lastName || "").toLowerCase().includes(searchLower) ||
//       (student.email || "").toLowerCase().includes(searchLower) ||
//       (student.studentId || "").toLowerCase().includes(searchLower)
//     )
//   })

//   const handleSubjectChange = (subjectId) => {
//     const subject = subjects.find(s => (s.subjectId || s.id) === subjectId)
//     if (subject) {
//       setSelectedSubject(subject)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Subject Selector */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div className="flex-1">
//           <h2 className="text-xl font-bold flex items-center gap-2">
//             <BarChart3 className="size-6 text-primary" />
//             Student Enrollment Analytics
//           </h2>
//           <p className="text-sm text-muted-foreground mt-1">
//             View and analyze student enrollment across your subjects
//           </p>
//         </div>

//         <div className="flex items-center gap-2 w-full sm:w-auto">
//           <Select 
//             value={selectedSubject ? (selectedSubject.subjectId || selectedSubject.id) : ""} 
//             onValueChange={handleSubjectChange}
//           >
//             <SelectTrigger className="w-full sm:w-[250px]">
//               <SelectValue placeholder="Select a subject" />
//             </SelectTrigger>
//             <SelectContent className="bg-background/95 backdrop-blur-sm border-border">
//               {subjects && subjects.length > 0 ? (
//                 subjects.map((subject) => (
//                   <SelectItem 
//                     key={subject.subjectId || subject.id} 
//                     value={subject.subjectId || subject.id}
//                   >
//                     {subject.subjectName || subject.name} ({subject.subjectCode || subject.code})
//                   </SelectItem>
//                 ))
//               ) : (
//                 <SelectItem value="no-subjects" disabled>
//                   No subjects available
//                 </SelectItem>
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       {selectedSubject && (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Students
//                 </CardTitle>
//                 <Users className="size-4 text-blue-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalStudents}</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Enrolled in this subject
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Active Students
//                 </CardTitle>
//                 <TrendingUp className="size-4 text-green-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.activeStudents}</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Currently active learners
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Avg. Progress
//                 </CardTitle>
//                 <PieChart className="size-4 text-purple-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.averageProgress}%</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Average completion rate
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Completion Rate
//                 </CardTitle>
//                 <Award className="size-4 text-amber-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.completionRate}%</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Students who completed
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Search Bar */}
//       {selectedSubject && enrolledStudents.length > 0 && (
//         <div className="flex items-center gap-2">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search students..."
//               className="pl-9 bg-background"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>
//           <Badge variant="secondary">
//             {filteredStudents.length} of {enrolledStudents.length}
//           </Badge>
//         </div>
//       )}

//       {/* Students List */}
//       {selectedSubject ? (
//         loadingStudents ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//               <p className="text-muted-foreground text-center">Loading enrolled students...</p>
//             </CardContent>
//           </Card>
//         ) : filteredStudents.length > 0 ? (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {filteredStudents.map((student) => (
//               <Card 
//                 key={student.userId || student.id || student.studentId} 
//                 className="hover:shadow-lg transition-shadow"
//               >
//                 <CardHeader className="pb-3">
//                   <div className="flex items-start gap-3">
//                     <Avatar className="size-12 border-2 border-primary/20">
//                       <AvatarImage src={student.avatar || student.profilePicture} />
//                       <AvatarFallback className="bg-primary/10 text-primary font-semibold">
//                         {student.firstName?.[0]}{student.lastName?.[0]}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <CardTitle className="text-base truncate">
//                         {student.firstName} {student.lastName}
//                       </CardTitle>
//                       <CardDescription className="flex items-center gap-1 text-xs mt-1">
//                         <Mail className="size-3" />
//                         <span className="truncate">{student.email}</span>
//                       </CardDescription>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   {/* Progress Bar */}
//                   {student.progress !== undefined && (
//                     <div className="space-y-1">
//                       <div className="flex items-center justify-between text-xs">
//                         <span className="text-muted-foreground">Progress</span>
//                         <span className="font-semibold">{student.progress || 0}%</span>
//                       </div>
//                       <div className="h-2 bg-secondary rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
//                           style={{ width: `${student.progress || 0}%` }}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <Separator />

//                   {/* Student Details */}
//                   <div className="grid grid-cols-2 gap-2 text-xs">
//                     {student.studentId && (
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Student ID</p>
//                         <p className="font-mono font-semibold">{student.studentId}</p>
//                       </div>
//                     )}
//                     {student.enrolledDate && (
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Enrolled</p>
//                         <p className="font-semibold">
//                           {new Date(student.enrolledDate).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                     )}
//                     {student.status && (
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Status</p>
//                         <Badge 
//                           variant={student.status === 'active' ? 'default' : 'secondary'}
//                           className="text-xs"
//                         >
//                           {student.status}
//                         </Badge>
//                       </div>
//                     )}
//                     {student.lastActive && (
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Last Active</p>
//                         <p className="font-semibold text-xs">
//                           {new Date(student.lastActive).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <GraduationCap className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center">
//                 {localSearch 
//                   ? "No students match your search criteria" 
//                   : "No students enrolled in this subject yet"}
//               </p>
//               {localSearch && (
//                 <Button 
//                   variant="outline" 
//                   className="mt-4"
//                   onClick={() => setLocalSearch("")}
//                 >
//                   Clear Search
//                 </Button>
//               )}
//             </CardContent>
//           </Card>
//         )
//       ) : (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
//             <p className="text-muted-foreground text-center">
//               {subjects && subjects.length > 0 
//                 ? "Select a subject to view enrolled students" 
//                 : "No subjects available. Create a subject first."}
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }




import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  PieChart
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPanel({ subjects }) {
  const { toast } = useToast()
  const { getSubjectEnrolledStudents } = useTutorStore()

  const [selectedSubject, setSelectedSubject] = useState(null)
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [localSearch, setLocalSearch] = useState("")
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completionRate: 0,
    averageProgress: 0
  })

  // ---------------- LOAD STUDENTS ----------------
  const loadEnrolledStudents = async () => {
    if (!selectedSubject) return

    setLoadingStudents(true)

    try {
      const subjectId = String(selectedSubject.subjectId || selectedSubject.id)

      const result = await getSubjectEnrolledStudents(subjectId)

      console.log("📦 API RESULT:", result)

      if (!result?.success) {
        toast({
          title: "Error",
          description: result?.message || "Failed to load students",
          variant: "destructive",
        })
        setEnrolledStudents([])
        return
      }

      const students = result.data?.students || result.data || []

      setEnrolledStudents(students)

      const totalStudents = students.length
      const activeStudents = students.filter(s => s.status === "active").length
      const totalProgress = students.reduce((sum, s) => sum + (s.progress || 0), 0)

      const averageProgress = totalStudents
        ? Math.round(totalProgress / totalStudents)
        : 0

      const completionRate = totalStudents
        ? Math.round(students.filter(s => (s.progress || 0) >= 100).length / totalStudents * 100)
        : 0

      setStats({
        totalStudents,
        activeStudents,
        completionRate,
        averageProgress,
      })

    } catch (error) {
      console.error("❌ Analytics error:", error)
      toast({
        title: "Error",
        description: "Failed to load enrolled students",
        variant: "destructive",
      })
    } finally {
      setLoadingStudents(false)
    }
  }

  // ---------------- AUTO SELECT FIRST SUBJECT ----------------
  useEffect(() => {
    if (subjects?.length && !selectedSubject) {
      setSelectedSubject(subjects[0])
    }
  }, [subjects])

  // ---------------- LOAD WHEN SUBJECT CHANGES ----------------
  useEffect(() => {
    if (selectedSubject) {
      loadEnrolledStudents()
    }
  }, [selectedSubject])

  // ---------------- FILTER ----------------
  const filteredStudents = enrolledStudents.filter(student => {
    if (!localSearch) return true
    const q = localSearch.toLowerCase()
    return (
      (student.firstName || "").toLowerCase().includes(q) ||
      (student.lastName || "").toLowerCase().includes(q) ||
      (student.email || "").toLowerCase().includes(q) ||
      (student.studentId || "").toLowerCase().includes(q)
    )
  })

  const handleSubjectChange = (subjectId) => {
    const subject = subjects.find(
      s => String(s.subjectId || s.id) === subjectId
    )
    if (subject) setSelectedSubject(subject)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="size-6 text-primary" />
            Student Enrollment Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            View and analyze student enrollment across your subjects
          </p>
        </div>

        <Select
          value={selectedSubject ? String(selectedSubject.subjectId || selectedSubject.id) : ""}
          onValueChange={handleSubjectChange}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects?.length ? subjects.map(subject => (
              <SelectItem
                key={subject.subjectId || subject.id}
                value={String(subject.subjectId || subject.id)}
              >
                {subject.subjectName || subject.name}
              </SelectItem>
            )) : (
              <SelectItem value="none" disabled>No subjects</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* STATS */}
      {selectedSubject && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={stats.totalStudents} Icon={Users} />
          <StatCard title="Active Students" value={stats.activeStudents} Icon={TrendingUp} />
          <StatCard title="Avg Progress" value={`${stats.averageProgress}%`} Icon={PieChart} />
          <StatCard title="Completion Rate" value={`${stats.completionRate}%`} Icon={Award} />
        </div>
      )}

      {/* SEARCH */}
      {selectedSubject && enrolledStudents.length > 0 && (
        <div className="flex gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search students..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <Badge>{filteredStudents.length}/{enrolledStudents.length}</Badge>
        </div>
      )}

      {/* STUDENTS */}
      {loadingStudents ? (
        <Card><CardContent className="py-12 text-center"><Loader2 className="animate-spin mx-auto" /></CardContent></Card>
      ) : filteredStudents.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map(student => (
            <Card key={student.id || student.studentId}>
              <CardHeader className="flex gap-3">
                <Avatar>
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{student.firstName} {student.lastName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="size-3" /> {student.email}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Progress: {student.progress || 0}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="mx-auto mb-4 text-muted-foreground" />
            <p>No students found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ---------------- SMALL CARD COMPONENT ----------------
function StatCard({ title, value, Icon }) {
  return (
    <Card>
      <CardHeader className="pb-3 flex justify-between">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <Icon className="size-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
