
// import { useEffect } from "react";
// import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import useBlogStore from "@/store/adminBlogStore";
// import { CATEGORY_BADGE, CATEGORY_DOT } from "../../../components/DashboardComponents/admin/blog/admin/BlogUtils";
// import Logo from "@/assets/images/fillopsLogo.png";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function stripHtml(html) {
//   return (html || "")
//     .replace(/(&amp;)+nbsp;/g, " ")
//     .replace(/&nbsp;/g, " ")
//     .replace(/&amp;/g, "&")
//     .replace(/&lt;/g, "<")
//     .replace(/&gt;/g, ">")
//     .replace(/&quot;/g, '"')
//     .replace(/<[^>]*>/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function fmtDate(d) {
//   if (!d) return "";
//   return new Date(d).toLocaleDateString("en-US", {
//     month: "long", day: "numeric", year: "numeric",
//   });
// }

// function readTime(html) {
//   return Math.max(1, Math.ceil(stripHtml(html).trim().split(/\s+/).filter(Boolean).length / 200));
// }

// function convertBareImageUrls(html) {
//   if (!html) return html;
//   const IMAGE_URL_RE =
//     /(?<!['"=])(https?:\/\/[^\s<>"']+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff?|avif))(?![^<]*>)/gi;

//   return html.replace(IMAGE_URL_RE, (url) => {
//     return (
//       `<figure style="margin:2rem 0;">` +
//       `<img src="${url}" alt="" class="content-img" style="border-radius:12px;display:block;" />` +
//       `</figure>`
//     );
//   });
// }

// // ─── Footer ───────────────────────────────────────────────────────────────────
// function Footer() {
//   return (
//     <footer className="bg-white border-t border-slate-100 mt-20">
//       <div className="max-w-8xl mx-auto px-6 h-14 flex items-center justify-between">
//         <Link to="/blog" className="flex items-center gap-2.5 no-underline">
//           <img src={Logo} alt="FillOps Logo" className="w-8 h-8 object-contain" />
//           <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps Blog</span>
//         </Link>
//         <div className="hidden md:flex items-center gap-4 text-[13px] text-slate-500">
//           <p className="text-xs text-slate-400">© {new Date().getFullYear()} FillOps. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// // ─── Category Pill ────────────────────────────────────────────────────────────
// function CategoryPill({ category }) {
//   if (!category) return null;
//   const badge = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
//   const dot   = CATEGORY_DOT[category]   ?? "bg-slate-400";
//   return (
//     <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
//       {category}
//     </span>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function BlogDetailPage() {
//   const { slug } = useParams();
//   const location  = useLocation();
//   const navigate  = useNavigate();
//   const backLabel = location.state?.from?.includes("admin") ? "Back to dashboard" : "Back to blog";

//   // ✅ useEffect correctly inside the component
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.id = "content-img-style";
//     style.innerHTML = `
//       .content-img { height: 50px; width: 50%; }
//       @media (max-width: 768px) {
//         .content-img { height: 150px; width: 100%; }
//       }
//     `;
//     if (!document.getElementById("content-img-style")) {
//       document.head.appendChild(style);
//     }

//     return () => {
//       const el = document.getElementById("content-img-style");
//       if (el) document.head.removeChild(el);
//     };
//   }, []);

// // ─── Navbar ───────────────────────────────────────────────────────────────────
//   function Navbar() {
//     return (
//   <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
//     <div className="max-w-8xl mx-auto px-6 h-14 flex items-center justify-between">
//       <Link to="/blog" className="flex items-center gap-2.5 no-underline">
//         <img src={Logo} alt="FillOps Logo" className="w-8 h-8 object-contain" />
//         <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps Blog</span>
//       </Link>
//       <div className="flex items-center gap-8 text-[13px] text-slate-500">
//         <button
//           onClick={() => navigate(backPath)}
//           className="flex items-center gap-1.5 bg-gray-200 border text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer p-2"
//         >
//           {backLabel}
//         </button>
//       </div>
//     </div>
//   </nav>
//     );
//   }

//   const {
//     selectedBlog, isLoading, error,
//     fetchBlogBySlug, fetchAdminBlogById, clearError,
//   } = useBlogStore();

//   const backPath  = location.state?.from ?? "/blog";

//   useEffect(() => {
//     clearError();
//     window.scrollTo(0, 0);
//     const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
//     if (isUuid) fetchAdminBlogById(slug);
//     else        fetchBlogBySlug(slug);
//   }, [slug]);


//   if (isLoading) return (
//     <div className="min-h-screen bg-white">
//       <Navbar />
//       <div className="flex flex-col items-center justify-center py-40 gap-4">
//         <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-primary-hover animate-spin" />
//         <p className="text-sm text-slate-400 font-medium">Loading post…</p>
//       </div>
//       <Footer />
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen bg-white">
//       <Navbar />
//       <div className="flex flex-col items-center justify-center py-40 gap-4">
//         <span className="text-5xl">⚠️</span>
//         <h3 className="text-lg font-semibold text-slate-700" style={{ fontFamily: "Georgia, serif" }}>
//           Post not found
//         </h3>
//         <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
//         <button
//           onClick={() => navigate(backPath)}
//           className="mt-2 px-5 py-2.5 bg-primary-hover hover:bg-primary text-white text-sm font-semibold rounded-xl transition-colors"
//         >
//           ← {backLabel}
//         </button>
//       </div>
//       <Footer />
//     </div>
//   );

//   if (!selectedBlog) return null;

//   const author     = selectedBlog.author;
//   const authorName = author ? `${author.firstName} ${author.lastName}` : "FillOps";
//   const authorInit = author
//     ? `${author.firstName?.[0] ?? ""}${author.lastName?.[0] ?? ""}`
//     : "F";
//   const date   = fmtDate(selectedBlog.publishedAt || selectedBlog.createdAt);
//   const rt     = readTime(selectedBlog.content);
//   const isHtml = /<[a-z][\s\S]*>/i.test(selectedBlog.content || "");

//   const renderedContent = convertBareImageUrls(
//     (selectedBlog.content || "")
//       .replace(/(&amp;)+nbsp;/g, " ")
//       .replace(/&nbsp;/g, " ")
//   );

//   return (
//     <div className="min-h-screen bg-white" >
//       {(() => {
//         document.title = selectedBlog.metaTitle || selectedBlog.title || "FillOps Blog";
//         const desc = document.querySelector('meta[name="description"]');
//         if (desc && selectedBlog.metaDescription) desc.setAttribute("content", selectedBlog.metaDescription);
//         return null;
//       })()}

//       <Navbar />

//         {selectedBlog.coverImage && (
//         <div className="max-w-7xl mx-auto px-6 mt-8">
//           <img
//             src={selectedBlog.coverImage}
//             alt={selectedBlog.title}
//             className="w-full h-[400px] object-top object-cover rounded-2xl block"
//             onError={e => { e.target.parentElement.style.display = "none"; }}
//           />
//         </div>
//       )}
//       <main className="max-w-6xl mx-auto px-6 py-10">

//         {/* Category */}
//         {selectedBlog.category && (
//           <div className="mb-4">
//             <CategoryPill category={selectedBlog.category} />
//           </div>
//         )}

//         {/* Title */}
//         <h1
//           className="font-bold text-slate-900 leading-tight mb-4"
//           style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.18 }}
//         >
//           {selectedBlog.title}
//         </h1>

//         {/* Subtitle */}
//         {selectedBlog.metaDescription && (
//           <p className="text-base text-slate-500 leading-relaxed mb-6 border-l-4 border-primary pl-4 italic">
//             {selectedBlog.metaDescription}
//           </p>
//         )}

//         {/* Author row */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-y mb-8 border-slate-200">
  
//         {/* LEFT SIDE */}
//         <div className="flex items-start sm:items-center gap-3">
          
//           {/* Avatar */}
//           <div className="w-10 h-10 rounded-full bg-primary-hover flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
//             {authorInit}
//           </div>

//           {/* Author Info */}
//           <div className="min-w-0">
//             <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
//               {authorName}
//             </p>

//             {/* Meta */}
//             <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
              
//               <span>{date}</span>

//               <span>·</span>

//               <span className="flex items-center gap-1 whitespace-nowrap">
//                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 {rt} min read
//               </span>

//               {selectedBlog.category && (
//                 <>
//                   <span>·</span>
//                   <span className="text-primary font-medium whitespace-nowrap">
//                     {selectedBlog.category}
//                   </span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//       {/* RIGHT SIDE (SHARE BUTTON) */}
//       <div className="flex justify-end sm:justify-center">
//         <button
//           onClick={() =>
//             navigator.share?.({
//               title: selectedBlog.title,
//               text: selectedBlog.metaDescription || "",
//               url: window.location.href,
//             }).catch(() => {})
//           }
//           className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-primary-hover hover:border-primary transition-colors"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
//           </svg>
//         </button>
//       </div>

//        </div>

//         {/* ── Body ── */}
//         {isHtml ? (
//           <div
//             className="
//               [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-tight
//               [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-3
//               [&_p]:text-[1.05rem] [&_p]:leading-[1.9] [&_p]:text-slate-700 [&_p]:mb-5
//               [&_a]:text-primary-hover [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary
//               [&_strong]:text-slate-900 [&_strong]:font-bold
//               [&_em]:italic [&_em]:text-slate-600
//               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
//               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
//               [&_li]:text-slate-700 [&_li]:text-[1.05rem] [&_li]:leading-relaxed
//               [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-6 [&_blockquote]:bg-primary40 [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl
//               [&_hr]:border-slate-200 [&_hr]:my-8
//               [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:my-6
//               [&_code]:bg-slate-100 [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em] [&_code]:font-mono
//               [&_figure]:my-8 [&_figure]:mx-0
//               [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:block
//             "
//             dangerouslySetInnerHTML={{ __html: renderedContent }}
//           />
//         ) : (
//           <div className="space-y-5">
//             {(selectedBlog.content || "").split("\n").filter(p => p.trim()).map((para, i) => (
//               <p
//                 key={i}
//                 className="text-slate-700 leading-[1.9]"
//                 style={{ fontSize: "1.05rem", fontFamily: "Georgia, serif" }}
//               >
//                 {i === 0 && para.length > 0 ? (
//                   <>
//                     <span
//                       className="float-left font-bold text-slate-900 leading-none mr-2"
//                       style={{ fontFamily: "Georgia, serif", fontSize: "4rem", lineHeight: 0.85, marginTop: "0.1em" }}
//                     >
//                       {para[0]}
//                     </span>
//                     {para.slice(1)}
//                   </>
//                 ) : para}
//               </p>
//             ))}
//           </div>
//         )}

//         {/* Keywords */}
//         {selectedBlog.keywords && (
//           <div className="mt-10 pt-6 border-t border-slate-100">
//             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tags</p>
//             <div className="flex flex-wrap gap-2">
//               {selectedBlog.keywords.split(",").map(k => k.trim()).filter(Boolean).map(kw => (
//                 <span
//                   key={kw}
//                   className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-primaryhover:text-primary transition-colors cursor-default"
//                 >
//                   {kw}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Author card */}
//         <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
//           <div className="w-12 h-12 rounded-full bg-primary-hover flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
//             {authorInit}
//           </div>
//           <div>
//             <p className="text-sm font-bold text-slate-800 mb-1">Written by {authorName}</p>
//             <p className="text-xs text-slate-500 leading-relaxed">
//               FillOps editorial team — helping students and tutors navigate exams with confidence.
//             </p>
//           </div>
//         </div>

//         {/* Bottom back */}
//         <div className="mt-14 pt-8 border-t border-slate-100">
//           <button
//             onClick={() => navigate(backPath)}
//             className="inline-flex items-center gap-2 text-sm font-semibold text-primary-hover hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
//           >
//             <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             {backLabel}
//           </button>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }




import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import useBlogStore from "@/store/adminBlogStore";
import { CATEGORY_BADGE, CATEGORY_DOT } from "../../../components/DashboardComponents/admin/blog/admin/BlogUtils";
import Logo from "@/assets/images/fillopsLogo.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripHtml(html) {
  return (html || "")
    .replace(/(&amp;)+nbsp;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function readTime(html) {
  return Math.max(1, Math.ceil(stripHtml(html).trim().split(/\s+/).filter(Boolean).length / 200));
}

function convertBareImageUrls(html) {
  if (!html) return html;
  const IMAGE_URL_RE =
    /(?<!['"=])(https?:\/\/[^\s<>"']+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff?|avif))(?![^<]*>)/gi;

  return html.replace(IMAGE_URL_RE, (url) => {
    return (
      `<figure style="margin:2rem 0;">` +
      `<img src="${url}" alt="" class="content-img" style="border-radius:12px;display:block;" />` +
      `</figure>`
    );
  });
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-8xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/blog" className="flex items-center gap-2.5 no-underline">
          <img src={Logo} alt="FillOps Logo" className="w-8 h-8 object-contain" />
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps Blog</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-[13px] text-slate-500">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} FillOps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({ category }) {
  if (!category) return null;
  const badge = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  const dot   = CATEGORY_DOT[category]   ?? "bg-slate-400";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {category}
    </span>
  );
}

// ─── Recent Posts Links ───────────────────────────────────────────────────────
function RecentPostsLinks({ currentSlug }) {
  const { blogList, fetchPublicBlogs } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch public blogs if not already loaded
    if (!blogList || blogList.length === 0) {
      fetchPublicBlogs();
    }
  }, []);

  // Filter out the current post and take up to 5 recent ones
  const recentPosts = (blogList || [])
    .filter((b) => b.slug !== currentSlug)
    .slice(0, 5);

  if (!recentPosts.length) return null;

  return (
    <div className="mt-14 pt-8 border-t border-slate-100">
      <p className="text-[14px] font-bold italic text-red-400 uppercase tracking-widest mb-4">
        More Posts
      </p>
      <ul className="space-y-3">
        {recentPosts.map((post) => {
          const destination = post.slug ?? post.id;
          return (
            <li key={post.id ?? post.slug}>
              <button
                onClick={() =>
                  navigate(`/blog/${destination}`, {
                    state: { from: "/blog" },
                  })
                }
                className="group flex items-start gap-2 text-left w-full bg-transparent border-0 p-0 cursor-pointer"
              >
                {/* Bullet dot */}
                <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary-hover shrink-0 group-hover:scale-125 transition-transform" />
                {/* Title */}
                <span className="text-sm text-blue-700 underline leading-snug group-hover:text-primary-hover transition-colors font-medium">
                  {post.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
  const { slug } = useParams();
  const location  = useLocation();
  const navigate  = useNavigate();
  const backLabel = location.state?.from?.includes("admin") ? "Back to dashboard" : "Back to blog";

  // ✅ useEffect correctly inside the component
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "content-img-style";
    style.innerHTML = `
      .content-img { height: 50px; width: 50%; }
      @media (max-width: 768px) {
        .content-img { height: 150px; width: 100%; }
      }
    `;
    if (!document.getElementById("content-img-style")) {
      document.head.appendChild(style);
    }

    return () => {
      const el = document.getElementById("content-img-style");
      if (el) document.head.removeChild(el);
    };
  }, []);

// ─── Navbar ───────────────────────────────────────────────────────────────────
  function Navbar() {
    return (
  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-8xl mx-auto px-6 h-14 flex items-center justify-between">
      <Link to="/blog" className="flex items-center gap-2.5 no-underline">
        <img src={Logo} alt="FillOps Logo" className="w-8 h-8 object-contain" />
        <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps Blog</span>
      </Link>
      <div className="flex items-center gap-8 text-[13px] text-slate-500">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-1.5 bg-gray-200 border text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer p-2"
        >
          {backLabel}
        </button>
      </div>
    </div>
  </nav>
    );
  }

  const {
    selectedBlog, isLoading, error,
    fetchBlogBySlug, fetchAdminBlogById, clearError,
  } = useBlogStore();

  const backPath  = location.state?.from ?? "/blog";

  useEffect(() => {
    clearError();
    window.scrollTo(0, 0);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) fetchAdminBlogById(slug);
    else        fetchBlogBySlug(slug);
  }, [slug]);


  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-primary-hover animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading post…</p>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <span className="text-5xl">⚠️</span>
        <h3 className="text-lg font-semibold text-slate-700" style={{ fontFamily: "Georgia, serif" }}>
          Post not found
        </h3>
        <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
        <button
          onClick={() => navigate(backPath)}
          className="mt-2 px-5 py-2.5 bg-primary-hover hover:bg-primary text-white text-sm font-semibold rounded-xl transition-colors"
        >
          ← {backLabel}
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!selectedBlog) return null;

  const author     = selectedBlog.author;
  const authorName = author ? `${author.firstName} ${author.lastName}` : "FillOps";
  const authorInit = author
    ? `${author.firstName?.[0] ?? ""}${author.lastName?.[0] ?? ""}`
    : "F";
  const date   = fmtDate(selectedBlog.publishedAt || selectedBlog.createdAt);
  const rt     = readTime(selectedBlog.content);
  const isHtml = /<[a-z][\s\S]*>/i.test(selectedBlog.content || "");

  const renderedContent = convertBareImageUrls(
    (selectedBlog.content || "")
      .replace(/(&amp;)+nbsp;/g, " ")
      .replace(/&nbsp;/g, " ")
  );

  return (
    <div className="min-h-screen bg-white" >
      {(() => {
        document.title = selectedBlog.metaTitle || selectedBlog.title || "FillOps Blog";
        const desc = document.querySelector('meta[name="description"]');
        if (desc && selectedBlog.metaDescription) desc.setAttribute("content", selectedBlog.metaDescription);
        return null;
      })()}

      <Navbar />

        {selectedBlog.coverImage && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <img
            src={selectedBlog.coverImage}
            alt={selectedBlog.title}
            className="w-full h-[400px] object-top object-cover rounded-2xl block"
            onError={e => { e.target.parentElement.style.display = "none"; }}
          />
        </div>
      )}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Category */}
        {selectedBlog.category && (
          <div className="mb-4">
            <CategoryPill category={selectedBlog.category} />
          </div>
        )}

        {/* Title */}
        <h1
          className="font-bold text-slate-900 leading-tight mb-4"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.18 }}
        >
          {selectedBlog.title}
        </h1>

        {/* Subtitle */}
        {selectedBlog.metaDescription && (
          <p className="text-base text-slate-500 leading-relaxed mb-6 border-l-4 border-primary pl-4 italic">
            {selectedBlog.metaDescription}
          </p>
        )}

        {/* Author row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-y mb-8 border-slate-200">
  
        {/* LEFT SIDE */}
        <div className="flex items-start sm:items-center gap-3">
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary-hover flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            {authorInit}
          </div>

          {/* Author Info */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
              {authorName}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
              
              <span>{date}</span>

              <span>·</span>

              <span className="flex items-center gap-1 whitespace-nowrap">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {rt} min read
              </span>

              {selectedBlog.category && (
                <>
                  <span>·</span>
                  <span className="text-primary font-medium whitespace-nowrap">
                    {selectedBlog.category}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

      {/* RIGHT SIDE (SHARE BUTTON) */}
      <div className="flex justify-end sm:justify-center">
        <button
          onClick={() =>
            navigator.share?.({
              title: selectedBlog.title,
              text: selectedBlog.metaDescription || "",
              url: window.location.href,
            }).catch(() => {})
          }
          className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-primary-hover hover:border-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

       </div>

        {/* ── Body ── */}
        {isHtml ? (
          <div
            className="
              [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-tight
              [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-[1.05rem] [&_p]:leading-[1.9] [&_p]:text-slate-700 [&_p]:mb-5
              [&_a]:text-primary-hover [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary
              [&_strong]:text-slate-900 [&_strong]:font-bold
              [&_em]:italic [&_em]:text-slate-600
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
              [&_li]:text-slate-700 [&_li]:text-[1.05rem] [&_li]:leading-relaxed
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-6 [&_blockquote]:bg-primary40 [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl
              [&_hr]:border-slate-200 [&_hr]:my-8
              [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:my-6
              [&_code]:bg-slate-100 [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em] [&_code]:font-mono
              [&_figure]:my-8 [&_figure]:mx-0
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:block
            "
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        ) : (
          <div className="space-y-5">
            {(selectedBlog.content || "").split("\n").filter(p => p.trim()).map((para, i) => (
              <p
                key={i}
                className="text-slate-700 leading-[1.9]"
                style={{ fontSize: "1.05rem", fontFamily: "Georgia, serif" }}
              >
                {i === 0 && para.length > 0 ? (
                  <>
                    <span
                      className="float-left font-bold text-slate-900 leading-none mr-2"
                      style={{ fontFamily: "Georgia, serif", fontSize: "4rem", lineHeight: 0.85, marginTop: "0.1em" }}
                    >
                      {para[0]}
                    </span>
                    {para.slice(1)}
                  </>
                ) : para}
              </p>
            ))}
          </div>
        )}

        {/* Keywords */}
        {selectedBlog.keywords && (
          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {selectedBlog.keywords.split(",").map(k => k.trim()).filter(Boolean).map(kw => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-primaryhover:text-primary transition-colors cursor-default"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author card */}
        <div className="mt-10 p-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-hover flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
            {authorInit}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">Written by {authorName}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              FillOps editorial team — helping students and tutors navigate exams with confidence.
            </p>
          </div>
        </div>

        {/* ── Recent Posts Links (replaces bottom back button) ── */}
        <RecentPostsLinks currentSlug={slug} />

      </main>

      <Footer />
    </div>
  );
}