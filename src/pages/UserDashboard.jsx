

// "use client"

// import { useState } from "react"
// import DashboardLayout from "../components/layouts/DashboardLayout"
// import ProgressCard from "../components/DashboardComponents/user/ProgressCard"
// import StudyPlanCard from "../components/DashboardComponents/user/StudyPlanCard"
// import CalendarWidget from "../components/DashboardComponents/user/CalendarWidget"
// import SubjectCard from "../components/DashboardComponents/user/SubjectCard"
// import Recommendations from "../components/DashboardComponents/user/Recommendations"

// export default function Dashboard({ onNavigate, learningPath, onChangePath }) {
//   // 🧩 Manually set user for now
//   const user = {
//     name: "John Doe",
//     role: "user",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg"
//   }
  

//   const [selectedSubject, setSelectedSubject] = useState("")

//   const subjects = learningPath?.subjects || [
//     "Mathematics",
//     "English Language",
//     "Physics",
//     "Chemistry",
//   ]

//   // Generate random progress for demo
//   const progress = {}
//   subjects.forEach((subject) => {
//     progress[subject] = Math.floor(Math.random() * 100)
//   })

//   const stats = [
//     { icon: "📚", label: "Study Hours", value: "24.5", trend: 12, color: "from-blue-500 to-blue-600" },
//     { icon: "🎯", label: "Completed Topics", value: "18", trend: 8, color: "from-purple-500 to-purple-600" },
//     { icon: "📈", label: "Average Score", value: "68%", trend: 5, color: "from-green-500 to-green-600" },
//     { icon: "🔥", label: "Current Streak", value: "7 days", trend: 0, color: "from-orange-500 to-orange-600" },
//   ]

//   const handleSelectSubject = (subject) => {
//     setSelectedSubject(subject)
//     onNavigate?.("subject-detail", subject)
//   }

//   return (
//     <DashboardLayout user={user} currentPage="dashboard" onNavigate={onNavigate}>
//       <div className="space-y-8">
//         {/* Welcome Section */}
//         <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-heading font-bold mb-2">
//                 Welcome back, {user.name}!
//               </h1>
//               <p className="text-white/80">
//                 You're studying for{" "}
//                 <span className="font-semibold">
//                   {learningPath?.examType === "jamb"
//                     ? "JAMB (UTME)"
//                     : learningPath?.examType === "neco"
//                     ? "NECO"
//                     : "WAEC"}
//                 </span>
//               </p>
//             </div>
//             <button
//               onClick={onChangePath}
//               className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium flex items-center gap-2"
//             >
//               Change Exam Type →
//             </button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {stats.map((stat, idx) => (
//             <div
//               key={idx}
//               className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition"
//             >
//               <div
//                 className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4 text-2xl`}
//               >
//                 {stat.icon}
//               </div>
//               <p className="text-sm text-foreground/60 font-medium mb-1">{stat.label}</p>
//               <div className="flex items-end justify-between">
//                 <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
//                 <p className="text-xs text-green-600 font-semibold">+{stat.trend}%</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Subjects Section */}
//         <section>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-heading font-bold text-foreground">Your Subjects</h2>
//             <p className="text-sm text-foreground/60">{subjects.length} subjects selected</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {subjects.map((subject) => (
//               <SubjectCard
//                 key={subject}
//                 subject={subject}
//                 progress={progress[subject]}
//                 onSelect={handleSelectSubject}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Progress & Calendar */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <h2 className="text-xl font-heading font-bold text-foreground mb-4">
//               Study Progress
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {subjects.map((subject) => (
//                 <ProgressCard key={subject} subject={subject} progress={progress[subject]} />
//               ))}
//             </div>
//           </div>
//           <div>
//             <CalendarWidget />
//           </div>
//         </section>

//         {/* Recommendations & Study Plan */}
//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Recommendations user={user} />
//           <StudyPlanCard />
//         </section>
//       </div>
//     </DashboardLayout>
//   )
// }




"use client"

import { useState } from "react"
import DashboardLayout from "../components/layouts/DashboardLayout"
import ProgressCard from "../components/DashboardComponents/user/ProgressCard"
import StudyPlanCard from "../components/DashboardComponents/user/StudyPlanCard"
import CalendarWidget from "../components/DashboardComponents/user/CalendarWidget"
import SubjectCard from "../components/DashboardComponents/user/SubjectCard"
import Recommendations from "../components/DashboardComponents/user/Recommendations"
import { BookOpen, Target, TrendingUp, Flame } from "lucide-react"

export default function Dashboard({ onNavigate, learningPath, onChangePath }) {
  const user = {
    name: "John Doe",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  }

  const [selectedSubject, setSelectedSubject] = useState("")

  const subjects = learningPath?.subjects || [
    "Mathematics",
    "English Language",
    "Physics",
    "Chemistry",
  ]

  const progress = {}
  subjects.forEach((subject) => {
    progress[subject] = Math.floor(Math.random() * 100)
  })

  const stats = [
    {
      icon: <BookOpen className="text-white w-6 h-6" />,
      label: "Study Hours",
      value: "24.5",
      trend: 12,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Target className="text-white w-6 h-6" />,
      label: "Completed Topics",
      value: "18",
      trend: 8,
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: <TrendingUp className="text-white w-6 h-6" />,
      label: "Average Score",
      value: "68%",
      trend: 5,
      color: "from-blue-300 to-blue-400",
    },
    {
      icon: <Flame className="text-white w-6 h-6" />,
      label: "Current Streak",
      value: "7 days",
      trend: 0,
      color: "from-blue-500 to-blue-700",
    },
  ]

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject)
    onNavigate?.("subject-detail", subject)
  }

  return (
    <DashboardLayout user={user} currentPage="dashboard" onNavigate={onNavigate}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                You're studying for{" "}
                <span className="font-semibold">
                  {learningPath?.examType?.toUpperCase() || "WAEC"}
                </span>
              </p>
            </div>
            <button
              onClick={onChangePath}
              className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium text-sm md:text-base flex items-center gap-2"
            >
              Change Exam Type →
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}
              >
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                <p className="text-xs text-blue-600 font-semibold">
                  +{stat.trend}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Subjects Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Subjects</h2>
            <p className="text-sm text-gray-500">{subjects.length} subjects selected</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject}
                subject={subject}
                progress={progress[subject]}
                onSelect={handleSelectSubject}
              />
            ))}
          </div>
        </section>

        {/* Progress + Calendar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Study Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <ProgressCard key={subject} subject={subject} progress={progress[subject]} />
              ))}
            </div>
          </div>
          <div>
            <CalendarWidget />
          </div>
        </section>

        {/* Recommendations + Study Plan */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Recommendations user={user} />
          <StudyPlanCard />
        </section>
      </div>
    </DashboardLayout>
  )
}
