// import React, { useState, useRef, useEffect } from "react";
// import {
//   BookOpen,
//   Beaker,
//   Calculator,
//   Globe,
//   Pen,
//   History,
//   Languages,
//   Heart,
//   DollarSign,
//   Building,
//   Palette,
//   Music,
//   Activity,
//   Scale,
//   Briefcase,
//   Lightbulb,
//   TreePine,
//   Users,
//   Code,
//   Database,
//   Microscope,
//   FlaskConical,
//   BookMarked,
//   MessageSquare,
//   Church,
//   ChefHat,
//   Trophy,
// } from "lucide-react";

// const SubjectsGrid = () => {
//   const [hoveredCard, setHoveredCard] = useState(null);
    
//   const subjects = [
//     { id:1,name:"Mathematics",icon:Calculator,color:"from-blue-500 to-cyan-500",questions:1200,difficulty:"Medium-Hard",description:"Master calculus, algebra, geometry, and problem-solving skills",topics:["Algebra","Calculus","Geometry","Statistics"]},
//     { id:2,name:"English Language",icon:BookOpen,color:"from-purple-500 to-pink-500",questions:980,difficulty:"Medium",description:"Enhance grammar, comprehension, and writing skills",topics:["Grammar","Comprehension","Essay","Literature"]},
//     { id:3,name:"Physics",icon:Beaker,color:"from-orange-500 to-red-500",questions:850,difficulty:"Hard",description:"Explore mechanics, electricity, waves, and modern physics",topics:["Mechanics","Electricity","Waves","Thermodynamics"]},
//     { id:4,name:"Chemistry",icon:FlaskConical,color:"from-green-500 to-emerald-500",questions:900,difficulty:"Hard",description:"Study organic, inorganic, and physical chemistry",topics:["Organic","Inorganic","Physical","Analytical"]},
//     { id:5,name:"Biology",icon:Microscope,color:"from-teal-500 to-cyan-500",questions:920,difficulty:"Medium",description:"Learn about life, cells, genetics, and ecosystems",topics:["Cells","Genetics","Evolution","Ecology"]},
//     { id:6,name:"Geography",icon:Globe,color:"from-sky-500 to-blue-500",questions:680,difficulty:"Medium",description:"Discover physical and human geography concepts",topics:["Physical","Human","Maps","Climate"]},
//     { id:7,name:"Economics",icon:DollarSign,color:"from-yellow-500 to-orange-500",questions:750,difficulty:"Medium",description:"Understand micro and macroeconomics principles",topics:["Micro","Macro","Trade","Finance"]},
//     { id:8,name:"Literature",icon:BookMarked,color:"from-pink-500 to-rose-500",questions:560,difficulty:"Medium",description:"Analyze prose, poetry, and drama",topics:["Prose","Poetry","Drama","Devices"]},
//     { id:9,name:"Government",icon:Building,color:"from-indigo-500 to-purple-500",questions:620,difficulty:"Easy-Medium",description:"Study political systems and civic education",topics:["Democracy","Constitution","Elections","Rights"]},
//     { id:10,name:"History",icon:History,color:"from-amber-500 to-yellow-500",questions:580,difficulty:"Medium",description:"Explore historical events and civilizations",topics:["Ancient","Modern","Nigeria","Wars"]},
//     { id:11,name:"Computer Science",icon:Code,color:"from-violet-500 to-purple-500",questions:720,difficulty:"Medium-Hard",description:"Learn programming and algorithms",topics:["Programming","Algorithms","Structures","Networks"]},
//     { id:12,name:"Agricultural Science",icon:TreePine,color:"from-lime-500 to-green-500",questions:640,difficulty:"Medium",description:"Study farming and production",topics:["Crop","Animals","Soil","Management"]},
//     { id:13,name:"Civic Education",icon:Users,color:"from-rose-500 to-pink-500",questions:480,difficulty:"Easy",description:"Understand citizenship and rights",topics:["Citizenship","Rights","Democracy","Community"]},
//     { id:14,name:"Commerce",icon:Briefcase,color:"from-cyan-500 to-blue-500",questions:690,difficulty:"Medium",description:"Learn trade and business",topics:["Trade","Banking","Insurance","Marketing"]},
//     { id:15,name:"Accounting",icon:Calculator,color:"from-slate-500 to-gray-500",questions:710,difficulty:"Medium-Hard",description:"Master financial accounting",topics:["Financial","Cost","Audit","Tax"]},
//     { id:16,name:"French",icon:Languages,color:"from-blue-600 to-indigo-600",questions:520,difficulty:"Medium",description:"Learn French language skills",topics:["Grammar","Vocabulary","Reading","Writing"]},
//   ];

//   const firstRow = subjects.slice(0, 8);
//   const secondRow = subjects.slice(8, 16);

//   /* ---------------- CARD ---------------- */


//   const SubjectCard = ({ subject }) => {
//     const cardRef = useRef(null);
//     const isHovered = hoveredCard === subject.id;
//     const Icon = subject.icon;

//     const [pos, setPos] = useState({ top: 0, left: 0 });
//     const [leftSide, setLeftSide] = useState(false);

//     useEffect(() => {
//       if (!isHovered || !cardRef.current) return;

//       const update = () => {
//         const rect = cardRef.current.getBoundingClientRect();
//         const width = 320;
//         const spaceRight = window.innerWidth - rect.right;
//         const showLeft = spaceRight < width + 20;

//         setLeftSide(showLeft);

//         setPos({
//           top: rect.top - 20,
//           left: showLeft ? rect.left - width - 12 : rect.right + 12,
//         });
//       };

//       update();
//       window.addEventListener("scroll", update);
//       window.addEventListener("resize", update);

//       return () => {
//         window.removeEventListener("scroll", update);
//         window.removeEventListener("resize", update);
//       };
//     }, [isHovered]);

//     return (
//       <>
//         {/* Main Card */}
//         <div
//           ref={cardRef}
//           onMouseEnter={() => setHoveredCard(subject.id)}
//           onMouseLeave={() => setHoveredCard(null)}
//           className="relative w-64 flex-shrink-0 cursor-pointer"
//         >
//           <div className="bg-white rounded-xl shadow-md border hover:shadow-xl hover:scale-105 transition p-4 flex gap-4 items-center">

//             <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
//               <Icon className="text-white w-7 h-7" />
//             </div>

//             <div>
//               <h3 className="font-bold text-slate-900">{subject.name}</h3>
//               <p className="text-sm text-slate-600">{subject.questions} Questions</p>
//             </div>
//           </div>
//         </div>

//         {/* Floating Hover Card */}
//         {isHovered && (
//           <div
//             className="fixed z-[9999] w-80 animate-fade"
//             style={{ top: pos.top, left: pos.left }}
//           >
//             <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">

//               <div className={`h-2 bg-gradient-to-r ${subject.color}`} />

//               <div className="p-5">

//                 <h3 className="font-bold text-xl mb-1">{subject.name}</h3>
//                 <p className="text-sm text-slate-600 mb-3">
//                   {subject.description}
//                 </p>

//                 <div className="grid grid-cols-2 gap-2 mb-4">
//                   {subject.topics.map((t,i)=>(
//                     <span key={i} className="bg-slate-100 rounded px-2 py-1 text-xs font-medium">
//                       {t}
//                     </span>
//                   ))}
//                 </div>

//                 <div className="flex justify-between text-sm mb-4">
//                   <span><b>{subject.questions}</b> Questions</span>
//                   <span><b>{subject.difficulty}</b></span>
//                 </div>

//                 <button className={`w-full py-2 rounded-lg text-white font-bold bg-gradient-to-r ${subject.color}`}>
//                   Start Learning →
//                 </button>

//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">

//       <div className="max-w-7xl mx-auto px-4">

//         <h2 className="text-center text-5xl font-bold mb-12 bg-primary bg-clip-text text-transparent">
//           Explore Subjects
//         </h2>

//         {/* rows */}
//         {[firstRow, secondRow].map((row, r) => (
//           <div key={r} className="overflow-x-auto pb-10 scrollbar-hide">
//             <div className="flex gap-4">
//               {row.map(sub => (
//                 <SubjectCard key={sub.id} subject={sub}/>
//               ))}
//             </div>
//           </div>
//         ))}

//       </div>

//     </section>
//   );
// };

// export default SubjectsGrid;






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
  const [hoveredCardId, setHoveredCardId] = useState(null);

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


  const firstRow = subjects.slice(0, 8);
  const secondRow = subjects.slice(8);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-5xl font-bold mb-16 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Explore Subjects
        </h2>

        {[firstRow, secondRow].map((row, rowIndex) => (
          <HorizontalScrollRow
            key={rowIndex}
            subjects={row}
            hoveredId={hoveredCardId}
            setHoveredId={setHoveredCardId}
          />
        ))}
      </div>
    </section>
  );
};

const HorizontalScrollRow = ({ subjects, hoveredId, setHoveredId }) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const mouseXRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      mouseXRef.current = e.clientX;
    };

    const animate = () => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const leftEdge = rect.left + 120;
      const rightEdge = rect.right - 120;

      let scrollDelta = 0;

      if (mouseXRef.current < leftEdge) {
        const intensity = 1 - (mouseXRef.current - rect.left) / 120;
        scrollDelta = -4 * intensity; // scroll left
      } else if (mouseXRef.current > rightEdge) {
        const intensity = 1 - (rect.right - mouseXRef.current) / 120;
        scrollDelta = 4 * intensity; // scroll right
      }

      if (scrollDelta !== 0) {
        container.scrollLeft += scrollDelta;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      rafRef.current = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Wheel → horizontal scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY * 1.8;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto pb-10 scrollbar-hide select-none"
    >
      <div className="flex gap-5 md:gap-6 min-w-max">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            isHovered={hoveredId === subject.id}
            onHoverChange={(hovering) => setHoveredId(hovering ? subject.id : null)}
          />
        ))}
      </div>
    </div>
  );
};

const SubjectCard = ({ subject, isHovered, onHoverChange }) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, side: "right" });

  useEffect(() => {
    if (!isHovered || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const DETAIL_WIDTH = 320;
    const GAP = 16;

    const spaceRight = window.innerWidth - rect.right;
    const showOnLeft = spaceRight < DETAIL_WIDTH + GAP + 40;

    setPosition({
      top: rect.top + window.scrollY - 20,
      left: showOnLeft
        ? rect.left + window.scrollX - DETAIL_WIDTH - GAP
        : rect.right + window.scrollX + GAP,
      side: showOnLeft ? "left" : "right",
    });
  }, [isHovered]);

  const Icon = subject.icon;

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        className="w-64 flex-shrink-0 cursor-pointer group"
      >
        <div className="bg-white rounded-xl shadow-md border group-hover:shadow-xl group-hover:scale-[1.03] transition-all duration-200 p-4 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
            <Icon className="text-white w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{subject.name}</h3>
            <p className="text-sm text-slate-600">{subject.questions} Questions</p>
          </div>
        </div>
      </div>

      {isHovered && (
        <div
          className="fixed z-[9999] w-80 pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden pointer-events-auto animate-fade-in">
            <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
            <div className="p-5">
              <h3 className="font-bold text-xl mb-2">{subject.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{subject.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {subject.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-700 rounded px-2.5 py-1 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex justify-between text-sm mb-5 text-slate-700">
                <span><strong>{subject.questions}</strong> Questions</span>
                <span><strong>{subject.difficulty}</strong></span>
              </div>

              <button
                className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${subject.color} hover:brightness-110 transition`}
              >
                Start Learning →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectsGrid;