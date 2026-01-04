// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../../store/authStore";
// import { TypeAnimation } from "react-type-animation";
// import { GraduationCap, Briefcase, Target, ExternalLink } from "lucide-react";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// const EXAMS = {
//   waec: { label: "WAEC", limit: 9 },
//   neco: { label: "NECO", limit: 9 },
//   jamb: { label: "JAMB", limit: 4 },
//   putme: { label: "PUTME", limit: 4 },
// };

// export default function PreferencePage() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const user = useAuthStore((state) => state.user);
//   const accessToken = useAuthStore((state) => state.accessToken);

//   // ================= OPTIONS FROM BACKEND =================
//   const [tracks, setTracks] = useState([]);
//   const [hobbies, setHobbies] = useState([]);
//   const [goals, setGoals] = useState([]);
//   const [examCategories, setExamCategories] = useState({});

//   // ================= USER SELECTIONS =================
//   const [step, setStep] = useState(0); // Start from step 0
//   const [currentExamTab, setCurrentExamTab] = useState("waec"); // Current tab in Step 5
//   const [selectedCourseType, setSelectedCourseType] = useState("");
//   const [selectedTrack, setSelectedTrack] = useState("");
//   const [selectedHobbies, setSelectedHobbies] = useState([]);
//   const [selectedGoals, setSelectedGoals] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState({});

//   // ================= FETCH OPTIONS FROM BACKEND =================
//   useEffect(() => {
//     if (!accessToken) return;

//     setLoading(true);
//     setError("");

//     fetch(`${API_BASE}/preferences/options`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch preference options");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched options:", data);
        
//         const apiData = data.data || data;
        
//         setTracks(apiData.tracks || []);
//         setHobbies(apiData.hobbies || []);
//         setGoals(apiData.goals || []);
//         setExamCategories(apiData.examCategories || {});
//       })
//       .catch((err) => {
//         setError("Unable to load preference options");
//         console.error(err);
//       })
//       .finally(() => setLoading(false));
//   }, [accessToken]);

//   // ================= TOGGLE HELPERS =================
//   const toggleItemWithId = (item, selectedArray, setArray) => {
//     if (typeof item === 'object' && item.id) {
//       const isSelected = selectedArray.some(sel => 
//         typeof sel === 'object' ? sel.id === item.id : sel === item.name
//       );
      
//       if (isSelected) {
//         setArray(selectedArray.filter(sel => 
//           typeof sel === 'object' ? sel.id !== item.id : sel !== item.name
//         ));
//       } else {
//         setArray([...selectedArray, item]);
//       }
//     } else {
//       if (selectedArray.includes(item)) {
//         setArray(selectedArray.filter((i) => i !== item));
//       } else {
//         setArray([...selectedArray, item]);
//       }
//     }
//   };

//   const toggleSubject = (examKey, sub) => {
//     const current = selectedSubjects[examKey] || [];
//     const exists = current.some((s) => s.id === sub.id);

//     let updated;

//     if (exists) {
//       updated = current.filter((s) => s.id !== sub.id);
//     } else {
//       if (current.length >= EXAMS[examKey].limit) {
//         alert(`You can only select up to ${EXAMS[examKey].limit} subjects for ${EXAMS[examKey].label}`);
//         return;
//       }
//       updated = [
//         ...current, 
//         {
//           id: sub.id,
//           name: sub.subjectName || sub.name,
//         }
//       ];
//     }

//     setSelectedSubjects({
//       ...selectedSubjects,
//       [examKey]: updated,
//     });
//   };

//   // ================= STEP NAVIGATION =================
//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   // ================= GET SUBJECTS FOR EXAM =================
//   const getSubjectsForExam = (examKey) => {
//     return examCategories[examKey.toUpperCase()]?.subjects || [];
//   };

//   // ================= SUBMIT VALIDATION =================
//   const canSubmit = () => {
//     return Object.keys(EXAMS).every((examKey) => {
//       const selected = selectedSubjects[examKey] || [];
//       return selected.length > 0;
//     });
//   };

//   // ================= SUBMIT TO BACKEND =================
//   const submit = async () => {
//     const formattedSubjects = {};
    
//     Object.keys(EXAMS).forEach((examKey) => {
//       const examLabel = EXAMS[examKey]?.label;
//       if (examLabel && selectedSubjects[examKey]) {
//         formattedSubjects[examLabel] = selectedSubjects[examKey].map((s) => s.id);
//       }
//     });

//     const extractId = (item) => {
//       if (typeof item === 'object' && item !== null) {
//         return item.id;
//       }
//       return item;
//     };

//     const payload = {
//       track: extractId(selectedTrack).toUpperCase(),
//       hobbies: selectedHobbies.map(extractId),
//       goals: selectedGoals.map(extractId),
//       subjects: formattedSubjects,
//     };

//     console.log("=== SUBMITTING ===");
//     console.log(JSON.stringify(payload, null, 2));

//     setSubmitting(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_BASE}/preferences`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
      
//       console.log("Response:", data);

//       if (!res.ok) {
//         const errorMessage = data.message || data.error || "Failed to save preferences";
//         const validationErrors = data.errors || data.validationErrors;
        
//         if (validationErrors) {
//           console.error("Validation errors:", validationErrors);
//           throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
//         }
        
//         throw new Error(errorMessage);
//       }

//       useAuthStore.setState((state) => ({
//         user: { ...state.user, onboardingCompleted: true }
//       }));

//       navigate("/user/dashboard", { replace: true });
//     } catch (err) {
//       setError(err.message || "Failed to save preferences");
//       console.error("Submit error:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const slideIn = (content) => (
//     <div className="transition-transform duration-500 transform translate-x-0">{content}</div>
//   );

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto p-16">
//         <h1 className="text-4xl font-merriweather my-10 text-center text-primary">
//           Loading...
//         </h1>
//         <div className="grid grid-cols-2 gap-3">
//           {Array(6).fill(0).map((_, idx) => (
//             <div key={idx} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error && !tracks.length) {
//     return (
//       <div className="max-w-3xl mx-auto p-16">
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
//           {error}
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-16">
//       {/* TITLE */}
//       <h1 className="text-4xl font-merriweather my-10 text-center text-primary">
//         {step === 0 ? (
//           "What do you want to study on our platform today?"
//         ) : step === 5 ? (
//           "Select Your Subjects"
//         ) : (
//           <TypeAnimation
//             sequence={["Let's Get to Know You Better!", 10000, "", 500]}
//             speed={50}
//             cursor={true}
//             repeat={Infinity}
//           />
//         )}
//       </h1>

//       {/* STEP INDICATOR */}
//       {step > 0 && (
//         <p className="text-center mb-6 text-gray-500">
//           Step {step} / 5
//         </p>
//       )}

//       {/* STEP 1: COURSE SELECTION */}
//       {step === 1 &&
//         slideIn(
//           <div className="mb-10">
//             <p className="text-center text-gray-600 mb-10 text-lg">
//               Choose your learning path to get started
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
//               {/* COMMERCIAL COURSES - MODERN & CLASSY */}
//               <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-400 transition-all duration-300 overflow-hidden">
//                 {/* Subtle gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
//                 <div className="relative p-8">
//                   {/* Icon */}
//                   <div className="mb-6">
//                     <div className="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
//                       <GraduationCap className="w-8 h-8" strokeWidth={1.5} />
//                     </div>
//                   </div>

//                   {/* Title */}
//                   <h3 className="text-2xl font-semibold text-primary mb-2">
//                     Commercial Courses
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-2">
//                     Comprehensive exam preparation
//                   </p>

//                   {/* Description */}
//                   <div className="mb-6">
//                     <p className="text-gray-700 leading-relaxed">
//                       Prepare for: <br />
//                       <span className="font-medium text-primary-hover">WAEC, </span>
//                       <span className="font-medium text-primary-hover">NECO</span><br/>
//                       <span className="font-medium text-primary-hover">JAMB, </span>
//                       <span className="font-medium text-primary-hover">PUTME</span> 
//                       <br />with curated study materials and practice tests.
//                     </p>
//                   </div>

//                   {/* Features */}
//                   <div className="space-y-3 mb-8">
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
//                       <span>Structured learning paths</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
//                       <span>Practice questions & tests</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
//                       <span>Performance tracking</span>
//                     </div>
//                   </div>

//                   {/* Button */}
//                   <button
//                     onClick={() => {
//                       setSelectedCourseType("commercial");
//                       nextStep();
//                     }}
//                     className="w-full px-6 py-3 bg-primary hover:bg-primary-hover/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/btn"
//                   >
//                     <span>Get Started</span>
//                     <Target className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2} />
//                   </button>
//                 </div>
//               </div>

//               {/* PROFESSIONAL COURSE - MODERN & CLASSY */}
//               <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-400 transition-all duration-300 overflow-hidden">
//                 {/* Subtle gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
//                 <div className="relative p-8">
//                   {/* Icon */}
//                   <div className="mb-6">
//                     <div className="inline-flex p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
//                       <Briefcase className="w-8 h-8" strokeWidth={1.5} />
//                     </div>
//                   </div>

//                   {/* Title */}
//                   <h3 className="text-2xl font-semibold text-primary mb-2">
//                     Professional Course
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-6">
//                     Career advancement programs
//                   </p>

//                   {/* Description */}
//                   <div className="mb-6">
//                     <p className="text-gray-700 leading-relaxed">
//                       Industry-recognized certifications and professional training to accelerate your career growth.
//                     </p>
//                   </div>

//                   {/* Features */}
//                   <div className="space-y-3 mb-8">
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
//                       <span>Expert-led training</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
//                       <span>Industry certifications</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
//                       <span>Career support</span>
//                     </div>
//                   </div>

//                   {/* Button */}
//                   <a
//                     href="https://yourprofessionalcourse.com"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-full px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/btn"
//                   >
//                     <span>Explore</span>
//                     <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" strokeWidth={2} />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       {/* STEP 2: TRACK */}
//       {step === 2 &&
//         slideIn(
//           <div className="mb-10">
//             <p className="text-center text-primary-hover mb-6 mt-20">
//               Select your track/interest
//             </p>
//             <div className="flex gap-4 flex-wrap justify-center">
//               {tracks.map((track) => {
//                 const trackValue = typeof track === 'string' ? track : track.name;
//                 const trackId = typeof track === 'string' ? track : track.id;
                
//                 return (
//                   <button
//                     key={trackId}
//                     onClick={() => setSelectedTrack(track)}
//                     className={`px-4 py-2 rounded-full border font-semibold transition ${
//                       selectedTrack === track
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
//                     }`}
//                   >
//                     {trackValue}
//                   </button>
//                 );
//               })}
//             </div>
//             <div className="mt-20 text-center flex justify-between">
//               <button
//                 onClick={prevStep}
//                 className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={nextStep}
//                 disabled={!selectedTrack}
//                 className="bg-primary text-white px-12 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//       {/* STEP 2: HOBBIES */}
//       {step === 3 &&
//         slideIn(
//           <div className="mb-10">
//             <p className="text-center text-primary-hover mb-6 mt-20">
//               What are your hobbies?
//             </p>
//             <div className="flex gap-4 flex-wrap justify-center">
//               {hobbies.map((hobby) => {
//                 const hobbyValue = typeof hobby === 'string' ? hobby : hobby.name;
//                 const hobbyId = typeof hobby === 'string' ? hobby : hobby.id;
                
//                 const isSelected = selectedHobbies.some(h => 
//                   typeof h === 'object' ? h.id === hobbyId : h === hobbyValue
//                 );
                
//                 return (
//                   <button
//                     key={hobbyId}
//                     onClick={() => toggleItemWithId(hobby, selectedHobbies, setSelectedHobbies)}
//                     className={`px-4 py-2 rounded-full border font-semibold transition ${
//                       isSelected
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
//                     }`}
//                   >
//                     {hobbyValue}
//                   </button>
//                 );
//               })}
//             </div>
//             <div className="mt-20 text-center flex justify-between">
//               <button
//                 onClick={prevStep}
//                 className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={nextStep}
//                 disabled={!selectedHobbies.length}
//                 className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//       {/* STEP 3: GOALS */}
//       {step === 4 &&
//         slideIn(
//           <div className="mb-10">
//             <p className="text-center text-primary-hover mb-6 -mt-4">
//               What are your goals?
//             </p>
//             <div className="flex gap-4 flex-wrap justify-center">
//               {goals.map((goal) => {
//                 const goalValue = typeof goal === 'string' ? goal : goal.name;
//                 const goalId = typeof goal === 'string' ? goal : goal.id;
                
//                 const isSelected = selectedGoals.some(g => 
//                   typeof g === 'object' ? g.id === goalId : g === goalValue
//                 );
                
//                 return (
//                   <button
//                     key={goalId}
//                     onClick={() => toggleItemWithId(goal, selectedGoals, setSelectedGoals)}
//                     className={`px-4 py-2 rounded-full border font-semibold transition ${
//                       isSelected
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
//                     }`}
//                   >
//                     {goalValue}
//                   </button>
//                 );
//               })}
//             </div>
//             <div className="mt-8 text-center flex justify-between">
//               <button
//                 onClick={prevStep}
//                 className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={nextStep}
//                 disabled={!selectedGoals.length}
//                 className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//       {/* STEP 5: SUBJECTS WITH EXAM TABS */}
//       {step === 5 &&
//         slideIn(
//           <div>
//             {/* Exam Category Tabs */}
//             <div className="flex gap-3 justify-center mb-8 flex-wrap">
//               {Object.entries(EXAMS).map(([key, val]) => {
//                 const selectedCount = selectedSubjects[key]?.length || 0;
//                 const hasSelection = selectedCount > 0;

//                 return (
//                   <button
//                     key={key}
//                     onClick={() => setCurrentExamTab(key)}
//                     className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                       currentExamTab === key
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span>{val.label}</span>
//                       {hasSelection && (
//                         <span className={`text-xs px-2 py-0.5 rounded-full ${
//                           currentExamTab === key
//                             ? "bg-blue-500 text-white"
//                             : "bg-blue-100 text-blue-600"
//                         }`}>
//                           {selectedCount}/{val.limit}
//                         </span>
//                       )}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Current Tab Info */}
//             <div className="text-center mb-6">
//               <h3 className="text-xl font-semibold text-gray-900">
//                 {EXAMS[currentExamTab].label} Subjects
//               </h3>
//               <p className="text-sm text-gray-600 mt-1">
//                 Select up to {EXAMS[currentExamTab].limit} subjects
//               </p>
//             </div>

//             {/* Subjects for Current Tab */}
//             {getSubjectsForExam(currentExamTab).length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                 {getSubjectsForExam(currentExamTab).map((sub) => {
//                   const isSelected = selectedSubjects[currentExamTab]?.some(
//                     (s) => s.id === sub.id
//                   );

//                   return (
//                     <button
//                       key={sub.id}
//                       onClick={() => toggleSubject(currentExamTab, sub)}
//                       className={`p-3 rounded-lg border transition-all ${
//                         isSelected
//                           ? "bg-blue-600 text-white border-blue-600 shadow-md"
//                           : "bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-left">
//                           {sub.subjectName || sub.name}
//                         </span>
//                         {isSelected && (
//                           <span className="text-white font-bold ml-2">✓</span>
//                         )}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="text-center text-gray-500 py-8">
//                 No subjects available for {EXAMS[currentExamTab].label}
//               </p>
//             )}

//             {/* Validation Warning */}
//             {!canSubmit() && (
//               <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mt-6 text-center text-sm">
//                 <strong>Required:</strong> Please select at least one subject from each exam category (WAEC, NECO, JAMB, PUTME)
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-100 text-red-600 p-3 rounded mt-4 text-center">
//                 {error}
//               </div>
//             )}

//             {/* Navigation Buttons */}
//             <div className="mt-10 flex justify-between">
//               <button
//                 onClick={prevStep}
//                 className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={submit}
//                 disabled={!canSubmit() || submitting}
//                 className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
//               >
//                 {submitting ? "Submitting..." : "Finish & Submit"}
//               </button>
//             </div>
//           </div>
//         )}
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { TypeAnimation } from "react-type-animation";
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, Briefcase, Target, ExternalLink } from "lucide-react";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

const EXAMS = {
  waec: { label: "WAEC", limit: 9 },
  neco: { label: "NECO", limit: 9 },
  jamb: { label: "JAMB", limit: 4 },
  putme: { label: "PUTME", limit: 4 },
};

export default function PreferencePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { toast } = useToast();

  // ================= OPTIONS FROM BACKEND =================
  const [tracks, setTracks] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [goals, setGoals] = useState([]);
  const [examCategories, setExamCategories] = useState({});

  // ================= USER SELECTIONS =================
  const [step, setStep] = useState(1); // Start from step 1
  const [currentExamTab, setCurrentExamTab] = useState("waec");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});

  // ================= FETCH OPTIONS FROM BACKEND =================
  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    setError("");

    fetch(`${API_BASE}/preferences/options`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch preference options");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched options:", data);
        
        const apiData = data.data || data;
        
        setTracks(apiData.tracks || []);
        setHobbies(apiData.hobbies || []);
        setGoals(apiData.goals || []);
        setExamCategories(apiData.examCategories || {});
      })
      .catch((err) => {
        setError("Unable to load preference options");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  // ================= TOGGLE HELPERS =================
  const toggleItemWithId = (item, selectedArray, setArray) => {
    if (typeof item === 'object' && item.id) {
      const isSelected = selectedArray.some(sel => 
        typeof sel === 'object' ? sel.id === item.id : sel === item.name
      );
      
      if (isSelected) {
        setArray(selectedArray.filter(sel => 
          typeof sel === 'object' ? sel.id !== item.id : sel !== item.name
        ));
      } else {
        setArray([...selectedArray, item]);
      }
    } else {
      if (selectedArray.includes(item)) {
        setArray(selectedArray.filter((i) => i !== item));
      } else {
        setArray([...selectedArray, item]);
      }
    }
  };

  const toggleSubject = (examKey, sub) => {
    const current = selectedSubjects[examKey] || [];
    const exists = current.some((s) => s.id === sub.id);

    let updated;

    if (exists) {
      updated = current.filter((s) => s.id !== sub.id);
    } else {
      if (current.length >= EXAMS[examKey].limit) {
        toast({
          title: "Subject Limit Reached",
          description: `You can only select up to ${EXAMS[examKey].limit} subjects for ${EXAMS[examKey].label}`,
        });
        return;
      }
      updated = [
        ...current, 
        {
          id: sub.id,
          name: sub.subjectName || sub.name,
        }
      ];
    }

    setSelectedSubjects({
      ...selectedSubjects,
      [examKey]: updated,
    });
  };

  // ================= STEP NAVIGATION =================
  const nextStep = () => setStep(step + 1);
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // ================= GET SUBJECTS FOR EXAM =================
  const getSubjectsForExam = (examKey) => {
    return examCategories[examKey.toUpperCase()]?.subjects || [];
  };

  // ================= SUBMIT VALIDATION =================
  const canSubmit = () => {
    return Object.keys(EXAMS).every((examKey) => {
      const selected = selectedSubjects[examKey] || [];
      return selected.length > 0;
    });
  };

  // ================= SUBMIT TO BACKEND =================
  const submit = async () => {
    const formattedSubjects = {};
    
    Object.keys(EXAMS).forEach((examKey) => {
      const examLabel = EXAMS[examKey]?.label;
      if (examLabel && selectedSubjects[examKey]) {
        formattedSubjects[examLabel] = selectedSubjects[examKey].map((s) => s.id);
      }
    });

    const extractId = (item) => {
      if (typeof item === 'object' && item !== null) {
        return item.id;
      }
      return item;
    };

    const payload = {
      track: extractId(selectedTrack).toUpperCase(),
      hobbies: selectedHobbies.map(extractId),
      goals: selectedGoals.map(extractId),
      subjects: formattedSubjects,
    };

    console.log("=== SUBMITTING ===");
    console.log(JSON.stringify(payload, null, 2));

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      console.log("Response:", data);

      if (!res.ok) {
        const errorMessage = data.message || data.error || "Failed to save preferences";
        const validationErrors = data.errors || data.validationErrors;
        
        if (validationErrors) {
          console.error("Validation errors:", validationErrors);
          throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
        }
        
        throw new Error(errorMessage);
      }

      useAuthStore.setState((state) => ({
        user: { ...state.user, onboardingCompleted: true }
      }));

      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to save preferences");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const slideIn = (content) => (
    <div className="transition-transform duration-500 transform translate-x-0">{content}</div>
  );

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-16">
        <div className="grid grid-cols-2 gap-3">
          {Array(6).fill(0).map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error && !tracks.length) {
    return (
      <div className="max-w-3xl mx-auto p-16">
        <div className="bg-red-100 text-red-700 p-2 rounded-lg text-center">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN RENDER =================
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* TITLE */}
      <h1 className="text-4xl font-merriweather my-10 text-center text-primary">
        {step === 1 ? (
          "What do you want to study on our platform today?"
        ) : step === 5 ? (
          "Select Your Subjects"
        ) : (
          <TypeAnimation
            sequence={["Let's Get to Know You Better!", 10000, "", 500]}
            speed={50}
            cursor={true}
            repeat={Infinity}
          />
        )}
      </h1>

      {/* STEP INDICATOR - Only show for steps 2-5 (displays as "Step 1/4" through "Step 4/4") */}
      {step >= 2 && (
        <p className="text-center mb-6 text-gray-500 dark:text-white/90">
          Step {step - 1} / 4
        </p>
      )}

      {/* ================= STEP 1: COURSE SELECTION (No counter shown) ================= */}
      {step === 1 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-gray-600 mb-10 text-lg dark:text-gray-300">
              Choose your learning path to get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto ">
              {/* COMMERCIAL COURSES */}
              <div className="group relative dark:bg-transparent bg-white rounded-2xl border border-gray-200 hover:border-blue-400 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-4">
                  <div className="mb-6">
                    <div className="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <GraduationCap className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-primary mb-2">
                    Commercial Courses
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Comprehensive exam preparation
                  </p>

                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      Prepare for: <br />
                      <span className="font-medium text-primary-hover">WAEC, </span>
                      <span className="font-medium text-primary-hover">NECO</span><br/>
                      <span className="font-medium text-primary-hover">JAMB, </span>
                      <span className="font-medium text-primary-hover">PUTME</span> 
                      <br />with curated study materials and practice tests.
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Structured learning paths</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Practice questions & tests</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Performance tracking</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourseType("commercial");
                      nextStep();
                    }}
                    className="w-full px-6 py-3 bg-primary hover:bg-primary-hover/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Get Started</span>
                    <Target className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* PROFESSIONAL COURSE */}
              <div className="group relative bg-white dark:bg-transparent rounded-2xl border border-gray-200 hover:border-emerald-400 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-8">
                  <div className="mb-6">
                    <div className="inline-flex p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                      <Briefcase className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-primary mb-2">
                    Professional Course
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Career advancement programs
                  </p>

                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      Industry-recognized certifications and professional training to accelerate your career growth.
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Expert-led training</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Industry certifications</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Career support</span>
                    </div>
                  </div>

                  <a
                    href="https://filloptech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Explore</span>
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ================= STEP 2: TRACK (Shows as "Step 1/4") ================= */}
      {step === 2 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-primary-hover mb-6 mt-20">
              Select your track/interest
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {tracks.map((track) => {
                const trackValue = typeof track === 'string' ? track : track.name;
                const trackId = typeof track === 'string' ? track : track.id;
                
                return (
                  <button
                    key={trackId}
                    onClick={() => setSelectedTrack(track)}
                    className={`px-4 py-2 rounded-full border font-semibold transition ${
                      selectedTrack === track
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {trackValue}
                  </button>
                );
              })}
            </div>
            <div className="mt-20 text-center flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Prev
              </button>
              <button
                onClick={nextStep}
                disabled={!selectedTrack}
                className="bg-primary text-white px-12 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* ================= STEP 3: HOBBIES (Shows as "Step 2/4") ================= */}
      {step === 3 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-primary-hover mb-6 mt-20">
              What are your hobbies?
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {hobbies.map((hobby) => {
                const hobbyValue = typeof hobby === 'string' ? hobby : hobby.name;
                const hobbyId = typeof hobby === 'string' ? hobby : hobby.id;
                
                const isSelected = selectedHobbies.some(h => 
                  typeof h === 'object' ? h.id === hobbyId : h === hobbyValue
                );
                
                return (
                  <button
                    key={hobbyId}
                    onClick={() => toggleItemWithId(hobby, selectedHobbies, setSelectedHobbies)}
                    className={`px-2 py-2 rounded-full border font-semibold transition ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {hobbyValue}
                  </button>
                );
              })}
            </div>
            <div className="mt-20 text-center flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Prev
              </button>
              <button
                onClick={nextStep}
                disabled={!selectedHobbies.length}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* ================= STEP 4: GOALS (Shows as "Step 3/4") ================= */}
      {step === 4 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-primary-hover mb-6 -mt-4">
              What are your goals?
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {goals.map((goal) => {
                const goalValue = typeof goal === 'string' ? goal : goal.name;
                const goalId = typeof goal === 'string' ? goal : goal.id;
                
                const isSelected = selectedGoals.some(g => 
                  typeof g === 'object' ? g.id === goalId : g === goalValue
                );
                
                return (
                  <button
                    key={goalId}
                    onClick={() => toggleItemWithId(goal, selectedGoals, setSelectedGoals)}
                    className={`px-2 py-2 rounded-full border font-semibold transition ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {goalValue}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 text-center flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Prev
              </button>
              <button
                onClick={nextStep}
                disabled={!selectedGoals.length}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* ================= STEP 5: SUBJECTS (Shows as "Step 4/4") ================= */}
      {step === 5 &&
        slideIn(
          <div>
            {/* Exam Category Tabs */}
            <div className="gap-4 mb-8 grid grid-cols-2 md:grid-cols-4 sm:grid-cols-auto-fit"> 
              {Object.entries(EXAMS).map(([key, val]) => {
                const selectedCount = selectedSubjects[key]?.length || 0;
                const hasSelection = selectedCount > 0;

                return (
                  <button
                    key={key}
                    onClick={() => setCurrentExamTab(key)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      currentExamTab === key
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{val.label}</span>
                      {hasSelection && (
                        <span className={`text-xs px-6 py-0.5 rounded-full ${
                          currentExamTab === key
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {selectedCount}/{val.limit}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Tab Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold dark:text-green-700/80 text-gray-900">
                {EXAMS[currentExamTab].label} Subjects
              </h3>
              <p className="text-sm dark:text-white/80 text-gray-600 mt-1">
                Select up to {EXAMS[currentExamTab].limit} subjects
              </p>
            </div>

            {/* Subjects for Current Tab */}
            {getSubjectsForExam(currentExamTab).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getSubjectsForExam(currentExamTab).map((sub) => {
                  const isSelected = selectedSubjects[currentExamTab]?.some(
                    (s) => s.id === sub.id
                  );

                  return (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubject(currentExamTab, sub)}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-left">
                          {sub.subjectName || sub.name}
                        </span>
                        {isSelected && (
                          <span className="text-white font-bold ml-2">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No subjects available for {EXAMS[currentExamTab].label}
              </p>
            )}

            {/* Validation Warning */}
            {!canSubmit() && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mt-6 text-center text-sm">
                <strong>Required:</strong> Please select at least one subject from each exam category (WAEC, NECO, JAMB, PUTME)
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mt-4 text-center">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Prev
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit() || submitting}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                {submitting ? "Submitting..." : "Finish & Submit"}
              </button>
            </div>
          </div>
        )}
    </div>
  );
}