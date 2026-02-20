
import { useEffect } from "react";
import { useUserChatStore } from "@/store/userChatStore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, MessageCircle, Users, RefreshCw, Loader2, Calendar, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnhancedConversationList({ searchQuery, setSearchQuery, onSelect }) {
  // ── Read directly from store — instant re-render on any change ──
  const bookings        = useUserChatStore((s) => s.bookings);
  const tutors          = useUserChatStore((s) => s.tutors);
  const selectedBooking = useUserChatStore((s) => s.selectedBooking);
  const isLoading       = useUserChatStore((s) => s.isLoading);
  const activeTab       = useUserChatStore((s) => s.activeTab);
  const onlineTutors    = useUserChatStore((s) => s.onlineTutors);

  const {
    setSelectedBooking,
    setActiveTab,
    fetchBookings,
    fetchTutors,
  } = useUserChatStore();

  const TAB_STATUS = {
    sessions:   "",
    pending:    "pending",
    confirmed:  "confirmed",
    active:     "active",
    completed:  "completed",
    reschedule: "reschedule-proposed",
    tutors:     null,
  };

  // allBookings is the source of truth — socket patches update this instantly
  const allBookings = useUserChatStore((s) => s.allBookings);

  // On mount — fetch ALL bookings so allBookings is always populated
  useEffect(() => {
    fetchBookings(false, { status: "" });
    fetchTutors();
  }, []);

  // Fetch filtered list when tab changes (for server-side filtering)
  useEffect(() => {
    if (activeTab === "tutors") {
      fetchTutors();
    } else {
      fetchBookings(false, { status: TAB_STATUS[activeTab] ?? "" });
    }
  }, [activeTab]);

  // Use allBookings as source — socket updates here flow instantly to every tab
  const sourceBookings = allBookings.length > 0 ? allBookings : bookings;

  // ── Tab counts — always from ALL bookings ────────────────────────
  const counts = {
    sessions:   sourceBookings.length,
    pending:    sourceBookings.filter((b) => b.status === "pending").length,
    confirmed:  sourceBookings.filter((b) => b.status === "confirmed").length,
    active:     sourceBookings.filter((b) => b.status === "active").length,
    reschedule: sourceBookings.filter((b) => b.status === "reschedule-proposed").length,
    tutors:     tutors.length,
  };

  // ── Filter for current tab — from allBookings so socket patches show instantly
  const tabBookings = (() => {
    if (activeTab === "sessions") return sourceBookings;
    const target = TAB_STATUS[activeTab];
    if (!target) return [];
    return sourceBookings.filter((b) => b.status === target);
  })();

  // ── Search ───────────────────────────────────────────────────────
  const search = String(searchQuery ?? "").toLowerCase().trim();
  const filter = (items) =>
    !search
      ? items
      : items.filter((item) => {
          const name    = (item?.name ?? item?.participant_name ?? "").toLowerCase();
          const status  = (item?.status ?? "").toLowerCase();
          const purpose = (item?.purpose ?? "").toLowerCase();
          return name.includes(search) || status.includes(search) || purpose.includes(search);
        });

  const displayItems = activeTab === "tutors" ? filter(tutors) : filter(tabBookings);

  const handleSelect = (item) => {
    setSelectedBooking(item);
    onSelect?.();
  };

  const handleRefresh = () => {
    if (activeTab === "tutors") fetchTutors();
    else fetchBookings(true, { status: TAB_STATUS[activeTab] ?? "" });
  };

  // ── Tab config ───────────────────────────────────────────────────
  const TABS = [
    { key: "sessions",  label: "All" },
    { key: "pending",   label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "active",    label: "Active" },
    { key: "tutors",    label: "Tutors" },
  ];

  return (
    <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <Button size="icon" variant="ghost" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => setActiveTab(tab.key)}
              className="text-xs h-9 px-2"
            >
              <span className="flex items-center gap-1 truncate">
                {tab.label}
                {counts[tab.key] > 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 min-w-[20px] px-1 text-[10px] font-bold rounded-full",
                      activeTab === tab.key
                        ? "bg-white text-primary"
                        : "bg-primary text-white"
                    )}
                  >
                    {counts[tab.key]}
                  </Badge>
                )}
              </span>
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={activeTab === "tutors" ? "Search tutors…" : "Search sessions…"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────────── */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-600">Loading…</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
              {activeTab === "tutors"
                ? <Users className="h-10 w-10 text-slate-400" />
                : <MessageCircle className="h-10 w-10 text-slate-400" />}
            </div>
            <p className="text-slate-700 font-medium text-lg mb-2">
              {search ? "No matches found" : `No ${activeTab} yet`}
            </p>
            <p className="text-slate-500 text-sm">
              {search ? "Try a different search term" : "New items will appear here"}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {displayItems.map((item) => {
              const tutorId  = item.tutorId || item.id;
              const isOnline = !!onlineTutors[tutorId];
              const status   = item.status?.toLowerCase() ?? "";
              const isSelected = selectedBooking?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "cursor-pointer rounded-xl p-4 transition-all border",
                    isSelected
                      ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-md"
                      : "border-slate-100 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start gap-3">

                    {/* Avatar + status dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
                        {item.avatar
                          ? <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                          : String(item.name ?? "?").charAt(0).toUpperCase()
                        }
                      </div>

                      {/* dot */}
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors",
                          isOnline              ? "bg-green-500 animate-pulse"
                          : status === "pending"    ? "bg-amber-500"
                          : status === "confirmed"  ? "bg-blue-500"
                          : status === "active"     ? "bg-emerald-500"
                          : status === "reschedule-proposed" ? "bg-purple-500"
                          : status === "completed"  ? "bg-slate-400"
                          : status.includes("cancelled") ? "bg-red-500"
                          : "bg-slate-300"
                        )}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">

                      {/* Name + badges */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {item.name || item.participant_name || "Unknown"}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isOnline && (
                            <Badge className="bg-green-100 text-green-700 text-[10px] border-green-200 px-1.5 py-0 h-4">
                              Online
                            </Badge>
                          )}
                          {item.unread_count > 0 && (
                            <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                              {item.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      {item.status && (
                        <Badge
                          className={cn(
                            "mb-1.5 text-xs border-0 capitalize",
                            status === "active"     && "bg-blue-100 text-blue-700",
                            status === "pending"    && "bg-yellow-100 text-yellow-700",
                            status === "confirmed"  && "bg-green-100 text-green-700",
                            status === "completed"  && "bg-slate-100 text-slate-700",
                            status === "expired"    && "bg-orange-100 text-orange-700",
                            status.includes("cancelled") && "bg-red-100 text-red-700",
                            status === "reschedule-proposed" && "bg-purple-100 text-purple-700",
                            status === "available"  && "bg-teal-100 text-teal-700",
                          )}
                        >
                          {status.replace(/_/g, " ").replace(/-/g, " ")}
                        </Badge>
                      )}

                      {/* Last message or purpose */}
                      {item.last_message ? (
                        <p className="text-sm text-slate-500 truncate mb-1">{item.last_message}</p>
                      ) : item.purpose ? (
                        <p className="text-sm text-slate-600 truncate mb-1">{item.purpose}</p>
                      ) : null}

                      {/* Schedule info */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {item.scheduledAt && (
                          <>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric",
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
                        )}
                        {item.completedSessions !== undefined && item.completedSessions > 0 && (
                          <span>{item.completedSessions} sessions</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}








// // src/components/user/chat/conversation-list.jsx
// // Reads directly from store — no props for bookings/tutors.
// // Every socket event that updates the store immediately re-renders this.
// import { useEffect } from "react";
// import { useUserChatStore } from "@/store/userChatStore";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Search, MessageCircle, Users, RefreshCw, Loader2, Calendar, Clock,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function EnhancedConversationList({ searchQuery, setSearchQuery, onSelect }) {
//   // ── Read directly from store — instant re-render on any change ──
//   const bookings        = useUserChatStore((s) => s.bookings);
//   const tutors          = useUserChatStore((s) => s.tutors);
//   const selectedBooking = useUserChatStore((s) => s.selectedBooking);
//   const isLoading       = useUserChatStore((s) => s.isLoading);
//   const activeTab       = useUserChatStore((s) => s.activeTab);
//   const onlineTutors    = useUserChatStore((s) => s.onlineTutors);

//   const {
//     setSelectedBooking,
//     setActiveTab,
//     fetchBookings,
//     fetchTutors,
//   } = useUserChatStore();

//   const TAB_STATUS = {
//     sessions:   "",
//     pending:    "pending",
//     confirmed:  "confirmed",
//     active:     "active",
//     completed:  "completed",
//     reschedule: "reschedule-proposed",
//     tutors:     null,
//   };

//   // Fetch data when tab changes
//   useEffect(() => {
//     if (activeTab === "tutors") {
//       fetchTutors();
//     } else {
//       fetchBookings(false, { status: TAB_STATUS[activeTab] ?? "" });
//     }
//   }, [activeTab]);

//   // ── Tab counts — computed from live bookings array ───────────────
//   const counts = {
//     sessions:   bookings.length,
//     pending:    bookings.filter((b) => b.status === "pending").length,
//     confirmed:  bookings.filter((b) => b.status === "confirmed").length,
//     active:     bookings.filter((b) => b.status === "active").length,
//     reschedule: bookings.filter((b) => b.status === "reschedule-proposed").length,
//     tutors:     tutors.length,
//   };

//   // ── Filter bookings for current tab ─────────────────────────────
//   const tabBookings = (() => {
//     if (activeTab === "sessions") return bookings;
//     const target = TAB_STATUS[activeTab];
//     if (!target) return [];
//     return bookings.filter((b) => b.status === target);
//   })();

//   // ── Search ───────────────────────────────────────────────────────
//   const search = String(searchQuery ?? "").toLowerCase().trim();
//   const filter = (items) =>
//     !search
//       ? items
//       : items.filter((item) => {
//           const name    = (item?.name ?? item?.participant_name ?? "").toLowerCase();
//           const status  = (item?.status ?? "").toLowerCase();
//           const purpose = (item?.purpose ?? "").toLowerCase();
//           return name.includes(search) || status.includes(search) || purpose.includes(search);
//         });

//   const displayItems = activeTab === "tutors" ? filter(tutors) : filter(tabBookings);

//   const handleSelect = (item) => {
//     setSelectedBooking(item);
//     onSelect?.();
//   };

//   const handleRefresh = () => {
//     if (activeTab === "tutors") fetchTutors();
//     else fetchBookings(true, { status: TAB_STATUS[activeTab] ?? "" });
//   };

//   // ── Tab config ───────────────────────────────────────────────────
//   const TABS = [
//     { key: "sessions",  label: "All" },
//     { key: "pending",   label: "Pending" },
//     { key: "confirmed", label: "Confirmed" },
//     { key: "active",    label: "Active" },
//     { key: "tutors",    label: "Tutors" },
//   ];

//   return (
//     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">

//       {/* ── Header ─────────────────────────────────────────────── */}
//       <div className="px-4 py-4 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
//           <Button size="icon" variant="ghost" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
//           </Button>
//         </div>

//         {/* Tabs */}
//         <div className="grid grid-cols-3 gap-1.5 mb-4">
//           {TABS.map((tab) => (
//             <Button
//               key={tab.key}
//               variant={activeTab === tab.key ? "default" : "outline"}
//               onClick={() => setActiveTab(tab.key)}
//               className="text-xs h-9 px-2"
//             >
//               <span className="flex items-center gap-1 truncate">
//                 {tab.label}
//                 {counts[tab.key] > 0 && (
//                   <Badge
//                     variant="secondary"
//                     className={cn(
//                       "h-5 min-w-[20px] px-1 text-[10px] font-bold rounded-full",
//                       activeTab === tab.key
//                         ? "bg-white text-primary"
//                         : "bg-primary text-white"
//                     )}
//                   >
//                     {counts[tab.key]}
//                   </Badge>
//                 )}
//               </span>
//             </Button>
//           ))}
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder={activeTab === "tutors" ? "Search tutors…" : "Search sessions…"}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {/* ── List ───────────────────────────────────────────────── */}
//       <ScrollArea className="flex-1">
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
//             <p className="text-slate-600">Loading…</p>
//           </div>
//         ) : displayItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
//               {activeTab === "tutors"
//                 ? <Users className="h-10 w-10 text-slate-400" />
//                 : <MessageCircle className="h-10 w-10 text-slate-400" />}
//             </div>
//             <p className="text-slate-700 font-medium text-lg mb-2">
//               {search ? "No matches found" : `No ${activeTab} yet`}
//             </p>
//             <p className="text-slate-500 text-sm">
//               {search ? "Try a different search term" : "New items will appear here"}
//             </p>
//           </div>
//         ) : (
//           <div className="p-3 space-y-2">
//             {displayItems.map((item) => {
//               const tutorId  = item.tutorId || item.id;
//               const isOnline = !!onlineTutors[tutorId];
//               const status   = item.status?.toLowerCase() ?? "";
//               const isSelected = selectedBooking?.id === item.id;

//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => handleSelect(item)}
//                   className={cn(
//                     "cursor-pointer rounded-xl p-4 transition-all border",
//                     isSelected
//                       ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-md"
//                       : "border-slate-100 hover:bg-slate-50"
//                   )}
//                 >
//                   <div className="flex items-start gap-3">

//                     {/* Avatar + status dot */}
//                     <div className="relative flex-shrink-0">
//                       <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
//                         {item.avatar
//                           ? <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
//                           : String(item.name ?? "?").charAt(0).toUpperCase()
//                         }
//                       </div>

//                       {/* dot */}
//                       <div
//                         className={cn(
//                           "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors",
//                           isOnline              ? "bg-green-500 animate-pulse"
//                           : status === "pending"    ? "bg-amber-500"
//                           : status === "confirmed"  ? "bg-blue-500"
//                           : status === "active"     ? "bg-emerald-500"
//                           : status === "reschedule-proposed" ? "bg-purple-500"
//                           : status === "completed"  ? "bg-slate-400"
//                           : status.includes("cancelled") ? "bg-red-500"
//                           : "bg-slate-300"
//                         )}
//                       />
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0">

//                       {/* Name + badges */}
//                       <div className="flex items-center justify-between gap-2 mb-1">
//                         <span className="font-bold text-slate-900 truncate">
//                           {item.name || item.participant_name || "Unknown"}
//                         </span>
//                         <div className="flex items-center gap-1 flex-shrink-0">
//                           {isOnline && (
//                             <Badge className="bg-green-100 text-green-700 text-[10px] border-green-200 px-1.5 py-0 h-4">
//                               Online
//                             </Badge>
//                           )}
//                           {item.unread_count > 0 && (
//                             <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
//                               {item.unread_count}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>

//                       {/* Status badge */}
//                       {item.status && (
//                         <Badge
//                           className={cn(
//                             "mb-1.5 text-xs border-0 capitalize",
//                             status === "active"     && "bg-blue-100 text-blue-700",
//                             status === "pending"    && "bg-yellow-100 text-yellow-700",
//                             status === "confirmed"  && "bg-green-100 text-green-700",
//                             status === "completed"  && "bg-slate-100 text-slate-700",
//                             status === "expired"    && "bg-orange-100 text-orange-700",
//                             status.includes("cancelled") && "bg-red-100 text-red-700",
//                             status === "reschedule-proposed" && "bg-purple-100 text-purple-700",
//                             status === "available"  && "bg-teal-100 text-teal-700",
//                           )}
//                         >
//                           {status.replace(/_/g, " ").replace(/-/g, " ")}
//                         </Badge>
//                       )}

//                       {/* Last message or purpose */}
//                       {item.last_message ? (
//                         <p className="text-sm text-slate-500 truncate mb-1">{item.last_message}</p>
//                       ) : item.purpose ? (
//                         <p className="text-sm text-slate-600 truncate mb-1">{item.purpose}</p>
//                       ) : null}

//                       {/* Schedule info */}
//                       <div className="flex items-center gap-3 text-xs text-slate-500">
//                         {item.scheduledAt && (
//                           <>
//                             <div className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               <span>
//                                 {new Date(item.scheduledAt).toLocaleDateString("en-US", {
//                                   month: "short", day: "numeric",
//                                 })}
//                               </span>
//                             </div>
//                             {item.duration && (
//                               <div className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 <span>{item.duration} min</span>
//                               </div>
//                             )}
//                           </>
//                         )}
//                         {item.completedSessions !== undefined && item.completedSessions > 0 && (
//                           <span>{item.completedSessions} sessions</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </ScrollArea>
//     </Card>
//   );
// }







