// import React from "react"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
// } from "chart.js"
// import { Line, Bar } from "react-chartjs-2"

// // Register chart components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement)

// const contentData = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   datasets: [
//     {
//       label: "Articles Published",
//       data: [45, 52, 48, 61, 55, 67, 73, 69, 76, 82, 78, 85],
//       borderColor: "rgb(59, 130, 246)",
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//       tension: 0.4,
//     },
//     {
//       label: "Page Views (K)",
//       data: [12, 15, 13, 18, 16, 22, 25, 23, 28, 32, 29, 35],
//       borderColor: "rgb(16, 185, 129)",
//       backgroundColor: "rgba(16, 185, 129, 0.1)",
//       tension: 0.4,
//     },
//   ],
// }

// const categoryData = {
//   labels: ["Technology", "Business", "Health", "Sports", "Entertainment", "Politics", "Science"],
//   datasets: [
//     {
//       label: "Articles",
//       data: [156, 142, 98, 87, 76, 65, 54],
//       backgroundColor: [
//         "rgba(59, 130, 246, 0.8)",
//         "rgba(16, 185, 129, 0.8)",
//         "rgba(245, 158, 11, 0.8)",
//         "rgba(239, 68, 68, 0.8)",
//         "rgba(139, 92, 246, 0.8)",
//         "rgba(236, 72, 153, 0.8)",
//         "rgba(6, 182, 212, 0.8)",
//       ],
//       borderColor: [
//         "rgb(59, 130, 246)",
//         "rgb(16, 185, 129)",
//         "rgb(245, 158, 11)",
//         "rgb(239, 68, 68)",
//         "rgb(139, 92, 246)",
//         "rgb(236, 72, 153)",
//         "rgb(6, 182, 212)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// }

// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "top",
//       labels: {
//         usePointStyle: true,
//         padding: 20,
//         font: {
//           size: 12,
//         },
//       },
//     },
//     tooltip: {
//       mode: "index",
//       intersect: false,
//     },
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//       grid: { color: "rgba(0, 0, 0, 0.1)" },
//       ticks: { font: { size: 11 } },
//     },
//     x: {
//       grid: { color: "rgba(0, 0, 0, 0.1)" },
//       ticks: { font: { size: 11 } },
//     },
//   },
//   interaction: {
//     mode: "nearest",
//     axis: "x",
//     intersect: false,
//   },
// }

// export default function ContentChart() {
//   const isMobile = typeof window !== "undefined" && window.innerWidth < 640

//   return (
//     <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
//       {/* Line Chart */}
//       <div className="bg-white dark:bg-background rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23]">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
//             Content Performance
//           </h3>
//           <select className="text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
//             <option>Last 12 months</option>
//             <option>Last 6 months</option>
//             <option>Last 3 months</option>
//           </select>
//         </div>
//         <div className="h-64 sm:h-80">
//           <Line data={contentData} options={chartOptions} />
//         </div>
//       </div>

//       {/* Bar Chart */}
//       <div className="bg-white dark:bg-background rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23]">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
//             Content by Category
//           </h3>
//           <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">This year</span>
//         </div>
//         <div className="h-48 sm:h-64">
//           <Bar data={categoryData} options={chartOptions} />
//         </div>
//       </div>
//     </div>
//   )
// }




import React, { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import useAuthStore from "@/store/authStore"

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement)

const API_BASE = "https://fillops-server-5fuf.onrender.com/api"

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.1)" },
      ticks: { font: { size: 11 } },
    },
    x: {
      grid: { color: "rgba(0, 0, 0, 0.1)" },
      ticks: { font: { size: 11 } },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
}

export default function ContentChart() {
  const [loading, setLoading] = useState(true)
  const [contentData, setContentData] = useState(null)
  const [categoryData, setCategoryData] = useState(null)
  const { fetchWithAuth } = useAuthStore()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        
        const response = await fetchWithAuth(`${API_BASE}/users/analytics/performance`)
        console.log("📊 Analytics Response:", response)

        if (response?.success && response?.data) {
          const { charts } = response.data

          // LINE CHART: Use progressOverTime for daily accuracy and questions
          if (charts?.progressOverTime && charts.progressOverTime.length > 0) {
            const progressData = charts.progressOverTime
            
            const lineChartData = {
              labels: progressData.map(item => {
                const date = new Date(item.date)
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }),
              datasets: [
                {
                  label: "Accuracy (%)",
                  data: progressData.map(item => item.accuracy || 0),
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  tension: 0.4,
                },
                {
                  label: "Questions Answered",
                  data: progressData.map(item => item.questionsAnswered || 0),
                  borderColor: "rgb(16, 185, 129)",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  tension: 0.4,
                },
              ],
            }
            setContentData(lineChartData)
          }

          // BAR CHART: Use subjectPerformance for subjects
          if (charts?.subjectPerformance && charts.subjectPerformance.length > 0) {
            const subjects = charts.subjectPerformance
            
            // Define colors for subjects
            const colors = [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(6, 182, 212, 0.8)",
            ]

            const borderColors = [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
              "rgb(6, 182, 212)",
            ]

            const barChartData = {
              labels: subjects.map(item => item.subject || item.name || "Unknown"),
              datasets: [
                {
                  label: "Accuracy (%)",
                  data: subjects.map(item => item.accuracy || 0),
                  backgroundColor: colors.slice(0, subjects.length),
                  borderColor: borderColors.slice(0, subjects.length),
                  borderWidth: 1,
                },
              ],
            }
            setCategoryData(barChartData)
          }

        } else {
          console.warn("⚠️ No analytics data received")
        }
      } catch (error) {
        console.error("❌ Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [fetchWithAuth])

  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Loading Line Chart */}
        <div className="bg-white dark:bg-background rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-64 sm:h-80 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* Loading Bar Chart */}
        <div className="bg-white dark:bg-background rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-48 sm:h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
      {/* Line Chart - Progress Over Time */}
      <div className="bg-white dark:bg-background rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Daily Performance
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
        </div>
        <div className="h-64 sm:h-80">
          {contentData ? (
            <Line data={contentData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No progress data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart - Subject Performance */}
      <div className="bg-white dark:bg-background rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Subject Performance
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Accuracy by Subject</span>
        </div>
        <div className="h-48 sm:h-64">
          {categoryData ? (
            <Bar data={categoryData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No subject data available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}