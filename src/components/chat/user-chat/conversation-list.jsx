// // import { Card } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { useUserChatStore } from "@/store/userChatStore";
// // import { Search, MessageCircle, UserPlus, ChevronDown, ChevronUp, Filter, Calendar, Clock } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { useState } from "react";

// // const roleBadgeColors = {
// //   tutor: "bg-blue-100 text-blue-700",
// // };

// // const statusColors = {
// //   pending: "bg-yellow-100 text-yellow-700",
// //   confirmed: "bg-green-100 text-green-700",
// //   active: "bg-blue-100 text-blue-700",
// //   completed: "bg-slate-100 text-slate-700",
// //   cancelled: "bg-red-100 text-red-700",
// // };

// // const categories = ["WAEC", "NECO", "JAMB", "PUTME"];

// // export default function ConversationList({ bookings = [], tutors = [] }) {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [expandedItems, setExpandedItems] = useState({});
// //   const [isLoadingTutors, setIsLoadingTutors] = useState(false);
// //   const [showFilters, setShowFilters] = useState(false);
  
// //   const selectedBooking = useUserChatStore((s) => s.selectedBooking);
// //   const fetchTutors = useUserChatStore((s) => s.fetchTutors);
// //   const setSelectedBooking = (booking) => useUserChatStore.setState({ selectedBooking: booking });

// //   // Combine bookings and tutors (tutors are already filtered by the store)
// //   const combinedList = [...bookings, ...tutors];

// //   // Local filtering for immediate feedback
// //   const filteredList = combinedList.filter((item) => {
// //     const matchesSearch = item.participant_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
// //     // For category filter, check if has subjects in that category
// //     const matchesCategory = !selectedCategory || 
// //       (item.subjects && item.subjects.some(sub => sub.category === selectedCategory));
    
// //     return matchesSearch && matchesCategory;
// //   });

// //   const handleGetTutors = async () => {
// //     setIsLoadingTutors(true);
// //     try {
// //       // Apply filters to API call
// //       await fetchTutors({ 
// //         search: searchQuery || undefined, 
// //         category: selectedCategory || undefined 
// //       });
// //     } catch (error) {
// //       console.error("Error fetching tutors:", error);
// //     } finally {
// //       setIsLoadingTutors(false);
// //     }
// //   };

// //   const toggleSubjects = (itemId) => {
// //     setExpandedItems((prev) => ({
// //       ...prev,
// //       [itemId]: !prev[itemId],
// //     }));
// //   };

// //   const clearFilters = () => {
// //     setSearchQuery("");
// //     setSelectedCategory("");
// //   };

// //   return (
// //     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
// //       <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
// //         <div className="flex items-center justify-between mb-4">
// //           <h1 className="text-2xl font-display font-bold gradient-text">Conversations</h1>
// //           <Button
// //             onClick={handleGetTutors}
// //             disabled={isLoadingTutors}
// //             size="sm"
// //             className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
// //           >
// //             <UserPlus className="h-4 w-4 mr-1.5" />
// //             {isLoadingTutors ? "Loading..." : "Get Tutors"}
// //           </Button>
// //         </div>

// //         {/* Search Bar */}
// //         <div className="relative mb-3">
// //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
// //           <input
// //             placeholder="Search by name or subject..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="pl-10 pr-10 w-full border border-slate-200 rounded-xl p-2 focus:border-indigo-300 focus:ring-indigo-200"
// //           />
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             onClick={() => setShowFilters(!showFilters)}
// //             className={cn(
// //               "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7",
// //               showFilters && "bg-indigo-100"
// //             )}
// //           >
// //             <Filter className="h-4 w-4 text-slate-600" />
// //           </Button>
// //         </div>

// //         {/* Category Filters */}
// //         {showFilters && (
// //           <div className="space-y-2 mb-3 p-3 bg-slate-50 rounded-lg">
// //             <div className="flex items-center justify-between mb-2">
// //               <span className="text-xs font-semibold text-slate-600 uppercase">Exam Category</span>
// //               {(searchQuery || selectedCategory) && (
// //                 <Button
// //                   variant="ghost"
// //                   size="sm"
// //                   onClick={clearFilters}
// //                   className="h-6 text-xs text-indigo-600 hover:text-indigo-700"
// //                 >
// //                   Clear All
// //                 </Button>
// //               )}
// //             </div>
// //             <div className="flex flex-wrap gap-2">
// //               {categories.map((category) => (
// //                 <Button
// //                   key={category}
// //                   variant="outline"
// //                   size="sm"
// //                   onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
// //                   className={cn(
// //                     "h-7 text-xs",
// //                     selectedCategory === category
// //                       ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
// //                       : "hover:bg-slate-100"
// //                   )}
// //                 >
// //                   {category}
// //                 </Button>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Active Filters Display */}
// //         {(searchQuery || selectedCategory) && (
// //           <div className="flex gap-2 items-center text-xs text-slate-600 mb-2">
// //             <span className="font-medium">Filters:</span>
// //             {searchQuery && (
// //               <Badge variant="secondary" className="text-xs">
// //                 Search: "{searchQuery}"
// //               </Badge>
// //             )}
// //             {selectedCategory && (
// //               <Badge variant="secondary" className="text-xs">
// //                 {selectedCategory}
// //               </Badge>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       <ScrollArea className="flex-1">
// //         <div className="p-3 space-y-2">
// //           {filteredList.length === 0 && (
// //             <div className="flex flex-col items-center justify-center py-16 text-center">
// //               <MessageCircle className="h-10 w-10 text-slate-400 mb-2" />
// //               <p className="text-slate-600 font-medium mb-1">No chats or tutors found</p>
// //               <p className="text-slate-400 text-sm">
// //                 {searchQuery || selectedCategory ? "Try different filters" : "Click 'Get Tutors' to find tutors"}
// //               </p>
// //             </div>
// //           )}

// //           {filteredList.map((item) => {
// //             const isExpanded = expandedItems[item.id];
// //             const hasSubjects = item.subjects && item.subjects.length > 0;
// //             const isBooking = item.isBooking;
// //             const isTutor = item.isTutor;

// //             return (
// //               <div
// //                 key={item.id}
// //                 className={cn(
// //                   "conversation-item rounded-xl transition-all duration-200",
// //                   selectedBooking?.id === item.id
// //                     ? "active bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md"
// //                     : "bg-white hover:bg-slate-50 border border-slate-100"
// //                 )}
// //               >
// //                 <div
// //                   onClick={() => setSelectedBooking(item)}
// //                   className="cursor-pointer p-4"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <div className="relative">
// //                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-md">
// //                         {item.participant_name?.charAt(0).toUpperCase() || "T"}
// //                       </div>
// //                       {item.status === "active" && (
// //                         <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
// //                       )}
// //                     </div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center justify-between gap-2 mb-1">
// //                         <span className="truncate font-bold text-slate-900">
// //                           {item.participant_name || "Tutor"}
// //                         </span>
// //                         <div className="flex gap-1">
// //                           {isBooking && item.status && (
// //                             <Badge
// //                               variant="outline"
// //                               className={cn(
// //                                 "shrink-0 text-xs font-semibold border-0 capitalize",
// //                                 statusColors[item.status]
// //                               )}
// //                             >
// //                               {item.status}
// //                             </Badge>
// //                           )}
// //                           {isTutor && (
// //                             <Badge
// //                               variant="outline"
// //                               className={cn(
// //                                 "shrink-0 text-xs font-semibold border-0 capitalize",
// //                                 roleBadgeColors["tutor"]
// //                               )}
// //                             >
// //                               Available
// //                             </Badge>
// //                           )}
// //                         </div>
// //                       </div>
                      
// //                       {/* Show booking details if it's a booking */}
// //                       {isBooking && item.scheduledAt && (
// //                         <div className="flex items-center gap-3 text-xs text-slate-500">
// //                           <span className="flex items-center gap-1">
// //                             <Calendar className="h-3 w-3" />
// //                             {new Date(item.scheduledAt).toLocaleDateString()}
// //                           </span>
// //                           {item.duration && (
// //                             <span className="flex items-center gap-1">
// //                               <Clock className="h-3 w-3" />
// //                               {item.duration} min
// //                             </span>
// //                           )}
// //                         </div>
// //                       )}
                      
// //                       {/* Show subject count for tutors */}
// //                       {isTutor && hasSubjects && (
// //                         <div className="flex items-center gap-2">
// //                           <span className="text-xs text-slate-500">
// //                             {item.subjects.length} subject{item.subjects.length !== 1 ? "s" : ""}
// //                           </span>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Toggle Subjects Button */}
// //                 {hasSubjects && (
// //                   <div className="px-4 pb-3">
// //                     <Button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         toggleSubjects(item.id);
// //                       }}
// //                       variant="ghost"
// //                       size="sm"
// //                       className="w-full justify-between text-xs text-slate-600 hover:bg-slate-100"
// //                     >
// //                       <span>{isExpanded ? "Hide" : "View"} Subjects</span>
// //                       {isExpanded ? (
// //                         <ChevronUp className="h-3 w-3" />
// //                       ) : (
// //                         <ChevronDown className="h-3 w-3" />
// //                       )}
// //                     </Button>

// //                     {/* Subjects List */}
// //                     {isExpanded && (
// //                       <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
// //                         {item.subjects.map((sub) => (
// //                           <div
// //                             key={sub.id}
// //                             className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-slate-700 flex items-center justify-between"
// //                           >
// //                             <span className="font-medium">{sub.subjectName}</span>
// //                             <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full">
// //                               {sub.category}
// //                             </span>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </ScrollArea>
// //     </Card>
// //   );
// // }
















// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useUserChatStore } from "@/store/userChatStore";
// import { 
//   Search, 
//   MessageCircle, 
//   UserPlus, 
//   ChevronDown, 
//   ChevronUp, 
//   Filter, 
//   Calendar, 
//   Clock,
//   MoreVertical,
//   Trash2
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { useState } from "react";

// const roleBadgeColors = {
//   tutor: "bg-blue-100 text-blue-700",
// };

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-700",
//   confirmed: "bg-green-100 text-green-700",
//   active: "bg-blue-100 text-blue-700",
//   completed: "bg-slate-100 text-slate-700",
//   cancelled: "bg-red-100 text-red-700",
// };

// const categories = ["WAEC", "NECO", "JAMB", "PUTME"];

// export default function ConversationList({ bookings = [], tutors = [], onDeleteSession }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [expandedItems, setExpandedItems] = useState({});
//   const [isLoadingTutors, setIsLoadingTutors] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   const selectedBooking = useUserChatStore((s) => s.selectedBooking);
//   const fetchTutors = useUserChatStore((s) => s.fetchTutors);
//   const setSelectedBooking = (booking) => useUserChatStore.setState({ selectedBooking: booking });

//   // Combine bookings and tutors (tutors are already filtered by the store)
//   const combinedList = [...bookings, ...tutors];

//   // Local filtering for immediate feedback
//   const filteredList = combinedList.filter((item) => {
//     const matchesSearch = item.participant_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     // For category filter, check if has subjects in that category
//     const matchesCategory = !selectedCategory || 
//       (item.subjects && item.subjects.some(sub => sub.category === selectedCategory));
    
//     return matchesSearch && matchesCategory;
//   });

//   const handleGetTutors = async () => {
//     setIsLoadingTutors(true);
//     try {
//       // Apply filters to API call
//       await fetchTutors({ 
//         search: searchQuery || undefined, 
//         category: selectedCategory || undefined 
//       });
//     } catch (error) {
//       console.error("Error fetching tutors:", error);
//     } finally {
//       setIsLoadingTutors(false);
//     }
//   };

//   const toggleSubjects = (itemId) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [itemId]: !prev[itemId],
//     }));
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("");
//   };

//   const handleDeleteSession = (e, bookingId) => {
//     e.stopPropagation();
//     if (onDeleteSession) {
//       onDeleteSession(bookingId);
//     }
//   };

//   return (
//     <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
//       <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-display font-bold gradient-text">Conversations</h1>
//           <Button
//             onClick={handleGetTutors}
//             disabled={isLoadingTutors}
//             size="sm"
//             className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
//           >
//             <UserPlus className="h-4 w-4 mr-1.5" />
//             {isLoadingTutors ? "Loading..." : "Get Tutors"}
//           </Button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative mb-3">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <input
//             placeholder="Search by name or subject..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-10 w-full border border-slate-200 rounded-xl p-2 focus:border-indigo-300 focus:ring-indigo-200"
//           />
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setShowFilters(!showFilters)}
//             className={cn(
//               "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7",
//               showFilters && "bg-indigo-100"
//             )}
//           >
//             <Filter className="h-4 w-4 text-slate-600" />
//           </Button>
//         </div>

//         {/* Category Filters */}
//         {showFilters && (
//           <div className="space-y-2 mb-3 p-3 bg-slate-50 rounded-lg">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-xs font-semibold text-slate-600 uppercase">Exam Category</span>
//               {(searchQuery || selectedCategory) && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearFilters}
//                   className="h-6 text-xs text-indigo-600 hover:text-indigo-700"
//                 >
//                   Clear All
//                 </Button>
//               )}
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {categories.map((category) => (
//                 <Button
//                   key={category}
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
//                   className={cn(
//                     "h-7 text-xs",
//                     selectedCategory === category
//                       ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
//                       : "hover:bg-slate-100"
//                   )}
//                 >
//                   {category}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Active Filters Display */}
//         {(searchQuery || selectedCategory) && (
//           <div className="flex gap-2 items-center text-xs text-slate-600 mb-2">
//             <span className="font-medium">Filters:</span>
//             {searchQuery && (
//               <Badge variant="secondary" className="text-xs">
//                 Search: "{searchQuery}"
//               </Badge>
//             )}
//             {selectedCategory && (
//               <Badge variant="secondary" className="text-xs">
//                 {selectedCategory}
//               </Badge>
//             )}
//           </div>
//         )}
//       </div>

//       <ScrollArea className="flex-1">
//         <div className="p-3 space-y-2">
//           {filteredList.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <MessageCircle className="h-10 w-10 text-slate-400 mb-2" />
//               <p className="text-slate-600 font-medium mb-1">No chats or tutors found</p>
//               <p className="text-slate-400 text-sm">
//                 {searchQuery || selectedCategory ? "Try different filters" : "Click 'Get Tutors' to find tutors"}
//               </p>
//             </div>
//           )}

//           {filteredList.map((item) => {
//             const isExpanded = expandedItems[item.id];
//             const hasSubjects = item.subjects && item.subjects.length > 0;
//             const isBooking = item.isBooking;
//             const isTutor = item.isTutor;
//             const canDelete = isBooking && (item.status === "completed" || item.status === "cancelled");

//             return (
//               <div
//                 key={item.id}
//                 className={cn(
//                   "conversation-item rounded-xl transition-all duration-200",
//                   selectedBooking?.id === item.id
//                     ? "active bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md"
//                     : "bg-white hover:bg-slate-50 border border-slate-100"
//                 )}
//               >
//                 <div className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div 
//                       className="flex-1 flex items-center gap-3 cursor-pointer"
//                       onClick={() => setSelectedBooking(item)}
//                     >
//                       <div className="relative">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-md">
//                           {item.participant_name?.charAt(0).toUpperCase() || "T"}
//                         </div>
//                         {item.status === "active" && (
//                           <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between gap-2 mb-1">
//                           <span className="truncate font-bold text-slate-900">
//                             {item.participant_name || "Tutor"}
//                           </span>
//                           <div className="flex gap-1">
//                             {isBooking && item.status && (
//                               <Badge
//                                 variant="outline"
//                                 className={cn(
//                                   "shrink-0 text-xs font-semibold border-0 capitalize",
//                                   statusColors[item.status]
//                                 )}
//                               >
//                                 {item.status}
//                               </Badge>
//                             )}
//                             {isTutor && (
//                               <Badge
//                                 variant="outline"
//                                 className={cn(
//                                   "shrink-0 text-xs font-semibold border-0 capitalize",
//                                   roleBadgeColors["tutor"]
//                                 )}
//                               >
//                                 Available
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
                        
//                         {/* Show booking details if it's a booking */}
//                         {isBooking && item.scheduledAt && (
//                           <div className="flex items-center gap-3 text-xs text-slate-500">
//                             <span className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               {new Date(item.scheduledAt).toLocaleDateString()}
//                             </span>
//                             {item.duration && (
//                               <span className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {item.duration} min
//                               </span>
//                             )}
//                           </div>
//                         )}
                        
//                         {/* Show subject count for tutors */}
//                         {isTutor && hasSubjects && (
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-slate-500">
//                               {item.subjects.length} subject{item.subjects.length !== 1 ? "s" : ""}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* More options menu for bookings */}
//                     {canDelete && (
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 rounded-full hover:bg-slate-100"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <MoreVertical className="h-4 w-4 text-slate-600" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48">
//                           <DropdownMenuItem 
//                             onClick={(e) => handleDeleteSession(e, item.id)}
//                             className="text-red-600 focus:text-red-700 focus:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Delete Session
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     )}
//                   </div>
//                 </div>

//                 {/* Toggle Subjects Button */}
//                 {hasSubjects && (
//                   <div className="px-4 pb-3">
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleSubjects(item.id);
//                       }}
//                       variant="ghost"
//                       size="sm"
//                       className="w-full justify-between text-xs text-slate-600 hover:bg-slate-100"
//                     >
//                       <span>{isExpanded ? "Hide" : "View"} Subjects</span>
//                       {isExpanded ? (
//                         <ChevronUp className="h-3 w-3" />
//                       ) : (
//                         <ChevronDown className="h-3 w-3" />
//                       )}
//                     </Button>

//                     {/* Subjects List */}
//                     {isExpanded && (
//                       <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
//                         {item.subjects.map((sub) => (
//                           <div
//                             key={sub.id}
//                             className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-slate-700 flex items-center justify-between"
//                           >
//                             <span className="font-medium">{sub.subjectName}</span>
//                             <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full">
//                               {sub.category}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </ScrollArea>
//     </Card>
//   );
// }










import { useUserChatStore } from "@/store/userChatStore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Calendar, Clock, Users, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const roleBadgeColors = {
  admin: "bg-rose-100 text-rose-700",
  tutor: "bg-blue-100 text-blue-700",
  support: "bg-emerald-100 text-emerald-700",
};

const statusColors = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  active: "bg-blue-500",
  completed: "bg-slate-400",
  cancelled: "bg-red-500",
};

export default function EnhancedConversationList({ bookings, tutors, onDeleteSession }) {
  const { selectedBooking, fetchBookings, fetchTutors, isLoading } = useUserChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "tutors"

  const setSelectedBooking = (booking) => {
    useUserChatStore.setState({ selectedBooking: booking });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const diff = Date.now() - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleRefresh = async () => {
    await Promise.all([fetchBookings(), fetchTutors()]);
  };

  // Filter items based on search
  const filteredBookings = bookings.filter((booking) =>
    booking.participant_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutors = tutors.filter((tutor) =>
    tutor.participant_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayItems = activeTab === "bookings" ? filteredBookings : filteredTutors;

  return (
    <Card className="h-full border-0 rounded-none bg-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display font-bold gradient-text">
            Messages
          </h1>
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
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all",
              activeTab === "bookings"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Sessions</span>
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
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>Tutors</span>
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
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                {activeTab === "bookings" ? (
                  <MessageCircle className="h-10 w-10 text-slate-400" />
                ) : (
                  <Users className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <p className="text-slate-600 font-medium mb-1">
                {searchQuery ? "No results found" : 
                 activeTab === "bookings" ? "No sessions yet" : "No tutors available"}
              </p>
              <p className="text-slate-400 text-sm">
                {activeTab === "bookings" 
                  ? "Your chat sessions will appear here" 
                  : "Available tutors will be listed here"}
              </p>
            </div>
          )}

          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedBooking(item)}
              className={cn(
                "conversation-item cursor-pointer rounded-xl p-4 transition-all duration-200",
                selectedBooking?.id === item.id
                  ? "active bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md"
                  : "bg-white hover:bg-slate-50 border border-slate-100"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                    {item.participant_name?.charAt(0).toUpperCase() || "T"}
                  </div>
                  {/* Status indicator */}
                  {item.isBooking && (
                    <div
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                        statusColors[item.status] || "bg-slate-400"
                      )}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name and Time */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate font-bold text-slate-900">
                        {item.participant_name || "Tutor"}
                      </span>
                      {item.isTutor && (
                        <Badge variant="outline" className="shrink-0 text-xs font-semibold border-0 bg-green-100 text-green-700">
                          Available
                        </Badge>
                      )}
                    </div>
                    {item.last_message_time && (
                      <span className="text-xs text-slate-400 font-medium shrink-0">
                        {formatTime(item.last_message_time)}
                      </span>
                    )}
                  </div>

                  {/* Status Badge for Bookings */}
                  {item.isBooking && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs mb-2 border-0 capitalize font-semibold",
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

                  {/* Last Message or Purpose */}
                  {item.last_message ? (
                    <p className="text-sm text-slate-600 truncate mb-2">
                      {item.last_message}
                    </p>
                  ) : item.purpose ? (
                    <p className="text-sm text-slate-600 truncate mb-2">
                      {item.purpose}
                    </p>
                  ) : item.bio ? (
                    <p className="text-sm text-slate-500 truncate mb-2">
                      {item.bio}
                    </p>
                  ) : null}

                  {/* Booking Details or Tutor Info */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.scheduledAt ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(item.scheduledAt).toLocaleDateString("en-US", { 
                              month: "short", 
                              day: "numeric" 
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
                    ) : null}
                  </div>
                </div>

                {/* Unread Badge */}
                {item.unread_count > 0 && (
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg">
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