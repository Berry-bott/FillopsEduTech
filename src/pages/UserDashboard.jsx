// "use client"

// import { useState } from "react"
// import DashboardLayout from "../components/layouts/DashboardLayout"
// import ProgressCard from "../components/DashboardComponents/user/ProgressCard"
// import StudyPlanCard from "../components/DashboardComponents/user/StudyPlanCard"
// import CalendarWidget from "../components/DashboardComponents/user/CalendarWidget"
// import SubjectCard from "../components/DashboardComponents/user/SubjectCard"
// import Recommendations from "../components/DashboardComponents/user/recommendations"
// import { BookOpen, Target, TrendingUp, Flame } from "lucide-react"

// export default function Dashboard({ onNavigate, learningPath, onChangePath }) {
//   const user = {
//     name: "John Doe",
//     role: "user",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//   }

//   const [selectedSubject, setSelectedSubject] = useState("")

//   const subjects = learningPath?.subjects || [
//     "Mathematics",
//     "English Language",
//     "Physics",
//     "Chemistry",
//   ]

//   const progress = {}
//   subjects.forEach((subject) => {
//     progress[subject] = Math.floor(Math.random() * 100)
//   })

//   const stats = [
//     {
//       icon: <BookOpen className="text-white w-6 h-6" />,
//       label: "Study Hours",
//       value: "24.5",
//       trend: 12,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       icon: <Target className="text-white w-6 h-6" />,
//       label: "Completed Topics",
//       value: "18",
//       trend: 8,
//       color: "from-blue-400 to-blue-500",
//     },
//     {
//       icon: <TrendingUp className="text-white w-6 h-6" />,
//       label: "Average Score",
//       value: "68%",
//       trend: 5,
//       color: "from-blue-300 to-blue-400",
//     },
//     {
//       icon: <Flame className="text-white w-6 h-6" />,
//       label: "Current Streak",
//       value: "7 days",
//       trend: 0,
//       color: "from-blue-500 to-blue-700",
//     },
//   ]

//   const handleSelectSubject = (subject) => {
//     setSelectedSubject(subject)
//     onNavigate?.("subject-detail", subject)
//   }

//   return (
//     <DashboardLayout user={user} currentPage="dashboard" onNavigate={onNavigate}>
//       <div className="space-y-8">
//         {/* Welcome Section */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold mb-2">
//                 Welcome back, {user.name}!
//               </h1>
//               <p className="text-white/80 text-sm md:text-base">
//                 You're studying for{" "}
//                 <span className="font-semibold">
//                   {learningPath?.examType?.toUpperCase() || "WAEC"}
//                 </span>
//               </p>
//             </div>
//             <button
//               onClick={onChangePath}
//               className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium text-sm md:text-base flex items-center gap-2"
//             >
//               Change Exam Type →
//             </button>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {stats.map((stat, idx) => (
//             <div
//               key={idx}
//               className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
//             >
//               <div
//                 className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}
//               >
//                 {stat.icon}
//               </div>
//               <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
//               <div className="flex items-end justify-between">
//                 <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
//                 <p className="text-xs text-blue-600 font-semibold">
//                   +{stat.trend}%
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Subjects Section */}
//         <section>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">Your Subjects</h2>
//             <p className="text-sm text-gray-500">{subjects.length} subjects selected</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

//         {/* Progress + Calendar */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">
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

//         {/* Recommendations + Study Plan */}
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
import CalendarWidget from "../components/DashboardComponents/user/CalendarWidget"
import StudyPlanCard from "../components/DashboardComponents/user/StudyPlanCard"
import { BookOpen, Target, TrendingUp, Flame, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"

export default function Dashboard() {
  const user = {
    name: "John Doe",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  }

  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("") // JAMB or PUTME
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [error, setError] = useState("")

  const courses = {
    "WAEC/NECO": [
      "English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Agricultural Science",
      "Economics", "Government", "Geography", "Commerce", "Accounting", "Literature in English",
      "Civic Education", "Further Mathematics", "Christian Religious Studies", "Islamic Religious Studies",
      "History", "Food & Nutrition", "Technical Drawing", "Computer Studies",
    ],
    JAMB: [
      "Use of English", "Mathematics", "Physics", "Chemistry"
    ],
    PUTME: [
      "Use of English", "Mathematics", "Physics", "Chemistry", "Biology",
      "Economics", "Government", "Literature in English", "Commerce",
    ],
  }

  const stats = [
    { icon: <BookOpen className="text-white w-6 h-6" />, label: "Study Hours", value: "24.5", color: "from-blue-500 to-blue-600" },
    { icon: <Target className="text-white w-6 h-6" />, label: "Completed Topics", value: "18", color: "from-blue-400 to-blue-500" },
    { icon: <TrendingUp className="text-white w-6 h-6" />, label: "Average Score", value: "68%", color: "from-blue-300 to-blue-400" },
    { icon: <Flame className="text-white w-6 h-6" />, label: "Current Streak", value: "7 days", color: "from-blue-500 to-blue-700" },
  ]

  const handleCourseToggle = (course) => {
    setError("")
    const isJamb = subCategory === "JAMB"

    if (isJamb) {
      if (selectedCourses.includes(course)) {
        setSelectedCourses(selectedCourses.filter((c) => c !== course))
      } else if (selectedCourses.length >= 4) {
        setError("You can only select 4 subjects for JAMB.")
      } else {
        setSelectedCourses([...selectedCourses, course])
      }
    } else {
      setSelectedCourses((prev) =>
        prev.includes(course)
          ? prev.filter((c) => c !== course)
          : [...prev, course]
      )
    }
  }

  const handleStart = () => {
    const activeCategory = subCategory || category
    if (!activeCategory) return alert("Please select a category first.")
    if (selectedCourses.length === 0)
      return alert("Please select at least one subject.")
    if (subCategory === "JAMB" && selectedCourses.length !== 4)
      return alert("Please select exactly 4 subjects for JAMB.")
    alert(`🚀 Starting ${activeCategory} study with ${selectedCourses.join(", ")}`)
  }

  return (
    <DashboardLayout user={user} currentPage="dashboard">
      <div className="space-y-10">
        {/* === Welcome Section === */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white shadow-md">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name} 👋</h1>
          <p className="text-white/80">Select your exam category and subjects to begin your study plan.</p>
        </div>

        {/* === Category Section === */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Category</h2>
          <div className="flex flex-wrap gap-4">
            {/* WAEC/NECO */}
            <button
              onClick={() => {
                setCategory("WAEC/NECO")
                setSubCategory("")
                setSelectedCourses([])
                setDropdownOpen(false)
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base shadow-sm ${
                category === "WAEC/NECO"
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg scale-105"
                  : "bg-white border border-gray-300 hover:bg-blue-50 text-gray-700"
              }`}
            >
              WAEC / NECO
            </button>

            {/* JAMB/PUTME Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen)
                  setCategory("JAMB/PUTME")
                }}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 text-sm sm:text-base shadow-sm ${
                  category === "JAMB/PUTME"
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg scale-105"
                    : "bg-white border border-gray-300 hover:bg-blue-50 text-gray-700"
                }`}
              >
                JAMB / PUTME
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-200 shadow-lg rounded-xl w-40 z-10 overflow-hidden">
                  {["JAMB", "PUTME"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSubCategory(option)
                        setSelectedCourses([])
                        setDropdownOpen(false)
                        setError("")
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                        subCategory === option ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* === Subject List === */}
        {(category || subCategory) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {subCategory || category} Subjects
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {subCategory === "JAMB"
                ? "Select exactly 4 subjects."
                : "Select any subjects you want to study."}
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-2 rounded-lg mb-3">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(courses[subCategory] || courses[category] || []).map((course) => {
                const selected = selectedCourses.includes(course)
                return (
                  <button
                    key={course}
                    onClick={() => handleCourseToggle(course)}
                    className={`p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-between shadow-sm ${
                      selected
                        ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white border-transparent scale-105 shadow-md"
                        : "bg-white border border-gray-200 hover:bg-blue-50 text-gray-700"
                    }`}
                  >
                    {course}
                    {selected && <CheckCircle className="w-5 h-5 text-white ml-2" />}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* === Start Button === */}
        {selectedCourses.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-10 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Start Studying →
            </button>
          </div>
        )}

        {/* === Stats + Calendar === */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyPlanCard />
          <CalendarWidget />
        </section>
      </div>
    </DashboardLayout>
  )
}
