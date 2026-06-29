import { useEffect, useState } from "react";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { getSocket } from "@/lib/tutorChatSocket";
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
  Circle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import BookingActions from "./BookingActions";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { BookingStatusBadge } from "./BookingStatusBadge";
import SessionExtendBanner from "./SessionExtendBanner";

// Booking statuses that allow the tutor to type and send messages
const CHAT_ENABLED_STATUSES = [
  "pending",
  "confirmed",
  "active",
  "rescheduled",
  "reschedule-proposed",
];

const FILTERS = ["all", "active", "pending", "rescheduled", "completed", "cancelled"];


export default function TutorChat() {
  const {
    bookingsByFilter,
    selectedBooking,
    messages,
    isLoadingMessages,
    isSending,
    isSomeoneTyping,
    typingUserName,
    socketConnected,
    fetchBookings,
    setSelectedBooking,
    sendMessage,
    confirmMessage,
    rejectMessage,
    confirmBooking,
    setActiveFilter,
    getCurrentBookings,
    initializeSocket,
  disconnectSocket,
  initializeListeners,
  } = useTutorChatStore();

  const [activeFilter, setLocalActiveFilter]   = useState("all");
  const [mobileSheetOpen, setMobileSheetOpen]  = useState(false);
  const [showToast, setShowToast]              = useState(false);
  const [showReconnectOverlay, setShowReconnectOverlay] = useState(false);

  useEffect(() => {
  initializeSocket();
  const cleanup = initializeListeners();
  return () => { cleanup?.(); disconnectSocket(); };
}, []);

  // ── Load all filters on mount ─────────────────────────────────
  useEffect(() => {
    FILTERS.forEach((f) => fetchBookings(f, false));
  }, [fetchBookings]);

  // ── Request online users whenever socket connects ──────────────
  useEffect(() => {
    if (socketConnected) {
      getSocket()?.emit("getOnlineUsers");
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(t);
    }
  }, [socketConnected]);

  // ── Reconnect overlay after 3 s without connection ────────────
  useEffect(() => {
    let t;
    if (!socketConnected) {
      t = setTimeout(() => setShowReconnectOverlay(true), 3000);
    } else {
      setShowReconnectOverlay(false);
    }
    return () => clearTimeout(t);
  }, [socketConnected]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleFilterChange = (filter) => {
    setLocalActiveFilter(filter);
    setActiveFilter(filter);
    setMobileSheetOpen(false);
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setMobileSheetOpen(false);
    // Re-request online users so the dot updates immediately
    if (socketConnected) getSocket()?.emit("getOnlineUsers");
  };

  const handleAcceptBooking = async () => {
    if (!selectedBooking?.id) return;
    try {
      await confirmBooking(selectedBooking.id);
    } catch (err) {
      console.error("Failed to accept booking:", err);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedBooking?.id || !content?.trim()) return;
    await sendMessage(selectedBooking.id, content);
  };

  // ── Derived ───────────────────────────────────────────────────
  const currentBookings = getCurrentBookings();

  const isInputDisabled =
    !selectedBooking ||
    !CHAT_ENABLED_STATUSES.includes(selectedBooking.status?.toLowerCase());

  // ── Sub-renders ───────────────────────────────────────────────


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
        {/* Avatar with online dot */}
        <div className="relative flex-shrink-0">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {booking.avatar ? (
              <img
                src={booking.avatar}
                alt={booking.participant_name}
                className="size-full object-cover"
              />
            ) : (
              <User className="size-5 text-primary" />
            )}
          </div>

          {/* ✅ Online indicator dot */}
          {booking.isOnline && (
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
              title="Online now"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-medium truncate text-sm">{booking.participant_name}</p>
            {booking.isOnline && (
              <span className="text-[10px] font-semibold text-green-600 flex-shrink-0">
                • online
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {booking.last_message || booking.purpose || "No messages yet"}
          </p>
          {booking.scheduledAt && (
            <p className="text-xs text-muted-foreground">
              {format(parseISO(booking.scheduledAt), "MMM d, p")}
              {booking.duration ? ` · ${booking.duration}min` : ""}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <BookingStatusBadge status={booking.status} className="text-[10px] px-1.5 py-0.5" />
          {booking.unread_count > 0 && (
            <Badge variant="destructive" className="text-xs h-5 min-w-5 flex items-center justify-center">
              {booking.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  const renderFilterButton = (filter) => {
    const label =
      filter === "rescheduled"
        ? "Resched."
        : filter.charAt(0).toUpperCase() + filter.slice(1);
    const count = bookingsByFilter[filter]?.length || 0;

    return (
      <button
        key={filter}
        onClick={() => handleFilterChange(filter)}
        className={cn(
          "px-2 py-1.5 rounded text-xs font-medium transition-all cursor-pointer",
          activeFilter === filter
            ? "bg-primary text-white shadow-sm"
            : "bg-muted hover:bg-muted/80 text-muted-foreground"
        )}
      >
        {label}
        {count > 0 && (
          <Badge className="ml-1 bg-white text-primary text-[10px] px-1 border-0">
            {count}
          </Badge>
        )}
      </button>
    );
  };

  const renderSidebarContent = () => (
    <>
      {/* Filters */}
      <div className="p-3 border-b flex-shrink-0">
        <div className="grid grid-cols-3 gap-1.5">
          {FILTERS.map(renderFilterButton)}
        </div>
      </div>

      {/* Booking list */}
      <div className="flex-1 overflow-y-auto p-2">
        {currentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="size-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No bookings in this filter</p>
          </div>
        ) : (
          currentBookings.map((b) => renderBookingCard(b, handleSelectBooking))
        )}
      </div>
    </>
  );

  // ── Main render ───────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-2 overflow-hidden">

      {/* Mobile floating menu */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg h-14 w-14">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] sm:w-96 p-0 flex flex-col">
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <SheetTitle>Bookings</SheetTitle>
            </SheetHeader>
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <Card className="hidden lg:flex w-80 xl:w-96 flex-col border-r shadow-sm overflow-hidden">
        <div className="pb-2 border-b flex-shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bookings</h2>
          {/* Live connection dot */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Circle
              className={cn(
                "size-2 fill-current",
                socketConnected ? "text-green-500" : "text-red-400"
              )}
            />
            {socketConnected ? "Live" : "Offline"}
          </div>
        </div>
        {renderSidebarContent()}
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CHAT AREA
          ─────────────────────────────────────────────────────────*/}
      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm min-h-0">

        {/* No booking selected */}
        {!selectedBooking ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <MessageSquare className="size-16 text-muted-foreground/30" />
            <div>
              <p className="text-lg font-medium text-muted-foreground">No booking selected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pick a booking from the sidebar to start chatting
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── 1. Booking header ─────────────────────────────── */}
            <div className="flex-shrink-0  border-b bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar + online dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {selectedBooking.avatar ? (
                        <img
                          src={selectedBooking.avatar}
                          alt={selectedBooking.participant_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    {selectedBooking.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold truncate text-sm">
                        {selectedBooking.participant_name}
                      </h2>
                      <BookingStatusBadge status={selectedBooking.status} />
                    </div>
                    <p className="text-xs mt-0.5">
                      {selectedBooking.isOnline ? (
                        <span className="text-green-600 font-medium">● Online</span>
                      ) : (
                        <span className="text-muted-foreground">● Offline</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedBooking.status?.toLowerCase() === "pending" && (
                    <Button
                      onClick={handleAcceptBooking}
                      disabled={isSending}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept Booking
                    </Button>
                  )}
                  <BookingActions booking={selectedBooking} />
                </div>
              </div>

              {/* Booking meta */}
              {selectedBooking.purpose && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Purpose:</span>{" "}
                      {selectedBooking.purpose}
                    </p>
                    {selectedBooking.scheduledAt && (
                      <p>
                        <span className="font-medium text-foreground">Scheduled:</span>{" "}
                        {format(parseISO(selectedBooking.scheduledAt), "PPP p")}
                        {selectedBooking.duration ? ` · ${selectedBooking.duration} min` : ""}
                      </p>
                    )}
                    {selectedBooking.proposedAt &&
                      selectedBooking.status?.toLowerCase() === "reschedule-proposed" && (
                        <p className="text-orange-600">
                          <span className="font-medium">Proposed:</span>{" "}
                          {format(parseISO(selectedBooking.proposedAt), "PPP p")}
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>

            {/* ── 2. Messages (flex-1 so it fills remaining space) ── */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <ChatMessages
                messages={messages}
                isLoading={isLoadingMessages}
                bookingStatus={selectedBooking.status}
                proposedAt={selectedBooking.proposedAt}
                onConfirmMessage={confirmMessage}
                onRejectMessage={rejectMessage}
              />
            </div>
            {/* ── 3. Extend offer banner ───────────────────────── */}
              <SessionExtendBanner />

            {/* ── 4. Typing indicator + Input (pinned to bottom) ─── */}
            <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t bg-background">
              {isSomeoneTyping && (
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground italic">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  </div>
                  {typingUserName || "Student"} is typing…
                </div>
              )}

              <ChatInput
                onSend={handleSendMessage}
                isSending={isSending}
                disabled={isInputDisabled}
                selectedBookingId={selectedBooking?.id}
              />
            </div>
          </>
        )}
      </Card>

      {/* Connected toast */}
      {showToast && socketConnected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2 rounded-full bg-white animate-pulse block" />
            Chat connected
          </div>
        </div>
      )}

    </div>
  );
}