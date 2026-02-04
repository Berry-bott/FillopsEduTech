// import { useEffect, useRef, useState } from "react";
// import { format, parseISO } from "date-fns";
// import { Loader2, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
// import useTutorAuthStore from "@/store/tutorAuthStore";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// export default function ChatMessages({ messages, isLoading, bookingStatus, onConfirmMessage, onRejectMessage }) {
//   const { tutor } = useTutorAuthStore();
//   const messagesEndRef = useRef(null);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [actionType, setActionType] = useState(null); // 'confirm' or 'reject'
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle message confirmation
//   const handleConfirm = async () => {
//     if (!selectedMessage) return;
    
//     setIsProcessing(true);
//     try {
//       await onConfirmMessage?.(selectedMessage.id);
//       console.log("✅ Message confirmed:", selectedMessage.id);
//       setSelectedMessage(null);
//     } catch (err) {
//       console.error("❌ Failed to confirm message:", err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle message rejection
//   const handleReject = async () => {
//     if (!selectedMessage) return;
    
//     setIsProcessing(true);
//     try {
//       await onRejectMessage?.(selectedMessage.id);
//       console.log("❌ Message rejected:", selectedMessage.id);
//       setSelectedMessage(null);
//     } catch (err) {
//       console.error("❌ Failed to reject message:", err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Open confirmation dialog
//   const openConfirmDialog = (message, type) => {
//     setSelectedMessage(message);
//     setActionType(type);
//   };

//   if (isLoading && messages.length === 0) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <Loader2 className="size-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-muted-foreground text-sm">No messages yet</p>
//           </div>
//         ) : (
//           messages.map((message) => {
//             const isOwnMessage = message.senderId === tutor?.id;
//             const isPending = message.status === "pending";
//             const isRejected = message.status === "rejected";
//             const isConfirmed = message.status === "confirmed";
            
//             return (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
//               >
//                 {/* Avatar */}
//                 <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
//                   {message.sender?.avatar ? (
//                     <img 
//                       src={message.sender.avatar} 
//                       alt={message.sender.name}
//                       className="size-8 rounded-full object-cover"
//                     />
//                   ) : (
//                     <User className="size-4 text-primary" />
//                   )}
//                 </div>

//                 {/* Message Content */}
//                 <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : "items-left"}`}>
//                   {/* Message Bubble */}
//                   <div
//                     className={`px-4 py-2 rounded-lg ${
//                       isOwnMessage
//                         ? "bg-primary text-white"
//                         : isRejected
//                         ? "bg-red-100 text-red-900 border border-red-200"
//                         : isPending
//                         ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
//                         : "bg-gray-100 text-gray-900"
//                     }`}
//                   >
//                     <p className="text-sm whitespace-pre-wrap break-words">
//                       {message.content}
//                     </p>
                    
//                     {/* Status Badge for Student Messages */}
//                     {!isOwnMessage && (
//                       <div className="flex items-center gap-2 mt-2">
//                         {isPending && (
//                           <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
//                             <AlertCircle className="size-3 mr-1" />
//                             Pending Review
//                           </Badge>
//                         )}
//                         {isConfirmed && (
//                           <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
//                             <CheckCircle className="size-3 mr-1" />
//                             Confirmed
//                           </Badge>
//                         )}
//                         {isRejected && (
//                           <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
//                             <XCircle className="size-3 mr-1" />
//                             Rejected
//                           </Badge>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Timestamp */}
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-xs text-muted-foreground">
//                       {format(parseISO(message.createdAt), "HH:mm")}
//                     </span>
//                     {!isOwnMessage && message.sender?.name && (
//                       <span className="text-xs text-muted-foreground">
//                         • {message.sender.name}
//                       </span>
//                     )}
//                   </div>

//                   {/* Action Buttons for Pending Student Messages */}
//                   {!isOwnMessage && isPending && (
//                     <div className="flex gap-2 mt-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="h-7 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
//                         onClick={() => openConfirmDialog(message, 'confirm')}
//                       >
//                         <CheckCircle className="size-3 mr-1" />
//                         Confirm
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="h-7 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
//                         onClick={() => openConfirmDialog(message, 'reject')}
//                       >
//                         <XCircle className="size-3 mr-1" />
//                         Reject
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
        
//         {/* Session Status Messages */}
//         {bookingStatus === "completed" && (
//           <div className="text-center py-4">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
//               <CheckCircle className="size-4" />
//               <p className="text-sm font-medium">This session has been completed</p>
//             </div>
//           </div>
//         )}
        
//         {bookingStatus === "cancelled" && (
//           <div className="text-center py-4">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
//               <XCircle className="size-4" />
//               <p className="text-sm font-medium">This booking has been cancelled</p>
//             </div>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Confirmation Dialog */}
//       <AlertDialog 
//         open={!!selectedMessage} 
//         onOpenChange={(open) => !open && setSelectedMessage(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {actionType === 'confirm' ? 'Confirm Message' : 'Reject Message'}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {actionType === 'confirm' 
//                 ? 'Are you sure you want to confirm this message from the student?' 
//                 : 'Are you sure you want to reject this message from the student?'}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
          
//           {selectedMessage && (
//             <div className="py-4">
//               <div className="p-3 bg-gray-50 rounded-lg border">
//                 <p className="text-sm text-gray-700">{selectedMessage.content}</p>
//                 <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
//                   <User className="size-3" />
//                   <span>{selectedMessage.sender?.name || 'Student'}</span>
//                   <span>•</span>
//                   <span>{format(parseISO(selectedMessage.createdAt), "PPp")}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setSelectedMessage(null)}>
//               Cancel
//             </AlertDialogCancel>
            
//             {actionType === 'confirm' ? (
//               <AlertDialogAction 
//                 onClick={handleConfirm}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="size-4 mr-2 animate-spin" />
//                     Confirming...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="size-4 mr-2" />
//                     Confirm Message
//                   </>
//                 )}
//               </AlertDialogAction>
//             ) : (
//               <AlertDialogAction 
//                 onClick={handleReject}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="size-4 mr-2 animate-spin" />
//                     Rejecting...
//                   </>
//                 ) : (
//                   <>
//                     <XCircle className="size-4 mr-2" />
//                     Reject Message
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











import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { Loader2, User, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import useTutorAuthStore from "@/store/tutorAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ChatMessages({
  messages,
  isLoading,
  bookingStatus,
  onConfirmMessage,
  onRejectMessage,
}) {
  const { tutor } = useTutorAuthStore();
  const messagesEndRef = useRef(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionType, setActionType] = useState(null); // 'confirm' or 'reject'
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConfirm = async () => {
    if (!selectedMessage) return;
    setIsProcessing(true);
    try {
      await onConfirmMessage?.(selectedMessage.id);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to confirm message:", err);
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
      console.error("Failed to reject message:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const openConfirmDialog = (message, type) => {
    setSelectedMessage(message);
    setActionType(type);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageSquare className="size-14 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isTutorMessage = message.senderId === tutor?.id;
            const isPending = message.status === "pending";
            const isRejected = message.status === "rejected";
            const isConfirmed = message.status === "confirmed";

            return (
              <div
                key={message.id}
                className={`flex gap- border-4 ${isTutorMessage ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  {message.sender?.avatar ? (
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name || "User"}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <User className="size-5 text-primary" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    isTutorMessage ? "items-start" : "items-en"
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm ${
                      isTutorMessage
                        ? "bg-gray-100 text-gray-900 rounded-tl-none"
                        : isRejected
                        ? "bg-red-50 text-red-900 border border-red-200 rounded-tr-none"
                        : isPending
                        ? "bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-tr-none"
                        : "bg-primary text-white rounded-tr-none"
                    }`}
                  >
                    {message.content}

                    {/* Status badge - only for student messages */}
                    {!isTutorMessage && (
                      <div className="flex items-center gap-2 mt-2">
                        {isPending && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs"
                          >
                            <AlertCircle className="size-3 mr-1" />
                            Pending Review
                          </Badge>
                        )}
                        {isConfirmed && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-300 text-xs"
                          >
                            <CheckCircle className="size-3 mr-1" />
                            Confirmed
                          </Badge>
                        )}
                        {isRejected && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-300 text-xs"
                          >
                            <XCircle className="size-3 mr-1" />
                            Rejected
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timestamp + Sender name */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{format(parseISO(message.createdAt), "HH:mm")}</span>

                    {isTutorMessage ? (
                      <span>• You</span>
                    ) : (
                      message.sender?.name && <span>• {message.sender.name}</span>
                    )}
                  </div>

                  {/* Action buttons - only for pending student messages */}
                  {!isTutorMessage && isPending && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        onClick={() => openConfirmDialog(message, "confirm")}
                      >
                        <CheckCircle className="size-3.5 mr-1.5" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        onClick={() => openConfirmDialog(message, "reject")}
                      >
                        <XCircle className="size-3.5 mr-1.5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Session status banners */}
        {bookingStatus === "completed" && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <CheckCircle className="size-5" />
              <p className="font-medium">This session has been completed</p>
            </div>
          </div>
        )}

        {bookingStatus === "cancelled" && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-red-50 text-red-700 rounded-xl border border-red-200">
              <XCircle className="size-5"/>
              <p className="font-medium">This booking has been cancelled</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Confirmation/Rejection Dialog */}
      <AlertDialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "confirm" ? "Confirm Message" : "Reject Message"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "confirm"
                ? "Are you sure you want to confirm this message from the student?"
                : "Are you sure you want to reject this message from the student?"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedMessage && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedMessage.content}
                </p>
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
            <AlertDialogCancel onClick={() => setSelectedMessage(null)}>
              Cancel
            </AlertDialogCancel>

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
                    Confirm Message
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
                    Reject Message
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