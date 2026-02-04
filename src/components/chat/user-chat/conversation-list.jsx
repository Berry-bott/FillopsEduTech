


import { useEffect, useState } from "react";
import { useUserChatStore } from "@/store/userChatStore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Calendar, Clock, Users, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  active: "bg-blue-500",
  completed: "bg-slate-400",
  cancelled: "bg-red-500",
};

export default function EnhancedConversationList({ bookings, tutors }) {
  const { 
    selectedBooking, 
    setSelectedBooking, 
    fetchBookings, 
    fetchTutors, 
    isLoading 
  } = useUserChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "tutors"

  // Auto-fetch when switching tabs
  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    } else if (activeTab === "tutors") {
      fetchTutors(); // no search param here — we filter client-side
    }
  }, [activeTab, fetchBookings, fetchTutors]);

  // Client-side filtering for both name and subject
  const filteredBookings = bookings.filter((booking) =>
    booking.participant_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutors = tutors.filter((tutor) => {
    const lowerQuery = searchQuery.toLowerCase().trim();

    if (!lowerQuery) return true;

    // Search by name
    const nameMatch = tutor.participant_name?.toLowerCase().includes(lowerQuery);

    // Search by subject (any subject contains the query)
    const subjectMatch = tutor.subjects?.some((sub) =>
      sub.subjectName?.toLowerCase().includes(lowerQuery)
    );

    return nameMatch || subjectMatch;
  });

  const displayItems = activeTab === "bookings" ? filteredBookings : filteredTutors;

  const handleRefresh = async () => {
    if (activeTab === "bookings") {
      await fetchBookings();
    } else {
      await fetchTutors();
    }
  };

  return (
    <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            disabled={isLoading}
            className="rounded-full hover:bg-slate-100"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={
              activeTab === "tutors"
                ? "Search by name or subject (e.g. Mathematics)"
                : "Search conversations..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:border-indigo-400 rounded-xl"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all",
              activeTab === "bookings"
                ? "bg-primary text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Sessions
              {bookings.length > 0 && (
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  {bookings.length}
                </Badge>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("tutors")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all",
              activeTab === "tutors"
                ? "bg-primary text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Tutors
              {tutors.length > 0 && (
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  {tutors.length}
                </Badge>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {displayItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                {activeTab === "bookings" ? (
                  <MessageCircle className="h-10 w-10 text-slate-400" />
                ) : (
                  <Users className="h-10 w-10 text-slate-400" />
                )}
              </div>

              <p className="text-slate-700 font-medium text-lg mb-2">
                {searchQuery
                  ? "No matches found"
                  : activeTab === "bookings"
                  ? "No sessions yet"
                  : "No tutors found"}
              </p>

              <p className="text-slate-500 text-sm">
                {activeTab === "tutors" && searchQuery
                  ? "Try a different name or subject (e.g. Physics, English)"
                  : activeTab === "tutors"
                  ? "Available tutors will appear here"
                  : "Your active sessions will appear here"}
              </p>
            </div>
          )}

          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedBooking(item)}
              className={cn(
                "cursor-pointer rounded-xl p-4 transition-all duration-200 border border-slate-100",
                selectedBooking?.id === item.id
                  ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md"
                  : "hover:bg-slate-50"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar + status dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
                    {item.participant_name?.charAt(0)?.toUpperCase() || "T"}
                  </div>

                  {item.isBooking && (
                    <div
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                        statusColors[item.status] || "bg-slate-400"
                      )}
                    />
                  )}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 truncate">
                      {item.participant_name || "Unknown"}
                    </span>

                    {item.isTutor && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        Available
                      </Badge>
                    )}
                  </div>

                  {/* Status for bookings */}
                  {item.isBooking && (
                    <Badge
                      className={cn(
                        "mb-1.5 text-xs border-0 capitalize",
                        item.status === "active" && "bg-blue-100 text-blue-700",
                        item.status === "pending" && "bg-yellow-100 text-yellow-700",
                        item.status === "confirmed" && "bg-green-100 text-green-700",
                        item.status === "completed" && "bg-slate-100 text-slate-700",
                        item.status === "cancelled" && "bg-red-100 text-red-700"
                      )}
                    >
                      {item.status}
                    </Badge>
                  )}

                  {/* Last message / purpose / bio */}
                  {item.last_message ? (
                    <p className="text-sm text-slate-600 truncate mb-1.5">
                      {item.last_message}
                    </p>
                  ) : item.purpose ? (
                    <p className="text-sm text-slate-600 truncate mb-1.5">
                      {item.purpose}
                    </p>
                  ) : item.bio ? (
                    <p className="text-sm text-slate-500 truncate mb-1.5">
                      {item.bio}
                    </p>
                  ) : null}

                  {/* Extra info line */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.scheduledAt ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration} min</span>
                          </div>
                        )}
                      </>
                    ) : item.completedSessions !== undefined ? (
                      <span>{item.completedSessions} sessions</span>
                    ) : item.isTutor && item.subjects?.length > 0 ? (
                      <span>
                        Teaches {item.subjects.length} subject
                        {item.subjects.length !== 1 ? "s" : ""}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Unread count */}
                {item.unread_count > 0 && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {item.unread_count > 9 ? "9+" : item.unread_count}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}