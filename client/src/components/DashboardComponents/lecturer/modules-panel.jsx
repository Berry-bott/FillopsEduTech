// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter, Loader2, BookOpen } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"

// export default function ModulesPanel({ selectedSubject, subjectName, onModuleSelect, globalSearch }) {
//   const { toast } = useToast()
//   const { getModules, createModule, updateModule, deleteModule, loading } = useTutorStore()

//   const [modules, setModules] = useState([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingModule, setEditingModule] = useState(null)
//   const [formData, setFormData] = useState({ name: "", description: "", order: "" })
//   const [localSearch, setLocalSearch] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Fetch modules on mount and when subject changes
//   useEffect(() => {
//     console.log("🔍 Selected Subject changed:", selectedSubject)
//     if (selectedSubject) {
//       fetchModules()
//     } else {
//       setModules([])
//     }
//   }, [selectedSubject])

//   const fetchModules = async () => {
//   try {
//     const result = await getModules()  
    
//     if (result.success) {
//       // Get modules from the result
//       const modulesData = result.data.modules || result.data || []
      
//       console.log("🔍 All modules fetched:", modulesData)
//       console.log("🔍 Selected subject ID:", selectedSubject)
//       console.log("🔍 Sample module subject.id:", modulesData[0]?.subject?.id)
      
//       // Filter by subject.id instead of subjectId
//       const filteredModules = modulesData.filter((m) => {
//         console.log(`Comparing: "${m.subject?.id}" === "${selectedSubject}"`, m.subject?.id === selectedSubject)
//         return m.subject?.id === selectedSubject
//       })
      
//       console.log("📦 Modules for subject:", { selectedSubject, filteredModules })
//       setModules(filteredModules)
//     } else {
//       toast({
//         title: "Error",
//         description: result.message || "Failed to fetch modules",
//         variant: "destructive",
//       })
//     }
//   } catch (error) {
//     console.error("Error fetching modules:", error)
//     toast({
//       title: "Error",
//       description: "Failed to load modules",
//       variant: "destructive",
//       })
//   }
// }

//     const handleSubmit = async (e) => {
//       e.preventDefault()

//       if (!selectedSubject) {
//         toast({
//           title: "Error",
//           description: "Please select a subject first",
//           variant: "destructive",
//         })
//         return
//       }

//       setIsSubmitting(true)

//       try {
//         const moduleData = {
//           moduleName: formData.name,
//           description: formData.description,
//           order: parseInt(formData.order),
//         }

//         const result = editingModule
//           ? await updateModule(editingModule.id, moduleData)
//           : await createModule(selectedSubject, moduleData)

//         if (result.success) {
//           toast({
//             title: "Success",
//             description: editingModule 
//               ? "Module updated successfully" 
//               : "Module created successfully",
//           })

//           await fetchModules()

//           setFormData({ name: "", description: "", order: "" })
//           setEditingModule(null)
//           setIsDialogOpen(false)
//         } else {
//           toast({
//             title: "Error",
//             description: result.message || "Failed to save module",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Error saving module:", error)
//         toast({
//           title: "Error",
//           description: "An error occurred while saving the module",
//           variant: "destructive",
//         })
//       } finally {
//         setIsSubmitting(false)
//       }
//     }

//   const handleEdit = (module) => {
//     setEditingModule(module)
//     setFormData({
//       name: module.moduleName,
//       description: module.description,
//       order: module.order.toString(),
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDelete = async (moduleId) => {
//     if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
//       return
//     }

//     try {
//       const result = await deleteModule(moduleId)

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "Module deleted successfully",
//         })

//         // Refresh modules list
//         await fetchModules()
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to delete module",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting module:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while deleting the module",
//         variant: "destructive",
//       })
//     }
//   }

//   const searchTerm = globalSearch || localSearch

//   const filteredModules = modules.filter((m) =>
//     searchTerm === "" || 
//     m.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     m.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // Sort by order
//   const sortedModules = [...filteredModules].sort((a, b) => a.order - b.order)

//   if (!selectedSubject) {
//     return (
//       <div className="flex items-center justify-center h-[400px]">
//         <div className="text-center space-y-4">
//           <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
//           <div>
//             <p className="text-lg font-semibold text-muted-foreground">No Subject Selected</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               Please select a subject from the Subjects tab to view its modules
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Subject Header */}
//       {subjectName && (
//         <div className="flex items-center gap-3 pb-4 border-b">
//           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <BookOpen className="w-5 h-5 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">{subjectName}</h2>
//             <p className="text-sm text-muted-foreground">Manage modules for this subject</p>
//           </div>
//         </div>
//       )}

//       {/* TOP BAR */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Search */}
//         <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
//           <div className="relative w-full sm:w-[300px]">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search modules..."
//               className="w-full bg-background pl-9"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* CREATE MODULE DIALOG */}
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open)
//             if (!open) {
//               setEditingModule(null)
//               setFormData({ name: "", description: "", order: "" })
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="w-full sm:w-auto flex justify-center sm:justify-start">
//               <Plus className="mr-2 size-4" />
//               New Module
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[500px] w-full">
//             <form onSubmit={handleSubmit}>
//               <DialogHeader>
//                 <DialogTitle>{editingModule ? "Edit Module" : "Add New Module"}</DialogTitle>
//                 <DialogDescription>
//                   {editingModule ? "Update" : "Create"} a module for the selected subject
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="grid gap-4 py-4">
//                 <div className="space-y-2">
//                   <Label>Module Name</Label>
//                   <Input
//                     placeholder="e.g., Algebra Fundamentals"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Module Order</Label>
//                   <Input
//                     type="number"
//                     placeholder="e.g., 1"
//                     value={formData.order}
//                     onChange={(e) => setFormData({ ...formData, order: e.target.value })}
//                     required
//                     min="1"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Description</Label>
//                   <Textarea
//                     placeholder="Brief description of the module..."
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     rows={3}
//                     required
//                   />
//                 </div>
//               </div>

//               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setIsDialogOpen(false)}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       {editingModule ? "Updating..." : "Creating..."}
//                     </>
//                   ) : (
//                     <>{editingModule ? "Update" : "Create"} Module</>
//                   )}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* TABLE */}
//       <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[300px]">Module Name</TableHead>
//               <TableHead>Order</TableHead>
//               <TableHead>Topics</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">Loading modules...</p>
//                 </TableCell>
//               </TableRow>
//             ) : sortedModules.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                   {searchTerm 
//                     ? "No modules found matching your search" 
//                     : "No modules found. Create your first module."}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               sortedModules.map((module) => (
//                 <TableRow key={module.id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-3">
//                       <div className="flex size-9 items-center justify-center rounded bg-secondary text-secondary-foreground">
//                         <FolderOpen className="size-4" />
//                       </div>
//                       <div>
//                         <div className="font-semibold">{module.moduleName}</div>
//                         <div className="text-xs text-muted-foreground line-clamp-1">
//                           {module.description}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline" className="font-mono">
//                       #{module.order}
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="secondary" className="font-normal">
//                       {module._count?.topic || 0} Topics
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
//                       Active
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="size-4" />
//                         </Button>
//                       </DropdownMenuTrigger>

//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleEdit(module)}>
//                           <Pencil className="size-4 mr-2" />
//                           Edit Module
//                         </DropdownMenuItem>

//                         <DropdownMenuItem 
//                           className="text-destructive" 
//                           onClick={() => handleDelete(module.id)}
//                         >
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }



// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter, Loader2, BookOpen, Eye, Trash2, AlertTriangle, Calendar, Hash, FileText } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"

// export default function ModulesPanel({ selectedSubject, subjectName, onModuleSelect, globalSearch }) {
//   const { toast } = useToast()
//   const { getModules, createModule, updateModule, deleteModule, getModuleById, loading } = useTutorStore()

//   const [modules, setModules] = useState([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingModule, setEditingModule] = useState(null)
//   const [formData, setFormData] = useState({ name: "", description: "", order: "" })
//   const [localSearch, setLocalSearch] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [viewingModule, setViewingModule] = useState(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [loadingDetails, setLoadingDetails] = useState(false)

//   // Fetch modules on mount and when subject changes
//   useEffect(() => {
//     console.log("🔍 Selected Subject changed:", selectedSubject)
//     if (selectedSubject) {
//       fetchModules()
//     } else {
//       setModules([])
//     }
//   }, [selectedSubject])

//   const fetchModules = async () => {
//     try {
//       const result = await getModules()
      
//       if (result.success) {
//         // ✅ FIX: Handle the correct data structure {modules: [...], pagination: {...}}
//         const modulesData = result.data.modules || result.data || []
        
//         console.log("🔍 All modules fetched:", modulesData)
//         console.log("🔍 Selected subject ID:", selectedSubject)
//         console.log("🔍 Sample module subject.id:", modulesData[0]?.subject?.id)
        
//         // ✅ FIX: Filter by subject.id instead of subjectId
//         const filteredModules = modulesData.filter((m) => {
//           console.log(`Comparing: "${m.subject?.id}" === "${selectedSubject}"`, m.subject?.id === selectedSubject)
//           return m.subject?.id === selectedSubject
//         })
        
//         console.log("📦 Modules for subject:", { selectedSubject, filteredModules })
//         setModules(filteredModules)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to fetch modules",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching modules:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load modules",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!selectedSubject) {
//       toast({
//         title: "Error",
//         description: "Please select a subject first",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const moduleData = {
//         moduleName: formData.name,
//         description: formData.description,
//         order: parseInt(formData.order),
//       }

//       let result

//       if (editingModule) {
//         // Update existing module
//         result = await updateModule(editingModule.id, moduleData)
//       } else {
//         // Create new module
//         result = await createModule(selectedSubject, moduleData)
//       }

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: editingModule 
//             ? "Module updated successfully" 
//             : "Module created successfully",
//         })

//         // Refresh modules list
//         await fetchModules()

//         // Reset form
//         setFormData({ name: "", description: "", order: "" })
//         setEditingModule(null)
//         setIsDialogOpen(false)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to save module",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error saving module:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while saving the module",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = (module) => {
//     setEditingModule(module)
//     setFormData({
//       name: module.moduleName,
//       description: module.description,
//       order: module.order.toString(),
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDelete = async (moduleId) => {
//     if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
//       return
//     }

//     try {
//       const result = await deleteModule(moduleId)

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "Module deleted successfully",
//         })

//         // Refresh modules list
//         await fetchModules()
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to delete module",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting module:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while deleting the module",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewDetails = async (module) => {
//     setLoadingDetails(true)
//     setDetailsOpen(true)
    
//     try {
//       const result = await getModuleById(module.id)
      
//       if (result.success) {
//         setViewingModule(result.data)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load module details",
//           variant: "destructive",
//         })
//         setDetailsOpen(false)
//       }
//     } catch (error) {
//       console.error("Error loading module details:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load module details",
//         variant: "destructive",
//       })
//       setDetailsOpen(false)
//     } finally {
//       setLoadingDetails(false)
//     }
//   }

//   const searchTerm = globalSearch || localSearch

//   const filteredModules = modules.filter((m) =>
//     searchTerm === "" || 
//     m.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     m.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // Sort by order
//   const sortedModules = [...filteredModules].sort((a, b) => a.order - b.order)

//   if (!selectedSubject) {
//     return (
//       <div className="flex items-center justify-center h-[400px]">
//         <div className="text-center space-y-4">
//           <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
//           <div>
//             <p className="text-lg font-semibold text-muted-foreground">No Subject Selected</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               Please select a subject from the Subjects tab to view its modules
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Subject Header */}
//       {subjectName && (
//         <div className="flex items-center gap-3 pb-4 border-b">
//           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <BookOpen className="w-5 h-5 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">{subjectName}</h2>
//             <p className="text-sm text-muted-foreground">Manage modules for this subject</p>
//           </div>
//         </div>
//       )}

//       {/* TOP BAR */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Search */}
//         <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
//           <div className="relative w-full sm:w-[300px]">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search modules..."
//               className="w-full bg-background pl-9"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* CREATE MODULE DIALOG */}
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open)
//             if (!open) {
//               setEditingModule(null)
//               setFormData({ name: "", description: "", order: "" })
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="w-full sm:w-auto flex justify-center sm:justify-start">
//               <Plus className="mr-2 size-4" />
//               New Module
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[500px] w-full">
//             <form onSubmit={handleSubmit}>
//               <DialogHeader>
//                 <DialogTitle>{editingModule ? "Edit Module" : "Add New Module"}</DialogTitle>
//                 <DialogDescription>
//                   {editingModule ? "Update" : "Create"} a module for the selected subject
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="grid gap-4 py-4">
//                 <div className="space-y-2">
//                   <Label>Module Name</Label>
//                   <Input
//                     placeholder="e.g., Algebra Fundamentals"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Module Order</Label>
//                   <Input
//                     type="number"
//                     placeholder="e.g., 1"
//                     value={formData.order}
//                     onChange={(e) => setFormData({ ...formData, order: e.target.value })}
//                     required
//                     min="1"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Description</Label>
//                   <Textarea
//                     placeholder="Brief description of the module..."
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     rows={3}
//                     required
//                   />
//                 </div>
//               </div>

//               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setIsDialogOpen(false)}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       {editingModule ? "Updating..." : "Creating..."}
//                     </>
//                   ) : (
//                     <>{editingModule ? "Update" : "Create"} Module</>
//                   )}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* TABLE */}
//       <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[300px]">Module Name</TableHead>
//               <TableHead>Order</TableHead>
//               <TableHead>Topics</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">Loading modules...</p>
//                 </TableCell>
//               </TableRow>
//             ) : sortedModules.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                   {searchTerm 
//                     ? "No modules found matching your search" 
//                     : "No modules found. Create your first module."}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               sortedModules.map((module) => (
//                 <TableRow key={module.id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-3">
//                       <div className="flex size-9 items-center justify-center rounded bg-secondary text-secondary-foreground">
//                         <FolderOpen className="size-4" />
//                       </div>
//                       <div>
//                         <div className="font-semibold">{module.moduleName}</div>
//                         <div className="text-xs text-muted-foreground line-clamp-1">
//                           {module.description}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline" className="font-mono">
//                       #{module.order}
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="secondary" className="font-normal">
//                       {module._count?.topic || module.topicCount || 0} Topics
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
//                       Active
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="size-4" />
//                         </Button>
//                       </DropdownMenuTrigger>

//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleViewDetails(module)}>
//                           <Eye className="size-4 mr-2" />
//                           View Details
//                         </DropdownMenuItem>
//                         <Separator className="my-1" />
//                         <DropdownMenuItem onClick={() => handleEdit(module)}>
//                           <Pencil className="size-4 mr-2" />
//                           Edit Module
//                         </DropdownMenuItem>

//                         <DropdownMenuItem 
//                           className="text-destructive" 
//                           onClick={() => handleDelete(module.id)}
//                         >
//                           <Trash2 className="size-4 mr-2" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* VIEW DETAILS DIALOG */}
//       <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="size-5" />
//               Module Details
//             </DialogTitle>
//             <DialogDescription>
//               Complete information about this module
//             </DialogDescription>
//           </DialogHeader>

//           {loadingDetails ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//               <p className="text-muted-foreground text-center">Loading module details...</p>
//             </div>
//           ) : viewingModule ? (
//             <div className="space-y-6 py-4">
//               <div className="flex items-start gap-4">
//                 <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <FolderOpen className="w-8 h-8 text-primary" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-2xl font-bold">{viewingModule.moduleName}</h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Badge variant="outline" className="font-mono">
//                       #{viewingModule.order}
//                     </Badge>
//                     {viewingModule.subject && (
//                       <Badge variant="secondary">
//                         {viewingModule.subject.subjectName}
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
//                   {viewingModule.description || 'No description provided'}
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Hash className="size-4" />
//                   Statistics
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <FileText className="size-8 mx-auto mb-2 text-blue-500" />
//                         <p className="text-2xl font-bold">{viewingModule._count?.topic || 0}</p>
//                         <p className="text-xs text-muted-foreground">Topics</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <BookOpen className="size-8 mx-auto mb-2 text-green-500" />
//                         <p className="text-2xl font-bold">{viewingModule._count?.question || 0}</p>
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
//                     <p className="text-muted-foreground">Module ID</p>
//                     <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
//                       {viewingModule.id || 'N/A'}
//                     </p>
//                   </div>
//                   {viewingModule.createdAt && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Created At</p>
//                       <p className="font-medium">
//                         {new Date(viewingModule.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   {viewingModule.subject && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Subject</p>
//                       <p className="font-medium">
//                         {viewingModule.subject.subjectName} ({viewingModule.subject.subjectCode})
//                       </p>
//                     </div>
//                   )}
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Order</p>
//                     <p className="font-medium">Module #{viewingModule.order}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12">
//               <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center">No module data available</p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailsOpen(false)}>
//               Close
//             </Button>
//             {viewingModule && (
//               <Button onClick={() => {
//                 setDetailsOpen(false)
//                 handleEdit(viewingModule)
//               }}>
//                 <Pencil className="size-4 mr-2" />
//                 Edit Module
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter, Loader2, BookOpen, Eye, Trash2, AlertTriangle, Calendar, Hash, FileText } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorStore from "@/store/tutorStore"

// export default function ModulesPanel({ selectedSubject, subjectName, onModuleSelect, onTopicSelect, globalSearch }) {
//   const { toast } = useToast()
//   const { getModules, createModule, updateModule, deleteModule, getModuleById, loading } = useTutorStore()

//   const [modules, setModules] = useState([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingModule, setEditingModule] = useState(null)
//   const [formData, setFormData] = useState({ name: "", description: "", order: "" })
//   const [localSearch, setLocalSearch] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [viewingModule, setViewingModule] = useState(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [loadingDetails, setLoadingDetails] = useState(false)

//   // Fetch modules on mount and when subject changes
//   useEffect(() => {
//     console.log("🔍 Selected Subject changed:", selectedSubject)
//     if (selectedSubject) {
//       fetchModules()
//     } else {
//       setModules([])
//     }
//   }, [selectedSubject])

//   const fetchModules = async () => {
//     try {
//       const result = await getModules()
      
//       if (result.success) {
//         // ✅ FIX: Handle the correct data structure {modules: [...], pagination: {...}}
//         const modulesData = result.data.modules || result.data || []
        
//         console.log("🔍 All modules fetched:", modulesData)
//         console.log("🔍 Selected subject ID:", selectedSubject)
//         console.log("🔍 Sample module subject.id:", modulesData[0]?.subject?.id)
        
//         // ✅ FIX: Filter by subject.id instead of subjectId
//         const filteredModules = modulesData.filter((m) => {
//           console.log(`Comparing: "${m.subject?.id}" === "${selectedSubject}"`, m.subject?.id === selectedSubject)
//           return m.subject?.id === selectedSubject
//         })
        
//         console.log("📦 Modules for subject:", { selectedSubject, filteredModules })
//         setModules(filteredModules)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to fetch modules",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching modules:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load modules",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!selectedSubject) {
//       toast({
//         title: "Error",
//         description: "Please select a subject first",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const moduleData = {
//         moduleName: formData.name,
//         description: formData.description,
//         order: parseInt(formData.order),
//       }

//       let result

//       if (editingModule) {
//         // Update existing module
//         result = await updateModule(editingModule.id, moduleData)
//       } else {
//         // Create new module
//         result = await createModule(selectedSubject, moduleData)
//       }

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: editingModule 
//             ? "Module updated successfully" 
//             : "Module created successfully",
//         })

//         // Refresh modules list
//         await fetchModules()

//         // Reset form
//         setFormData({ name: "", description: "", order: "" })
//         setEditingModule(null)
//         setIsDialogOpen(false)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to save module",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error saving module:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while saving the module",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = (module) => {
//     setEditingModule(module)
//     setFormData({
//       name: module.moduleName,
//       description: module.description,
//       order: module.order.toString(),
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDelete = async (moduleId) => {
//     if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
//       return
//     }

//     try {
//       const result = await deleteModule(moduleId)

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "Module deleted successfully",
//         })

//         // Refresh modules list
//         await fetchModules()
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to delete module",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting module:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while deleting the module",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewDetails = async (module) => {
//     setLoadingDetails(true)
//     setDetailsOpen(true)
    
//     try {
//       const result = await getModuleById(module.id)
      
//       if (result.success) {
//         setViewingModule(result.data)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load module details",
//           variant: "destructive",
//         })
//         setDetailsOpen(false)
//       }
//     } catch (error) {
//       console.error("Error loading module details:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load module details",
//         variant: "destructive",
//       })
//       setDetailsOpen(false)
//     } finally {
//       setLoadingDetails(false)
//     }
//   }

//   const searchTerm = globalSearch || localSearch

//   const filteredModules = modules.filter((m) =>
//     searchTerm === "" || 
//     m.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     m.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // Sort by order
//   const sortedModules = [...filteredModules].sort((a, b) => a.order - b.order)

//   if (!selectedSubject) {
//     return (
//       <div className="flex items-center justify-center h-[400px]">
//         <div className="text-center space-y-4">
//           <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
//           <div>
//             <p className="text-lg font-semibold text-muted-foreground">No Subject Selected</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               Please select a subject from the Subjects tab to view its modules
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Subject Header */}
//       {subjectName && (
//         <div className="flex items-center gap-3 pb-4 border-b">
//           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <BookOpen className="w-5 h-5 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">{subjectName}</h2>
//             <p className="text-sm text-muted-foreground">Manage modules for this subject</p>
//           </div>
//         </div>
//       )}

//       {/* TOP BAR */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Search */}
//         <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
//           <div className="relative w-full sm:w-[300px]">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search modules..."
//               className="w-full bg-background pl-9"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* CREATE MODULE DIALOG */}
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open)
//             if (!open) {
//               setEditingModule(null)
//               setFormData({ name: "", description: "", order: "" })
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="w-full sm:w-auto flex justify-center sm:justify-start">
//               <Plus className="mr-2 size-4" />
//               New Module
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[500px] w-full">
//             <form onSubmit={handleSubmit}>
//               <DialogHeader>
//                 <DialogTitle>{editingModule ? "Edit Module" : "Add New Module"}</DialogTitle>
//                 <DialogDescription>
//                   {editingModule ? "Update" : "Create"} a module for the selected subject
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="grid gap-4 py-4">
//                 <div className="space-y-2">
//                   <Label>Module Name</Label>
//                   <Input
//                     placeholder="e.g., Algebra Fundamentals"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Module Order</Label>
//                   <Input
//                     type="number"
//                     placeholder="e.g., 1"
//                     value={formData.order}
//                     onChange={(e) => setFormData({ ...formData, order: e.target.value })}
//                     required
//                     min="1"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Description</Label>
//                   <Textarea
//                     placeholder="Brief description of the module..."
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     rows={3}
//                     required
//                   />
//                 </div>
//               </div>

//               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setIsDialogOpen(false)}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       {editingModule ? "Updating..." : "Creating..."}
//                     </>
//                   ) : (
//                     <>{editingModule ? "Update" : "Create"} Module</>
//                   )}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* TABLE */}
//       <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[300px]">Module Name</TableHead>
//               <TableHead>Order</TableHead>
//               <TableHead>Topics</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">Loading modules...</p>
//                 </TableCell>
//               </TableRow>
//             ) : sortedModules.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                   {searchTerm 
//                     ? "No modules found matching your search" 
//                     : "No modules found. Create your first module."}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               sortedModules.map((module) => (
//                 <TableRow 
//                   key={module.id} 
//                   className="cursor-pointer hover:bg-muted/50"
//                   onClick={() => onTopicSelect && onTopicSelect(module.id, module.moduleName, subjectName)}
//                 >
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-3">
//                       <div className="flex size-9 items-center justify-center rounded bg-secondary text-secondary-foreground">
//                         <FolderOpen className="size-4" />
//                       </div>
//                       <div>
//                         <div className="font-semibold">{module.moduleName}</div>
//                         <div className="text-xs text-muted-foreground line-clamp-1">
//                           {module.description}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline" className="font-mono">
//                       #{module.order}
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="secondary" className="font-normal">
//                       {module._count?.topic || module.topicCount || 0} Topics
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
//                       Active
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="size-4" />
//                         </Button>
//                       </DropdownMenuTrigger>

//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleViewDetails(module)}>
//                           <Eye className="size-4 mr-2" />
//                           View Details
//                         </DropdownMenuItem>
//                         <Separator className="my-1" />
//                         <DropdownMenuItem onClick={() => handleEdit(module)}>
//                           <Pencil className="size-4 mr-2" />
//                           Edit Module
//                         </DropdownMenuItem>

//                         <DropdownMenuItem 
//                           className="text-destructive" 
//                           onClick={() => handleDelete(module.id)}
//                         >
//                           <Trash2 className="size-4 mr-2" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* VIEW DETAILS DIALOG */}
//       <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="size-5" />
//               Module Details
//             </DialogTitle>
//             <DialogDescription>
//               Complete information about this module
//             </DialogDescription>
//           </DialogHeader>

//           {loadingDetails ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//               <p className="text-muted-foreground text-center">Loading module details...</p>
//             </div>
//           ) : viewingModule ? (
//             <div className="space-y-6 py-4">
//               <div className="flex items-start gap-4">
//                 <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <FolderOpen className="w-8 h-8 text-primary" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-2xl font-bold">{viewingModule.moduleName}</h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Badge variant="outline" className="font-mono">
//                       #{viewingModule.order}
//                     </Badge>
//                     {viewingModule.subject && (
//                       <Badge variant="secondary">
//                         {viewingModule.subject.subjectName}
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
//                   {viewingModule.description || 'No description provided'}
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Hash className="size-4" />
//                   Statistics
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <FileText className="size-8 mx-auto mb-2 text-blue-500" />
//                         <p className="text-2xl font-bold">{viewingModule._count?.topic || 0}</p>
//                         <p className="text-xs text-muted-foreground">Topics</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="text-center">
//                         <BookOpen className="size-8 mx-auto mb-2 text-green-500" />
//                         <p className="text-2xl font-bold">{viewingModule._count?.question || 0}</p>
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
//                     <p className="text-muted-foreground">Module ID</p>
//                     <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
//                       {viewingModule.id || 'N/A'}
//                     </p>
//                   </div>
//                   {viewingModule.createdAt && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Created At</p>
//                       <p className="font-medium">
//                         {new Date(viewingModule.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   {viewingModule.subject && (
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Subject</p>
//                       <p className="font-medium">
//                         {viewingModule.subject.subjectName} ({viewingModule.subject.subjectCode})
//                       </p>
//                     </div>
//                   )}
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Order</p>
//                     <p className="font-medium">Module #{viewingModule.order}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12">
//               <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center">No module data available</p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailsOpen(false)}>
//               Close
//             </Button>
//             {viewingModule && (
//               <Button onClick={() => {
//                 setDetailsOpen(false)
//                 handleEdit(viewingModule)
//               }}>
//                 <Pencil className="size-4 mr-2" />
//                 Edit Module
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter, Loader2, BookOpen, Eye, Trash2, AlertTriangle, Calendar, Hash, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

export default function ModulesPanel({ selectedSubject, subjectName, onModuleSelect, onTopicSelect, globalSearch, selectedModuleId }) {
  const { toast } = useToast()
  const { getModules, createModule, updateModule, deleteModule, getModuleById, loading } = useTutorStore()

  const [modules, setModules] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", order: "" })
  const [localSearch, setLocalSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingModule, setViewingModule] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch modules on mount and when subject changes
  useEffect(() => {
    console.log("🔍 Selected Subject changed:", selectedSubject)
    if (selectedSubject) {
      fetchModules()
    } else {
      setModules([])
    }
  }, [selectedSubject])

  const fetchModules = async () => {
    try {
      const result = await getModules()
      
      if (result.success) {
        // ✅ FIX: Handle the correct data structure {modules: [...], pagination: {...}}
        const modulesData = result.data.modules || result.data || []
        
        console.log("🔍 All modules fetched:", modulesData)
        console.log("🔍 Selected subject ID:", selectedSubject)
        console.log("🔍 Sample module subject.id:", modulesData[0]?.subject?.id)
        
        // ✅ FIX: Filter by subject.id instead of subjectId
        const filteredModules = modulesData.filter((m) => {
          console.log(`Comparing: "${m.subject?.id}" === "${selectedSubject}"`, m.subject?.id === selectedSubject)
          return m.subject?.id === selectedSubject
        })
        
        console.log("📦 Modules for subject:", { selectedSubject, filteredModules })
        setModules(filteredModules)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch modules",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching modules:", error)
      toast({
        title: "Error",
        description: "Failed to load modules",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const moduleData = {
        moduleName: formData.name,
        description: formData.description,
        order: parseInt(formData.order),
      }

      let result

      if (editingModule) {
        // Update existing module
        result = await updateModule(editingModule.id, moduleData)
      } else {
        // Create new module
        result = await createModule(selectedSubject, moduleData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: editingModule 
            ? "Module updated successfully" 
            : "Module created successfully",
        })

        // Refresh modules list
        await fetchModules()

        // Reset form
        setFormData({ name: "", description: "", order: "" })
        setEditingModule(null)
        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save module",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving module:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving the module",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (module) => {
    setEditingModule(module)
    setFormData({
      name: module.moduleName,
      description: module.description,
      order: module.order.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (moduleId) => {
    setModuleToDelete(modules.find(m => m.id === moduleId))
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!moduleToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteModule(moduleToDelete.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Module deleted successfully",
        })

        await fetchModules()
        setDeleteConfirmOpen(false)
        setModuleToDelete(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete module",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting module:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the module",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewDetails = async (module) => {
    setLoadingDetails(true)
    setDetailsOpen(true)
    
    try {
      const result = await getModuleById(module.id)
      
      if (result.success) {
        setViewingModule(result.data)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load module details",
          variant: "destructive",
        })
        setDetailsOpen(false)
      }
    } catch (error) {
      console.error("Error loading module details:", error)
      toast({
        title: "Error",
        description: "Failed to load module details",
        variant: "destructive",
      })
      setDetailsOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const searchTerm = globalSearch || localSearch

  const filteredModules = modules.filter((m) =>
    searchTerm === "" || 
    m.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort by order
  const sortedModules = [...filteredModules].sort((a, b) => a.order - b.order)

  if (!selectedSubject) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold text-muted-foreground">No Subject Selected</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please select a subject from the Subjects tab to view its modules
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      {subjectName && (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{subjectName}</h2>
            <p className="text-sm text-muted-foreground">Manage modules for this subject</p>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              className="w-full bg-background pl-9"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>

        {/* CREATE MODULE DIALOG */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingModule(null)
              setFormData({ name: "", description: "", order: "" })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex justify-center sm:justify-start">
              <Plus className="mr-2 size-4" />
              New Module
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] w-full">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingModule ? "Edit Module" : "Add New Module"}</DialogTitle>
                <DialogDescription>
                  {editingModule ? "Update" : "Create"} a module for the selected subject
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Module Name</Label>
                  <Input
                    placeholder="e.g., Algebra Fundamentals"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Module Order</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of the module..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingModule ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingModule ? "Update" : "Create"} Module</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Module Name</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading modules...</p>
                </TableCell>
              </TableRow>
            ) : sortedModules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm 
                    ? "No modules found matching your search" 
                    : "No modules found. Create your first module."}
                </TableCell>
              </TableRow>
            ) : (
              sortedModules.map((module) => (
                <TableRow 
                  key={module.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedModuleId === module.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => onTopicSelect && onTopicSelect(module.id, module.moduleName, subjectName)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded bg-secondary text-secondary-foreground">
                        <FolderOpen className="size-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{module.moduleName}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {module.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      #{module.order}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {module._count?.topic || module.topicCount || 0} Topics
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                      Active
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(module)}>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <Separator className="my-1" />
                        <DropdownMenuItem onClick={() => handleEdit(module)}>
                          <Pencil className="size-4 mr-2" />
                          Edit Module
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => handleDelete(module.id)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Module Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this module
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
              <p className="text-muted-foreground text-center">Loading module details...</p>
            </div>
          ) : viewingModule ? (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{viewingModule.moduleName}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="font-mono">
                      #{viewingModule.order}
                    </Badge>
                    {viewingModule.subject && (
                      <Badge variant="secondary">
                        {viewingModule.subject.subjectName}
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
                  {viewingModule.description || 'No description provided'}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Hash className="size-4" />
                  Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <FileText className="size-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">{viewingModule._count?.topic || 0}</p>
                        <p className="text-xs text-muted-foreground">Topics</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <BookOpen className="size-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold">{viewingModule._count?.question || 0}</p>
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
                    <p className="text-muted-foreground">Module ID</p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {viewingModule.id || 'N/A'}
                    </p>
                  </div>
                  {viewingModule.createdAt && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Created At</p>
                      <p className="font-medium">
                        {new Date(viewingModule.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {viewingModule.subject && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Subject</p>
                      <p className="font-medium">
                        {viewingModule.subject.subjectName} ({viewingModule.subject.subjectCode})
                      </p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Order</p>
                    <p className="font-medium">Module #{viewingModule.order}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">No module data available</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {viewingModule && (
              <Button onClick={() => {
                setDetailsOpen(false)
                handleEdit(viewingModule)
              }}>
                <Pencil className="size-4 mr-2" />
                Edit Module
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Delete Module
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {moduleToDelete?.moduleName}
                </span>
                ?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-2">
                <p className="text-destructive font-medium text-sm">
                  ⚠️ This will permanently delete:
                </p>
                <div className="text-sm text-muted-foreground space-y-1 ml-4">
                  <div>• {moduleToDelete?._count?.topic || 0} topics</div>
                  <div>• {moduleToDelete?._count?.question || 0} questions</div>
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
              Delete Module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}