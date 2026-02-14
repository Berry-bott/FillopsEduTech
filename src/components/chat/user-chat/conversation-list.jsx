// import { useEffect } from "react";
// import { useUserChatStore } from "@/store/userChatStore";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, MessageCircle, Users, RefreshCw, Loader2, Calendar, Clock } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function EnhancedConversationList({
//   bookings,
//   tutors,
//   activeTab,
//   setActiveTab,
//   searchQuery,
//   setSearchQuery,
// }) {
//   const { 
//     selectedBooking, 
//     setSelectedBooking, 
//     fetchBookings, 
//     fetchTutors, 
//     isLoading 
//   } = useUserChatStore();

//   const tabToStatus = {
//     sessions: "",
//     pending: "PENDING",
//     active: "ACTIVE",
//     reschedule: "RESCHEDULE_PROPOSED",
//     tutors: null
//   };

//   // ✅ Calculate counts for each tab
//   const getTabCounts = () => {
//     return {
//       sessions: bookings.length,
//       pending: bookings.filter(b => b.status === "PENDING").length,
//       active: bookings.filter(b => b.status === "ACTIVE").length,
//       reschedule: bookings.filter(b => b.status === "RESCHEDULE_PROPOSED").length,
//       tutors: tutors.length
//     };
//   };

//   const tabCounts = getTabCounts();


//   useEffect(() => {
//     if (activeTab === "tutors") {
//       fetchTutors({ search: searchQuery });
//     } else {
//       const status = tabToStatus[activeTab] ?? "";
//       fetchBookings({ status });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeTab, searchQuery]);

//   const filteredBookings = bookings.filter(b => {
//     const q = String(searchQuery ?? "").toLowerCase().trim();
//     if (!q) return true;
    
//     const name = String(b?.name ?? "").toLowerCase().trim();
//     const nameMatch = name.includes(q);
    
//     const status = String(b?.status ?? "").toLowerCase().replace("_", " ").trim();
//     const statusMatch = status.includes(q);
    
//     const purpose = String(b?.purpose ?? "").toLowerCase().trim();
//     const purposeMatch = purpose.includes(q);
    
//     return nameMatch || statusMatch || purposeMatch;
//   });

//   const filteredTutors = tutors.filter(t => {
//     const q = String(searchQuery ?? "").toLowerCase().trim();
//     if (!q) return true;
    
//     const name = String(t?.name ?? "").toLowerCase().trim(); 
//     const subjectsMatch = t.subjects?.some(s =>
//       String(s?.subjectName ?? "").toLowerCase().trim().includes(q)
//     ) ?? false;
    
//     return name.includes(q) || subjectsMatch;
//   });

//   const displayItems = activeTab === "tutors" ? filteredTutors : filteredBookings;

//   return (
//     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
//       <div className=" py-2 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
//           <Button size="icon" variant="ghost"  onClick={() => {
//             if (activeTab === "tutors") fetchTutors({ search: searchQuery });
//             else fetchBookings({ status: tabToStatus[activeTab] ?? "" });
//           }} disabled={isLoading} >
//             <RefreshCw className={cn("h-4 w-6", isLoading && "animate-spin")} />
//           </Button>
//         </div>

//         {/*  Tabs with notification badges */}
//         <div className="grid grid-cols-5 gap-4 mb-4">
//           {["sessions", "pending", "active", "reschedule", "tutors"].map(tab => (
//             <Button
//               key={tab}
//               variant={activeTab === tab ? "default" : "outline"}
//               onClick={() => setActiveTab(tab)}
//               className="text-[11px] capitalize relative   w-[85px]"
//             >
//               <span className="flex items-center gap-">
//                 {tab === "sessions" ? " Sessions" : 
//                  tab === "reschedule" ? "Reschedule" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                
//                 {/* ✅ Notification Badge */}
//                 {tabCounts[tab] > 0 && (
//                   <Badge 
//                     variant="secondary" 
//                     className={cn(
//                       "h-5 min-w-5 px-1 text-[8px] font-bold rounded-full",
//                       activeTab === tab 
//                         ? "bg-white text-primary" 
//                         : "bg-primary text-white"
//                     )}
//                   >
//                     {tabCounts[tab]}
//                   </Badge>
//                 )}
//               </span>
//             </Button>
//           ))}
//         </div>

//         {/* Search */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder={activeTab === "tutors" ? "Search tutors..." : "Search sessions..."}
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       <ScrollArea className="flex-1">
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
//             <p className="text-slate-600">Loading...</p>
//           </div>
//         ) : displayItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
//               {activeTab === "tutors" ? <Users className="h-10 w-10 text-slate-400" /> : <MessageCircle className="h-10 w-10 text-slate-400" />}
//             </div>
//             <p className="text-slate-700 font-medium text-lg mb-2">
//               {searchQuery ? "No matches found" : `No ${activeTab === "sessions" ? "sessions" : activeTab} items`}
//             </p>
//             <p className="text-slate-500 text-sm">New items will appear here</p>
//           </div>
//         ) : (
//           <div className="p-3 space-y-2">
//             {displayItems.map(item => {
//             //   console.log("🔍 Rendering item:", {
//             //     id: item.id,
//             //     name: item.name,
//             //     status: item.status,
//             //     isTutor: item.isTutor,
//             //     activeTab: activeTab
//             //   }
//             // );

//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => setSelectedBooking(item)}
//                   className={cn(
//                     "cursor-pointer rounded-xl p-4 transition-all border border-slate-100",
//                     selectedBooking?.id === item.id ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md" : "hover:bg-slate-50"
//                   )}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="relative flex-shrink-0">
//                       <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
//                         {String(item?.name ?? "?").charAt(0).toUpperCase()}
//                       </div>
//                       {item.status && (
//                         <div className={cn(
//                           "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
//                           item.status === "PENDING" ? "bg-amber-500" :
//                           item.status === "CONFIRMED" ? "bg-green-500" :
//                           item.status === "ACTIVE" ? "bg-blue-500" :
//                           item.status === "RESCHEDULE_PROPOSED" ? "bg-purple-500" :
//                           item.status === "COMPLETED" ? "bg-slate-400" :
//                           item.status === "EXPIRED" ? "bg-orange-500" :
//                           item.status.includes("CANCELLED") ? "bg-red-500" : "bg-gray-500"
//                         )} />
//                       )}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between gap-2 mb-1">
//                         <span className="font-bold text-slate-900 truncate">
//                           {item.name || "Unknown"}
//                         </span>
//                         {item.isTutor && (
//                           <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
//                         )}
//                       </div>

//                       {item.status && (
//                         <Badge className={cn(
//                           "mb-1.5 text-xs border-0 capitalize",
//                           item.status === "ACTIVE" && "bg-blue-100 text-blue-700",
//                           item.status === "PENDING" && "bg-yellow-100 text-yellow-700",
//                           item.status === "CONFIRMED" && "bg-green-100 text-green-700",
//                           item.status === "COMPLETED" && "bg-slate-100 text-slate-700",
//                           item.status === "EXPIRED" && "bg-orange-100 text-orange-700",
//                           item.status.includes("CANCELLED") && "bg-red-100 text-red-700",
//                           item.status === "RESCHEDULE_PROPOSED" && "bg-purple-100 text-purple-700"
//                         )}>
//                           {item.status.replace("_", " ").toLowerCase()}
//                         </Badge>
//                       )}

//                       {item.purpose && (
//                         <p className="text-sm text-slate-600 truncate mb-1.5">{item.purpose}</p>
//                       )}

//                       <div className="flex items-center gap-3 text-xs text-slate-500">
//                         {item.scheduledAt && (
//                           <>
//                             <div className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               <span>{new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
//                             </div>
//                             {item.duration && (
//                               <div className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 <span>{item.duration} min</span>
//                               </div>
//                             )}
//                           </>
//                         )}
//                         {item.completedSessions !== undefined && (
//                           <span>{item.completedSessions} sessions</span>
//                         )}
//                         {item.subjects?.length > 0 && (
//                           <span>Teaches {item.subjects.length} subjects</span>
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







import { useEffect } from "react";
import { useUserChatStore } from "@/store/userChatStore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Users, RefreshCw, Loader2, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnhancedConversationList({
  bookings,
  tutors,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) {
  const { 
    selectedBooking, 
    setSelectedBooking, 
    fetchBookings, 
    fetchTutors, 
    isLoading 
  } = useUserChatStore();

  // Map tab names to status filters
  const tabToStatus = {
    sessions: "",
    pending: "pending",
    active: "active",
    confirmed: "confirmed",
    reschedule: "reschedule-proposed",
    tutors: null
  };

  // ✅ Calculate counts for each tab
  const getTabCounts = () => {
    return {
      sessions: bookings.length,
      pending: bookings.filter(b => b.status?.toLowerCase() === "pending").length,
      active: bookings.filter(b => b.status?.toLowerCase() === "active").length,
      confirmed: bookings.filter(b => b.status?.toLowerCase() === "confirmed").length,
      reschedule: bookings.filter(b => b.status?.toLowerCase() === "reschedule-proposed").length,
      tutors: tutors.length
    };
  };

  const tabCounts = getTabCounts();

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "tutors") {
      fetchTutors({ search: searchQuery });
    } else {
      const status = tabToStatus[activeTab];
      fetchBookings({ status: status || "" });
    }
  }, [activeTab, searchQuery]);

  // ✅ Filter bookings based on active tab
  const getFilteredBookings = () => {
    if (activeTab === "sessions") {
      return bookings; // Show all
    }
    
    const targetStatus = tabToStatus[activeTab];
    if (!targetStatus) return [];
    
    return bookings.filter(b => 
      b.status?.toLowerCase() === targetStatus.toLowerCase()
    );
  };

  const filteredBookings = getFilteredBookings();

  // ✅ Apply search filter
  const applySearch = (items) => {
    const q = String(searchQuery ?? "").toLowerCase().trim();
    if (!q) return items;
    
    return items.filter(item => {
      const name = String(item?.name ?? item?.participant_name ?? "").toLowerCase().trim();
      const nameMatch = name.includes(q);
      
      const status = String(item?.status ?? "").toLowerCase().replace("_", " ").trim();
      const statusMatch = status.includes(q);
      
      const purpose = String(item?.purpose ?? "").toLowerCase().trim();
      const purposeMatch = purpose.includes(q);
      
      return nameMatch || statusMatch || purposeMatch;
    });
  };

  const searchedBookings = applySearch(filteredBookings);
  const searchedTutors = applySearch(tutors);

  const displayItems = activeTab === "tutors" ? searchedTutors : searchedBookings;

  return (
    <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <Button 
            size="icon" 
            variant="ghost"  
            onClick={() => {
              if (activeTab === "tutors") {
                fetchTutors({ search: searchQuery });
              } else {
                fetchBookings({ status: tabToStatus[activeTab] || "" });
              }
            }} 
            disabled={isLoading} 
          >
            <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
          </Button>
        </div>

        {/* ✅ Tabs with notification badges */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[
            { key: "sessions", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "active", label: "Active" },
            { key: "tutors", label: "Tutors" }
          ].map(tab => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => setActiveTab(tab.key)}
              className="text-xs relative h-9 px-2"
            >
              <span className="flex items-center gap-1 truncate">
                {tab.label}
                
                {/* ✅ Notification Badge */}
                {tabCounts[tab.key] > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "h-5 min-w-[20px] px-1 text-[10px] font-bold rounded-full",
                      activeTab === tab.key 
                        ? "bg-white text-primary" 
                        : "bg-primary text-white"
                    )}
                  >
                    {tabCounts[tab.key]}
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
            placeholder={activeTab === "tutors" ? "Search tutors..." : "Search sessions..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
              {activeTab === "tutors" ? (
                <Users className="h-10 w-10 text-slate-400" />
              ) : (
                <MessageCircle className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <p className="text-slate-700 font-medium text-lg mb-2">
              {searchQuery ? "No matches found" : `No ${activeTab} items`}
            </p>
            <p className="text-slate-500 text-sm">
              {searchQuery ? "Try a different search term" : "New items will appear here"}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {displayItems.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedBooking(item)}
                className={cn(
                  "cursor-pointer rounded-xl p-4 transition-all border border-slate-100",
                  selectedBooking?.id === item.id 
                    ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md" 
                    : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        String(item?.name ?? "?").charAt(0).toUpperCase()
                      )}
                    </div>
                    {item.status && (
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                        item.status?.toLowerCase() === "pending" && "bg-amber-500",
                        item.status?.toLowerCase() === "confirmed" && "bg-green-500",
                        item.status?.toLowerCase() === "active" && "bg-blue-500",
                        item.status?.toLowerCase() === "reschedule-proposed" && "bg-purple-500",
                        item.status?.toLowerCase() === "completed" && "bg-slate-400",
                        item.status?.toLowerCase() === "expired" && "bg-orange-500",
                        item.status?.toLowerCase().includes("cancelled") && "bg-red-500"
                      )} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900 truncate">
                        {item.name || item.participant_name || "Unknown"}
                      </span>
                      {item.isTutor && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                      )}
                      {item.unread_count > 0 && (
                        <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full">
                          {item.unread_count}
                        </Badge>
                      )}
                    </div>

                    {item.status && (
                      <Badge className={cn(
                        "mb-1.5 text-xs border-0 capitalize",
                        item.status?.toLowerCase() === "active" && "bg-blue-100 text-blue-700",
                        item.status?.toLowerCase() === "pending" && "bg-yellow-100 text-yellow-700",
                        item.status?.toLowerCase() === "confirmed" && "bg-green-100 text-green-700",
                        item.status?.toLowerCase() === "completed" && "bg-slate-100 text-slate-700",
                        item.status?.toLowerCase() === "expired" && "bg-orange-100 text-orange-700",
                        item.status?.toLowerCase().includes("cancelled") && "bg-red-100 text-red-700",
                        item.status?.toLowerCase() === "reschedule-proposed" && "bg-purple-100 text-purple-700"
                      )}>
                        {item.status.replace("_", " ").replace("-", " ").toLowerCase()}
                      </Badge>
                    )}

                    {item.purpose && (
                      <p className="text-sm text-slate-600 truncate mb-1.5">{item.purpose}</p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {item.scheduledAt && (
                        <>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                          {item.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.duration} min</span>
                            </div>
                          )}
                        </>
                      )}
                      {item.completedSessions !== undefined && (
                        <span>{item.completedSessions} sessions</span>
                      )}
                      {item.subjects?.length > 0 && (
                        <span>Teaches {item.subjects.length} subjects</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}