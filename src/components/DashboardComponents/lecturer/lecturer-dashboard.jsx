import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import fillopLogo from "../../../assets/images/fillopsLogo.png"
import AnalyticsPanel from "@/components/DashboardComponents/lecturer/analytics-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Users,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  Loader2,
  Plus
} from "lucide-react"

import { ThemeToggle } from "../../DashboardComponents/theme-toggle"
import SubjectsPanel from "@/components/DashboardComponents/lecturer/subjects-panel"
import TopicsPanel from "@/components/DashboardComponents/lecturer/topics-panel"
import QuestionsPanel from "@/components/DashboardComponents/lecturer/questions-panel"
import SettingsPage from "@/pages/lecturer/SettingsPage"
import DashboardOverview from "@/components/DashboardComponents/lecturer/DashboardOverview"

import useTutorAuthStore from "@/store/tutorAuthStore"
import useTutorStore from "@/store/tutorStore"

const EXAM_BODIES = [
  { id: "all-catigories", label: "AllCategories", color: "bg-pink-500/10 text-blue-600 dark:text-blue-400" },
  { id: "jamb", label: "JAMB", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "waec", label: "WAEC", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "neco", label: "NECO", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "putme", label: "Post-UTME", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
]

const COLOR_OPTIONS = [
  { value: "all", label: "All Colors", color: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" },
  { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
  { value: "bg-emerald-500", label: "Green", color: "bg-emerald-500" },
  { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
  { value: "bg-amber-500", label: "Amber", color: "bg-amber-500" },
  { value: "bg-red-500", label: "Red", color: "bg-red-500" },
  { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
]

export default function LecturerDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Auth
  const tutor = useTutorAuthStore((state) => state.tutor)
  const logout = useTutorAuthStore((state) => state.logout)
  const updateProfile = useTutorAuthStore((state) => state.updateProfile)
  const changePassword = useTutorAuthStore((state) => state.changePassword)

  // Tutor Store
  const {
    fetchDashboard,
    dashboardData,
  } = useTutorStore()

  // State
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedExamBody, setSelectedExamBody] = useState("all-catigories") // ✅ Default to "all-catigories"
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedColor, setSelectedColor] = useState("all")
  const [availableYears, setAvailableYears] = useState([])
  const [loadingYears, setLoadingYears] = useState(true)
  const [globalSearch, setGlobalSearch] = useState("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // State for selected subject (for topics panel)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedSubjectName, setSelectedSubjectName] = useState("")

  // State for selected topic (for questions panel)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [selectedTopicName, setSelectedTopicName] = useState("")

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "topics", label: "Topics", icon: FileText },
    { id: "questions", label: "Questions Bank", icon: HelpCircle },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Generate years dynamically
  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = 1; i >= -10; i--) years.push((currentYear + i).toString())
    return years
  }

  // Initialize dashboard
  useEffect(() => {
    if (!tutor) return
    const initDashboard = async () => {
      try {
        setLoadingYears(true)
        const years = generateYears()
        setAvailableYears(years)
        setSelectedYear(years[1]) // current year
        await fetchDashboard()
      } catch (error) {
        console.error("Dashboard init error:", error)
        toast({ title: "Warning", description: "Some features may be limited", variant: "destructive" })
      } finally {
        setLoadingYears(false)
      }
    }
    initDashboard()
  }, [tutor, fetchDashboard, toast])

  // Handler for when a subject is selected from SubjectsPanel
  const handleSubjectSelect = (subjectId, subjectName) => {
    console.log("📌 Subject selected:", { subjectId, subjectName })
    setSelectedSubjectId(subjectId)
    setSelectedSubjectName(subjectName)
    setActiveTab("topics") // Switch to topics tab
  }

  // Handler for when a topic is selected from TopicsPanel
  const handleTopicSelect = (topicId, topicName) => {
    console.log("📌 Topic selected for questions:", { topicId, topicName })
    setSelectedTopicId(topicId)
    setSelectedTopicName(topicName)
    setActiveTab("questions") // Switch to questions tab
  }

  const handleLogout = async () => {
    await logout()
    navigate("/tutor/login")
    toast({ title: "Logged out", description: "You have been successfully logged out" })
  }

  // Handler for Create button
  const handleCreateClick = () => {
    setActiveTab("subjects")
  }

  const context = useMemo(() => ({
    examBody: selectedExamBody,
    year: selectedYear,
    color: selectedColor,
    updateProfile,
    changePassword,
  }), [selectedExamBody, selectedYear, selectedColor, updateProfile, changePassword])

  // Loading UI
  if (loadingYears) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex min-h-screen bg-background font-sans">
        {/* SIDEBAR */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col border-r shadow-xl transform transition-transform duration-300 lg:translate-x-0",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex justify-end p-4 md:hidden">
            <Button variant="ghost" className="p-2" onClick={() => setMobileSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center p-2">
            <img src={fillopLogo} alt="Fillop Logo" className="w-12 h-12 object-contain" />
            <div className="leading-none mx-4 md:ml-2">
              <p className="text-primary font-bold font-merriweather text-xl">FILLOP TECH</p>
              <p className="text-education-orange text-[9px] font-merriweather">...simplifying your tech world</p>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-3 font-medium rounded-xl transition-all", isActive ? "bg-primary text-gray-100 hover:text-gray-700" : "text-gray-700")}
                    onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false) }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border">
                <AvatarImage 
                    src={tutor?.avatar || tutor?.profileImage || ""} 
                    alt="User"
                  />
                <AvatarFallback>{tutor?.firstName?.[0]}{tutor?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="truncate text-sm font-semibold">{tutor?.firstName} {tutor?.lastName}</span>
                <span className="truncate text-xs text-gray-600">{tutor?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-red-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
          <header className="sticky top-0 z-50 h-16 flex items-center border-b bg-background/80 px-3 sm:px-6 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="ghost"
                className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md lg:hidden"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
              <ThemeToggle />

              <div className="flex items-center gap-2 bg-secondary/40 p-1 rounded-xl border flex-1 sm:flex-none">
                {/* Exam Body Filter */}
                <Select value={selectedExamBody} onValueChange={setSelectedExamBody}>
                  <SelectTrigger className="h-8 min-w-[70px] sm:w-[110px]">
                    <SelectValue placeholder="Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_BODIES.map((body) => (
                      <SelectItem key={body.id} value={body.id}>{body.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Separator orientation="vertical" className="h-5 hidden sm:flex" />
                
                {/* Year Filter - Disabled on subjects and topics tabs */}
                <Select 
                  value={selectedYear} 
                  onValueChange={setSelectedYear}
                  disabled={activeTab === "subjects" || activeTab === "topics"} // ✅ Disable year filter on subjects and topics tabs
                >
                  <SelectTrigger className="h-8 min-w-[55px] sm:w-[90px]">
                    <SelectValue placeholder="Yr" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-5 hidden sm:flex" />
                
                {/* Color Filter */}
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="h-8 min-w-[50px] sm:w-[100px]">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${COLOR_OPTIONS.find(c => c.value === selectedColor)?.color}`} />
                        <span className="hidden sm:inline">{COLOR_OPTIONS.find(c => c.value === selectedColor)?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 hidden sm:flex relative">
                <Input
                  type="search"
                  placeholder="Search anything..."
                  className="w-full rounded-full pl-10"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
              </Button>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="flex-1 overflow-auto bg-secondary/20 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <div>
             <h2 className="text-3xl text-primary font-bold mb-2">
                  {tutor?.firstName 
                    ? `Welcome back, ${tutor.firstName}!` 
                    : dashboardData?.welcome?.message || 'Welcome back!'}
                </h2>

                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    {activeTab !== "settings" ? (
                      <>Manage {navItems.find((item) => item.id === activeTab)?.label.toLowerCase()} for 
                      <span className="font-semibold text-red-300">
                        {" "}{EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label}
                      </span>
                      {activeTab !== "subjects" && activeTab !== "topics" && (
                        <> • <span className="font-semibold">{selectedYear} Academic Session</span></>
                      )}
                      </>
                    ) : "Configure your profile and preferences"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab !== "settings" && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-xl shadow-sm">
                      <Badge>{EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label}</Badge>
                      {activeTab !== "subjects" && activeTab !== "topics" && <Badge variant="secondary">{selectedYear}</Badge>}
                      {selectedColor !== "all" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <div className={`h-3 w-3 rounded-full ${selectedColor}`} />
                          {COLOR_OPTIONS.find(c => c.value === selectedColor)?.label}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* CREATE BUTTON - Only show on overview */}
                  {activeTab === "overview" && (
                    <Button 
                      onClick={handleCreateClick}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create
                    </Button>
                  )}
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "overview" && (
                  <DashboardOverview
                    context={context}
                    setActiveTab={setActiveTab}
                  />
                )}
                
                {activeTab === "subjects" && (
                  <SubjectsPanel 
                    onSubjectSelect={handleSubjectSelect}
                    examBody={selectedExamBody}
                    year={selectedYear}
                    color={selectedColor}
                    globalSearch={globalSearch}
                  />
                )}
                
                {activeTab === "topics" && (
                  <TopicsPanel 
                    selectedSubject={selectedSubjectId}
                    subjectName={selectedSubjectName}
                    onTopicSelect={handleTopicSelect}
                    examBody={selectedExamBody}
                    year={selectedYear}
                    color={selectedColor}
                    globalSearch={globalSearch}
                  />
                )}
                
                {activeTab === "questions" && (
                  <QuestionsPanel 
                    selectedTopic={selectedTopicId}
                    topicName={selectedTopicName}
                    subjectName={selectedSubjectName}
                    examBody={selectedExamBody}
                    year={selectedYear}
                    color={selectedColor}
                    globalSearch={globalSearch}
                  />
                )}
                
                {activeTab === "settings" && <SettingsPage context={context} />}
                {activeTab === "analytics" && <AnalyticsPanel />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}