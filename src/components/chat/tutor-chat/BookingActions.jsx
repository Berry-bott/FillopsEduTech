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






// import { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { useTutorChatStore } from "@/store/tutorChatStore";
// import { Button } from "@/components/ui/button";
// import {
//   MoreVertical,
//   XCircle,
//   RotateCw,
//   MessageSquare,
//   Loader2,
// } from "lucide-react";

// export default function BookingActions({ booking }) {
//   const { cancelBooking, proposeReschedule, endSession } = useTutorChatStore();

//   const [showMenu, setShowMenu] = useState(false);
//   const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const buttonRef = useRef(null);

//   // Calculate dropdown position
//   const handleToggle = (e) => {
//     e.stopPropagation();
//     if (!showMenu && buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       setMenuPos({
//         top: rect.bottom + window.scrollY + 8,
//         right: window.innerWidth - rect.right,
//       });
//     }
//     setShowMenu((prev) => !prev);
//   };

//   // Close menu when clicking outside or pressing Escape
//   useEffect(() => {
//     if (!showMenu) return;

//     const handleClickOutside = (e) => {
//       if (buttonRef.current?.contains(e.target)) return;
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

//   // ── Action Handlers ─────────────────────────────────────────────

//   const handleCancel = async () => {
//     if (!window.confirm("Are you sure you want to cancel this booking?")) return;

//     setShowMenu(false);
//     const reason = prompt("Cancellation reason (required):")?.trim();
//     if (!reason) {
//       alert("A reason is required to cancel.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await cancelBooking(booking.id, reason);
//     } catch (err) {
//       alert(`Failed to cancel: ${err.message || "Unknown error"}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReschedule = async () => {
//     setShowMenu(false);
//     const newDateStr = prompt(
//       "New date and time (YYYY-MM-DDTHH:mm)\nExample: 2025-04-15T14:30"
//     )?.trim();

//     if (!newDateStr) return;

//     setIsSubmitting(true);
//     try {
//       await proposeReschedule(booking.id, newDateStr);
//     } catch (err) {
//       alert(`Failed to propose reschedule: ${err.message || "Unknown error"}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEndSession = async () => {
//     if (!window.confirm("Are you sure you want to end this session?")) return;

//     setShowMenu(false);
//     const notes = prompt("Session notes (optional):")?.trim() || "";

//     setIsSubmitting(true);
//     try {
//       await endSession(booking.id, notes);
//     } catch (err) {
//       alert(`Failed to end session: ${err.message || "Unknown error"}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Render menu content based on status ─────────────────────────

//   const renderMenuItems = () => {
//     const itemBase =
//       "w-full justify-start text-sm font-normal px-4 py-2.5 transition-colors flex items-center gap-3";

//     if (booking.status === "pending") {
//       return (
//         <>
//           <Button
//             variant="ghost"
//             className={`${itemBase} text-blue-600 hover:text-blue-700 hover:bg-blue-50/70`}
//             onClick={handleReschedule}
//             disabled={isSubmitting}
//           >
//             <RotateCw className="h-4 w-4" />
//             Propose Reschedule
//           </Button>

//           <div className="h-px bg-gray-200 my-1 mx-2" />

//           <Button
//             variant="ghost"
//             className={`${itemBase} text-red-600 hover:text-red-700 hover:bg-red-50/70`}
//             onClick={handleCancel}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <XCircle className="h-4 w-4" />
//             )}
//             Cancel Booking
//           </Button>
//         </>
//       );
//     }

//     if (booking.status === "confirmed") {
//       return (
//         <>
//           <Button
//             variant="ghost"
//             className={`${itemBase} text-blue-600 hover:text-blue-700 hover:bg-blue-50/70`}
//             onClick={handleEndSession}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <MessageSquare className="h-4 w-4" />
//             )}
//             End Session
//           </Button>

//           <Button
//             variant="ghost"
//             className={`${itemBase} text-blue-600 hover:text-blue-700 hover:bg-blue-50/70`}
//             onClick={handleReschedule}
//             disabled={isSubmitting}
//           >
//             <RotateCw className="h-4 w-4" />
//             Propose Reschedule
//           </Button>

//           <div className="h-px bg-gray-200 my-1 mx-2" />

//           <Button
//             variant="ghost"
//             className={`${itemBase} text-red-600 hover:text-red-700 hover:bg-red-50/70`}
//             onClick={handleCancel}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <XCircle className="h-4 w-4" />
//             )}
//             Cancel Booking
//           </Button>
//         </>
//       );
//     }

//     return (
//       <div className="px-6 py-5 text-sm text-muted-foreground text-center italic">
//         No actions available
//       </div>
//     );
//   };

//   return (
//     <div className="relative inline-block">
//       <Button
//         ref={buttonRef}
//         variant="ghost"
//         size="icon"
//         onClick={handleToggle}
//         disabled={isSubmitting}
//         aria-label="Booking actions menu"
//         className="h-8 w-8"
//       >
//         {isSubmitting ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <MoreVertical className="h-4 w-4" />
//         )}
//       </Button>

//       {showMenu &&
//         createPortal(
//           <div
//             className="fixed z-[9999] min-w-[220px] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-2xl"
//             style={{
//               top: `${menuPos.top}px`,
//               right: `${menuPos.right}px`,
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="py-1">{renderMenuItems()}</div>
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// }






import { useState, useRef, useEffect, useCallback } from "react";
// import { Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreVertical,
  XCircle,
  RotateCw,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingActions({ booking }) {
  const { cancelBooking, proposeReschedule, endSession } = useTutorChatStore();

  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Dialog states
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

  // Form states
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

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

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (buttonRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setShowMenu(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMenu]);

  // ── Action Handlers ─────────────────────────────────────────────

  const handleCancelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔴 CANCEL CLICKED - Opening dialog");
    setShowMenu(false);
    setTimeout(() => {
      setShowCancelDialog(true);
      setCancelReason("");
    }, 100);
  };

  const handleCancelConfirm = async () => {
    console.log("🔴 CANCEL CONFIRM", { reason: cancelReason });
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelBooking(booking.id, cancelReason.trim());
      setShowCancelDialog(false);
      setCancelReason("");
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(`Failed to cancel: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRescheduleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔵 RESCHEDULE CLICKED - Opening dialog");
    setShowMenu(false);
    
    setTimeout(() => {
      setShowRescheduleDialog(true);
      
      // Pre-fill with current scheduled time if available
      if (booking.scheduledAt) {
        const date = new Date(booking.scheduledAt);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().slice(0, 5);
        setRescheduleDate(dateStr);
        setRescheduleTime(timeStr);
      } else {
        setRescheduleDate("");
        setRescheduleTime("");
      }
    }, 100);
  };

  const handleRescheduleConfirm = async () => {
    console.log("🔵 RESCHEDULE CONFIRM", { date: rescheduleDate, time: rescheduleTime });
    
    if (!rescheduleDate || !rescheduleTime) {
      alert("Please select both date and time");
      return;
    }

    // Combine date and time into ISO string
    const proposedAt = `${rescheduleDate}T${rescheduleTime}:00`;
    
    // Validate it's a future date
    const proposedDateTime = new Date(proposedAt);
    if (proposedDateTime <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      await proposeReschedule(booking.id, proposedAt);
      setShowRescheduleDialog(false);
      setRescheduleDate("");
      setRescheduleTime("");
      alert("Reschedule proposal sent successfully");
    } catch (err) {
      console.error("Reschedule error:", err);
      alert(`Failed to propose reschedule: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSessionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🟢 END SESSION CLICKED - Opening dialog");
    setShowMenu(false);
    setTimeout(() => {
      setShowEndSessionDialog(true);
      setSessionNotes("");
    }, 100);
  };

  const handleEndSessionConfirm = async () => {
    console.log("🟢 END SESSION CONFIRM", { notes: sessionNotes });
    setIsSubmitting(true);
    try {
      await endSession(booking.id, sessionNotes.trim());
      setShowEndSessionDialog(false);
      setSessionNotes("");
      alert("Session ended successfully");
    } catch (err) {
      console.error("End session error:", err);
      alert(`Failed to end session: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Menu Item Component ─────────────────────────────────────────

  const MenuItem = ({ icon: Icon, label, onClick, variant = "blue" }) => {
    const colors = {
      blue: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
      red: "text-red-600 hover:text-red-700 hover:bg-red-50",
    };

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isSubmitting}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-normal transition-colors ${colors[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  };

  // ── Render menu content based on status ─────────────────────────

  const renderMenuItems = () => {
    if (booking.status === "pending") {
      return (
        <>
          <MenuItem
            icon={RotateCw}
            label="Propose Reschedule"
            onClick={handleRescheduleClick}
            variant="blue"
          />
          <div className="h-px bg-gray-200 my-1 mx-2" />
          <MenuItem
            icon={XCircle}
            label="Cancel Booking"
            onClick={handleCancelClick}
            variant="red"
          />
        </>
      );
    }

    if (booking.status === "confirmed" || booking.status === "active") {
      return (
        <>
          <MenuItem
            icon={MessageSquare}
            label="End Session"
            onClick={handleEndSessionClick}
            variant="blue"
          />
          <MenuItem
            icon={RotateCw}
            label="Propose Reschedule"
            onClick={handleRescheduleClick}
            variant="blue"
          />
          <div className="h-px bg-gray-200 my-1 mx-2" />
          <MenuItem
            icon={XCircle}
            label="Cancel Booking"
            onClick={handleCancelClick}
            variant="red"
          />
        </>
      );
    }

    if (booking.status === "reschedule-proposed") {
      return (
        <>
          <MenuItem
            icon={RotateCw}
            label="Change Proposed Time"
            onClick={handleRescheduleClick}
            variant="blue"
          />
          <div className="h-px bg-gray-200 my-1 mx-2" />
          <MenuItem
            icon={XCircle}
            label="Cancel Booking"
            onClick={handleCancelClick}
            variant="red"
          />
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
    <>
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
              ref={menuRef}
              className="fixed z-[9999] min-w-[220px] overflow-hidden rounded-lg border bg-white text-popover-foreground shadow-2xl"
              style={{
                top: `${menuPos.top}px`,
                right: `${menuPos.right}px`,
              }}
            >
              <div className="py-1">{renderMenuItems()}</div>
            </div>,
            document.body
          )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason *</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please provide a reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isSubmitting}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isSubmitting || !cancelReason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="size-4 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose Reschedule</DialogTitle>
            <DialogDescription>
              Select a new date and time for this session. The student will need to accept the change.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date *</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time *</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>

            {rescheduleDate && rescheduleTime && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Proposed time: {new Date(`${rescheduleDate}T${rescheduleTime}`).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRescheduleConfirm}
              disabled={isSubmitting || !rescheduleDate || !rescheduleTime}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Proposing...
                </>
              ) : (
                <>
                  <RotateCw className="size-4 mr-2" />
                  Propose Reschedule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Session Dialog */}
      <Dialog open={showEndSessionDialog} onOpenChange={setShowEndSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
            <DialogDescription>
              Mark this session as completed. You can optionally add notes about the session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-notes">Session Notes (Optional)</Label>
              <Textarea
                id="session-notes"
                placeholder="Add any notes about this session..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEndSessionDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEndSessionConfirm}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <MessageSquare className="size-4 mr-2" />
                  End Session
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}