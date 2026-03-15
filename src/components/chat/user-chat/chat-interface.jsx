
// src/components/user/chat/ChatInterface.jsx
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

const API_BASE = "https://fillops-server-5fuf.onrender.com";

// Poll intervals (ms)
const POLL_BASE = 10000;       // 10s when stable + socket connected
const POLL_AGGRESSIVE = 5000;  // 5s when transitional or socket down
const POLL_MAX_BACKOFF = 30000;

export default function ChatInterface() {
  const scrollRef      = useRef(null);
  const messagesEndRef = useRef(null);
  const { toast }      = useToast();

  const {
    messages,
    selectedBooking,
    isLoading,
    isSending,
    socketConnected,
    fetchBookings,
    fetchTutors,
    sendMessage,
    cancelBooking,
    setSelectedBooking,
    sendTyping,
  } = useUserChatStore();

  // ── Local state ───────────────────────────────────────────────────────────
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
  const pollTimerRef = useRef(null);
  const pollBackoffCount = useRef(0);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchBookings("all"), fetchTutors()]);
      } catch {
        toast({ variant: "destructive", title: "Failed to load", description: "Could not load conversations." });
      }
    };
    load();
  }, []);

  // ── Auto-scroll logic ─────────────────────────────────────────────────────
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
        setNewMessagesCount(p => p + (cur - prev));
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

  // ── Typing ────────────────────────────────────────────────────────────────
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

  // ── Send message ──────────────────────────────────────────────────────────
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

  // ── Booking actions ───────────────────────────────────────────────────────
  const handleBookSession = (tutor) => {
    if (!tutor) return;
    setTutorToBook(tutor);
    setIsBookingModalOpen(true);
  };

  const handleStartChat = () => {
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
        `${API_BASE}/api/users/bookings/${selectedBooking.id}/end`,
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

  const handleReschedule = () => {
    if (!selectedBooking) return;
    setBookingToReschedule(selectedBooking);
    setIsRescheduleModalOpen(true);
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

  // ── Smart polling in parent component ─────────────────────────────────────
  useEffect(() => {
    if (!selectedBooking?.id || !selectedBooking.isBooking) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    const poll = async () => {
      try {
        const { fetchWithAuth } = useAuthStore.getState();
        const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${selectedBooking.id}`);

        if (res.success && res.data) {
          const fresh = res.data;
          const newStatus = (fresh.status || "pending").toLowerCase();

          if (newStatus !== selectedBooking.status?.toLowerCase()) {
            console.log(`[Poll] Status changed: ${selectedBooking.status} → ${newStatus}`);

            // Update selected booking → header re-renders
            setSelectedBooking({
              ...selectedBooking,
              ...fresh,
              status: newStatus,
            });

            // Also force refresh filters so sidebar moves instantly
            fetchBookings("all", true);

            // Reset backoff on success
            pollBackoffCount.current = 0;
          }
        }
      } catch (err) {
        console.warn("[Poll] Failed:", err);
        pollBackoffCount.current = Math.min(pollBackoffCount.current + 1, 4);
      }
    };

    // Determine poll frequency
    const isTransitional = ["pending", "completed", "active", "reschedule-proposed"].includes(
      selectedBooking.status?.toLowerCase() || ""
    );

    const interval = !socketConnected || isTransitional
      ? POLL_AGGRESSIVE
      : POLL_BASE * Math.pow(1.5, pollBackoffCount.current); // backoff

    const cappedInterval = Math.min(interval, POLL_MAX_BACKOFF);

    // Immediate check + schedule
    poll();
    pollTimerRef.current = setInterval(poll, cappedInterval);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [
    selectedBooking?.id,
    selectedBooking?.status,
    socketConnected,
    setSelectedBooking,
    fetchBookings
  ]);

  // ── Render ────────────────────────────────────────────────────────────────
  const isTutorProfile = selectedBooking && !selectedBooking.isBooking;

  if (isLoading && !selectedBooking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
           <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading conversations…</p>
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

        {/* Desktop sidebar */}
        <div className="hidden md:block w-full md:w-[380px] lg:w-[420px] xl:w-[470px] border-r border-slate-200 bg-white overflow-hidden">
          <EnhancedConversationList
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedBooking ? (
            <Card className="flex-1 flex flex-col mx-3 mt-3 md:m-4 md:ml-0 shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <EnhancedChatHeader
                onStartChat={handleStartChat}
                onEndChat={handleEndChat}
                onViewDetails={handleViewDetails}
                onReschedule={handleReschedule}
                onConfirmBooking={() => {}}
                onCancelBooking={handleCancelBooking}
              />

              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4 md:px-6 md:py-6">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {isTutorProfile ? (
                    // Tutor profile
                    <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
                      <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
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
                        className="bg-primary-hover hover:primary text-white shadow-lg px-8 py-6 text-lg"
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
                          Tutor proposed a reschedule — check details.
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
                      {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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

      {/* Modals */}
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