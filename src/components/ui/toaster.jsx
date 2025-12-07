
    import React from "react";
    import { useToast } from "./use-toast";
    
    export  function Toaster() {
      const { toasts, dismiss } = useToast();
    
      return (
        <div className="fixed bottom-4 right-4 space-y-3 z-[10000]">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-primary dark:bg-slate-50 dark:text-gray-800 text-white p-4 rounded shadow-lg w-72 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  {toast.title && <p className="font-semibold">{toast.title}</p>}
                  {toast.description && (
                    <p className="text-sm opacity-70">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="text-white text-xl ml-2 hover:text-gray-300 dark:text-gray-600"
                >
                  ×
                </button>
              </div>
    
              {/* Progress bar */}
              <div
                className="absolute bottom-0 left-0 h-1 dark:bg-indigo-500 bg-white"
                style={{
                  width: `${toast.progress ?? 100}%`,
                  transition: "width 0.1s linear",
                }}
              />
            </div>
          ))}
        </div>
      );
    }
    