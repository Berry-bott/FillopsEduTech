import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({ onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "slideUp 0.2s ease both" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" />
        <div className="px-6 pt-6 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-500">
            <Trash2 size={22} strokeWidth={2} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Delete notification?</h3>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            This notification will be permanently removed. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-70 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}