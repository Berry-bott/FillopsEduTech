import { useEffect } from "react";
import PageNav from "../../../DashboardComponents/PageNav";

export default function Header({
  saved,
  activeId,
  setActiveId,
  setQuestions,
  setLoading,
  subjectNames,
  setSubjectNames,
  topicNames,
  setTopicNames,
  accessToken,
  setCurrentIndex,
}) {
  if (!saved) return null;

  const subjects = saved.subjects || [];
  const topics = saved.topics || {};
  const isTopicMode = saved.mode === "topic";

  // Extract first topic
  const extractTopicId = (topicStorage) => {
    const firstKey = Object.keys(topicStorage)[0];
    const value = topicStorage[firstKey];
    return Array.isArray(value) ? value[0] : firstKey;
  };

  // ========= FETCH QUESTIONS ==========
  const fetchQuestions = async (type, id, year) => {
    try {
      setLoading(true);
      const category = saved.exam;

      let url = year && year !== "random"
        ? `https://fillops-server-5fuf.onrender.com/api/${type}/${id}/questions?category=${category}&year=${year}`
        : `https://fillops-server-5fuf.onrender.com/api/${type}/${id}/questions?random=true&category=${category}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();

      const formatted = (data.data || []).map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        year: q.year,
        examType: q.category,
      }));

      setQuestions(formatted);
      setCurrentIndex(0);
      setLoading(false);
    } catch (err) {
      console.error("❌ Fetch question error:", err);
      setLoading(false);
    }
  };

  // ========= FETCH SUBJECT NAMES ==========
  const fetchSubjectNames = async () => {
    if (!saved?.subjects) return;

    try {
      const names = {};

      await Promise.all(
        saved.subjects.map(async (id) => {
          try {
            const res = await fetch(
              `https://fillops-server-5fuf.onrender.com/api/subjects/${id}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const data = await res.json();
            names[id] = data.subjectName || data.data?.subjectName || id;
          } catch {
            names[id] = id;
          }
        })
      );

      setSubjectNames(names);
    } catch (err) {
      console.error("❌ Subject fetch error:", err);
    }
  };

  // ========= FETCH TOPIC NAMES ==========
  const fetchTopicNames = async () => {
    if (!saved?.topics) return;

    try {
      const topicMap = {};
      const subjectForTopic = {};

      const topicEntries = Object.entries(saved.topics);

      await Promise.all(
        topicEntries.flatMap(([subjectId, topicIds]) =>
          topicIds.map(async (topicId) => {
            try {
              const res = await fetch(
                `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
              );

              const raw = await res.json();
              const topic = raw.data || raw;

              topicMap[topicId] = topic.topicName;

              if (topic.module?.subject?.subjectName) {
                subjectForTopic[topicId] =
                  topic.module.subject.subjectName;
              }
            } catch {
              topicMap[topicId] = topicId;
            }
          })
        )
      );

      setTopicNames(topicMap);
      setSubjectNames((prev) => ({ ...prev, ...subjectForTopic }));
    } catch (err) {
      console.error("❌ Topic fetch error:", err);
    }
  };

  // ========= INITIAL LOAD ==========
  useEffect(() => {
    fetchSubjectNames();
    fetchTopicNames();

    if (saved.mode === "subject") {
      const first = saved.subjects[0];
      setActiveId(first);
      fetchQuestions("subjects", first, saved.subjectYears?.[first]);
    }

    if (saved.mode === "topic") {
      const tid = extractTopicId(saved.topics);
      setActiveId(tid);
      fetchQuestions("topics", tid, saved.topicYears?.[tid]);
    }
  }, []);


  // ========= RENDER BUTTONS ==========
  if (isTopicMode) {
    const subjectId = Object.keys(topics)[0];
    const topicList = topics[subjectId] || [];
  
    let subjectName = "Subject";
    if (topicList.length > 0) {
      const firstTopicId = topicList[0];
      subjectName =
        subjectNames[firstTopicId] ||
        subjectNames[subjectId] ||
        "Subject";
    }
  
    const itemCount = topicList.length + 1; // subject button + topics
  
    return (
      <main className="">
        <PageNav />
        <h1 className="px-4 py-2 text-2xl   text-white rounded-lg shadow my-2 bg-primary-hover">
            {subjectName} {":"}
          </h1>
        <div className="grid gap-3 mb-6 "
          style={{
            gridTemplateColumns: `repeat(${Math.min(itemCount, 4)}, 1fr)`
          }}
        >
      
          {topicList.map((topicId) => (
            <button
              key={topicId}
              onClick={() => {
                setActiveId(topicId);
                fetchQuestions("topics", topicId, saved.topicYears?.[topicId]);
              }}
              className={`px-1 py-1 md:px-4 md:py-2 rounded-lg shadow text-white text-[10px] ${
                activeId === topicId ? "bg-primary" : "bg-primary-hover"
              }`}
            >
              {topicNames[topicId] || "Topic"}
            </button>
          ))}
        </div>
      </main>
    );
  }
  

  // SUBJECT MODE
  const itemCount = subjects.length;

  return (
    <main>
      <PageNav />
  
      <div
        className="grid gap-3 mb-6 py-6"
        style={{
          gridTemplateColumns: `repeat(${Math.min(itemCount, 4)}, 1fr)`
        }}
      >
        {subjects.map((subjectId) => (
          <button
            key={subjectId}
            onClick={() => {
              setActiveId(subjectId);
              fetchQuestions(
                "subjects",
                subjectId,
                saved.subjectYears?.[subjectId]
              );
            }}
            className={`px-1 py-1 md:px-4 md:py-2 rounded-lg shadow text-white text-[10px] ${
              activeId === subjectId ? "bg-blue-700" : "bg-blue-500"
            }`}
          >
            {subjectNames[subjectId] || "Subject"}
          </button>
        ))}
      </div>
      <hr className="m-4 border" />

    </main>
  );
  
}
