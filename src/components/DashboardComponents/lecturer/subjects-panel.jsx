// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, MoreVertical, Layers, FileText, Search, Pencil, BookOpen, Filter, Loader2, Trash2, AlertTriangle } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"

// export default function SubjectsPanel() {
//   const { toast } = useToast()
//   const { 
//     createSubject, 
//     getSubjects, 
//     updateSubject, 
//     deleteSubject, 
//     loading 
//   } = useTutorStore()
  
//   const [subjects, setSubjects] = useState([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingSubject, setEditingSubject] = useState(null)
//   const [formData, setFormData] = useState({ 
//     subjectName: "", 
//     subjectCode: "", 
//     description: "",
//     category: "",
//     color: "bg-blue-500" 
//   })
//   const [localSearch, setLocalSearch] = useState("")
//   const [filterCategory, setFilterCategory] = useState("all")
//   const [filterColor, setFilterColor] = useState("all")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
//   const [subjectToDelete, setSubjectToDelete] = useState(null)

//   const categories = ["WAEC", "NECO", "JAMB", "NABTEB"]
//   const colorOptions = [
//     { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
//     { value: "bg-emerald-500", label: "Green", color: "bg-emerald-500" },
//     { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
//     { value: "bg-amber-500", label: "Amber", color: "bg-amber-500" },
//     { value: "bg-red-500", label: "Red", color: "bg-red-500" },
//     { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
//   ]

//   // Fetch subjects on mount
//   useEffect(() => {
//     loadSubjects()
//   }, [])

//   const loadSubjects = async () => {
//     try {
//       const result = await getSubjects()
//       console.log("📦 API Response:", result)
      
//       if (result.success) {
//         // Handle different response structures
//         const subjectsData = Array.isArray(result.data) 
//           ? result.data 
//           : result.data?.subjects 
//           ? result.data.subjects 
//           : []
        
//         console.log("📚 Subjects loaded:", subjectsData)
//         setSubjects(subjectsData)
//       } else {
//         console.warn("⚠️ Failed to load subjects:", result.message)
//         setSubjects([])
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load subjects",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("❌ Error loading subjects:", error)
//       setSubjects([])
//       toast({
//         title: "Error",
//         description: "Failed to load subjects. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!formData.subjectName || !formData.subjectCode || !formData.description || !formData.category) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Prepare API payload (only the required fields from API)
//       const apiPayload = {
//         subjectName: formData.subjectName.trim(),
//         subjectCode: formData.subjectCode.trim().toUpperCase(),
//         description: formData.description.trim(),
//         category: formData.category,
//       }

//       let result

//       if (editingSubject) {
//         // Update existing subject
//         const subjectId = editingSubject.subjectId || editingSubject.id
//         result = await updateSubject(subjectId, apiPayload)
        
//         if (result.success) {
//           toast({
//             title: "Success",
//             description: "Subject updated successfully",
//           })
          
//           // Update local state with the returned data
//           setSubjects(prevSubjects => prevSubjects.map((s) => {
//             const currentId = s.subjectId || s.id
//             return currentId === subjectId
//               ? { ...s, ...apiPayload, ...result.data, color: formData.color }
//               : s
//           }))
//         } else {
//           toast({
//             title: "Update Failed",
//             description: result.message || "Failed to update subject",
//             variant: "destructive",
//           })
//         }
//       } else {
//         // Create new subject
//         result = await createSubject(apiPayload)
        
//         if (result.success) {
//           toast({
//             title: "Success",
//             description: "Subject created successfully",
//           })
          
//           // Reload subjects to get the latest data from server
//           await loadSubjects()
//         } else {
//           toast({
//             title: "Creation Failed",
//             description: result.message || "Failed to create subject",
//             variant: "destructive",
//           })
//         }
//       }

//       // Close dialog and reset form only on success
//       if (result.success) {
//         setFormData({ 
//           subjectName: "", 
//           subjectCode: "", 
//           description: "",
//           category: "",
//           color: "bg-blue-500" 
//         })
//         setEditingSubject(null)
//         setIsDialogOpen(false)
//       }
//     } catch (error) {
//       console.error("Error submitting subject:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = (subject) => {
//     setEditingSubject(subject)
//     setFormData({ 
//       subjectName: subject.subjectName || subject.name || "",
//       subjectCode: subject.subjectCode || subject.code || "",
//       description: subject.description || "",
//       category: subject.category || "",
//       color: subject.color || "bg-blue-500"
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDeleteClick = (subject) => {
//     setSubjectToDelete(subject)
//     setDeleteConfirmOpen(true)
//   }

//   const handleDeleteConfirm = async () => {
//     if (!subjectToDelete) return

//     const subjectId = subjectToDelete.subjectId || subjectToDelete.id
//     const subjectName = subjectToDelete.subjectName || subjectToDelete.name
//     const subjectCode = subjectToDelete.subjectCode || subjectToDelete.code

//     setIsDeleting(true)

//     try {
//       // Prepare the delete payload with subjectName, subjectCode, and force=true
//       const deletePayload = {
//         subjectName: subjectName,
//         subjectCode: subjectCode,
//         force: true  // Required to delete subjects with related data
//       }

//       console.log("🗑️ Deleting subject:", { subjectId, deletePayload })

//       const result = await deleteSubject(subjectId, deletePayload)
      
//       console.log("🗑️ Delete result:", result)
      
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: `Subject "${subjectName}" and all related data deleted successfully`,
//         })
        
//         // Remove from local state
//         setSubjects(prevSubjects => prevSubjects.filter((s) => (s.subjectId || s.id) !== subjectId))
        
//         // Close the dialog
//         setDeleteConfirmOpen(false)
//         setSubjectToDelete(null)
//       } else {
//         // Show the specific error message from the backend
//         toast({
//           title: "Deletion Failed",
//           description: result.error || result.message || "Failed to delete subject",
//           variant: "destructive",
//         })
//         console.error("Delete error:", result)
//       }
//     } catch (error) {
//       console.error("Error deleting subject:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred while deleting the subject",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const handleDialogClose = (open) => {
//     setIsDialogOpen(open)
//     if (!open) {
//       setEditingSubject(null)
//       setFormData({ 
//         subjectName: "", 
//         subjectCode: "", 
//         description: "", 
//         category: "", 
//         color: "bg-blue-500" 
//       })
//     }
//   }

//   // Filter subjects based on search and filters
//   const filteredSubjects = Array.isArray(subjects) ? subjects.filter((s) => {
//     const matchesCategory = filterCategory === "all" || s.category === filterCategory
//     const matchesColor = filterColor === "all" || s.color === filterColor
//     const searchLower = localSearch.toLowerCase()
//     const matchesSearch = localSearch === "" ||
//       (s.subjectName || s.name || "").toLowerCase().includes(searchLower) ||
//       (s.subjectCode || s.code || "").toLowerCase().includes(searchLower) ||
//       (s.description || "").toLowerCase().includes(searchLower)
    
//     return matchesCategory && matchesColor && matchesSearch
//   }) : []

//   return (
//     <div className="space-y-6">
//       {/* TOP BAR */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search subjects..."
//               className="pl-9 bg-background"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>

//           {/* Category Filter */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon" className="shrink-0">
//                 <Filter className="size-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setFilterCategory("all")}>
//                 All Categories
//               </DropdownMenuItem>
//               <Separator className="my-1" />
//               {categories.map((cat) => (
//                 <DropdownMenuItem key={cat} onClick={() => setFilterCategory(cat)}>
//                   {cat}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Color Filter */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon" className="shrink-0">
//                 <div className={`size-4 rounded-full ${filterColor === "all" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" : filterColor}`} />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setFilterColor("all")}>
//                 All Colors
//               </DropdownMenuItem>
//               <Separator className="my-1" />
//               {colorOptions.map((option) => (
//                 <DropdownMenuItem key={option.value} onClick={() => setFilterColor(option.value)}>
//                   <div className={`size-4 rounded-full ${option.color} mr-2`} />
//                   {option.label}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
//           <DialogTrigger asChild>
//             <Button className="w-full sm:w-auto">
//               <Plus className="mr-2 size-4" />
//               Add Subject
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingSubject ? "Edit Subject" : "Add New Subject"}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingSubject 
//                   ? "Update the subject details below" 
//                   : "Create a new subject by filling in the details below"}
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="subjectName">
//                   Subject Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="subjectName"
//                   placeholder="e.g., Government"
//                   value={formData.subjectName}
//                   onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   The full name of the subject
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="subjectCode">
//                   Subject Code <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="subjectCode"
//                   placeholder="e.g., GOV"
//                   value={formData.subjectCode}
//                   onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
//                   maxLength={10}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   A short code or abbreviation (max 10 characters)
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="description">
//                   Description <span className="text-red-500">*</span>
//                 </Label>
//                 <Textarea
//                   id="description"
//                   placeholder="e.g., Teaches about the various arms of government and its nuances"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows={3}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   A brief description of what this subject covers
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="category">
//                   Category <span className="text-red-500">*</span>
//                 </Label>
//                 <Select 
//                   value={formData.category} 
//                   onValueChange={(value) => setFormData({ ...formData, category: value })}
//                 >
//                   <SelectTrigger id="category" className="w-full">
//                     <SelectValue placeholder="Select exam category" />
//                   </SelectTrigger>
//                   <SelectContent position="popper" sideOffset={5}>
//                     {categories.map((cat) => (
//                       <SelectItem key={cat} value={cat}>
//                         {cat}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <p className="text-xs text-muted-foreground">
//                   The exam body this subject belongs to
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label>Color Theme</Label>
//                 <div className="grid grid-cols-6 gap-2">
//                   {colorOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       type="button"
//                       onClick={() => setFormData({ ...formData, color: option.value })}
//                       className={`h-12 rounded-md border-2 transition-all ${
//                         formData.color === option.value 
//                           ? 'border-primary ring-2 ring-primary/20' 
//                           : 'border-transparent hover:border-muted-foreground/20'
//                       }`}
//                     >
//                       <div className={`h-full w-full rounded ${option.color} flex items-center justify-center`}>
//                         {formData.color === option.value && (
//                           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Choose a color to identify this subject (visual only)
//                 </p>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button 
//                 variant="outline" 
//                 type="button" 
//                 onClick={() => handleDialogClose(false)} 
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleSubmit} 
//                 disabled={isSubmitting || !formData.subjectName || !formData.subjectCode || !formData.description || !formData.category}
//               >
//                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {editingSubject ? "Update" : "Create"} Subject
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Active Filters Display */}
//       {(filterCategory !== "all" || filterColor !== "all" || localSearch) && (
//         <div className="flex flex-wrap gap-2 items-center">
//           <span className="text-sm text-muted-foreground">Active filters:</span>
//           {filterCategory !== "all" && (
//             <Badge variant="secondary" className="gap-1">
//               Category: {filterCategory}
//               <button onClick={() => setFilterCategory("all")} className="ml-1 hover:text-destructive">×</button>
//             </Badge>
//           )}
//           {filterColor !== "all" && (
//             <Badge variant="secondary" className="gap-1">
//               <div className={`size-3 rounded-full ${filterColor}`} />
//               Color Filter
//               <button onClick={() => setFilterColor("all")} className="ml-1 hover:text-destructive">×</button>
//             </Badge>
//           )}
//           {localSearch && (
//             <Badge variant="secondary" className="gap-1">
//               Search: "{localSearch}"
//               <button onClick={() => setLocalSearch("")} className="ml-1 hover:text-destructive">×</button>
//             </Badge>
//           )}
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => {
//               setFilterCategory("all")
//               setFilterColor("all")
//               setLocalSearch("")
//             }}
//           >
//             Clear all
//           </Button>
//         </div>
//       )}

//       {/* SUBJECT CARDS */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {filteredSubjects.map((subject) => {
//           const subjectId = subject.subjectId || subject.id

//           return (
//             <Card 
//               key={subjectId} 
//               className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
//             >
//               <div className={`h-1.5 w-full ${subject.color || 'bg-blue-500'}`} />
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between gap-2">
//                   <div className="space-y-1 flex-1 min-w-0">
//                     <Badge variant="secondary" className="font-mono text-xs">
//                       {subject.subjectCode || subject.code}
//                     </Badge>
//                     <CardTitle className="text-lg truncate">
//                       {subject.subjectName || subject.name}
//                     </CardTitle>
//                     {subject.description && (
//                       <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
//                         {subject.description}
//                       </p>
//                     )}
//                   </div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
//                       >
//                         <MoreVertical className="size-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleEdit(subject)}>
//                         <Pencil className="size-4 mr-2" />
//                         Edit Subject
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="text-destructive focus:text-destructive" 
//                         onClick={() => handleDeleteClick(subject)}
//                       >
//                         <Trash2 className="size-4 mr-2" />
//                         Delete Subject
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </CardHeader>
//               <CardContent className="pb-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="flex flex-col gap-1">
//                     <span className="text-muted-foreground flex items-center gap-1 text-xs">
//                       <Layers className="size-3" /> Modules
//                     </span>
//                     <span className="font-semibold">
//                       {subject.moduleCount || subject.modules || 0}
//                     </span>
//                   </div>
//                   <div className="flex flex-col gap-1">
//                     <span className="text-muted-foreground flex items-center gap-1 text-xs">
//                       <FileText className="size-3" /> Topics
//                     </span>
//                     <span className="font-semibold">
//                       {subject.topicCount || subject.topics || 0}
//                     </span>
//                   </div>
//                 </div>
//                 {subject.category && (
//                   <div className="mt-3">
//                     <Badge variant="outline" className="text-xs">
//                       {subject.category}
//                     </Badge>
//                   </div>
//                 )}
//               </CardContent>
//               <Separator />
//               <CardFooter className="bg-secondary/30 py-3">
//                 <div className="text-xs text-muted-foreground">
//                   Created by you
//                 </div>
//               </CardFooter>
//             </Card>
//           )
//         })}
//       </div>

//       {/* EMPTY STATE */}
//       {filteredSubjects.length === 0 && !loading && (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
//             <p className="text-muted-foreground text-center max-w-md">
//               {localSearch || filterCategory !== "all" || filterColor !== "all"
//                 ? "No subjects match your search criteria. Try adjusting your filters."
//                 : "No subjects found. Create your first subject to get started."}
//             </p>
//             {(localSearch || filterCategory !== "all" || filterColor !== "all") && (
//               <Button 
//                 variant="outline" 
//                 className="mt-4"
//                 onClick={() => {
//                   setLocalSearch("")
//                   setFilterCategory("all")
//                   setFilterColor("all")
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* LOADING STATE */}
//       {loading && subjects.length === 0 && (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//             <p className="text-muted-foreground text-center">Loading subjects...</p>
//           </CardContent>
//         </Card>
//       )}

//       {/* DELETE CONFIRMATION DIALOG */}
//       <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="size-5 text-destructive" />
//               Delete Subject
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 Are you sure you want to delete{" "}
//                 <span className="font-semibold text-foreground">
//                   {subjectToDelete?.subjectName || subjectToDelete?.name}
//                 </span>
//                 ?
//               </p>
//               <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-2">
//                 <p className="text-destructive font-medium text-sm">
//                   ⚠️ This will permanently delete:
//                 </p>
//                 <ul className="text-sm text-muted-foreground space-y-1 ml-4">
//                   <li>• {subjectToDelete?.moduleCount || subjectToDelete?.modules || 0} modules</li>
//                   <li>• {subjectToDelete?.topicCount || subjectToDelete?.topics || 0} topics</li>
//                   <li>• All associated questions and quizzes</li>
//                   <li>• All student progress data</li>
//                 </ul>
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
//               Delete Subject
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }





// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, MoreVertical, Layers, FileText, Search, Pencil, BookOpen, Filter, Loader2, Trash2, AlertTriangle, Eye, Calendar, User, Hash } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"

// export default function SubjectsPanel() {
//   const { toast } = useToast()
//   const { 
//     createSubject, 
//     getSubjects, 
//     getSubjectById,
//     updateSubject, 
//     deleteSubject, 
//     loading 
//   } = useTutorStore()
  
//   const [subjects, setSubjects] = useState([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingSubject, setEditingSubject] = useState(null)
//   const [formData, setFormData] = useState({ 
//     subjectName: "", 
//     subjectCode: "", 
//     description: "",
//     category: "",
//     color: "bg-blue-500" 
//   })
//   const [localSearch, setLocalSearch] = useState("")
//   const [filterCategory, setFilterCategory] = useState("all")
//   const [filterColor, setFilterColor] = useState("all")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
//   const [subjectToDelete, setSubjectToDelete] = useState(null)
//   const [viewingSubject, setViewingSubject] = useState(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [loadingDetails, setLoadingDetails] = useState(false)

//   const categories = ["WAEC", "NECO", "JAMB", "NABTEB"]
//   const colorOptions = [
//     { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
//     { value: "bg-emerald-500", label: "Green", color: "bg-emerald-500" },
//     { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
//     { value: "bg-amber-500", label: "Amber", color: "bg-amber-500" },
//     { value: "bg-red-500", label: "Red", color: "bg-red-500" },
//     { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
//   ]

//   // Fetch subjects on mount
//   useEffect(() => {
//     loadSubjects()
//   }, [])

//   const loadSubjects = async () => {
//     try {
//       const result = await getSubjects()
//       console.log("📦 API Response:", result)
      
//       if (result.success) {
//         // Handle different response structures
//         const subjectsData = Array.isArray(result.data) 
//           ? result.data 
//           : result.data?.subjects 
//           ? result.data.subjects 
//           : []
        
//         console.log("📚 Subjects loaded:", subjectsData)
//         setSubjects(subjectsData)
//       } else {
//         console.warn("⚠️ Failed to load subjects:", result.message)
//         setSubjects([])
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load subjects",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("❌ Error loading subjects:", error)
//       setSubjects([])
//       toast({
//         title: "Error",
//         description: "Failed to load subjects. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!formData.subjectName || !formData.subjectCode || !formData.description || !formData.category) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Prepare API payload (only the required fields from API)
//       const apiPayload = {
//         subjectName: formData.subjectName.trim(),
//         subjectCode: formData.subjectCode.trim().toUpperCase(),
//         description: formData.description.trim(),
//         category: formData.category,
//       }

//       let result

//       if (editingSubject) {
//         // Update existing subject
//         const subjectId = editingSubject.subjectId || editingSubject.id
//         result = await updateSubject(subjectId, apiPayload)
        
//         if (result.success) {
//           toast({
//             title: "Success",
//             description: "Subject updated successfully",
//           })
          
//           // Update local state with the returned data
//           setSubjects(prevSubjects => prevSubjects.map((s) => {
//             const currentId = s.subjectId || s.id
//             return currentId === subjectId
//               ? { ...s, ...apiPayload, ...result.data, color: formData.color }
//               : s
//           }))
//         } else {
//           toast({
//             title: "Update Failed",
//             description: result.message || "Failed to update subject",
//             variant: "destructive",
//           })
//         }
//       } else {
//         // Create new subject
//         result = await createSubject(apiPayload)
        
//         if (result.success) {
//           toast({
//             title: "Success",
//             description: "Subject created successfully",
//           })
          
//           // Reload subjects to get the latest data from server
//           await loadSubjects()
//         } else {
//           toast({
//             title: "Creation Failed",
//             description: result.message || "Failed to create subject",
//             variant: "destructive",
//           })
//         }
//       }

//       // Close dialog and reset form only on success
//       if (result.success) {
//         setFormData({ 
//           subjectName: "", 
//           subjectCode: "", 
//           description: "",
//           category: "",
//           color: "bg-blue-500" 
//         })
//         setEditingSubject(null)
//         setIsDialogOpen(false)
//       }
//     } catch (error) {
//       console.error("Error submitting subject:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = (subject) => {
//     setEditingSubject(subject)
//     setFormData({ 
//       subjectName: subject.subjectName || subject.name || "",
//       subjectCode: subject.subjectCode || subject.code || "",
//       description: subject.description || "",
//       category: subject.category || "",
//       color: subject.color || "bg-blue-500"
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDeleteClick = (subject) => {
//     setSubjectToDelete(subject)
//     setDeleteConfirmOpen(true)
//   }

//   const handleViewDetails = async (subject) => {
//     setLoadingDetails(true)
//     setDetailsOpen(true)
    
//     try {
//       const subjectId = subject.subjectId || subject.id
//       const result = await getSubjectById(subjectId)
      
//       if (result.success) {
//         setViewingSubject(result.data)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load subject details",
//           variant: "destructive",
//         })
//         setDetailsOpen(false)
//       }
//     } catch (error) {
//       console.error("Error loading subject details:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load subject details",
//         variant: "destructive",
//       })
//       setDetailsOpen(false)
//     } finally {
//       setLoadingDetails(false)
//     }
//   }

//   const handleDeleteConfirm = async () => {
//     if (!subjectToDelete) return

//     const subjectId = subjectToDelete.subjectId || subjectToDelete.id
//     const subjectName = subjectToDelete.subjectName || subjectToDelete.name
//     const subjectCode = subjectToDelete.subjectCode || subjectToDelete.code

//     setIsDeleting(true)

//     try {
//       // Prepare the delete payload with subjectName, subjectCode, and force=true
//       const deletePayload = {
//         subjectName: subjectName,
//         subjectCode: subjectCode,
//         force: true  // Required to delete subjects with related data
//       }

//       console.log("🗑️ Deleting subject:", { subjectId, deletePayload })

//       const result = await deleteSubject(subjectId, deletePayload)
      
//       console.log("🗑️ Delete result:", result)
      
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: `Subject "${subjectName}" and all related data deleted successfully`,
//         })
        
//         // Remove from local state
//         setSubjects(prevSubjects => prevSubjects.filter((s) => (s.subjectId || s.id) !== subjectId))
        
//         // Close the dialog
//         setDeleteConfirmOpen(false)
//         setSubjectToDelete(null)
//       } else {
//         // Show the specific error message from the backend
//         toast({
//           title: "Deletion Failed",
//           description: result.error || result.message || "Failed to delete subject",
//           variant: "destructive",
//         })
//         console.error("Delete error:", result)
//       }
//     } catch (error) {
//       console.error("Error deleting subject:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred while deleting the subject",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const handleDialogClose = (open) => {
//     setIsDialogOpen(open)
//     if (!open) {
//       setEditingSubject(null)
//       setFormData({ 
//         subjectName: "", 
//         subjectCode: "", 
//         description: "", 
//         category: "", 
//         color: "bg-blue-500" 
//       })
//     }
//   }

//   // Filter subjects based on search and filters
//   const filteredSubjects = Array.isArray(subjects) ? subjects.filter((s) => {
//     const matchesCategory = filterCategory === "all" || s.category === filterCategory
//     const matchesColor = filterColor === "all" || s.color === filterColor
//     const searchLower = localSearch.toLowerCase()
//     const matchesSearch = localSearch === "" ||
//       (s.subjectName || s.name || "").toLowerCase().includes(searchLower) ||
//       (s.subjectCode || s.code || "").toLowerCase().includes(searchLower) ||
//       (s.description || "").toLowerCase().includes(searchLower)
    
//     return matchesCategory && matchesColor && matchesSearch
//   }) : []

//   return (
//     <div className="space-y-6">
//       {/* TOP BAR */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search subjects..."
//               className="pl-9 bg-background"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>

//           {/* Category Filter */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon" className="shrink-0">
//                 <Filter className="size-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setFilterCategory("all")}>
//                 All Categories
//               </DropdownMenuItem>
//               <Separator className="my-1" />
//               {categories.map((cat) => (
//                 <DropdownMenuItem key={cat} onClick={() => setFilterCategory(cat)}>
//                   {cat}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Color Filter */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon" className="shrink-0">
//                 <div className={`size-4 rounded-full ${filterColor === "all" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" : filterColor}`} />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setFilterColor("all")}>
//                 All Colors
//               </DropdownMenuItem>
//               <Separator className="my-1" />
//               {colorOptions.map((option) => (
//                 <DropdownMenuItem key={option.value} onClick={() => setFilterColor(option.value)}>
//                   <div className={`size-4 rounded-full ${option.color} mr-2`} />
//                   {option.label}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
//           <DialogTrigger asChild>
//             <Button className="w-full sm:w-auto">
//               <Plus className="mr-2 size-4" />
//               Add Subject
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingSubject ? "Edit Subject" : "Add New Subject"}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingSubject 
//                   ? "Update the subject details below" 
//                   : "Create a new subject by filling in the details below"}
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="subjectName">
//                   Subject Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="subjectName"
//                   placeholder="e.g., Government"
//                   value={formData.subjectName}
//                   onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   The full name of the subject
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="subjectCode">
//                   Subject Code <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="subjectCode"
//                   placeholder="e.g., GOV"
//                   value={formData.subjectCode}
//                   onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
//                   maxLength={10}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   A short code or abbreviation (max 10 characters)
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="description">
//                   Description <span className="text-red-500">*</span>
//                 </Label>
//                 <Textarea
//                   id="description"
//                   placeholder="e.g., Teaches about the various arms of government and its nuances"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows={3}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   A brief description of what this subject covers
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="category">
//                   Category <span className="text-red-500">*</span>
//                 </Label>
//                 <Select 
//                   value={formData.category} 
//                   onValueChange={(value) => setFormData({ ...formData, category: value })}
//                 >
//                   <SelectTrigger id="category" className="w-full">
//                     <SelectValue placeholder="Select exam category" />
//                   </SelectTrigger>
//                   <SelectContent position="popper" sideOffset={5}>
//                     {categories.map((cat) => (
//                       <SelectItem key={cat} value={cat}>
//                         {cat}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <p className="text-xs text-muted-foreground">
//                   The exam body this subject belongs to
//                 </p>
//               </div>

//               <div className="grid gap-2">
//                 <Label>Color Theme</Label>
//                 <div className="grid grid-cols-6 gap-2">
//                   {colorOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       type="button"
//                       onClick={() => setFormData({ ...formData, color: option.value })}
//                       className={`h-12 rounded-md border-2 transition-all ${
//                         formData.color === option.value 
//                           ? 'border-primary ring-2 ring-primary/20' 
//                           : 'border-transparent hover:border-muted-foreground/20'
//                       }`}
//                     >
//                       <div className={`h-full w-full rounded ${option.color} flex items-center justify-center`}>
//                         {formData.color === option.value && (
//                           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Choose a color to identify this subject (visual only)
//                 </p>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button 
//                 variant="outline" 
//                 type="button" 
//                 onClick={() => handleDialogClose(false)} 
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleSubmit} 
//                 disabled={isSubmitting || !formData.subjectName || !formData.subjectCode || !formData.description || !formData.category}
//               >
//                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {editingSubject ? "Update" : "Create"} Subject
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Active Filters Display */}
//       {(filterCategory !== "all" || filterColor !== "all" || localSearch) && (
//         <div className="flex flex-wrap gap-2 items-center">
//           <span className="text-sm text-muted-foreground">Active filters:</span>
//           {filterCategory !== "all" && (
//             <Badge variant="secondary" className="gap-1">
//               Category: {filterCategory}
//               <button onClick={() => setFilterCategory("all")} className="ml-1 hover:text-destructive">×</button>
//             </Badge>
//           )}
//           {filterColor !== "all" && (
//             <Badge variant="secondary" className="gap-1">
//               <div className={`size-3 rounded-full ${filterColor}`} />
//               Color Filter
//               <button onClick={() => setFilterColor("all")} className="ml-1 hover:text-destructive">×</button>
//             </Badge>
//           )}
//           {localSearch && (
//             <Badge variant="secondary" className="gap-1">
//               Search: "{localSearch}"
//               <button onClick={() => setLocalSearch("")} className="ml-1 hover:text-destructive">×</button>
//             </Badge>
//           )}
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => {
//               setFilterCategory("all")
//               setFilterColor("all")
//               setLocalSearch("")
//             }}
//           >
//             Clear all
//           </Button>
//         </div>
//       )}

//       {/* SUBJECT CARDS */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {filteredSubjects.map((subject) => {
//           const subjectId = subject.subjectId || subject.id

//           return (
//             <Card 
//               key={subjectId} 
//               className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
//             >
//               <div className={`h-1.5 w-full ${subject.color || 'bg-blue-500'}`} />
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between gap-2">
//                   <div className="space-y-1 flex-1 min-w-0">
//                     <Badge variant="secondary" className="font-mono text-xs">
//                       {subject.subjectCode || subject.code}
//                     </Badge>
//                     <CardTitle className="text-lg truncate">
//                       {subject.subjectName || subject.name}
//                     </CardTitle>
//                     {subject.description && (
//                       <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
//                         {subject.description}
//                       </p>
//                     )}
//                   </div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
//                       >
//                         <MoreVertical className="size-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleViewDetails(subject)}>
//                         <Eye className="size-4 mr-2" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => handleEdit(subject)}>
//                         <Pencil className="size-4 mr-2" />
//                         Edit Subject
//                       </DropdownMenuItem>
//                       <Separator className="my-1" />
//                       <DropdownMenuItem 
//                         className="text-destructive focus:text-destructive" 
//                         onClick={() => handleDeleteClick(subject)}
//                       >
//                         <Trash2 className="size-4 mr-2" />
//                         Delete Subject
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </CardHeader>
//               <CardContent className="pb-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="flex flex-col gap-1">
//                     <span className="text-muted-foreground flex items-center gap-1 text-xs">
//                       <Layers className="size-3" /> Modules
//                     </span>
//                     <span className="font-semibold">
//                       {subject.moduleCount || subject.modules || 0}
//                     </span>
//                   </div>
//                   <div className="flex flex-col gap-1">
//                     <span className="text-muted-foreground flex items-center gap-1 text-xs">
//                       <FileText className="size-3" /> Topics
//                     </span>
//                     <span className="font-semibold">
//                       {subject.topicCount || subject.topics || 0}
//                     </span>
//                   </div>
//                 </div>
//                 {subject.category && (
//                   <div className="mt-3">
//                     <Badge variant="outline" className="text-xs">
//                       {subject.category}
//                     </Badge>
//                   </div>
//                 )}
//               </CardContent>
//               <Separator />
//               <CardFooter className="bg-secondary/30 py-3">
//                 <div className="text-xs text-muted-foreground">
//                   Created by you
//                 </div>
//               </CardFooter>
//             </Card>
//           )
//         })}
//       </div>

//       {/* EMPTY STATE */}
//       {filteredSubjects.length === 0 && !loading && (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
//             <p className="text-muted-foreground text-center max-w-md">
//               {localSearch || filterCategory !== "all" || filterColor !== "all"
//                 ? "No subjects match your search criteria. Try adjusting your filters."
//                 : "No subjects found. Create your first subject to get started."}
//             </p>
//             {(localSearch || filterCategory !== "all" || filterColor !== "all") && (
//               <Button 
//                 variant="outline" 
//                 className="mt-4"
//                 onClick={() => {
//                   setLocalSearch("")
//                   setFilterCategory("all")
//                   setFilterColor("all")
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* LOADING STATE */}
//       {loading && subjects.length === 0 && (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//             <p className="text-muted-foreground text-center">Loading subjects...</p>
//           </CardContent>
//         </Card>
//       )}

//       {/* DELETE CONFIRMATION DIALOG */}
//       <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="size-5 text-destructive" />
//               Delete Subject
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 Are you sure you want to delete{" "}
//                 <span className="font-semibold text-foreground">
//                   {subjectToDelete?.subjectName || subjectToDelete?.name}
//                 </span>
//                 ?
//               </p>
//               <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-2">
//                 <p className="text-destructive font-medium text-sm">
//                   ⚠️ This will permanently delete:
//                 </p>
//                 <ul className="text-sm text-muted-foreground space-y-1 ml-4">
//                   <li>• {subjectToDelete?.moduleCount || subjectToDelete?.modules || 0} modules</li>
//                   <li>• {subjectToDelete?.topicCount || subjectToDelete?.topics || 0} topics</li>
//                   <li>• All associated questions and quizzes</li>
//                   <li>• All student progress data</li>
//                 </ul>
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
//               Delete Subject
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
//               Subject Details
//             </DialogTitle>
//             <DialogDescription>
//               Complete information about this subject
//             </DialogDescription>
//           </DialogHeader>

//           {loadingDetails ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//               <p className="text-muted-foreground text-center">Loading subject details...</p>
//             </div>
//           ) : viewingSubject ? (
//             <div className="space-y-6 py-4">
//               {/* Header Section */}
//               <div className="flex items-start gap-4">
//                 <div className={`w-16 h-16 rounded-lg ${viewingSubject.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xl`}>
//                   {(viewingSubject.subjectCode || viewingSubject.code || '??').substring(0, 3)}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-2xl font-bold">{viewingSubject.subjectName || viewingSubject.name}</h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Badge variant="secondary" className="font-mono">
//                       {viewingSubject.subjectCode || viewingSubject.code}
//                     </Badge>
//                     {viewingSubject.category && (
//                       <Badge variant="outline">{viewingSubject.category}</Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Description */}
//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <FileText className="size-4" />
//                   Description
//                 </h4>
//                 <p className="text-muted-foreground">
//                   {viewingSubject.description || 'No description provided'}
//                 </p>
//               </div>

//               <Separator />

//               {/* Statistics */}
//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Hash className="size-4" />
//                   Statistics
//                 </h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <Layers className="size-8 mx-auto mb-2 text-blue-500" />
//                         <p className="text-2xl font-bold">{viewingSubject.moduleCount || viewingSubject.modules || 0}</p>
//                         <p className="text-xs text-muted-foreground">Modules</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <FileText className="size-8 mx-auto mb-2 text-green-500" />
//                         <p className="text-2xl font-bold">{viewingSubject.topicCount || viewingSubject.topics || 0}</p>
//                         <p className="text-xs text-muted-foreground">Topics</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <BookOpen className="size-8 mx-auto mb-2 text-purple-500" />
//                         <p className="text-2xl font-bold">{viewingSubject.questionCount || viewingSubject.questions || 0}</p>
//                         <p className="text-xs text-muted-foreground">Questions</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <User className="size-8 mx-auto mb-2 text-amber-500" />
//                         <p className="text-2xl font-bold">{viewingSubject.enrolledCount || viewingSubject.enrolled || 0}</p>
//                         <p className="text-xs text-muted-foreground">Students</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>

//               <Separator />

//               {/* Metadata */}
//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Calendar className="size-4" />
//                   Additional Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Subject ID</p>
//                     <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
//                       {viewingSubject.subjectId || viewingSubject.id || 'N/A'}
//                     </p>
//                   </div>
//                   {viewingSubject.createdAt && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Created At</p>
//                       <p className="font-medium">
//                         {new Date(viewingSubject.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   {viewingSubject.updatedAt && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Last Updated</p>
//                       <p className="font-medium">
//                         {new Date(viewingSubject.updatedAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   {viewingSubject.tutorId && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Tutor ID</p>
//                       <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
//                         {viewingSubject.tutorId}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12">
//               <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center">No subject data available</p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailsOpen(false)}>
//               Close
//             </Button>
//             {viewingSubject && (
//               <Button onClick={() => {
//                 setDetailsOpen(false)
//                 handleEdit(viewingSubject)
//               }}>
//                 <Pencil className="size-4 mr-2" />
//                 Edit Subject
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }





import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MoreVertical, Layers, FileText, Search, Pencil, BookOpen, Filter, Loader2, Trash2, AlertTriangle, Eye, Calendar, User, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

export default function SubjectsPanel({ onSubjectSelect }) {
  const { toast } = useToast()
  const { 
    createSubject, 
    getSubjects, 
    getSubjectById,
    updateSubject, 
    deleteSubject, 
    loading 
  } = useTutorStore()
  
  const [subjects, setSubjects] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({ 
    subjectName: "", 
    subjectCode: "", 
    description: "",
    category: "",
    color: "bg-blue-500" 
  })
  const [localSearch, setLocalSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterColor, setFilterColor] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState(null)
  const [viewingSubject, setViewingSubject] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const categories = ["WAEC", "NECO", "JAMB", "NABTEB"]
  const colorOptions = [
    { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
    { value: "bg-emerald-500", label: "Green", color: "bg-emerald-500" },
    { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
    { value: "bg-amber-500", label: "Amber", color: "bg-amber-500" },
    { value: "bg-red-500", label: "Red", color: "bg-red-500" },
    { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
  ]

  // Fetch subjects on mount
  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const result = await getSubjects()
      console.log("📦 API Response:", result)
      
      if (result.success) {
        // Handle different response structures
        const subjectsData = Array.isArray(result.data) 
          ? result.data 
          : result.data?.subjects 
          ? result.data.subjects 
          : []
        
        console.log("📚 Subjects loaded:", subjectsData)
        setSubjects(subjectsData)
      } else {
        console.warn("⚠️ Failed to load subjects:", result.message)
        setSubjects([])
        toast({
          title: "Error",
          description: result.message || "Failed to load subjects",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Error loading subjects:", error)
      setSubjects([])
      toast({
        title: "Error",
        description: "Failed to load subjects. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.subjectName || !formData.subjectCode || !formData.description || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare API payload (only the required fields from API)
      const apiPayload = {
        subjectName: formData.subjectName.trim(),
        subjectCode: formData.subjectCode.trim().toUpperCase(),
        description: formData.description.trim(),
        category: formData.category,
      }

      let result

      if (editingSubject) {
        // Update existing subject
        const subjectId = editingSubject.subjectId || editingSubject.id
        result = await updateSubject(subjectId, apiPayload)
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Subject updated successfully",
          })
          
          // Update local state with the returned data
          setSubjects(prevSubjects => prevSubjects.map((s) => {
            const currentId = s.subjectId || s.id
            return currentId === subjectId
              ? { ...s, ...apiPayload, ...result.data, color: formData.color }
              : s
          }))
        } else {
          toast({
            title: "Update Failed",
            description: result.message || "Failed to update subject",
            variant: "destructive",
          })
        }
      } else {
        // Create new subject
        result = await createSubject(apiPayload)
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Subject created successfully",
          })
          
          // Reload subjects to get the latest data from server
          await loadSubjects()
        } else {
          toast({
            title: "Creation Failed",
            description: result.message || "Failed to create subject",
            variant: "destructive",
          })
        }
      }

      // Close dialog and reset form only on success
      if (result.success) {
        setFormData({ 
          subjectName: "", 
          subjectCode: "", 
          description: "",
          category: "",
          color: "bg-blue-500" 
        })
        setEditingSubject(null)
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error submitting subject:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({ 
      subjectName: subject.subjectName || subject.name || "",
      subjectCode: subject.subjectCode || subject.code || "",
      description: subject.description || "",
      category: subject.category || "",
      color: subject.color || "bg-blue-500"
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject)
    setDeleteConfirmOpen(true)
  }

  const handleViewDetails = async (subject) => {
    setLoadingDetails(true)
    setDetailsOpen(true)
    
    try {
      const subjectId = subject.subjectId || subject.id
      const result = await getSubjectById(subjectId)
      
      if (result.success) {
        setViewingSubject(result.data)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load subject details",
          variant: "destructive",
        })
        setDetailsOpen(false)
      }
    } catch (error) {
      console.error("Error loading subject details:", error)
      toast({
        title: "Error",
        description: "Failed to load subject details",
        variant: "destructive",
      })
      setDetailsOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return

    const subjectId = subjectToDelete.subjectId || subjectToDelete.id
    const subjectName = subjectToDelete.subjectName || subjectToDelete.name
    const subjectCode = subjectToDelete.subjectCode || subjectToDelete.code

    setIsDeleting(true)

    try {
      // Prepare the delete payload with subjectName, subjectCode, and force=true
      const deletePayload = {
        subjectName: subjectName,
        subjectCode: subjectCode,
        force: true  // Required to delete subjects with related data
      }

      console.log("🗑️ Deleting subject:", { subjectId, deletePayload })

      const result = await deleteSubject(subjectId, deletePayload)
      
      console.log("🗑️ Delete result:", result)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Subject "${subjectName}" and all related data deleted successfully`,
        })
        
        // Remove from local state
        setSubjects(prevSubjects => prevSubjects.filter((s) => (s.subjectId || s.id) !== subjectId))
        
        // Close the dialog
        setDeleteConfirmOpen(false)
        setSubjectToDelete(null)
      } else {
        // Show the specific error message from the backend
        toast({
          title: "Deletion Failed",
          description: result.error || result.message || "Failed to delete subject",
          variant: "destructive",
        })
        console.error("Delete error:", result)
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the subject",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogClose = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingSubject(null)
      setFormData({ 
        subjectName: "", 
        subjectCode: "", 
        description: "", 
        category: "", 
        color: "bg-blue-500" 
      })
    }
  }

  // Filter subjects based on search and filters
  const filteredSubjects = Array.isArray(subjects) ? subjects.filter((s) => {
    const matchesCategory = filterCategory === "all" || s.category === filterCategory
    const matchesColor = filterColor === "all" || s.color === filterColor
    const searchLower = localSearch.toLowerCase()
    const matchesSearch = localSearch === "" ||
      (s.subjectName || s.name || "").toLowerCase().includes(searchLower) ||
      (s.subjectCode || s.code || "").toLowerCase().includes(searchLower) ||
      (s.description || "").toLowerCase().includes(searchLower)
    
    return matchesCategory && matchesColor && matchesSearch
  }) : []

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              className="pl-9 bg-background"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border">
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                All Categories
              </DropdownMenuItem>
              <Separator className="my-1" />
              {categories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => setFilterCategory(cat)}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Color Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <div className={`size-4 rounded-full ${filterColor === "all" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" : filterColor}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border">
              <DropdownMenuItem onClick={() => setFilterColor("all")}>
                All Colors
              </DropdownMenuItem>
              <Separator className="my-1" />
              {colorOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => setFilterColor(option.value)}>
                  <div className={`size-4 rounded-full ${option.color} mr-2`} />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 size-4" />
              Add Subject
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
              <DialogDescription>
                {editingSubject 
                  ? "Update the subject details below" 
                  : "Create a new subject by filling in the details below"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subjectName">
                  Subject Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subjectName"
                  placeholder="e.g., Government"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  The full name of the subject
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subjectCode">
                  Subject Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subjectCode"
                  placeholder="e.g., GOV"
                  value={formData.subjectCode}
                  onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  A short code or abbreviation (max 10 characters)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Teaches about the various arms of government and its nuances"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  A brief description of what this subject covers
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select exam category" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The exam body this subject belongs to
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: option.value })}
                      className={`h-12 rounded-md border-2 transition-all ${
                        formData.color === option.value 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent hover:border-muted-foreground/20'
                      }`}
                    >
                      <div className={`h-full w-full rounded ${option.color} flex items-center justify-center`}>
                        {formData.color === option.value && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose a color to identify this subject (visual only)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleDialogClose(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.subjectName || !formData.subjectCode || !formData.description || !formData.category}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSubject ? "Update" : "Create"} Subject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {(filterCategory !== "all" || filterColor !== "all" || localSearch) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filterCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {filterCategory}
              <button onClick={() => setFilterCategory("all")} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          {filterColor !== "all" && (
            <Badge variant="secondary" className="gap-1">
              <div className={`size-3 rounded-full ${filterColor}`} />
              Color Filter
              <button onClick={() => setFilterColor("all")} className="ml-1 hover:text-destructive">×</button>
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
              setFilterCategory("all")
              setFilterColor("all")
              setLocalSearch("")
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* SUBJECT CARDS */}
       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSubjects.map((subject) => {
          const subjectId = subject.subjectId || subject.id

          return (
            <Card 
              key={subjectId} 
              className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
            >
              <div className={`h-1.5 w-full ${subject.color || 'bg-blue-500'}`} />
              <CardHeader className="pb-3 pt-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {subject.subjectCode || subject.code}
                    </Badge>
                    <CardTitle className="text-base truncate">
                      {subject.subjectName || subject.name}
                    </CardTitle>
                    {subject.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {subject.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border">
                      {/* ✅ ADD THIS NEW MENU ITEM */}
                      <DropdownMenuItem onClick={() => onSubjectSelect?.(subject)}>
                        <Layers className="size-4 mr-2" />
                        View Modules
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem onClick={() => handleViewDetails(subject)}>
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(subject)}>
                        <Pencil className="size-4 mr-2" />
                        Edit Subject
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => handleDeleteClick(subject)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete Subject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Layers className="size-3" /> Modules
                    </span>
                    <span className="font-semibold">
                      {subject.moduleCount || subject.modules || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <FileText className="size-3" /> Topics
                    </span>
                    <span className="font-semibold">
                      {subject.topicCount || subject.topics || 0}
                    </span>
                  </div>
                </div>
                {subject.category && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {subject.category}
                    </Badge>
                  </div>
                )}
              </CardContent>
              <Separator />
              <CardFooter className="bg-secondary/30 py-2 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Created by you
                </div>
                {/* ✅ ADD THIS BUTTON */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => onSubjectSelect?.(subject)}
                >
                  <Layers className="size-3 mr-1" />
                  Modules
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSubjects.map((subject) => {
          const subjectId = subject.subjectId || subject.id

          return (
            <Card 
              key={subjectId} 
              className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
            >
              <div className={`h-1.5 w-full ${subject.color || 'bg-blue-500'}`} />
              <CardHeader className="pb-3 pt-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {subject.subjectCode || subject.code}
                    </Badge>
                    <CardTitle className="text-base truncate">
                      {subject.subjectName || subject.name}
                    </CardTitle>
                    {subject.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {subject.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border">
                      <DropdownMenuItem onClick={() => handleViewDetails(subject)}>
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(subject)}>
                        <Pencil className="size-4 mr-2" />
                        Edit Subject
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => handleDeleteClick(subject)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete Subject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Layers className="size-3" /> Modules
                    </span>
                    <span className="font-semibold">
                      {subject.moduleCount || subject.modules || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <FileText className="size-3" /> Topics
                    </span>
                    <span className="font-semibold">
                      {subject.topicCount || subject.topics || 0}
                    </span>
                  </div>
                </div>
                {subject.category && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {subject.category}
                    </Badge>
                  </div>
                )}
              </CardContent>
              <Separator />
              <CardFooter className="bg-secondary/30 py-2">
                <div className="text-xs text-muted-foreground">
                  Created by you
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div> */}

      {/* EMPTY STATE */}
      {filteredSubjects.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center max-w-md">
              {localSearch || filterCategory !== "all" || filterColor !== "all"
                ? "No subjects match your search criteria. Try adjusting your filters."
                : "No subjects found. Create your first subject to get started."}
            </p>
            {(localSearch || filterCategory !== "all" || filterColor !== "all") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setLocalSearch("")
                  setFilterCategory("all")
                  setFilterColor("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* LOADING STATE */}
      {loading && subjects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
            <p className="text-muted-foreground text-center">Loading subjects...</p>
          </CardContent>
        </Card>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Delete Subject
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {subjectToDelete?.subjectName || subjectToDelete?.name}
                </span>
                ?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-2">
                <p className="text-destructive font-medium text-sm">
                  ⚠️ This will permanently delete:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• {subjectToDelete?.moduleCount || subjectToDelete?.modules || 0} modules</li>
                  <li>• {subjectToDelete?.topicCount || subjectToDelete?.topics || 0} topics</li>
                  <li>• All associated questions and quizzes</li>
                  <li>• All student progress data</li>
                </ul>
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
              Delete Subject
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
              Subject Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this subject
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
              <p className="text-muted-foreground text-center">Loading subject details...</p>
            </div>
          ) : viewingSubject ? (
            <div className="space-y-6 py-4">
              {/* Header Section */}
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-lg ${viewingSubject.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xl`}>
                  {(viewingSubject.subjectCode || viewingSubject.code || '??').substring(0, 3)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{viewingSubject.subjectName || viewingSubject.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="font-mono">
                      {viewingSubject.subjectCode || viewingSubject.code}
                    </Badge>
                    {viewingSubject.category && (
                      <Badge variant="outline">{viewingSubject.category}</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="size-4" />
                  Description
                </h4>
                <p className="text-muted-foreground">
                  {viewingSubject.description || 'No description provided'}
                </p>
              </div>

              <Separator />

              {/* Statistics */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Hash className="size-4" />
                  Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Layers className="size-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">{viewingSubject.moduleCount || viewingSubject.modules || 0}</p>
                        <p className="text-xs text-muted-foreground">Modules</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <FileText className="size-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold">{viewingSubject.topicCount || viewingSubject.topics || 0}</p>
                        <p className="text-xs text-muted-foreground">Topics</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <BookOpen className="size-8 mx-auto mb-2 text-purple-500" />
                        <p className="text-2xl font-bold">{viewingSubject.questionCount || viewingSubject.questions || 0}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <User className="size-8 mx-auto mb-2 text-amber-500" />
                        <p className="text-2xl font-bold">{viewingSubject.enrolledCount || viewingSubject.enrolled || 0}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="size-4" />
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Subject ID</p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {viewingSubject.subjectId || viewingSubject.id || 'N/A'}
                    </p>
                  </div>
                  {viewingSubject.createdAt && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Created At</p>
                      <p className="font-medium">
                        {new Date(viewingSubject.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {viewingSubject.updatedAt && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">
                        {new Date(viewingSubject.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {viewingSubject.tutorId && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Tutor ID</p>
                      <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {viewingSubject.tutorId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">No subject data available</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {viewingSubject && (
              <Button onClick={() => {
                setDetailsOpen(false)
                handleEdit(viewingSubject)
              }}>
                <Pencil className="size-4 mr-2" />
                Edit Subject
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}