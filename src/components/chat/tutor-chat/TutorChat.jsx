
// import { useEffect, useState, useCallback } from "react";
// import { useTutorChatStore } from "@/store/tutorChatStore";
// import { getSocket } from "@/lib/tutor-socket";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// import {
//   MessageSquare,
//   Calendar,
//   Clock,
//   User,
//   CheckCircle,
//   XCircle,
//   RotateCw,
//   Loader2,
//   AlertCircle,
//   Menu,
// } from "lucide-react";
// import { format, parseISO } from "date-fns";
// import BookingActions from "./BookingActions";
// import ChatMessages from "./ChatMessages";
// import ChatInput from "./ChatInput";

// export default function TutorChat() {
//   const {
//     bookingsByFilter,
//     selectedBooking,
//     messages,
//     isLoading,
//     isSending,
//     fetchBookings,
//     fetchBooking,
//     fetchMessages,
//     sendMessage,
//     confirmMessage,
//     rejectMessage,
//     confirmBooking,
//     acceptReschedule,
//     rejectReschedule,
//     setActiveFilter,
//     getCurrentBookings,
//     socketConnected,
//   } = useTutorChatStore();

//   const [activeFilter, setLocalActiveFilter] = useState("all");
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [showReconnectOverlay, setShowReconnectOverlay] = useState(false);
//   const [reconnectAttempts, setReconnectAttempts] = useState(0);

//   // ─── Socket: Auto-join room when booking selected ───────────────────────────────
//   useEffect(() => {
//     if (!selectedBookingId) return;

//     const socket = getSocket();
//     if (!socket) return;

//     console.log("[TutorChat] → Joining room:", selectedBookingId);

//     socket.emit("join:booking", selectedBookingId, (response) => {
//       if (response?.success) {
//         console.log("%c[TutorChat] ✓ Joined room OK", "background:#4CAF50;color:white;padding:6px;");
//         useTutorChatStore.getState().markMessagesAsRead(selectedBookingId);
//       } else {
//         console.error("[TutorChat] ✗ Join failed:", response);
//       }
//     });

//     return () => {
//       console.log("[TutorChat] ← Leaving room:", selectedBookingId);
//       socket.emit("leaveBooking", selectedBookingId);
//     };
//   }, [selectedBookingId]);

//   // ─── Connection indicators ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (socketConnected) {
//       setShowToast(true);
//       const timer = setTimeout(() => setShowToast(false), 4200);
//       return () => clearTimeout(timer);
//     }
//   }, [socketConnected]);

//   useEffect(() => {
//     let timeout;
//     if (!socketConnected) {
//       timeout = setTimeout(() => setShowReconnectOverlay(true), 3000);
//       setReconnectAttempts((prev) => prev + 1);
//     } else {
//       setShowReconnectOverlay(false);
//       setReconnectAttempts(0);
//     }
//     return () => clearTimeout(timeout);
//   }, [socketConnected]);

//   // ─── Load filters on mount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const filters = ["all", "active", "pending", "rescheduled", "completed", "cancelled"];
//     console.log("🚀 Loading all filters on mount...");
//     Promise.all(filters.map((f) => fetchBookings(f, false))).then(() => {
//       console.log("✅ All filters loaded!");
//     });
//   }, [fetchBookings]);

//   // ─── Load selected booking + messages ───────────────────────────────────────────
//   useEffect(() => {
//     if (!selectedBookingId) return;

//     console.log("Loading booking + messages:", selectedBookingId);
//     fetchBooking(selectedBookingId);
//     fetchMessages(selectedBookingId);
//   }, [selectedBookingId, fetchBooking, fetchMessages]);

//   // ─── Handlers ───────────────────────────────────────────────────────────────────
//   const handleSelectBooking = (bookingId) => {
//     console.log("Selected booking:", bookingId);
//     setSelectedBookingId(bookingId);
//     setMobileSheetOpen(false);
//   };

//   const handleAcceptBooking = async () => {
//     if (!selectedBooking?.id) return;
//     try {
//       await confirmBooking(selectedBooking.id);
//     } catch (err) {
//       alert("Failed to accept booking: " + (err.message || "Unknown error"));
//     }
//   };

//   const handleSend = async (content) => {
//     if (!selectedBookingId || !content.trim()) return;
//     if (["cancelled", "completed"].includes(selectedBooking?.status?.toLowerCase())) {
//       alert(`Cannot send messages — booking is ${selectedBooking.status}`);
//       return;
//     }
//     try {
//       await sendMessage(selectedBookingId, content);
//       // await fetchMessages(selectedBookingId);
//     } catch (err) {
//       console.error("Send failed:", err);
//       alert("Failed to send message");
//     }
//   };

//   // ─── UI Helpers ─────────────────────────────────────────────────────────────────
//   const currentBookings = getCurrentBookings();

//   const unreadCounts = {
//     all: bookingsByFilter.all?.length || 0,
//     active: bookingsByFilter.active?.length || 0,
//     pending: bookingsByFilter.pending?.length || 0,
//     rescheduled: bookingsByFilter.rescheduled?.length || 0,
//     completed: bookingsByFilter.completed?.length || 0,
//     cancelled: bookingsByFilter.cancelled?.length || 0,
//   };

//   const getBadgeColor = (filter) => {
//     if (filter === "pending") return "bg-yellow-500";
//     if (filter === "rescheduled") return "bg-orange-500";
//     return "bg-green-500";
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────────────
//   return (
//     <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-2 overflow-hidden">
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden fixed bottom-4 right-4 z-50">
//         <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
//           <SheetTrigger asChild>
//             <Button size="lg" className="rounded-full shadow-lg h-14 w-14">
//               <Menu className="size-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-[85vw] sm:w-96 p-0">
//             <SheetHeader className="p-4 border-b">
//               <SheetTitle>Bookings</SheetTitle>
//             </SheetHeader>

//             {/* Filters */}
//             <div className="p-4 border-b">
//               <div className="grid grid-cols-3 gap-2">
//                 {["all", "active", "pending", "rescheduled", "completed", "cancelled"].map((f) => (
//                   <button
//                     key={f}
//                     onClick={() => {
//                       setLocalActiveFilter(f);
//                       setActiveFilter(f);
//                       setMobileSheetOpen(false);
//                     }}
//                     className={cn(
//                       "px-3 py-2 rounded text-sm font-medium",
//                       activeFilter === f ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
//                     )}
//                   >
//                     {f.charAt(0).toUpperCase() + f.slice(1)}
//                     {unreadCounts[f] > 0 && (
//                       <Badge className="ml-1.5 bg-white text-primary">{unreadCounts[f]}</Badge>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Bookings list */}
//             <div className="flex-1 overflow-y-auto p-2">
//               {currentBookings.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-6">
//                   <MessageSquare className="size-12 text-muted-foreground mb-3" />
//                   <p className="text-muted-foreground">No bookings in this filter</p>
//                 </div>
//               ) : (
//                 currentBookings.map((b) => (
//                   <div
//                     key={b.id}
//                     onClick={() => handleSelectBooking(b.id)}
//                     className={cn(
//                       "p-3 rounded-lg mb-2 cursor-pointer transition",
//                       selectedBookingId === b.id ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted"
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="size-10 rounded-full bg-primary/10 flex-center">
//                         {b.avatar ? (
//                           <img src={b.avatar} alt="" className="size-full rounded-full object-cover" />
//                         ) : (
//                           <User className="size-5 text-primary" />
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium truncate">{b.participant_name}</p>
//                         <p className="text-xs text-muted-foreground truncate">
//                           {b.purpose || "No messages yet"}
//                         </p>
//                         <p className="text-xs">{format(parseISO(b.scheduledAt), "PPP p")}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Desktop Sidebar */}
//       <Card className="hidden lg:flex w-80 xl:w-96 flex-col border-r">
//         <div className="p-2 border-b">
//           <h2 className="text-lg font-semibold">Bookings</h2>
//         </div>

//         {/* Filters */}
//         <div className="py-4 border-b">
//           <div className="grid grid-cols-3 gap-2">
//             {["all", "active", "pending", "resched..", "completed", "cancelled"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => {
//                   setLocalActiveFilter(f);
//                   setActiveFilter(f);
//                 }}
//                 className={cn(
//                   "px-3 py-2 rounded text-sm font-medium text-center",
//                   activeFilter === f ? "bg-primary text-white shadow-sm" : "bg-muted hover:bg-muted/80"
//                 )}
//               >
//                 {f.charAt(0).toUpperCase() + f.slice(1)}
//                 {unreadCounts[f] > 0 && (
//                   <Badge className="ml-1.5 bg-white text-primary text-xs">{unreadCounts[f]}</Badge>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Bookings */}
//         <div className="flex-1 overflow-y-auto p-2">
//           {currentBookings.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center p-6">
//               <MessageSquare className="size-12 text-muted-foreground mb-3" />
//               <p className="text-muted-foreground">No bookings found</p>
//             </div>
//           ) : (
//             currentBookings.map((b) => (
//               <div
//                 key={b.id}
//                 onClick={() => handleSelectBooking(b.id)}
//                 className={cn(
//                   "p-3 rounded-lg mb-1 cursor-pointer transition",
//                   selectedBookingId === b.id ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted"
//                 )}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="size-10 rounded-full bg-primary/10 flex-center">
//                     {b.avatar ? (
//                       <img src={b.avatar} alt="" className="size-full rounded-full object-cover" />
//                     ) : (
//                       <User className="size-5 text-primary" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium truncate">{b.participant_name}</p>
//                     <p className="text-xs text-muted-foreground truncate">
//                       {b.purpose || "No messages yet"}
//                     </p>
//                      <p className="text-xs">{format(parseISO(b.scheduledAt), "PPP p")}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </Card>

//       {/* Main Chat Area */}
//       <Card className="flex-1 flex flex-col overflow-hidden">
//         {selectedBooking ? (
//           <>
//             {/* Header */}
//             <div className="p-4 border-b">
//               <div className="flex items-center justify-between gap-4 flex-wrap">
//                 <div className="flex items-center gap-3 min-w-0">
//                   <div className="size-12 rounded-full bg-primary/10 flex-center flex-shrink-0">
//                     {selectedBooking.avatar ? (
//                       <img
//                         src={selectedBooking.avatar}
//                         alt=""
//                         className="size-full rounded-full object-cover"
//                       />
//                     ) : (
//                       <User className="size-6 text-primary" />
//                     )}
//                   </div>
//                   <div className="min-w-0">
//                     <h2 className="font-semibold truncate">{selectedBooking.participant_name}</h2>
//                     <p className="text-sm text-muted-foreground capitalize">
//                       {selectedBooking.status?.replace("-", " ") || "Unknown"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 flex-wrap">
//                   {/* Accept Booking Button – visible only for pending */}
//                   {selectedBooking?.status?.toLowerCase() === "pending" && (
//                     <Button
//                       onClick={handleAcceptBooking}
//                       disabled={isSending}
//                       className="bg-green-600 hover:bg-green-700 text-white"
//                     >
//                       Accept Booking
//                     </Button>
//                   )}

//                   <BookingActions booking={selectedBooking} />
//                 </div>
//               </div>

//               {selectedBooking.purpose && (
//                 <>
//                   <Separator className="my-3" />
//                   <div className="space-y-2 text-sm">
//                     <p><strong>Purpose:</strong> {selectedBooking.purpose}</p>
//                     {selectedBooking.scheduledAt && (
//                       <p><strong>Scheduled:</strong> {format(parseISO(selectedBooking.scheduledAt), "PPP p")}</p>
//                     )}
//                     {selectedBooking.proposedAt && selectedBooking.status?.toLowerCase() === "reschedule_proposed" && (
//                       <p className="text-purple-700">
//                         <strong>Proposed Time:</strong> {format(parseISO(selectedBooking.proposedAt), "PPP p")}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto">
//               <ChatMessages
//                 messages={messages}
//                 isLoading={isLoading}
//                 bookingStatus={selectedBooking.status}
//                 proposedAt={selectedBooking.proposedAt}
//                 onConfirmMessage={confirmMessage}
//                 onRejectMessage={rejectMessage}
//                 onAcceptReschedule={acceptReschedule}
//                 onRejectReschedule={rejectReschedule}
//               />
//             </div>

//             {/* Input */}
//             <ChatInput
//               onSend={handleSend}
//               isSending={isSending}
//               disabled={["cancelled", "completed"].includes(selectedBooking?.status?.toLowerCase())}
//               selectedBookingId={selectedBookingId}
//             />
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
//             <MessageSquare className="size-16 text-muted-foreground/40 mb-4" />
//             <h3 className="text-xl font-medium mb-2">No booking selected</h3>
//             <p className="text-muted-foreground">
//               Choose a booking from the list to start chatting
//             </p>
//           </div>
//         )}
//       </Card>

//       {/* Connection Indicators */}
//       {showToast && socketConnected && (
//         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-out">
//           Chat connected ✓
//         </div>
//       )}

//       {showReconnectOverlay && !socketConnected && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-900 p-8 rounded-xl text-center max-w-md mx-4">
//             <Loader2 className="size-12 animate-spin mx-auto mb-4 text-primary" />
//             <h3 className="text-xl font-semibold mb-2">Reconnecting...</h3>
//             <p className="text-muted-foreground">Please wait a moment</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









import { useEffect, useState } from "react";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MessageSquare,
  User,
  Loader2,
  Menu,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import BookingActions from "./BookingActions";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const FILTERS = ["all", "active", "pending", "resched..", "completed", "cancelled"];

export default function TutorChat() {
  const {
    bookingsByFilter,
    selectedBooking,
    messages,
    isLoadingMessages,
    isSending,
    fetchBookings,
    setSelectedBooking,
    sendMessage,
    confirmMessage,
    rejectMessage,
    confirmBooking,
    acceptReschedule,
    rejectReschedule,
    setActiveFilter,
    getCurrentBookings,
    socketConnected,
  } = useTutorChatStore();

  const [activeFilter, setLocalActiveFilter] = useState("all");
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showReconnectOverlay, setShowReconnectOverlay] = useState(false);

  // ─── Load all filters on mount ──────────────────────────────────
  useEffect(() => {
    console.log("🚀 Loading all filters on mount...");
    Promise.all(FILTERS.map((f) => fetchBookings(f, false)))
      .then(() => console.log("✅ All filters loaded!"))
      .catch((err) => console.error("❌ Failed to load filters:", err));
  }, [fetchBookings]);

  // ─── Connection toast ───────────────────────────────────────────
  useEffect(() => {
    if (socketConnected) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [socketConnected]);

  // ─── Reconnect overlay ──────────────────────────────────────────
  useEffect(() => {
    let timeout;
    if (!socketConnected) {
      timeout = setTimeout(() => setShowReconnectOverlay(true), 3000);
    } else {
      setShowReconnectOverlay(false);
    }
    return () => clearTimeout(timeout);
  }, [socketConnected]);

  // ─── Handlers ───────────────────────────────────────────────────
  const handleFilterChange = (filter) => {
    setLocalActiveFilter(filter);
    setActiveFilter(filter);
    setMobileSheetOpen(false);
  };

  const handleSelectBooking = (booking) => {
    console.log("📍 Selected booking:", booking.id);
    setSelectedBooking(booking); 
    setMobileSheetOpen(false);
  };

  const handleAcceptBooking = async () => {
  if (!selectedBooking?.id) return;

  try {
    await confirmBooking(selectedBooking.id);

    toast({
      description: "Booking accepted successfully",
    });

  } catch (err) {
    console.error("Failed to accept booking:", err);

    toast({
      description: "Failed to accept booking: " + (err.message || "Unknown error"),
      variant: "destructive", 
    });
  }
};

const handleSendMessage = async (content) => {
  if (!selectedBooking?.id || !content.trim()) return;

  const status = selectedBooking.status?.toLowerCase();

  if (["cancelled", "completed"].includes(status)) {
    toast({
      description: `Cannot send messages — booking is ${selectedBooking.status}`,
    });
    return;
  }

  try {
    await sendMessage(selectedBooking.id, content);

    toast({
      description: "Message sent successfully",
    });

  } catch (err) {
    console.error("Send message failed:", err);

    toast({
      description: "Failed to send message. Please try again.",
      variant: "destructive",
    });
  }
};




  // const handleAcceptBooking = async () => {
  //   if (!selectedBooking?.id) return;
  //   try {
  //     await confirmBooking(selectedBooking.id);
  //   } catch (err) {
  //     console.error("Failed to accept booking:", err);
  //     alert("Failed to accept booking: " + (err.message || "Unknown error"));
  //   }
  // };

  // const handleSendMessage = async (content) => {
  //   if (!selectedBooking?.id || !content.trim()) return;
    
  //   const status = selectedBooking.status?.toLowerCase();
  //   if (["cancelled", "completed"].includes(status)) {
  //     alert(`Cannot send messages — booking is ${selectedBooking.status}`);
  //     return;
  //   }
    
  //   try {
  //     await sendMessage(selectedBooking.id, content);
  //   } catch (err) {
  //     console.error("Send message failed:", err);
  //     alert("Failed to send message. Please try again.");
  //   }
  // };

  // ─── Computed values ────────────────────────────────────────────
  const currentBookings = getCurrentBookings();

  const unreadCounts = FILTERS.reduce((acc, filter) => {
    acc[filter] = bookingsByFilter[filter]?.length || 0;
    return acc;
  }, {});

  // ─── Render helpers ─────────────────────────────────────────────
  const renderBookingCard = (booking, onClick) => (
    <div
      key={booking.id}
      onClick={() => onClick(booking)}
      className={cn(
        "p-3 rounded-lg mb-1 cursor-pointer transition-all",
        selectedBooking?.id === booking.id
          ? "bg-primary/10 border-l-4 border-primary shadow-sm"
          : "hover:bg-muted hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {booking.avatar ? (
            <img
              src={booking.avatar}
              alt={booking.participant_name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            <User className="size-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{booking.participant_name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {booking.purpose || "No description"}
          </p>
          {booking.scheduledAt && (
            <p className="text-xs text-muted-foreground">
              {format(parseISO(booking.scheduledAt), "PPP p")}
              <span> {booking.duration}mins</span>
            </p>
            
          )}
        </div>
        {booking.unread_count > 0 && (
          <Badge variant="destructive" className="text-xs">
            {booking.unread_count}
          </Badge>
        )}
      </div>
    </div>
  );

  const renderFilterButton = (filter, isMobile = false) => {
    const label = isMobile && filter === "rescheduled" 
      ? "Resched." 
      : filter.charAt(0).toUpperCase() + filter.slice(1);

    return (
      <button
        key={filter}
        onClick={() => handleFilterChange(filter)}
        className={cn(
          "px-3 py-2 rounded text-sm font-medium transition-all",
          activeFilter === filter
            ? "bg-primary text-white shadow-sm"
            : "bg-muted hover:bg-muted/80"
        )}
      >
        {label}
        {unreadCounts[filter] > 0 && (
          <Badge className="ml-1.5 bg-white text-primary text-xs">
            {unreadCounts[filter]}
          </Badge>
        )}
      </button>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <MessageSquare className="size-12 text-muted-foreground/50 mb-3" />
      <p className="text-muted-foreground">No bookings in this filter</p>
    </div>
  );

  // ─── Main Render ────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-2 overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Mobile Menu */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg h-14 w-14">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          
          <SheetContent side="left" className="w-[85vw] sm:w-96 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Bookings</SheetTitle>
            </SheetHeader>

            {/* Filters */}
            <div className="py-4 border-b">
              <div className="grid grid-cols-3 gap-2">
                {FILTERS.map((f) => renderFilterButton(f, true))}
              </div>
            </div>

            {/* Bookings List */}
            <div className="flex-1 overflow-y-auto p-2">
              {currentBookings.length === 0
                ? renderEmptyState()
                : currentBookings.map((b) => renderBookingCard(b, handleSelectBooking))
              }
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Desktop Sidebar */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Card className="hidden lg:flex w-80 xl:w-96 flex-col border-r shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Bookings</h2>
        </div>

        {/* Filters */}
        <div className="py-4 border-b">
          <div className="grid grid-cols-3 gap-2 ">
            {FILTERS.map((f) => renderFilterButton(f))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto ">
          {currentBookings.length === 0
            ? renderEmptyState()
            : currentBookings.map((b) => renderBookingCard(b, handleSelectBooking))
          }
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Main Chat Area */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm">
    {selectedBooking && (
  <div className="p-4 border-b bg-white/50 backdrop-blur-sm">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {selectedBooking.avatar ? (
            <img
              src={selectedBooking.avatar}
              alt={selectedBooking.participant_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-primary" />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold truncate">{selectedBooking.participant_name}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {selectedBooking.status?.replace("-", " ") || "Unknown"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {selectedBooking.status?.toLowerCase() === "pending" && (
          <Button
            onClick={handleAcceptBooking}
            disabled={isSending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Accept Booking
          </Button>
        )}
        <BookingActions booking={selectedBooking} />
      </div>
    </div>

    {selectedBooking.purpose && (
      <>
        <Separator className="my-3" />
        <div className="space-y-2 text-sm">
          <p>
            <strong>Purpose:</strong> {selectedBooking.purpose}
          </p>
          {selectedBooking.scheduledAt && (
            <p>
              <strong>Scheduled:</strong>{" "}
              {format(parseISO(selectedBooking.scheduledAt), "PPP p")}
            </p>
          )}
          {selectedBooking.proposedAt &&
            (selectedBooking.status || "").toLowerCase().replace("-", "_") ===
              "reschedule_proposed" && (
              <p className="text-orange-600">
                <strong>Proposed Time:</strong>{" "}
                {format(parseISO(selectedBooking.proposedAt), "PPP p")}
              </p>
            )}
        </div>
      </>
    )}
  </div>
)}

      </Card>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Connection Indicators */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      {/* Connected Toast */}
      {showToast && socketConnected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-white animate-pulse" />
            Chat connected
          </div>
        </div>
      )}

      {/* Reconnecting Overlay */}
      {showReconnectOverlay && !socketConnected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl text-center max-w-md mx-4 shadow-2xl">
            <Loader2 className="size-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Reconnecting...</h3>
            <p className="text-muted-foreground">
              Connection lost. Attempting to reconnect...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}