import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { TypeAnimation } from "react-type-animation";

const API_URL = "https://fillops-server-5fuf.onrender.com/api/subjects";

const EXAMS = {
  waec: { label: "WAEC", limit: 9 },
  neco: { label: "NECO", limit: 9 },
  jamb: { label: "JAMB", limit: 4 },
  putme: { label: "PUTME", limit: 4 },
};

const INTERESTS = ["Science", "Arts", "Commecial", "Business"];
const HOBBIES = [
  "Reading",
  "Sports",
  "Gaming",
  "Music",
  "Traveling",
  "Coding",
  "Photography",
  "Watching Movies",
  "Writing",
  "Drawing",
  "Fitness",
  "Cooking",
  "Blogging",
  "Volunteering",
  "Learning Languages"
];

const GOALS = [
  "Career Growth",
  "Learn New Skills",
  "Fun & Leisure",
  "Networking",
  "Build Side Projects",
  "Start a Business",
  "Improve Productivity",
  "Financial Freedom",
  "Academic Excellence",
  "Personal Development",
  "Health & Wellness",
  "Travel the World",
  "Master a Skill",
  "Community Impact",
  "Work-Life Balance"
];

//N/B => the preference only uses local storage,not presistenece across multiple devices.  
// Next is to add to to backend handles



export default function PreferencePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const [showWelcome, setShowWelcome] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);


    // ================= WELCOME MESSAGE (ONE TIME ONLY) =================
    useEffect(() => {
      const seen = localStorage.getItem("hasSeenPreferenceWelcome");
  
      if (!seen) {
        setShowWelcome(true);
  
        const timer = setTimeout(() => {
          setShowWelcome(false);
          localStorage.setItem("hasSeenPreferenceWelcome", "true");
        }, 4000);
  
        return () => clearTimeout(timer);
      }
    }, []);
    
  useEffect(() => {
    const completed = localStorage.getItem("hasCompletedPreferences");

    if (completed === "true") {
      navigate("/user/dashboard", { replace: true });
    }
  }, [navigate]);


  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("prefStep");
    return savedStep ? Number(savedStep) : 1;
  });
  const [selectedExam, setSelectedExam] = useState(() => {
    const savedExam = localStorage.getItem("prefExam");
    return savedExam || "waec";
  });

  const [selectedInterests, setSelectedInterests] = useState(() => {
    const saved = localStorage.getItem("prefInterests");
    console.log(saved);
    
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedHobbies, setSelectedHobbies] = useState(() => {
    const saved = localStorage.getItem("prefHobbies");
    console.log(saved);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedGoals, setSelectedGoals] = useState(() => {
    const saved = localStorage.getItem("prefGoals");
    console.log(saved);
    return saved ? JSON.parse(saved) : [];
  });

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    const saved = localStorage.getItem("prefSubjects");
    console.log(saved);
    return saved ? JSON.parse(saved) : {};
  });

  // ================= TOGGLE ITEMS =================
  const toggleItem = (item, selectedArray, setArray, storageKey) => {
    let newArray;
    if (selectedArray.includes(item)) {
      newArray = selectedArray.filter((i) => i !== item);
    } else {
      newArray = [...selectedArray, item];
    }
    setArray(newArray);
    localStorage.setItem(storageKey, JSON.stringify(newArray));
  };

  const toggleSubject = (sub) => {
    const current = selectedSubjects[selectedExam] || [];
  
    const exists = current.some((s) => s.id === sub.id);
  
    let updated;
  
    if (exists) {
      updated = current.filter((s) => s.id !== sub.id);
    } else {
      if (current.length >= examConfig.limit) return;
      updated = [
        ...current,
        {
          id: sub.id,
          name: sub.subjectName,
        },
      ];
    }
  
    const newSubjects = {
      ...selectedSubjects,
      [selectedExam]: updated,
    };
  
    setSelectedSubjects(newSubjects);
    localStorage.setItem("prefSubjects", JSON.stringify(newSubjects));
  };
  
  // ================= STEP NAVIGATION =================
  const nextStep = () => {
    const next = step + 1;
    setStep(next);
    localStorage.setItem("prefStep", next);
  };

  const prevStep = () => {
    const prev = step - 1;
    if (prev < 1) return;
    setStep(prev);
    localStorage.setItem("prefStep", prev);
  };
  const examConfig = EXAMS[selectedExam];

  // ================= FETCH SUBJECTS =================
  useEffect(() => {
    if (step !== 4 || !accessToken) return;

    setLoading(true);
    setError("");

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subjects");
        return res.json();
      })
      .then((data) => {
        const allSubjects = Array.isArray(data.data) ? data.data : [];
        const filteredSubjects = allSubjects.filter(
          (s) => s.category.toLowerCase() === selectedExam
        );
        setSubjects(filteredSubjects);
      })
      .catch((err) => {
        setError("Unable to load subjects");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [step, accessToken, selectedExam]);

  // ================= ANIMATION =================
  const slideIn = (content) => (
    <div className="transition-transform duration-500 transform translate-x-0">{content}</div>
  );

  // ================= SKELETON =================
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 gap-3">
      {Array(examConfig.limit)
        .fill(0)
        .map((_, idx) => (
          <div key={idx} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
        ))}
    </div>
  );

  // ================= SUBMIT =================
  const submit = () => {
    const finalData = {
      interests: selectedInterests,
      hobbies: selectedHobbies,
      goals: selectedGoals,
      subjects: selectedSubjects,
    };

    console.log("Submitting final data:", finalData);

    // ✅ mark preferences as completed (ONE TIME)
    localStorage.setItem("hasCompletedPreferences", "true");

    // clean step tracking only
    localStorage.removeItem("prefStep");
    navigate("/user/dashboard", { replace: true, state: finalData });
  };

  return (
    <div className="max-w-3xl mx-auto p-16">

       {showWelcome && (
        <div className=" text-red-900 px-8 py-8 rounded-xl shadow-xl text-center animate-fades-in    ">
          <h2 className=" font-semibold text-3xl">
           <span className="uppercase"> 👋Hi, </span> 
            {" "}<span className="text-primary dark:text-blue-400">
              {user?.firstName
              ? user.firstName.charAt(-1).toUpperCase() + user.firstName
              : "User"}

              </span> <span  className="uppercase"> Welcome Onboard </span> 
          </h2>
          
         </div>
        )}

      <h1 className="text-4xl font-merriweather my-10 text-center text-primary">
        {step === 4 ? (
          "Select Your Subjects Preference."
        ) : (
          <TypeAnimation
            sequence={["Let's Get to Know You Better!", 10000, "", 500]}
            speed={50}
            cursor={true}
            repeat={Infinity}
          />
        )}
      </h1>

         {/* STEP NUMBERS */}
        <p className="text-center mb-6 text-gray-500">
        Step {step} / 4
      </p>

      {/* EXAM TABS - SHOW ONLY AT STEP 4 */}
      {step === 4 && (
        <div className="flex gap-4 justify-center mb-12 mt-9 flex-wrap">
          {Object.entries(EXAMS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedExam(key)}
              className={`px-5 py-2 rounded-full border font-semibold transition ${
                selectedExam === key
                  ? "bg-primary-hover text-white border-gray-100"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      )}

      {/* STEP 1: INTERESTS */}
      {step === 1 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-primary-hover mb-6 mt-20">
              Select your interests
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() =>
                    toggleItem(interest, selectedInterests, setSelectedInterests, "prefInterests")
                  }
                  className={`px-4 py-2 rounded-full border font-semibold transition ${
                    selectedInterests.includes(interest)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="mt-20 text-center flex justify-between">
              <div></div>
              <button
                onClick={nextStep}
                disabled={!selectedInterests.length}
                className="bg-primary text-white px-12 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* STEP 2: HOBBIES */}
      {step === 2 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-primary-hover mb-6 mt-20">
              What are your hobbies?
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {HOBBIES.map((hobby) => (
                <button
                  key={hobby}
                  onClick={() =>
                    toggleItem(hobby, selectedHobbies, setSelectedHobbies, "prefHobbies")
                  }
                  className={`px-4 py-2 rounded-full border font-semibold transition ${
                    selectedHobbies.includes(hobby)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {hobby}
                </button>
              ))}
            </div>
            <div className="mt-20 text-center flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
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

      {/* STEP 3: GOALS */}
      {step === 3 &&
        slideIn(
          <div className="mb-10">
            <p className="text-center text-primary-hover mb-6 mt-10">
              What are your goals?
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() =>
                    toggleItem(goal, selectedGoals, setSelectedGoals, "prefGoals")
                  }
                  className={`px-4 py-2 rounded-full border font-semibold transition ${
                    selectedGoals.includes(goal)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <div className="mt-20 text-center flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Prev
              </button>
              <button
                onClick={nextStep}
                disabled={!selectedGoals.length}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* STEP 4: SUBJECTS */}
      {step === 4 &&
        slideIn(
          <div>
            <h2 className="text-center text-primary-hover mb-6 mt-20">
               {examConfig.label} — select up to {examConfig.limit} subjects
            </h2>

            {loading && renderSkeleton()}
            {error && <p className="text-red-600 text-center">{error}</p>}

            {!loading && !error && subjects.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {subjects.map((sub) => {
                 const isSelected = selectedSubjects[selectedExam]?.some(
                  (s) => s.id === sub.id
                );
                
                  return (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubject(sub)}
                      className={`p-3 text-left rounded-lg border flex items-center justify-between transition ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span>{sub.subjectName}</span>
                      {isSelected && <span className="text-white font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {!loading && !error && subjects.length === 0 && (
              <p className="text-center text-gray-500">
                No subjects available for {examConfig.label}
              </p>
            )}

            <div className="mt-20 text-center flex justify-between">
              <button
                onClick={prevStep}
                className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Prev
              </button>
              <button
                onClick={submit}
                disabled={!Object.keys(selectedSubjects).length}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Finish & Submit
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
