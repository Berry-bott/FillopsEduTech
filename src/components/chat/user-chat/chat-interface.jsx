
// // import { useEffect, useRef, useState } from "react";
// // import { Send, Loader2, Search, Calendar, Star } from "lucide-react";

// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Card } from "@/components/ui/card";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Badge } from "@/components/ui/badge";

// // import ChatHeader from "./chat-header";
// // import ChatMessage from "./chat-message";
// // import ConversationList from "./conversation-list";
// // import BookingModal from "./booking-modal";
// // import RatingModal from "./rating-modal";

// // import { useUserChatStore } from "@/store/userChatStore";
// // import { cn } from "@/lib/utils";

// // export default function ChatInterface() {
// //   const scrollRef = useRef(null);

// //   const {
// //     messages,
// //     bookings,
// //     tutors,
// //     selectedBooking,
// //     isLoading,
// //     isSending,
// //     fetchBookings,
// //     fetchTutors,
// //     fetchMessages,
// //     sendMessage,
// //     startChat,
// //     endChat,
// //     confirmBooking,
// //     cancelBooking,
// //   } = useUserChatStore();

// //   const [inputValue, setInputValue] = useState("");
// //   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
// //   const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
// //   const [tutorToBook, setTutorToBook] = useState(null);
// //   const [bookingToRate, setBookingToRate] = useState(null);

// //   // Fetch bookings AND tutors on mount
// //   useEffect(() => {
// //     const loadInitialData = async () => {
// //       await Promise.all([
// //         fetchBookings(),
// //         fetchTutors()
// //       ]);
// //     };
    
// //     loadInitialData();
// //   }, [fetchBookings, fetchTutors]);

// //   // Fetch messages only if selectedBooking is an actual booking (not a tutor)
// //   useEffect(() => {
// //     if (!selectedBooking) return;
    
// //     // Check if this is a tutor (no booking yet) or an actual booking
// //     const isBooking = bookings.some(b => b.id === selectedBooking.id);
    
// //     if (!isBooking) {
// //       // This is a tutor, not a booking - clear messages
// //       useUserChatStore.setState({ messages: [] });
// //       return;
// //     }

// //     // This is an actual booking, fetch messages
// //     fetchMessages(selectedBooking.id);

// //     const interval = setInterval(() => {
// //       fetchMessages(selectedBooking.id);
// //     }, 3000);

// //     return () => clearInterval(interval);
// //   }, [selectedBooking, bookings, fetchMessages]);

// //   // Auto scroll messages
// //   useEffect(() => {
// //     if (scrollRef.current) {
// //       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
// //     }
// //   }, [messages]);

// //   const handleSend = async () => {
// //     if (!inputValue.trim() || !selectedBooking) return;

// //     // Check if this is a tutor or a booking
// //     const isBooking = bookings.some(b => b.id === selectedBooking.id);
    
// //     if (!isBooking) {
// //       // This is a tutor - need to create a booking first
// //       handleBookSession(selectedBooking);
// //       return;
// //     }

// //     await sendMessage(selectedBooking.id, inputValue);
// //     setInputValue("");
// //   };

// //   const handleBookSession = (tutor) => {
// //     setTutorToBook(tutor);
// //     setIsBookingModalOpen(true);
// //   };

// //   const handleStartChat = async (bookingId) => {
// //     await startChat(bookingId);
// //     // Refresh bookings to update status
// //     await fetchBookings();
// //   };

// //   const handleEndChat = async (bookingId) => {
// //     await endChat(bookingId);
// //     // Open rating modal
// //     setBookingToRate(selectedBooking);
// //     setIsRatingModalOpen(true);
// //     // Refresh bookings
// //     await fetchBookings();
// //   };

// //   const handleConfirmBooking = async (bookingId) => {
// //     await confirmBooking(bookingId);
// //     await fetchBookings();
// //   };

// //   const handleCancelBooking = async (bookingId) => {
// //     const reason = prompt("Please provide a reason for cancellation:");
// //     if (reason) {
// //       await cancelBooking(bookingId, reason);
// //       await fetchBookings();
// //       // Clear selection if current booking was cancelled
// //       if (selectedBooking?.id === bookingId) {
// //         useUserChatStore.setState({ selectedBooking: null });
// //       }
// //     }
// //   };

// //   if (isLoading && bookings.length === 0 && tutors.length === 0) {
// //     return (
// //       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
// //         <div className="text-center">
// //           <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading conversations...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Check if selected item is a tutor
// //   const isSelectedTutor = selectedBooking && tutors.some(t => t.id === selectedBooking.id);

// //   return (
// //     <>
// //       <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
// //         {/* Sidebar: Conversations & Tutors */}
// //         <div className="w-[380px]">
// //           <ConversationList bookings={bookings} tutors={tutors} />
// //         </div>

// //         {/* Chat Area */}
// //         <div className="flex-1 flex flex-col">
// //           {selectedBooking ? (
// //             <Card className="flex-1 flex flex-col m-4 ml-0 shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-xl">
// //               <ChatHeader 
// //                 onEndChat={handleEndChat}
// //                 onConfirmBooking={handleConfirmBooking}
// //                 onCancelBooking={handleCancelBooking}
// //               />

// //               {/* Messages */}
// //               <ScrollArea ref={scrollRef} className="flex-1 overflow-hidden px-6 py-4">
// //                 <div className="space-y-4 max-w-4xl mx-auto">
// //                   {isSelectedTutor ? (
// //                     // Show tutor profile when a tutor is selected
// //                     <div className="flex flex-col items-center justify-center h-full py-20">
// //                       <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
// //                         {selectedBooking.participant_name?.charAt(0).toUpperCase() || "T"}
// //                       </div>
// //                       <h3 className="text-2xl font-bold text-slate-900 mb-2">
// //                         {selectedBooking.participant_name}
// //                       </h3>
// //                       <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
// //                         Available Tutor
// //                       </Badge>
                      
// //                       {selectedBooking.bio && (
// //                         <p className="text-slate-600 text-center max-w-md mb-6 px-4">
// //                           {selectedBooking.bio}
// //                         </p>
// //                       )}
                      
// //                       {selectedBooking.completedSessions !== undefined && (
// //                         <div className="bg-indigo-50 px-6 py-3 rounded-full mb-6">
// //                           <span className="text-indigo-700 font-semibold">
// //                             {selectedBooking.completedSessions} Sessions Completed
// //                           </span>
// //                         </div>
// //                       )}

// //                       {/* Show subjects if available */}
// //                       {selectedBooking.subjects && selectedBooking.subjects.length > 0 && (
// //                         <div className="mb-6 w-full max-w-md px-4">
// //                           <p className="text-sm font-semibold text-slate-700 mb-3 text-center">
// //                             Teaches {selectedBooking.subjects.length} subjects
// //                           </p>
// //                           <div className="flex flex-wrap gap-2 justify-center">
// //                             {selectedBooking.subjects.slice(0, 6).map((sub) => (
// //                               <Badge key={sub.id} variant="outline" className="text-xs">
// //                                 {sub.subjectName}
// //                               </Badge>
// //                             ))}
// //                             {selectedBooking.subjects.length > 6 && (
// //                               <Badge variant="outline" className="text-xs">
// //                                 +{selectedBooking.subjects.length - 6} more
// //                               </Badge>
// //                             )}
// //                           </div>
// //                         </div>
// //                       )}

// //                       <Button 
// //                         onClick={() => handleBookSession(selectedBooking)}
// //                         className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-lg"
// //                       >
// //                         <Calendar className="h-5 w-5 mr-2" />
// //                         Book a Session
// //                       </Button>
                      
// //                       <p className="text-slate-400 text-sm mt-4">
// //                         Create a booking to start chatting
// //                       </p>
// //                     </div>
// //                   ) : (
// //                     <>
// //                       {/* Booking Status Info */}
// //                       {selectedBooking.status === "pending" && (
// //                         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
// //                           <span>Booking pending confirmation from tutor</span>
// //                           <Button
// //                             size="sm"
// //                             variant="ghost"
// //                             onClick={() => handleCancelBooking(selectedBooking.id)}
// //                             className="text-yellow-700 hover:text-yellow-900"
// //                           >
// //                             Cancel
// //                           </Button>
// //                         </div>
// //                       )}

// //                       {selectedBooking.status === "confirmed" && (
// //                         <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
// //                           <span>Booking confirmed! Ready to start chat.</span>
// //                           <Button
// //                             size="sm"
// //                             onClick={() => handleStartChat(selectedBooking.id)}
// //                             className="bg-green-600 hover:bg-green-700 text-white"
// //                           >
// //                             Start Chat
// //                           </Button>
// //                         </div>
// //                       )}

// //                       {selectedBooking.status === "completed" && (
// //                         <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
// //                           <span>Session completed</span>
// //                           <Button
// //                             size="sm"
// //                             onClick={() => {
// //                               setBookingToRate(selectedBooking);
// //                               setIsRatingModalOpen(true);
// //                             }}
// //                             className="bg-blue-600 hover:bg-blue-700 text-white"
// //                           >
// //                             <Star className="h-4 w-4 mr-1" />
// //                             Rate Session
// //                           </Button>
// //                         </div>
// //                       )}

// //                       {/* Messages */}
// //                       {messages.length === 0 ? (
// //                         <div className="flex flex-col items-center justify-center h-full py-20">
// //                           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
// //                             <Send className="h-10 w-10 text-indigo-600" />
// //                           </div>
// //                           <p className="text-slate-600 text-lg font-medium mb-2">
// //                             Start the conversation
// //                           </p>
// //                           <p className="text-slate-400 text-sm">Send a message to begin chatting</p>
// //                         </div>
// //                       ) : (
// //                         messages.map((msg) => (
// //                           <ChatMessage key={msg.id} message={msg} />
// //                         ))
// //                       )}
// //                     </>
// //                   )}
// //                 </div>
// //               </ScrollArea>

// //               {/* Input - Only show for active bookings, not tutors or pending bookings */}
// //               {!isSelectedTutor && selectedBooking.status === "active" && (
// //                 <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-4">
// //                   <div className="max-w-4xl mx-auto flex gap-3 input-glow rounded-2xl bg-white border border-slate-200 p-2">
// //                     <Input
// //                       placeholder="Type your message..."
// //                       value={inputValue}
// //                       onChange={(e) => setInputValue(e.target.value)}
// //                       onKeyDown={(e) => {
// //                         if (e.key === "Enter" && !e.shiftKey) {
// //                           e.preventDefault();
// //                           handleSend();
// //                         }
// //                       }}
// //                       disabled={isSending}
// //                       className="flex-1 border-0 bg-transparent placeholder:text-slate-400 text-slate-900"
// //                     />
// //                     <Button
// //                       size="icon"
// //                       onClick={handleSend}
// //                       disabled={isSending || !inputValue.trim()}
// //                       className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
// //                     >
// //                       {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
// //                     </Button>
// //                   </div>
// //                 </div>
// //               )}
// //             </Card>
// //           ) : (
// //             <div className="flex-1 flex items-center justify-center m-4 ml-0">
// //               <Card className="p-12 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
// //                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
// //                   <Search className="h-16 w-16 text-indigo-600" />
// //                 </div>
// //                 <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
// //                   Select a Conversation
// //                 </h3>
// //                 <p className="text-slate-500 text-base mb-4">
// //                   Choose a conversation from the sidebar to start chatting
// //                 </p>
// //                 <p className="text-slate-400 text-sm">
// //                   or click "Get Tutors" to find available tutors
// //                 </p>
// //               </Card>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modals */}
// //       <BookingModal
// //         tutor={tutorToBook}
// //         isOpen={isBookingModalOpen}
// //         onClose={() => {
// //           setIsBookingModalOpen(false);
// //           setTutorToBook(null);
// //         }}
// //       />

// //       <RatingModal
// //         booking={bookingToRate}
// //         isOpen={isRatingModalOpen}
// //         onClose={() => {
// //           setIsRatingModalOpen(false);
// //           setBookingToRate(null);
// //         }}
// //       />
// //     </>
// //   );
// // }











// import { useEffect, useRef, useState } from "react";
// import { Send, Loader2, Search, Calendar, Star, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";

// import ChatHeader from "./chat-header";
// import ChatMessage from "./chat-message";
// import ConversationList from "./conversation-list";
// import BookingModal from "./booking-modal";
// import RatingModal from "./rating-modal";

// import { useUserChatStore } from "@/store/userChatStore";
// import { cn } from "@/lib/utils";

// export default function ChatInterface() {
//   const scrollRef = useRef(null);

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
//     deleteBooking,
//   } = useUserChatStore();

//   const [inputValue, setInputValue] = useState("");
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
//   const [tutorToBook, setTutorToBook] = useState(null);
//   const [bookingToRate, setBookingToRate] = useState(null);

//   // Fetch bookings AND tutors on mount
//   useEffect(() => {
//     const loadInitialData = async () => {
//       await Promise.all([
//         fetchBookings(),
//         fetchTutors()
//       ]);
//     };
    
//     loadInitialData();
//   }, [fetchBookings, fetchTutors]);

//   // Fetch messages only if selectedBooking is an actual booking (not a tutor)
//   useEffect(() => {
//     if (!selectedBooking) return;
    
//     // Check if this is a tutor (no booking yet) or an actual booking
//     const isBooking = bookings.some(b => b.id === selectedBooking.id);
    
//     if (!isBooking) {
//       // This is a tutor, not a booking - clear messages
//       useUserChatStore.setState({ messages: [] });
//       return;
//     }

//     // This is an actual booking, fetch messages
//     fetchMessages(selectedBooking.id);

//     const interval = setInterval(() => {
//       fetchMessages(selectedBooking.id);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [selectedBooking, bookings, fetchMessages]);

//   // Auto scroll messages
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!inputValue.trim() || !selectedBooking) return;

//     // Check if this is a tutor or a booking
//     const isBooking = bookings.some(b => b.id === selectedBooking.id);
    
//     if (!isBooking) {
//       // This is a tutor - need to create a booking first
//       handleBookSession(selectedBooking);
//       return;
//     }

//     await sendMessage(selectedBooking.id, inputValue);
//     setInputValue("");
//   };

//   const handleBookSession = (tutor) => {
//     setTutorToBook(tutor);
//     setIsBookingModalOpen(true);
//   };

//   const handleStartChat = async (bookingId) => {
//     await startChat(bookingId);
//     // Refresh bookings to update status
//     await fetchBookings();
//   };

//   const handleEndChat = async (bookingId) => {
//     await endChat(bookingId);
//     // Open rating modal
//     setBookingToRate(selectedBooking);
//     setIsRatingModalOpen(true);
//     // Refresh bookings
//     await fetchBookings();
//   };

//   const handleConfirmBooking = async (bookingId) => {
//     await confirmBooking(bookingId);
//     await fetchBookings();
//   };

//   const handleCancelBooking = async (bookingId) => {
//     const reason = prompt("Please provide a reason for cancellation:");
//     if (reason) {
//       await cancelBooking(bookingId, reason);
//       await fetchBookings();
//       // Clear selection if current booking was cancelled
//       if (selectedBooking?.id === bookingId) {
//         useUserChatStore.setState({ selectedBooking: null });
//       }
//     }
//   };

//   const handleDeleteSession = async (bookingId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this session? This action cannot be undone and will permanently remove all messages."
//     );
    
//     if (confirmed) {
//       try {
//         await deleteBooking(bookingId);
//         // Selection and messages are already cleared in the store
//         await fetchBookings();
//       } catch (error) {
//         alert("Failed to delete session. Please try again.");
//       }
//     }
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

//   // Check if selected item is a tutor
//   const isSelectedTutor = selectedBooking && tutors.some(t => t.id === selectedBooking.id);

//   return (
//     <>
//       <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
//         {/* Sidebar: Conversations & Tutors */}
//         <div className="w-[380px]">
//           <ConversationList 
//             bookings={bookings} 
//             tutors={tutors}
//             onDeleteSession={handleDeleteSession}
//           />
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedBooking ? (
//             <Card className="flex-1 flex flex-col m-4 ml-0 shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-xl">
//               <ChatHeader 
//                 onEndChat={handleEndChat}
//                 onConfirmBooking={handleConfirmBooking}
//                 onCancelBooking={handleCancelBooking}
//                 onDeleteSession={handleDeleteSession}
//               />

//               {/* Messages */}
//               <ScrollArea ref={scrollRef} className="flex-1 overflow-hidden px-6 py-4">
//                 <div className="space-y-4 max-w-4xl mx-auto">
//                   {isSelectedTutor ? (
//                     // Show tutor profile when a tutor is selected
//                     <div className="flex flex-col items-center justify-center h-full py-20">
//                       <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
//                         {selectedBooking.participant_name?.charAt(0).toUpperCase() || "T"}
//                       </div>
//                       <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                         {selectedBooking.participant_name}
//                       </h3>
//                       <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
//                         Available Tutor
//                       </Badge>
                      
//                       {selectedBooking.bio && (
//                         <p className="text-slate-600 text-center max-w-md mb-6 px-4">
//                           {selectedBooking.bio}
//                         </p>
//                       )}
                      
//                       {selectedBooking.completedSessions !== undefined && (
//                         <div className="bg-indigo-50 px-6 py-3 rounded-full mb-6">
//                           <span className="text-indigo-700 font-semibold">
//                             {selectedBooking.completedSessions} Sessions Completed
//                           </span>
//                         </div>
//                       )}

//                       {/* Show subjects if available */}
//                       {selectedBooking.subjects && selectedBooking.subjects.length > 0 && (
//                         <div className="mb-6 w-full max-w-md px-4">
//                           <p className="text-sm font-semibold text-slate-700 mb-3 text-center">
//                             Teaches {selectedBooking.subjects.length} subjects
//                           </p>
//                           <div className="flex flex-wrap gap-2 justify-center">
//                             {selectedBooking.subjects.slice(0, 6).map((sub) => (
//                               <Badge key={sub.id} variant="outline" className="text-xs">
//                                 {sub.subjectName}
//                               </Badge>
//                             ))}
//                             {selectedBooking.subjects.length > 6 && (
//                               <Badge variant="outline" className="text-xs">
//                                 +{selectedBooking.subjects.length - 6} more
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       <Button 
//                         onClick={() => handleBookSession(selectedBooking)}
//                         className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-lg"
//                       >
//                         <Calendar className="h-5 w-5 mr-2" />
//                         Book a Session
//                       </Button>
                      
//                       <p className="text-slate-400 text-sm mt-4">
//                         Create a booking to start chatting
//                       </p>
//                     </div>
//                   ) : (
//                     <>
//                       {/* Booking Status Info */}
//                       {selectedBooking.status === "pending" && (
//                         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
//                           <span>Booking pending confirmation from tutor</span>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => handleCancelBooking(selectedBooking.id)}
//                             className="text-yellow-700 hover:text-yellow-900"
//                           >
//                             Cancel
//                           </Button>
//                         </div>
//                       )}

//                       {selectedBooking.status === "confirmed" && (
//                         <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
//                           <span>Booking confirmed! Ready to start chat.</span>
//                           <Button
//                             size="sm"
//                             onClick={() => handleStartChat(selectedBooking.id)}
//                             className="bg-green-600 hover:bg-green-700 text-white"
//                           >
//                             Start Chat
//                           </Button>
//                         </div>
//                       )}

//                       {selectedBooking.status === "completed" && (
//                         <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
//                           <span>Session completed</span>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               onClick={() => {
//                                 setBookingToRate(selectedBooking);
//                                 setIsRatingModalOpen(true);
//                               }}
//                               className="bg-blue-600 hover:bg-blue-700 text-white"
//                             >
//                               <Star className="h-4 w-4 mr-1" />
//                               Rate Session
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleDeleteSession(selectedBooking.id)}
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               <Trash2 className="h-4 w-4 mr-1" />
//                               Delete
//                             </Button>
//                           </div>
//                         </div>
//                       )}

//                       {selectedBooking.status === "cancelled" && (
//                         <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
//                           <span>Session cancelled</span>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleDeleteSession(selectedBooking.id)}
//                             className="text-red-600 border-red-200 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4 mr-1" />
//                             Delete
//                           </Button>
//                         </div>
//                       )}

//                       {/* Messages */}
//                       {messages.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-full py-20">
//                           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
//                             <Send className="h-10 w-10 text-indigo-600" />
//                           </div>
//                           <p className="text-slate-600 text-lg font-medium mb-2">
//                             Start the conversation
//                           </p>
//                           <p className="text-slate-400 text-sm">Send a message to begin chatting</p>
//                         </div>
//                       ) : (
//                         messages.map((msg) => (
//                           <ChatMessage key={msg.id} message={msg} />
//                         ))
//                       )}
//                     </>
//                   )}
//                 </div>
//               </ScrollArea>

//               {/* Input - Only show for active bookings, not tutors or pending bookings */}
//               {!isSelectedTutor && selectedBooking.status === "active" && (
//                 <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-4">
//                   <div className="max-w-4xl mx-auto flex gap-3 input-glow rounded-2xl bg-white border border-slate-200 p-2">
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
//                       className="flex-1 border-0 bg-transparent placeholder:text-slate-400 text-slate-900"
//                     />
//                     <Button
//                       size="icon"
//                       onClick={handleSend}
//                       disabled={isSending || !inputValue.trim()}
//                       className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
//                     >
//                       {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           ) : (
//             <div className="flex-1 flex items-center justify-center m-4 ml-0">
//               <Card className="p-12 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
//                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
//                   <Search className="h-16 w-16 text-indigo-600" />
//                 </div>
//                 <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
//                   Select a Conversation
//                 </h3>
//                 <p className="text-slate-500 text-base mb-4">
//                   Choose a conversation from the sidebar to start chatting
//                 </p>
//                 <p className="text-slate-400 text-sm">
//                   or click "Get Tutors" to find available tutors
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
//     </>
//   );
// }









// import { useEffect, useRef, useState } from "react";
// import { Send, Loader2, Search, Calendar, Star, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";

// import EnhancedChatHeader from "./chat-header";
// import ChatMessage from "./chat-message";
// import EnhancedConversationList from "./conversation-list";
// import BookingModal from "./booking-modal";
// import RatingModal from "./rating-modal";
// import BookingDetailsModal from "./booking-details-modal";
// import RescheduleModal from "./reschedule-modal.jsx";



// import { useUserChatStore } from "@/store/userChatStore";
// import { cn } from "@/lib/utils";

// export default function ChatInterface() {
//   const scrollRef = useRef(null);

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
//     deleteBooking,
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

//   // Fetch bookings AND tutors on mount
//   useEffect(() => {
//     const loadInitialData = async () => {
//       await Promise.all([fetchBookings(), fetchTutors()]);
//     };

//     loadInitialData();
//   }, [fetchBookings, fetchTutors]);

//   // Fetch messages only if selectedBooking is an actual booking (not a tutor)
//   useEffect(() => {
//     if (!selectedBooking) return;

//     // Check if this is a tutor (no booking yet) or an actual booking
//     const isBooking = bookings.some((b) => b.id === selectedBooking.id);

//     if (!isBooking) {
//       // This is a tutor, not a booking - clear messages
//       useUserChatStore.setState({ messages: [] });
//       return;
//     }

//     // This is an actual booking, fetch messages
//     fetchMessages(selectedBooking.id);

//     const interval = setInterval(() => {
//       fetchMessages(selectedBooking.id);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [selectedBooking, bookings, fetchMessages]);

//   // Auto scroll messages
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!inputValue.trim() || !selectedBooking) return;

//     // Check if this is a tutor or a booking
//     const isBooking = bookings.some((b) => b.id === selectedBooking.id);

//     if (!isBooking) {
//       // This is a tutor - need to create a booking first
//       handleBookSession(selectedBooking);
//       return;
//     }

//     await sendMessage(selectedBooking.id, inputValue);
//     setInputValue("");
//   };

//   const handleBookSession = (tutor) => {
//     setTutorToBook(tutor);
//     setIsBookingModalOpen(true);
//   };

//   const handleStartChat = async (bookingId) => {
//     await startChat(bookingId);
//     await fetchBookings();
//   };

//   const handleEndChat = async (bookingId) => {
//     await endChat(bookingId);
//     // Open rating modal
//     setBookingToRate(selectedBooking);
//     setIsRatingModalOpen(true);
//     await fetchBookings();
//   };

//   const handleConfirmBooking = async (bookingId) => {
//     await confirmBooking(bookingId);
//     await fetchBookings();
//   };

//   const handleCancelBooking = async (bookingId) => {
//     const reason = prompt("Please provide a reason for cancellation:");
//     if (reason) {
//       await cancelBooking(bookingId, reason);
//       await fetchBookings();
//       // Clear selection if current booking was cancelled
//       if (selectedBooking?.id === bookingId) {
//         useUserChatStore.setState({ selectedBooking: null });
//       }
//     }
//   };

//   const handleDeleteSession = async (bookingId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this session? This action cannot be undone and will permanently remove all messages."
//     );

//     if (confirmed) {
//       try {
//         await deleteBooking(bookingId);
//         await fetchBookings();
//       } catch (error) {
//         alert("Failed to delete session. Please try again.");
//       }
//     }
//   };

//   const handleViewDetails = (booking) => {
//     setBookingToView(booking);
//     setIsDetailsModalOpen(true);
//   };

//   const handleReschedule = (booking) => {
//     setBookingToReschedule(booking);
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

//   // Check if selected item is a tutor
//   const isSelectedTutor =
//     selectedBooking && tutors.some((t) => t.id === selectedBooking.id);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');
        
//         * {
//           font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
//         }
        
//         .font-display {
//           font-family: 'Playfair Display', serif;
//         }
        
//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         .animate-slide-in-up {
//           animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
        
//         .animate-slide-in-left {
//           animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
        
//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }
        
//         .animate-scale-in {
//           animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
        
//         .message-bubble {
//           transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
//         }
        
//         .message-bubble:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//         }
        
//         .conversation-item {
//           transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//         }
        
//         .conversation-item::before {
//           content: '';
//           position: absolute;
//           left: 0;
//           top: 0;
//           bottom: 0;
//           width: 3px;
//           background: linear-gradient(to bottom, #6366f1, #8b5cf6);
//           transform: scaleY(0);
//           transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
//           border-radius: 0 4px 4px 0;
//         }
        
//         .conversation-item.active::before {
//           transform: scaleY(1);
//         }
        
//         .conversation-item:hover {
//           transform: translateX(4px);
//         }
        
//         .glass-effect {
//           background: rgba(255, 255, 255, 0.8);
//           backdrop-filter: blur(12px);
//           border: 1px solid rgba(255, 255, 255, 0.3);
//         }
        
//         .input-glow:focus-within {
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
//         }
        
//         .gradient-text {
//           background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//       `}</style>

//       <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
//         {/* Sidebar: Conversations & Tutors */}
//         <div className="w-[380px] animate-slide-in-left">
//           <EnhancedConversationList
//             bookings={bookings}
//             tutors={tutors}
//             onDeleteSession={handleDeleteSession}
//           />
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col animate-slide-in-up">
//           {selectedBooking ? (
//             <Card className="flex-1 flex flex-col m-4 ml-0 shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-xl">
//               <EnhancedChatHeader
//                 onEndChat={handleEndChat}
//                 onViewDetails={handleViewDetails}
//                 onReschedule={handleReschedule}
//                 onConfirmBooking={handleConfirmBooking}
//                 onCancelBooking={handleCancelBooking}
//                 onDeleteSession={handleDeleteSession}
//               />

//               {/* Messages */}
//               <ScrollArea
//                 ref={scrollRef}
//                 className="flex-1 overflow-hidden px-6 py-4"
//               >
//                 <div className="space-y-4 max-w-4xl mx-auto">
//                   {isSelectedTutor ? (
//                     // Show tutor profile when a tutor is selected
//                     <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
//                       <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
//                         {selectedBooking.participant_name
//                           ?.charAt(0)
//                           .toUpperCase() || "T"}
//                       </div>
//                       <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                         {selectedBooking.participant_name}
//                       </h3>
//                       <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
//                         Available Tutor
//                       </Badge>

//                       {selectedBooking.bio && (
//                         <p className="text-slate-600 text-center max-w-md mb-6 px-4">
//                           {selectedBooking.bio}
//                         </p>
//                       )}

//                       {selectedBooking.completedSessions !== undefined && (
//                         <div className="bg-indigo-50 px-6 py-3 rounded-full mb-6">
//                           <span className="text-indigo-700 font-semibold">
//                             {selectedBooking.completedSessions} Sessions
//                             Completed
//                           </span>
//                         </div>
//                       )}

//                       {selectedBooking.subjects &&
//                         selectedBooking.subjects.length > 0 && (
//                           <div className="mb-6 w-full max-w-md px-4">
//                             <p className="text-sm font-semibold text-slate-700 mb-3 text-center">
//                               Teaches {selectedBooking.subjects.length} subjects
//                             </p>
//                             <div className="flex flex-wrap gap-2 justify-center">
//                               {selectedBooking.subjects
//                                 .slice(0, 6)
//                                 .map((sub) => (
//                                   <Badge
//                                     key={sub.id}
//                                     variant="outline"
//                                     className="text-xs"
//                                   >
//                                     {sub.subjectName}
//                                   </Badge>
//                                 ))}
//                               {selectedBooking.subjects.length > 6 && (
//                                 <Badge variant="outline" className="text-xs">
//                                   +{selectedBooking.subjects.length - 6} more
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                       <Button
//                         onClick={() => handleBookSession(selectedBooking)}
//                         className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-lg"
//                       >
//                         <Calendar className="h-5 w-5 mr-2" />
//                         Book a Session
//                       </Button>

//                       <p className="text-slate-400 text-sm mt-4">
//                         Create a booking to start chatting
//                       </p>
//                     </div>
//                   ) : (
//                     <>
//                       {/* Booking Status Info */}
//                       {selectedBooking.status === "pending" && (
//                         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Booking pending confirmation from tutor</span>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() =>
//                               handleCancelBooking(selectedBooking.id)
//                             }
//                             className="text-yellow-700 hover:text-yellow-900"
//                           >
//                             Cancel
//                           </Button>
//                         </div>
//                       )}

//                       {selectedBooking.status === "confirmed" && (
//                         <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Booking confirmed! Ready to start chat.</span>
//                           <Button
//                             size="sm"
//                             onClick={() => handleStartChat(selectedBooking.id)}
//                             className="bg-green-600 hover:bg-green-700 text-white"
//                           >
//                             Start Chat
//                           </Button>
//                         </div>
//                       )}

//                       {selectedBooking.status === "completed" && (
//                         <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Session completed</span>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               onClick={() => {
//                                 setBookingToRate(selectedBooking);
//                                 setIsRatingModalOpen(true);
//                               }}
//                               className="bg-blue-600 hover:bg-blue-700 text-white"
//                             >
//                               <Star className="h-4 w-4 mr-1" />
//                               Rate Session
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() =>
//                                 handleDeleteSession(selectedBooking.id)
//                               }
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               <Trash2 className="h-4 w-4 mr-1" />
//                               Delete
//                             </Button>
//                           </div>
//                         </div>
//                       )}

//                       {selectedBooking.status === "cancelled" && (
//                         <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
//                           <span>Session cancelled</span>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() =>
//                               handleDeleteSession(selectedBooking.id)
//                             }
//                             className="text-red-600 border-red-200 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4 mr-1" />
//                             Delete
//                           </Button>
//                         </div>
//                       )}

//                       {/* Messages */}
//                       {messages.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
//                           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
//                             <Send className="h-10 w-10 text-indigo-600" />
//                           </div>
//                           <p className="text-slate-600 text-lg font-medium mb-2">
//                             Start the conversation
//                           </p>
//                           <p className="text-slate-400 text-sm">
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

//               {/* Input - Only show for active bookings */}
//               {!isSelectedTutor && selectedBooking.status === "active" && (
//                 <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-4">
//                   <div className="max-w-4xl mx-auto flex gap-3 input-glow rounded-2xl bg-white border border-slate-200 p-2 transition-shadow duration-200">
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
//                       className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-slate-400 text-slate-900"
//                     />
//                     <Button
//                       size="icon"
//                       onClick={handleSend}
//                       disabled={isSending || !inputValue.trim()}
//                       className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
//                     >
//                       {isSending ? (
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                       ) : (
//                         <Send className="h-5 w-5" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           ) : (
//             <div className="flex-1 flex items-center justify-center m-4 ml-0">
//               <Card className="p-12 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl animate-fade-in">
//                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
//                   <Search className="h-16 w-16 text-indigo-600" />
//                 </div>
//                 <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
//                   Select a Conversation
//                 </h3>
//                 <p className="text-slate-500 text-base mb-4">
//                   Choose a conversation from the sidebar to start chatting
//                 </p>
//                 <p className="text-slate-400 text-sm">
//                   or switch to "Tutors" tab to find available tutors
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
//           // Refresh bookings after rescheduling
//           fetchBookings();
//         }}
//       />
//     </>
//   );
// }






import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Search, Calendar, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import EnhancedChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import EnhancedConversationList from "./conversation-list";
import BookingModal from "./booking-modal";
import RatingModal from "./rating-modal";
import BookingDetailsModal from "./booking-details-modal";

import { useUserChatStore } from "@/store/userChatStore";

export default function ChatInterface() {
  const scrollRef = useRef(null);

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
  } = useUserChatStore();

  const [inputValue, setInputValue] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [tutorToBook, setTutorToBook] = useState(null);
  const [bookingToRate, setBookingToRate] = useState(null);
  const [bookingToView, setBookingToView] = useState(null);

  // Fetch bookings AND tutors on mount
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchBookings(), fetchTutors()]);
    };

    loadInitialData();
  }, [fetchBookings, fetchTutors]);

  // Fetch messages only if selectedBooking is an actual booking (not a tutor)
  useEffect(() => {
    if (!selectedBooking) return;

    const isBooking = bookings.some((b) => b.id === selectedBooking.id);

    if (!isBooking) {
      useUserChatStore.setState({ messages: [] });
      return;
    }

    fetchMessages(selectedBooking.id);

    const interval = setInterval(() => {
      fetchMessages(selectedBooking.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedBooking, bookings, fetchMessages]);

  // Auto scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBooking) return;

    const isBooking = bookings.some((b) => b.id === selectedBooking.id);

    if (!isBooking) {
      handleBookSession(selectedBooking);
      return;
    }

    await sendMessage(selectedBooking.id, inputValue);
    setInputValue("");
  };

  const handleBookSession = (tutor) => {
    setTutorToBook(tutor);
    setIsBookingModalOpen(true);
  };

  const handleStartChat = async (bookingId) => {
    await startChat(bookingId);
    await fetchBookings();
  };

  const handleEndChat = async (bookingId) => {
    await endChat(bookingId);
    setBookingToRate(selectedBooking);
    setIsRatingModalOpen(true);
    await fetchBookings();
  };

  const handleConfirmBooking = async (bookingId) => {
    await confirmBooking(bookingId);
    await fetchBookings();
  };

  const handleCancelBooking = async (bookingId) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (reason) {
      await cancelBooking(bookingId, reason);
      await fetchBookings();
      if (selectedBooking?.id === bookingId) {
        useUserChatStore.setState({ selectedBooking: null });
      }
    }
  };

  const handleViewDetails = (booking) => {
    setBookingToView(booking);
    setIsDetailsModalOpen(true);
  };

  // Filter out completed and cancelled bookings from display
  const activeBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );

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

  const isSelectedTutor = selectedBooking && tutors.some((t) => t.id === selectedBooking.id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .font-display {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .message-bubble {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .message-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .conversation-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .conversation-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          transform: scaleY(0);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 0 4px 4px 0;
        }
        
        .conversation-item.active::before {
          transform: scaleY(1);
        }
        
        .conversation-item:hover {
          transform: translateX(4px);
        }
        
        .input-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[380px] animate-slide-in-left">
          <EnhancedConversationList bookings={activeBookings} tutors={tutors} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col animate-slide-in-up">
          {selectedBooking ? (
            <Card className="flex-1 flex flex-col m-4 ml-0 shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-xl">
              <EnhancedChatHeader
                onEndChat={handleEndChat}
                onViewDetails={handleViewDetails}
                onConfirmBooking={handleConfirmBooking}
                onCancelBooking={handleCancelBooking}
              />

              <ScrollArea ref={scrollRef} className="flex-1 overflow-hidden px-6 py-4">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {isSelectedTutor ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
                        {selectedBooking.participant_name?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedBooking.participant_name}
                      </h3>
                      <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                        Available Tutor
                      </Badge>

                      {selectedBooking.bio && (
                        <p className="text-slate-600 text-center max-w-md mb-6 px-4">
                          {selectedBooking.bio}
                        </p>
                      )}

                      {selectedBooking.completedSessions !== undefined && (
                        <div className="bg-indigo-50 px-6 py-3 rounded-full mb-6">
                          <span className="text-indigo-700 font-semibold">
                            {selectedBooking.completedSessions} Sessions Completed
                          </span>
                        </div>
                      )}

                      {selectedBooking.subjects && selectedBooking.subjects.length > 0 && (
                        <div className="mb-6 w-full max-w-md px-4">
                          <p className="text-sm font-semibold text-slate-700 mb-3 text-center">
                            Teaches {selectedBooking.subjects.length} subjects
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {selectedBooking.subjects.slice(0, 6).map((sub) => (
                              <Badge key={sub.id} variant="outline" className="text-xs">
                                {sub.subjectName}
                              </Badge>
                            ))}
                            {selectedBooking.subjects.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{selectedBooking.subjects.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => handleBookSession(selectedBooking)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-lg"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Book a Session
                      </Button>

                      <p className="text-slate-400 text-sm mt-4">
                        Create a booking to start chatting
                      </p>
                    </div>
                  ) : (
                    <>
                      {selectedBooking.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
                          <span>Booking pending confirmation from tutor</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelBooking(selectedBooking.id)}
                            className="text-yellow-700 hover:text-yellow-900"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}

                      {selectedBooking.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
                          <span>Booking confirmed! Ready to start chat.</span>
                          <Button
                            size="sm"
                            onClick={() => handleStartChat(selectedBooking.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
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
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Rate Session
                          </Button>
                        </div>
                      )}

                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                            <Send className="h-10 w-10 text-indigo-600" />
                          </div>
                          <p className="text-slate-600 text-lg font-medium mb-2">
                            Start the conversation
                          </p>
                          <p className="text-slate-400 text-sm">
                            Send a message to begin chatting
                          </p>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div
                            key={msg.id}
                            className="animate-scale-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <ChatMessage message={msg} />
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>

              {!isSelectedTutor && selectedBooking.status === "active" && (
                <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-4">
                  <div className="max-w-4xl mx-auto flex gap-3 input-glow rounded-2xl bg-white border border-slate-200 p-2">
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
                      className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-slate-400 text-slate-900"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={isSending || !inputValue.trim()}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                    >
                      {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center m-4 ml-0">
              <Card className="p-12 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-xl animate-fade-in">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-16 w-16 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  Select a Conversation
                </h3>
                <p className="text-slate-500 text-base mb-4">
                  Choose a conversation from the sidebar to start chatting
                </p>
                <p className="text-slate-400 text-sm">
                  or switch to "Tutors" tab to find available tutors
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
        onCancel={handleCancelBooking}
      />
    </>
  );
}