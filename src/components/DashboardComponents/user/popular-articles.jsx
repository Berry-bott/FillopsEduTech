// import { Badge } from "@/components/ui/badge";
// import { TrendingUp, Eye, MessageSquare, Share2 } from "lucide-react";

// const articles = [
//   {
//     id: "1",
//     title: "10 Essential Tips for Remote Work Productivity",
//     category: "Business",
//     views: 15420,
//     comments: 89,
//     shares: 234,
//     trend: 23.5,
//     publishDate: "3 days ago",
//     readTime: "5 min read",
//   },
//   {
//     id: "2",
//     title: "The Complete Guide to Machine Learning",
//     category: "Technology",
//     views: 12890,
//     comments: 156,
//     shares: 445,
//     trend: 18.2,
//     publishDate: "1 week ago",
//     readTime: "12 min read",
//   },
//   {
//     id: "3",
//     title: "Sustainable Living: Small Changes, Big Impact",
//     category: "Lifestyle",
//     views: 9876,
//     comments: 67,
//     shares: 189,
//     trend: 15.7,
//     publishDate: "2 days ago",
//     readTime: "7 min read",
//   },
//   {
//     id: "4",
//     title: "Cryptocurrency Market Analysis 2024",
//     category: "Finance",
//     views: 8543,
//     comments: 203,
//     shares: 567,
//     trend: 12.3,
//     publishDate: "5 days ago",
//     readTime: "9 min read",
//   },
//   {
//     id: "5",
//     title: "Mental Health in the Digital Age",
//     category: "Health",
//     views: 7234,
//     comments: 45,
//     shares: 123,
//     trend: 9.8,
//     publishDate: "1 week ago",
//     readTime: "6 min read",
//   },
// ];

// const categoryColors = {
//   Business: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
//   Technology: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
//   Lifestyle: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
//   Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
//   Health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
// };

// export default function PopularArticles() {
//   return (
//     <div className="bg-white dark:bg-background rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Articles</h3>
//         <select className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground">
//           <option>This week</option>
//           <option>This month</option>
//           <option>All time</option>
//         </select>
//       </div>

//       <div className="space-y-3">
//         {articles.map((article, index) => (
//           <div
//             key={article.id}
//             className="flex items-center space-x-3 p-3 hover:bg-accent/50 rounded-lg transition-colors"
//           >
//             <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs font-medium text-muted-foreground flex-shrink-0">
//               {index + 1}
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between mb-1">
//                 <h4 className="text-sm font-medium text-foreground truncate flex-1">{article.title}</h4>
//                 <div className="flex items-center ml-2 flex-shrink-0">
//                   <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
//                   <span className="text-xs text-green-600 dark:text-green-400 font-medium">
//                     +{article.trend}%
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Badge
//                     className={`${categoryColors[article.category]} border-0 text-xs`}
//                   >
//                     {article.category}
//                   </Badge>
//                   <span className="text-xs text-muted-foreground">{article.readTime}</span>
//                 </div>

//                 <div className="flex items-center space-x-3 text-xs text-muted-foreground">
//                   <div className="flex items-center space-x-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{article.views.toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <MessageSquare className="h-3 w-3" />
//                     <span>{article.comments}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Share2 className="h-3 w-3" />
//                     <span>{article.shares}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





// import { useState, useEffect } from "react";
// import { TrendingUp, Eye, MessageSquare, Share2, ExternalLink, RefreshCw, Loader2 } from "lucide-react";

// const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/blog";
// const MAX_ARTICLES = 5;

// const categoryColors = {
//   WAEC: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
//   Technology: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
//   Lifestyle: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
//   Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
//   Health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
//   Business: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
//   default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
// };

// function getCategoryColor(category) {
//   return categoryColors[category] || categoryColors.default;
// }

// function formatViews(num) {
//   if (!num) return "0";
//   if (num >= 1000) return (num / 1000).toFixed(1) + "k";
//   return num.toString();
// }

// function timeAgo(dateStr) {
//   if (!dateStr) return "";
//   const now = new Date();
//   const date = new Date(dateStr);
//   const diff = Math.floor((now - date) / 1000);
//   if (diff < 60) return "just now";
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
//   return `${Math.floor(diff / 604800)}w ago`;
// }

// function estimateReadTime(content) {
//   if (!content) return "5 min read";
//   const words = content.trim().split(/\s+/).length;
//   const minutes = Math.ceil(words / 200);
//   return `${minutes} min read`;
// }

// export default function PopularArticles() {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [refreshing, setRefreshing] = useState(false);
//   const [categories, setCategories] = useState([]);

//   async function fetchArticles(category = "all") {
//     try {
//       const url =
//         category === "all"
//           ? `${BASE_URL}?page=1&limit=${MAX_ARTICLES}`
//           : `${BASE_URL}?category=${encodeURIComponent(category)}&page=1&limit=${MAX_ARTICLES}`;

//       const res = await fetch(url);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();

//       // API shape: { success: true, data: { blogs: [...], pagination: {} } }
//       const raw = Array.isArray(data?.data?.blogs) ? data.data.blogs : [];

//       // Keep only the 5 most recent (sort by createdAt desc, slice to MAX_ARTICLES)
//       const sorted = [...raw]
//         .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0))
//         .slice(0, MAX_ARTICLES);

//       // Merge API categories + each blog's category field, deduplicated
//       const apiCats = Array.isArray(data?.data?.categories) ? data.data.categories : [];
//       const contentCats = sorted.map((a) => a.category).filter(Boolean);

//       const seen = new Set();
//       const uniqueCats = [...apiCats, ...contentCats]
//         .map((cat) => cat.toUpperCase())
//         .filter((cat) => {
//           if (seen.has(cat)) return false;
//           seen.add(cat);
//           return true;
//         });

//       setCategories(uniqueCats);

//       setArticles(sorted);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "Failed to load articles");
//     }
//   }

//   async function loadData(category = "all") {
//     setLoading(true);
//     await fetchArticles(category);
//     setLoading(false);
//   }

//   async function handleRefresh() {
//     setRefreshing(true);
//     await fetchArticles(filter);
//     setRefreshing(false);
//   }

//   useEffect(() => {
//     loadData(filter);
//   }, [filter]);

//   function handleBlogClick(article) {
//     const slug = article.slug || article.id;
//     if (!slug) return;
//     window.open(`/blog/${slug}`, "_blank", "noopener,noreferrer");
//   }

//   return (
//     <div className="bg-white dark:bg-background rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-5">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Articles</h3>

//         <div className="flex items-center gap-2">
//           {/* Refresh button */}
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing || loading}
//             className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
//             title="Refresh"
//           >
//             <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
//           </button>

//           {/* Category filter — populated dynamically from API */}
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground"
//           >
//             <option value="all">All</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Loading state */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           <span className="text-sm">Loading articles…</span>
//         </div>
//       )}

//       {/* Error state */}
//       {!loading && error && (
//         <div className="flex flex-col items-center justify-center py-10 gap-2">
//           <p className="text-sm text-red-500">{error}</p>
//           <button
//             onClick={() => loadData(filter)}
//             className="text-xs underline text-muted-foreground hover:text-foreground"
//           >
//             Try again
//           </button>
//         </div>
//       )}

//       {/* Empty state */}
//       {!loading && !error && articles.length === 0 && (
//         <div className="text-center py-10 text-sm text-muted-foreground">
//           No articles found.
//         </div>
//       )}

//       {/* Article list */}
//       {!loading && !error && articles.length > 0 && (
//         <div className="space-y-2">
//           {articles.map((article, index) => {
//             const slug = article.slug || article.id;
//             const category = article.category || "General";
//             const views = article.views ?? article.viewCount ?? 0;
//             const comments = article.comments ?? article.commentCount ?? 0;
//             const shares = article.shares ?? article.shareCount ?? 0;
//             const trend = article.trend ?? article.trendingScore ?? null;
//             const date = article.publishedAt || article.createdAt;
//             const readTime = article.readTime || estimateReadTime(article.preview || article.content || article.body);

//             return (
//               <button
//                 key={article.id || article._id || index}
//                 onClick={() => handleBlogClick(article)}
//                 className="w-full flex items-center space-x-3 p-3 hover:bg-accent/50 rounded-lg transition-colors text-left group"
//               >
//                 {/* Rank */}
//                 <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs font-medium text-muted-foreground flex-shrink-0">
//                   {index + 1}
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   {/* Title row */}
//                   <div className="flex items-start justify-between mb-1 gap-2">
//                     <h4 className="text-sm font-medium text-foreground truncate flex-1 group-hover:text-primary transition-colors">
//                       {article.title}
//                     </h4>
//                     <div className="flex items-center gap-1.5 flex-shrink-0">
//                       {trend !== null && (
//                         <>
//                           <TrendingUp className="h-3 w-3 text-green-500" />
//                           <span className="text-xs text-green-600 dark:text-green-400 font-medium">
//                             +{typeof trend === "number" ? trend.toFixed(1) : trend}%
//                           </span>
//                         </>
//                       )}
//                       <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
//                     </div>
//                   </div>

//                   {/* Meta row */}
//                   <div className="flex items-center justify-between gap-2">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}
//                       >
//                         {category}
//                       </span>
//                       <span className="text-xs text-muted-foreground">{readTime}</span>
//                       {date && (
//                         <span className="text-xs text-muted-foreground hidden sm:inline">
//                           {timeAgo(date)}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <Eye className="h-3 w-3" />
//                         <span>{formatViews(views)}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <MessageSquare className="h-3 w-3" />
//                         <span>{comments}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Share2 className="h-3 w-3" />
//                         <span>{shares}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {/* Footer note */}
//       {!loading && !error && articles.length > 0 && (
//         <p className="text-xs text-muted-foreground text-center mt-4">
//           Showing {articles.length} most recent articles
//         </p>
//       )}
//     </div>
//   );
// }






import { useState, useEffect } from "react";
import { TrendingUp, Eye, Share2, ExternalLink, RefreshCw, Loader2 } from "lucide-react";

const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/blog";
const MAX_ARTICLES = 5;

const categoryColors = {
  WAEC: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Technology: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Lifestyle: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Business: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

function getCategoryColor(category) {
  return categoryColors[category] || categoryColors.default;
}

function formatViews(num) {
  if (!num) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

function estimateReadTime(content) {
  if (!content) return "5 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export default function PopularArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [localStats, setLocalStats] = useState({}); // { [articleId]: { clicks, shares } }

  async function fetchArticles(category = "all") {
    try {
      const url =
        category === "all"
          ? `${BASE_URL}?page=1&limit=${MAX_ARTICLES}`
          : `${BASE_URL}?category=${encodeURIComponent(category)}&page=1&limit=${MAX_ARTICLES}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // API shape: { success: true, data: { blogs: [...], pagination: {} } }
      const raw = Array.isArray(data?.data?.blogs) ? data.data.blogs : [];

      // Keep only the 5 most recent (sort by createdAt desc, slice to MAX_ARTICLES)
      const sorted = [...raw]
        .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0))
        .slice(0, MAX_ARTICLES);

      // Merge API categories + each blog's category field, deduplicated
      const apiCats = Array.isArray(data?.data?.categories) ? data.data.categories : [];
      const contentCats = sorted.map((a) => a.category).filter(Boolean);

      const seen = new Set();
      const uniqueCats = [...apiCats, ...contentCats]
        .map((cat) => cat.toUpperCase())
        .filter((cat) => {
          if (seen.has(cat)) return false;
          seen.add(cat);
          return true;
        });

      setCategories(uniqueCats);

      setArticles(sorted);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load articles");
    }
  }

  async function loadData(category = "all") {
    setLoading(true);
    await fetchArticles(category);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchArticles(filter);
    setRefreshing(false);
  }

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  function handleBlogClick(article) {
    const slug = article.slug || article.id;
    if (!slug) return;
    const id = article.id || slug;
    setLocalStats((prev) => ({
      ...prev,
      [id]: { ...prev[id], clicks: ((prev[id]?.clicks) || 0) + 1, shares: prev[id]?.shares || 0 },
    }));
    window.open(`/blog/${slug}`, "_blank", "noopener,noreferrer");
  }

  function handleShare(e, article) {
    e.stopPropagation(); // prevent triggering the blog click
    const id = article.id || article.slug;
    const slug = article.slug || article.id;
    const url = `${window.location.origin}/blog/${slug}`;
    if (navigator.share) {
      navigator.share({ title: article.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
    }
    setLocalStats((prev) => ({
      ...prev,
      [id]: { ...prev[id], shares: ((prev[id]?.shares) || 0) + 1, clicks: prev[id]?.clicks || 0 },
    }));
  }

  return (
    <div className="bg-white dark:bg-background rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Articles</h3>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          {/* Category filter — populated dynamically from API */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading articles…</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => loadData(filter)}
            className="text-xs underline text-muted-foreground hover:text-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No articles found.
        </div>
      )}

      {/* Article list */}
      {!loading && !error && articles.length > 0 && (
        <div className="space-y-2">
          {articles.map((article, index) => {
            const slug = article.slug || article.id;
            const category = article.category || "General";
            const artId = article.id || article.slug;
            const local = localStats[artId] || {};
            const apiViews = article.views ?? article.viewCount ?? 0;
            const views = apiViews + (local.clicks || 0);
            const shares = (article.shares ?? article.shareCount ?? 0) + (local.shares || 0);
            const trend = article.trend ?? article.trendingScore ?? null;
            const date = article.publishedAt || article.createdAt;
            const readTime = article.readTime || estimateReadTime(article.preview || article.content || article.body);

            return (
              <div
                key={article.id || article._id || index}
                onClick={() => handleBlogClick(article)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-accent/50 rounded-lg transition-colors text-left group"
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs font-medium text-muted-foreground flex-shrink-0">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate flex-1 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {trend !== null && (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            +{typeof trend === "number" ? trend.toFixed(1) : trend}%
                          </span>
                        </>
                      )}
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}
                      >
                        {category}
                      </span>
                      <span className="text-xs text-muted-foreground">{readTime}</span>
                      {date && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {timeAgo(date)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(views)}</span>
                      </div>
                      <button
                        onClick={(e) => handleShare(e, article)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-3 w-3" />
                        <span>{formatViews(shares)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      {!loading && !error && articles.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Showing {articles.length} most recent articles
        </p>
      )}
    </div>
  );
}