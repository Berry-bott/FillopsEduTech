import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useNewsStore from "@/store/newsStore";
import Logo from "../../assets/images/fillopsLogo.png"

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
  const w = stripHtml(html).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(w / 200))} min read`;
}

function Pill({ audience }) {
  return (
    <span className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${AUDIENCE_COLOR[audience] ?? AUDIENCE_COLOR.ALL}`}>
      {AUDIENCE_LABEL[audience] ?? "General"}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onSearch }) {
  const { filters, setFilters, fetchNews } = useNewsStore();
  const [q, setQ]               = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const FILTERS = [
    { label: "All",      val: undefined       },
    { label: "Students", val: "USERS_ONLY"    },
    { label: "Tutors",   val: "TUTORS_ONLY"   },
    { label: "Everyone", val: "ALL"           },
  ];

  const applyAudience = (val) => {
    setFilters({ targetAudience: val });
    fetchNews();
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/news" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 rounded-lg  flex items-center justify-center shadow-sm">
            <img src={Logo} alt="" />
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps News</span>
        </Link>

        {/* Audience filter tabs */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {FILTERS.map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => applyAudience(opt.val)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                filters.targetAudience === opt.val
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 shrink-0">
          {showSearch && (
            <form onSubmit={submit} className="flex items-center gap-2">
              <input autoFocus type="text" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search stories…"
                className="w-48 px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors">Go</button>
              <button type="button" onClick={() => { setShowSearch(false); setQ(""); onSearch(""); }}
                className="text-slate-400 hover:text-slate-600 text-sm px-1">✕</button>
            </form>
          )}
          <button onClick={() => setShowSearch(s => !s)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800">
            <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────
function HeroCard({ news }) {
  const author = news.author
    ? `${news.author.firstName} ${news.author.lastName}`
    : "FillOps";
  const initials = news.author
    ? `${news.author.firstName?.[0] ?? ""}${news.author.lastName?.[0] ?? ""}`
    : "F";

  return (
    <Link to={`/news/${news.id}`} className="block no-underline group">
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 420 }}>
        {news.coverImage ? (
          <img src={news.coverImage} alt={news.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            onError={e => e.target.style.display = "none"} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
          <div className="mb-3"><Pill audience={news.targetAudience} /></div>
          <h2 className="font-bold text-white leading-tight mb-3 group-hover:text-indigo-200 transition-colors"
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", lineHeight: 1.2 }}>
            {news.title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2 max-w-2xl">
            {stripHtml(news.content).slice(0, 200)}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <span className="text-slate-200 text-sm font-medium">{author}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime(news.content)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Featured card — matches image exactly: big left image + text right ───────
function FeaturedCard({ news }) {
  const author = news.author
    ? `${news.author.firstName} ${news.author.lastName}`
    : "FillOps";

  return (
    <Link to={`/news/${news.id}`} className="flex flex-col no-underline group h-full">
      {/* Large image on top */}
      <div className="w-full rounded-xl overflow-hidden bg-slate-100 shrink-0" style={{ height: 160 }}>
        {news.coverImage ? (
          <img src={news.coverImage} alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => e.target.style.display = "none"} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Text below */}
      <div className="pt-4 flex flex-col flex-1">
        <div className="mb-2"><Pill audience={news.targetAudience} /></div>
        <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2"
          style={{ fontFamily: "Georgia, serif" }}>
          {news.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
          {stripHtml(news.content).slice(0, 130)}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto">
          <span className="font-medium text-slate-500">{author}</span>
          <span>·</span>
          <span>{readTime(news.content)}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Story card (More Stories grid) ──────────────────────────────────────────
function StoryCard({ news }) {
  const author = news.author
    ? `${news.author.firstName} ${news.author.lastName}`
    : "FillOps";

  return (
    <Link to={`/news/${news.id}`} className="flex flex-col no-underline group">
      {/* Image */}
      <div className="w-full rounded-2xl overflow-hidden bg-slate-100 mb-4" style={{ height: 220 }}>
        {news.coverImage ? (
          <img src={news.coverImage} alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => e.target.style.display = "none"} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <svg className="w-14 h-14 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="mb-2"><Pill audience={news.targetAudience} /></div>
      <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors line-clamp-3"
        style={{ fontFamily: "Georgia, serif" }}>
        {news.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-3 flex-1">
        {stripHtml(news.content).slice(0, 150)}
      </p>
      <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto">
        <span className="font-medium text-slate-500">{author}</span>
        <span>·</span>
        <span>{readTime(news.content)}</span>
      </div>
    </Link>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
                {/* Logo */}
        <Link to="/news" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 rounded-lg  flex items-center justify-center shadow-sm">
            <img src={Logo} alt="" />
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps News</span>
        </Link>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} FillOps. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const { newsList, isLoading, error, filters, setFilters, fetchNews } = useNewsStore();

  // On mount: force isPublished=true so public feed only shows live articles
  useEffect(() => {
    setFilters({ isPublished: true });
  }, []);

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const handleSearch = (q) => setFilters({ search: q });

  const published = (newsList || []).filter(n => n.isPublished);
  const hero      = published[0];
  const featured  = published.slice(1, 3);  // exactly 2 cards side by side
  const more      = published.slice(3);     // rest in grid

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar onSearch={handleSearch} />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading stories…</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-3 text-slate-400">
            <span className="text-5xl">⚠️</span>
            <p className="text-base font-semibold text-slate-600">Couldn't load stories</p>
            <p className="text-sm text-red-400 text-center max-w-sm">{error}</p>
            <button onClick={fetchNews} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold underline">Try again</button>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && !error && published.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-400">
            <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-lg font-semibold text-slate-500" style={{ fontFamily: "Georgia, serif" }}>No stories yet</p>
            <p className="text-sm">Check back soon for the latest updates.</p>
          </div>
        )}

        {!isLoading && !error && published.length > 0 && (
          <>
            {/* ── Hero ── */}
            {hero && (
              <section className="mb-12">
                <HeroCard news={hero} />
              </section>
            )}

            {/* ── Featured — 2 side-by-side cards matching the screenshot ── */}
            {featured.length > 0 && (
              <section className="mb-14">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>Featured</h2>
                  <span className="text-sm text-slate-400 font-medium">Latest stories</span>
                </div>
                {/* 2-column grid — each card is a rounded bordered box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {featured.map(n => (
                    <div key={n.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white">
                      <FeaturedCard news={n} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── More Stories grid ── */}
            {more.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>More Stories</h2>
                  <span className="text-sm text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 flex items-center gap-1">
                    View all
                    <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {more.map(n => <StoryCard key={n.id} news={n} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}