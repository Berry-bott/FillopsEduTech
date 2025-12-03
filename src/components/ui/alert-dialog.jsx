import React from "react"

export function AlertDialog({ open, onOpenChange, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      ></div>

      <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg border">
        {children}
      </div>
    </div>
  )
}

export function AlertDialogContent({ children }) {
  return <div className="space-y-4">{children}</div>
}

export function AlertDialogHeader({ children }) {
  return <div className="space-y-2">{children}</div>
}

export function AlertDialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

export function AlertDialogDescription({ children }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export function AlertDialogFooter({ children }) {
  return <div className="flex justify-end gap-2 mt-4">{children}</div>
}

export function AlertDialogCancel({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-md border hover:bg-accent text-sm"
    >
      {children}
    </button>
  )
}

export function AlertDialogAction({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
    >
      {children}
    </button>
  )
}
