// components/BookingStatusBadge.jsx
import { Badge } from "@/components/ui/badge";   // ← your existing Badge

export function BookingStatusBadge({ status }) {
  const lower = (status || "pending").toLowerCase();

  if (lower === "pending") {
    return (
      <Badge 
        variant="outline"
        className="bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
      >
        Pending
      </Badge>
    );
  }

  if (lower === "confirmed") {
    return (
      <Badge 
        variant="outline"
        className="bg-green-50 text-green-800 border-green-300 hover:bg-green-100"
      >
        Confirmed
      </Badge>
    );
  }

  if (lower === "completed") {
    return (
      <Badge 
        variant="outline"
        className="bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
      >
        Completed
      </Badge>
    );
  }

  if (lower === "cancelled") {
    return (
      <Badge 
        variant="outline"
        className="bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
      >
        Cancelled
      </Badge>
    );
  }

  // fallback for unknown / custom statuses
  return (
    <Badge variant="secondary">
      {status || "Unknown"}
    </Badge>
  );
}