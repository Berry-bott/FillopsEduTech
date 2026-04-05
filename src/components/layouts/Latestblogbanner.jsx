

// import { useState, useEffect } from "react";
// import { ArrowRight, X } from "lucide-react";

// const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/blog";

// export default function LatestBlogBanner() {
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [dismissed, setDismissed] = useState(false);

//   useEffect(() => {
//     async function fetchLatest() {
//       try {
//         const res = await fetch(`${BASE_URL}?page=1&limit=1`);
//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         const blogs = data?.data?.blogs ?? [];
//         if (blogs.length > 0) setPost(blogs[0]);
//       } catch {}
//       finally {
//         setLoading(false);
//       }
//     }
//     fetchLatest();
//   }, []);

//   if (loading || dismissed || !post) return null;

//   const slug = post.slug || post.id;

//   return (
//     <div className="group w-full border border-primary/20 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors overflow-hidden -mt-1 sm:-mt-4 mb-4">
//       <div className="flex items-center p-">

//         <a
//           href={`/blog/${slug}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex-1 min-w-0 flex items-center justify-between no-underline"
//         >
//           <h3 className="text-[13px]  text-primary-hover dark:text-white truncate group-hover:text-primary transition-colors px-2">
//             {post.title}
//           </h3>

//           <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary transition-all duration-200">
//             <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
//           </div>
//         </a>

//         <button
//           onClick={() => setDismissed(true)}
//           className="flex-shrink-0 ml-1 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//           aria-label="Dismiss"
//         >
//           <X className="h-4 w-4" />
//         </button>

//       </div>
//     </div>
//   );
// }




import { useState, useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";

const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/blog";

export default function LatestBlogBanner() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(`${BASE_URL}?page=1&limit=1`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const blogs = data?.data?.blogs ?? [];
        if (blogs.length > 0) setPost(blogs[0]);
      } catch {}
      finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading || dismissed || !post) return null;

  const slug = post.slug || post.id;

  return (
    // Relative wrapper that holds the height so content below doesn't jump
    <div ref={containerRef} className="relative h-10 mt-1 mb-">
      {/* Absolute banner stretches to fill the nearest positioned ancestor (the content area) */}
      <div className="absolute inset-x-0 top-0 group border border-primary/20 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors overflow-hidden">
        <div className="flex items-center ">

          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 flex items-center justify-between no-underline"
          >
            <h3 className="text-[13px] text-primary-hover dark:text-white truncate group-hover:text-primary transition-colors px-2">
              {post.title}
            </h3>

            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary transition-all duration-200">
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 ml-1 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

        </div>
      </div>
    </div>
  );
}