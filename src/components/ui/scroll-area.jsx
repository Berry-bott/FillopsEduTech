// src/components/ui/scroll-area.jsx
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils"; // optional utility to merge classNames

const ScrollArea = React.forwardRef(({ children, className, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden rounded-lg", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      className="flex touch-none select-none p-0.5 bg-gray-200 dark:bg-gray-800 transition-colors"
      orientation="vertical"
    >
      <ScrollAreaPrimitive.Thumb className="flex-1 rounded-full bg-gray-400 dark:bg-gray-600" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Scrollbar
      className="flex touch-none select-none p-0.5 bg-gray-200 dark:bg-gray-800 transition-colors"
      orientation="horizontal"
    >
      <ScrollAreaPrimitive.Thumb className="flex-1 rounded-full bg-gray-400 dark:bg-gray-600" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner className="bg-gray-300 dark:bg-gray-700" />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
