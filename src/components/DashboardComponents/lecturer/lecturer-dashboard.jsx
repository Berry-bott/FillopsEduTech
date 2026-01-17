// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   BookOpen,
//   FolderOpen,
//   FileText,
//   HelpCircle,
//   Search,
//   Settings,
//   LayoutDashboard,
//   Bell,
//   Users,
//   BarChart3,
//   Menu,
//   X,
//   Loader2
// } from "lucide-react"
// import fillopLogo from "../../../assets/images/fillopsLogo.png"
// import { ThemeToggle } from "../../DashboardComponents/theme-toggle"
// import SubjectsPanel from "@/components/DashboardComponents/lecturer/subjects-panel"
// import ModulesPanel from "@/components/DashboardComponents/lecturer/modules-panel"
// import TopicsPanel from "@/components/DashboardComponents/lecturer/topics-panel"
// import QuestionsPanel from "@/components/DashboardComponents/lecturer/questions-panel"
// import SettingsPage from "@/pages/lecturer/SettingsPage"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { cn } from "@/lib/utils"
// import useTutorAuthStore from "@/store/tutorAuthStore"
// import useTutorStore from "@/store/tutorStore"
// import { useToast } from "@/components/ui/use-toast"
// import { useNavigate } from "react-router-dom"
// import DashboardOverview from "@/components/DashboardComponents/lecturer/DashboardOverview"

// const EXAM_BODIES = [
//   { id: "jamb", label: "JAMB", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
//   { id: "waec", label: "WAEC", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
//   { id: "neco", label: "NECO", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
//   { id: "putme", label: "Post-UTME", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
// ]

// export default function LecturerDashboard() {
//   const navigate = useNavigate()
//   const { toast } = useToast()
//   // ✅ Auth data from tutorAuthStore
//   const tutor = useTutorAuthStore((state) => state.tutor)
//   const isAuthenticated = useTutorAuthStore((state) => state.isAuthenticated)
//   const logout = useTutorAuthStore((state) => state.logout)
//   const updateProfile = useTutorAuthStore((state) => state.updateProfile)
//   const changePassword = useTutorAuthStore((state) => state.changePassword)
  
//   // ✅ Operations from tutorStore
//   const { 
//     fetchDashboard, 
//     getSubjects, 
//     getModules, 
//     getTopics, 
//     getQuestions,
//   } = useTutorStore()

  
  
//   const [activeTab, setActiveTab] = useState("overview")
//   const [selectedExamBody, setSelectedExamBody] = useState("jamb")
//   const [selectedYear, setSelectedYear] = useState("")
//   const [availableYears, setAvailableYears] = useState([])
//   const [loadingYears, setLoadingYears] = useState(true)
//   const [loadingData, setLoadingData] = useState(false)
//   const [globalSearch, setGlobalSearch] = useState("")
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

//   const [subjects, setSubjects] = useState([])
//   const [modules, setModules] = useState([])
//   const [topics, setTopics] = useState([])
//   const [questions, setQuestions] = useState([])
//   const [dashboardStats, setDashboardStats] = useState(null)

//   // 🔥 Generate years dynamically based on current year
//   const generateYears = () => {
//     const currentYear = new Date().getFullYear()
//     const years = []
    
//     // Generate years: current year + 1 future year + 10 past years
//     for (let i = 1; i >= -10; i--) {
//       years.push((currentYear + i).toString())
//     }
    
//     return years
//   }

//   // 🔥 Fetch dashboard data and initialize
//   useEffect(() => {
//     const initializeDashboard = async () => {
//       try {
//         console.log("🚀 Starting dashboard initialization...")
//         setLoadingYears(true)
        
//         // Try to fetch dashboard stats (optional - don't fail if it doesn't work)
//         try {
//           console.log("📊 Fetching dashboard stats...")
//           const dashboardResult = await fetchDashboard()
//           console.log("📊 Dashboard result:", dashboardResult)
          
//           if (dashboardResult?.success) {
//             setDashboardStats(dashboardResult.data)
//             console.log("✅ Dashboard stats loaded:", dashboardResult.data)
//           } else {
//             console.warn("⚠️ Dashboard stats not available:", dashboardResult?.message)
//           }
//         } catch (dashError) {
//           console.warn("⚠️ Failed to load dashboard stats (non-critical):", dashError)
//         }

//         // Generate dynamic years
//         console.log("📅 Generating years...")
//         const dynamicYears = generateYears()
//         setAvailableYears(dynamicYears)
//         setSelectedYear(dynamicYears[1]) // Set to current year (index 1 because we include +1 future year)
        
//         console.log("✅ Dashboard initialized with years:", dynamicYears)
//       } catch (error) {
//         console.error("❌ Error initializing dashboard:", error)
//         toast({
//           title: "Warning",
//           description: "Some dashboard features may be limited",
//           variant: "destructive"
//         })
//         const dynamicYears = generateYears()
//         setAvailableYears(dynamicYears)
//         setSelectedYear(dynamicYears[1])
//       } finally {
//         console.log("🏁 Setting loadingYears to false")
//         setLoadingYears(false)
//       }
//     }

//     if (tutor) {
//       console.log("👤 Tutor found:", tutor)
//       initializeDashboard()
//     } else {
//       console.log("❌ No tutor found")
//     }
//   }, [tutor, toast])

//   // 🔥 Fetch content based on selected filters
//   useEffect(() => {
//     const fetchContentData = async () => {
//       if (!selectedExamBody || !selectedYear) return

//       try {
//         setLoadingData(true)

//         // Fetch all content in parallel
//         const [subjectsRes, modulesRes, topicsRes, questionsRes] = await Promise.all([
//           getSubjects(),
//           getModules(),
//           getTopics(),
//           getQuestions({ category: selectedExamBody.toUpperCase(), year: selectedYear })
//         ])

//         // Filter subjects by exam body and year
//         if (subjectsRes?.success) {
//           const filteredSubjects = (subjectsRes.data || []).filter(
//             s => s.category?.toLowerCase() === selectedExamBody && s.year === selectedYear
//           )
//           setSubjects(filteredSubjects)
//         }

//         // Set modules
//         if (modulesRes?.success) {
//           setModules(modulesRes.data || [])
//         }

//         // Set topics
//         if (topicsRes?.success) {
//           setTopics(topicsRes.data || [])
//         }

//         // Set questions
//         if (questionsRes?.success) {
//           setQuestions(questionsRes.data || [])
//         }

//         console.log("✅ Content data loaded")
//       } catch (error) {
//         console.error("❌ Error fetching content:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load content data",
//           variant: "destructive"
//         })
//       } finally {
//         setLoadingData(false)
//       }
//     }

//     fetchContentData()
//   }, [selectedExamBody, selectedYear, getSubjects, getModules, getTopics, getQuestions, toast])

//   // 🔥 Refresh data after content changes
//   const refreshData = async () => {
//     try {
//       const [subjectsRes, modulesRes, topicsRes, questionsRes] = await Promise.all([
//         getSubjects(),
//         getModules(),
//         getTopics(),
//         getQuestions({ category: selectedExamBody.toUpperCase(), year: selectedYear })
//       ])

//       if (subjectsRes?.success) {
//         const filteredSubjects = (subjectsRes.data || []).filter(
//           s => s.category?.toLowerCase() === selectedExamBody && s.year === selectedYear
//         )
//         setSubjects(filteredSubjects)
//       }

//       if (modulesRes?.success) setModules(modulesRes.data || [])
//       if (topicsRes?.success) setTopics(topicsRes.data || [])
//       if (questionsRes?.success) setQuestions(questionsRes.data || [])
      
//       console.log("✅ Data refreshed")
//     } catch (error) {
//       console.error("❌ Error refreshing data:", error)
//     }
//   }

//   // 🔥 Handle logout
//   const handleLogout = async () => {
//     await logout()
//     navigate("/tutor/login")
//     toast({
//       title: "Logged out",
//       description: "You have been successfully logged out"
//     })
//   }

//   const context = {
//     examBody: selectedExamBody,
//     year: selectedYear,
//     refreshData,
//     updateProfile, // ✅ Pass to settings
//     changePassword, // ✅ Pass to settings
//   }

//   const navItems = [
//     { id: "overview", label: "Overview", icon: LayoutDashboard },
//     { id: "subjects", label: "Subjects", icon: BookOpen },
//     { id: "modules", label: "Modules", icon: FolderOpen },
//     { id: "topics", label: "Topics", icon: FileText },
//     { id: "questions", label: "Questions Bank", icon: HelpCircle },
//     { id: "students", label: "Students", icon: Users },
//     { id: "analytics", label: "Analytics", icon: BarChart3 },
//     { id: "settings", label: "Settings", icon: Settings },
//   ]

//   // Show loading state while fetching years
//   if (loadingYears) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="text-center space-y-4">
//           <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
//           <p className="text-muted-foreground">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   // Show loading overlay while fetching content data
//   const showLoadingOverlay = loadingData && (
//     <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
//       <div className="text-center space-y-4">
//         <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
//         <p className="text-muted-foreground">Loading content...</p>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {showLoadingOverlay}
//       <div className="flex min-h-screen bg-background font-sans">
//         {/* SIDEBAR */}
//         <aside
//           className={cn(
//             "fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col border-r shadow-xl transform transition-transform duration-300 lg:translate-x-0 md:border-2",
//             "bg-gradient-to-b from-indigo-600/20 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900",
//             mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           )}
//         >
//           {/* CLOSE BUTTON FOR MOBILE */}
//           <div className="flex justify-end p-4 md:hidden">
//             <Button
//               variant="ghost"
//               className="p-2 bg-white/30 rounded-xl hover:bg-white/40"
//               onClick={() => setMobileSidebarOpen(false)}
//             >
//               <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
//             </Button>
//           </div>

//           {/* ===== Logo ===== */}
//           <div className="flex items-center p-2">
//             <img src={fillopLogo} alt="Fillop Logo" className="w-12 h-12 object-contain" />
//             <div className="leading-none mx-4 md:ml-2">
//               <p className="text-primary dark:text-primary text-xl md:text-[1rem] xmd:text-1xl lg:text-2xl font-bold font-merriweather">
//                 FILLOP TECH
//               </p>
//               <p className="text-[8px] md:text-[9px] xmd:text-[10.5px] lg:text-[] text-education-orange dark:text-education-orange font-merriweather ml-[0px] sm:ml-[0px] md:ml-[10px]">
//                 ....simplifying your tech world
//               </p>
//             </div>
//           </div>

//           {/* NAV LINKS */}
//           <ScrollArea className="flex-1 px-4 py-6">
//             <div className="space-y-1">
//               {navItems.map((item) => {
//                 const Icon = item.icon
//                 const isActive = activeTab === item.id

//                 return (
//                   <Button
//                     key={item.id}
//                     variant={isActive ? "secondary" : "ghost"}
//                     className={cn(
//                       "w-full justify-start gap-3 font-medium rounded-xl transition-all shadow-sm",
//                       "hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40",
//                       isActive
//                         ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
//                         : "text-gray-700 dark:text-gray-300"
//                     )}
//                     onClick={() => {
//                       setActiveTab(item.id)
//                       setMobileSidebarOpen(false)
//                     }}
//                   >
//                     <Icon className="w-5 h-5" />
//                     {item.label}
//                   </Button>
//                 )
//               })}
//             </div>
//           </ScrollArea>

//           {/* FOOTER USER AREA */}
//           <div className="p-4 border-t bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
//             <div className="flex items-center gap-3">
//               <Avatar className="w-10 h-10 border border-indigo-300 shadow-sm">
//                 <AvatarImage src="/placeholder.svg" alt="User" />
//                 <AvatarFallback className="bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
//                   {tutor?.firstName?.[0]}{tutor?.lastName?.[0]}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col overflow-hidden flex-1">
//                 <span className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
//                   {tutor?.firstName} {tutor?.lastName}
//                 </span>
//                 {/* ✅ Added email below name */}
//                 <span className="truncate text-xs text-gray-600 dark:text-gray-400">
//                   {tutor?.email}
//                 </span>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleLogout}
//                 className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
//               >
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </aside>

//         {/* MAIN AREA */}
//         <main className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
//           {/* HEADER */}
//           <header className="sticky top-0 z-50 h-16 flex items-center border-b bg-background/80 px-3 sm:px-6 backdrop-blur-md shadow-sm">

//           <div className="flex items-center gap-3 w-full">

//             {/* MENU BUTTON — TOGGLE BETWEEN MENU / X */}
//             <Button
//               variant="ghost"
//               className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 transition-all lg:hidden"
//               onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
//             >
//               {mobileSidebarOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </Button>
//               {/* Theme Toggle */}
//                 <ThemeToggle />
//             {/* SELECT GROUP */}
//             {!mobileSearchOpen && (
//               <div className="flex items-center gap-2 bg-secondary/40 p-1 rounded-xl border shadow-sm flex-1 sm:flex-none dark:bg-background">

//                 {/* EXAM BODY SMALLER */}
//                 <Select value={selectedExamBody} onValueChange={setSelectedExamBody}>
//                   <SelectTrigger className="h-8 min-w-[70px] sm:w-[110px] border-0 bg-transparent shadow-none font-semibold text-xs sm:text-sm  ">
//                     <SelectValue placeholder="Exam" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {EXAM_BODIES.map((body) => (
//                       <SelectItem key={body.id} value={body.id}>
//                         {body.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Separator orientation="vertical" className="h-5 hidden sm:flex" />

//                 {/* YEAR SMALLER - Now uses availableYears */}
//                 <Select value={selectedYear} onValueChange={setSelectedYear}>
//                   <SelectTrigger className="h-8 min-w-[55px] sm:w-[90px] border-0 bg-transparent shadow-none dark:bg-background font-semibold text-xs sm:text-sm">
//                     <SelectValue placeholder="Yr" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableYears.map((year) => (
//                       <SelectItem key={year} value={year}>
//                         {year}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {/* DESKTOP SEARCH */}
//             <div className="flex-1 hidden sm:flex relative dark:bg-background">
//               <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search anything..."
//                 className="w-full rounded-full bg-secondary/50 pl-10 shadow-sm dark:bg-background"
//                 value={globalSearch}
//                 onChange={(e) => setGlobalSearch(e.target.value)}
//               />
//             </div>

//             {/* 📱 MOBILE SEARCH EXPANDS FULL WIDTH */}
//             <div className="sm:hidden flex-1">
//               {!mobileSearchOpen ? (
//                 <button
//                   className="p-2 rounded-xl bg-secondary/40 border shadow-sm ml-auto dark:bg-background"
//                   onClick={() => setMobileSearchOpen(true)}
//                 >
//                   <Search className="w-5 h-5 text-muted-foreground" />
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-top-2">
//                   <Input
//                     autoFocus
//                     type="search"
//                     placeholder="Search..."
//                     className="w-full rounded-lg bg-secondary/40 pl-3 dark:bg-background"
//                     value={globalSearch}
//                     onChange={(e) => setGlobalSearch(e.target.value)}
//                   />
//                   <button
//                     onClick={() => setMobileSearchOpen(false)}
//                     className="p-2 bg-secondary/40 border rounded-lg shadow-sm dark:bg-background"
//                   >
//                     <X className="w-5 h-5 text-muted-foreground " />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* NOTIFICATION */}
//             {!mobileSearchOpen && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="relative text-muted-foreground bg-secondary/30 shadow-sm rounded-xl"
//               >
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
//               </Button>
//             )}

//           </div>
//           </header>
          
//           {/* PAGE CONTENT */}
//           <div className="flex-1 overflow-auto bg-secondary/20 p-4 sm:p-6 lg:p-8">
//             <div className="mx-auto max-w-7xl space-y-6">

//             <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-900">
//                   {navItems.find((item) => item.id === activeTab)?.label}
//                 </h1>
  
//                 <p className="text-muted-foreground mt-1 text-sm sm:text-base">
//                   {activeTab !== "settings" ? (
//                     <>
//                       Manage{" "}
//                       {navItems
//                         .find((item) => item.id === activeTab)
//                         ?.label.toLowerCase()}{" "}
//                       for{" "}
//                       <span className="font-semibold text-red-300">
//                         {EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label}
//                       </span>{" "}
//                       •{" "}
//                       <span className="font-semibold ">
//                         {selectedYear} Academic Session
//                       </span>
//                     </>
//                   ) : (
//                     "Configure your profile and preferences"
//                   )}
//                 </p>
//               </div>
  
//               {activeTab !== "settings" && (
//                 <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-xl shadow-sm">
//                   <Badge className="px-3 py-1 bg-white shadow-sm border text-blue-900 hover:text-white">
//                     {EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label}
//                   </Badge>
//                   <Badge variant="secondary" className="px-3 py-1 shadow-sm dark:bg-background">
//                     {selectedYear}
//                   </Badge>
//                 </div>
//               )}
//             </div>

//               {/* PAGE CONTENT */}
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 {activeTab === "overview" && (
//                   <DashboardOverview
//                     context={context}
//                     setActiveTab={setActiveTab}
//                     subjects={subjects}
//                     modules={modules}
//                     topics={topics}
//                     questions={questions}
                  
//                   />
//                 )}

//                 {activeTab === "subjects" && (
//                   <SubjectsPanel
//                     context={context}
//                     subjects={subjects}
//                     setSubjects={setSubjects}
//                     globalSearch={globalSearch}
//                   />
//                 )}

//                 {activeTab === "modules" && (
//                   <ModulesPanel
//                     context={context}
//                     modules={modules}
//                     setModules={setModules}
//                     subjects={subjects}
//                     globalSearch={globalSearch}
//                   />
//                 )}

//                 {activeTab === "topics" && (
//                   <TopicsPanel
//                     context={context}
//                     topics={topics}
//                     setTopics={setTopics}
//                     modules={modules}
//                     subjects={subjects}
//                     globalSearch={globalSearch}
//                   />
//                 )}

//                 {activeTab === "questions" && (
//                   <QuestionsPanel
//                     context={context}
//                     questions={questions}
//                     setQuestions={setQuestions}
//                     topics={topics}
//                     modules={modules}
//                     subjects={subjects}
//                     globalSearch={globalSearch}
//                   />



//                 )}
//                       <DashboardOverview
//                       context={context}
//                       setActiveTab={setActiveTab}
//                       subjects={subjects}
//                       modules={modules}
//                       topics={topics}
//                       questions={questions}
//                     />

//                 {/* ✅ Pass context with updateProfile and changePassword */}
//                 {activeTab === "settings" && <SettingsPage context={context} />}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   )
// }






// // ... your DashboardOverview component stays the same ...
// /* ------------------------ OVERVIEW COMPONENT ------------------------- */
// // function DashboardOverview({ context, setActiveTab, subjects, modules, topics, questions, dashboardStats }) {
// //   const completeContent = []
 
// //   questions.forEach((question) => {
// //     if (question.category?.toLowerCase() === context.examBody && question.year === context.year) {
// //       const existing = completeContent.find(
// //         (c) =>
// //           c.category === question.category &&
// //           c.year === question.year &&
// //           c.subject === question.subject &&
// //           c.module === question.module &&
// //           c.topic === question.topic
// //       )

// //       if (existing) {
// //         existing.questions.push(question)
// //         existing.questionCount++
// //       } else {
// //         completeContent.push({
// //           id: `${question.category}-${question.year}-${question.subject}-${question.module}-${question.topic}`,
// //           category: question.category,
// //           year: question.year,
// //           subject: question.subject,
// //           module: question.module,
// //           topic: question.topic,
// //           questions: [question],
// //           questionCount: 1,
// //         })
// //       }
// //     }
// //   })

// //   const stats = [
// //     {
// //       title: "Total Subjects",
// //       value: subjects.length,
// //       icon: BookOpen,
// //       action: "subjects",
// //     },
// //     {
// //       title: "Active Modules",
// //       value: modules.length,
// //       icon: FolderOpen,
// //       action: "modules",
// //     },
// //     {
// //       title: "Topics Created",
// //       value: topics.length,
// //       icon: FileText,
// //       action: "topics",
// //     },
// //     {
// //       title: "Complete Content",
// //       value: completeContent.length,
// //       icon: HelpCircle,
// //       action: "questions",
// //     },
// //   ]

// //   return (
// //     <div className="space-y-6">

      
// //       {/* Dashboard Stats from API */}
// //       {dashboardStats && (
// //         <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6 ">
// //           <Card className="dark:bg-background">
// //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// //               <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
// //               <Users className="size-4 text-muted-foreground" />
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{dashboardStats.totalStudents || 0}</div>
// //             </CardContent>
// //           </Card>
          
// //           <Card className="dark:bg-background">
// //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// //               <CardTitle className="text-sm text-muted-foreground">Total Questions</CardTitle>
// //               <HelpCircle className="size-4 text-muted-foreground" />
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{dashboardStats.totalQuestions || 0}</div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       )}

// //       {/* STATS CARDS - Filtered by exam body & year */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// //         {stats.map((stat, i) => (
// //           <Card
// //             key={i}
// //             className="cursor-pointer transition-all hover:shadow-md dark:bg-background"
// //             onClick={() => setActiveTab(stat.action)}
// //           >
// //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// //               <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
// //               <stat.icon className="size-4 text-muted-foreground" />
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{stat.value}</div>
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>

// //       {/* COMPLETE CONTENT */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Complete Content Overview</CardTitle>
// //           <CardDescription>
// //             All content packages with Category, Year, Subject, Module, Topic, and Questions
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           {completeContent.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-12 text-center">
// //               <HelpCircle className="size-16 text-muted-foreground/30 mb-4" />
// //               <p className="text-muted-foreground text-lg">No complete content yet</p>
// //               <p className="text-sm text-muted-foreground mt-2 max-w-md">
// //                 Create subjects, modules, topics, and questions to see complete content packages here.
// //               </p>
// //             </div>
// //           ) : (
// //             <div className="grid gap-4 md:grid-cols-2">
// //               {completeContent.map((content) => (
// //                 <Card key={content.id} className="hover:shadow-lg transition-all">
// //                   <CardHeader className="pb-3">
// //                     <div className="flex items-start justify-between">
// //                       <div className="space-y-1">
// //                         <Badge variant="secondary" className="mb-2">
// //                           {content.category?.toUpperCase()} • {content.year}
// //                         </Badge>
// //                         <CardTitle className="text-lg">{content.subject}</CardTitle>
// //                       </div>
// //                       <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
// //                         <BookOpen className="size-5 text-primary" />
// //                       </div>
// //                     </div>
// //                   </CardHeader>

// //                   <CardContent className="space-y-3">
// //                     <div className="text-sm space-y-2">
// //                       <div className="flex items-center gap-2">
// //                         <FolderOpen className="size-4 text-muted-foreground" />
// //                         <span className="font-medium">Module:</span>
// //                         <span className="text-muted-foreground">{content.module}</span>
// //                       </div>

// //                       <div className="flex items-center gap-2">
// //                         <FileText className="size-4 text-muted-foreground" />
// //                         <span className="font-medium">Topic:</span>
// //                         <span className="text-muted-foreground">{content.topic}</span>
// //                       </div>

// //                       <div className="flex items-center gap-2">
// //                         <HelpCircle className="size-4 text-muted-foreground" />
// //                         <span className="font-medium">Questions:</span>
// //                         <Badge variant="default" className="ml-auto">
// //                           {content.questionCount}
// //                         </Badge>
// //                       </div>
// //                     </div>

// //                     <Separator />

// //                     <div className="flex items-center justify-between text-xs text-muted-foreground">
// //                       <span>Complete Package</span>
// //                       <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
// //                         Ready
// //                       </Badge>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }









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
  FolderOpen,
  FileText,
  HelpCircle,
  Users,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  Loader2
} from "lucide-react"

import { ThemeToggle } from "../../DashboardComponents/theme-toggle"
import SubjectsPanel from "@/components/DashboardComponents/lecturer/subjects-panel"
import ModulesPanel from "@/components/DashboardComponents/lecturer/modules-panel"
import TopicsPanel from "@/components/DashboardComponents/lecturer/topics-panel"
import QuestionsPanel from "@/components/DashboardComponents/lecturer/questions-panel"
import SettingsPage from "@/pages/lecturer/SettingsPage"
import DashboardOverview from "@/components/DashboardComponents/lecturer/DashboardOverview"

import useTutorAuthStore from "@/store/tutorAuthStore"
import useTutorStore from "@/store/tutorStore"

const EXAM_BODIES = [
  { id: "jamb", label: "JAMB", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "waec", label: "WAEC", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "neco", label: "NECO", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "putme", label: "Post-UTME", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
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
    getSubjects,
    getModules,
    getTopics,
    getQuestions,
    dashboardData,
  } = useTutorStore()

  // State
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedExamBody, setSelectedExamBody] = useState("jamb")
  const [selectedYear, setSelectedYear] = useState("")
  const [availableYears, setAvailableYears] = useState([])
  const [loadingYears, setLoadingYears] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const [subjects, setSubjects] = useState([])
  const [modules, setModules] = useState([])
  const [topics, setTopics] = useState([])
  const [questions, setQuestions] = useState([])

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "modules", label: "Modules", icon: FolderOpen },
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

  // Fetch content
  const fetchContent = async () => {
    if (!selectedExamBody || !selectedYear) return
    try {
      setLoadingData(true)
      const [subsRes, modsRes, topicsRes, quesRes] = await Promise.all([
        getSubjects(),
        getModules(),
        getTopics(),
        getQuestions({ category: selectedExamBody.toUpperCase(), year: selectedYear })
      ])
      if (subsRes?.success) setSubjects(subsRes.data.filter(s => s.category?.toLowerCase() === selectedExamBody && s.year === selectedYear))
      if (modsRes?.success) setModules(modsRes.data || [])
      if (topicsRes?.success) setTopics(topicsRes.data || [])
      if (quesRes?.success) setQuestions(quesRes.data || [])
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to load content data", variant: "destructive" })
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => { fetchContent() }, [selectedExamBody, selectedYear])

  const refreshData = fetchContent

  const handleLogout = async () => {
    await logout()
    navigate("/tutor/login")
    toast({ title: "Logged out", description: "You have been successfully logged out" })
  }

  const context = useMemo(() => ({
    examBody: selectedExamBody,
    year: selectedYear,
    refreshData,
    updateProfile,
    changePassword,
  }), [selectedExamBody, selectedYear, refreshData, updateProfile, changePassword])

  // Loading UI
  if (loadingYears) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )

  const showLoadingOverlay = loadingData && (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    </div>
  )

  return (
    <>
      {showLoadingOverlay}
      <div className="flex min-h-screen bg-background font-sans">
        {/* SIDEBAR */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col border-r shadow-xl transform transition-transform duration-300 lg:translate-x-0",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile Close */}
          <div className="flex justify-end p-4 md:hidden">
            <Button variant="ghost" className="p-2" onClick={() => setMobileSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Logo */}
          <div className="flex items-center p-2">
            <img src={fillopLogo} alt="Fillop Logo" className="w-12 h-12 object-contain" />
            <div className="leading-none mx-4 md:ml-2">
              <p className="text-primary font-bold font-merriweather text-xl">FILLOP TECH</p>
              <p className="text-education-orange text-[9px] font-merriweather">...simplifying your tech world</p>
            </div>
          </div>

          {/* Nav */}
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-3 font-medium rounded-xl transition-all", isActive ? "bg-indigo-600 text-white" : "text-gray-700")}
                    onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false) }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src="/placeholder.svg" alt="User" />
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
          {/* HEADER */}
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

              {/* Exam Body & Year */}
              {!mobileSearchOpen && (
                <div className="flex items-center gap-2 bg-secondary/40 p-1 rounded-xl border flex-1 sm:flex-none">
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
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-8 min-w-[55px] sm:w-[90px]">
                      <SelectValue placeholder="Yr" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Desktop Search */}
              <div className="flex-1 hidden sm:flex relative">
                <Input
                  type="search"
                  placeholder="Search anything..."
                  className="w-full rounded-full pl-10"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
              </div>

              {/* Notification */}
              {!mobileSearchOpen && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-background"></span>
                </Button>
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="flex-1 overflow-auto bg-secondary/20 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900">
                    {navItems.find((item) => item.id === activeTab)?.label}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    {activeTab !== "settings" ? (
                      <>Manage {navItems.find((item) => item.id === activeTab)?.label.toLowerCase()} for <span className="font-semibold text-red-300">{EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label}</span> • <span className="font-semibold">{selectedYear} Academic Session</span></>
                    ) : "Configure your profile and preferences"}
                  </p>
                </div>
                {activeTab !== "settings" && (
                  <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-xl shadow-sm">
                    <Badge>{EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label}</Badge>
                    <Badge variant="secondary">{selectedYear}</Badge>
                  </div>
                )}
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "overview" && (
                  <DashboardOverview
                    context={context}
                    setActiveTab={setActiveTab}
                    subjects={subjects}
                    modules={modules}
                    topics={topics}
                    questions={questions}
                  />
                )}
                {activeTab === "subjects" && <SubjectsPanel context={context} subjects={subjects} setSubjects={setSubjects} globalSearch={globalSearch} />}
                {activeTab === "modules" && <ModulesPanel context={context} modules={modules} setModules={setModules} subjects={subjects} globalSearch={globalSearch} />}
                {activeTab === "topics" && <TopicsPanel context={context} topics={topics} setTopics={setTopics} modules={modules} subjects={subjects} globalSearch={globalSearch} />}
                {activeTab === "questions" && <QuestionsPanel context={context} questions={questions} setQuestions={setQuestions} topics={topics} modules={modules} subjects={subjects} globalSearch={globalSearch} />}
                {activeTab === "settings" && <SettingsPage context={context} />}
                {activeTab === "analytics" && <AnalyticsPanel subjects={subjects} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

