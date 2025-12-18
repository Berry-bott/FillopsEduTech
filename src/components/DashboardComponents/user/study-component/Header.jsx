

import PageNav from '../../../DashboardComponents/PageNav';
import { useStudyStore } from '../../../../store/studyStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const saved = useStudyStore((s) => s.saved);
  const subjectNames = useStudyStore((s) => s.subjectNames);
  const topicNames = useStudyStore((s) => s.topicNames);
  const activeId = useStudyStore((s) => s.activeId);
  const changeActive = useStudyStore((s) => s.changeActive);
  const questions = useStudyStore((s) => s.questions);

  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(0); // fade-in for buttons

  // Wait until all data is loaded before showing anything
  useEffect(() => {
    if (!saved) return;

    const checkReady = async () => {
      while (
        (saved.mode === 'subject' &&
          Object.keys(subjectNames).length < (saved.subjects?.length || 0)) ||
        (saved.mode === 'topic' &&
          Object.keys(topicNames).length <
            Object.values(saved.topics || {}).flat().length) ||
        questions.length === 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setReady(true);
    };

    checkReady();
  }, [saved, subjectNames, topicNames, questions]);

  // Staggered fade-in for buttons
  useEffect(() => {
    if (!ready) return;
    setVisible(0);
    let count = 0;
    const total =
      saved.mode === 'subject'
        ? saved.subjects.length
        : Object.values(saved.topics || {})[0]?.length || 1;

    const interval = setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= total) clearInterval(interval);
    }, 300); // 100ms between each button
    return () => clearInterval(interval);
  }, [ready, saved]);

  // ----------------------------
  // Render skeleton while loading
  // ----------------------------
  if (!ready) {
    const skeletonCount =
      saved?.mode === 'subject'
        ? saved.subjects.length
        : Object.values(saved.topics || {})[0]?.length || 4;

    return (
      <main>
      <PageNav />
      <div className="p-4 space-y-4">
        <div className='flex justify-between items-center '>
        <div>
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        </div>
        <div className='p-4 space-y-4'>
        <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(skeletonCount, 4)}, 1fr)` }}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
            <div key={`skeleton-group-${idx}`} className="space-y-2">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}


        </div>
      </div>
    </main>
    );
  }

  if (!saved) return null;

  const subjects = saved.subjects || [];
  const topics = saved.topics || {};
  const isTopicMode = saved.mode === 'topic';

  // ----------------------------
  // Render topic mode
  // ----------------------------
  if (isTopicMode) {
    const subjectId = Object.keys(topics)[0];
    const topicList = topics[subjectId] || [];
    const subjectName = subjectNames[subjectId] || 'Subject';

    return (
      <main>
        <PageNav />
        <h1 className="px-4 py-2 text-2xl text-white rounded-lg shadow my-2 bg-primary-hover">
          {subjectName}:
        </h1>
        <div
          className="grid gap-3 mb-6"
          style={{ gridTemplateColumns: `repeat(${Math.min(topicList.length, 4)}, 1fr)` }}
        >
          {topicList.map((topicId, idx) => (
            <button
              key={topicId}
              onClick={() => changeActive(topicId)}
              className={`px-1 py-1 md:px-4 md:py-2 rounded-lg shadow text-white text-[10px] transition-opacity duration-500 ${
                idx < visible ? 'opacity-100' : 'opacity-0'
              } ${activeId === topicId ? 'bg-primary' : 'bg-primary-hover'}`}
            >
              {topicNames[topicId] || 'Topic'}
            </button>
          ))}
        </div>
      </main>
    );
  }

  // ----------------------------
  // Render subject mode
  // ----------------------------
  return (
    <main>
      <PageNav />
      <div
        className="grid gap-3 mb-6 py-6"
        style={{ gridTemplateColumns: `repeat(${Math.min(subjects.length, 4)}, 1fr)` }}
      >
        {subjects.map((subjectId, idx) => (
          <button
            key={subjectId}
            onClick={() => changeActive(subjectId)}
            className={`px-1 py-1 md:px-4 md:py-2 rounded-lg shadow text-white text-[10px] transition-opacity duration-500 ${
              idx < visible ? 'opacity-100' : 'opacity-0'
            } ${activeId === subjectId ? 'bg-blue-700' : 'bg-blue-500'}`}
          >
            {subjectNames[subjectId] || 'Subject'}
          </button>
        ))}
      </div>
      <hr className="m-4 border" />
    </main>
  );
}
