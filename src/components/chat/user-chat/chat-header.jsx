



import { Phone, Video, MoreVertical, Info, Calendar, XCircle, CheckCircle, Trash2 } from "lucide-react";
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

const roleBadgeColors = {
  admin: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400",
  tutor: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  support: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function ChatHeader({ 
  onEndChat, 
  onViewDetails,
  onReschedule,
  onConfirmBooking, 
  onCancelBooking,
  onDeleteSession 
}) {
  const selectedBooking = useUserChatStore((state) => state.selectedBooking);

  if (!selectedBooking) return null;

  const isBooking = selectedBooking.isBooking;
  const status = selectedBooking.status;

  return (
    <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left: User Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {selectedBooking.participant_name?.charAt(0).toUpperCase() || "T"}
            </div>
            {status === "active" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Name and Role */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-slate-900">
                {selectedBooking.participant_name || "Tutor"}
              </h2>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold capitalize border shadow-sm",
                  roleBadgeColors[selectedBooking.participant_role] || "bg-slate-100 text-slate-700"
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions for Active Sessions */}
          {status === "active" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-100 transition-colors"
              >
                <Phone className="h-5 w-5 text-slate-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-100 transition-colors"
              >
                <Video className="h-5 w-5 text-slate-600" />
              </Button>
            </>
          )}

          {/* More Actions Menu */}
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
              {/* View Details (always available for bookings) */}
              {isBooking && (
                <>
                  <DropdownMenuItem onClick={() => onViewDetails(selectedBooking)}>
                    <Info className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Reschedule (pending or confirmed) */}
              {(status === "pending" || status === "confirmed") && (
                <DropdownMenuItem onClick={() => onReschedule(selectedBooking)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </DropdownMenuItem>
              )}

              {/* Confirm (tutor only - pending status) */}
              {status === "pending" && (
                <DropdownMenuItem onClick={() => onConfirmBooking(selectedBooking.id)}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-green-600">Confirm Booking</span>
                </DropdownMenuItem>
              )}

              {/* End Chat (active only) */}
              {status === "active" && (
                <DropdownMenuItem onClick={() => onEndChat(selectedBooking.id)}>
                  <XCircle className="h-4 w-4 mr-2 text-orange-600" />
                  <span className="text-orange-600">End Session</span>
                </DropdownMenuItem>
              )}

              {/* Cancel (pending or confirmed) */}
              {(status === "pending" || status === "confirmed") && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onCancelBooking(selectedBooking.id)}>
                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    <span className="text-red-600">Cancel Session</span>
                  </DropdownMenuItem>
                </>
              )}

              {/* Delete (completed or cancelled) */}
              {(status === "completed" || status === "cancelled") && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDeleteSession(selectedBooking.id)}>
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    <span className="text-red-600">Delete Session</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}