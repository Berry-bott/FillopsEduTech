// import { useEffect, useState } from "react";
// import { useTutorChatStore } from "@/store/tutorChatStore";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
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
// } from "lucide-react";
// import { format, parseISO } from "date-fns";
// import BookingActions from "./BookingActions";
// import ChatMessages from "./ChatMessages";
// import ChatInput from "./ChatInput";

// export default function TutorChat() {
//   const {
//     bookings,
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
//   } = useTutorChatStore();

//   const [activeFilter, setActiveFilter] = useState("all");
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [isAccepting, setIsAccepting] = useState(false);

//   // Calculate unread counts per filter category
//   const getUnreadByFilter = () => {
//     const counts = {
//       all: 0,
//       pending: 0,
//       confirmed: 0,
//       completed: 0,
//       cancelled: 0,
//     };

//     bookings.forEach((booking) => {
//       const unread = Number(booking.unread_count ?? 0);
//       if (unread > 0) {
//         counts.all += unread;
//         const status = (booking.status || "pending").toLowerCase();
//         if (status in counts) {
//           counts[status] += unread;
//         }
//       }
//     });

//     return counts;
//   };

//   const unreadCounts = getUnreadByFilter();

//   // Fetch bookings on mount
//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   // Fetch bookings when filter changes
//   useEffect(() => {
//     if (activeFilter === "all") {
//       fetchBookings();
//     } else {
//       fetchBookings(activeFilter);
//     }
//   }, [activeFilter, fetchBookings]);

//   // Fetch messages + booking details when selection changes
//   useEffect(() => {
//     if (selectedBookingId) {
//       fetchBooking(selectedBookingId);
//       fetchMessages(selectedBookingId);
//     }
//   }, [selectedBookingId, fetchBooking, fetchMessages]);

//   // ── Handlers ─────────────────────────────────────────────────────

//   const handleSelectBooking = (bookingId) => {
//     const localBooking = bookings.find((b) => b.id === bookingId);
//     if (localBooking) {
//       useTutorChatStore.setState({ selectedBooking: localBooking });
//     }
//     setSelectedBookingId(bookingId);
//   };

//   const handleAcceptBooking = async () => {
//     if (!selectedBooking) return;

//     setIsAccepting(true);
//     try {
//       await confirmBooking(selectedBooking.id);

//       // After successful confirmation:
//       // 1. Switch to "confirmed" tab so the new booking is visible
//       setActiveFilter("confirmed");
//       // 2. Immediately refresh the confirmed list
//       fetchBookings("confirmed");
//     } catch (err) {
//       alert("Failed to accept booking: " + (err.message || "Unknown error"));
//     } finally {
//       setIsAccepting(false);
//     }
//   };

//   const handleSendMessage = async (content, messageType = "TEXT") => {
//     if (!selectedBookingId || !content.trim()) return;

//     if (selectedBooking?.status === "cancelled") {
//       alert("Cannot send messages to cancelled bookings.");
//       return;
//     }

//     try {
//       await sendMessage(selectedBookingId, content, messageType);
//       // Optional: refresh bookings to update last_message / unread_count
//       // fetchBookings(activeFilter === "all" ? null : activeFilter);
//     } catch (err) {
//       alert("Failed to send message: " + (err.message || "Unknown error"));
//     }
//   };

//   const handleConfirmMessage = async (messageId) => {
//     try {
//       await confirmMessage(messageId);
//     } catch (err) {
//       console.error("Failed to confirm message:", err);
//     }
//   };

//   const handleRejectMessage = async (messageId) => {
//     try {
//       await rejectMessage(messageId);
//     } catch (err) {
//       console.error("Failed to reject message:", err);
//     }
//   };

//   // ── Status helpers ───────────────────────────────────────────────

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-500",
//       confirmed: "bg-green-500",
//       completed: "bg-blue-500",
//       cancelled: "bg-red-500",
//       rescheduled: "bg-purple-500",
//     };
//     return colors[status?.toLowerCase()] || "bg-gray-500";
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       pending: Clock,
//       confirmed: CheckCircle,
//       completed: CheckCircle,
//       cancelled: XCircle,
//       rescheduled: RotateCw,
//     };
//     const Icon = icons[status?.toLowerCase()] || AlertCircle;
//     return <Icon className="size-4" />;
//   };

//   // ── Render ───────────────────────────────────────────────────────

//   return (
//     <div className="h-[calc(100vh-8rem)] flex gap-4">
//       {/* LEFT SIDEBAR - Bookings List */}
//       <Card className="flex flex-col min-w-80">
//         <div className="p-4 border-b">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Bookings</h2>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 if (activeFilter === "all") {
//                   fetchBookings();
//                 } else {
//                   fetchBookings(activeFilter);
//                 }
//               }}
//               className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
//             >
//               Refresh
//             </Button>
//           </div>

//           {/* Filter Tabs with unread badges */}
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             {["all", "pending", "confirmed", "completed", "cancelled"].map((filter) => {
//               const count = unreadCounts[filter];
//               const isActive = activeFilter === filter;
//               const hasUnread = count > 0;

//               return (
//                 <button
//                   key={filter}
//                   onClick={() => setActiveFilter(filter)}
//                   className={`relative px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
//                     isActive
//                       ? "bg-primary text-white shadow-sm"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {filter.charAt(0).toUpperCase() + filter.slice(1)}

//                   {hasUnread && (
//                     <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1 shadow">
//                       {count > 99 ? "99+" : count}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bookings List */}
//         <div className="flex-1 overflow-y-auto">
//           {isLoading && bookings.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full p-4">
//               <Loader2 className="size-8 animate-spin text-muted-foreground mb-2" />
//               <p className="text-sm text-muted-foreground">Loading bookings...</p>
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full p-4">
//               <MessageSquare className="size-12 text-muted-foreground/30 mb-2" />
//               <p className="text-sm text-muted-foreground">No bookings found</p>
//             </div>
//           ) : (
//             bookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 onClick={() => handleSelectBooking(booking.id)}
//                 className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
//                   selectedBookingId === booking.id
//                     ? "bg-blue-50 border-l-4 border-l-primary"
//                     : ""
//                 }`}
//               >
//                 <div className="flex items-start gap-3 mb-2">
//                   <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
//                     {booking.avatar ? (
//                       <img
//                         src={booking.avatar}
//                         alt={booking.participant_name}
//                         className="size-10 rounded-full object-cover"
//                       />
//                     ) : (
//                       <User className="size-5 text-primary" />
//                     )}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-1">
//                       <h3 className="font-medium text-sm truncate">
//                         {booking.participant_name}
//                       </h3>
//                       {booking.unread_count > 0 && (
//                         <Badge variant="destructive" className="text-xs px-1.5 min-w-[20px]">
//                           {booking.unread_count > 99 ? "99+" : booking.unread_count}
//                         </Badge>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-1.5 mb-1">
//                       <div className={`size-2.5 rounded-full ${getStatusColor(booking.status)}`} />
//                       <span className="text-xs text-muted-foreground capitalize">
//                         {booking.status}
//                       </span>
//                     </div>

//                     {booking.last_message && (
//                       <p className="text-xs text-muted-foreground truncate">
//                         {booking.last_message}
//                       </p>
//                     )}

//                     {booking.scheduledAt && (
//                       <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
//                         <Calendar className="size-3" />
//                         {format(parseISO(booking.scheduledAt), "MMM dd, yyyy")}
//                         <Clock className="size-3 ml-1" />
//                         {format(parseISO(booking.scheduledAt), "HH:mm")}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </Card>

//       {/* RIGHT SIDE - Chat Area */}
//       <Card className="flex-1 flex flex-col">
//         {selectedBooking ? (
//           <>
//             <div className="p-4 border-b">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
//                     {selectedBooking.avatar ? (
//                       <img
//                         src={selectedBooking.avatar}
//                         alt={selectedBooking.participant_name}
//                         className="size-12 rounded-full object-cover"
//                       />
//                     ) : (
//                       <User className="size-6 text-primary" />
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-lg">
//                       {selectedBooking.participant_name}
//                     </h2>
//                     <div className="flex items-center gap-2 mt-0.5">
//                       {getStatusIcon(selectedBooking.status)}
//                       <span className="text-sm text-muted-foreground capitalize">
//                         {selectedBooking.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {selectedBooking.status === "pending" && (
//                     <Button
//                       onClick={handleAcceptBooking}
//                       disabled={isAccepting}
//                       className="bg-green-600 hover:bg-green-700 text-white h-9 px-4"
//                     >
//                       {isAccepting ? (
//                         <>
//                           <Loader2 className="size-4 mr-2 animate-spin" />
//                           Accepting...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle className="size-4 mr-2" />
//                           Accept Booking
//                         </>
//                       )}
//                     </Button>
//                   )}

//                   <BookingActions booking={selectedBooking} />
//                 </div>
//               </div>

//               {selectedBooking.purpose && (
//                 <>
//                   <Separator className="my-3" />
//                   <div className="space-y-2 text-sm">
//                     <p>
//                       <strong>Purpose:</strong> {selectedBooking.purpose}
//                     </p>
//                     {selectedBooking.scheduledAt && (
//                       <p>
//                         <strong>Scheduled:</strong>{" "}
//                         {format(parseISO(selectedBooking.scheduledAt), "PPpp")}
//                       </p>
//                     )}
//                     {selectedBooking.duration && (
//                       <p>
//                         <strong>Duration:</strong> {selectedBooking.duration} minutes
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             <ChatMessages
//               messages={messages}
//               isLoading={isLoading}
//               bookingStatus={selectedBooking.status}
//               onConfirmMessage={handleConfirmMessage}
//               onRejectMessage={handleRejectMessage}
//             />

//             <ChatInput
//               onSend={handleSendMessage}
//               isSending={isSending}
//               disabled={selectedBooking.status === "cancelled" || selectedBooking.status === "completed"}
//             />
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center">
//               <MessageSquare className="size-16 text-muted-foreground/30 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-muted-foreground mb-2">
//                 No Booking Selected
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 Select a booking from the list to start chatting
//               </p>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RotateCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import BookingActions from "./BookingActions";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function TutorChat() {
  const {
    bookings,
    selectedBooking,
    messages,
    isLoading,
    isSending,
    fetchBookings,
    fetchBooking,
    fetchMessages,
    sendMessage,
    confirmMessage,
    rejectMessage,
    confirmBooking,
  } = useTutorChatStore();

  const [activeFilter, setActiveFilter] = useState("confirmed"); // default to confirmed (most active chats)
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  // Calculate unread counts per filter
  const getUnreadByFilter = () => {
    const counts = {
      all: 0,
      pending: 0,
      confirmed: 0,
      Active: 0,
      completed: 0,
      cancelled: 0,
    };

    bookings.forEach((booking) => {
      const unread = Number(booking.unread_count ?? 0);
      if (unread > 0) {
        counts.all += unread;
        const status = (booking.status || "pending").toLowerCase();
        if (status in counts) {
          counts[status] += unread;
        }
      }
    });

    return counts;
  };

  const unreadCounts = getUnreadByFilter();

  // Fetch bookings on mount + default to confirmed
  useEffect(() => {
    fetchBookings("confirmed"); // start with confirmed (active chats)
  }, [fetchBookings]);

  // Refresh when filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      fetchBookings();
    } else {
      fetchBookings(activeFilter);
    }
  }, [activeFilter, fetchBookings]);

  // Load messages when a booking is selected
  useEffect(() => {
    if (selectedBookingId) {
      fetchBooking(selectedBookingId);
      fetchMessages(selectedBookingId);
    }
  }, [selectedBookingId, fetchBooking, fetchMessages]);

  // ── Handlers ─────────────────────────────────────────────────────

  const handleSelectBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      useTutorChatStore.setState({ selectedBooking: booking });
    }
  };

  const handleAcceptBooking = async () => {
    if (!selectedBooking) return;

    setIsAccepting(true);
    try {
      await confirmBooking(selectedBooking.id);
      // After accept → go to confirmed tab + refresh
      setActiveFilter("confirmed");
      fetchBookings("confirmed");
    } catch (err) {
      alert("Failed to accept: " + (err.message || "Unknown error"));
    } finally {
      setIsAccepting(false);
    }
  };

  const handleSendMessage = async (content, messageType = "TEXT") => {
    if (!selectedBookingId || !content.trim()) return;

    if (selectedBooking?.status === "cancelled") {
      alert("Cannot send messages to cancelled bookings.");
      return;
    }

    try {
      await sendMessage(selectedBookingId, content, messageType);
      
      // IMPORTANT: refresh bookings after sending → updates last_message & unread
      if (activeFilter === "all") {
        fetchBookings();
      } else {
        fetchBookings(activeFilter);
      }
      
      // Also refresh messages to show your own message immediately
      fetchMessages(selectedBookingId);
    } catch (err) {
      alert("Failed to send message: " + (err.message || "Unknown error"));
    }
  };

  const handleConfirmMessage = async (messageId) => {
    try {
      await confirmMessage(messageId);
    } catch (err) {
      console.error("Failed to confirm message:", err);
    }
  };

  const handleRejectMessage = async (messageId) => {
    try {
      await rejectMessage(messageId);
    } catch (err) {
      console.error("Failed to reject message:", err);
    }
  };

  // Status helpers (unchanged)
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      Active: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
      rescheduled: "bg-purple-500",
    };
    return colors[status?.toLowerCase()] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      Active: CheckCircle,
      completed: CheckCircle,
      cancelled: XCircle,
      rescheduled: RotateCw,
    };
    const Icon = icons[status?.toLowerCase()] || AlertCircle;
    return <Icon className="size-4" />;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar */}
      <Card className="flex flex-col min-w-80">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Bookings</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchBookings(activeFilter === "all" ? null : activeFilter)}
              className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            >
              Refresh
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "pending", "confirmed", "completed", "cancelled", "Active"].map((filter) => {
              const count = unreadCounts[filter];
              const isActive = activeFilter === filter;
              const hasUnread = count > 0;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {hasUnread && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1 shadow">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <Loader2 className="size-8 animate-spin text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <MessageSquare className="size-12 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No bookings found</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => handleSelectBooking(booking.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  selectedBookingId === booking.id
                    ? "bg-blue-50 border-l-4 border-l-primary"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {booking.avatar ? (
                      <img
                        src={booking.avatar}
                        alt={booking.participant_name}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="size-5 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {booking.participant_name}
                      </h3>
                      {booking.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 min-w-[20px]">
                          {booking.unread_count > 99 ? "99+" : booking.unread_count}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`size-2.5 rounded-full ${getStatusColor(booking.status)}`} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {booking.status}
                      </span>
                    </div>

                    {booking.last_message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.last_message}
                      </p>
                    )}

                    {booking.scheduledAt && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {format(parseISO(booking.scheduledAt), "MMM dd, yyyy")}
                        <Clock className="size-3 ml-1" />
                        {format(parseISO(booking.scheduledAt), "HH:mm")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedBooking ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedBooking.avatar ? (
                      <img
                        src={selectedBooking.avatar}
                        alt={selectedBooking.participant_name}
                        className="size-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="size-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      {selectedBooking.participant_name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      {getStatusIcon(selectedBooking.status)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedBooking.status === "pending" && (
                    <Button
                      onClick={handleAcceptBooking}
                      disabled={isAccepting}
                      className="bg-green-600 hover:bg-green-700 text-white h-9 px-4"
                    >
                      {isAccepting ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="size-4 mr-2" />
                          Accept Booking
                        </>
                      )}
                    </Button>
                  )}
                  <BookingActions booking={selectedBooking} />
                </div>
              </div>

              {selectedBooking.purpose && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <p><strong>Purpose:</strong> {selectedBooking.purpose}</p>
                    {selectedBooking.scheduledAt && (
                      <p><strong>Scheduled:</strong> {format(parseISO(selectedBooking.scheduledAt), "PPpp")}</p>
                    )}
                    {selectedBooking.duration && (
                      <p><strong>Duration:</strong> {selectedBooking.duration} minutes</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              bookingStatus={selectedBooking.status}
              onConfirmMessage={handleConfirmMessage}
              onRejectMessage={handleRejectMessage}
            />

            <ChatInput
              onSend={handleSendMessage}
              isSending={isSending}
              disabled={selectedBooking.status === "cancelled" || selectedBooking.status === "completed"}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="size-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Booking Selected
              </h3>
              <p className="text-sm text-muted-foreground">
                Select a booking from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}