

import { useState, useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/blog`;

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
            <div className="w-[900px] max-w-full border ml-4 overflow-hidden">
              <div className="min-w-full inline-flex animate-scroll-banner whitespace-nowrap">
                <span className="text-[13px] text-orange-500 dark:text-white group-hover:text-primary transition-colors px-2 md:ml-6">
                  {post.title}
                </span>
              </div>
            </div>

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