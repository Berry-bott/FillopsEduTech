import { Link } from "react-router-dom";
import { stripHtml, rt } from "./NewsUtils";

export default function PreviewFeed({ articles }) {
  const hero     = articles[0];
  const featured = articles.slice(1, 3);
  const more     = articles.slice(3);

  const authorLabel = n =>
    n.author ? `${n.author.firstName} ${n.author.lastName}` : "FillOps";

  if (!articles.length) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
        <svg className="w-9 h-9 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <p className="font-semibold text-slate-500 text-base">No articles match this filter</p>
      <p className="text-sm text-slate-400">Try a different audience or publish more articles</p>
    </div>
  );

  return (
    <div className="space-y-14">

      {/* ── Hero ── */}
      {hero && (
        <Link to={`/news/${hero.id}`} state={{ from: "/news/admin" }} className="block no-underline group">
          {hero.coverImage ? (
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200" style={{ height: 420 }}>
              <img src={hero.coverImage} alt={hero.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                onError={e => e.target.style.display = "none"} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-blue-300 text-[11px] font-bold uppercase tracking-widest">Featured Story</span>
                </div>
                <h2 className="font-bold text-white leading-[1.15] mb-3 group-hover:text-blue-100 transition-colors duration-300"
                  style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
                  {hero.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 max-w-2xl mb-5">
                  {stripHtml(hero.content).slice(0, 220)}
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
                    Read article
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 p-10 shadow-2xl shadow-slate-200 group-hover:shadow-blue-100 transition-shadow duration-500">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-blue-400 text-[11px] font-bold uppercase tracking-widest">Featured Story</span>
                </div>
                <h2 className="font-bold text-white leading-tight mb-4 group-hover:text-blue-200 transition-colors duration-300"
                  style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}>
                  {hero.title}
                </h2>
                <p className="text-slate-400 text-base leading-relaxed line-clamp-3 max-w-3xl mb-6">
                  {stripHtml(hero.content).slice(0, 280)}
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
                    Read article
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

      {/* ── Featured 2-col ── */}
      {featured.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-5 rounded-full bg-blue-600" />
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>Featured</h3>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {featured.map(n => (
              <Link key={n.id} to={`/news/${n.id}`} state={{ from: "/news/admin" }}
                className="group block no-underline bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                {n.coverImage && (
                  <div className="h-44 overflow-hidden bg-slate-100">
                    <img src={n.coverImage} alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.parentElement.style.display = "none"; }} loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors text-[15px]"
                    style={{ fontFamily: "Georgia, serif" }}>
                    {n.title}
                  </h4>
                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {stripHtml(n.content).slice(0, 130)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[9px] font-black">
                        {authorLabel(n)[0]}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{authorLabel(n)}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rt(n.content)} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── More Stories ── */}
      {more.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-5 rounded-full bg-slate-300" />
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>More Stories</h3>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {more.map(n => (
              <Link key={n.id} to={`/news/${n.id}`} state={{ from: "/news/admin" }}
                className="group block no-underline bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                {n.coverImage && (
                  <div className="h-40 overflow-hidden bg-slate-100">
                    <img src={n.coverImage} alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.parentElement.style.display = "none"; }} loading="lazy" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors text-[14px]"
                    style={{ fontFamily: "Georgia, serif" }}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {stripHtml(n.content).slice(0, 100)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[8px] font-black">
                        {authorLabel(n)[0]}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{authorLabel(n)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rt(n.content)} min</span>
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