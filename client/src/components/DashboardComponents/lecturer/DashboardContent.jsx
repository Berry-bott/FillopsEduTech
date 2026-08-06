import { useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardOverview from "@/components/DashboardComponents/lecturer/DashboardOverview"
import SubjectsPanel from "@/components/DashboardComponents/lecturer/subjects-panel"
import TopicsPanel from "@/components/DashboardComponents/lecturer/topics-panel"
import QuestionsPanel from "@/components/DashboardComponents/lecturer/questions-panel"
import AnalyticsPanel from "@/components/DashboardComponents/lecturer/analytics-panel"
import SettingsPage from "@/pages/lecturer/SettingsPage"
import TutorChat from "@/pages/chat/TutorChatPage"
import TutorCommunity from "@/pages/community/TutorCommunity.jsx"
import TutorNotification from "@/pages/lecturer/Notificationspage"
import { EXAM_BODIES, COLOR_OPTIONS } from "./DashboardConstants"

export default function DashboardContent({
  activeTab,
  setActiveTab,
  tutor,
  dashboardData,
  context,
  selectedExamBody,
  examBodyParam,     // "" when all-catigories, specific id otherwise
  examBodiesToShow,  // array of specific exam body ids to render
  selectedYear,
  selectedColor,
  selectedSubjectId,
  selectedSubjectName,
  selectedTopicId,
  selectedTopicName,
  globalSearch,
  onSubjectSelect,
  onTopicSelect,
}) {
  const examLabel  = EXAM_BODIES.find((b) => b.id === selectedExamBody)?.label
  const colorLabel = COLOR_OPTIONS.find((c) => c.value === selectedColor)?.label
  const isAllCats  = selectedExamBody === "all-catigories"

  // When user types a search from overview → jump to subjects so results show
  useEffect(() => {
    if (globalSearch && activeTab === "overview") {
      setActiveTab("subjects")
    }
  }, [globalSearch])

  // Panel key: remounts (re-fetches) whenever search, exam body, or year changes
  const panelKey = `${examBodyParam}-${selectedYear}-${globalSearch}`

  return (
    <div className="flex-1 overflow-auto bg-secondary/20 p-4 sm:px-6 sm:py-2 border">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Overview page header ── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl text-primary font-bold mb-2">
                {tutor?.firstName
                  ? `Welcome back, ${tutor.firstName}!`
                  : dashboardData?.welcome?.message || "Welcome back!"}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {isAllCats
                  ? "Showing content across all exam categories"
                  : <>Manage your content for <span className="font-semibold text-red-300">{examLabel}</span></>
                }
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 p-2 rounded-xl shadow-lg">
                <Badge variant="secondary">{examLabel}</Badge>
                <Badge variant="secondary">{selectedYear}</Badge>
                {selectedColor !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className={`h-3 w-3 rounded-full ${selectedColor}`} />
                    {colorLabel}
                  </Badge>
                )}
              </div>
              <Button onClick={() => setActiveTab("subjects")} className="gap-2">
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>
        )}

        {/* ── Active search banner ── */}
        {globalSearch && (
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
            Showing results for <span className="font-bold ml-1">"{globalSearch}"</span>
            <span className="ml-1 text-indigo-400">
              {isAllCats ? "across all categories" : `in ${examLabel}`}
            </span>
          </div>
        )}

        {/* ── Panel renderer ── */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          {activeTab === "overview" && (
            // Pass examBodies array so overview renders a section per category
            <DashboardOverview
              key={`overview-${panelKey}`}
              context={context}
              setActiveTab={setActiveTab}
              examBodies={examBodiesToShow}
            />
          )}

          {activeTab === "subjects" && (
            // When all-catigories: examBodyParam="" fetches all; panels render everything
            <SubjectsPanel
              key={`subjects-${panelKey}`}
              onSubjectSelect={onSubjectSelect}
              examBody={examBodyParam}
              year={selectedYear}
              color={selectedColor}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === "topics" && (
            <TopicsPanel
              key={`topics-${panelKey}`}
              selectedSubject={selectedSubjectId}
              subjectName={selectedSubjectName}
              onTopicSelect={onTopicSelect}
              examBody={examBodyParam}
              year={selectedYear}
              color={selectedColor}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === "questions" && (
            <QuestionsPanel
              key={`questions-${panelKey}`}
              selectedSubjectId={selectedSubjectId}
              selectedTopic={selectedTopicId}
              topicName={selectedTopicName}
              subjectName={selectedSubjectName}
              examBody={examBodyParam}
              year={selectedYear}
              color={selectedColor}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === "analytics"    && <AnalyticsPanel />}
          {activeTab === "chat"         && <TutorChat />}
          {activeTab === "community"    && <TutorCommunity />}
          {activeTab === "settings"     && <SettingsPage context={context} />}
          {activeTab === "notification" && <TutorNotification />}
        </div>

      </div>
    </div>
  )
}