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
