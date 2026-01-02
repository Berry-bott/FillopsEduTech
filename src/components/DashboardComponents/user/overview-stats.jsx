// import React from "react";
// import {
//   FileText,
//   Eye,
//   MessageSquare,
//   Users,
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   Star,
//   Image as ImageIcon,
// } from "lucide-react";

// const stats = [
//   {
//     title: "Total Articles",
//     value: "1,247",
//     change: "+12.5%",
//     changeType: "increase",
//     icon: <FileText className="h-4 w-4" />,
//     description: "Published articles",
//   },
//   {
//     title: "Articles Views",
//     value: "89.2K",
//     change: "+23.1%",
//     changeType: "increase",
//     icon: <Eye className="h-4 w-4" />,
//     description: "This month",
//   },
//   {
//     title: "Comments",
//     value: "2,847",
//     change: "+8.2%",
//     changeType: "increase",
//     icon: <MessageSquare className="h-4 w-4" />,
//     description: "User engagement",
//   },
//   {
//     title: "Authors",
//     value: "24",
//     change: "-2.1%",
//     changeType: "decrease",
//     icon: <Users className="h-4 w-4" />,
//     description: "Active writers",
//   },
//   {
//     title: "Reviews",
//     value: "68",
//     change: "+5.3%",
//     changeType: "increase",
//     icon: <Star className="h-4 w-4" />,
//     description: "Content reviews",
//   },
//   {
//     title: "Media Files",
//     value: "3,456",
//     change: "+15.7%",
//     changeType: "increase",
//     icon: <ImageIcon className="h-4 w-4" />,
//     description: "Images & videos",
//   },
// ];

// export default function OverviewStats() {
//   return (
//     <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//       {stats.map((stat) => (
//         <div
//           key={stat.title}
//           className="bg-white dark:bg-background rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow"
//         >
//           <div className="flex items-center justify-between pb-2">
//             <div className="text-gray-600 dark:text-gray-400">{stat.icon}</div>
//             <div className="flex items-center text-xs">
//               {stat.changeType === "increase" ? (
//                 <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
//               ) : (
//                 <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
//               )}
//               <span
//                 className={`font-medium ${
//                   stat.changeType === "increase"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 {stat.change}
//               </span>
//             </div>
//           </div>

//           <div className="space-y-1">
//             <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
//               {stat.value}
//             </div>
//             <div className="space-y-0.5">
//               <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
//                 {stat.title}
//               </h3>
//               <p className="text-xs text-gray-500 dark:text-gray-500">
//                 {stat.description}
//               </p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import {
//   FileText,
//   Eye,
//   MessageSquare,
//   Users,
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   Star,
//   Image as ImageIcon,
// } from "lucide-react";
// import useAuthStore from "@/store/authStore"; // Adjust path as needed

// export default function OverviewStats() {
//   const [stats, setStats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { fetchWithAuth } = useAuthStore();

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching dashboard stats...");
      
//       const response = await fetchWithAuth(
//         "https://fillops-server-5fuf.onrender.com/api/users/dashboard"
//       );

//       console.log("Dashboard API response:", response);
//       console.log("Dashboard data:", response?.data);

//       if (response?.data) {
//         const data = response.data;
        
//         console.log("Mapping stats with data:", {
//           totalArticles: data.totalArticles,
//           articleViews: data.articleViews,
//           comments: data.comments,
//           authors: data.authors,
//           reviews: data.reviews,
//           mediaFiles: data.mediaFiles
//         });
        
//         // Map the API response to stats format
//         const mappedStats = [
//           {
//             title: "Number Of Questions Studied ",
//             value: data.totalArticles || "0",
//             change: data.articlesChange || "+0%",
//             changeType: data.articlesChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <FileText className="h-4 w-4" />,
//             description: "Number Of Questions",
//           },
//           {
//             title: "Total Questions",
//             value: formatNumber(data.articleViews) || "0",
//             change: data.viewsChange || "+0%",
//             changeType: data.viewsChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <Eye className="h-4 w-4" />,
//             description: "Nunber of Questions by Fillop",
//           },
//           {
//             title: "Number of Quiz Taken",
//             value: formatNumber(data.comments) || "0",
//             change: data.commentsChange || "+0%",
//             changeType: data.commentsChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <MessageSquare className="h-4 w-4" />,
//             description: "User engagement",
//           },
//           {
//             title: "Nunber of Subjects Practiced",
//             value: data.authors || "0",
//             change: data.authorsChange || "+0%",
//             changeType: data.authorsChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <Users className="h-4 w-4" />,
//             description: "Active writers",
//           },
//           {
//             title: "Topics Learned",
//             value: data.reviews || "0",
//             change: data.reviewsChange || "+0%",
//             changeType: data.reviewsChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <Star className="h-4 w-4" />,
//             description: "Content reviews",
//           },
//           {
//             title: "Nunber of Exams Written",
//             value: formatNumber(data.mediaFiles) || "0",
//             change: data.mediaChange || "+0%",
//             changeType: data.mediaChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <ImageIcon className="h-4 w-4" />,
//             description: "Images & videos",
//           },
//           {
//             title: "Your Study Progress",
//             value: formatNumber(data.mediaFiles) || "0",
//             change: data.mediaChange || "+0%",
//             changeType: data.mediaChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <ImageIcon className="h-4 w-4" />,
//             description: "Images & videos",
//           },
//           {
//             title: "Average Study Time Per Day",
//             value: formatNumber(data.mediaFiles) || "0",
//             change: data.mediaChange || "+0%",
//             changeType: data.mediaChange?.startsWith("+") ? "increase" : "decrease",
//             icon: <ImageIcon className="h-4 w-4" />,
//             description: "Images & videos",
//           },
//         ];

//         console.log("Mapped stats:", mappedStats);
//         setStats(mappedStats);
//       } else {
//         console.warn("No data received from API");
//         setStats(getDefaultStats());
//       }
//     } catch (error) {
//       console.error("Failed to fetch dashboard stats:", error);
//       console.error("Error details:", error.response || error.message);
//       // Set default stats on error
//       setStats(getDefaultStats());
//     } finally {
//       setLoading(false);
//       console.log("Dashboard stats fetch complete");
//     }
//   };

//   const formatNumber = (num) => {
//     if (!num) return "0";
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + "M";
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + "K";
//     }
//     return num.toString();
//   };

//   const getDefaultStats = () => [
//     {
//       title: "Total Articles",
//       value: "0",
//       change: "+0%",
//       changeType: "increase",
//       icon: <FileText className="h-4 w-4" />,
//       description: "Published articles",
//     },
//     {
//       title: "Articles Views",
//       value: "0",
//       change: "+0%",
//       changeType: "increase",
//       icon: <Eye className="h-4 w-4" />,
//       description: "This month",
//     },
//     {
//       title: "Comments",
//       value: "0",
//       change: "+0%",
//       changeType: "increase",
//       icon: <MessageSquare className="h-4 w-4" />,
//       description: "User engagement",
//     },
//     {
//       title: "Authors",
//       value: "0",
//       change: "+0%",
//       changeType: "increase",
//       icon: <Users className="h-4 w-4" />,
//       description: "Active writers",
//     },
//     {
//       title: "Reviews",
//       value: "0",
//       change: "+0%",
//       changeType: "increase",
//       icon: <Star className="h-4 w-4" />,
//       description: "Content reviews",
//     },
//     {
//       title: "Media Files",
//       value: "0",
//       change: "+0%",
//       changeType: "increase",
//       icon: <ImageIcon className="h-4 w-4" />,
//       description: "Images & videos",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="bg-white dark:bg-background rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] animate-pulse"
//           >
//             <div className="flex items-center justify-between pb-2">
//               <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//             </div>
//             <div className="space-y-2">
//               <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//       {stats.map((stat) => (
//         <div
//           key={stat.title}
//           className="bg-white dark:bg-background rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow"
//         >
//           <div className="flex items-center justify-between pb-2">
//             <div className="text-gray-600 dark:text-gray-400">{stat.icon}</div>
//             <div className="flex items-center text-xs">
//               {stat.changeType === "increase" ? (
//                 <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
//               ) : (
//                 <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
//               )}
//               <span
//                 className={`font-medium ${
//                   stat.changeType === "increase"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 {stat.change}
//               </span>
//             </div>
//           </div>

//           <div className="space-y-1">
//             <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
//               {stat.value}
//             </div>
//             <div className="space-y-0.5">
//               <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
//                 {stat.title}
//               </h3>
//               <p className="text-xs text-gray-500 dark:text-gray-500">
//                 {stat.description}
//               </p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }





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
        "https://fillops-server-5fuf.onrender.com/api/users/dashboard"
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
            title: "Topics Learned",
            value: overview.topicsLearned || "0",
            change: "+0%",
            changeType: "increase",
            icon: <Lightbulb className="h-4 w-4" />,
            description: "Topics mastered",
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