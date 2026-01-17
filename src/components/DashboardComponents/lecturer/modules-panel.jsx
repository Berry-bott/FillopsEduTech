// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter } from "lucide-react"
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

// export default function ModulesPanel({ context, modules, setModules, subjects, globalSearch }) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingModule, setEditingModule] = useState(null)
//   const [formData, setFormData] = useState({ name: "", subject: "", description: "", order: "" })
//   const [localSearch, setLocalSearch] = useState("")
//   const [filterSubject, setFilterSubject] = useState("all")
//   const [showFilter, setShowFilter] = useState(false)

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (editingModule) {
//       setModules(
//         modules.map((m) =>
//           m.id === editingModule.id
//             ? {
//                 ...m,
//                 ...formData,
//                 order: parseInt(formData.order),
//                 examBody: context.examBody,
//                 year: context.year,
//               }
//             : m
//         )
//       )
//       setEditingModule(null)
//     } else {
//       const newModule = {
//         id: Date.now().toString(),
//         ...formData,
//         order: parseInt(formData.order),
//         topics: 0,
//         examBody: context.examBody,
//         year: context.year,
//       }

//       setModules([...modules, newModule])
//     }

//     setFormData({ name: "", subject: "", description: "", order: "" })
//     setIsDialogOpen(false)
//   }

//   const handleEdit = (module) => {
//     setEditingModule(module)
//     setFormData({
//       name: module.name,
//       subject: module.subject,
//       description: module.description,
//       order: module.order.toString(),
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDelete = (id) => {
//     setModules(modules.filter((m) => m.id !== id))
//   }

//   const searchTerm = globalSearch || localSearch
//   const contextSubjects = subjects.filter((s) => s.examBody === context.examBody && s.year === context.year)

//   const filteredModules = modules.filter(
//     (m) =>
//       m.examBody === context.examBody &&
//       m.year === context.year &&
//       (filterSubject === "all" || m.subject === filterSubject) &&
//       (searchTerm === "" || m.name.toLowerCase().includes(searchTerm.toLowerCase()))
//   )

//   return (
//     // <div className="space-y-6">
//     //   {/* TOP BAR */}
//     //   <div className="flex items-center justify-between">
//     //     <div className="flex items-center gap-2">
//     //       <div className="relative">
//     //         <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//     //         <Input
//     //           placeholder="Search modules..."
//     //           className="w-[300px] bg-background pl-9"
//     //           value={localSearch}
//     //           onChange={(e) => setLocalSearch(e.target.value)}
//     //         />
//     //       </div>

//     //       <DropdownMenu open={showFilter} onOpenChange={setShowFilter}>
//     //         <DropdownMenuTrigger asChild>
//     //           <Button variant="outline" size="icon">
//     //             <Filter className="size-4" />
//     //           </Button>
//     //         </DropdownMenuTrigger>

//     //         <DropdownMenuContent align="start">
//     //           <DropdownMenuItem onClick={() => setFilterSubject("all")}>All Subjects</DropdownMenuItem>

//     //           {contextSubjects.map((subject) => (
//     //             <DropdownMenuItem key={subject.id} onClick={() => setFilterSubject(subject.name)}>
//     //               {subject.name}
//     //             </DropdownMenuItem>
//     //           ))}
//     //         </DropdownMenuContent>
//     //       </DropdownMenu>
//     //     </div>

//     //     {/* CREATE MODULE DIALOG */}
//     //     <Dialog
//     //       open={isDialogOpen}
//     //       onOpenChange={(open) => {
//     //         setIsDialogOpen(open)
//     //         if (!open) {
//     //           setEditingModule(null)
//     //           setFormData({ name: "", subject: "", description: "", order: "" })
//     //         }
//     //       }}
//     //     >
//     //       <DialogTrigger asChild>
//     //         <Button>
//     //           <Plus className="mr-2 size-4" />
//     //           New Module
//     //         </Button>
//     //       </DialogTrigger>

//     //       <DialogContent className="sm:max-w-[500px]">
//     //         <form onSubmit={handleSubmit}>
//     //           <DialogHeader>
//     //             <DialogTitle>{editingModule ? "Edit Module" : "Add New Module"}</DialogTitle>
//     //             <DialogDescription>
//     //               {editingModule ? "Update" : "Create"} a module for academic year {context.year}
//     //             </DialogDescription>
//     //           </DialogHeader>

//     //           <div className="grid gap-4 py-4">
//     //             <div className="space-y-2">
//     //               <Label>Module Name</Label>
//     //               <Input
//     //                 placeholder="e.g., Algebra Fundamentals"
//     //                 value={formData.name}
//     //                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//     //                 required
//     //               />
//     //             </div>

//     //             <div className="space-y-2">
//     //               <Label>Subject</Label>
//     //               <Input
//     //                 placeholder="e.g., Mathematics"
//     //                 value={formData.subject}
//     //                 onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//     //                 required
//     //               />
//     //             </div>

//     //             <div className="space-y-2">
//     //               <Label>Module Order</Label>
//     //               <Input
//     //                 type="number"
//     //                 placeholder="e.g., 1"
//     //                 value={formData.order}
//     //                 onChange={(e) => setFormData({ ...formData, order: e.target.value })}
//     //                 required
//     //               />
//     //             </div>

//     //             <div className="space-y-2">
//     //               <Label>Description</Label>
//     //               <Textarea
//     //                 placeholder="Brief description of the module..."
//     //                 value={formData.description}
//     //                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//     //                 rows={3}
//     //                 required
//     //               />
//     //             </div>
//     //           </div>

//     //           <DialogFooter>
//     //             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//     //               Cancel
//     //             </Button>
//     //             <Button type="submit">{editingModule ? "Update" : "Create"} Module</Button>
//     //           </DialogFooter>
//     //         </form>
//     //       </DialogContent>
//     //     </Dialog>
//     //   </div>

//     //   {/* TABLE */}
//     //   <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
//     //     <Table>
//     //       <TableHeader>
//     //         <TableRow>
//     //           <TableHead className="w-[300px]">Module Name</TableHead>
//     //           <TableHead>Subject</TableHead>
//     //           <TableHead>Topics</TableHead>
//     //           <TableHead>Status</TableHead>
//     //           <TableHead className="text-right">Actions</TableHead>
//     //         </TableRow>
//     //       </TableHeader>

//     //       <TableBody>
//     //         {filteredModules.length === 0 ? (
//     //           <TableRow>
//     //             <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//     //               No modules found. Create your first module.
//     //             </TableCell>
//     //           </TableRow>
//     //         ) : (
//     //           filteredModules.map((module) => (
//     //             <TableRow key={module.id}>
//     //               <TableCell className="font-medium">
//     //                 <div className="flex items-center gap-3">
//     //                   <div className="flex size-9 items-center justify-center rounded bg-secondary text-secondary-foreground">
//     //                     <FolderOpen className="size-4" />
//     //                   </div>
//     //                   <div>
//     //                     <div className="font-semibold">{module.name}</div>
//     //                     <div className="text-xs text-muted-foreground">{module.description}</div>
//     //                   </div>
//     //                 </div>
//     //               </TableCell>

//     //               <TableCell>{module.subject}</TableCell>

//     //               <TableCell>
//     //                 <Badge variant="secondary" className="font-normal">
//     //                   {module.topics || 0} Topics
//     //                 </Badge>
//     //               </TableCell>

//     //               <TableCell>
//     //                 <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
//     //                   Active
//     //                 </Badge>
//     //               </TableCell>

//     //               <TableCell className="text-right">
//     //                 <DropdownMenu>
//     //                   <DropdownMenuTrigger asChild>
//     //                     <Button variant="ghost" size="icon">
//     //                       <MoreHorizontal className="size-4" />
//     //                     </Button>
//     //                   </DropdownMenuTrigger>

//     //                   <DropdownMenuContent align="end">
//     //                     <DropdownMenuItem onClick={() => handleEdit(module)}>
//     //                       <Pencil className="size-4 mr-2" />
//     //                       Edit Module
//     //                     </DropdownMenuItem>

//     //                     <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(module.id)}>
//     //                       Delete
//     //                     </DropdownMenuItem>
//     //                   </DropdownMenuContent>
//     //                 </DropdownMenu>
//     //               </TableCell>
//     //             </TableRow>
//     //           ))
//     //         )}
//     //       </TableBody>
//     //     </Table>
//     //   </div>
//     // </div>

//     <div className="space-y-6">
//   {/* TOP BAR */}
//   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//     {/* Search + Filter */}
//     <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
//       <div className="relative w-full sm:w-[300px] ">
//         <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//         <Input
//           placeholder="Search modules..."
//           className="w-full bg-background pl-9"
//           value={localSearch}
//           onChange={(e) => setLocalSearch(e.target.value)}
//         />
//       </div>
    
//       <DropdownMenu open={showFilter} onOpenChange={setShowFilter}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" size="icon">
//             <Filter className="size-4" />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="start">
//           <DropdownMenuItem onClick={() => setFilterSubject("all")}>All Subjects</DropdownMenuItem>
//           {contextSubjects.map((subject) => (
//             <DropdownMenuItem key={subject.id} onClick={() => setFilterSubject(subject.name)}>
//               {subject.name}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>

//     {/* CREATE MODULE DIALOG */}
//     <Dialog
//       open={isDialogOpen}
//       onOpenChange={(open) => {
//         setIsDialogOpen(open)
//         if (!open) {
//           setEditingModule(null)
//           setFormData({ name: "", subject: "", description: "", order: "" })
//         }
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button className="w-full sm:w-auto flex justify-center sm:justify-start">
//           <Plus className="mr-2 size-4" />
//           New Module
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[500px] w-full">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>{editingModule ? "Edit Module" : "Add New Module"}</DialogTitle>
//             <DialogDescription>
//               {editingModule ? "Update" : "Create"} a module for academic year {context.year}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-4 py-4">
//             <div className="space-y-2">
//               <Label>Module Name</Label>
//               <Input
//                 placeholder="e.g., Algebra Fundamentals"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Subject</Label>
//               <Input
//                 placeholder="e.g., Mathematics"
//                 value={formData.subject}
//                 onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Module Order</Label>
//               <Input
//                 type="number"
//                 placeholder="e.g., 1"
//                 value={formData.order}
//                 onChange={(e) => setFormData({ ...formData, order: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Description</Label>
//               <Textarea
//                 placeholder="Brief description of the module..."
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 rows={3}
//                 required
//               />
//             </div>
//           </div>

//           <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button type="submit">{editingModule ? "Update" : "Create"} Module</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   </div>
// </div>

//   )
// }










import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter, Loader2, BookOpen } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

export default function ModulesPanel({ selectedSubject, subjectName, onModuleSelect, globalSearch }) {
  const { toast } = useToast()
  const { getModules, createModule, updateModule, deleteModule, loading } = useTutorStore()

  const [modules, setModules] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", order: "" })
  const [localSearch, setLocalSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch modules on mount and when subject changes
  useEffect(() => {
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
        // Filter modules by selected subject
        const filteredModules = result.data.filter(
          (m) => m.subjectId === selectedSubject
        )
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
    if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteModule(moduleId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Module deleted successfully",
        })

        // Refresh modules list
        await fetchModules()
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
                <TableRow key={module.id}>
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
                      {module.topics?.length || 0} Topics
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                      Active
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(module)}>
                          <Pencil className="size-4 mr-2" />
                          Edit Module
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => handleDelete(module.id)}
                        >
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
    </div>
  )
}