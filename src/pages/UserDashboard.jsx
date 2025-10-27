import DashboardLayout from "../components/layouts/DashboardLayout"
import OverviewStats from "../components/DashboardComponents/user/index/overview-stats"
import ContentChart from "../components/DashboardComponents/user/index/content-chart"
import RecentPosts from "../components/DashboardComponents/user/index/recent-posts"
import PopularArticles from "../components/DashboardComponents/user/index/popular-articles"
import ContentCategories from "../components/DashboardComponents/user/index/content-categories"
import RecentComments from "../components/DashboardComponents/user/index/recent-comments"
// import PublishingSchedule from "../components/DashboardComponents/user/index/publishing-schedule"
import StudyCategories from "../components/DashboardComponents/user/index/study-categories"
import UserActivity from "../components/DashboardComponents/user/index/user-activities"
import SystemHistory from "../components/DashboardComponents/user/index/system-history"




export default function CMSDashboardContent() {
  return (
    <DashboardLayout  currentPage="dashboard" className="border-4 border-red-500">
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, <span className="text-primary dark:text-blue-400">Henry!</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here’s your dashboard summary for today 
        </p>
      </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            community
          </button>
          <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium">
            Download Guru
          </button>
        </div>
      </div>

      <StudyCategories />
      {/* Overview Stats */}
      <OverviewStats />

      {/* Content Chart - moved here */}
      <ContentChart />

      {/* User Activity & System History Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <SystemHistory />
        <UserActivity />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0">
          <RecentPosts />
          <PopularArticles />
          {/* <PublishingSchedule /> */}
        </div>

        {/* Right Column - 1/3 width on desktop */}
        <div className="space-y-4 sm:space-y-6 w-full min-w-0">
          <ContentCategories />
          <RecentComments />
        </div>
      </div>
      </div>
 </DashboardLayout>
    
  )
}
