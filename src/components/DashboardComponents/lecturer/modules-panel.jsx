import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FolderOpen, MoreHorizontal, Pencil, Search, Filter } from "lucide-react"
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

export default function ModulesPanel({ context, modules, setModules, subjects, globalSearch }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [formData, setFormData] = useState({ name: "", subject: "", description: "", order: "" })
  const [localSearch, setLocalSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [showFilter, setShowFilter] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingModule) {
      setModules(
        modules.map((m) =>
          m.id === editingModule.id
            ? {
                ...m,
                ...formData,
                order: parseInt(formData.order),
                examBody: context.examBody,
                year: context.year,
              }
            : m
        )
      )
      setEditingModule(null)
    } else {
      const newModule = {
        id: Date.now().toString(),
        ...formData,
        order: parseInt(formData.order),
        topics: 0,
        examBody: context.examBody,
        year: context.year,
      }

      setModules([...modules, newModule])
    }

    setFormData({ name: "", subject: "", description: "", order: "" })
    setIsDialogOpen(false)
  }

  const handleEdit = (module) => {
    setEditingModule(module)
    setFormData({
      name: module.name,
      subject: module.subject,
      description: module.description,
      order: module.order.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setModules(modules.filter((m) => m.id !== id))
  }

  const searchTerm = globalSearch || localSearch
  const contextSubjects = subjects.filter((s) => s.examBody === context.examBody && s.year === context.year)

  const filteredModules = modules.filter(
    (m) =>
      m.examBody === context.examBody &&
      m.year === context.year &&
      (filterSubject === "all" || m.subject === filterSubject) &&
      (searchTerm === "" || m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    // <div className="space-y-6">
    //   {/* TOP BAR */}
    //   <div className="flex items-center justify-between">
    //     <div className="flex items-center gap-2">
    //       <div className="relative">
    //         <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
    //         <Input
    //           placeholder="Search modules..."
    //           className="w-[300px] bg-background pl-9"
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
    //         <Button>
    //           <Plus className="mr-2 size-4" />
    //           New Module
    //         </Button>
    //       </DialogTrigger>

    //       <DialogContent className="sm:max-w-[500px]">
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

    //           <DialogFooter>
    //             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
    //               Cancel
    //             </Button>
    //             <Button type="submit">{editingModule ? "Update" : "Create"} Module</Button>
    //           </DialogFooter>
    //         </form>
    //       </DialogContent>
    //     </Dialog>
    //   </div>

    //   {/* TABLE */}
    //   <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead className="w-[300px]">Module Name</TableHead>
    //           <TableHead>Subject</TableHead>
    //           <TableHead>Topics</TableHead>
    //           <TableHead>Status</TableHead>
    //           <TableHead className="text-right">Actions</TableHead>
    //         </TableRow>
    //       </TableHeader>

    //       <TableBody>
    //         {filteredModules.length === 0 ? (
    //           <TableRow>
    //             <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
    //               No modules found. Create your first module.
    //             </TableCell>
    //           </TableRow>
    //         ) : (
    //           filteredModules.map((module) => (
    //             <TableRow key={module.id}>
    //               <TableCell className="font-medium">
    //                 <div className="flex items-center gap-3">
    //                   <div className="flex size-9 items-center justify-center rounded bg-secondary text-secondary-foreground">
    //                     <FolderOpen className="size-4" />
    //                   </div>
    //                   <div>
    //                     <div className="font-semibold">{module.name}</div>
    //                     <div className="text-xs text-muted-foreground">{module.description}</div>
    //                   </div>
    //                 </div>
    //               </TableCell>

    //               <TableCell>{module.subject}</TableCell>

    //               <TableCell>
    //                 <Badge variant="secondary" className="font-normal">
    //                   {module.topics || 0} Topics
    //                 </Badge>
    //               </TableCell>

    //               <TableCell>
    //                 <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
    //                   Active
    //                 </Badge>
    //               </TableCell>

    //               <TableCell className="text-right">
    //                 <DropdownMenu>
    //                   <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" size="icon">
    //                       <MoreHorizontal className="size-4" />
    //                     </Button>
    //                   </DropdownMenuTrigger>

    //                   <DropdownMenuContent align="end">
    //                     <DropdownMenuItem onClick={() => handleEdit(module)}>
    //                       <Pencil className="size-4 mr-2" />
    //                       Edit Module
    //                     </DropdownMenuItem>

    //                     <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(module.id)}>
    //                       Delete
    //                     </DropdownMenuItem>
    //                   </DropdownMenuContent>
    //                 </DropdownMenu>
    //               </TableCell>
    //             </TableRow>
    //           ))
    //         )}
    //       </TableBody>
    //     </Table>
    //   </div>
    // </div>

    <div className="space-y-6">
  {/* TOP BAR */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* Search + Filter */}
    <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative w-full sm:w-[300px] ">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search modules..."
          className="w-full bg-background pl-9"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
    
      <DropdownMenu open={showFilter} onOpenChange={setShowFilter}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setFilterSubject("all")}>All Subjects</DropdownMenuItem>
          {contextSubjects.map((subject) => (
            <DropdownMenuItem key={subject.id} onClick={() => setFilterSubject(subject.name)}>
              {subject.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* CREATE MODULE DIALOG */}
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setEditingModule(null)
          setFormData({ name: "", subject: "", description: "", order: "" })
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
              {editingModule ? "Update" : "Create"} a module for academic year {context.year}
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
              <Label>Subject</Label>
              <Input
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingModule ? "Update" : "Create"} Module</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</div>

  )
}
