// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Loader2 } from "lucide-react";

// export default function ChatInput({ onSend, isSending, disabled }) {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (!message.trim() || isSending || disabled) return;
    
//     onSend(message.trim());
//     setMessage("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="p-4 border-t">
//       {disabled ? (
//         <div className="text-center py-4">
//           <p className="text-sm text-muted-foreground">
//             Cannot send messages - booking is {disabled ? "completed or cancelled" : "inactive"}
//           </p>
//         </div>
//       ) : (
//         <div className="flex gap-2">
//           <Textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message... (Shift + Enter for new line)"
//             className="flex-1 min-h-[60px] max-h-[120px] resize-none"
//             disabled={isSending}
//           />
//           <Button
//             onClick={handleSend}
//             disabled={!message.trim() || isSending}
//             className="self-end"
//           >
//             {isSending ? (
//               <Loader2 className="size-4 animate-spin" />
//             ) : (
//               <Send className="size-4" />
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }





// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Loader2, Ban } from "lucide-react";

// export default function ChatInput({ onSend, isSending, disabled }) {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (!message.trim() || isSending || disabled) return;
    
//     onSend(message.trim());
//     setMessage("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };
//   const handleChange = (e) => {
//       setMessage(e.target.value);

//       // Emit typing event (debounced would be better, but simple version first)
//       if (socket?.connected && selectedBookingId) {
//         socket.emit("typing", { bookingId: selectedBookingId });
//       }
//     };

//     useEffect(() => {
//   if (!message.trim() || !socket?.connected || !selectedBookingId) return;

//   socket.emit("typing", { bookingId: selectedBookingId });

// }, [message]); 
  

//   return (
//     <div className="pt-1 border-t bg-background ">
//       {disabled ? (
//         <div className="text-center  px-4">
//           <div className="inline-flex items-center gap-3 px-6 py-4 bg-muted/50 rounded-lg border">
//             <Ban className="size-5 text-muted-foreground" />
//             <p className="text-sm text-muted-foreground font-medium">
//               Messaging is disabled for this booking
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="flex gap-3 items-end">
//           <div className="flex-1">
//             <Textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Type your message... (Shift + Enter for new line)"
//               className="min-h-[20px] max-h-[140px] resize-none text-[11.5px]"
//               disabled={isSending}
//               rows={2}
//             />
         
//           </div>
          
//           <Button
//             onClick={handleSend}
//             disabled={!message.trim() || isSending}
//             className="h-[30px] px-3 mb-2"
//             size="lg"
//           >
//             {isSending ? (
//               <>
//                 <Loader2 className="size-3 animate-spin" />
//                 Sending...
//               </>
//             ) : (
//               <>
//                 <Send className="size-3 " />
//               </>
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Ban } from "lucide-react";
import { getSocket } from "@/lib/tutor-socket";           // your socket helper
import { useTutorChatStore } from "@/store/tutorChatStore";

export default function ChatInput({
  onSend,
  isSending,
  disabled,
  selectedBookingId,
}) {
  const [message, setMessage] = useState("");
  const { socketConnected } = useTutorChatStore();

  const socket = getSocket();

  // Debounced typing emitter – only sends every 400ms while typing
  const emitTyping = useMemo(
    () =>
      debounce(() => {
        if (socket?.connected && selectedBookingId && message.trim()) {
          socket.emit("typing", { bookingId: selectedBookingId });
        }
      }, 400),
    [socket, selectedBookingId, message]
  );

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    console.log("ChatInput → calling sendMessage with:", input.trim());
    onSend(input.trim());
    setInput("");
  };

  // Trigger typing when message changes
  useEffect(() => {
    if (message.trim()) {
      emitTyping();
    }

    // Cleanup debounce on unmount or when message clears
    return () => {
      emitTyping.cancel();
    };
  }, [message, emitTyping]);

  const handleSend = () => {
    if (!message.trim() || isSending || disabled) return;

    onSend(message.trim());
    setMessage("");
    emitTyping.cancel(); // stop typing signal after send
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pt-1 border-t bg-background">
      {disabled ? (
        <div className="text-center px-4">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-muted/50 rounded-lg border">
            <Ban className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">
              Messaging is disabled for this booking
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="min-h-[20px] max-h-[140px] resize-none text-[11.5px] focus-visible:ring-primary"
              disabled={isSending || disabled}
              rows={2}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending || disabled}
            className="h-[38px] px-4 mb-1.5"
            size="default"
          >
            {isSending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}