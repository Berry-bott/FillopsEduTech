
import React, { useEffect, useState } from "react";
import {
  BookCheck,
  FileQuestion,
  ClipboardList,
  BookOpen,
  Lightbulb,
  FileEdit,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart3,
} from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function OverviewStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchWithAuth } = useAuthStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Calculate study progress as a percentage
  const calculateStudyProgress = (overview) => {
    if (!overview || !overview.subjectsPracticed || overview.subjectsPracticed === 0) {
      return 0;
    }
    
    // Calculate completion rate based on questions studied vs available questions
    // If no quiz questions total, use a default calculation
    if (!overview.quizQuestionsTotal || overview.quizQuestionsTotal === 0) {
      // Alternative: base on subjects practiced (assuming 10 subjects as max)
      const maxSubjects = 10;
      return Math.min(Math.round((overview.subjectsPracticed / maxSubjects) * 100), 100);
    }
    
    // Calculate percentage of questions completed
    const percentage = Math.round((overview.questionsStudied / overview.quizQuestionsTotal) * 100);
    return Math.min(percentage, 100); // Cap at 100%
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard stats...");
      
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/dashboard`
      );

      console.log("Dashboard API response:", response);

      if (response?.data?.overview) {
        const overview = response.data.overview;
        
        console.log("Overview data:", overview);
        
        // Map the API response to stats format
        const mappedStats = [
          {
            title: "Questions Studied",
            value: overview.questionsStudied || "0",
            change: "+0%",
            changeType: "increase",
            icon: <BookCheck className="h-4 w-4" />,
            description: "Total questions completed",
          },
          {
            title: "Quiz Questions Total",
            value: overview.quizQuestionsTotal || "0",
            change: "+0%",
            changeType: "increase",
            icon: <FileQuestion className="h-4 w-4" />,
            description: "Available quiz questions",
          },
          {
            title: "Quizzes Taken",
            value: overview.quizzesTaken || "0",
            change: "+0%",
            changeType: "increase",
            icon: <ClipboardList className="h-4 w-4" />,
            description: "Total quizzes completed",
          },
          {
            title: "Subjects Practiced",
            value: overview.subjectsPracticed || "0",
            change: "+0%",
            changeType: "increase",
            icon: <BookOpen className="h-4 w-4" />,
            description: "Different subjects covered",
          },
          {
            title: "Topics Practiced",
            value: overview.topicsLearned || "0",
            change: "+0%",
            changeType: "increase",
            icon: <Lightbulb className="h-4 w-4" />,
            description: "Topics you've tried",
          },
          {
            title: "Exams Written",
            value: overview.examsWritten || "0",
            change: "+0%",
            changeType: "increase",
            icon: <FileEdit className="h-4 w-4" />,
            description: "Practice exams completed",
          },
          {
            title: "Study Progress",
            value: `${calculateStudyProgress(overview)}%`,
            change: `Day ${overview.daysSinceJoined || "1"}`,
            changeType: calculateStudyProgress(overview) >= 50 ? "increase" : "decrease",
            icon: <BarChart3 className="h-4 w-4" />,
            description: "Completion rate across subjects",
          },
          {
            title: "Avg Study Time/Day",
            value: overview.averageStudyTimeLabel || "0 mins",
            change: `${overview.totalStudyTimeMinutes || "0"} mins total`,
            changeType: "increase",
            icon: <Clock className="h-4 w-4" />,
            description: "Daily average",
          },
        ];

        console.log("Mapped stats:", mappedStats);
        setStats(mappedStats);
      } else {
        console.warn("No overview data received from API");
        setStats(getDefaultStats());
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      console.error("Error details:", error.response || error.message);
      setStats(getDefaultStats());
    } finally {
      setLoading(false);
      console.log("Dashboard stats fetch complete");
    }
  };

  const getDefaultStats = () => [
    {
      title: "Questions Studied",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: <BookCheck className="h-4 w-4" />,
      description: "Total questions completed",
    },
    {
      title: "Quiz Questions Total",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: <FileQuestion className="h-4 w-4" />,
      description: "Available quiz questions",
    },
    {
      title: "Quizzes Taken",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: <ClipboardList className="h-4 w-4" />,
      description: "Total quizzes completed",
    },
    {
      title: "Subjects Practiced",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Different subjects covered",
    },
    {
      title: "Topics Learned",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: <Lightbulb className="h-4 w-4" />,
      description: "Topics mastered",
    },
    {
      title: "Exams Written",
      value: "0",
      change: "+0%",
      changeType: "increase",
      icon: <FileEdit className="h-4 w-4" />,
      description: "Practice exams completed",
    },
    {
      title: "Study Progress",
      value: "0%",
      change: "Day 1",
      changeType: "decrease",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Completion rate across subjects",
    },
    {
      title: "Avg Study Time/Day",
      value: "0 mins",
      change: "0 mins total",
      changeType: "increase",
      icon: <Clock className="h-4 w-4" />,
      description: "Daily average",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-background rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] animate-pulse"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-background rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between pb-2">
            <div className="text-gray-600 dark:text-gray-400">{stat.icon}</div>
            <div className="flex items-center text-xs">
              {stat.changeType === "increase" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={`font-medium ${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}