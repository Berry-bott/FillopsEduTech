import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/images/fillopsLogo.png";

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/blog`;

const CATEGORIES = ["All", "WAEC", "JAMB", "NECO", "GCE", "Study Tips", "News"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripHtml(html) {
  return (html || "")
    .replace(/(&amp;)+nbsp;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanExcerpt(html, max) {
  const IMAGE_URL_RE = /https?:\/\/[^\s<>"']+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff?|avif)/gi;
  return stripHtml(html).replace(IMAGE_URL_RE, "").replace(/\s+/g, " ").trim().slice(0, max);
}

function readTime(html) {
  return Math.ceil(stripHtml(html).trim().split(/\s+/).filter(Boolean).length / 50);
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Category badge colors ─────────────────────────────────────────────────
const CAT_COLOR = {
  WAEC:       "bg-emerald-100 text-emerald-700",
  JAMB:       "bg-blue-100 text-blue-700",
  NECO:       "bg-primary text-primary",
  GCE:        "bg-orange-100 text-orange-700",
  "Study Tips": "bg-amber-100 text-amber-700",
  News:       "bg-rose-100 text-rose-700",
};

function CategoryBadge({ cat }) {
  if (!cat) return null;
  const cls = CAT_COLOR[cat] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {cat}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto py-8 px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <img src={Logo} alt="FillOps" className="w-8 h-8 object-contain" />
           <span className="text-primary dark:text-primary text-xl md:text-[1rem] xmd:text-2xl lg:text-3xl font-extrabold">Fillop<span className="text-orange-500">Blog</span></span>
        </Link>
        <div className="flex gap-4 md:pr-12">
          <Link
            to="/"
            className=" border border-transparent px-3 py-2 text-sm font-semibold text-slate-500 no-underline transition-all duration-200 hover:border-gray-300 hover:bg-gray-200 hover:text-slate-900"
          >
            Explore Fillop Study
          </Link>

          <a
            href="https://filloptech.com/"
            className=" border border-transparent px-3 py-2 text-sm font-semibold text-slate-500 no-underline transition-all duration-200 hover:border-gray-300 hover:bg-gray-200 hover:text-slate-900"
          >
            Professional Courses
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
      <span className="text-primary dark:text-primary text-xl md:text-[1rem] xmd:text-2xl lg:text-3xl font-extrabold">Fillop<span className="text-orange-500">Blog</span></span>
        </Link>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Fillop. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3 mt-4" />
      </div>
    </div>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────
function HeroCard({ blog }) {
  const author = blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "FillOp";
  const excerpt = blog.metaDescription || cleanExcerpt(blog.content, 240);

  return (
    <Link
      to={`/blog/${blog.slug || blog.id}`}
      className="group block no-underline"
    >
      <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900" style={{ height: 450 }}>
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-60 transition-transform duration-700 group-hover:scale-[1.03]"
            onError={e => { e.target.style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          {blog.category && (
            <span className="inline-block  mb-3 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              {blog.category}
            </span>
          )}
          <h2
            className="font-bold text-white mb-3 leading-tight group-hover:text-blue-100 transition-colors"
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
          >
            {blog.title}
          </h2>
          {excerpt && (
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 max-w-2xl mb-5">
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black shrink-0">
                {author[0]}
              </div>
              <span className="text-slate-300 text-xs font-medium">{author}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">{fmtDate(blog.publishedAt || blog.createdAt)}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">{readTime(blog.content)} min read</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/60 group-hover:text-blue-300 transition-colors">
              Read
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Standard card ────────────────────────────────────────────────────────────
function BlogCard({ blog }) {
  const author  = blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "FillOps";
  const excerpt = blog.metaDescription || cleanExcerpt(blog.content, 120);

  return (
    <Link
      to={`/blog/${blog.slug || blog.id}`}
      className="group block no-underline bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      {blog.coverImage ? (
        <div className="h-40 shrink-0 overflow-hidden bg-slate-100">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.parentElement.style.display = "none"; }}
          />
        </div>
      ) : (
        <div className="h-48 shrink-0 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="px-5 py-2 flex flex-col flex-1">
        {blog.category && (
          <div className="mb-2">
            <CategoryBadge cat={blog.category} />
          </div>
        )}
        <h3
          className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors text-[15px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {blog.title}
        </h3>
        {excerpt && (
          <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-black">
              {author[0]}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">{author}</span>
            <span className="text-slate-300 text-[10px]">·</span>
            <span className="text-[11px] text-slate-400">{fmtDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
          <span className="text-[11px] text-slate-400">{readTime(blog.content)} min</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [blogs,      setBlogs]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [loadingMore,setLoadingMore]= useState(false);
  const [error,      setError]      = useState(null);
  const [category,   setCategory]   = useState("All");
  const [page,       setPage]       = useState(1);
  const [hasMore,    setHasMore]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [searchInput,setSearchInput]= useState("");
  const debounceRef = useRef(null);

  // fetch blogs
  const fetchBlogs = async (cat, pg, reset = false) => {
    if (reset) setLoading(true);
    else       setLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: String(pg), limit: "9" });
      if (cat !== "All") params.set("category", cat);

      const res  = await fetch(`${BASE}?${params}`);
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();

      const items      = data?.data?.blogs ?? data?.data?.items ?? data?.data ?? [];
      const pagination = data?.data?.pagination ?? null;

      setBlogs(prev => reset ? items : [...prev, ...items]);
      setHasMore(pagination ? pg < pagination.totalPages : items.length === 9);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // initial + category change
  useEffect(() => {
    setPage(1);
    fetchBlogs(category, 1, true);
  }, [category]);

  // search debounce
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val.trim().toLowerCase()), 300);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchBlogs(category, next, false);
  };

  // client-side search filter on loaded blogs
  const displayed = search
    ? blogs.filter(b =>
        b.title?.toLowerCase().includes(search) ||
        stripHtml(b.content).toLowerCase().includes(search) ||
        b.category?.toLowerCase().includes(search)
      )
    : blogs;

  const hero = displayed[0];
  const rest = displayed.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="flex md:justify-between max-md:flex-col-reverse items-center max-w-7xl mx-auto px-6 md:pt-2 pb-8 pl-8">
          <div>
          <h1 className="text-[1.7rem] md:text-5xl font-extrabold text-slate-900 mb-2 mt-5 max-md:w-full "
          >
            Blog & Study Resources
          </h1>
          <p className="text-slate-500 text-base max-w-full ">
            Exam guides, study tips, and news to help you pass WAEC, JAMB, NECO and more.
          </p>
            </div>

          {/* Search */}
          <div className="mt-6 relative md:w-8xl max-md:w-full self-start inlineblock ">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={e => handleSearchInput(e.target.value)}
              placeholder="Search articles…"
              className="sm:w-full md:w-[400px] pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
               placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setSearch(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto pb-px scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-3 border border-transparent  text-sm font-semibold no-underline transition-all duration-200 hover:border-gray-300 hover:bg-gray-200 border-b-2 ${
                  category === cat
                    ? "border-primary-hover text-primary"
                    : "border border-transparent px-1 py-1 text-sm font-semibold text-slate-500 no-underline transition-all duration-200 hover:border-gray-300 hover:bg-gray-200 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={() => fetchBlogs(category, 1, true)}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-8">
            <Skeleton className="w-full h-[480px] rounded-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-500">No posts found</p>
            {search && (
              <button
                onClick={() => { setSearchInput(""); setSearch(""); }}
                className="text-xs text-primary font-semibold underline underline-offset-2"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Posts */}
        {!loading && !error && displayed.length > 0 && (
          <div className="space-y-10">

            {/* Hero */}
            {hero && <HeroCard blog={hero} />}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(b => <BlogCard key={b.id} blog={b} />)}
              </div>
            )}

            {/* Load more */}
            {!search && hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more posts"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}