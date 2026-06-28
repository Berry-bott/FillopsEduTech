import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileQuestion, GraduationCap, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import useAuthStore from "@/store/authStore"

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const getPerformanceStatus = (accuracy) => {
  if (accuracy >= 75) return { 
    label: "Strong", icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400", 
    bg: "bg-emerald-100 dark:bg-emerald-900/30" }
  if (accuracy >= 60) return { label: "Average", icon: Minus, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" }
  if (accuracy >= 50) return { label: "Weak", icon: TrendingDown, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" }
  return { label: "Poor", icon: TrendingDown, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" }
}


// Custom tooltip component with smart positioning

const CustomTooltip = ({ active, payload, coordinate, viewBox }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const performance = getPerformanceStatus(data.accuracy)
    const PerformanceIcon = performance.icon

    // Calculate position relative to chart center
    const chartCenterX = viewBox?.width ? viewBox.width / 2 : 0
    const currentX = coordinate?.x || 0
    const isOnRightSide = currentX > chartCenterX

    return (
      <div className="relative">
        {/* Arrow positioned based on tooltip side */}
        <div 
          className="absolute -top-2 left-0 w-0 h-0 border-l-[10px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-950"
          style={{
            left: isOnRightSide ? 'auto' : '106px',
            right: isOnRightSide ? '169px' : 'auto'
          }}
        />
        
        <div className="bg-gray-900 dark:bg-gray-950 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-2xl border border-gray-700 dark:border-gray-600 w-[180px] sm:min-w-[200px] sm:max-w-[280px]">
          {/* Header with icon and name */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-gray-700">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: data.color }}
            />
            <p className="font-bold text-white text-xs sm:text-sm truncate">{data.name}</p>
            {performance && (
              <Badge className={`${performance.bg} ${performance.color} border-0 text-[10px] sm:text-[10px] px-1.5 sm:px-2 py-0 font-bold ml-auto flex-shrink-0`}>
                {performance.label}
              </Badge>
            )}
          </div>
          
          {/* Stats in flex layout */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs">
            {/* Left side - Completion */}
            <div className="flex flex-col">
              <p className="text-gray-400 text-[9px] sm:text-[10px] mb-0.5">Completed</p>
              <p className="text-white font-bold text-[11px] sm:text-xs">{data.value}/{data.totalAttempts}</p>
            </div>
            
            {/* Divider */}
            <div className="h-6 sm:h-8 w-px bg-gray-700" />
            
            {/* Right side - Accuracy */}
            <div className="flex flex-col items-end">
              <p className="text-gray-400 text-[9px] sm:text-[10px] mb-0.5">Accuracy</p>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <PerformanceIcon className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${performance.color}`} />
                <p className={`font-bold text-[11px] sm:text-xs ${performance.color}`}>{data.accuracy}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

// Custom label for pie slices
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 30
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      className="text-sm font-semibold fill-gray-700 dark:fill-gray-300"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {name}
    </text>
  )
}

export default function StudyStatsPieChart() {
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState([])
  const { fetchWithAuth } = useAuthStore()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch from analytics/performance endpoint
        const response = await fetchWithAuth(`${API_BASE}/users/analytics/performance`)
        console.log("📊 Performance Analytics Response:", response)

        if (response?.success && response?.data) {
          const { charts, topicAnalysis, timeVsPerformance } = response.data
          
          // Calculate overall statistics from the available data
          const totalQuestions = charts?.progressOverTime?.reduce(
            (sum, day) => sum + (day.questionsAnswered || 0), 0
          ) || 0
          
          const avgAccuracy = charts?.progressOverTime?.length > 0
            ? Math.round(
                charts.progressOverTime.reduce((sum, day) => sum + (day.accuracy || 0), 0) / 
                charts.progressOverTime.length
              )
            : 0

          // Get subject performance data
          const subjectPerf = charts?.subjectPerformance || []
          
          // Calculate stats by category using available data
          const studySessionsData = subjectPerf.length > 0 ? {
            completed: charts.progressOverTime?.length || 0,
            total: charts.progressOverTime?.length || 0,
            accuracy: avgAccuracy
          } : { completed: 0, total: 0, accuracy: 0 }

          const quizzesData = {
            completed: totalQuestions > 0 ? Math.floor(totalQuestions / 20) : 0, // Estimate based on questions
            total: totalQuestions > 0 ? Math.floor(totalQuestions / 20) : 0,
            accuracy: avgAccuracy
          }

          const examsData = topicAnalysis?.all ? {
            completed: topicAnalysis.all.length,
            total: topicAnalysis.all.length,
            accuracy: topicAnalysis.all.length > 0 
              ? Math.round(
                  topicAnalysis.all.reduce((sum, topic) => sum + (topic.accuracy || 0), 0) / 
                  topicAnalysis.all.length
                )
              : 0
          } : { completed: 0, total: 0, accuracy: 0 }
          
          const stats = [
            {
              name: "Study Sessions",
              value: studySessionsData.completed,
              totalAttempts: studySessionsData.total,
              accuracy: studySessionsData.accuracy,
              color: "#0EA5E9",
              icon: BookOpen,
              description: "Completed study sessions",
            },
            {
              name: "Quizzes",
              value: quizzesData.completed,
              totalAttempts: quizzesData.total,
              accuracy: quizzesData.accuracy,
              color: "#FACC15",
              icon: FileQuestion,
              description: "Quiz attempts",
            },
            {
              name: "Exams",
              value: examsData.completed,
              totalAttempts: examsData.total,
              accuracy: examsData.accuracy,
              color: "#22C55E",
              icon: GraduationCap,
              description: "Practice exams taken",
            },
          ]

          console.log("📊 Mapped Stats:", stats)
          setStatsData(stats)
        } else {
          console.warn("⚠️ No performance data received")
          setStatsData(getDefaultStats())
        }
      } catch (error) {
        console.error("❌ Error fetching performance stats:", error)
        setStatsData(getDefaultStats())
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [fetchWithAuth])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-[280px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const COLORS = statsData.map(item => item.color)
  const total = statsData.reduce((sum, item) => sum + item.value, 0)

  const sortedByAccuracy = [...statsData].sort((a, b) => b.accuracy - a.accuracy)
  const strongest = sortedByAccuracy[0]
  const weakest = sortedByAccuracy[sortedByAccuracy.length - 1]

  const overallAccuracy = statsData.length > 0
    ? Math.round(statsData.reduce((sum, item) => sum + item.accuracy, 0) / statsData.length)
    : 0

  return (
    <div className="bg-white dark:bg-background rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Analysis</h3>
        <Badge variant="outline" className="text-xs font-semibold border-2 ">
          Last 30 Days
        </Badge>
      </div>

      {/* Pie Chart */}
      {total > 0 ? (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={90}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={3}
                stroke="none"
              >
                {statsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />} 
                wrapperStyle={{ 
                  outline: 'none',
                  pointerEvents: 'none',
                   transition: 'all 0.5s ease-out'
                }}
                cursor={false}
                offset={15}
                allowEscapeViewBox={{ x: false, y: true }}
                isAnimationActive={true}
                animationDuration={100}
                animationEasing="ease-out"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mb-6 h-[280px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No activity data yet</p>
        </div>
      )}

    {/* Three Cards: Study, Quiz, Exams */}
{overallAccuracy > 0 && (
  <div className="flex flex-col gap-3 mb-5 md:grid md:grid-cols-3">
    {statsData.map((item) => {
      const Icon = item.icon
      const performance = getPerformanceStatus(item.accuracy)
      const PerformanceIcon = performance.icon

      return (
        <div
          key={item.name}
          className="py-2 px-4 bg-white dark:bg-background rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer group"
          style={{ borderColor: item.color }}
        >
        <div className="flex justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Icon className="h-4 w-4" style={{ color: item.color }} />
            </div>
            {item.accuracy > 0 && (
              <Badge className={`${performance.bg} ${performance.color} border-0 text-[9px] px-1.5 py-0 font-bold`}>
                {performance.label}
              </Badge>
            )}
          </div>

          <p className="text-md font-bold text-gray-900 dark:text-white mb-1">
            {item.name}
          </p>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <p
              className="text-2xl font-bold"
              style={{ color: item.color }}
            >
              {item.accuracy}%
            </p>
            <PerformanceIcon className={`h-3 w-3 ${performance.color}`} />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {item.value}/{item.totalAttempts} completed
          </p>
        </div>
      )
    })}
  </div>
)}

      {/* Detailed Stats */}
      <div className="space-y-2">
        {statsData.map((item) => {
          const Icon = item.icon
          const performance = getPerformanceStatus(item.accuracy)
          const PerformanceIcon = performance.icon

          return (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all group border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    {item.accuracy > 0 && (
                      <Badge className={`${performance.bg} ${performance.color} border-0 text-[10px] px-2 py-0.5 font-bold`}>
                        {performance.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {item.value}/{item.totalAttempts} completed
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="text-right">
                  {item.accuracy > 0 ? (
                    <>
                      <div className="flex items-center justify-end gap-1.5">
                        <PerformanceIcon className={`h-4 w-4 ${performance.color}`} />
                        <p className={`text-lg font-bold ${performance.color}`}>
                          {item.accuracy}%
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        accuracy
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                      No data
                    </p>
                  )}
                </div>
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall Performance with Motivational Message */}
      {overallAccuracy > 0 && (
        <div className="mt-5 pt-5 border-t-2 border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Overall Accuracy</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {overallAccuracy}%
            </span>
          </div>

          {/* Motivational Message */}
          <div className={`px-2 rounded-xl border-2 ${
            overallAccuracy >= 75 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-700'
              : overallAccuracy >= 60
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700'
              : overallAccuracy >= 50
              ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/20 border-orange-300 dark:border-orange-700'
              : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/20 border-red-300 dark:border-red-700'
          }`}>
            {overallAccuracy >= 75 ? (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">🎉</div>
                <div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    Well Done! Excellent Performance!
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    You're doing amazing! Keep up this outstanding work. You're mastering the material and showing great consistency.
                  </p>
                </div>
              </div>
            ) : overallAccuracy >= 60 ? (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">👍</div>
                <div>
                  <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                    Good Job! You're Making Progress
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    You're on the right track! Focus on your weaker areas and practice more questions to boost your performance even higher.
                  </p>
                </div>
              </div>
            ) : overallAccuracy >= 50 ? (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">📚</div>
                <div>
                  <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-1">
                    Keep Going! You Can Do Better
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">
                    You're getting there! Review your mistakes and practice the topics where you're struggling. Consistency is key to improvement.
                  </p>
                  {weakest && (
                    <div className="mt-2 pt-2 border-t border-orange-200 dark:border-orange-800">
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                        💡 Focus on: <span className="underline">{weakest.name}</span> - Currently at {weakest.accuracy}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">💪</div>
                <div>
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">
                    Time to Step Up! Serious Improvement Needed
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                    Don't give up! You need more practice. Review fundamentals, take your time with each question, and practice daily to see real progress.
                  </p>
                  {weakest && (
                    <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        🚨 Priority: <span className="underline">{weakest.name}</span> - Currently at {weakest.accuracy}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}