
import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Beaker,
  Calculator,
  Globe,
  History,
  Languages,
  DollarSign,
  Building,
  TreePine,
  Users,
  Code,
  Microscope,
  FlaskConical,
  BookMarked,
  Briefcase,
} from "lucide-react";

const SubjectsGrid = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const subjects = [
    { id:1,name:"Mathematics",icon:Calculator,color:"from-blue-500 to-cyan-500",questions:1200,difficulty:"Medium-Hard",description:"Master calculus, algebra, geometry, and problem-solving skills",topics:["Algebra","Calculus","Geometry","Statistics"]},
    { id:2,name:"English Language",icon:BookOpen,color:"from-purple-500 to-pink-500",questions:980,difficulty:"Medium",description:"Enhance grammar, comprehension, and writing skills",topics:["Grammar","Comprehension","Essay","Literature"]},
    { id:3,name:"Physics",icon:Beaker,color:"from-orange-500 to-red-500",questions:850,difficulty:"Hard",description:"Explore mechanics, electricity, waves, and modern physics",topics:["Mechanics","Electricity","Waves","Thermodynamics"]},
    { id:4,name:"Chemistry",icon:FlaskConical,color:"from-green-500 to-emerald-500",questions:900,difficulty:"Hard",description:"Study organic, inorganic, and physical chemistry",topics:["Organic","Inorganic","Physical","Analytical"]},
    { id:5,name:"Biology",icon:Microscope,color:"from-teal-500 to-cyan-500",questions:920,difficulty:"Medium",description:"Learn about life, cells, genetics, and ecosystems",topics:["Cells","Genetics","Evolution","Ecology"]},
    { id:6,name:"Geography",icon:Globe,color:"from-sky-500 to-blue-500",questions:680,difficulty:"Medium",description:"Discover physical and human geography concepts",topics:["Physical","Human","Maps","Climate"]},
    { id:7,name:"Economics",icon:DollarSign,color:"from-yellow-500 to-orange-500",questions:750,difficulty:"Medium",description:"Understand micro and macroeconomics principles",topics:["Micro","Macro","Trade","Finance"]},
    { id:8,name:"Literature",icon:BookMarked,color:"from-pink-500 to-rose-500",questions:560,difficulty:"Medium",description:"Analyze prose, poetry, and drama",topics:["Prose","Poetry","Drama","Devices"]},
    { id:9,name:"Government",icon:Building,color:"from-indigo-500 to-purple-500",questions:620,difficulty:"Easy-Medium",description:"Study political systems and civic education",topics:["Democracy","Constitution","Elections","Rights"]},
    { id:10,name:"History",icon:History,color:"from-amber-500 to-yellow-500",questions:580,difficulty:"Medium",description:"Explore historical events and civilizations",topics:["Ancient","Modern","Nigeria","Wars"]},
    { id:11,name:"Computer Science",icon:Code,color:"from-violet-500 to-purple-500",questions:720,difficulty:"Medium-Hard",description:"Learn programming and algorithms",topics:["Programming","Algorithms","Structures","Networks"]},
    { id:12,name:"Agricultural Science",icon:TreePine,color:"from-lime-500 to-green-500",questions:640,difficulty:"Medium",description:"Study farming and production",topics:["Crop","Animals","Soil","Management"]},
    { id:13,name:"Civic Education",icon:Users,color:"from-rose-500 to-pink-500",questions:480,difficulty:"Easy",description:"Understand citizenship and rights",topics:["Citizenship","Rights","Democracy","Community"]},
    { id:14,name:"Commerce",icon:Briefcase,color:"from-cyan-500 to-blue-500",questions:690,difficulty:"Medium",description:"Learn trade and business",topics:["Trade","Banking","Insurance","Marketing"]},
    { id:15,name:"Accounting",icon:Calculator,color:"from-slate-500 to-gray-500",questions:710,difficulty:"Medium-Hard",description:"Master financial accounting",topics:["Financial","Cost","Audit","Tax"]},
    { id:16,name:"French",icon:Languages,color:"from-blue-600 to-indigo-600",questions:520,difficulty:"Medium",description:"Learn French language skills",topics:["Grammar","Vocabulary","Reading","Writing"]},
  ];

  return (
    <section 
className="py-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
  dark:from-background dark:via-background dark:to-background border">
      <div className="max-w-full mx-auto px-4">
        <h2 className="text-center text-5xl font-bold mb-16 bg-primary dark:bg-white bg-clip-text text-transparent">
          Explore Subjects
        </h2>

        <ScrollRow
          subjects={subjects.slice(0,8)}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />

        <ScrollRow
          subjects={subjects.slice(8)}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      </div>
    </section>
  );
};

const ScrollRow = ({ subjects, hoveredId, setHoveredId }) => {
  const ref = useRef(null);
  const mouseX = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = e => (mouseX.current = e.clientX);

    const animate = () => {
      const rect = el.getBoundingClientRect();
      const left = rect.left + 120;
      const right = rect.right - 120;

      let speed = 0;

      if (mouseX.current < left)
        speed = -4 * (1 - (mouseX.current - rect.left) / 120);

      else if (mouseX.current > right)
        speed = 4 * (1 - (rect.right - mouseX.current) / 120);

      el.scrollLeft += speed;
      raf.current = requestAnimationFrame(animate);
    };

    const start = () => (raf.current = requestAnimationFrame(animate));
    const stop = () => cancelAnimationFrame(raf.current);

    el.addEventListener("mouseenter", start);
    el.addEventListener("mouseleave", stop);
    window.addEventListener("mousemove", move);

    return () => {
      el.removeEventListener("mouseenter", start);
      el.removeEventListener("mouseleave", stop);
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-x-auto pb-12 select-none m-auto dark:border-gray-700"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex gap-6 min-w-max">
        {subjects.map(s => (
          <SubjectCard
            key={s.id}
            subject={s}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
};

const SubjectCard = ({ subject, hoveredId, setHoveredId }) => {
  const ref = useRef(null);
  const detailsRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const isOpen = hoveredId === subject.id;

  const show = () => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = 340;
    const gap = 20;

    let left =
      window.innerWidth - rect.right < width + 40
        ? rect.left - width - gap
        : rect.right + gap;

    left = Math.max(10, Math.min(window.innerWidth - width - 10, left));

    setPos({ top: rect.top + window.scrollY - 40, left });
    setHoveredId(subject.id);
  };

  const hide = () => {
    setHoveredId(null);
  };

  const Icon = subject.icon;

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="w-64 flex-shrink-0 cursor-pointer"
      >
        <div className="
          bg-white dark:bg-gray-800 
          rounded-xl shadow-md dark:shadow-gray-900/50 
          hover:shadow-xl dark:hover:shadow-gray-900/70 
          hover:scale-[1.03] transition-all duration-300 py-8 px-4 flex gap-4
        ">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}>
            <Icon className="text-white w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{subject.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{subject.questions} Questions</p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          ref={detailsRef}
          style={{ top: pos.top, left: pos.left }}
          className="absolute z-[99999999] w-[340px]"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="
            bg-white dark:bg-gray-800 
            rounded-2xl shadow-2xl dark:shadow-black/60 
            border-2 border-slate-200 dark:border-gray-700 
            overflow-hidden animate-fadeIn
          ">
            <div className={`h-2 bg-gradient-to-r ${subject.color}`} />

            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="text-white w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">{subject.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{subject.questions} Practice Questions</p>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">{subject.description}</p>

              <div className="mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
                  Key Topics:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {subject.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${subject.color}`}></div>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm mb-5 p-3 bg-slate-50 dark:bg-gray-900/40 rounded-xl">
                <div>
                  <div className={`font-bold text-lg bg-gradient-to-r ${subject.color} bg-clip-text text-transparent`}>
                    {subject.questions}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Questions</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg bg-gradient-to-r ${subject.color} bg-clip-text text-transparent`}>
                    {subject.difficulty}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Difficulty</div>
                </div>
              </div>

              <button className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${subject.color} hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2`}>
                <span>Start Learning</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectsGrid;