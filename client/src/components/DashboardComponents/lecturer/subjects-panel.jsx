import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MoreVertical, FileText, Pencil, BookOpen, Loader2, Trash2, AlertTriangle, Eye, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

const categories = ["WAEC", "NECO", "JAMB", "PUTME"]
const colorOptions = [
  { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
  { value: "bg-emerald-500", label: "Green", color: "bg-emerald-500" },
  { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
  { value: "bg-amber-500", label: "Amber", color: "bg-amber-500" },
  { value: "bg-red-500", label: "Red", color: "bg-red-500" },
  { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
]

export default function SubjectsPanel({ 
  onSubjectSelect, 
  globalSearch,
  examBody,
  year,
  color
}) {
  const { toast } = useToast()
  const { 
    createSubject, 
    getSubjectById,
    updateSubject, 
    deleteSubject,
    getSubjects,
    subjects: storeSubjects,
    loading 
  } = useTutorStore()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({ 
    subjectName: "", 
    subjectCode: "", 
    description: "",
    category: "",
    color: "bg-blue-500" 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState(null)
  const [viewingSubject, setViewingSubject] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    if (!storeSubjects || storeSubjects.length === 0) {
      fetchSubjects()
    }
  }, [storeSubjects])

  const fetchSubjects = async () => {
    try {
      await getSubjects()
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
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
      const apiPayload = {
        subjectName: formData.subjectName.trim(),
        subjectCode: formData.subjectCode.trim().toUpperCase(),
        description: formData.description.trim(),
        category: formData.category,
        color: formData.color,
      }

      let result

      if (editingSubject) {
        const subjectId = editingSubject.subjectId || editingSubject.id
        result = await updateSubject(subjectId, apiPayload)
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Subject updated successfully",
          })
        } else {
          toast({
            title: "Update Failed",
            description: result.message || "Failed to update subject",
            variant: "destructive",
          })
        }
      } else {
        result = await createSubject(apiPayload)
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Subject created successfully",
          })
        } else {
          toast({
            title: "Creation Failed",
            description: result.message || "Failed to create subject",
            variant: "destructive",
          })
        }
      }

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
        
        useTutorStore.setState({ subjectsLoaded: false })
        await fetchSubjects()
      }
    } catch (error) {
      console.error("Error submitting subject:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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

    const cleanDeleteMessage = (message) => {
      return String(message || "")
        .replace(/Use force=true to delete anyway/gi, "")
        .replace(/Cannot delete subject with related data\./gi, "")
        .trim() || "Failed to delete subject"
    }

    setIsDeleting(true)

    try {
      const deletePayload = {
        subjectName: subjectName,
        subjectCode: subjectCode,
        force: true
      }

      const result = await deleteSubject(subjectId, deletePayload)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Subject "${subjectName}" deleted successfully`,
        })
        
        setDeleteConfirmOpen(false)
        setSubjectToDelete(null)
        
        useTutorStore.setState({ subjectsLoaded: false })
        await fetchSubjects()
      } else {
        toast({
          title: "Deletion Failed",
          description: cleanDeleteMessage(result.error || result.message),
          variant: "destructive",
        })
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

  const handleViewTopics = (subject) => {
    let subjectId = subject.subjectId || subject.id
    
    if (typeof subjectId === 'object' && subjectId !== null) {
      subjectId = subjectId.id || subjectId.subjectId
    }
    
    const subjectName = subject.subjectName || subject.name
    
    console.log("🔍 Selecting subject for topics:", { subjectId, subjectName })
    
    if (onSubjectSelect) {
      onSubjectSelect(subjectId, subjectName)
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

  const filteredSubjects = (storeSubjects || []).filter((s) => {
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase()
      const matchesSearch = 
        (s.subjectName || s.name || "").toLowerCase().includes(searchLower) ||
        (s.subjectCode || s.code || "").toLowerCase().includes(searchLower) ||
        (s.description || "").toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }
    
    if (examBody && examBody !== "all-catigories") {
      const matchesCategory = s.category?.toLowerCase() === examBody.toLowerCase()
      if (!matchesCategory) return false
    }
    
    if (color && color !== "all") {
      const matchesColor = s.color === color
      if (!matchesColor) return false
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Subject
            </Button>
          </DialogTrigger>

          <DialogContent 
            className="max-w-2xl md:mt-8 max-h-[85vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the subject"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
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
                  <SelectContent className="z-[9999]">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <DropdownMenuItem onClick={() => handleViewTopics(subject)}>
                        <FileText className="size-4 mr-2" />
                        View Topics
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
                      <FileText className="size-3" /> Topics
                    </span>
                    <span className="font-semibold">
                      {subject._count?.topic || subject.topics || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Hash className="size-3" /> Questions
                    </span>
                    <span className="font-semibold">
                      {subject.questionCount || subject.questions || 0}
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
              <CardFooter className=" text-white py-2 flex justify-between items-center">
                <Button
                  size="sm"
                  variant=""
                  className="h-7 w-64 py-6 text-xs text-white hover:bg-primary-hover hover:text-white"
                  onClick={() => handleViewTopics(subject)}
                >
                  <FileText className="size-3 mr-1" />
                  Create Topics
                </Button>
 
              </CardFooter>
              <div className="text-xs">
                  Created by you
                </div>
            </Card>
          )
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredSubjects.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center max-w-md">
              {globalSearch
                ? "No subjects match your search criteria."
                : "No subjects found for the selected filters."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* LOADING STATE */}
      {loading && (
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
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{subjectToDelete?.subjectName || subjectToDelete?.name}</strong>? 
              This action cannot be undone and will also delete all associated topics and questions.
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SUBJECT DETAILS DIALOG */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent 
          className="max-w-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewingSubject ? (
            <div className="space-y-4">
              <div className={`h-2 w-full rounded-t-lg ${viewingSubject.color || 'bg-blue-500'}`} />
              
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Subject Name</Label>
                  <p className="text-lg font-semibold">{viewingSubject.subjectName || viewingSubject.name}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Subject Code</Label>
                  <Badge variant="secondary" className="font-mono mt-1">
                    {viewingSubject.subjectCode || viewingSubject.code}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1">{viewingSubject.description || "No description provided"}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <Badge variant="outline" className="mt-1">
                    {viewingSubject.category}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Label className="text-muted-foreground">Topics</Label>
                    <p className="text-2xl font-bold mt-1">
                      {viewingSubject._count?.topic || viewingSubject.topics || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Questions</Label>
                    <p className="text-2xl font-bold mt-1">
                      {viewingSubject.questionCount || viewingSubject.questions || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Students</Label>
                    <p className="text-2xl font-bold mt-1">
                      {viewingSubject._count?.userProgress || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}