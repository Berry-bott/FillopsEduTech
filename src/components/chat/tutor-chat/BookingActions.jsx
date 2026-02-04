// import { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { useTutorChatStore } from "@/store/tutorChatStore";
// import { Button } from "@/components/ui/button";
// import { MoreVertical, XCircle, RotateCw, MessageSquare } from "lucide-react";

// export default function BookingActions({ booking }) {
//   const { cancelBooking, proposeReschedule, endSession } = useTutorChatStore();
  
//   const [showMenu, setShowMenu] = useState(false);
//   const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const buttonRef = useRef(null);

//   // Calculate position and open menu
//   const handleToggle = (e) => {
//     e.stopPropagation();
//     if (!showMenu && buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       setMenuPos({
//         top: rect.bottom + 8,
//         right: window.innerWidth - rect.right,
//       });
//     }
//     setShowMenu((prev) => !prev);
//   };

//   // Close menu on outside click or Escape
//   useEffect(() => {
//     if (!showMenu) return;

//     const handleClickOutside = (e) => {
//       if (buttonRef.current && buttonRef.current.contains(e.target)) return;
//       setShowMenu(false);
//     };

//     const handleEscape = (e) => {
//       if (e.key === "Escape") setShowMenu(false);
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, [showMenu]);

//   // --- Action handlers ---

//   const handleCancel = async () => {
//     setShowMenu(false);
//     const reason = prompt("Please enter cancellation reason:");
//     if (!reason || !reason.trim()) return;
//     setIsSubmitting(true);
//     try {
//       await cancelBooking(booking.id, reason);
//     } catch (err) {
//       alert("❌ Failed to cancel booking: " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReschedule = async () => {
//     setShowMenu(false);
//     const newDate = prompt("Enter new date and time (YYYY-MM-DDTHH:mm):\nExample: 2025-02-15T14:30");
//     if (!newDate || !newDate.trim()) return;
//     setIsSubmitting(true);
//     try {
//       await proposeReschedule(booking.id, newDate);
//     } catch (err) {
//       alert("❌ Failed to propose reschedule: " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEndSession = async () => {
//     setShowMenu(false);
//     const notes = prompt("Add session notes (optional):");
//     setIsSubmitting(true);
//     try {
//       await endSession(booking.id, notes || "");
//     } catch (err) {
//       alert("❌ Failed to end session: " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- Menu items per status (no confirm here — it lives in the header) ---
//   const renderMenuItems = () => {
//     if (booking.status === "pending") {
//       // Pending: only reschedule + cancel (accept is the header button)
//       return (
//         <>
//           <button onClick={handleReschedule} disabled={isSubmitting} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
//             <RotateCw className="size-4 text-blue-600" />
//             <span>Propose Reschedule</span>
//           </button>
//           <div className="h-px bg-gray-200 my-1" />
//           <button onClick={handleCancel} disabled={isSubmitting} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
//             <XCircle className="size-4" />
//             <span>Cancel Booking</span>
//           </button>
//         </>
//       );
//     }

//     if (booking.status === "confirmed") {
//       return (
//         <>
//           <button onClick={handleEndSession} disabled={isSubmitting} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
//             <MessageSquare className="size-4 text-blue-600" />
//             <span>End Session</span>
//           </button>
//           <button onClick={handleReschedule} disabled={isSubmitting} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
//             <RotateCw className="size-4 text-blue-600" />
//             <span>Propose Reschedule</span>
//           </button>
//           <div className="h-px bg-gray-200 my-1" />
//           <button onClick={handleCancel} disabled={isSubmitting} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
//             <XCircle className="size-4" />
//             <span>Cancel Booking</span>
//           </button>
//         </>
//       );
//     }

//     return (
//       <div className="px-4 py-3 text-sm text-gray-500 text-center">
//         No actions available
//       </div>
//     );
//   };

//   return (
//     <>
//       <Button
//         ref={buttonRef}
//         variant="ghost"
//         size="icon"
//         onClick={handleToggle}
//         disabled={isSubmitting}
//       >
//         <MoreVertical className="size-4" />
//       </Button>

//       {showMenu &&
//         createPortal(
//           <div
//             className="fixed bg-white rounded-lg border border-gray-200 shadow-2xl py-1 min-w-[200px]"
//             style={{
//               top: menuPos.top,
//               right: menuPos.right,
//               zIndex: 999999,
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {renderMenuItems()}
//           </div>,
//           document.body
//         )}
//     </>
//   );
// }






import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  XCircle,
  RotateCw,
  MessageSquare,
  Loader2,
} from "lucide-react";

export default function BookingActions({ booking }) {
  const { cancelBooking, proposeReschedule, endSession } = useTutorChatStore();

  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef(null);

  // Calculate dropdown position
  const handleToggle = (e) => {
    e.stopPropagation();
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setShowMenu((prev) => !prev);
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (buttonRef.current?.contains(e.target)) return;
      setShowMenu(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMenu]);

  // ── Action Handlers ─────────────────────────────────────────────

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setShowMenu(false);
    const reason = prompt("Cancellation reason (required):")?.trim();
    if (!reason) {
      alert("A reason is required to cancel.");
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelBooking(booking.id, reason);
    } catch (err) {
      alert(`Failed to cancel: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = async () => {
    setShowMenu(false);
    const newDateStr = prompt(
      "New date and time (YYYY-MM-DDTHH:mm)\nExample: 2025-04-15T14:30"
    )?.trim();

    if (!newDateStr) return;

    setIsSubmitting(true);
    try {
      await proposeReschedule(booking.id, newDateStr);
    } catch (err) {
      alert(`Failed to propose reschedule: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    if (!window.confirm("Are you sure you want to end this session?")) return;

    setShowMenu(false);
    const notes = prompt("Session notes (optional):")?.trim() || "";

    setIsSubmitting(true);
    try {
      await endSession(booking.id, notes);
    } catch (err) {
      alert(`Failed to end session: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render menu content based on status ─────────────────────────

  const renderMenuItems = () => {
    const itemBase =
      "w-full justify-start text-sm font-normal px-4 py-2.5 transition-colors flex items-center gap-3";

    if (booking.status === "pending") {
      return (
        <>
          <Button
            variant="ghost"
            className={`${itemBase} text-blue-600 hover:text-blue-700 hover:bg-blue-50/70`}
            onClick={handleReschedule}
            disabled={isSubmitting}
          >
            <RotateCw className="h-4 w-4" />
            Propose Reschedule
          </Button>

          <div className="h-px bg-gray-200 my-1 mx-2" />

          <Button
            variant="ghost"
            className={`${itemBase} text-red-600 hover:text-red-700 hover:bg-red-50/70`}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Cancel Booking
          </Button>
        </>
      );
    }

    if (booking.status === "confirmed") {
      return (
        <>
          <Button
            variant="ghost"
            className={`${itemBase} text-blue-600 hover:text-blue-700 hover:bg-blue-50/70`}
            onClick={handleEndSession}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            End Session
          </Button>

          <Button
            variant="ghost"
            className={`${itemBase} text-blue-600 hover:text-blue-700 hover:bg-blue-50/70`}
            onClick={handleReschedule}
            disabled={isSubmitting}
          >
            <RotateCw className="h-4 w-4" />
            Propose Reschedule
          </Button>

          <div className="h-px bg-gray-200 my-1 mx-2" />

          <Button
            variant="ghost"
            className={`${itemBase} text-red-600 hover:text-red-700 hover:bg-red-50/70`}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Cancel Booking
          </Button>
        </>
      );
    }

    return (
      <div className="px-6 py-5 text-sm text-muted-foreground text-center italic">
        No actions available
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isSubmitting}
        aria-label="Booking actions menu"
        className="h-8 w-8"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </Button>

      {showMenu &&
        createPortal(
          <div
            className="fixed z-[9999] min-w-[220px] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-2xl"
            style={{
              top: `${menuPos.top}px`,
              right: `${menuPos.right}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">{renderMenuItems()}</div>
          </div>,
          document.body
        )}
    </div>
  );
}