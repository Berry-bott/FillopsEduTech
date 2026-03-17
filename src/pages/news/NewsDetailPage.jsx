import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useNewsStore from "@/store/newsStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AUDIENCE_LABEL = { ALL: "General", USERS_ONLY: "Students", TUTORS_ONLY: "Tutors" };
const AUDIENCE_COLOR = {
  ALL:         "bg-indigo-100 text-indigo-700",
  USERS_ONLY:  "bg-emerald-100 text-emerald-700",
  TUTORS_ONLY: "bg-amber-100 text-amber-700",
};

function stripHtml(html) { return html?.replace(/<[^>]*>/g, "") || ""; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function readTime(html) {
  return Math.max(1, Math.ceil(stripHtml(html).trim().split(/\s+/).filter(Boolean).length / 200));
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/news" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps News</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-[13px] text-slate-500">
          <Link to="/news" className="hover:text-slate-900 no-underline transition-colors font-medium">All Stories</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800">FillOps News</span>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} FillOps. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NewsDetailPage() {
  const { id } = useParams();                        // ← dynamic route param
  const navigate = useNavigate();
  const { selectedNews, newsList, isLoading, error, fetchNewsById, clearError } = useNewsStore();

  useEffect(() => {
    clearError();
    // fetchNewsById is smart: checks the cached list first, avoids 403
    fetchNewsById(id);
    window.scrollTo(0, 0);
  }, [id]);

  // ── Loading ──
  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading story…</p>
      </div>
      <Footer />
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <span className="text-5xl">⚠️</span>
        <h3 className="text-lg font-semibold text-slate-700" style={{ fontFamily: "Georgia, serif" }}>Story not found</h3>
        <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
        <button onClick={() => navigate("/news")}
          className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
          ← Back to stories
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!selectedNews) return null;

  const author     = selectedNews.author;
  const authorName = author ? `${author.firstName} ${author.lastName}` : "FillOps";
  const authorInit = author ? `${author.firstName?.[0] ?? ""}${author.lastName?.[0] ?? ""}` : "F";
  const date       = fmtDate(selectedNews.publishedAt || selectedNews.createdAt);
  const rt         = readTime(selectedNews.content);
  const isHtml     = /<[a-z][\s\S]*>/i.test(selectedNews.content || "");
  const plainText  = stripHtml(selectedNews.content);
  const excerpt    = plainText.slice(0, 180);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 no-underline mb-8 transition-colors group">
          <svg style={{ width: 14, height: 14 }} className="group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to stories
        </Link>

        {/* Audience pill */}
        <div className="mb-4">
          <span className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${AUDIENCE_COLOR[selectedNews.targetAudience] ?? AUDIENCE_COLOR.ALL}`}>
            {AUDIENCE_LABEL[selectedNews.targetAudience] ?? "General"}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-bold text-slate-900 leading-tight mb-4"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.18 }}>
          {selectedNews.title}
        </h1>

        {/* Subtitle / excerpt */}
        {excerpt && (
          <p className="text-xl text-slate-500 leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
            {excerpt}
          </p>
        )}

        {/* Author row — matches Image 2 exactly */}
        <div className="flex items-center justify-between py-4 border-y border-slate-150 mb-8" style={{ borderColor: "#e8eaed" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
              {authorInit}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{authorName}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{date}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rt} min read
                </span>
              </div>
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => navigator.share?.({ title: selectedNews.title, url: window.location.href }).catch(() => {})}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Cover image */}
        {selectedNews.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-slate-100" style={{ maxHeight: 460 }}>
            <img src={selectedNews.coverImage} alt={selectedNews.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.parentElement.style.display = "none"; }} />
            <p className="text-[11px] text-slate-400 mt-2 px-1 text-center italic">
              — FillOps News Photography
            </p>
          </div>
        )}

        {/* Article body */}
        {isHtml ? (
          <div
            className="
              [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-tight
              [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-[1.05rem] [&_p]:leading-[1.9] [&_p]:text-slate-700 [&_p]:mb-5
              [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-indigo-700
              [&_strong]:text-slate-900 [&_strong]:font-bold
              [&_em]:italic [&_em]:text-slate-600
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
              [&_li]:text-slate-700 [&_li]:text-[1.05rem] [&_li]:leading-relaxed
              [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-6
              [&_hr]:border-slate-200 [&_hr]:my-8
            "
            dangerouslySetInnerHTML={{ __html: selectedNews.content }}
          />
        ) : (
          // Plain text — split on newlines, drop cap on first para
          <div className="space-y-5">
            {(selectedNews.content || "").split("\n").filter(p => p.trim()).map((para, i) => (
              <p key={i}
                className="text-slate-700 leading-[1.9]"
                style={{ fontSize: "1.05rem", fontFamily: "Georgia, serif" }}>
                {i === 0 && para.length > 0 ? (
                  <>
                    <span
                      className="float-left font-bold text-slate-900 leading-none mr-2"
                      style={{ fontFamily: "Georgia, serif", fontSize: "4rem", lineHeight: 0.85, marginTop: "0.1em" }}>
                      {para[0]}
                    </span>
                    {para.slice(1)}
                  </>
                ) : para}
              </p>
            ))}
          </div>
        )}

        {/* Bottom back */}
        <div className="mt-14 pt-8 border-t border-slate-100">
          <button onClick={() => navigate("/news")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all stories
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}