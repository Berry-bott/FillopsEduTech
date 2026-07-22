import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import useTutorAuthStore from "@/store/tutorAuthStore"
import useTutorStore from "@/store/tutorStore"
import { useTutorChatStore } from "@/store/tutorChatStore"
import DashboardSidebar from "./DashboardSidebar"
import DashboardHeader from "./DashboardHeader"
import DashboardContent from "./DashboardContent"
import LatestBlogBanner from "../../layouts/Latestblogbanner"


// Delays updating a value until the user stops typing for `delay` ms
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function generateYears() {
  const current = new Date().getFullYear()
  const years = []
  for (let i = 1; i >= -10; i--) years.push((current + i).toString())
  return years
}

export default function LecturerDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // ── Auth ──────────────────────────────────────────────────────────────────
  const tutor          = useTutorAuthStore((s) => s.tutor)
  const logout         = useTutorAuthStore((s) => s.logout)
  const updateProfile  = useTutorAuthStore((s) => s.updateProfile)
  const changePassword = useTutorAuthStore((s) => s.changePassword)

  // ── Tutor data ────────────────────────────────────────────────────────────
  const { fetchDashboard, dashboardData } = useTutorStore()

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab,           setActiveTab]           = useState("overview")
  const [mobileSidebarOpen,   setMobileSidebarOpen]   = useState(false)
  const [loadingYears,        setLoadingYears]        = useState(true)

  // ── Filter state ──────────────────────────────────────────────────────────
  const [selectedExamBody, setSelectedExamBody] = useState("all-catigories")
  const [selectedYear,     setSelectedYear]     = useState("")
  const [selectedColor,    setSelectedColor]    = useState("all")
  const [availableYears,   setAvailableYears]   = useState([])
  const [globalSearch,     setGlobalSearch]     = useState("")
  const debouncedSearch = useDebounce(globalSearch, 400)

  // ── Navigation state (subject → topic → questions) ────────────────────────
  const [selectedSubjectId,   setSelectedSubjectId]   = useState(null)
  const [selectedSubjectName, setSelectedSubjectName] = useState("")
  const [selectedTopicId,     setSelectedTopicId]     = useState(null)
  const [selectedTopicName,   setSelectedTopicName]   = useState("")

  // ── Socket init ───────────────────────────────────────────────────────────
  useEffect(() => {
    let initialized = false

    const tryInit = () => {
      const t = useTutorAuthStore.getState().tutor
      if (t?.id && !initialized) {
        initialized = true
        useTutorChatStore.getState().initializeSocket()
      }
    }

    tryInit()

    const unsub = useTutorAuthStore.subscribe(
      (s) => s.tutor,
      (newTutor) => {
        if (newTutor?.id && !initialized) {
          initialized = true
          useTutorChatStore.getState().initializeSocket()
        }
      },
      { fireImmediately: false }
    )

    return () => unsub()
  }, [])

  // ── Dashboard init ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tutor) return
    const init = async () => {
      try {
        setLoadingYears(true)
        const years = generateYears()
        setAvailableYears(years)
        setSelectedYear(years[1]) // current year
        await fetchDashboard()
      } catch {
        toast({ title: "Warning", description: "Some features may be limited", variant: "destructive" })
      } finally {
        setLoadingYears(false)
      }
    }
    init()
  }, [tutor, fetchDashboard, toast])

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSubjectSelect = (id, name) => {
    setSelectedSubjectId(id)
    setSelectedSubjectName(name)
    setActiveTab("topics")
  }

  const handleTopicSelect = (id, name) => {
    setSelectedTopicId(id)
    setSelectedTopicName(name)
    setActiveTab("questions")
  }

  const handleLogout = async () => {
    await logout()
    navigate("/tutor/login")
    toast({ title: "Logged out", description: "You have been successfully logged out" })
  }

  // ── Context for settings / overview ──────────────────────────────────────
  // Normalize "all-catigories" → "" so APIs return everything
  const examBodyParam = selectedExamBody === "all-catigories" ? "" : selectedExamBody

  // When "All Categories" selected, pass every specific exam body so overview
  // can render a section per category; otherwise just the one selected
  const ALL_SPECIFIC = ["jamb", "waec", "neco", "putme"]
  const examBodiesToShow = selectedExamBody === "all-catigories" ? ALL_SPECIFIC : [selectedExamBody]

  const context = useMemo(() => ({
    examBody: examBodyParam,          // "" means no filter — API returns all
    examBodies: examBodiesToShow,     // list overview uses to render per-category sections
    year: selectedYear,
    color: selectedColor,
    updateProfile,
    changePassword,
  }), [examBodyParam, selectedYear, selectedColor, updateProfile, changePassword])

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loadingYears) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background font-sans">

      <DashboardSidebar
        tutor={tutor}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">

        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          selectedExamBody={selectedExamBody}
          setSelectedExamBody={setSelectedExamBody}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          availableYears={availableYears}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
        <LatestBlogBanner/>

        <DashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tutor={tutor}
          dashboardData={dashboardData}
          context={context}
          selectedExamBody={selectedExamBody}
          examBodyParam={examBodyParam}
          examBodiesToShow={examBodiesToShow}
          selectedYear={selectedYear}
          selectedColor={selectedColor}
          selectedSubjectId={selectedSubjectId}
          selectedSubjectName={selectedSubjectName}
          selectedTopicId={selectedTopicId}
          selectedTopicName={selectedTopicName}
          globalSearch={debouncedSearch}
          onSubjectSelect={handleSubjectSelect}
          onTopicSelect={handleTopicSelect}
        />

      </main>
    </div>
  )
}