import { useEffect, useState, useCallback } from "react";
import { useTutorChatStore } from "@/store/tutorChatStore";
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
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RotateCw,
  Loader2,
  AlertCircle,
  Menu,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import BookingActions from "./BookingActions";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function TutorChat() {
  const {
    bookingsByFilter,
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
    acceptReschedule,
    rejectReschedule,
    setActiveFilter,
    getCurrentBookings,
    refreshStaleFilters, // NEW: for background refresh
  } = useTutorChatStore();

  const [activeFilter, setLocalActiveFilter] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false); // NEW: for mobile drawer

  // Track loaded & fetching filters
  const [loadedFilters, setLoadedFilters] = useState(new Set());
  const [fetchingFilters, setFetchingFilters] = useState(new Set());

  // Load filter data when tab clicked
  const loadFilter = useCallback(
    async (filter, force = false) => {
      if (loadedFilters.has(filter) && !force) return;

      setFetchingFilters(prev => new Set([...prev, filter]));

      try {
        await fetchBookings(filter);
        setLoadedFilters(prev => new Set([...prev, filter]));
      } catch (err) {
        console.warn(`Failed to load ${filter}:`, err);
      } finally {
        setFetchingFilters(prev => {
          const next = new Set(prev);
          next.delete(filter);
          return next;
        });
      }
    },
    [fetchBookings, loadedFilters]
  );

  // Load all filters on mount to show badge counts immediately
  useEffect(() => {
    const loadAllFilters = async () => {
      const filters = ["all", "active", "pending", "rescheduled", "completed", "cancelled"];
      
      console.log("🚀 Loading all filters on mount...");
      
      // Load all filters in parallel (force=false, will use cache if fresh)
      await Promise.all(filters.map(filter => loadFilter(filter)));
      
      console.log("✅ All filters loaded!");
    };
    
    loadAllFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Background refresh every 30 seconds (only refreshes stale data)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Background refresh check...");
      refreshStaleFilters(); // Only refreshes filters that are stale
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshStaleFilters]);

  // Poll messages every 5 seconds when chat is open
  useEffect(() => {
    if (!selectedBookingId) return;

    console.log("Starting message polling for booking:", selectedBookingId);

    const interval = setInterval(async () => {
      await fetchMessages(selectedBookingId);
      console.log("Polled messages for booking:", selectedBookingId);
    }, 5000);

    return () => {
      clearInterval(interval);
      console.log("Stopped message polling for booking:", selectedBookingId);
    };
  }, [selectedBookingId, fetchMessages]);

  // Handle tab click
  const handleTabClick = (filter) => {
    setLocalActiveFilter(filter);
    setActiveFilter(filter);

    if (!loadedFilters.has(filter)) {
      loadFilter(filter);
    }
  };

  // Load booking + messages when ID changes
  useEffect(() => {
    if (selectedBookingId) {
      console.log("Loading booking + messages for ID:", selectedBookingId);
      fetchBooking(selectedBookingId);
      fetchMessages(selectedBookingId);
    }
  }, [selectedBookingId, fetchBooking, fetchMessages]);

  // Handlers
  const handleSelectBooking = (bookingId) => {
    console.log("Clicked booking → setting ID:", bookingId);
    setSelectedBookingId(bookingId);
    setMobileSheetOpen(false); // Close drawer on mobile when booking selected
  };

  const handleAcceptBooking = async () => {
    if (!selectedBooking) return;
    setIsAccepting(true);
    try {
      await confirmBooking(selectedBooking.id);
      loadFilter("confirmed", true);
      setLocalActiveFilter("confirmed");
      setActiveFilter("confirmed");
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
      await fetchMessages(selectedBookingId);
      loadFilter(activeFilter, true);
    } catch (err) {
      alert("Failed to send: " + (err.message || "Unknown error"));
    }
  };

  const handleAcceptReschedule = async () => {
    if (!selectedBooking) return;
    try {
      await acceptReschedule(selectedBooking.id);
      loadFilter(activeFilter, true);
      alert("Reschedule accepted successfully!");
    } catch (err) {
      alert("Failed to accept reschedule: " + (err.message || "Unknown error"));
    }
  };

  const handleRejectReschedule = async () => {
    if (!selectedBooking) return;
    const reason = prompt("Reason for rejecting the reschedule (optional):")?.trim() || "";
    
    try {
      await rejectReschedule(selectedBooking.id, reason);
      loadFilter(activeFilter, true);
      alert("Reschedule rejected. Booking reverted to pending.");
    } catch (err) {
      alert("Failed to reject reschedule: " + (err.message || "Unknown error"));
    }
  };

  // Get current bookings
  const currentBookings = getCurrentBookings();

  // Unread counts - now counts total bookings in each filter
  const unreadCounts = (() => {
    const counts = {
      all: 0,
      pending: 0,
      active: 0,
      rescheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    // Count bookings in each filter
    Object.entries(bookingsByFilter).forEach(([filter, bookings]) => {
      if (Array.isArray(bookings)) {
        const filterKey = filter.toLowerCase();
        if (filterKey in counts) {
          counts[filterKey] = bookings.length;
        }
      }
    });

    // If 'all' filter exists in store, use its length
    if (bookingsByFilter.all?.length) {
      counts.all = bookingsByFilter.all.length;
    }

    console.log("📊 Badge Counts:", counts);
    console.log("📦 Bookings by Filter:", Object.entries(bookingsByFilter).map(([k, v]) => `${k}: ${v?.length || 0}`));

    return counts;
  })();

  // Status helpers
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      active: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
      "reschedule-proposed": "bg-purple-500",
      rescheduled: "bg-purple-500",
    };
    return colors[status?.toLowerCase()] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      active: CheckCircle,
      completed: CheckCircle,
      cancelled: XCircle,
      "reschedule-proposed": RotateCw,
      rescheduled: RotateCw,
    };
    const Icon = icons[status?.toLowerCase()] || AlertCircle;
    return <Icon className="size-4" />;
  };

  return (
    <div className="h-[calc(110vh-2rem)] flex flex-col lg:flex-row gap-4">
      {/* Mobile: Floating Menu Button */}
      <div className="lg:hidden  z-50">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <div className=" flex gap-2">

          <SheetTrigger asChild>
            <Button size="lg" className="rounded shadow-lg h-8 w-8 px-12">
              {/* <Menu className="size-6" />  */}
              Chat Menu
            </Button>
          </SheetTrigger>
            {/* <p className="text-xl font-bold">Chat</p> */}
          </div>

          <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 flex flex-col z-[9999]">
            <SheetHeader className="pt-12 pb-2 px-4 border-b">
              <div className="flex justify-between items-center">
                <SheetTitle>Bookings</SheetTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadFilter(activeFilter, true)}
                  className="h-8  border"
                >
                  <RotateCw className="size-3.5 mr-1" />
                  
                </Button>
              </div>
            </SheetHeader>

            {/* Filter Tabs - Mobile */}
            <div className="p-4 pb-2 border-b">
              <div className="grid grid-cols-3 gap-2">
                {["all", "active", "pending", "rescheduled", "completed", "cancelled"].map((filter) => {
                  const isActive = activeFilter === filter;
                  const isFetching = fetchingFilters.has(filter);
                  const count = unreadCounts[filter] || 0;
                  
                  const badgeColor = 
                    filter === "pending" ? "bg-yellow-500" : 
                    filter === "rescheduled" ? "bg-orange-500" : 
                    "bg-green-500";

                  return (
                    <button
                      key={filter}
                      onClick={() => handleTabClick(filter)}
                      className={`relative px-2 py-1.5 rounded-lg text-xs font-medium transition-all 
                        flex justify-between items-center gap-1 ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${isFetching ? "opacity-80 cursor-wait" : ""}`}
                    >
                      <span className="capitalize">{filter}</span>
                      {count > 0 && (
                        <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full ${badgeColor} text-[10px] font-bold text-white px-1.5 shadow`}>
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bookings List - Mobile */}
            <div className="flex-1 overflow-y-auto">
              {fetchingFilters.has(activeFilter) ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <Loader2 className="size-10 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Loading {activeFilter} bookings...
                  </p>
                </div>
              ) : currentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageSquare className="size-12 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No bookings found</p>
                </div>
              ) : (
                currentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => handleSelectBooking(booking.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                      selectedBookingId === booking.id ? "bg-blue-50 border-l-4 border-l-primary" : ""
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
                            {booking.status.replace(/-/g, ' ')}
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
                            {format(parseISO(booking.scheduledAt), "MMM d, h:mm a")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar */}
      <Card className="hidden lg:flex flex-col w-80 xl:w-96 p-3">
        <div className="border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Bookings</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadFilter(activeFilter, true)}
              className="h-6 "
            >
              <RotateCw className="size-3 mr-1" />
            </Button>
          </div>

          {/* Filter Tabs - Desktop */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2 mb-4">
            {["all", "active", "pending", "rescheduled", "completed", "cancelled"].map((filter) => {
              const isActive = activeFilter === filter;
              const isFetching = fetchingFilters.has(filter);
              const count = unreadCounts[filter] || 0;
              
              const badgeColor = 
                filter === "pending" ? "bg-yellow-500" : 
                filter === "rescheduled" ? "bg-orange-500" : 
                "bg-green-500";

              const tooltipText = {
                all: "View all bookings",
                active: "Currently active sessions",
                pending: "Awaiting confirmation",
                rescheduled: "Reschedule session",
                completed: "Completed sessions",
                cancelled: "Cancelled bookings"
              };

              return (
                <div key={filter} className="relative group">
                  <button
                    onClick={() => handleTabClick(filter)}
                    className={cn(
                      "relative px-1 py-2 rounded-lg w-full",
                      "text-[10px] md:text-xs font-medium",
                      "flex flex-col items-center justify-center gap-1",
                      "transition-all duration-200",
                      "min-h-[35px]",
                      isActive
                        ? "bg-primary text-white shadow-md ring-2 ring-primary/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                      isFetching && "opacity-70 cursor-wait"
                    )}
                  >
                    {/* Badge on top */}
                    {count > 0 && (
                      <span 
                        className={cn(
                          "absolute -top-1 -right-1",
                          "flex items-center justify-center",
                          "h-4 md:h-5 min-w-[16px] md:min-w-[20px] px-1",
                          "rounded-full",
                          "text-[8px] md:text-[9px] font-bold text-white",
                          "shadow-md border-2 border-white dark:border-gray-900",
                          badgeColor
                        )}
                      >
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                    
                    {/* Label */}
                    <span className="truncate max-w-full text-center leading-tight">
                      {filter === "rescheduled" ? "Resched" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </span>
                  </button>
                  
                  {/* Custom Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    <div className="text-center">
                      <p>{tooltipText[filter]}</p>
                      {count > 0 && (
                        <p className="text-[10px] opacity-80 mt-0.5">
                          {count} {count === 1 ? 'booking' : 'bookings'}
                        </p>
                      )}
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookings List - Desktop */}
        <div className="flex-1 overflow-y-auto">
          {fetchingFilters.has(activeFilter) ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <Loader2 className="size-10 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">
                Loading {activeFilter} bookings...
              </p>
            </div>
          ) : currentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare className="size-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No bookings found</p>
            </div>
          ) : (
            currentBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => handleSelectBooking(booking.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  selectedBookingId === booking.id ? "bg-blue-50 border-l-4 border-l-primary" : ""
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
                        {booking.status.replace(/-/g, ' ')}
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
                        {format(parseISO(booking.scheduledAt), "MMM d, h:mm a")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
      </Card>

      {/* Chat Area - Responsive */}
      <Card className="flex-1 flex flex-col w-full lg:w-auto">
        {selectedBooking ? (
          <>
            {/* Header - Responsive */}
            <div className="border-b">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
                  <div className="min-w-0">
                    <h2 className="font-semibold text-base sm:text-lg truncate">
                      {selectedBooking.participant_name}
                    </h2>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                      {getStatusIcon(selectedBooking.status)}
                      <span className="text-xs sm:text-sm text-muted-foreground capitalize truncate">
                        {selectedBooking.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {selectedBooking.status === "pending" && (
                    <Button
                      onClick={handleAcceptBooking}
                      disabled={isAccepting}
                      className="bg-green-600 hover:bg-green-700 text-white h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm"
                    >
                      {isAccepting ? (
                        <>
                          <Loader2 className="size-3 sm:size-4 sm:mr-2 animate-spin" />
                          <span className="hidden sm:inline">Accepting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="size-3 sm:size-4 sm:mr-2" />
                          <span className="hidden sm:inline">Accept Booking</span>
                          <span className="sm:hidden">Accept</span>
                        </>
                      )}
                    </Button>
                  )}
                  <BookingActions booking={selectedBooking} />
                </div>
              </div>

              {selectedBooking.purpose && (
                <>
                  <Separator className="my-2 sm:my-3" />
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <p className="truncate"><strong>Purpose:</strong> {selectedBooking.purpose}</p>
                    {selectedBooking.scheduledAt && (
                      <p className="truncate"><strong>Scheduled:</strong> {format(parseISO(selectedBooking.scheduledAt), "PPpp")}</p>
                    )}
                    {selectedBooking.proposedAt && selectedBooking.status === "reschedule-proposed" && (
                      <p className="text-purple-700 truncate">
                        <strong>Proposed Time:</strong> {format(parseISO(selectedBooking.proposedAt), "PPpp")}
                        </p>
                      
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
              isLoading={fetchingFilters.has(activeFilter)}
              bookingStatus={selectedBooking.status}
              proposedAt={selectedBooking.proposedAt}
              onConfirmMessage={confirmMessage}
              onRejectMessage={rejectMessage}
              onAcceptReschedule={handleAcceptReschedule}
              onRejectReschedule={handleRejectReschedule}
            />

            <ChatInput
              onSend={handleSendMessage}
              isSending={isSending}
              disabled={selectedBooking.status === "cancelled" || selectedBooking.status === "completed"}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
              <MessageSquare className="size-12 sm:size-16 text-muted-foreground/30 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-1 sm:mb-2">
                No Booking Selected
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="hidden lg:inline">Select a booking from the list to start chatting</span>
                <span className="lg:hidden">Tap the menu button to view bookings</span>
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


