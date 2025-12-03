// src/components/ui/separator.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(
      orientation === "vertical" ? "w-px h-full bg-border" : "h-px w-full bg-border",
      className
    )}
    {...props}
  />
));

Separator.displayName = "Separator";

export { Separator };
