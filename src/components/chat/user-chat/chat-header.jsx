

import { useEffect } from "react";
import { Phone, Video, MoreVertical, Info, Calendar, XCircle, CheckCircle, Trash2, PlayCircle, StopCircle } from "lucide-react";
import { useUserChatStore } from "@/store/userChatStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ChatHeader({ 
  onStartChat,
  onEndChat, 
  onViewDetails,
  onReschedule,
  onConfirmBooking, 
  onCancelBooking,
  onDeleteSession 
}) {
  const selectedBooking = useUserChatStore(state => state.selectedBooking);
  const socketConnected = useUserChatStore(state => state.socketConnected);
  // Debug log in useEffect to prevent repeated logs on re-renders
  useEffect(() => {
    if (selectedBooking) {
      const isBooking = !!selectedBooking.isBooking;
      const status = (selectedBooking.status || "").toLowerCase().trim();
      console.log("[ChatHeader]", {
        id: selectedBooking.id,
        isBooking,
        status,
        name: selectedBooking.participant_name,
        canCancel: ["pending", "confirmed", "active"].includes(status)
      });
    }
  }, [selectedBooking]); // Only log when selectedBooking changes

  if (!selectedBooking) return null;


  
  const isBooking = !!selectedBooking.isBooking;
  const status = (selectedBooking.status || "").toLowerCase().trim();

  return (
    <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left side - avatar + name */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
              {selectedBooking.avatar ? (
                <img
                  src={selectedBooking.avatar}
                  alt={selectedBooking.participant_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                selectedBooking.participant_name?.charAt(0).toUpperCase() || "T"
              )}
            </div>
            {isBooking && (
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white",
                  status === "active" && "bg-emerald-500",
                  status === "pending" && "bg-amber-500",
                  status === "confirmed" && "bg-blue-500",
                  status === "completed" && "bg-slate-400",
                  status === "cancelled" && "bg-red-500"
                )}
              />
            )}
            
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-slate-900">
                {selectedBooking.participant_name || "Tutor"}
              </h2>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold capitalize border shadow-sm",
                  // role colors...
                )}
              >
                {selectedBooking.participant_role || "tutor"}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {isBooking ? (
                <>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs capitalize",
                      status === "active" && "bg-green-50 text-green-700 border-green-200",
                      status === "pending" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                      status === "confirmed" && "bg-blue-50 text-blue-700 border-blue-200",
                      status === "completed" && "bg-slate-50 text-slate-700 border-slate-200",
                      status === "cancelled" && "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {status}
                  </Badge>
                  {selectedBooking.scheduledAt && (
                    <span className="text-slate-500 text-xs">
                      {new Date(selectedBooking.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-500">Available for booking</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - actions */}
        <div className="flex items-center gap-2">
          {isBooking && status === "pending" && (
            <Button
              onClick={() => onConfirmBooking(selectedBooking.id)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Reshaduled
            </Button>
          )}

          {isBooking && status === "confirmed" && (
            <Button
              onClick={() => onStartChat(selectedBooking.id)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          )}

          {status === "active" && (
            <>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Phone className="h-5 w-5 text-slate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Video className="h-5 w-5 text-slate-600" />
              </Button>
              <Button
                onClick={() => onEndChat(selectedBooking.id)}
                variant="destructive"
                className="shadow-md"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </>
          )}

          {isBooking && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onViewDetails(selectedBooking)}>
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>

                {(status === "pending" || status === "confirmed") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onReschedule(selectedBooking)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                  </>
                )}

                {["pending", "confirmed", "active"].includes(status) ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onCancelBooking(selectedBooking.id)}
                      className="text-red-600 focus:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Session
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem disabled className="text-slate-400 italic">
                    Cannot cancel ({status || "no status"})
                  </DropdownMenuItem>
                )}

                {(status === "completed" || status === "cancelled") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteSession(selectedBooking.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Session
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}