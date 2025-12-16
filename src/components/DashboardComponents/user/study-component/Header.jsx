import PageNav from '../../../DashboardComponents/PageNav';
import { useStudyStore } from '../../../../store/studyStore';

export default function Header() {
  const saved = useStudyStore((s) => s.saved);
  const subjectNames = useStudyStore((s) => s.subjectNames);
  const topicNames = useStudyStore((s) => s.topicNames);
  const activeId = useStudyStore((s) => s.activeId);
  const changeActive = useStudyStore((s) => s.changeActive);

  if (!saved) return null;

  const subjects = saved.subjects || [];
  const topics = saved.topics || {};
  const isTopicMode = saved.mode === 'topic';

  if (isTopicMode) {
    const subjectId = Object.keys(topics)[0];
    const topicList = topics[subjectId] || [];
    const firstTopicId = topicList[0];
    const subjectName = topicNames[firstTopicId] || subjectNames[firstTopicId] || 'Subject';

    const itemCount = topicList.length;

    return (
      <main>
        <PageNav />
        <h1 className="px-4 py-2 text-2xl text-white rounded-lg shadow my-2 bg-primary-hover">
          {subjectName}:
        </h1>
        <div className="grid gap-3 mb-6"
          style={{ gridTemplateColumns: `repeat(${Math.min(itemCount, 4)}, 1fr)` }}
        >
          {topicList.map((topicId) => (
            <button
              key={topicId}
              onClick={() => changeActive(topicId)}
              className={`px-1 py-1 md:px-4 md:py-2 rounded-lg shadow text-white text-[10px] ${
                activeId === topicId ? 'bg-primary' : 'bg-primary-hover'
              }`}
            >
              {topicNames[topicId] || 'Topic'}
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
      <div className="grid gap-3 mb-6 py-6"
        style={{ gridTemplateColumns: `repeat(${Math.min(itemCount, 4)}, 1fr)` }}
      >
        {subjects.map((subjectId) => (
          <button
            key={subjectId}
            onClick={() => changeActive(subjectId)}
            className={`px-1 py-1 md:px-4 md:py-2 rounded-lg shadow text-white text-[10px] ${
              activeId === subjectId ? 'bg-blue-700' : 'bg-blue-500'
            }`}
          >
            {subjectNames[subjectId] || 'Subject'}
          </button>
        ))}
      </div>
      <hr className="m-4 border" />
    </main>
  );
}
