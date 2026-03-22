import { Link } from "react-router-dom";
import { stripHtml, rt, CATEGORY_BADGE, CATEGORY_DOT } from "./BlogUtils";

export default function BlogPreviewFeed({ blogs }) {
  const hero     = blogs[0];
  const featured = blogs.slice(1, 3);
  const more     = blogs.slice(3);

  const authorLabel = b =>
    b.author ? `${b.author.firstName} ${b.author.lastName}` : "FillOps";

  const CategoryPill = ({ category }) => {
    if (!category) return null;
    const badge = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    const dot   = CATEGORY_DOT[category]   ?? "bg-slate-400";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {category}
      </span>
    );
  };

  if (!blogs.length) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
        <svg className="w-9 h-9 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="font-semibold text-slate-500 text-base">No blog posts match this filter</p>
      <p className="text-sm text-slate-400">Try a different category or publish more posts</p>
    </div>
  );

  return (
    <div className="space-y-14">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {hero && (
        <Link
          to={`/blog/${hero.slug || hero.id}`}
          state={{ from: "/blog/admin" }}
          className="block no-underline group"
        >
          {hero.coverImage ? (
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200" style={{ height: 420 }}>
              <img
                src={hero.coverImage}
                alt={hero.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                onError={e => e.target.style.display = "none"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-blue-300 text-[11px] font-bold uppercase tracking-widest">Featured Post</span>
                  {hero.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wide border border-white/20">
                      {hero.category}
                    </span>
                  )}
                </div>
                <h2
                  className="font-bold text-white leading-[1.15] mb-3 group-hover:text-blue-100 transition-colors duration-300"
                  style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                >
                  {hero.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 max-w-2xl mb-5">
                  {hero.metaDescription || stripHtml(hero.content).slice(0, 220)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {authorLabel(hero)[0]}
                    </div>
                    <span className="text-slate-300 text-xs font-medium">{authorLabel(hero)}</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-400 text-xs">{rt(hero.content)} min read</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-white/50 group-hover:text-blue-300 transition-colors">
                    Read post
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 p-10 shadow-2xl shadow-slate-200 group-hover:shadow-blue-100 transition-shadow duration-500">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-blue-400 text-[11px] font-bold uppercase tracking-widest">Featured Post</span>
                  {hero.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wide border border-white/10">
                      {hero.category}
                    </span>
                  )}
                </div>
                <h2
                  className="font-bold text-white leading-tight mb-4 group-hover:text-blue-200 transition-colors duration-300"
                  style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
                >
                  {hero.title}
                </h2>
                <p className="text-slate-400 text-base leading-relaxed line-clamp-3 max-w-3xl mb-6">
                  {hero.metaDescription || stripHtml(hero.content).slice(0, 280)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                      {authorLabel(hero)[0]}
                    </div>
                    <span className="text-slate-400 text-xs font-medium">{authorLabel(hero)}</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{rt(hero.content)} min read</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                    Read post
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Link>
      )}

      {/* ── Featured 2-col ────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-5 rounded-full bg-blue-600" />
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>Featured</h3>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {featured.map(b => (
              <Link
                key={b.id}
                to={`/blog/${b.slug || b.id}`}
                state={{ from: "/blog/admin" }}
                className="group block no-underline bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                {b.coverImage && (
                  <div className="h-44 overflow-hidden bg-slate-100">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.parentElement.style.display = "none"; }}
                    />
                  </div>
                )}
                <div className="p-5">
                  {b.category && (
                    <div className="mb-2">
                      <CategoryPill category={b.category} />
                    </div>
                  )}
                  <h4
                    className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors text-[15px]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {b.title}
                  </h4>
                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {b.metaDescription || stripHtml(b.content).slice(0, 130)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[9px] font-black">
                        {authorLabel(b)[0]}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{authorLabel(b)}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rt(b.content)} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── More Posts ────────────────────────────────────────────────────── */}
      {more.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-5 rounded-full bg-slate-300" />
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>More Posts</h3>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {more.map(b => (
              <Link
                key={b.id}
                to={`/blog/${b.slug || b.id}`}
                state={{ from: "/blog/admin" }}
                className="group block no-underline bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                {b.coverImage && (
                  <div className="h-40 overflow-hidden bg-slate-100">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.parentElement.style.display = "none"; }}
                    />
                  </div>
                )}
                <div className="p-4">
                  {b.category && (
                    <div className="mb-2">
                      <CategoryPill category={b.category} />
                    </div>
                  )}
                  <h4
                    className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors text-[14px]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {b.metaDescription || stripHtml(b.content).slice(0, 100)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[8px] font-black">
                        {authorLabel(b)[0]}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{authorLabel(b)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rt(b.content)} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}