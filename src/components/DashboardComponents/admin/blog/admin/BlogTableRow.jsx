import { CATEGORY_BADGE, CATEGORY_DOT, fmt, stripHtml, rt } from "./blogUtils";

export default function BlogTableRow({ blog, onEdit, onDelete, onTogglePublish, isSubmitting, index }) {
  const categoryKey = blog.category ?? "";
  const badge = CATEGORY_BADGE[categoryKey] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  const dot   = CATEGORY_DOT[categoryKey]   ?? "bg-slate-400";
  const plain = stripHtml(blog.content);

  return (
    <tr className="group border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
      {/* # */}
      <td className="pl-6 py-4 w-10">
        <span className="text-xs text-slate-400 font-mono tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </td>

      {/* Cover + title */}
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate max-w-xs group-hover:text-blue-700 transition-colors">
              {blog.title}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
              {plain.slice(0, 70)}{plain.length > 70 ? "…" : ""}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 pr-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {categoryKey || "Uncategorised"}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 pr-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
          blog.isPublished
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${blog.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
          {blog.isPublished ? "Live" : "Draft"}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 pr-4">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {fmt(blog.publishedAt || blog.createdAt)}
        </span>
      </td>

      {/* Read time */}
      <td className="py-4 pr-4">
        <span className="text-xs text-slate-400">{rt(blog.content)} min</span>
      </td>

      {/* Actions */}
      <td className="py-4 pr-6">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {/* Edit */}
          <button
            onClick={() => onEdit(blog)}
            title="Edit"
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Publish / Unpublish */}
          <button
            onClick={() => onTogglePublish(blog)}
            disabled={isSubmitting}
            title={blog.isPublished ? "Unpublish" : "Publish"}
            className={`p-2 rounded-lg transition-all disabled:opacity-40 ${
              blog.isPublished
                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {blog.isPublished ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(blog.id)}
            disabled={isSubmitting}
            title="Delete"
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}