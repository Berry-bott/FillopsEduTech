import DashboardLayout from "../../components/layouts/DashboardLayout"
import OverviewStats from "../../components/DashboardComponents/user/overview-stats"
import ContentChart from "../../components/DashboardComponents/user/content-chart"
import RecentPosts from "../../components/DashboardComponents/user/recent-posts"
import PopularArticles from "../../components/DashboardComponents/user/popular-articles"
// import ContentCategories from "../components/DashboardComponents/user/content-categories"
// import RecentComments from "../components/DashboardComponents/user/recent-comments"
// import PublishingSchedule from "../components/DashboardComponents/user/publishing-schedule";
import ExamSelector from "../../components/DashboardComponents/user/ExamSelector"
import UserActivity from "../../components/DashboardComponents/user/user-activities"
import { useEffect } from "react";
import useAuthStore from "../../store/authStore";




export default function UserDashboard() {

  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); 
  }, []);


  return (
    <DashboardLayout currentPage="dashboard">

      <div className="space-y-4 sm:space-y-6 w-full min-w-0">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back,{" "}
              <span className="text-primary dark:text-blue-400">
              {user?.firstName
              ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
              : "User"}

              </span>
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Here’s your dashboard summary for today
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground dark:text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              Community
            </button>
            <button className="px-2 py-2 border border-border text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium">
            <a href="https://cbt.filloptech.com" className="no-underline"> 
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                 
                  Download CBT Guru
                </span>
                  </a>
            </button>
          </div>

        </div>

        <ExamSelector />
        <OverviewStats />
        <ContentChart />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* <SystemHistory /> */}
          <UserActivity />
          <RecentPosts />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0">
            <PopularArticles />
          </div>

          {/* <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            <ContentCategories />
            <RecentComments />
          </div> */}
        </div>

      </div>

    </DashboardLayout>
  );
}
