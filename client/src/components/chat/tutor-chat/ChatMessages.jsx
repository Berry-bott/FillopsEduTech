// // import { useEffect, useRef, useState, useCallback } from "react";
// // import { format, parseISO } from "date-fns";
// // import {
// //   Loader2,
// //   User,
// //   CheckCircle,
// //   XCircle,
// //   MessageSquare,
// //   Clock,
// //   ArrowDown,
// // } from "lucide-react";
// // import useTutorAuthStore from "@/store/tutorAuthStore";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { cn } from "@/lib/utils";

// // export default function ChatMessages({
// //   messages = [],
// //   isLoading = false,
// //   bookingStatus,
// //   proposedAt,
// //   onConfirmMessage,
// //   onRejectMessage,
// //   onAcceptReschedule,
// //   onRejectReschedule,
// // }) {
// //   const { tutor, isSomeoneTyping } = useTutorAuthStore();

// //   const containerRef = useRef(null);
// //   const messagesEndRef = useRef(null);

// //   const prevMessagesLengthRef = useRef(0);
// //   const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
// //   const [newMessagesCount, setNewMessagesCount] = useState(0);

// //   const [selectedMessage, setSelectedMessage] = useState(null);
// //   const [actionType, setActionType] = useState(null);
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   // Check if near bottom
// //   const isNearBottom = useCallback(() => {
// //     if (!containerRef.current) return true;
// //     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
// //     return scrollHeight - scrollTop - clientHeight < 150;
// //   }, []);

// //   // Handle scroll to re-enable auto-scroll when user reaches bottom
// //   const handleScroll = useCallback(() => {
// //     if (isNearBottom()) {
// //       setAutoScrollEnabled(true);
// //       setNewMessagesCount(0);
// //     } else {
// //       setAutoScrollEnabled(false);
// //     }
// //   }, [isNearBottom]);

// //   // Smart auto-scroll + new message detection
// //   useEffect(() => {
// //     const currentLength = messages.length;
// //     const previousLength = prevMessagesLengthRef.current;
// //     prevMessagesLengthRef.current = currentLength;

// //     if (currentLength > previousLength) {
// //       if (isNearBottom() || autoScrollEnabled) {
// //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //         setNewMessagesCount(0);
// //       } else {
// //         setNewMessagesCount(currentLength - previousLength);
// //       }
// //     } else if (currentLength < previousLength) {
// //       setAutoScrollEnabled(true);
// //       setNewMessagesCount(0);
// //       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
// //     }
// //   }, [messages, isNearBottom, autoScrollEnabled]);

// //   // Initial scroll to bottom on first load
// //   useEffect(() => {
// //     if (messages.length > 0) {
// //       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
// //     }
// //   }, []);

// //   const openActionDialog = (message, type) => {
// //     setSelectedMessage(message);
// //     setActionType(type);
// //   };

// //   const handleConfirm = async () => {
// //     if (!selectedMessage) return;
// //     setIsProcessing(true);
// //     try {
// //       await onConfirmMessage?.(selectedMessage.id);
// //       setSelectedMessage(null);
// //     } catch (err) {
// //       console.error("Failed to confirm:", err);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const handleReject = async () => {
// //     if (!selectedMessage) return;
// //     setIsProcessing(true);
// //     try {
// //       await onRejectMessage?.(selectedMessage.id);
// //       setSelectedMessage(null);
// //     } catch (err) {
// //       console.error("Failed to reject:", err);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   if (isLoading && messages.length === 0) {
// //     return (
// //       <div className="flex-1 flex items-center justify-center">
// //         <Loader2 className="size-8 animate-spin text-primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div
// //         ref={containerRef}
// //         className="flex-1 overflow-y-auto p-4 space-y-5 bg-background relative"
// //         onScroll={handleScroll}
// //       >
// //         {messages.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center h-full text-center py-12">
// //             <MessageSquare className="size-16 text-muted-foreground/30 mb-4" />
// //             <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
// //             <p className="text-sm text-muted-foreground mt-2">
// //               Start the conversation by sending a message
// //             </p>
// //           </div>
// //         ) : (
// //           messages.map((message) => {
// //           const isTutor = message.sender?.id === tutor?.id;
// //           const isSystem = message.senderRole === "system" || message.isSystem;
// //           const isPending = message.status === "pending";
// //           const isRejected = message.status === "rejected";
// //           const isConfirmed = message.status === "confirmed";
// //           console.log("Message:", {
// //           id: message.id,
// //           senderId: message.senderId,
// //           isTutor: message.senderId === tutor?.id,
// //           content: message.content,         
// //           contentType: typeof message.content,
// //           fullMessage: message
// //         });

// //         {isSomeoneTyping && (
// //           <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground italic">
// //             <div className="flex gap-1">
// //               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
// //               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
// //               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
// //             </div>
// //             Student is typing...
// //           </div>
// //         )}

// //         if (isSystem) {
// //           return (
// //             <div key={message.id} className="flex justify-center">
// //               <div className="max-w-[70%] px-5 py-3 bg-gray-100/70 text-gray-700 rounded-xl text-sm text-center shadow-sm">
// //                 {message.content}
// //                 <div className="text-xs text-gray-500 mt-1">
// //                   {format(parseISO(message.createdAt), "HH:mm")}
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         }

// //       // ────────────────────────────────────────────────
// //       // STUDENT MESSAGE ─ LEFT SIDE
// //       // ────────────────────────────────────────────────
// //       if (!isTutor) {
// //         return (
// //           <div 
// //             key={message.id} 
// //             className="flex items-start gap-3 max-w-[80%] justify-left"
// //           >
// //             {/* Student avatar LEFT */}
// //             <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
// //               {message.sender?.avatar && message.sender.avatar.trim() !== "" ? (
// //                 <AvatarImage 
// //                   src={message.sender.avatar} 
// //                   alt={message.sender.name || "Student"}
// //                 />
// //               ) : null}
// //               <AvatarFallback className=" text-muted font-bold bg-primary/80" >
// //                 {message.sender?.name?.charAt(0)?.toUpperCase() || "S"}
// //               </AvatarFallback>
// //             </Avatar>

// //             <div className="flex flex-col gap-1">
// //               <div
// //                 className={cn(
// //                   "px-4 py-3 rounded-2xl text-sm shadow-sm break-words whitespace-pre-wrap leading-relaxed rounded-tl-none",
// //                   isRejected
// //                     ? "bg-red-50 text-red-900 border border-red-200"
// //                     : isPending
// //                     ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
// //                     : "bg-muted text-foreground"
// //                 )}
// //               >
// //                 {message.content}

// //                 <div className="mt-2 flex items-center gap-2">
// //                   {isPending && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending Review</Badge>}
// //                   {isConfirmed && <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>}
// //                   {isRejected && <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>}
// //                 </div>
// //               </div>

// //               <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
// //                 {format(parseISO(message.createdAt), "HH:mm")}
// //                 <span>•</span>
// //                 <span className="font-medium">{message.sender?.name || "Student"}</span>
// //               </div>

// //               {isPending && (
// //                 <div className="flex gap-2 mt-3">
// //                   <Button size="sm" variant="outline" className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50" onClick={() => openActionDialog(message, "confirm")}>
// //                     <CheckCircle className="size-3.5 mr-1.5" /> Confirm
// //                   </Button>
// //                   <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50" onClick={() => openActionDialog(message, "reject")}>
// //                     <XCircle className="size-3.5 mr-1.5" /> Reject
// //                   </Button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         );
// //       }

// //       // ────────────────────────────────────────────────
// //       // TUTOR MESSAGE ─ RIGHT SIDE
// //       // ────────────────────────────────────────────────
// //       return (
// //         <div 
// //           key={message.id} 
// //           className="flex items-start gap-3 max-w-[80%] ml-auto justify-end "
// //         >
// //           <div className="flex flex-col gap-1 items-right">
// //             <div
// //               className="px-4 py-3 rounded-2xl text-md shadow-sm break-words whitespace-pre-wrap 
// //               leading-relaxed rounded-tr-none text-gray-500   border"
// //             >
// //               {message.content}
// //             </div>

// //             <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
// //               {format(parseISO(message.createdAt), "HH:mm")}
// //               <span>•</span>
// //               <span className="font-medium">You</span>
// //             </div>
// //           </div>

// //           {/* Tutor avatar RIGHT */}
// //           <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
// //             {tutor?.avatar && tutor.avatar.trim() !== "" ? (
// //               <AvatarImage src={tutor.avatar} alt={tutor.name || "You"} />
// //             ) : null}
// //             <AvatarFallback className="bg-primary/10 text-primary">
// //               {tutor?.name?.charAt(0)?.toUpperCase() || "T"}
// //             </AvatarFallback>
// //           </Avatar>
// //         </div>
// //       );
// //     })
// //         )}

// //         {/* New messages indicator */}
// //         {newMessagesCount > 0 && (
// //           <div className="sticky bottom-6 z-10 flex justify-center">
// //             <Button
// //               size="sm"
// //               className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-5 py-2 flex items-center gap-2"
// //               onClick={() => {
// //                 setAutoScrollEnabled(true);
// //                 messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //                 setNewMessagesCount(0);
// //               }}
// //             >
// //               <ArrowDown className="size-4" />
// //               {newMessagesCount} new message{newMessagesCount !== 1 ? "s" : ""}
// //             </Button>
// //           </div>
// //         )}

// //         {/* Reschedule & status banners */}
// //         {bookingStatus === "reschedule-proposed" && proposedAt && (
// //           <div className="text-center py-6">
// //             <div className="inline-flex flex-col gap-4 px-8 py-6 bg-purple-50 text-purple-900 rounded-2xl border-2 border-purple-300 shadow-lg max-w-md mx-auto">
// //               <div className="flex items-center gap-3 justify-center">
// //                 <Clock className="size-6 text-purple-600" />
// //                 <p className="font-semibold text-base">Reschedule Proposed</p>
// //               </div>

// //               <div className="bg-white/80 px-4 py-3 rounded-lg border border-purple-200">
// //                 <p className="text-sm text-purple-700 mb-1 font-medium">New proposed time:</p>
// //                 <p className="text-base font-bold text-purple-900">
// //                   {format(parseISO(proposedAt), "EEEE, MMMM dd, yyyy")}
// //                 </p>
// //                 <p className="text-lg font-bold text-purple-900">
// //                   {format(parseISO(proposedAt), "hh:mm a")}
// //                 </p>
// //               </div>

// //               <p className="text-sm text-purple-700">
// //                 Waiting for student to confirm the new schedule
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         {bookingStatus === "completed" && (
// //           <div className="text-center py-8">
// //             <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200 shadow-sm mx-auto">
// //               <CheckCircle className="size-6" />
// //               <p className="font-medium text-base">This session has been completed</p>
// //             </div>
// //           </div>
// //         )}

// //         {bookingStatus === "cancelled" && (
// //           <div className="text-center py-8">
// //             <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm mx-auto">
// //               <XCircle className="size-6" />
// //               <p className="font-medium text-base">This booking has been cancelled</p>
// //             </div>
// //           </div>
// //         )}

// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Confirm / Reject Dialog */}
// //       <AlertDialog
// //         open={!!selectedMessage}
// //         onOpenChange={(open) => !open && setSelectedMessage(null)}
// //       >
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>
// //               {actionType === "confirm" ? "Confirm this message?" : "Reject this message?"}
// //             </AlertDialogTitle>
// //             <AlertDialogDescription>
// //               {actionType === "confirm"
// //                 ? "Confirming this message will allow the session to proceed."
// //                 : "Rejecting this message will cancel the request."}
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>

// //           {selectedMessage && (
// //             <div className="py-4">
// //               <div className="p-4 bg-muted/50 rounded-lg border">
// //                 <p className="text-sm leading-relaxed">{selectedMessage.content}</p>
// //                 <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
// //                   <User className="size-3.5" />
// //                   <span>{selectedMessage.sender?.name || "Student"}</span>
// //                   <span>•</span>
// //                   <span>{format(parseISO(selectedMessage.createdAt), "PPp")}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           <AlertDialogFooter>
// //             <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>

// //             {actionType === "confirm" ? (
// //               <AlertDialogAction
// //                 onClick={handleConfirm}
// //                 className="bg-green-600 hover:bg-green-700"
// //                 disabled={isProcessing}
// //               >
// //                 {isProcessing ? (
// //                   <>
// //                     <Loader2 className="size-4 mr-2 animate-spin" />
// //                     Confirming...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <CheckCircle className="size-4 mr-2" />
// //                     Confirm
// //                   </>
// //                 )}
// //               </AlertDialogAction>
// //             ) : (
// //               <AlertDialogAction
// //                 onClick={handleReject}
// //                 className="bg-red-600 hover:bg-red-700"
// //                 disabled={isProcessing}
// //               >
// //                 {isProcessing ? (
// //                   <>
// //                     <Loader2 className="size-4 mr-2 animate-spin" />
// //                     Rejecting...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <XCircle className="size-4 mr-2" />
// //                     Reject
// //                   </>
// //                 )}
// //               </AlertDialogAction>
// //             )}
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </>
// //   );
// // }









// // // Fixed ChatMessages.jsx - with corrected sender detection

// // import { useEffect, useRef, useState, useCallback } from "react";
// // import { format, parseISO } from "date-fns";
// // import {
// //   Loader2,
// //   User,
// //   CheckCircle,
// //   XCircle,
// //   MessageSquare,
// //   Clock,
// //   ArrowDown,
// // } from "lucide-react";
// // import useTutorAuthStore from "@/store/tutorAuthStore";
// // import { useTutorChatStore } from "@/store/tutorChatStore"; // ← ADDED
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { cn } from "@/lib/utils";

// // export default function ChatMessages({
// //   messages = [],
// //   isLoading = false,
// //   bookingStatus,
// //   proposedAt,
// //   onConfirmMessage,
// //   onRejectMessage,
// //   onAcceptReschedule,
// //   onRejectReschedule,
// // }) {
// //   const { tutor } = useTutorAuthStore();
// //   const { isSomeoneTyping } = useTutorChatStore(); // ← FIXED: Get from chat store

// //   const containerRef = useRef(null);
// //   const messagesEndRef = useRef(null);

// //   const prevMessagesLengthRef = useRef(0);
// //   const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
// //   const [newMessagesCount, setNewMessagesCount] = useState(0);

// //   const [selectedMessage, setSelectedMessage] = useState(null);
// //   const [actionType, setActionType] = useState(null);
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   // Check if near bottom
// //   const isNearBottom = useCallback(() => {
// //     if (!containerRef.current) return true;
// //     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
// //     return scrollHeight - scrollTop - clientHeight < 150;
// //   }, []);

// //   // Handle scroll to re-enable auto-scroll when user reaches bottom
// //   const handleScroll = useCallback(() => {
// //     if (isNearBottom()) {
// //       setAutoScrollEnabled(true);
// //       setNewMessagesCount(0);
// //     } else {
// //       setAutoScrollEnabled(false);
// //     }
// //   }, [isNearBottom]);

// //   // Smart auto-scroll + new message detection
// //   useEffect(() => {
// //     const currentLength = messages.length;
// //     const previousLength = prevMessagesLengthRef.current;
// //     prevMessagesLengthRef.current = currentLength;

// //     if (currentLength > previousLength) {
// //       if (isNearBottom() || autoScrollEnabled) {
// //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //         setNewMessagesCount(0);
// //       } else {
// //         setNewMessagesCount(currentLength - previousLength);
// //       }
// //     } else if (currentLength < previousLength) {
// //       setAutoScrollEnabled(true);
// //       setNewMessagesCount(0);
// //       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
// //     }
// //   }, [messages, isNearBottom, autoScrollEnabled]);

// //   // Initial scroll to bottom on first load
// //   useEffect(() => {
// //     if (messages.length > 0) {
// //       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
// //     }
// //   }, []);

// //   const openActionDialog = (message, type) => {
// //     setSelectedMessage(message);
// //     setActionType(type);
// //   };

// //   const handleConfirm = async () => {
// //     if (!selectedMessage) return;
// //     setIsProcessing(true);
// //     try {
// //       await onConfirmMessage?.(selectedMessage.id);
// //       setSelectedMessage(null);
// //     } catch (err) {
// //       console.error("Failed to confirm:", err);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const handleReject = async () => {
// //     if (!selectedMessage) return;
// //     setIsProcessing(true);
// //     try {
// //       await onRejectMessage?.(selectedMessage.id);
// //       setSelectedMessage(null);
// //     } catch (err) {
// //       console.error("Failed to reject:", err);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   if (isLoading && messages.length === 0) {
// //     return (
// //       <div className="flex-1 flex items-center justify-center">
// //         <Loader2 className="size-8 animate-spin text-primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div
// //         ref={containerRef}
// //         className="flex-1 overflow-y-auto p-4 space-y-5 bg-background relative"
// //         onScroll={handleScroll}
// //       >
// //         {messages.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center h-full text-center py-12">
// //             <MessageSquare className="size-16 text-muted-foreground/30 mb-4" />
// //             <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
// //             <p className="text-sm text-muted-foreground mt-2">
// //               Start the conversation by sending a message
// //             </p>
// //           </div>
// //         ) : (
// //           messages.map((message) => {
// //             // ✅ FIX: Correctly detect if message is from tutor
// //             const isTutor = message.sender?.id === tutor?.id;
// //             const isSystem = message.senderRole === "system" || message.isSystem;
// //             const isPending = message.status === "pending";
// //             const isRejected = message.status === "rejected";
// //             const isConfirmed = message.status === "confirmed";

// //             console.log("Message render:", {
// //               id: message.id,
// //               senderIdFromMessage: message.sender?.id,
// //               tutorId: tutor?.id,
// //               isTutor,
// //               content: message.content?.substring(0, 30),
// //             });

// //             if (isSystem) {
// //               return (
// //                 <div
// //                  key={message.id || message.tempId || `${message.senderIdFromMessage}-${message.createdAt}`}  
// //                  className="flex justify-center">
// //                   <div className="max-w-[70%] px-5 py-3 bg-gray-100/70 text-gray-700 rounded-xl text-sm text-center shadow-sm">
// //                     {message.content}
// //                     <div className="text-xs text-gray-500 mt-1">
// //                       {format(parseISO(message.createdAt), "HH:mm")}
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             }

// //             // ────────────────────────────────────────────────
// //             // STUDENT MESSAGE ─ LEFT SIDE
// //             // ────────────────────────────────────────────────
// //             if (!isTutor) {
// //               return (
// //                 <div 
// //                   key={message.id} 
// //                   className="flex items-start gap-3 max-w-[80%] justify-left"
// //                 >
// //                   {/* Student avatar LEFT */}
// //                   <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
// //                     {message.sender?.avatar && message.sender.avatar.trim() !== "" ? (
// //                       <AvatarImage 
// //                         src={message.sender.avatar} 
// //                         alt={message.sender.name || "Student"}
// //                       />
// //                     ) : null}
// //                     <AvatarFallback className="text-muted font-bold bg-primary/80">
// //                       {message.sender?.name?.charAt(0)?.toUpperCase() || "S"}
// //                     </AvatarFallback>
// //                   </Avatar>

// //                   <div className="flex flex-col gap-1">
// //                     <div
// //                       className={cn(
// //                         "px-4 py-3 rounded-2xl text-sm shadow-sm break-words whitespace-pre-wrap leading-relaxed rounded-tl-none",
// //                         isRejected
// //                           ? "bg-red-50 text-red-900 border border-red-200"
// //                           : isPending
// //                           ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
// //                           : "bg-muted text-foreground"
// //                       )}
// //                     >
// //                       {message.content}

// //                       <div className="mt-2 flex items-center gap-2">
// //                         {isPending && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending Review</Badge>}
// //                         {isConfirmed && <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>}
// //                         {isRejected && <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>}
// //                       </div>
// //                     </div>

// //                     <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
// //                       {format(parseISO(message.createdAt), "HH:mm")}
// //                       <span>•</span>
// //                       <span className="font-medium">{message.sender?.name || "Student"}</span>
// //                     </div>

// //                     {isPending && (
// //                       <div className="flex gap-2 mt-3">
// //                         <Button 
// //                           size="sm" 
// //                           variant="outline" 
// //                           className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50" 
// //                           onClick={() => openActionDialog(message, "confirm")}
// //                         >
// //                           <CheckCircle className="size-3.5 mr-1.5" /> Confirm
// //                         </Button>
// //                         <Button 
// //                           size="sm" 
// //                           variant="outline" 
// //                           className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50" 
// //                           onClick={() => openActionDialog(message, "reject")}
// //                         >
// //                           <XCircle className="size-3.5 mr-1.5" /> Reject
// //                         </Button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               );
// //             }

// //             // ────────────────────────────────────────────────
// //             // TUTOR MESSAGE ─ RIGHT SIDE
// //             // ────────────────────────────────────────────────
// //             return (
// //               <div 
// //                 key={message.id} 
// //                 className="flex items-start gap-3 max-w-[80%] ml-auto justify-end"
// //               >
// //                 <div className="flex flex-col gap-1 items-end">
// //                   <div
// //                     className="px-4 py-3 rounded-2xl text-md shadow-sm break-words whitespace-pre-wrap 
// //                     leading-relaxed rounded-tr-none bg-primary/10 text-foreground border"
// //                   >
// //                     {message.content}
// //                   </div>

// //                   <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
// //                     {format(parseISO(message.createdAt), "HH:mm")}
// //                     <span>•</span>
// //                     <span className="font-medium">You</span>
// //                     {message.isOptimistic && (
// //                       <>
// //                         <span>•</span>
// //                         <Loader2 className="size-3 animate-spin" />
// //                       </>
// //                     )}
// //                   </div>
// //                 </div>

// //                 {/* Tutor avatar RIGHT */}
// //                 <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
// //                   {tutor?.avatar && tutor.avatar.trim() !== "" ? (
// //                     <AvatarImage src={tutor.avatar} alt={tutor.name || "You"} />
// //                   ) : null}
// //                   <AvatarFallback className="bg-primary/10 text-primary">
// //                     {tutor?.firstName?.charAt(0)?.toUpperCase() || "T"}
// //                   </AvatarFallback>
// //                 </Avatar>
// //               </div>
// //             );
// //           })
// //         )}

// //         {/* Typing indicator */}
// //         {isSomeoneTyping && (
// //           <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground italic">
// //             <div className="flex gap-1">
// //               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
// //               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
// //               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
// //             </div>
// //             Student is typing...
// //           </div>
// //         )}

// //         {/* New messages indicator */}
// //         {newMessagesCount > 0 && (
// //           <div className="sticky bottom-6 z-10 flex justify-center">
// //             <Button
// //               size="sm"
// //               className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-5 py-2 flex items-center gap-2"
// //               onClick={() => {
// //                 setAutoScrollEnabled(true);
// //                 messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //                 setNewMessagesCount(0);
// //               }}
// //             >
// //               <ArrowDown className="size-4" />
// //               {newMessagesCount} new message{newMessagesCount !== 1 ? "s" : ""}
// //             </Button>
// //           </div>
// //         )}

// //         {/* Reschedule & status banners */}
// //         {bookingStatus === "reschedule-proposed" && proposedAt && (
// //           <div className="text-center py-6">
// //             <div className="inline-flex flex-col gap-4 px-8 py-6 bg-purple-50 text-purple-900 rounded-2xl border-2 border-purple-300 shadow-lg max-w-md mx-auto">
// //               <div className="flex items-center gap-3 justify-center">
// //                 <Clock className="size-6 text-purple-600" />
// //                 <p className="font-semibold text-base">Reschedule Proposed</p>
// //               </div>

// //               <div className="bg-white/80 px-4 py-3 rounded-lg border border-purple-200">
// //                 <p className="text-sm text-purple-700 mb-1 font-medium">New proposed time:</p>
// //                 <p className="text-base font-bold text-purple-900">
// //                   {format(parseISO(proposedAt), "EEEE, MMMM dd, yyyy")}
// //                 </p>
// //                 <p className="text-lg font-bold text-purple-900">
// //                   {format(parseISO(proposedAt), "hh:mm a")}
// //                 </p>
// //               </div>

// //               <p className="text-sm text-purple-700">
// //                 Waiting for student to confirm the new schedule
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         {bookingStatus === "completed" && (
// //           <div className="text-center py-8">
// //             <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200 shadow-sm mx-auto">
// //               <CheckCircle className="size-6" />
// //               <p className="font-medium text-base">This session has been completed</p>
// //             </div>
// //           </div>
// //         )}

// //         {bookingStatus === "cancelled" && (
// //           <div className="text-center py-8">
// //             <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm mx-auto">
// //               <XCircle className="size-6" />
// //               <p className="font-medium text-base">This booking has been cancelled</p>
// //             </div>
// //           </div>
// //         )}

// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Confirm / Reject Dialog */}
// //       <AlertDialog
// //         open={!!selectedMessage}
// //         onOpenChange={(open) => !open && setSelectedMessage(null)}
// //       >
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>
// //               {actionType === "confirm" ? "Confirm this message?" : "Reject this message?"}
// //             </AlertDialogTitle>
// //             <AlertDialogDescription>
// //               {actionType === "confirm"
// //                 ? "Confirming this message will allow the session to proceed."
// //                 : "Rejecting this message will cancel the request."}
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>

// //           {selectedMessage && (
// //             <div className="py-4">
// //               <div className="p-4 bg-muted/50 rounded-lg border">
// //                 <p className="text-sm leading-relaxed">{selectedMessage.content}</p>
// //                 <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
// //                   <User className="size-3.5" />
// //                   <span>{selectedMessage.sender?.name || "Student"}</span>
// //                   <span>•</span>
// //                   <span>{format(parseISO(selectedMessage.createdAt), "PPp")}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           <AlertDialogFooter>
// //             <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>

// //             {actionType === "confirm" ? (
// //               <AlertDialogAction
// //                 onClick={handleConfirm}
// //                 className="bg-green-600 hover:bg-green-700"
// //                 disabled={isProcessing}
// //               >
// //                 {isProcessing ? (
// //                   <>
// //                     <Loader2 className="size-4 mr-2 animate-spin" />
// //                     Confirming...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <CheckCircle className="size-4 mr-2" />
// //                     Confirm
// //                   </>
// //                 )}
// //               </AlertDialogAction>
// //             ) : (
// //               <AlertDialogAction
// //                 onClick={handleReject}
// //                 className="bg-red-600 hover:bg-red-700"
// //                 disabled={isProcessing}
// //               >
// //                 {isProcessing ? (
// //                   <>
// //                     <Loader2 className="size-4 mr-2 animate-spin" />
// //                     Rejecting...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <XCircle className="size-4 mr-2" />
// //                     Reject
// //                   </>
// //                 )}
// //               </AlertDialogAction>
// //             )}
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </>
// //   );
// // }








// // Fixed ChatMessages.jsx - with corrected sender detection + instant UI updates

// import { useEffect, useRef, useState, useCallback } from "react";
// import { format, parseISO } from "date-fns";
// import {
//   Loader2,
//   User,
//   CheckCircle,
//   XCircle,
//   MessageSquare,
//   Clock,
//   ArrowDown,
// } from "lucide-react";
// import useTutorAuthStore from "@/store/tutorAuthStore";
// import { useTutorChatStore } from "@/store/tutorChatStore";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";

// export default function ChatMessages({
//   messages = [],
//   isLoading = false,
//   bookingStatus,
//   proposedAt,
//   onConfirmMessage,
//   onRejectMessage,
//   onAcceptReschedule,
//   onRejectReschedule,
// }) {
//   const { tutor } = useTutorAuthStore();
//   const { isSomeoneTyping } = useTutorChatStore();

//   const containerRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const prevMessagesLengthRef = useRef(0);
//   const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
//   const [newMessagesCount, setNewMessagesCount] = useState(0);

//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [actionType, setActionType] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);


  
//   // Check if user is near bottom (within 150px)
//   const isNearBottom = useCallback(() => {
//     if (!containerRef.current) return true;
//     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//     return scrollHeight - scrollTop - clientHeight < 150;
//   }, []);

//   // Handle manual scroll → re-enable auto-scroll when user reaches bottom
//   const handleScroll = useCallback(() => {
//     if (isNearBottom()) {
//       setAutoScrollEnabled(true);
//       setNewMessagesCount(0);
//     } else {
//       setAutoScrollEnabled(false);
//     }
//   }, [isNearBottom]);

//   // Auto-scroll + new message counter logic
//   useEffect(() => {
//     const currentLength = messages.length;
//     const previousLength = prevMessagesLengthRef.current;
//     prevMessagesLengthRef.current = currentLength;

//     if (currentLength > previousLength) {
//       // New messages arrived
//       if (isNearBottom() || autoScrollEnabled) {
//         // User is already at bottom → scroll smoothly
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         setNewMessagesCount(0);
//       } else {
//         // User is scrolled up → show "new messages" button
//         setNewMessagesCount(currentLength - previousLength);
//       }
//     } else if (currentLength < previousLength) {
//       // Messages removed/cleared → scroll to top instantly
//       setAutoScrollEnabled(true);
//       setNewMessagesCount(0);
//       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
//     }
//   }, [messages, isNearBottom, autoScrollEnabled]);

//   // Initial scroll to bottom on mount or when messages first load
//   useEffect(() => {
//     if (messages.length > 0) {
//       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
//     }
//   }, [messages.length > 0]); // only when messages appear for first time

//   const openActionDialog = (message, type) => {
//     setSelectedMessage(message);
//     setActionType(type);
//   };

//   const handleConfirm = async () => {
//     if (!selectedMessage) return;
//     setIsProcessing(true);
//     try {
//       await onConfirmMessage?.(selectedMessage.id);
//       setSelectedMessage(null);
//     } catch (err) {
//       console.error("Failed to confirm:", err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedMessage) return;
//     setIsProcessing(true);
//     try {
//       await onRejectMessage?.(selectedMessage.id);
//       setSelectedMessage(null);
//     } catch (err) {
//       console.error("Failed to reject:", err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (isLoading && messages.length === 0) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <Loader2 className="size-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div
//         ref={containerRef}
//         className="flex-1 overflow-y-auto p-4 space-y-5 bg-background relative"
//         onScroll={handleScroll}
//       >
//         {messages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center py-12">
//             <MessageSquare className="size-16 text-muted-foreground/30 mb-4" />
//             <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               Start the conversation by sending a message
//             </p>
//           </div>
//         ) : (
//           messages.map((message) => {
//             // Correct sender detection
//             const isTutor = message.sender?.id === tutor?.id;
//             const isSystem = message.senderRole === "system" || message.isSystem;
//             const isPending = message.status === "pending";
//             const isRejected = message.status === "rejected";
//             const isConfirmed = message.status === "confirmed";

//             // Unique key – critical for instant UI updates
//             const messageKey =
//               message.id ||
//               message.tempId ||
//               `${message.sender?.id || "system"}-${message.createdAt || Date.now()}`;

//             if (isSystem) {
//               return (
//                 <div key={messageKey} className="flex justify-center">
//                   <div className="max-w-[70%] px-5 py-3 bg-gray-100/70 text-gray-700 rounded-xl text-sm text-center shadow-sm">
//                     {message.content}
//                     <div className="text-xs text-gray-500 mt-1">
//                       {format(parseISO(message.createdAt), "HH:mm")}
//                     </div>
//                   </div>
//                 </div>
//               );
//             }

//             // STUDENT MESSAGE – LEFT SIDE
//             if (!isTutor) {
//               return (
//                 <div
//                   key={messageKey}
//                   className="flex items-start gap-3 max-w-[80%] justify-start"
//                 >
//                   {/* Student avatar LEFT */}
//                   <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
//                     {message.sender?.avatar && message.sender.avatar.trim() !== "" ? (
//                       <AvatarImage
//                         src={message.sender.avatar}
//                         alt={message.sender.name || "Student"}
//                       />
//                     ) : null}
//                     <AvatarFallback className="text-muted font-bold bg-primary/80">
//                       {message.sender?.name?.charAt(0)?.toUpperCase() || "S"}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className="flex flex-col gap-1">
//                     <div
//                       className={cn(
//                         "px-4 py-3 rounded-2xl text-sm shadow-sm break-words whitespace-pre-wrap leading-relaxed rounded-tl-none",
//                         isRejected
//                           ? "bg-red-50 text-red-900 border border-red-200"
//                           : isPending
//                           ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
//                           : "bg-muted text-foreground"
//                       )}
//                     >
//                       {message.content}

//                       <div className="mt-2 flex items-center gap-2">
//                         {isPending && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending Review</Badge>}
//                         {isConfirmed && <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>}
//                         {isRejected && <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>}
//                       </div>
//                     </div>

//                     <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
//                       {format(parseISO(message.createdAt), "HH:mm")}
//                       <span>•</span>
//                       <span className="font-medium">{message.sender?.name || "Student"}</span>
//                     </div>

//                     {isPending && (
//                       <div className="flex gap-2 mt-3">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50"
//                           onClick={() => openActionDialog(message, "confirm")}
//                         >
//                           <CheckCircle className="size-3.5 mr-1.5" /> Confirm
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
//                           onClick={() => openActionDialog(message, "reject")}
//                         >
//                           <XCircle className="size-3.5 mr-1.5" /> Reject
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             }

//             // TUTOR MESSAGE – RIGHT SIDE
//             return (
//               <div
//                 key={messageKey}
//                 className="flex items-start gap-3 max-w-[80%] ml-auto justify-end"
//               >
//                 <div className="flex flex-col gap-1 items-end">
//                   <div
//                     className="px-4 py-3 rounded-2xl text-md shadow-sm break-words whitespace-pre-wrap 
//                     leading-relaxed rounded-tr-none bg-primary/10 text-foreground border"
//                   >
//                     {message.content}
//                   </div>

//                   <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
//                     {format(parseISO(message.createdAt), "HH:mm")}
//                     <span>•</span>
//                     <span className="font-medium">You</span>
//                     {message.isOptimistic && (
//                       <>
//                         <span>•</span>
//                         <Loader2 className="size-3 animate-spin" />
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Tutor avatar RIGHT */}
//                 <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
//                   {tutor?.avatar && tutor.avatar.trim() !== "" ? (
//                     <AvatarImage src={tutor.avatar} alt={tutor.name || "You"} />
//                   ) : null}
//                   <AvatarFallback className="bg-primary/10 text-primary">
//                     {tutor?.firstName?.charAt(0)?.toUpperCase() || "T"}
//                   </AvatarFallback>
//                 </Avatar>
//               </div>
//             );
//           })
//         )}

//         {/* Typing indicator */}
//         {isSomeoneTyping && (
//           <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground italic">
//             <div className="flex gap-1">
//               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
//               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
//               <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
//             </div>
//             Student is typing...
//           </div>
//         )}

//         {/* "New messages" button when user is scrolled up */}
//         {newMessagesCount > 0 && (
//           <div className="sticky bottom-6 z-10 flex justify-center">
//             <Button
//               size="sm"
//               className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-5 py-2 flex items-center gap-2"
//               onClick={() => {
//                 setAutoScrollEnabled(true);
//                 messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//                 setNewMessagesCount(0);
//               }}
//             >
//               <ArrowDown className="size-4" />
//               {newMessagesCount} new message{newMessagesCount !== 1 ? "s" : ""}
//             </Button>
//           </div>
//         )}

//         {/* Status banners */}
//         {bookingStatus === "reschedule-proposed" && proposedAt && (
//           <div className="text-center py-6">
//             <div className="inline-flex flex-col gap-4 px-8 py-6 bg-purple-50 text-purple-900 rounded-2xl border-2 border-purple-300 shadow-lg max-w-md mx-auto">
//               <div className="flex items-center gap-3 justify-center">
//                 <Clock className="size-6 text-purple-600" />
//                 <p className="font-semibold text-base">Reschedule Proposed</p>
//               </div>

//               <div className="bg-white/80 px-4 py-3 rounded-lg border border-purple-200">
//                 <p className="text-sm text-purple-700 mb-1 font-medium">New proposed time:</p>
//                 <p className="text-base font-bold text-purple-900">
//                   {format(parseISO(proposedAt), "EEEE, MMMM dd, yyyy")}
//                 </p>
//                 <p className="text-lg font-bold text-purple-900">
//                   {format(parseISO(proposedAt), "hh:mm a")}
//                 </p>
//               </div>

//               <p className="text-sm text-purple-700">
//                 Waiting for student to confirm the new schedule
//               </p>
//             </div>
//           </div>
//         )}

//         {bookingStatus === "completed" && (
//           <div className="text-center py-8">
//             <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200 shadow-sm mx-auto">
//               <CheckCircle className="size-6" />
//               <p className="font-medium text-base">This session has been completed</p>
//             </div>
//           </div>
//         )}

//         {bookingStatus === "cancelled" && (
//           <div className="text-center py-8">
//             <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm mx-auto">
//               <XCircle className="size-6" />
//               <p className="font-medium text-base">This booking has been cancelled</p>
//             </div>
//           </div>
//         )}

//         {/* Invisible anchor for auto-scroll */}
//         <div ref={messagesEndRef} className="h-1" />
//       </div>

//       {/* Confirm / Reject Dialog */}
//       <AlertDialog
//         open={!!selectedMessage}
//         onOpenChange={(open) => !open && setSelectedMessage(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {actionType === "confirm" ? "Confirm this message?" : "Reject this message?"}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {actionType === "confirm"
//                 ? "Confirming this message will allow the session to proceed."
//                 : "Rejecting this message will cancel the request."}
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           {selectedMessage && (
//             <div className="py-4">
//               <div className="p-4 bg-muted/50 rounded-lg border">
//                 <p className="text-sm leading-relaxed">{selectedMessage.content}</p>
//                 <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
//                   <User className="size-3.5" />
//                   <span>{selectedMessage.sender?.name || "Student"}</span>
//                   <span>•</span>
//                   <span>{format(parseISO(selectedMessage.createdAt), "PPp")}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>

//             {actionType === "confirm" ? (
//               <AlertDialogAction
//                 onClick={handleConfirm}
//                 className="bg-green-600 hover:bg-green-700"
//                 disabled={isProcessing}
//               >
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="size-4 mr-2 animate-spin" />
//                     Confirming...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="size-4 mr-2" />
//                     Confirm
//                   </>
//                 )}
//               </AlertDialogAction>
//             ) : (
//               <AlertDialogAction
//                 onClick={handleReject}
//                 className="bg-red-600 hover:bg-red-700"
//                 disabled={isProcessing}
//               >
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="size-4 mr-2 animate-spin" />
//                     Rejecting...
//                   </>
//                 ) : (
//                   <>
//                     <XCircle className="size-4 mr-2" />
//                     Reject
//                   </>
//                 )}
//               </AlertDialogAction>
//             )}
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }








import { useEffect, useRef, useState, useCallback } from "react";
import { format, parseISO } from "date-fns";
import {
  Loader2,
  User,
  CheckCircle,
  Check,
  CheckCheck,
  XCircle,
  MessageSquare,
  Clock,
  ArrowDown,
} from "lucide-react";
import useTutorAuthStore from "@/store/tutorAuthStore";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChatMessages({
  messages = [],
  isLoading = false,
  bookingStatus,
  proposedAt,
  onConfirmMessage,
  onRejectMessage,
}) {
  const { tutor } = useTutorAuthStore();
  const { isSomeoneTyping } = useTutorChatStore();

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 150;
  }, []);

  const handleScroll = useCallback(() => {
    if (isNearBottom()) {
      setAutoScrollEnabled(true);
      setNewMessagesCount(0);
    } else {
      setAutoScrollEnabled(false);
    }
  }, [isNearBottom]);

  // Auto-scroll logic
  useEffect(() => {
    const currentLength = messages.length;
    const previousLength = prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = currentLength;

    if (currentLength > previousLength) {
      if (isNearBottom() || autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setNewMessagesCount(0);
      } else {
        setNewMessagesCount(currentLength - previousLength);
      }
    } else if (currentLength < previousLength) {
      setAutoScrollEnabled(true);
      setNewMessagesCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, isNearBottom, autoScrollEnabled]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.length]);

  const openActionDialog = (message, type) => {
    setSelectedMessage(message);
    setActionType(type);
  };

  const handleConfirm = async () => {
    if (!selectedMessage) return;
    setIsProcessing(true);
    try {
      await onConfirmMessage?.(selectedMessage.id);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to confirm:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedMessage) return;
    setIsProcessing(true);
    try {
      await onRejectMessage?.(selectedMessage.id);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to reject:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 bg-background relative"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageSquare className="size-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No messages yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isTutor = message.sender?.id === tutor?.id;
            const isSystem = message.senderRole === "system" || message.isSystem;
            const isPending = message.status === "pending";
            const isRejected = message.status === "rejected";
            const isConfirmed = message.status === "confirmed";

            const messageKey =
              message.id ||
              message.tempId ||
              `${message.sender?.id || "system"}-${message.createdAt || Date.now()}`;

            if (isSystem) {
              return (
                <div key={messageKey} className="flex justify-center">
                  <div className="max-w-[70%] px-5 py-3 bg-gray-100/70 text-gray-700 rounded-xl text-sm text-center shadow-sm">
                    {message.content}
                    <div className="text-xs text-gray-500 mt-1">
                      {format(parseISO(message.createdAt), "HH:mm")}
                    </div>
                  </div>
                </div>
              );
            }

            // ─── Student Message ─────────────
            if (!isTutor) {
              return (
                <div
                  key={messageKey}
                  className="flex items-start gap-3 max-w-[80%] justify-start"
                >
                  <div className="relative flex-shrink-0 mt-1">
                    <Avatar className="h-10 w-10">
                      {message.sender?.avatar?.trim() ? (
                        <AvatarImage
                          src={message.sender.avatar}
                          alt={message.sender.name || "Student"}
                        />
                      ) : (
                        <AvatarFallback className="text-muted font-bold bg-primary/80">
                          {message.sender?.name?.charAt(0)?.toUpperCase() || "S"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {message.sender?.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl text-sm shadow-sm break-words whitespace-pre-wrap leading-relaxed rounded-tl-none",
                        isRejected
                          ? "bg-red-50 text-red-900 border border-red-200"
                          : isPending
                          ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {message.content}

                      <div className="mt-2 flex items-center gap-2">
                        {isPending && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Pending Review
                          </Badge>
                        )}
                        {isConfirmed && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Confirmed
                          </Badge>
                        )}
                        {isRejected && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
                      {format(parseISO(message.createdAt), "HH:mm")}
                      <span>•</span>
                      <span className="font-medium">{message.sender?.name || "Student"}</span>
                    </div>

                    {isPending && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => openActionDialog(message, "confirm")}
                        >
                          <CheckCircle className="size-3.5 mr-1.5" /> Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => openActionDialog(message, "reject")}
                        >
                          <XCircle className="size-3.5 mr-1.5" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // ─── Tutor Message ─────────────
            return (
              <div
                key={messageKey}
                className="flex items-start gap-3 max-w-[80%] ml-auto justify-end"
              >
                <div className="flex flex-col gap-1 items-end">
                  <div
                    className="px-4 py-3 rounded-2xl text-md shadow-sm break-words whitespace-pre-wrap 
                    leading-relaxed rounded-tr-none bg-primary/10 text-foreground border"
                  >
                    {message.content}
                  </div>

                  <div className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
                    {format(parseISO(message.createdAt), "HH:mm")}
                    <span>•</span>
                    <span className="font-medium">You</span>
                    <span>•</span>
                    {message.isOptimistic || message.status === "sending" ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : message.isRead ? (
                      <CheckCheck className="size-3.5 text-sky-500" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                  </div>
                </div>

                <div className="relative flex-shrink-0 mt-1">
                  <Avatar className="h-10 w-10">
                    {tutor?.avatar?.trim() ? (
                      <AvatarImage src={tutor.avatar} alt={tutor.name || "You"} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {tutor?.firstName?.charAt(0)?.toUpperCase() || "T"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {tutor?.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isSomeoneTyping && (
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground italic">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
            </div>
            Student is typing...
          </div>
        )}

        {/* "New messages" button */}
        {newMessagesCount > 0 && (
          <div className="sticky bottom-6 z-10 flex justify-center">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-5 py-2 flex items-center gap-2"
              onClick={() => {
                setAutoScrollEnabled(true);
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                setNewMessagesCount(0);
              }}
            >
              <ArrowDown className="size-4" />
              {newMessagesCount} new message{newMessagesCount !== 1 ? "s" : ""}
            </Button>
          </div>
        )}

        {/* Booking status banners */}
        {bookingStatus === "reschedule-proposed" && proposedAt && (
          <div className="text-center py-6">
            <div className="inline-flex flex-col gap-4 px-8 py-6 bg-purple-50 text-purple-900 rounded-2xl border-2 border-purple-300 shadow-lg max-w-md mx-auto">
              <div className="flex items-center gap-3 justify-center">
                <Clock className="size-6 text-purple-600" />
                <p className="font-semibold text-base">Reschedule Proposed</p>
              </div>
              <div className="bg-white/80 px-4 py-3 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 mb-1 font-medium">
                  New proposed time:
                </p>
                <p className="text-base font-bold text-purple-900">
                  {format(parseISO(proposedAt), "EEEE, MMMM dd, yyyy")}
                </p>
                <p className="text-lg font-bold text-purple-900">
                  {format(parseISO(proposedAt), "hh:mm a")}
                </p>
              </div>
              <p className="text-sm text-purple-700">
                Waiting for student to confirm the new schedule
              </p>
            </div>
          </div>
        )}

        {bookingStatus === "completed" && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200 shadow-sm mx-auto">
              <CheckCircle className="size-6" />
              <p className="font-medium text-base">This session has been completed</p>
            </div>
          </div>
        )}

        {bookingStatus === "cancelled" && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm mx-auto">
              <XCircle className="size-6" />
              <p className="font-medium text-base">This booking has been cancelled</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Confirm / Reject Dialog */}
      <AlertDialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "confirm" ? "Confirm this message?" : "Reject this message?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "confirm"
                ? "Confirming this message will allow the session to proceed."
                : "Rejecting this message will cancel the request."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedMessage && (
            <div className="py-4">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm leading-relaxed">{selectedMessage.content}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <User className="size-3.5" />
                  <span>{selectedMessage.sender?.name || "Student"}</span>
                  <span>•</span>
                  <span>{format(parseISO(selectedMessage.createdAt), "PPp")}</span>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>

            {actionType === "confirm" ? (
              <AlertDialogAction
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4 mr-2" />
                    Confirm
                  </>
                )}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="size-4 mr-2" />
                    Reject
                  </>
                )}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
