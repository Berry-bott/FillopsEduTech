// // components/BookingStatusBadge.jsx
// import { Badge } from "@/components/ui/badge";   // ← your existing Badge

// export function BookingStatusBadge({ status }) {
//   const lower = (status || "pending").toLowerCase();

//   if (lower === "pending") {
//     return (
//       <Badge 
//         variant="outline"
//         className="bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
//       >
//         Pending
//       </Badge>
//     );
//   }

//   if (lower === "confirmed") {
//     return (
//       <Badge 
//         variant="outline"
//         className="bg-green-50 text-green-800 border-green-300 hover:bg-green-100"
//       >
//         Confirmed
//       </Badge>
//     );
//   }

//   if (lower === "completed") {
//     return (
//       <Badge 
//         variant="outline"
//         className="bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
//       >
//         Completed
//       </Badge>
//     );
//   }

//   if (lower === "cancelled") {
//     return (
//       <Badge 
//         variant="outline"
//         className="bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
//       >
//         Cancelled
//       </Badge>
//     );
//   }

//   // fallback for unknown / custom statuses
//   return (
//     <Badge variant="secondary">
//       {status || "Unknown"}
//     </Badge>
//   );
// }









import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, RotateCw, PlayCircle } from "lucide-react";

export function BookingStatusBadge({ status, className = "" }) {
  const lower = (status || "pending").toLowerCase();

  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100",
      icon: Clock,
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-green-50 text-green-800 border-green-300 hover:bg-green-100",
      icon: CheckCircle,
    },
    active: {
      label: "Active",
      className: "bg-green-50 text-green-800 border-green-300 hover:bg-green-100",
      icon: PlayCircle,
    },
    completed: {
      label: "Completed",
      className: "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-800 border-red-300 hover:bg-red-100",
      icon: XCircle,
    },
    "reschedule-proposed": {
      label: "Reschedule Proposed",
      className: "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100",
      icon: RotateCw,
    },
    rescheduled: {
      label: "Rescheduled",
      className: "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100",
      icon: RotateCw,
    },
  };

  const config = statusConfig[lower] || {
    label: status || "Unknown",
    className: "bg-gray-50 text-gray-800 border-gray-300",
    icon: null,
  };

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${className} gap-1.5`}>
      {Icon && <Icon className="size-3" />}
      {config.label}
    </Badge>
  );
}