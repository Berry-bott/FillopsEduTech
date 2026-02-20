
// // src/components/user/chat/ChatInterface.jsx
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { Send, Loader2, Search, Menu, X, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import { useToast } from "@/components/ui/use-toast"; 
// import { cn } from "@/lib/utils";

// import EnhancedChatHeader from "./chat-header";
// import ChatMessage from "./chat-message";
// import EnhancedConversationList from "./conversation-list";
// import BookingModal from "./booking-modal";
// import RatingModal from "./rating-modal";
// import BookingDetailsModal from "./booking-details-modal";
// import RescheduleModal from "./reschedule-modal";
// import { useUserChatStore } from "@/store/userChatStore";
// import useAuthStore from "@/store/authStore";

// export default function ChatInterface() {
//   const scrollRef      = useRef(null);
//   const messagesEndRef = useRef(null);
//   const { toast } = useToast();

//   const {
//     messages,
//     bookings,
//     tutors,
//     selectedBooking,
//     isLoading,
//     isSending,
//     fetchBookings,
//     fetchTutors,
//     sendMessage,
//     cancelBooking,
//     setSelectedBooking,
//     sendTyping,
//     socketConnected,
//     hasFetchedAllBookings,
//     hasFetchedTutors,
//     // initializeSocket,
//     // disconnectSocket,
//     // initializeListeners,
//   } = useUserChatStore();

//   // ── Connect the USER chat socket on mount ─────────────────────────
//   // This is a separate socket from the community socket, so we manage
//   // it directly here rather than via the shared useSocket hook.
//   // useEffect(() => {
//   //   initializeSocket(); // connects userChatSocket and sets socketConnected
//   //   return () => disconnectSocket();
//   // }, []);

//   // ── Local UI state ─────────────────────────────────────────────────
//   const [inputValue, setInputValue]               = useState("");
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [isRatingModalOpen, setIsRatingModalOpen]   = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
//   const [tutorToBook, setTutorToBook]             = useState(null);
//   const [bookingToRate, setBookingToRate]         = useState(null);
//   const [bookingToView, setBookingToView]         = useState(null);
//   const [bookingToReschedule, setBookingToReschedule] = useState(null);
//   const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
//   const [newMessagesCount, setNewMessagesCount]   = useState(0);
//   const [cancelModalOpen, setCancelModalOpen]     = useState(false);
//   const [cancelReason, setCancelReason]           = useState("");
//   const [searchQuery, setSearchQuery]             = useState("");
//   const [sheetOpen, setSheetOpen]                 = useState(false);
//   const [typingTimeout, setTypingTimeout]         = useState(null);
//   // Add with your other state declarations
//  const [endSessionModalOpen, setEndSessionModalOpen] = useState(false);

//   const prevMessagesLengthRef = useRef(0);

//   // ── Auto-scroll ────────────────────────────────────────────────────
//   const isNearBottom = useCallback(() => {
//     if (!scrollRef.current) return true;
//     const el = scrollRef.current;
//     return el.scrollHeight - el.scrollTop - el.clientHeight < 150;
//   }, []);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const handleScroll = () => {
//       const near = isNearBottom();
//       setAutoScrollEnabled(near);
//       if (near) setNewMessagesCount(0);
//     };
//     el.addEventListener("scroll", handleScroll);
//     return () => el.removeEventListener("scroll", handleScroll);
//   }, [isNearBottom]);

//   useEffect(() => {
//     const cur  = messages.length;
//     const prev = prevMessagesLengthRef.current;
//     prevMessagesLengthRef.current = cur;

//     if (cur > prev) {
//       const last       = messages[messages.length - 1];
//       const userId     = useAuthStore.getState().user?.id;
//       const isOwn      = last?.sender?.id === userId;

//       if (isNearBottom() || autoScrollEnabled || isOwn) {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         setNewMessagesCount(0);
//       } else {
//         setNewMessagesCount((p) => p + (cur - prev));
//       }
//     } else if (cur < prev) {
//       setAutoScrollEnabled(true);
//       setNewMessagesCount(0);
//       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
//     }
//   }, [messages, isNearBottom, autoScrollEnabled]);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     setNewMessagesCount(0);
//     setAutoScrollEnabled(true);
//   }, []);

//   // ── Typing handler ─────────────────────────────────────────────────
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);
//     if (value.trim() && selectedBooking?.id) {
//       sendTyping(true);
//       if (typingTimeout) clearTimeout(typingTimeout);
//       setTypingTimeout(setTimeout(() => sendTyping(false), 2000));
//     } else {
//       sendTyping(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (typingTimeout) clearTimeout(typingTimeout);
//       sendTyping(false);
//     };
//   }, [selectedBooking?.id]);

//   // ── Initial data load ──────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const promises = [];
//         if (!hasFetchedAllBookings) promises.push(fetchBookings());
//         if (!hasFetchedTutors) promises.push(fetchTutors());
//         if (promises.length > 0) await Promise.all(promises);
//       } catch {
//         toast({
//           variant: "destructive",
//           title: "Failed to load",
//           description: "Could not load conversations or tutors.",
//         });
//       }
//     };
//     load();
//   }, []);

//   // ── Send message ───────────────────────────────────────────────────
//   const handleSend = async () => {
//     if (!inputValue.trim() || !selectedBooking?.id) return;
//     try {
//       await sendMessage(selectedBooking.id, inputValue.trim());
//       setInputValue("");
//       if (typingTimeout) clearTimeout(typingTimeout);
//       sendTyping(false);
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Message Failed",
//         description: err.message || "Could not send message. Please try again.",
//       });
//     }
//   };

//   // ── Booking actions ────────────────────────────────────────────────
//   const handleBookSession = (tutor) => {
//     if (!tutor) return;
//     setTutorToBook(tutor);
//     setIsBookingModalOpen(true);
//   };

//   const handleStartChat = async () => {
//     if (!selectedBooking?.id) return;
//     try {
//       // startChat is a store action if you have it; else use fetchBookings to refresh
//       await fetchBookings(true);
//       toast({ title: "Session Started", description: "You can now chat." });
//     } catch (err) {
//       toast({ variant: "destructive", title: "Cannot Start", description: err.message });
//     }
//   };

//   const handleEndChat = () => {
//     if (!selectedBooking?.id) return;
//     setEndSessionModalOpen(true);
//   };

// const handleConfirmEndSession = async () => {
//   setEndSessionModalOpen(false);
//   try {
//     const { fetchWithAuth } = useAuthStore.getState();
//     const res = await fetchWithAuth(
//       `https://fillops-server-5fuf.onrender.com/api/users/bookings/${selectedBooking.id}/end`,
//       { method: "POST", headers: { "Content-Type": "application/json" } }
//     );
//     if (!res.success) throw new Error(res.message || "Failed to end session");
//     setBookingToRate(selectedBooking);
//     setIsRatingModalOpen(true);
//   } catch (err) {
//     toast({ variant: "destructive", title: "End Failed", description: err.message });
//   }
// };

//   const handleConfirmBooking = async () => {
//     if (!selectedBooking?.id) return;
//     try {
//       await fetchBookings(true);
//       toast({ title: "Confirmed", description: "Booking confirmed." });
//     } catch (err) {
//       toast({ variant: "destructive", title: "Confirmation Failed", description: err.message });
//     }
//   };

//   const handleCancelBooking = () => {
//     if (!selectedBooking?.id) return;
//     setCancelModalOpen(true);
//   };

//   const handleViewDetails = () => {
//     if (!selectedBooking) return;
//     setBookingToView(selectedBooking);
//     setIsDetailsModalOpen(true);
//   };

//   const handleReschedule = () => {
//     if (!selectedBooking) return;
//     setBookingToReschedule(selectedBooking);
//     setIsRescheduleModalOpen(true);
//   };

//   // ── Render ─────────────────────────────────────────────────────────
//   if (isLoading && bookings.length === 0 && tutors.length === 0) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading conversations...</p>
//         </div>
//       </div>
//     );
//   }

//   const isTutorProfile = selectedBooking && tutors.some((t) => t.id === selectedBooking.id);

//   return (
//     <>
//       <div className="flex h-screen flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
//         {/* Mobile Header */}
//         <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-50 relative">
//           <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 {sheetOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-2xl">
//               <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
//                 <SheetTitle>Conversations</SheetTitle>
//               </SheetHeader>
//               <ScrollArea className="h-full">
//                 <EnhancedConversationList
//                   bookings={bookings}
//                   tutors={tutors}
//                   searchQuery={searchQuery}
//                   setSearchQuery={setSearchQuery}
//                   onSelect={() => setSheetOpen(false)}
//                 />
//               </ScrollArea>
//             </SheetContent>
//           </Sheet>
//           <div className="flex-1 text-center font-medium truncate px-2">
//             {selectedBooking ? selectedBooking.participant_name || "Chat" : "Select conversation"}
//           </div>
//           <div className="w-10" />
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="hidden md:block w-full md:w-[380px] lg:w-[420px] xl:w-[470px] border-r border-slate-200 bg-white overflow-hidden">
//           <EnhancedConversationList
//             bookings={bookings}
//             tutors={tutors}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />
//         </div>

//         {/* Main Chat Area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {selectedBooking ? (
//             <Card className="flex-1 flex flex-col mx-3 mt-3 md:m-4 md:ml-0 shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
//               <EnhancedChatHeader
//                 onStartChat={handleStartChat}
//                 onEndChat={handleEndChat}
//                 onViewDetails={handleViewDetails}
//                 onReschedule={handleReschedule}
//                 onConfirmBooking={handleConfirmBooking}
//                 onCancelBooking={handleCancelBooking}
//               />

//               <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4 md:px-6 md:py-6">
//                 <div className="space-y-4 max-w-4xl mx-auto">
//                   {isTutorProfile ? (
//                     <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
//                       <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
//                         {selectedBooking.participant_name?.charAt(0)?.toUpperCase() || "T"}
//                       </div>
//                       <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                         {selectedBooking.participant_name || "Tutor"}
//                       </h3>
//                       <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
//                         Available Tutor
//                       </Badge>
//                       <Button
//                         onClick={() => handleBookSession(selectedBooking)}
//                         className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white shadow-lg px-8 py-6 text-lg"
//                       >
//                         <Calendar className="h-5 w-5 mr-2" />
//                         Book Session
//                       </Button>
//                     </div>
//                   ) : (
//                     <>
//                       {selectedBooking.status === "pending" && (
//                         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Pending tutor confirmation</span>
//                           <Button size="sm" variant="ghost" onClick={handleCancelBooking}>
//                             Cancel
//                           </Button>
//                         </div>
//                       )}
//                       {selectedBooking.status === "confirmed" && (
//                         <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Confirmed – ready to start</span>
//                           <Button size="sm" onClick={handleStartChat}>Start Chat</Button>
//                         </div>
//                       )}
//                       {selectedBooking.status === "completed" && (
//                         <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Session completed</span>
//                           <Button
//                             size="sm"
//                             onClick={() => { setBookingToRate(selectedBooking); setIsRatingModalOpen(true); }}
//                           >
//                             Rate
//                           </Button>
//                         </div>
//                       )}

//                       {messages.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
//                           <Send className="h-12 w-12 text-indigo-400 mb-4" />
//                           <p className="text-slate-600 font-medium text-lg mb-2">No messages yet</p>
//                           <p className="text-slate-400 text-sm">Send a message to start the conversation</p>
//                         </div>
//                       ) : (
//                         messages.map((msg) => (
//                           <ChatMessage key={msg.id || msg.tempId} message={msg} />
//                         ))
//                       )}
//                       <div ref={messagesEndRef} />
//                     </>
//                   )}
//                 </div>
//               </ScrollArea>

//               {/* New messages indicator */}
//               {newMessagesCount > 0 && (
//                 <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
//                   <Button
//                     size="sm"
//                     onClick={scrollToBottom}
//                     className="shadow-lg rounded-full px-4 bg-indigo-600 text-white"
//                   >
//                     ↓ {newMessagesCount} new message{newMessagesCount > 1 ? "s" : ""}
//                   </Button>
//                 </div>
//               )}

//               {/* Input */}
//               {!isTutorProfile &&
//                 ["active", "confirmed"].includes(selectedBooking?.status?.toLowerCase()) && (
//                   <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-3 md:p-4">
//                     <div className="max-w-4xl mx-auto flex gap-2 md:gap-3 rounded-2xl bg-white border border-slate-200 p-2">
//                       <Input
//                         placeholder={socketConnected ? "Type your message..." : "Connecting..."}
//                         value={inputValue}
//                         onChange={handleInputChange}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             if (typingTimeout) clearTimeout(typingTimeout);
//                             sendTyping(false);
//                             handleSend();
//                           }
//                         }}
//                         onBlur={() => {
//                           sendTyping(false);
//                           if (typingTimeout) clearTimeout(typingTimeout);
//                         }}
//                         disabled={isSending || !socketConnected}
//                         className="flex-1 border-0 focus-visible:ring-0 bg-transparent placeholder:text-slate-400 text-slate-900"
//                       />
//                       <Button
//                         size="icon"
//                         onClick={handleSend}
//                         disabled={isSending || !inputValue.trim()}
//                         className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg h-10 w-10"
//                       >
//                         {isSending ? (
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                         ) : (
//                           <Send className="h-5 w-5" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//             </Card>
//           ) : (
//             <div className="flex-1 flex items-center justify-center m-4">
//               <Card className="p-10 md:p-16 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl animate-fade-in">
//                 <Search className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
//                 <h3 className="text-2xl font-bold text-slate-900 mb-3">Select a Conversation</h3>
//                 <p className="text-slate-500 max-w-md mx-auto">
//                   Choose a session from the list or browse available tutors to start chatting
//                 </p>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>

//       {endSessionModalOpen && (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <Card className="w-96 p-6 space-y-4">
//           <h3 className="text-lg font-semibold text-slate-900">End Session?</h3>
//           <p className="text-sm text-slate-600">
//             Are you sure you want to end this session? You'll be asked to rate your experience.
//           </p>
//           <div className="flex justify-end gap-2 mt-2">
//             <Button
//               variant="outline"
//               onClick={() => setEndSessionModalOpen(false)}
//             >
//               Continue Session
//             </Button>
//             <Button
//               onClick={handleConfirmEndSession}
//               className="bg-red-600 hover:bg-red-700 text-white"
//             >
//               End Session
//             </Button>
//           </div>
//         </Card>
//       </div>
//       )}

//       {/* Cancel Modal */}
//       {cancelModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <Card className="w-96 p-6 space-y-4">
//             <h3 className="text-lg font-semibold">Cancel Booking</h3>
//             <p className="text-sm text-slate-600">Please provide a reason for cancellation:</p>
//             <Input
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               placeholder="Reason for cancellation"
//             />
//             <div className="flex justify-end gap-2 mt-2">
//               <Button
//                 variant="secondary"
//                 onClick={() => { setCancelModalOpen(false); setCancelReason(""); }}
//               >
//                 Back
//               </Button>
//               <Button
//                 onClick={async () => {
//                   try {
//                     await cancelBooking(selectedBooking.id, cancelReason || "No reason provided");
//                     await fetchBookings(true);
//                     setSelectedBooking(null);
//                     toast({ title: "Cancelled", description: "Session cancelled." });
//                   } catch (err) {
//                     toast({
//                       variant: "destructive",
//                       title: "Cancellation Failed",
//                       description: err.message || "Could not cancel.",
//                     });
//                   } finally {
//                     setCancelModalOpen(false);
//                     setCancelReason("");
//                   }
//                 }}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Confirm Cancel
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Modals */}
//       <BookingModal
//         tutor={tutorToBook}
//         isOpen={isBookingModalOpen}
//         onClose={() => { setIsBookingModalOpen(false); setTutorToBook(null); }}
//       />
//       <RatingModal
//         booking={bookingToRate}
//         isOpen={isRatingModalOpen}
//         onClose={() => { setIsRatingModalOpen(false); setBookingToRate(null); }}
//       />
//       <BookingDetailsModal
//         booking={bookingToView}
//         isOpen={isDetailsModalOpen}
//         onClose={() => { setIsDetailsModalOpen(false); setBookingToView(null); }}
//         onReschedule={handleReschedule}
//         onCancel={handleCancelBooking}
//       />
//       <RescheduleModal
//         booking={bookingToReschedule}
//         isOpen={isRescheduleModalOpen}
//         onClose={() => {
//           setIsRescheduleModalOpen(false);
//           setBookingToReschedule(null);
//           fetchBookings(true);
//         }}
//       />
//     </>
//   );
// }










// src/components/user/chat/chat-interface.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Send, Loader2, Search, Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";

import EnhancedChatHeader      from "./chat-header";
import ChatMessage             from "./chat-message";
import EnhancedConversationList from "./conversation-list";
import BookingModal            from "./booking-modal";
import RatingModal             from "./rating-modal";
import BookingDetailsModal     from "./booking-details-modal";
import RescheduleModal         from "./reschedule-modal";
import { useUserChatStore }    from "@/store/userChatStore";

export default function ChatInterface() {
  const scrollRef      = useRef(null);
  const messagesEndRef = useRef(null);
  const { toast }      = useToast();

  // ── Store — subscribe granularly so only relevant changes re-render ──
  const messages        = useUserChatStore((s) => s.messages);
  const selectedBooking = useUserChatStore((s) => s.selectedBooking);
  const isLoading       = useUserChatStore((s) => s.isLoading);
  const isSending       = useUserChatStore((s) => s.isSending);
  const socketConnected = useUserChatStore((s) => s.socketConnected);
  const tutors          = useUserChatStore((s) => s.tutors);

  const {
    fetchBookings,
    fetchTutors,
    sendMessage,
    cancelBooking,
    setSelectedBooking,
    sendTyping,
    rescheduleBooking,
    rateSession,
  } = useUserChatStore();

  // ── Local UI state ────────────────────────────────────────────────
  const [inputValue,             setInputValue]             = useState("");
  const [isBookingModalOpen,     setIsBookingModalOpen]     = useState(false);
  const [isRatingModalOpen,      setIsRatingModalOpen]      = useState(false);
  const [isDetailsModalOpen,     setIsDetailsModalOpen]     = useState(false);
  const [isRescheduleModalOpen,  setIsRescheduleModalOpen]  = useState(false);
  const [tutorToBook,            setTutorToBook]            = useState(null);
  const [bookingToRate,          setBookingToRate]          = useState(null);
  const [bookingToView,          setBookingToView]          = useState(null);
  const [bookingToReschedule,    setBookingToReschedule]    = useState(null);
  const [autoScrollEnabled,      setAutoScrollEnabled]      = useState(true);
  const [newMessagesCount,       setNewMessagesCount]       = useState(0);
  const [cancelModalOpen,        setCancelModalOpen]        = useState(false);
  const [cancelReason,           setCancelReason]           = useState("");
  const [searchQuery,            setSearchQuery]            = useState("");
  const [sheetOpen,              setSheetOpen]              = useState(false);
  const [typingTimeout,          setTypingTimeout]          = useState(null);
  const [endSessionModalOpen,    setEndSessionModalOpen]    = useState(false);

  const prevMessagesLengthRef = useRef(0);

  // ── Initial data load ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchBookings(), fetchTutors()]);
      } catch {
        toast({ variant: "destructive", title: "Failed to load", description: "Could not load conversations." });
      }
    };
    load();
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────────
  const isNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 150;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const near = isNearBottom();
      setAutoScrollEnabled(near);
      if (near) setNewMessagesCount(0);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isNearBottom]);

  useEffect(() => {
    const cur  = messages.length;
    const prev = prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = cur;
    if (cur > prev) {
      const last  = messages[messages.length - 1];
      const myId  = useAuthStore.getState().user?.id;
      const isOwn = last?.sender?.id === myId;
      if (isNearBottom() || autoScrollEnabled || isOwn) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setNewMessagesCount(0);
      } else {
        setNewMessagesCount((p) => p + (cur - prev));
      }
    } else if (cur < prev) {
      setAutoScrollEnabled(true);
      setNewMessagesCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, isNearBottom, autoScrollEnabled]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessagesCount(0);
    setAutoScrollEnabled(true);
  }, []);

  // ── Typing ────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() && selectedBooking?.id) {
      sendTyping(true);
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => sendTyping(false), 2000));
    } else {
      sendTyping(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      sendTyping(false);
    };
  }, [selectedBooking?.id]);

  // ── Send ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBooking?.id) return;
    try {
      await sendMessage(selectedBooking.id, inputValue.trim());
      setInputValue("");
      if (typingTimeout) clearTimeout(typingTimeout);
      sendTyping(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Message Failed", description: err.message });
    }
  };

  // ── Booking action handlers ───────────────────────────────────────
  const handleBookSession = (tutor) => {
    if (!tutor) return;
    setTutorToBook(tutor);
    setIsBookingModalOpen(true);
  };

  const handleStartChat = () => {
    // Nothing to do server-side — the tutor starts the session.
    // The socket event "booking:active" will update the status automatically.
    toast({ title: "Waiting", description: "The session will start when your tutor begins it." });
  };

  const handleEndChat = () => {
    if (!selectedBooking?.id) return;
    setEndSessionModalOpen(true);
  };

  const handleConfirmEndSession = async () => {
    setEndSessionModalOpen(false);
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `https://fillops-server-5fuf.onrender.com/api/users/bookings/${selectedBooking.id}/end`,
        { method: "POST" }
      );
      if (!res.success) throw new Error(res.message || "Failed to end session");
      setBookingToRate(selectedBooking);
      setIsRatingModalOpen(true);
    } catch (err) {
      toast({ variant: "destructive", title: "End Failed", description: err.message });
    }
  };

  const handleCancelBooking = () => {
    if (!selectedBooking?.id) return;
    setCancelModalOpen(true);
  };

  const handleViewDetails = () => {
    if (!selectedBooking) return;
    setBookingToView(selectedBooking);
    setIsDetailsModalOpen(true);
  };

  const handleReschedule = (booking) => {
    setBookingToReschedule(booking || selectedBooking);
    setIsRescheduleModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelBooking(selectedBooking.id, cancelReason || "No reason provided");
      setSelectedBooking(null);
      toast({ title: "Cancelled", description: "Session cancelled." });
    } catch (err) {
      toast({ variant: "destructive", title: "Cancellation Failed", description: err.message });
    } finally {
      setCancelModalOpen(false);
      setCancelReason("");
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  const isTutorProfile = selectedBooking && !selectedBooking.isBooking;

  if (isLoading && !selectedBooking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading conversations…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-50">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {sheetOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-2xl">
              <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                <SheetTitle>Conversations</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full">
                <EnhancedConversationList
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSelect={() => setSheetOpen(false)}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-center font-medium truncate px-2">
            {selectedBooking ? selectedBooking.participant_name || "Chat" : "Select conversation"}
          </div>
          <div className="w-10" />
        </div>

        {/* Desktop sidebar — no props, reads store directly */}
        <div className="hidden md:block w-full md:w-[380px] lg:w-[420px] xl:w-[470px] border-r border-slate-200 bg-white overflow-hidden">
          <EnhancedConversationList
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedBooking ? (
            <Card className="flex-1 flex flex-col mx-3 mt-3 md:m-4 md:ml-0 shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <EnhancedChatHeader
                onStartChat={handleStartChat}
                onEndChat={handleEndChat}
                onViewDetails={handleViewDetails}
                onReschedule={handleReschedule}
                onConfirmBooking={() => {}} // handled by tutor
                onCancelBooking={handleCancelBooking}
              />

              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4 md:px-6 md:py-6">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {isTutorProfile ? (
                    /* Tutor profile view — book session */
                    <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
                        {selectedBooking.participant_name?.charAt(0)?.toUpperCase() || "T"}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedBooking.participant_name || "Tutor"}
                      </h3>
                      <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                        Available Tutor
                      </Badge>
                      <Button
                        onClick={() => handleBookSession(selectedBooking)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white shadow-lg px-8 py-6 text-lg"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Book Session
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Status banners */}
                      {selectedBooking.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                          <span>Pending tutor confirmation</span>
                          <Button size="sm" variant="ghost" onClick={handleCancelBooking}>Cancel</Button>
                        </div>
                      )}
                      {selectedBooking.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                          <span>Confirmed – waiting for tutor to start</span>
                        </div>
                      )}
                      {selectedBooking.status === "completed" && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                          <span>Session completed</span>
                          <Button
                            size="sm"
                            onClick={() => { setBookingToRate(selectedBooking); setIsRatingModalOpen(true); }}
                          >
                            Rate Session
                          </Button>
                        </div>
                      )}
                      {selectedBooking.status === "reschedule-proposed" && (
                        <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg text-sm">
                          Tutor proposed a reschedule — check booking details.
                        </div>
                      )}

                      {/* Messages */}
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                          <Send className="h-12 w-12 text-indigo-400 mb-4" />
                          <p className="text-slate-600 font-medium text-lg mb-2">No messages yet</p>
                          <p className="text-slate-400 text-sm">Send a message to start the conversation</p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <ChatMessage key={msg.id || msg.tempId} message={msg} />
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </ScrollArea>

              {/* New messages indicator */}
              {newMessagesCount > 0 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
                  <Button
                    size="sm"
                    onClick={scrollToBottom}
                    className="shadow-lg rounded-full px-4 bg-indigo-600 text-white"
                  >
                    ↓ {newMessagesCount} new message{newMessagesCount > 1 ? "s" : ""}
                  </Button>
                </div>
              )}

              {/* Input — only for active sessions */}
              {!isTutorProfile && selectedBooking?.status?.toLowerCase() === "active" && (
                <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-3 md:p-4">
                  <div className="max-w-4xl mx-auto flex gap-2 md:gap-3 rounded-2xl bg-white border border-slate-200 p-2">
                    <Input
                      placeholder={socketConnected ? "Type your message…" : "Connecting…"}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (typingTimeout) clearTimeout(typingTimeout);
                          sendTyping(false);
                          handleSend();
                        }
                      }}
                      onBlur={() => {
                        sendTyping(false);
                        if (typingTimeout) clearTimeout(typingTimeout);
                      }}
                      disabled={isSending || !socketConnected}
                      className="flex-1 border-0 focus-visible:ring-0 bg-transparent placeholder:text-slate-400"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={isSending || !inputValue.trim()}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 shadow-lg h-10 w-10"
                    >
                      {isSending
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <Send className="h-5 w-5" />
                      }
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center m-4">
              <Card className="p-10 md:p-16 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
                <Search className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Select a Conversation</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Choose a session or browse tutors to get started
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* ── End session modal ─────────────────────────────────────── */}
      {endSessionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">End Session?</h3>
            <p className="text-sm text-slate-600">
              Are you sure? You'll be asked to rate your experience.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEndSessionModalOpen(false)}>
                Continue
              </Button>
              <Button onClick={handleConfirmEndSession} className="bg-red-600 hover:bg-red-700 text-white">
                End Session
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Cancel modal ──────────────────────────────────────────── */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Cancel Booking</h3>
            <p className="text-sm text-slate-600">Please provide a reason:</p>
            <Input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setCancelModalOpen(false); setCancelReason(""); }}>
                Back
              </Button>
              <Button onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700 text-white">
                Confirm Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────── */}
      <BookingModal
        tutor={tutorToBook}
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setTutorToBook(null); }}
      />
      <RatingModal
        booking={bookingToRate}
        isOpen={isRatingModalOpen}
        onClose={() => { setIsRatingModalOpen(false); setBookingToRate(null); }}
      />
      <BookingDetailsModal
        booking={bookingToView}
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setBookingToView(null); }}
        onReschedule={handleReschedule}
        onCancel={handleCancelBooking}
      />
      <RescheduleModal
        booking={bookingToReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => { setIsRescheduleModalOpen(false); setBookingToReschedule(null); }}
      />
    </>
  );
}