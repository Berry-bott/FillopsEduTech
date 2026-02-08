


// import { useEffect, useState } from "react";
// import { useUserChatStore } from "@/store/userChatStore";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, MessageCircle, Calendar, Clock, Users, RefreshCw } from "lucide-react";
// import { cn } from "@/lib/utils";

// const statusColors = {
//   pending: "bg-amber-500",
//   confirmed: "bg-emerald-500",
//   active: "bg-blue-500",
//   completed: "bg-slate-400",
//   cancelled: "bg-red-500",
// };

// export default function EnhancedConversationList({ bookings, tutors }) {
//   const { 
//     selectedBooking, 
//     setSelectedBooking, 
//     fetchBookings, 
//     fetchTutors, 
//     isLoading 
//   } = useUserChatStore();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "tutors"

//   // Auto-fetch when switching tabs
//   useEffect(() => {
//     if (activeTab === "bookings") {
//       fetchBookings();
//     } else if (activeTab === "tutors") {
//       fetchTutors(); // no search param here — we filter client-side
//     }
//   }, [activeTab, fetchBookings, fetchTutors]);

//   // Client-side filtering for both name and subject
//   const filteredBookings = bookings.filter((booking) =>
//     booking.participant_name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredTutors = tutors.filter((tutor) => {
//     const lowerQuery = searchQuery.toLowerCase().trim();

//     if (!lowerQuery) return true;

//     // Search by name
//     const nameMatch = tutor.participant_name?.toLowerCase().includes(lowerQuery);

//     // Search by subject (any subject contains the query)
//     const subjectMatch = tutor.subjects?.some((sub) =>
//       sub.subjectName?.toLowerCase().includes(lowerQuery)
//     );

//     return nameMatch || subjectMatch;
//   });

//   const displayItems = activeTab === "bookings" ? filteredBookings : filteredTutors;

//   const handleRefresh = async () => {
//     if (activeTab === "bookings") {
//       await fetchBookings();
//     } else {
//       await fetchTutors();
//     }
//   };

//   return (
//     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
//       {/* Header */}
//       <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
//           <Button
//             size="icon"
//             variant="ghost"
//             onClick={handleRefresh}
//             disabled={isLoading}
//             className="rounded-full hover:bg-slate-100"
//           >
//             <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
//           </Button>
//         </div>

//         {/* Search */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder={
//               activeTab === "tutors"
//                 ? "Search by name or subject (e.g. Mathematics)"
//                 : "Search conversations..."
//             }
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 bg-white border-slate-200 focus:border-indigo-400 rounded-xl"
//           />
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2">
//           <button
//             onClick={() => setActiveTab("bookings")}
//             className={cn(
//               "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all",
//               activeTab === "bookings"
//                 ? "bg-primary text-white shadow-md"
//                 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//             )}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <MessageCircle className="h-4 w-4" />
//               Sessions
//               {bookings.length > 0 && (
//                 <Badge className="bg-white/20 text-white border-0 text-xs">
//                   {bookings.length}
//                 </Badge>
//               )}
//             </div>
//           </button>

//           <button
//             onClick={() => setActiveTab("tutors")}
//             className={cn(
//               "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all",
//               activeTab === "tutors"
//                 ? "bg-primary text-white shadow-md"
//                 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//             )}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <Users className="h-4 w-4" />
//               Tutors
//               {tutors.length > 0 && (
//                 <Badge className="bg-white/20 text-white border-0 text-xs">
//                   {tutors.length}
//                 </Badge>
//               )}
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* List */}
//       <ScrollArea className="flex-1">
//         <div className="p-3 space-y-2">
//           {displayItems.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
//                 {activeTab === "bookings" ? (
//                   <MessageCircle className="h-10 w-10 text-slate-400" />
//                 ) : (
//                   <Users className="h-10 w-10 text-slate-400" />
//                 )}
//               </div>

//               <p className="text-slate-700 font-medium text-lg mb-2">
//                 {searchQuery
//                   ? "No matches found"
//                   : activeTab === "bookings"
//                   ? "No sessions yet"
//                   : "No tutors found"}
//               </p>

//               <p className="text-slate-500 text-sm">
//                 {activeTab === "tutors" && searchQuery
//                   ? "Try a different name or subject (e.g. Physics, English)"
//                   : activeTab === "tutors"
//                   ? "Available tutors will appear here"
//                   : "Your active sessions will appear here"}
//               </p>
//             </div>
//           )}

//           {displayItems.map((item, idx) => (
//             <div
//               key={item.id}
//               onClick={() => setSelectedBooking(item)}
//               className={cn(
//                 "cursor-pointer rounded-xl p-4 transition-all duration-200 border border-slate-100",
//                 selectedBooking?.id === item.id
//                   ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md"
//                   : "hover:bg-slate-50"
//               )}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Avatar + status dot */}
//                 <div className="relative flex-shrink-0">
//                   <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
//                     {item.participant_name?.charAt(0)?.toUpperCase() || "T"}
//                   </div>

//                   {item.isBooking && (
//                     <div
//                       className={cn(
//                         "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
//                         statusColors[item.status] || "bg-slate-400"
//                       )}
//                     />
//                   )}
//                 </div>

//                 {/* Main content */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between gap-2 mb-1">
//                     <span className="font-bold text-slate-900 truncate">
//                       {item.participant_name || "Unknown"}
//                     </span>

//                     {item.isTutor && (
//                       <Badge className="bg-green-100 text-green-700 border-0 text-xs">
//                         Available
//                       </Badge>
//                     )}
//                   </div>

//                   {/* Status for bookings */}
//                   {item.isBooking && (
//                     <Badge
//                       className={cn(
//                         "mb-1.5 text-xs border-0 capitalize",
//                         item.status === "active" && "bg-blue-100 text-blue-700",
//                         item.status === "pending" && "bg-yellow-100 text-yellow-700",
//                         item.status === "confirmed" && "bg-green-100 text-green-700",
//                         item.status === "completed" && "bg-slate-100 text-slate-700",
//                         item.status === "cancelled" && "bg-red-100 text-red-700"
//                       )}
//                     >
//                       {item.status}
//                     </Badge>
//                   )}

//                   {/* Last message / purpose / bio */}
//                   {item.last_message ? (
//                     <p className="text-sm text-slate-600 truncate mb-1.5">
//                       {item.last_message}
//                     </p>
//                   ) : item.purpose ? (
//                     <p className="text-sm text-slate-600 truncate mb-1.5">
//                       {item.purpose}
//                     </p>
//                   ) : item.bio ? (
//                     <p className="text-sm text-slate-500 truncate mb-1.5">
//                       {item.bio}
//                     </p>
//                   ) : null}

//                   {/* Extra info line */}
//                   <div className="flex items-center gap-3 text-xs text-slate-500">
//                     {item.scheduledAt ? (
//                       <>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-3 w-3" />
//                           <span>
//                             {new Date(item.scheduledAt).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                             })}
//                           </span>
//                         </div>
//                         {item.duration && (
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                             <span>{item.duration} min</span>
//                           </div>
//                         )}
//                       </>
//                     ) : item.completedSessions !== undefined ? (
//                       <span>{item.completedSessions} sessions</span>
//                     ) : item.isTutor && item.subjects?.length > 0 ? (
//                       <span>
//                         Teaches {item.subjects.length} subject
//                         {item.subjects.length !== 1 ? "s" : ""}
//                       </span>
//                     ) : null}
//                   </div>
//                 </div>

//                 {/* Unread count */}
//                 {item.unread_count > 0 && (
//                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
//                     {item.unread_count > 9 ? "9+" : item.unread_count}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </Card>
//   );
// }











// import { useEffect, useState } from "react";
// import { useUserChatStore } from "@/store/userChatStore";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Search, MessageCircle, Users, RefreshCw } from "lucide-react";
// import { cn } from "@/lib/utils";

// const statusColors = {
//   pending: "bg-amber-500",
//   reschedule_proposed: "bg-purple-500",
//   confirmed: "bg-emerald-500",
//   active: "bg-blue-500",
//   completed: "bg-slate-400",
//   cancelled: "bg-red-500",
//   expired: "bg-orange-500",
// };

// export default function EnhancedConversationList({
//   bookings,
//   tutors,
//   activeTab,
//   setActiveTab,
//   searchQuery,
//   setSearchQuery,
//   statusFilter,
//   setStatusFilter,
// }) {
//   const { 
//     selectedBooking, 
//     setSelectedBooking, 
//     fetchBookings, 
//     fetchTutors, 
//     isLoading 
//   } = useUserChatStore();

//   // Auto-fetch when switching tabs or filters change
//   useEffect(() => {
//     if (activeTab === "bookings") {
//       fetchBookings({ status: statusFilter });
//     } else if (activeTab === "tutors") {
//       fetchTutors({ search: searchQuery });
//     }
//   }, [activeTab, statusFilter, searchQuery, fetchBookings, fetchTutors]);

// // Client-side filtering for search (bookings & tutors)
// const filteredBookings = bookings.filter((booking) => {
//   // Extremely safe: never call methods on potentially undefined values
//   const name = (booking?.participant_name ?? "").toString().toLowerCase().trim();
//   const query = (searchQuery ?? "").toString().toLowerCase().trim();
//   return name.includes(query);
// });

// const filteredTutors = tutors.filter((tutor) => {
//   const lowerQuery = (searchQuery ?? "").toString().toLowerCase().trim();
//   if (!lowerQuery) return true;

//   // Safe name
//   const name = (tutor?.participant_name ?? "").toString().toLowerCase().trim();
//   const nameMatch = name.includes(lowerQuery);

//   // Safe subjects check
//   const subjectMatch = Array.isArray(tutor?.subjects)
//     ? tutor.subjects.some((sub) => {
//         const subName = (sub?.subjectName ?? "").toString().toLowerCase().trim();
//         return subName.includes(lowerQuery);
//       })
//     : false;

//   return nameMatch || subjectMatch;
// });

// const displayItems = activeTab === "bookings" ? filteredBookings : filteredTutors;

//   const handleRefresh = async () => {
//     if (activeTab === "bookings") {
//       await fetchBookings({ status: statusFilter });
//     } else {
//       await fetchTutors({ search: searchQuery });
//     }
//   };

//   return (
//     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
//       {/* Header */}
//       <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
//           <Button
//             size="icon"
//             variant="ghost"
//             onClick={handleRefresh}
//             disabled={isLoading}
//             className="rounded-full hover:bg-slate-100"
//           >
//             <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
//           </Button>
//         </div>

//         {/* Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="bookings">
//               <MessageCircle className="h-4 w-4 mr-2" />
//               Sessions
//             </TabsTrigger>
//             <TabsTrigger value="tutors">
//               <Users className="h-4 w-4 mr-2" />
//               Tutors
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>

//         {/* Search */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder={
//               activeTab === "tutors"
//                 ? "Search by name or subject..."
//                 : "Search conversations..."
//             }
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 bg-white border-slate-200 focus:border-indigo-400 rounded-xl"
//           />
//         </div>

//         {/* Status Filters - ONLY when Sessions tab is active */}
//         {activeTab === "bookings" && (
//           <div className="mb-4">
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 size="sm"
//                 variant={statusFilter === "" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("")}
//                 className="text-xs px-3 py-1"
//               >
//                 All
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "pending" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("pending")}
//                 className="text-xs px-3 py-1"
//               >
//                 Pending
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "reschedule_proposed" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("reschedule_proposed")}
//                 className="text-xs px-3 py-1"
//               >
//                 Reschedule
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "confirmed" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("confirmed")}
//                 className="text-xs px-3 py-1"
//               >
//                 Confirmed
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "active" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("active")}
//                 className="text-xs px-3 py-1"
//               >
//                 Active
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "completed" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("completed")}
//                 className="text-xs px-3 py-1"
//               >
//                 Completed
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "cancelled" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("cancelled")}
//                 className="text-xs px-3 py-1"
//               >
//                 Cancelled
//               </Button>
//               <Button
//                 size="sm"
//                 variant={statusFilter === "expired" ? "default" : "outline"}
//                 onClick={() => setStatusFilter("expired")}
//                 className="text-xs px-3 py-1"
//               >
//                 Expired
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* List */}
//       <ScrollArea className="flex-1">
//         <div className="p-3 space-y-2">
//           {displayItems.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
//                 {activeTab === "bookings" ? (
//                   <MessageCircle className="h-10 w-10 text-slate-400" />
//                 ) : (
//                   <Users className="h-10 w-10 text-slate-400" />
//                 )}
//               </div>

//               <p className="text-slate-700 font-medium text-lg mb-2">
//                 {searchQuery
//                   ? "No matches found"
//                   : activeTab === "bookings"
//                   ? "No sessions yet"
//                   : "No tutors found"}
//               </p>

//               <p className="text-slate-500 text-sm">
//                 {activeTab === "tutors" && searchQuery
//                   ? "Try a different name or subject"
//                   : activeTab === "tutors"
//                   ? "Available tutors will appear here"
//                   : "Your sessions will appear here"}
//               </p>
//             </div>
//           )}

//           {displayItems.map((item) => (
//             <div
//               key={item.id}
//               onClick={() => setSelectedBooking(item)}
//               className={cn(
//                 "cursor-pointer rounded-xl p-4 transition-all duration-200 border border-slate-100",
//                 selectedBooking?.id === item.id
//                   ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md"
//                   : "hover:bg-slate-50"
//               )}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Avatar + status dot */}
//                 <div className="relative flex-shrink-0">
//                   <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
//                     {item.participant_name?.charAt(0)?.toUpperCase() || "T"}
//                   </div>

//                   {item.isBooking && (
//                     <div
//                       className={cn(
//                         "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
//                         statusColors[item.status] || "bg-slate-400"
//                       )}
//                     />
//                   )}
//                 </div>

//                 {/* Main content */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between gap-2 mb-1">
//                     <span className="font-bold text-slate-900 truncate">
//                       {item.participant_name || "Unknown"}
//                     </span>

//                     {item.isTutor && (
//                       <Badge className="bg-green-100 text-green-700 border-0 text-xs">
//                         Available
//                       </Badge>
//                     )}
//                   </div>

//                   {/* Status badge */}
//                   {item.isBooking && (
//                     <Badge
//                       className={cn(
//                         "mb-1.5 text-xs border-0 capitalize",
//                         item.status === "active" && "bg-blue-100 text-blue-700",
//                         item.status === "pending" && "bg-yellow-100 text-yellow-700",
//                         item.status === "confirmed" && "bg-green-100 text-green-700",
//                         item.status === "completed" && "bg-slate-100 text-slate-700",
//                         item.status === "cancelled" && "bg-red-100 text-red-700",
//                         item.status === "reschedule_proposed" && "bg-purple-100 text-purple-700",
//                         item.status === "expired" && "bg-orange-100 text-orange-700"
//                       )}
//                     >
//                       {item.status.replace("_", " ")}
//                     </Badge>
//                   )}

//                   {/* Last message / purpose / bio */}
//                   {item.last_message ? (
//                     <p className="text-sm text-slate-600 truncate mb-1.5">
//                       {item.last_message}
//                     </p>
//                   ) : item.purpose ? (
//                     <p className="text-sm text-slate-600 truncate mb-1.5">
//                       {item.purpose}
//                     </p>
//                   ) : item.bio ? (
//                     <p className="text-sm text-slate-500 truncate mb-1.5">
//                       {item.bio}
//                     </p>
//                   ) : null}

//                   {/* Extra info */}
//                   <div className="flex items-center gap-3 text-xs text-slate-500">
//                     {item.scheduledAt && (
//                       <>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-3 w-3" />
//                           <span>
//                             {new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//                           </span>
//                         </div>
//                         {item.duration && (
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                             <span>{item.duration} min</span>
//                           </div>
//                         )}
//                       </>
//                     )}
//                     {item.completedSessions !== undefined && (
//                       <span>{item.completedSessions} sessions</span>
//                     )}
//                     {item.isTutor && item.subjects?.length > 0 && (
//                       <span>Teaches {item.subjects.length} subject{item.subjects.length !== 1 ? "s" : ""}</span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Unread count */}
//                 {item.unread_count > 0 && (
//                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
//                     {item.unread_count > 9 ? "9+" : item.unread_count}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </Card>
//   );
// }




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

//   // ✅ Keep your original tab structure
//   const tabToStatus = {
//     sessions: "",                       // All sessions (backend should return all statuses)
//     pending: "PENDING",
//     active: "ACTIVE",
//     reschedule: "RESCHEDULE_PROPOSED",
//     tutors: null                        // Tutors tab
//   };

//   // Debug
//   useEffect(() => {
//     console.log(`[List] Tab: ${activeTab} | Status sent: ${tabToStatus[activeTab] ?? "all"} | Search: "${searchQuery}"`);
//     console.log(`[List] Bookings loaded: ${bookings.length}, Tutors loaded: ${tutors.length}`);
//   }, [activeTab, searchQuery, bookings, tutors]);

//   // Fetch on tab/search change
//   // In EnhancedConversationList.jsx

// // Fetch on tab/search change
// useEffect(() => {
//   if (activeTab === "tutors") {
//     fetchTutors({ search: searchQuery });
//   } else {
//     const status = tabToStatus[activeTab] ?? "";
//     fetchBookings({ status });
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [activeTab, searchQuery]);

// // ✅ UPDATED: Enhanced search filters
// const filteredBookings = bookings.filter(b => {
//   const q = String(searchQuery ?? "").toLowerCase().trim();
//   if (!q) return true; // No search query = show all
  
//   // Search by tutor name
//   const name = String(b?.name ?? "").toLowerCase().trim();
//   const nameMatch = name.includes(q);
  
//   // Search by status (e.g., "expired", "pending", "active")
//   const status = String(b?.status ?? "").toLowerCase().replace("_", " ").trim();
//   const statusMatch = status.includes(q);
  
//   // Search by purpose (e.g., "mathematics", "physics")
//   const purpose = String(b?.purpose ?? "").toLowerCase().trim();
//   const purposeMatch = purpose.includes(q);
  
//   return nameMatch || statusMatch || purposeMatch;
// });

// const filteredTutors = tutors.filter(t => {
//   const q = String(searchQuery ?? "").toLowerCase().trim();
//   if (!q) return true;
  
//   // Search by tutor name
//   const name = String(t?.name ?? "").toLowerCase().trim(); 
  
//   // Search by subjects they teach
//   const subjectsMatch = t.subjects?.some(s =>
//     String(s?.subjectName ?? "").toLowerCase().trim().includes(q)
//   ) ?? false;
  
//   return name.includes(q) || subjectsMatch;
// });
//   // useEffect(() => {
//   //   if (activeTab === "tutors") {
//   //     fetchTutors({ search: searchQuery });
//   //   } else {
//   //     const status = tabToStatus[activeTab] ?? "";
//   //     fetchBookings({ status });
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [activeTab, searchQuery]);

//   // const filteredBookings = bookings.filter(b => {
//   //   const name = String(b?.name ?? "").toLowerCase().trim(); 
//   //   const q = String(searchQuery ?? "").toLowerCase().trim();
//   //   return name.includes(q);
//   // });

//   // const filteredTutors = tutors.filter(t => {
//   //   const q = String(searchQuery ?? "").toLowerCase().trim();
//   //   if (!q) return true;
//   //   const name = String(t?.name ?? "").toLowerCase().trim(); 
//   //   const subjectsMatch = t.subjects?.some(s =>
//   //     String(s?.subjectName ?? "").toLowerCase().trim().includes(q)
//   //   ) ?? false;
//   //   return name.includes(q) || subjectsMatch;
//   // });

//   const displayItems = activeTab === "tutors" ? filteredTutors : filteredBookings;

//   return (
//     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
//       <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
//           <Button size="icon" variant="ghost" onClick={() => {
//             if (activeTab === "tutors") fetchTutors({ search: searchQuery });
//             else fetchBookings({ status: tabToStatus[activeTab] ?? "" });
//           }} disabled={isLoading}>
//             <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
//           </Button>
//         </div>

//         {/* Tabs - Keep original */}
//         <div className="grid grid-cols-5 gap-2 mb-4">
//           {["sessions", "pending", "active", "reschedule", "tutors"].map(tab => (
//             <Button
//               key={tab}
//               variant={activeTab === tab ? "default" : "outline"}
//               onClick={() => setActiveTab(tab)}
//               className="text-xs capitalize"
//             >
//               {tab === "sessions" ? "All Sessions" : 
//                tab === "reschedule" ? "Reschedule" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
//               console.log("🔍 Rendering item:", {
//                 id: item.id,
//                 name: item.name,
//                 status: item.status,
//                 isTutor: item.isTutor,
//                 activeTab: activeTab
//               });

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

// // export default function EnhancedConversationList({
// //   bookings,
// //   tutors,
// //   activeTab,
// //   setActiveTab,
// //   searchQuery,
// //   setSearchQuery,
// // }) {
// //   const { 
// //     selectedBooking, 
// //     setSelectedBooking, 
// //     fetchBookings, 
// //     fetchTutors, 
// //     isLoading 
// //   } = useUserChatStore();

// //   // Map frontend tab → backend uppercase status
// //   const tabToStatus = {
// //     sessions: "",                       // All (no filter)
// //     pending: "PENDING",
// //     active: "ACTIVE",
// //     reschedule: "RESCHEDULE_PROPOSED",
// //     tutors: null                        // Tutors tab
// //   };

// //   // Debug
// //   useEffect(() => {
// //     console.log(`[List] Tab: ${activeTab} | Status sent: ${tabToStatus[activeTab] ?? "all"} | Search: "${searchQuery}"`);
// //     console.log(`[List] Bookings loaded: ${bookings.length}, Tutors loaded: ${tutors.length}`);
// //   }, [activeTab, searchQuery, bookings, tutors]);

// //   // Fetch on tab/search change - FIXED: Removed functions from dependencies
// //   useEffect(() => {
// //     if (activeTab === "tutors") {
// //       fetchTutors({ search: searchQuery });
// //     } else {
// //       const status = tabToStatus[activeTab] ?? "";
// //       fetchBookings({ status });
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [activeTab, searchQuery]);

// //   const filteredBookings = bookings.filter(b => {
// //     const name = String(b?.name ?? "").toLowerCase().trim(); 
// //     const q = String(searchQuery ?? "").toLowerCase().trim();
// //     return name.includes(q);
// //   });

// //   const filteredTutors = tutors.filter(t => {
// //     const q = String(searchQuery ?? "").toLowerCase().trim();
// //     if (!q) return true;
// //     const name = String(t?.name ?? "").toLowerCase().trim(); 
// //     const subjectsMatch = t.subjects?.some(s =>
// //       String(s?.subjectName ?? "").toLowerCase().trim().includes(q)
// //     ) ?? false;
// //     return name.includes(q) || subjectsMatch;
// //   });

// //   const displayItems = activeTab === "tutors" ? filteredTutors : filteredBookings;

// //   return (
// //     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
// //       <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
// //         <div className="flex items-center justify-between mb-4">
// //           <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
// //           <Button size="icon" variant="ghost" onClick={() => {
// //             if (activeTab === "tutors") fetchTutors({ search: searchQuery });
// //             else fetchBookings({ status: tabToStatus[activeTab] ?? "" });
// //           }} disabled={isLoading}>
// //             <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
// //           </Button>
// //         </div>

// //         {/* Tabs */}
// //         <div className="grid grid-cols-5 gap-2 mb-4">
// //           {["sessions", "pending", "active", "reschedule", "tutors"].map(tab => (
// //             <Button
// //               key={tab}
// //               variant={activeTab === tab ? "default" : "outline"}
// //               onClick={() => setActiveTab(tab)}
// //               className="text-xs capitalize"
// //             >
// //               {tab === "sessions" ? "All Sessions" : 
// //                tab === "reschedule" ? "Reschedule" : tab.charAt(0).toUpperCase() + tab.slice(1)}
// //             </Button>
// //           ))}
// //         </div>

// //         {/* Search */}
// //         <div className="relative mb-4">
// //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
// //           <Input
// //             placeholder={activeTab === "tutors" ? "Search tutors..." : "Search sessions..."}
// //             value={searchQuery}
// //             onChange={e => setSearchQuery(e.target.value)}
// //             className="pl-10"
// //           />
// //         </div>
// //       </div>

// //       <ScrollArea className="flex-1">
// //         {isLoading ? (
// //           <div className="flex flex-col items-center justify-center py-20">
// //             <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
// //             <p className="text-slate-600">Loading...</p>
// //           </div>
// //         ) : displayItems.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
// //             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
// //               {activeTab === "tutors" ? <Users className="h-10 w-10 text-slate-400" /> : <MessageCircle className="h-10 w-10 text-slate-400" />}
// //             </div>
// //             <p className="text-slate-700 font-medium text-lg mb-2">
// //               {searchQuery ? "No matches found" : `No ${activeTab === "sessions" ? "sessions" : activeTab} items`}
// //             </p>
// //             <p className="text-slate-500 text-sm">New items will appear here</p>
// //           </div>
// //         ) : (
// //           <div className="p-3 space-y-2">
// //             {displayItems.map(item => {
// //               // ✅ DEBUG LOG - Add this
// //               console.log("🔍 Rendering item:", {
// //                 id: item.id,
// //                 name: item.name,
// //                 isTutor: item.isTutor,
// //                 activeTab: activeTab
// //               });

// //               return (
// //                 <div
// //                   key={item.id}
// //                   onClick={() => setSelectedBooking(item)}
// //                   className={cn(
// //                     "cursor-pointer rounded-xl p-4 transition-all border border-slate-100",
// //                     selectedBooking?.id === item.id ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md" : "hover:bg-slate-50"
// //                   )}
// //                 >
// //                   <div className="flex items-start gap-3">
// //                     <div className="relative flex-shrink-0">
// //                       {/* ✅ FIXED: Use item.name directly */}
// //                       <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
// //                         {String(item?.name ?? "?").charAt(0).toUpperCase()}
// //                       </div>
// //                       {item.status && (
// //                         <div className={cn(
// //                           "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
// //                           item.status === "PENDING" ? "bg-amber-500" :
// //                           item.status === "ACTIVE" ? "bg-blue-500" :
// //                           item.status === "RESCHEDULE_PROPOSED" ? "bg-purple-500" :
// //                           item.status === "COMPLETED" ? "bg-slate-400" :
// //                           item.status.includes("CANCELLED") ? "bg-red-500" : "bg-orange-500"
// //                         )} />
// //                       )}
// //                     </div>

// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center justify-between gap-2 mb-1">
// //                         {/* ✅ FIXED: Use item.name directly */}
// //                         <span className="font-bold text-slate-900 truncate">
// //                           {item.name || "Unknown"}
// //                         </span>
// //                         {item.isTutor && (
// //                           <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
// //                         )}
// //                       </div>

// //                       {item.status && (
// //                         <Badge className={cn(
// //                           "mb-1.5 text-xs border-0 capitalize",
// //                           item.status === "ACTIVE" && "bg-blue-100 text-blue-700",
// //                           item.status === "PENDING" && "bg-yellow-100 text-yellow-700",
// //                           item.status === "COMPLETED" && "bg-slate-100 text-slate-700",
// //                           item.status.includes("CANCELLED") && "bg-red-100 text-red-700",
// //                           item.status === "RESCHEDULE_PROPOSED" && "bg-purple-100 text-purple-700"
// //                         )}>
// //                           {item.status.replace("_", " ").toLowerCase()}
// //                         </Badge>
// //                       )}

// //                       {item.purpose && (
// //                         <p className="text-sm text-slate-600 truncate mb-1.5">{item.purpose}</p>
// //                       )}

// //                       <div className="flex items-center gap-3 text-xs text-slate-500">
// //                         {item.scheduledAt && (
// //                           <>
// //                             <div className="flex items-center gap-1">
// //                               <Calendar className="h-3 w-3" />
// //                               <span>{new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
// //                             </div>
// //                             {item.duration && (
// //                               <div className="flex items-center gap-1">
// //                                 <Clock className="h-3 w-3" />
// //                                 <span>{item.duration} min</span>
// //                               </div>
// //                             )}
// //                           </>
// //                         )}
// //                         {item.completedSessions !== undefined && (
// //                           <span>{item.completedSessions} sessions</span>
// //                         )}
// //                         {item.subjects?.length > 0 && (
// //                           <span>Teaches {item.subjects.length} subjects</span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </ScrollArea>
// //     </Card>
// //   );
// // }











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

  const tabToStatus = {
    sessions: "",
    pending: "PENDING",
    active: "ACTIVE",
    reschedule: "RESCHEDULE_PROPOSED",
    tutors: null
  };

  // ✅ Calculate counts for each tab
  const getTabCounts = () => {
    return {
      sessions: bookings.length,
      pending: bookings.filter(b => b.status === "PENDING").length,
      active: bookings.filter(b => b.status === "ACTIVE").length,
      reschedule: bookings.filter(b => b.status === "RESCHEDULE_PROPOSED").length,
      tutors: tutors.length
    };
  };

  const tabCounts = getTabCounts();


  useEffect(() => {
    if (activeTab === "tutors") {
      fetchTutors({ search: searchQuery });
    } else {
      const status = tabToStatus[activeTab] ?? "";
      fetchBookings({ status });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery]);

  const filteredBookings = bookings.filter(b => {
    const q = String(searchQuery ?? "").toLowerCase().trim();
    if (!q) return true;
    
    const name = String(b?.name ?? "").toLowerCase().trim();
    const nameMatch = name.includes(q);
    
    const status = String(b?.status ?? "").toLowerCase().replace("_", " ").trim();
    const statusMatch = status.includes(q);
    
    const purpose = String(b?.purpose ?? "").toLowerCase().trim();
    const purposeMatch = purpose.includes(q);
    
    return nameMatch || statusMatch || purposeMatch;
  });

  const filteredTutors = tutors.filter(t => {
    const q = String(searchQuery ?? "").toLowerCase().trim();
    if (!q) return true;
    
    const name = String(t?.name ?? "").toLowerCase().trim(); 
    const subjectsMatch = t.subjects?.some(s =>
      String(s?.subjectName ?? "").toLowerCase().trim().includes(q)
    ) ?? false;
    
    return name.includes(q) || subjectsMatch;
  });

  const displayItems = activeTab === "tutors" ? filteredTutors : filteredBookings;

  return (
    <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
      <div className=" py-2 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <Button size="icon" variant="ghost"  onClick={() => {
            if (activeTab === "tutors") fetchTutors({ search: searchQuery });
            else fetchBookings({ status: tabToStatus[activeTab] ?? "" });
          }} disabled={isLoading} >
            <RefreshCw className={cn("h-4 w-6", isLoading && "animate-spin")} />
          </Button>
        </div>

        {/*  Tabs with notification badges */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {["sessions", "pending", "active", "reschedule", "tutors"].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="text-[11px] capitalize relative   w-[85px]"
            >
              <span className="flex items-center gap-">
                {tab === "sessions" ? " Sessions" : 
                 tab === "reschedule" ? "Reschedule" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                
                {/* ✅ Notification Badge */}
                {tabCounts[tab] > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "h-5 min-w-5 px-1 text-[8px] font-bold rounded-full",
                      activeTab === tab 
                        ? "bg-white text-primary" 
                        : "bg-primary text-white"
                    )}
                  >
                    {tabCounts[tab]}
                  </Badge>
                )}
              </span>
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
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
              {activeTab === "tutors" ? <Users className="h-10 w-10 text-slate-400" /> : <MessageCircle className="h-10 w-10 text-slate-400" />}
            </div>
            <p className="text-slate-700 font-medium text-lg mb-2">
              {searchQuery ? "No matches found" : `No ${activeTab === "sessions" ? "sessions" : activeTab} items`}
            </p>
            <p className="text-slate-500 text-sm">New items will appear here</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {displayItems.map(item => {
              console.log("🔍 Rendering item:", {
                id: item.id,
                name: item.name,
                status: item.status,
                isTutor: item.isTutor,
                activeTab: activeTab
              });

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBooking(item)}
                  className={cn(
                    "cursor-pointer rounded-xl p-4 transition-all border border-slate-100",
                    selectedBooking?.id === item.id ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md" : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden">
                        {String(item?.name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      {item.status && (
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                          item.status === "PENDING" ? "bg-amber-500" :
                          item.status === "CONFIRMED" ? "bg-green-500" :
                          item.status === "ACTIVE" ? "bg-blue-500" :
                          item.status === "RESCHEDULE_PROPOSED" ? "bg-purple-500" :
                          item.status === "COMPLETED" ? "bg-slate-400" :
                          item.status === "EXPIRED" ? "bg-orange-500" :
                          item.status.includes("CANCELLED") ? "bg-red-500" : "bg-gray-500"
                        )} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {item.name || "Unknown"}
                        </span>
                        {item.isTutor && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                        )}
                      </div>

                      {item.status && (
                        <Badge className={cn(
                          "mb-1.5 text-xs border-0 capitalize",
                          item.status === "ACTIVE" && "bg-blue-100 text-blue-700",
                          item.status === "PENDING" && "bg-yellow-100 text-yellow-700",
                          item.status === "CONFIRMED" && "bg-green-100 text-green-700",
                          item.status === "COMPLETED" && "bg-slate-100 text-slate-700",
                          item.status === "EXPIRED" && "bg-orange-100 text-orange-700",
                          item.status.includes("CANCELLED") && "bg-red-100 text-red-700",
                          item.status === "RESCHEDULE_PROPOSED" && "bg-purple-100 text-purple-700"
                        )}>
                          {item.status.replace("_", " ").toLowerCase()}
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
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}