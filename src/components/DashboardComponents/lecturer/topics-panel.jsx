// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, Pencil, Trash2, FileText, Search, Loader2, FolderOpen, Eye, MoreHorizontal, AlertTriangle, Calendar, Hash, HelpCircle } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"

// export default function TopicsPanel({ selectedModule, moduleName, subjectName, onTopicSelect, onQuestionSelect, globalSearch, selectedTopicId }) {
//   // Use whichever prop is provided (for backwards compatibility)
//   const handleTopicSelection = onTopicSelect || onQuestionSelect
//   const { toast } = useToast()
//   const { getTopics, createTopic, updateTopic, deleteTopic, getTopicById, loading } = useTutorStore()

//   const [topics, setTopics] = useState([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingTopic, setEditingTopic] = useState(null)
//   const [formData, setFormData] = useState({
//     topicName: "",
//     description: "",
//     content: "",
//   })
//   const [localSearch, setLocalSearch] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [viewingTopic, setViewingTopic] = useState(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [loadingDetails, setLoadingDetails] = useState(false)
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
//   const [topicToDelete, setTopicToDelete] = useState(null)
//   const [isDeleting, setIsDeleting] = useState(false)

//   // Fetch topics when module changes
//   useEffect(() => {
//     console.log("🔍 Selected Module changed:", selectedModule)
//     if (selectedModule) {
//       fetchTopics()
//     } else {
//       setTopics([])
//     }
//   }, [selectedModule])

//   const fetchTopics = async () => {
//     try {
//       const result = await getTopics()
      
//       if (result.success) {
//         const topicsData = result.data.topics || result.data || []
        
//         console.log("🔍 All topics fetched:", topicsData)
//         console.log("🔍 Selected module ID:", selectedModule)
        
//         // Filter topics by selected module
//         const filteredTopics = topicsData.filter((t) => {
//           console.log(`Comparing: "${t.module?.id}" === "${selectedModule}"`, t.module?.id === selectedModule)
//           return t.module?.id === selectedModule
//         })
        
//         console.log("📦 Topics for module:", { selectedModule, filteredTopics })
//         setTopics(filteredTopics)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to fetch topics",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching topics:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load topics",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!selectedModule) {
//       toast({
//         title: "Error",
//         description: "Please select a module first",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const topicData = {
//         topicName: formData.topicName,
//         description: formData.description,
//         content: formData.content,
//       }

//       const result = editingTopic
//         ? await updateTopic(editingTopic.id, topicData)
//         : await createTopic(selectedModule, topicData)

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: editingTopic 
//             ? "Topic updated successfully" 
//             : "Topic created successfully",
//         })

//         await fetchTopics()

//         setFormData({ topicName: "", description: "", content: "" })
//         setEditingTopic(null)
//         setIsDialogOpen(false)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to save topic",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error saving topic:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while saving the topic",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = (topic) => {
//     setEditingTopic(topic)
//     setFormData({
//       topicName: topic.topicName,
//       description: topic.description,
//       content: topic.content || "",
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDeleteClick = (topic) => {
//     setTopicToDelete(topic)
//     setDeleteConfirmOpen(true)
//   }

//   const handleDeleteConfirm = async () => {
//     if (!topicToDelete) return

//     setIsDeleting(true)

//     try {
//       const result = await deleteTopic(topicToDelete.id)
      
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "Topic deleted successfully",
//         })
        
//         await fetchTopics()
//         setDeleteConfirmOpen(false)
//         setTopicToDelete(null)
//       } else {
//         toast({
//           title: "Deletion Failed",
//           description: result.message || "Failed to delete topic",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting topic:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred while deleting the topic",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const handleViewDetails = async (topic) => {
//     setLoadingDetails(true)
//     setDetailsOpen(true)
    
//     try {
//       const result = await getTopicById(topic.id)
      
//       if (result.success) {
//         setViewingTopic(result.data)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load topic details",
//           variant: "destructive",
//         })
//         setDetailsOpen(false)
//       }
//     } catch (error) {
//       console.error("Error loading topic details:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load topic details",
//         variant: "destructive",
//       })
//       setDetailsOpen(false)
//     } finally {
//       setLoadingDetails(false)
//     }
//   }

//   const searchTerm = globalSearch || localSearch

//   const filteredTopics = topics.filter((t) =>
//     searchTerm === "" || 
//     t.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     t.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   if (!selectedModule) {
//     return (
//       <div className="flex items-center justify-center h-[400px]">
//         <div className="text-center space-y-4">
//           <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
//           <div>
//             <p className="text-lg font-semibold text-muted-foreground">No Module Selected</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               Please select a module from the Modules tab to view its topics
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Module Header */}
//       {moduleName && (
//         <div className="flex items-center gap-3 pb-4 border-b">
//           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <FolderOpen className="w-5 h-5 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">{moduleName}</h2>
//             <p className="text-sm text-muted-foreground">
//               {subjectName ? `${subjectName} • Manage topics and create questions` : "Manage topics for this module"}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* TOP BAR */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Search */}
//         <div className="relative w-full sm:w-[300px]">
//           <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//           <Input
//             placeholder="Search topics..."
//             className="w-full bg-background pl-9"
//             value={localSearch}
//             onChange={(e) => setLocalSearch(e.target.value)}
//           />
//         </div>

//         {/* CREATE TOPIC DIALOG */}
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open)
//             if (!open) {
//               setEditingTopic(null)
//               setFormData({ topicName: "", description: "", content: "" })
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="w-full sm:w-auto">
//               <Plus className="mr-2 size-4" />
//               New Topic
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</DialogTitle>
//               <DialogDescription>
//                 {editingTopic ? "Update this" : "Create a new"} topic for <span className="font-semibold text-primary">{moduleName}</span>
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               <div className="space-y-2">
//                 <Label>Topic Name</Label>
//                 <Input
//                   placeholder="e.g., Political Apathy"
//                   value={formData.topicName}
//                   onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Input
//                   placeholder="Brief description of the topic..."
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Content</Label>
//                 <Textarea
//                   placeholder="Detailed content about the topic..."
//                   value={formData.content}
//                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                   rows={6}
//                   required
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setIsDialogOpen(false)}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmit} disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     {editingTopic ? "Updating..." : "Creating..."}
//                   </>
//                 ) : (
//                   <>{editingTopic ? "Update" : "Create"} Topic</>
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* TOPICS GRID */}
//       <div className="grid gap-4">
//         {loading ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="h-12 w-12 animate-spin text-muted-foreground/50 mb-4" />
//               <p className="text-sm text-muted-foreground">Loading topics...</p>
//             </CardContent>
//           </Card>
//         ) : filteredTopics.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <FileText className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center mb-2">
//                 {searchTerm 
//                   ? "No topics found matching your search" 
//                   : `No topics found for ${moduleName}.`}
//               </p>
//               {!searchTerm && (
//                 <p className="text-sm text-muted-foreground">Click "New Topic" to create your first topic.</p>
//               )}
//             </CardContent>
//           </Card>
//         ) : (
//           filteredTopics.map((topic) => (
//             <Card 
//               key={topic.id} 
//               className={`group hover:shadow-md transition-all cursor-pointer ${
//                 selectedTopicId === topic.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
//               }`}
//               onClick={() => handleTopicSelection && handleTopicSelection(topic.id, topic.topicName, moduleName)}
//             >
//               <CardHeader>
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex gap-4 flex-1">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
//                       <FileText className="h-6 w-6 text-primary" />
//                     </div>

//                     <div className="space-y-2 flex-1">
//                       <CardTitle className="text-lg">{topic.topicName}</CardTitle>

//                       <div className="flex flex-wrap gap-2">
//                         {topic.module && (
//                           <Badge variant="outline" className="text-xs">
//                             {topic.module.moduleName}
//                           </Badge>
//                         )}
//                         {topic._count && (
//                           <Badge variant="secondary" className="text-xs">
//                             {topic._count.question || 0} Questions
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* ACTIONS DROPDOWN */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                       <Button 
//                         variant="ghost" 
//                         size="icon"
//                         className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreHorizontal className="size-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={(e) => {
//                         e.stopPropagation()
//                         handleTopicSelection && handleTopicSelection(topic.id, topic.topicName, moduleName)
//                       }}>
//                         <HelpCircle className="size-4 mr-2" />
//                         Manage Questions
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={(e) => {
//                         e.stopPropagation()
//                         handleViewDetails(topic)
//                       }}>
//                         <Eye className="size-4 mr-2" />
//                         View Details
//                       </DropdownMenuItem>
//                       <Separator className="my-1" />
//                       <DropdownMenuItem onClick={(e) => {
//                         e.stopPropagation()
//                         handleEdit(topic)
//                       }}>
//                         <Pencil className="size-4 mr-2" />
//                         Edit Topic
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="text-destructive focus:text-destructive" 
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           handleDeleteClick(topic)
//                         }}
//                       >
//                         <Trash2 className="size-4 mr-2" />
//                         Delete Topic
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
//                   {topic.description}
//                 </p>
                
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   className="w-full"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     handleTopicSelection && handleTopicSelection(topic.id, topic.topicName, moduleName)
//                   }}
//                 >
//                   <HelpCircle className="size-4 mr-2" />
//                   Manage Questions ({topic._count?.question || 0})
//                 </Button>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>

//       {/* DELETE CONFIRMATION DIALOG */}
//       <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="size-5 text-destructive" />
//               Delete Topic
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 Are you sure you want to delete{" "}
//                 <span className="font-semibold text-foreground">
//                   {topicToDelete?.topicName}
//                 </span>
//                 ?
//               </p>
//               <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-2">
//                 <p className="text-destructive font-medium text-sm">
//                   ⚠️ This will permanently delete:
//                 </p>
//                 <div className="text-sm text-muted-foreground space-y-1 ml-4">
//                   <div>• {topicToDelete?._count?.question || 0} questions</div>
//                   <div>• All associated content and progress data</div>
//                 </div>
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 This action cannot be undone.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeleteConfirm}
//               disabled={isDeleting}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Delete Topic
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* VIEW DETAILS DIALOG */}
//       <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="size-5" />
//               Topic Details
//             </DialogTitle>
//             <DialogDescription>
//               Complete information about this topic
//             </DialogDescription>
//           </DialogHeader>

//           {loadingDetails ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//               <p className="text-muted-foreground text-center">Loading topic details...</p>
//             </div>
//           ) : viewingTopic ? (
//             <div className="space-y-6 py-4">
//               <div className="flex items-start gap-4">
//                 <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <FileText className="w-8 h-8 text-primary" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-2xl font-bold">{viewingTopic.topicName}</h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     {viewingTopic.module && (
//                       <Badge variant="secondary">
//                         {viewingTopic.module.moduleName}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <FileText className="size-4" />
//                   Description
//                 </h4>
//                 <p className="text-muted-foreground">
//                   {viewingTopic.description || 'No description provided'}
//                 </p>
//               </div>

//               {viewingTopic.content && (
//                 <>
//                   <Separator />
//                   <div className="space-y-2">
//                     <h4 className="font-semibold">Content</h4>
//                     <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
//                       {viewingTopic.content}
//                     </div>
//                   </div>
//                 </>
//               )}

//               <Separator />

//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Hash className="size-4" />
//                   Statistics
//                 </h4>
//                 <div className="grid grid-cols-1 gap-4">
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <HelpCircle className="size-8 mx-auto mb-2 text-blue-500" />
//                         <p className="text-2xl font-bold">{viewingTopic._count?.question || 0}</p>
//                         <p className="text-xs text-muted-foreground">Questions</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Calendar className="size-4" />
//                   Additional Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Topic ID</p>
//                     <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
//                       {viewingTopic.id || 'N/A'}
//                     </p>
//                   </div>
//                   {viewingTopic.createdAt && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Created At</p>
//                       <p className="font-medium">
//                         {new Date(viewingTopic.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12">
//               <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center">No topic data available</p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailsOpen(false)}>
//               Close
//             </Button>
//             {viewingTopic && (
//               <>
//                 <Button 
//                   variant="default"
//                   onClick={() => {
//                     setDetailsOpen(false)
//                     handleTopicSelection && handleTopicSelection(viewingTopic.id, viewingTopic.topicName, moduleName)
//                   }}
//                 >
//                   <HelpCircle className="size-4 mr-2" />
//                   Manage Questions
//                 </Button>
//                 <Button 
//                   variant="outline"
//                   onClick={() => {
//                     setDetailsOpen(false)
//                     handleEdit(viewingTopic)
//                   }}
//                 >
//                   <Pencil className="size-4 mr-2" />
//                   Edit Topic
//                 </Button>
//               </>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }










import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, FileText, Search, Loader2, FolderOpen, Eye, MoreHorizontal, AlertTriangle, Calendar, Hash, HelpCircle, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

export default function TopicsPanel({ selectedModule, moduleName, subjectName, onTopicSelect, onQuestionSelect, globalSearch, selectedTopicId }) {
  // Use whichever prop is provided (for backwards compatibility)
  const handleTopicSelection = onTopicSelect || onQuestionSelect
  const { toast } = useToast()
  const { getTopics, createTopic, updateTopic, deleteTopic, getTopicById, getSubjects, getModules, loading } = useTutorStore()

  const [topics, setTopics] = useState([])
  const [allTopics, setAllTopics] = useState([]) // Store all topics
  const [subjects, setSubjects] = useState([])
  const [modules, setModules] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [formData, setFormData] = useState({
    topicName: "",
    description: "",
    content: "",
  })
  const [localSearch, setLocalSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingTopic, setViewingTopic] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Filter states
  const [viewMode, setViewMode] = useState("module") 
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterModule, setFilterModule] = useState("all")

  // Fetch topics when module changes or view mode changes
  useEffect(() => {
    console.log("🔍 Selected Module changed:", selectedModule)
    if (viewMode === "module" && selectedModule) {
      fetchTopics()
    } else if (viewMode === "all") {
      fetchAllTopics()
    } else if (viewMode === "module" && !selectedModule) {
      setTopics([])
    }
  }, [selectedModule, viewMode])

  // Fetch subjects and modules for filters
  useEffect(() => {
    if (viewMode === "all") {
      fetchFiltersData()
    }
  }, [viewMode])

  const fetchFiltersData = async () => {
    try {
      const [subjectsRes, modulesRes] = await Promise.all([
        getSubjects(),
        getModules()
      ])

      if (subjectsRes.success) {
        const subjectsData = subjectsRes.data.subjects || subjectsRes.data || []
        setSubjects(subjectsData)
      }

      if (modulesRes.success) {
        const modulesData = modulesRes.data.modules || modulesRes.data || []
        setModules(modulesData)
      }
    } catch (error) {
      console.error("Error fetching filters data:", error)
    }
  }

  const fetchTopics = async () => {
    try {
      const result = await getTopics()
      
      if (result.success) {
        const topicsData = result.data.topics || result.data || []
        
        console.log("🔍 All topics fetched:", topicsData)
        console.log("🔍 Selected module ID:", selectedModule)
        
        // Store all topics
        setAllTopics(topicsData)
        
        // Filter topics by selected module
        const filteredTopics = topicsData.filter((t) => {
          console.log(`Comparing: "${t.module?.id}" === "${selectedModule}"`, t.module?.id === selectedModule)
          return t.module?.id === selectedModule
        })
        
        console.log("📦 Topics for module:", { selectedModule, filteredTopics })
        setTopics(filteredTopics)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch topics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      })
    }
  }

  const fetchAllTopics = async () => {
    try {
      const result = await getTopics()
      
      if (result.success) {
        const topicsData = result.data.topics || result.data || []
        setAllTopics(topicsData)
        setTopics(topicsData)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch topics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedModule) {
      toast({
        title: "Error",
        description: "Please select a module first",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const topicData = {
        topicName: formData.topicName,
        description: formData.description,
        content: formData.content,
      }

      const result = editingTopic
        ? await updateTopic(editingTopic.id, topicData)
        : await createTopic(selectedModule, topicData)

      if (result.success) {
        toast({
          title: "Success",
          description: editingTopic 
            ? "Topic updated successfully" 
            : "Topic created successfully",
        })

        if (viewMode === "module") {
          if (viewMode === "module") {
          await fetchTopics()
        } else {
          await fetchAllTopics()
        }
        } else {
          await fetchAllTopics()
        }

        setFormData({ topicName: "", description: "", content: "" })
        setEditingTopic(null)
        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save topic",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving topic:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving the topic",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (topic) => {
    setEditingTopic(topic)
    setFormData({
      topicName: topic.topicName,
      description: topic.description,
      content: topic.content || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (topic) => {
    setTopicToDelete(topic)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteTopic(topicToDelete.id)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Topic deleted successfully",
        })
        
        await fetchTopics()
        setDeleteConfirmOpen(false)
        setTopicToDelete(null)
      } else {
        toast({
          title: "Deletion Failed",
          description: result.message || "Failed to delete topic",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting topic:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the topic",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewDetails = async (topic) => {
    setLoadingDetails(true)
    setDetailsOpen(true)
    
    try {
      const result = await getTopicById(topic.id)
      
      if (result.success) {
        setViewingTopic(result.data)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load topic details",
          variant: "destructive",
        })
        setDetailsOpen(false)
      }
    } catch (error) {
      console.error("Error loading topic details:", error)
      toast({
        title: "Error",
        description: "Failed to load topic details",
        variant: "destructive",
      })
      setDetailsOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const searchTerm = globalSearch || localSearch

// Calculate available modules based on selected subject filter
const availableModules = filterSubject === "all" 
  ? modules 
  : modules.filter(m => m.subject?.id === filterSubject)

const filteredTopics = topics.filter((t) => {
  const matchesSearch = searchTerm === "" || 
    t.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  
  if (viewMode === "module") {
    return matchesSearch
  } else {
    const matchesSubject = filterSubject === "all" || t.module?.subject?.id === filterSubject
    const matchesModule = filterModule === "all" || t.module?.id === filterModule
    return matchesSearch && matchesSubject && matchesModule
  }
})

 

  if (viewMode === "module" && !selectedModule) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold text-muted-foreground">No Module Selected</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please select a module from the Modules tab to view its topics
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setViewMode("all")}
            >
              <Filter className="mr-2 size-4" />
              View All Topics
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 pb-2">
        <Button
          variant={viewMode === "module" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("module")}
          disabled={!selectedModule}
        >
          <FolderOpen className="mr-2 size-4" />
          Module Topics
        </Button>
        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("all")}
        >
          <Filter className="mr-2 size-4" />
          All Topics
        </Button>
      </div>

      {/* Module Header - Only show in module view */}
      {viewMode === "module" && moduleName && (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{moduleName}</h2>
            <p className="text-sm text-muted-foreground">
              {subjectName ? `${subjectName} • Manage topics and create questions` : "Manage topics for this module"}
            </p>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              className="w-full bg-background pl-9"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Show filters only in "all" view mode */}
          {viewMode === "all" && (
            <>
              <Select value={filterSubject} onValueChange={(value) => {
                setFilterSubject(value)
                setFilterModule("all")
              }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {availableModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.moduleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* CREATE TOPIC DIALOG - Only show in module view with selected module */}
    {viewMode === "module" && selectedModule && (
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingTopic(null)
            setFormData({ topicName: "", description: "", content: "" })
          }
        }}
      >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 size-4" />
              New Topic
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</DialogTitle>
              <DialogDescription>
                {editingTopic ? "Update this" : "Create a new"} topic for <span className="font-semibold text-primary">{moduleName}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Topic Name</Label>
                <Input
                  placeholder="e.g., Political Apathy"
                  value={formData.topicName}
                  onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Brief description of the topic..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Detailed content about the topic..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingTopic ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingTopic ? "Update" : "Create"} Topic</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Active Filters Display - Only in "all" view */}
      {viewMode === "all" && (filterSubject !== "all" || filterModule !== "all" || localSearch) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filterSubject !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Subject: {subjects.find(s => s.id === filterSubject)?.subjectName}
              <button onClick={() => setFilterSubject("all")} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          {filterModule !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Module: {modules.find(m => m.id === filterModule)?.moduleName}
              <button onClick={() => setFilterModule("all")} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          {localSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: "{localSearch}"
              <button onClick={() => setLocalSearch("")} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setFilterSubject("all")
              setFilterModule("all")
              setLocalSearch("")
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* TOPICS GRID */}
      <div className={viewMode === "all" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4"}>
        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">Loading topics...</p>
            </CardContent>
          </Card>
        ) : filteredTopics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center mb-2">
                {searchTerm || (viewMode === "all" && (filterSubject !== "all" || filterModule !== "all"))
                  ? "No topics found matching your search criteria" 
                  : viewMode === "module" 
                    ? `No topics found for ${moduleName}.`
                    : "No topics found."}
              </p>
              {!searchTerm && viewMode === "module" && selectedModule && (
                <p className="text-sm text-muted-foreground">Click "New Topic" to create your first topic.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className={`group hover:shadow-md transition-all cursor-pointer ${
                selectedTopicId === topic.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => handleTopicSelection && handleTopicSelection(topic.id, topic.topicName, moduleName)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg">{topic.topicName}</CardTitle>

                      <div className="flex flex-wrap gap-2">
                        {viewMode === "all" && topic.module?.subject && (
                          <Badge variant="secondary" className="text-xs">
                            {topic.module.subject.subjectName}
                          </Badge>
                        )}
                        {topic.module && viewMode === "all" && (
                          <Badge variant="outline" className="text-xs">
                            {topic.module.moduleName}
                          </Badge>
                        )}
                        {topic.module && viewMode === "module" && (
                          <Badge variant="outline" className="text-xs">
                            {topic.module.moduleName}
                          </Badge>
                        )}
                        {topic._count && (
                          <Badge variant="secondary" className="text-xs">
                            {topic._count.question || 0} Questions
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS DROPDOWN */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleTopicSelection && handleTopicSelection(topic.id, topic.topicName, moduleName)
                      }}>
                        <HelpCircle className="size-4 mr-2" />
                        Manage Questions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(topic)
                      }}>
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(topic)
                      }}>
                        <Pencil className="size-4 mr-2" />
                        Edit Topic
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(topic)
                        }}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete Topic
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {topic.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTopicSelection && handleTopicSelection(topic.id, topic.topicName, moduleName)
                  }}
                >
                  <HelpCircle className="size-4 mr-2" />
                  Manage Questions ({topic._count?.question || 0})
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Delete Topic
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {topicToDelete?.topicName}
                </span>
                ?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-2">
                <p className="text-destructive font-medium text-sm">
                  ⚠️ This will permanently delete:
                </p>
                <div className="text-sm text-muted-foreground space-y-1 ml-4">
                  <div>• {topicToDelete?._count?.question || 0} questions</div>
                  <div>• All associated content and progress data</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Topic
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Topic Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this topic
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
              <p className="text-muted-foreground text-center">Loading topic details...</p>
            </div>
          ) : viewingTopic ? (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{viewingTopic.topicName}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {viewingTopic.module && (
                      <Badge variant="secondary">
                        {viewingTopic.module.moduleName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="size-4" />
                  Description
                </h4>
                <p className="text-muted-foreground">
                  {viewingTopic.description || 'No description provided'}
                </p>
              </div>

              {viewingTopic.content && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Content</h4>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                      {viewingTopic.content}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Hash className="size-4" />
                  Statistics
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <HelpCircle className="size-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">{viewingTopic._count?.question || 0}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="size-4" />
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Topic ID</p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {viewingTopic.id || 'N/A'}
                    </p>
                  </div>
                  {viewingTopic.createdAt && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Created At</p>
                      <p className="font-medium">
                        {new Date(viewingTopic.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">No topic data available</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {viewingTopic && (
              <>
                <Button 
                  variant="default"
                  onClick={() => {
                    setDetailsOpen(false)
                    handleTopicSelection && handleTopicSelection(viewingTopic.id, viewingTopic.topicName, moduleName)
                  }}
                >
                  <HelpCircle className="size-4 mr-2" />
                  Manage Questions
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setDetailsOpen(false)
                    handleEdit(viewingTopic)
                  }}
                >
                  <Pencil className="size-4 mr-2" />
                  Edit Topic
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}