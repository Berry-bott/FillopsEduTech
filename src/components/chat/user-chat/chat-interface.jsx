


// import React, { useEffect, useRef, useState } from "react";
// import { Send, Loader2, Search, Calendar, Star, Menu, X } from "lucide-react";
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



// export default function ChatInterface() {
//   const scrollRef = useRef(null);
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
//     fetchMessages,
//     sendMessage,
//     startChat,
//     endChat,
//     confirmBooking,
//     cancelBooking,
//     setSelectedBooking,
//   } = useUserChatStore();

//   const [inputValue, setInputValue] = useState("");
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
//   const [tutorToBook, setTutorToBook] = useState(null);
//   const [bookingToRate, setBookingToRate] = useState(null);
//   const [bookingToView, setBookingToView] = useState(null);
//   const [bookingToReschedule, setBookingToReschedule] = useState(null);

//   const [activeTab, setActiveTab] = useState("sessions");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sheetOpen, setSheetOpen] = useState(false);


//   useEffect(() => {
//   useUserChatStore.getState().connectSocket();

//   return () => {
//     // Optional: disconnect when leaving chat page
//     // useUserChatStore.getState().disconnectSocket();
//   };
// }, []);

//   // Debug logs
//   useEffect(() => {
//     console.log("=== ChatInterface Debug ===");
//     console.log("Bookings:", bookings.length);
//     console.log("Tutors:", tutors.length);
//     console.log("Selected:", selectedBooking?.id);
//     console.log("Messages:", messages.length);
//   }, [bookings, tutors, selectedBooking, messages]);

//   // Load initial data
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         await Promise.all([fetchBookings(), fetchTutors()]);
//       } catch (err) {
//         toast({
//           variant: "destructive",
//           title: "Failed to load",
//           description: "Could not load conversations or tutors.",
//         });
//       }
//     };
//     loadInitialData();
//   }, [fetchBookings, fetchTutors, toast]);

//   // Messages polling
//   useEffect(() => {
//     if (!selectedBooking?.id) return;

//     const loadMessages = async () => {
//       try {
//         await fetchMessages(selectedBooking.id);
//       } catch (err) {
//         console.error("Messages fetch failed:", err);
//       }
//     };

//     loadMessages();
//     const interval = setInterval(loadMessages, 8000);
//     return () => clearInterval(interval);
//   }, [selectedBooking?.id, fetchMessages]);

//   // Auto-scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // ────────────────────────────────────────────────
//   //                   HANDLERS
//   // ────────────────────────────────────────────────

//  const handleSend = async () => {
//   if (!inputValue.trim() || !selectedBooking?.id) return;

//   try {
//     await useUserChatStore.getState().sendMessage(selectedBooking.id, inputValue.trim());
//     setInputValue("");
//   } catch (err) {
//     toast({
//       variant: "destructive",
//       title: "Send failed",
//       description: err.message || "Could not send message.",
//     });
//   }
// };

//   const handleBookSession = (tutor) => {
//     if (!tutor) return;
//     setTutorToBook(tutor);
//     setIsBookingModalOpen(true);
//   };

//   const handleStartChat = async () => {
//     if (!selectedBooking?.id) return;
//     try {
//       await startChat(selectedBooking.id);
//       await fetchBookings();
//       toast({ title: "Session Started", description: "You can now chat." });
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Cannot Start",
//         description: err.message || "Session start failed.",
//       });
//     }
//   };

//   const handleEndChat = async () => {
//     if (!selectedBooking?.id) return;
//     try {
//       await endChat(selectedBooking.id);
//       setBookingToRate(selectedBooking);
//       setIsRatingModalOpen(true);
//       await fetchBookings();
//       toast({ title: "Session Ended", description: "Please rate your experience." });
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "End Failed",
//         description: err.message || "Could not end session.",
//       });
//     }
//   };

//   const handleConfirmBooking = async () => {
//     if (!selectedBooking?.id) return;
//     try {
//       await confirmBooking(selectedBooking.id);
//       await fetchBookings();
//       toast({ title: "Confirmed", description: "Booking confirmed." });
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Confirmation Failed",
//         description: err.message || "Could not confirm.",
//       });
//     }
//   };

//   const handleCancelBooking = async () => {
//     if (!selectedBooking?.id) return;

//     const reason = prompt("Reason for cancellation (optional):");
//     if (!reason && !window.confirm("Are you sure you want to cancel?")) return;

//     try {
//       await cancelBooking(selectedBooking.id, reason || "No reason provided");
//       await fetchBookings();
//       setSelectedBooking(null);
//       toast({ title: "Cancelled", description: "Session cancelled." });
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Cancellation Failed",
//         description: err.message || "Could not cancel.",
//       });
//     }
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

//   const isSelectedTutor = selectedBooking && tutors.some((t) => t.id === selectedBooking.id);

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
//                   activeTab={activeTab}
//                   setActiveTab={setActiveTab}
//                   searchQuery={searchQuery}
//                   setSearchQuery={setSearchQuery}
//                   onSelect={() => setSheetOpen(false)}
//                 />
//               </ScrollArea>
//             </SheetContent>
//           </Sheet>

//           <div className="flex-1 text-center font-medium truncate px-2">
//             {selectedBooking ? (
//               <div className="flex items-center justify-center gap-2">
//                 <span className="truncate max-w-[160px]">
//                   {selectedBooking.participant_name || "Chat"}
//                 </span>
//                 <Badge
//                   variant="outline"
//                   className={cn(
//                     "text-xs px-2 py-0.5 font-medium",
//                     isSelectedTutor
//                       ? "bg-blue-100 text-blue-700 border-blue-200"
//                       : "bg-green-100 text-green-700 border-green-200"
//                   )}
//                 >
//                   {isSelectedTutor ? "Tutor" : "Student"}
//                 </Badge>
//               </div>
//             ) : (
//               "Select conversation"
//             )}
//           </div>

//           <div className="w-10" />
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="hidden md:block w-full md:w-[380px] lg:w-[420px] xl:w-[470px] border-r border-slate-200 bg-white overflow-hidden">
//           <EnhancedConversationList
//             bookings={bookings}
//             tutors={tutors}
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />
//         </div>

//         {/* Main Content */}
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
//                   {isSelectedTutor ? (
//                     // Tutor profile view
//                     <div className="flex flex-col items-center justify-center h-full py-16 md:py-20 animate-fade-in">
//                       <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
//                         {selectedBooking.participant_name?.charAt(0)?.toUpperCase() || "T"}
//                       </div>
//                       <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
//                         {selectedBooking.participant_name || "Tutor"}
//                       </h3>
//                       <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
//                         Available Tutor
//                       </Badge>

//                       {selectedBooking.bio && (
//                         <p className="text-slate-600 text-center max-w-md mb-6 px-4 text-sm md:text-base">
//                           {selectedBooking.bio}
//                         </p>
//                       )}

//                       <Button
//                         onClick={() => handleBookSession(selectedBooking)}
//                         className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-6 py-5 md:px-8 md:py-6 text-base md:text-lg"
//                       >
//                         <Calendar className="h-5 w-5 mr-2" />
//                         Book a Session
//                       </Button>
//                     </div>
//                   ) : (
//                     // Messages view
//                     <>
//                       {/* Status banners */}
//                       {selectedBooking.status === "pending" && (
//                         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
//                           <span>Booking pending confirmation from tutor</span>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={handleCancelBooking}
//                             className="text-yellow-700 hover:text-yellow-900 whitespace-nowrap"
//                           >
//                             Cancel
//                           </Button>
//                         </div>
//                       )}

//                       {selectedBooking.status === "confirmed" && (
//                         <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
//                           <span>Booking confirmed! Ready to start chat.</span>
//                           <Button
//                             size="sm"
//                             onClick={handleStartChat}
//                             className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
//                           >
//                             Start Chat
//                           </Button>
//                         </div>
//                       )}

//                       {selectedBooking.status === "completed" && (
//                         <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
//                           <span>Session completed</span>
//                           <Button
//                             size="sm"
//                             onClick={() => {
//                               setBookingToRate(selectedBooking);
//                               setIsRatingModalOpen(true);
//                             }}
//                             className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
//                           >
//                             <Star className="h-4 w-4 mr-1" />
//                             Rate Session
//                           </Button>
//                         </div>
//                       )}

//                       {messages.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-full py-16 md:py-20 animate-fade-in">
//                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
//                             <Send className="h-8 w-8 md:h-10 md:w-10 text-indigo-600" />
//                           </div>
//                           <p className="text-slate-600 text-base md:text-lg font-medium mb-2">
//                             Start the conversation
//                           </p>
//                           <p className="text-slate-400 text-sm md:text-base">
//                             Send a message to begin chatting
//                           </p>
//                         </div>
//                       ) : (
//                         messages.map((msg, idx) => (
//                           <div
//                             key={msg.id}
//                             className="animate-scale-in"
//                             style={{ animationDelay: `${idx * 50}ms` }}
//                           >
//                             <ChatMessage message={msg} />
//                           </div>
//                         ))
//                       )}
//                     </>
//                   )}
//                 </div>
//               </ScrollArea>

//               {/* Input area */}
//               {!isSelectedTutor &&
//                 ["active", "confirmed"].includes(selectedBooking?.status?.toLowerCase()) && (
//                 <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-3 md:p-4">
//                   <div className="max-w-4xl mx-auto flex gap-2 md:gap-3 rounded-2xl bg-white border border-slate-200 p-2">
//                     <Input
//                       placeholder="Type your message..."
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault();
//                           handleSend();
//                         }
//                       }}
//                       disabled={isSending}
//                       className="flex-1 border-0 focus-visible:ring-0 bg-transparent placeholder:text-slate-400 text-slate-900 text-sm md:text-base"
//                     />
//                     <Button
//                       size="icon"
//                       onClick={handleSend}
//                       disabled={isSending || !inputValue.trim()}
//                       className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg h-10 w-10 md:h-11 md:w-11"
//                     >
//                       {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           ) : (
//             <div className="flex-1 flex items-center justify-center m-4">
//               <Card className="p-8 md:p-12 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl animate-fade-in">
//                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
//                   <Search className="h-12 w-12 md:h-16 md:w-16 text-indigo-600" />
//                 </div>
//                 <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
//                   Select a Conversation
//                 </h3>
//                 <p className="text-slate-500 mb-2 text-sm md:text-base">
//                   Tap the menu to choose a conversation
//                 </p>
//                 <p className="text-slate-400 text-xs md:text-sm">
//                   or switch to Tutors tab to find available tutors
//                 </p>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       <BookingModal
//         tutor={tutorToBook}
//         isOpen={isBookingModalOpen}
//         onClose={() => {
//           setIsBookingModalOpen(false);
//           setTutorToBook(null);
//         }}
//       />
//       <RatingModal
//         booking={bookingToRate}
//         isOpen={isRatingModalOpen}
//         onClose={() => {
//           setIsRatingModalOpen(false);
//           setBookingToRate(null);
//         }}
//       />
//       <BookingDetailsModal
//         booking={bookingToView}
//         isOpen={isDetailsModalOpen}
//         onClose={() => {
//           setIsDetailsModalOpen(false);
//           setBookingToView(null);
//         }}
//         onReschedule={handleReschedule}
//         onCancel={handleCancelBooking}
//       />
//       <RescheduleModal
//         booking={bookingToReschedule}
//         isOpen={isRescheduleModalOpen}
//         onClose={() => {
//           setIsRescheduleModalOpen(false);
//           setBookingToReschedule(null);
//           fetchBookings();
//         }}
//       />
//     </>
//   );
// }

















import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2, Search, Menu, X , Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import EnhancedChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import EnhancedConversationList from "./conversation-list";
import BookingModal from "./booking-modal";
import RatingModal from "./rating-modal";
import BookingDetailsModal from "./booking-details-modal";
import RescheduleModal from "./reschedule-modal";

import { useUserChatStore } from "@/store/userChatStore";

export default function ChatInterface() {
  const scrollRef = useRef(null);
  const { toast } = useToast();

  const {
    messages,
    bookings,
    tutors,
    selectedBooking,
    isLoading,
    isSending,
    fetchBookings,
    fetchTutors,
    fetchMessages,
    sendMessage,
    startChat,
    endChat,
    confirmBooking,
    cancelBooking,
    setSelectedBooking,
    connectSocket,
    disconnectSocket,
    socketConnected,
  } = useUserChatStore();

  const [inputValue, setInputValue] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [tutorToBook, setTutorToBook] = useState(null);
  const [bookingToRate, setBookingToRate] = useState(null);
  const [bookingToView, setBookingToView] = useState(null);
  const [bookingToReschedule, setBookingToReschedule] = useState(null);

  const [activeTab, setActiveTab] = useState("sessions");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // ─── Socket connection ──────────────────────────────────────
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  // ─── Initial data load ──────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchBookings(), fetchTutors()]);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to load",
          description: "Could not load conversations or tutors.",
        });
      }
    };
    loadData();
  }, [fetchBookings, fetchTutors, toast]);

  // ─── Load messages when selection changes ───────────────────
  useEffect(() => {
    if (selectedBooking?.id) {
      fetchMessages(selectedBooking.id);
    }
  }, [selectedBooking?.id, fetchMessages]);

  // ─── Auto-scroll to bottom ──────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBooking?.id) return;

    try {
      await sendMessage(selectedBooking.id, inputValue.trim());
      setInputValue("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Send failed",
        description: err.message || "Could not send message.",
      });
    }
  };

  const handleBookSession = (tutor) => {
    if (!tutor) return;
    setTutorToBook(tutor);
    setIsBookingModalOpen(true);
  };

  const handleStartChat = async () => {
    if (!selectedBooking?.id) return;
    try {
      await startChat(selectedBooking.id);
      await fetchBookings();
      toast({ title: "Session Started", description: "You can now chat." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Cannot Start",
        description: err.message || "Session start failed.",
      });
    }
  };

  const handleEndChat = async () => {
    if (!selectedBooking?.id) return;
    try {
      await endChat(selectedBooking.id);
      setBookingToRate(selectedBooking);
      setIsRatingModalOpen(true);
      await fetchBookings();
      toast({ title: "Session Ended", description: "Please rate your experience." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "End Failed",
        description: err.message || "Could not end session.",
      });
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking?.id) return;
    try {
      await confirmBooking(selectedBooking.id);
      await fetchBookings();
      toast({ title: "Confirmed", description: "Booking confirmed." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Confirmation Failed",
        description: err.message || "Could not confirm.",
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking?.id) return;

    const reason = prompt("Reason for cancellation (optional):");
    if (!reason && !window.confirm("Are you sure you want to cancel?")) return;

    try {
      await cancelBooking(selectedBooking.id, reason || "No reason provided");
      await fetchBookings();
      setSelectedBooking(null);
      toast({ title: "Cancelled", description: "Session cancelled." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: err.message || "Could not cancel.",
      });
    }
  };

  const handleViewDetails = () => {
    if (!selectedBooking) return;
    setBookingToView(selectedBooking);
    setIsDetailsModalOpen(true);
  };

  const handleReschedule = () => {
    if (!selectedBooking) return;
    setBookingToReschedule(selectedBooking);
    setIsRescheduleModalOpen(true);
  };

  // ─── Render logic ───────────────────────────────────────────
  if (isLoading && bookings.length === 0 && tutors.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  const isTutorProfile = selectedBooking && tutors.some((t) => t.id === selectedBooking.id);

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-50 relative">
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
                  bookings={bookings}
                  tutors={tutors}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
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

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-full md:w-[380px] lg:w-[420px] xl:w-[470px] border-r border-slate-200 bg-white overflow-hidden">
          <EnhancedConversationList
            bookings={bookings}
            tutors={tutors}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedBooking ? (
            <Card className="flex-1 flex flex-col mx-3 mt-3 md:m-4 md:ml-0 shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <EnhancedChatHeader
                onStartChat={handleStartChat}
                onEndChat={handleEndChat}
                onViewDetails={handleViewDetails}
                onReschedule={handleReschedule}
                onConfirmBooking={handleConfirmBooking}
                onCancelBooking={handleCancelBooking}
              />

              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4 md:px-6 md:py-6">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {isTutorProfile ? (
                    // Optional: Tutor profile preview when selecting a tutor (not in active chat)
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
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
                          <span>Pending tutor confirmation</span>
                          <Button size="sm" variant="ghost" onClick={handleCancelBooking}>
                            Cancel
                          </Button>
                        </div>
                      )}

                      {selectedBooking.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
                          <span>Confirmed – ready to start</span>
                          <Button size="sm" onClick={handleStartChat}>
                            Start Chat
                          </Button>
                        </div>
                      )}

                      {selectedBooking.status === "completed" && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
                          <span>Session completed</span>
                          <Button
                            size="sm"
                            onClick={() => {
                              setBookingToRate(selectedBooking);
                              setIsRatingModalOpen(true);
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Rate
                          </Button>
                        </div>
                      )}

                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
                          <Send className="h-12 w-12 text-indigo-400 mb-4" />
                          <p className="text-slate-600 font-medium text-lg mb-2">
                            No messages yet
                          </p>
                          <p className="text-slate-400 text-sm">
                            Send a message to start the conversation
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <ChatMessage key={msg.id || msg.tempId} message={msg} />
                        ))
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              {!isTutorProfile &&
                ["active", "confirmed"].includes(selectedBooking?.status?.toLowerCase()) && (
                  <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-3 md:p-4">
                    <div className="max-w-4xl mx-auto flex gap-2 md:gap-3 rounded-2xl bg-white border border-slate-200 p-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        disabled={isSending}
                        className="flex-1 border-0 focus-visible:ring-0 bg-transparent placeholder:text-slate-400 text-slate-900"
                      />
                      <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={isSending || !inputValue.trim()}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg h-10 w-10"
                      >
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                )}
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center m-4">
              <Card className="p-10 md:p-16 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl animate-fade-in">
                <Search className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Select a Conversation
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Choose a session from the list or browse available tutors to start chatting
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        tutor={tutorToBook}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setTutorToBook(null);
        }}
      />
      <RatingModal
        booking={bookingToRate}
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setBookingToRate(null);
        }}
      />
      <BookingDetailsModal
        booking={bookingToView}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setBookingToView(null);
        }}
        onReschedule={handleReschedule}
        onCancel={handleCancelBooking}
      />
      <RescheduleModal
        booking={bookingToReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setBookingToReschedule(null);
          fetchBookings();
        }}
      />
    </>
  );
}