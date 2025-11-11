import React, { useState } from "react";

export default function ExpandableText({ text, maxLength = 180 }) {
  const [expanded, setExpanded] = useState(false);

  // Determine if text should be truncated on small/medium screens
  const isSmallScreen = typeof window !== "undefined" ? window.innerWidth < 1024 : true;
  const shouldTruncate = isSmallScreen && text.length > maxLength;

  const displayText = expanded || !shouldTruncate
    ? text
    : text.slice(0, maxLength) + "...";

  return (
    <div className="relative">
      <p>{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary font-medium mt-1 hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
      {/* Optional fade effect at bottom */}
      {shouldTruncate && !expanded && (
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      )}
    </div>
  );
}
