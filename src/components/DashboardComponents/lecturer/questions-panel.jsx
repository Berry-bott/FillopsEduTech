
// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, Loader2, Eye, MoreHorizontal, AlertTriangle, FileText, X } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"]
// const QUESTION_TYPES = ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]
// const CATEGORIES = ["JAMB", "WAEC", "NECO", "NABTEB"]

// export default function QuestionsPanel({ 
//   selectedTopic, 
//   topicName, 
//   subjectName, 
//   globalSearch,
//   examBody,
//   year,
//   color 
// }) {
//   const { toast } = useToast()
//   const { 
//     createQuestion, 
//     updateQuestion, 
//     deleteQuestion, 
//     getQuestionById,
//     getQuestions,
//     questions: storeQuestions, // ✅ Get questions from Zustand store
//     loading 
//   } = useTutorStore()

//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingQuestion, setEditingQuestion] = useState(null)
//   const [formData, setFormData] = useState({
//     text: "",
//     type: "MULTIPLE_CHOICE",
//     difficulty: "MEDIUM",
//     year: new Date().getFullYear(),
//     category: "JAMB",
//     explanation: "",
//   })
//   const [options, setOptions] = useState(["", "", "", ""])
//   const [correctAnswer, setCorrectAnswer] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [viewingQuestion, setViewingQuestion] = useState(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [loadingDetails, setLoadingDetails] = useState(false)
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
//   const [questionToDelete, setQuestionToDelete] = useState(null)
//   const [isDeleting, setIsDeleting] = useState(false)

//   // ✅ Fetch questions only once - Zustand will cache them
//   useEffect(() => {
//     if (!storeQuestions || storeQuestions.length === 0) {
//       fetchQuestions()
//     }
//   }, []) // eslint-disable-line react-hooks/exhaustive-deps

//   const fetchQuestions = async () => {
//     try {
//       await getQuestions() // ✅ This will update the Zustand store
//     } catch (error) {
//       console.error("Error fetching questions:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load questions",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!selectedTopic) {
//       toast({
//         title: "Error",
//         description: "Please select a topic first",
//         variant: "destructive",
//       })
//       return
//     }

//     // Validation
//     if (formData.type === "MULTIPLE_CHOICE") {
//       const validOptions = options.filter(opt => opt.trim())
//       if (validOptions.length < 2) {
//         toast({
//           title: "Validation Error",
//           description: "Please provide at least 2 options",
//           variant: "destructive",
//         })
//         return
//       }
//       if (!correctAnswer.trim()) {
//         toast({
//           title: "Validation Error",
//           description: "Please select the correct answer",
//           variant: "destructive",
//         })
//         return
//       }
//     }

//     setIsSubmitting(true)

//     try {
//       const questionData = {
//         text: formData.text,
//         type: formData.type,
//         difficulty: formData.difficulty,
//         year: parseInt(formData.year),
//         category: formData.category,
//         explanation: formData.explanation,
//         options: formData.type === "MULTIPLE_CHOICE" ? options.filter(opt => opt.trim()) : [],
//         correctAnswer: formData.type === "MULTIPLE_CHOICE" ? correctAnswer : formData.text,
//       }

//       const result = editingQuestion
//         ? await updateQuestion(editingQuestion.id, questionData)
//         : await createQuestion(selectedTopic, questionData)

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: editingQuestion 
//             ? "Question updated successfully" 
//             : "Question created successfully",
//         })

//         resetForm()
//         setIsDialogOpen(false)
        
//         // ✅ Invalidate cache to force refresh
//         useTutorStore.setState({ questionsLoaded: false })
//         await fetchQuestions()
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to save question",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error saving question:", error)
//       toast({
//         title: "Error",
//         description: "An error occurred while saving the question",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       text: "",
//       type: "MULTIPLE_CHOICE",
//       difficulty: "MEDIUM",
//       year: new Date().getFullYear(),
//       category: "JAMB",
//       explanation: "",
//     })
//     setOptions(["", "", "", ""])
//     setCorrectAnswer("")
//     setEditingQuestion(null)
//   }

//   const handleEdit = (question) => {
//     setEditingQuestion(question)
//     setFormData({
//       text: question.text,
//       type: question.type,
//       difficulty: question.difficulty,
//       year: question.year,
//       category: question.category,
//       explanation: question.explanation || "",
//     })
//     setOptions(question.options || ["", "", "", ""])
//     setCorrectAnswer(question.correctAnswer || "")
//     setIsDialogOpen(true)
//   }

//   const handleDeleteClick = (question) => {
//     setQuestionToDelete(question)
//     setDeleteConfirmOpen(true)
//   }

//   const handleDeleteConfirm = async () => {
//     if (!questionToDelete) return

//     setIsDeleting(true)

//     try {
//       const result = await deleteQuestion(questionToDelete.id)
      
//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "Question deleted successfully",
//         })
        
//         setDeleteConfirmOpen(false)
//         setQuestionToDelete(null)
        
//         // ✅ Invalidate cache to force refresh
//         useTutorStore.setState({ questionsLoaded: false })
//         await fetchQuestions()
//       } else {
//         toast({
//           title: "Deletion Failed",
//           description: result.message || "Failed to delete question",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting question:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred while deleting the question",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const handleViewDetails = async (question) => {
//     setLoadingDetails(true)
//     setDetailsOpen(true)
    
//     try {
//       const result = await getQuestionById(question.id)
      
//       if (result.success) {
//         setViewingQuestion(result.data)
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to load question details",
//           variant: "destructive",
//         })
//         setDetailsOpen(false)
//       }
//     } catch (error) {
//       console.error("Error loading question details:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load question details",
//         variant: "destructive",
//       })
//       setDetailsOpen(false)
//     } finally {
//       setLoadingDetails(false)
//     }
//   }

//   const addOption = () => {
//     setOptions([...options, ""])
//   }

//   const removeOption = (index) => {
//     if (options.length > 2) {
//       const newOptions = options.filter((_, i) => i !== index)
//       setOptions(newOptions)
//       if (correctAnswer === options[index]) {
//         setCorrectAnswer("")
//       }
//     }
//   }

//   const updateOption = (index, value) => {
//     const newOptions = [...options]
//     newOptions[index] = value
//     setOptions(newOptions)
//   }

//   // ✅ Filter questions from Zustand store based on props AND search
//   const filteredQuestions = (storeQuestions || []).filter((q) => {
//     // Topic filter
//     if (selectedTopic && q.topic?.id !== selectedTopic) {
//       return false
//     }
    
//     // Search filter
//     if (globalSearch) {
//       const searchLower = globalSearch.toLowerCase()
//       const matchesSearch = 
//         q.text.toLowerCase().includes(searchLower) ||
//         q.explanation?.toLowerCase().includes(searchLower)
      
//       if (!matchesSearch) return false
//     }
    
//     // Year filter (questions HAVE years)
//     if (year) {
//       const matchesYear = q.year?.toString() === year.toString()
//       if (!matchesYear) return false
//     }
    
//     // Category filter
//     if (examBody && examBody !== "all-catigories") {
//       const matchesCategory = q.category?.toLowerCase() === examBody.toLowerCase()
//       if (!matchesCategory) return false
//     }
    
//     // Color filter (via topic's subject color)
//     if (color && color !== "all") {
//       const matchesColor = q.topic?.subject?.color === color
//       if (!matchesColor) return false
//     }
    
//     return true
//   })

//   if (!selectedTopic) {
//     return (
//       <div className="flex items-center justify-center h-[400px]">
//         <div className="text-center space-y-4">
//           <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground" />
//           <div>
//             <p className="text-lg font-semibold text-muted-foreground">No Topic Selected</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               Please select a topic from the Topics tab to view its questions
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Topic Header */}
//       {topicName && (
//         <div className="flex items-center gap-3 pb-4 border-b">
//           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <FileText className="w-5 h-5 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold">{topicName}</h2>
//             <p className="text-sm text-muted-foreground">
//               {subjectName ? `${subjectName} • Manage questions` : "Manage questions for this topic"}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* TOP BAR - Only add button */}
//       <div className="flex justify-end">
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open)
//             if (!open) {
//               resetForm()
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 size-4" />
//               New Question
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
//               <DialogDescription>
//                 {editingQuestion ? "Update" : "Create"} a question for the selected topic
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               {/* Question Type, Difficulty, Category, Year */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Type</Label>
//                   <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent position="popper" sideOffset={5} className="z-[9999]">
//                       {QUESTION_TYPES.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type.replace("_", " ")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Difficulty</Label>
//                   <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent position="popper" sideOffset={5} className="z-[9999]">
//                       {DIFFICULTY_LEVELS.map((level) => (
//                         <SelectItem key={level} value={level}>
//                           {level}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Category</Label>
//                   <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent position="popper" sideOffset={5} className="z-[9999]">
//                       {CATEGORIES.map((cat) => (
//                         <SelectItem key={cat} value={cat}>
//                           {cat}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Year</Label>
//                   <Input
//                     type="number"
//                     value={formData.year}
//                     onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//                     min="2000"
//                     max="2030"
//                   />
//                 </div>
//               </div>

//               {/* Question Text */}
//               <div className="space-y-2">
//                 <Label>Question Text</Label>
//                 <Textarea
//                   placeholder="Enter your question here..."
//                   value={formData.text}
//                   onChange={(e) => setFormData({ ...formData, text: e.target.value })}
//                   rows={3}
//                   required
//                 />
//               </div>

//               {/* Options (for Multiple Choice) */}
//               {formData.type === "MULTIPLE_CHOICE" && (
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <Label>Options</Label>
//                     <Button type="button" variant="outline" size="sm" onClick={addOption}>
//                       <Plus className="h-3 w-3 mr-1" /> Add Option
//                     </Button>
//                   </div>

//                   {options.map((option, index) => (
//                     <div key={index} className="flex gap-2 items-center">
//                       <Input
//                         placeholder={`Option ${index + 1}`}
//                         value={option}
//                         onChange={(e) => updateOption(index, e.target.value)}
//                         className="flex-1"
//                       />
//                       <Button
//                         type="button"
//                         variant={correctAnswer === option ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => setCorrectAnswer(option)}
//                       >
//                         {correctAnswer === option ? <CheckCircle2 className="h-4 w-4" /> : "Correct"}
//                       </Button>
//                       {options.length > 2 && (
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => removeOption(index)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Explanation */}
//               <div className="space-y-2">
//                 <Label>Explanation</Label>
//                 <Textarea
//                   placeholder="Explain the correct answer..."
//                   value={formData.explanation}
//                   onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
//                   rows={3}
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
//                     {editingQuestion ? "Updating..." : "Creating..."}
//                   </>
//                 ) : (
//                   <>{editingQuestion ? "Update" : "Create"} Question</>
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* QUESTIONS GRID */}
//       <div className="grid gap-4">
//         {loading ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="h-12 w-12 animate-spin text-muted-foreground/50 mb-4" />
//               <p className="text-sm text-muted-foreground">Loading questions...</p>
//             </CardContent>
//           </Card>
//         ) : filteredQuestions.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground text-center">
//                 {globalSearch 
//                   ? "No questions found matching your search" 
//                   : "No questions found. Create your first question."}
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           filteredQuestions.map((question) => (
//             <Card key={question.id} className="group hover:shadow-md transition-shadow">
//               <CardHeader>
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex gap-4 flex-1">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
//                       <HelpCircle className="h-6 w-6 text-primary" />
//                     </div>

//                     <div className="space-y-2 flex-1">
//                       <CardTitle className="text-base">{question.text}</CardTitle>

//                       <div className="flex flex-wrap gap-2">
//                         <Badge variant="outline">{question.type.replace("_", " ")}</Badge>
//                         <Badge variant="secondary">{question.difficulty}</Badge>
//                         <Badge>{question.category}</Badge>
//                         <Badge variant="outline">{question.year}</Badge>
//                       </div>
//                     </div>
//                   </div>

//                   {/* ACTIONS DROPDOWN */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button 
//                         variant="ghost" 
//                         size="icon"
//                         className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreHorizontal className="size-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleViewDetails(question)}>
//                         <Eye className="size-4 mr-2" />
//                         View Details
//                       </DropdownMenuItem>
//                       <Separator className="my-1" />
//                       <DropdownMenuItem onClick={() => handleEdit(question)}>
//                         <Pencil className="size-4 mr-2" />
//                         Edit Question
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="text-destructive focus:text-destructive" 
//                         onClick={() => handleDeleteClick(question)}
//                       >
//                         <Trash2 className="size-4 mr-2" />
//                         Delete Question
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 {question.type === "MULTIPLE_CHOICE" && question.options && (
//                   <div className="space-y-2 mb-3">
//                     {question.options.map((opt, idx) => (
//                       <div
//                         key={idx}
//                         className={`flex items-center gap-2 text-sm p-2 rounded ${
//                           opt === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
//                         }`}
//                       >
//                         {opt === question.correctAnswer ? (
//                           <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
//                         ) : (
//                           <div className="h-4 w-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />
//                         )}
//                         <span className={opt === question.correctAnswer ? "font-medium text-green-900" : ""}>
//                           {opt}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {question.explanation && (
//                   <div className="border-t pt-3">
//                     <p className="text-xs font-medium text-muted-foreground mb-1">Explanation:</p>
//                     <p className="text-sm">{question.explanation}</p>
//                   </div>
//                 )}
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
//               Delete Question
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-3">
//               <p>
//                 Are you sure you want to delete this question?
//               </p>
//               <div className="bg-muted/50 rounded-lg p-3 text-sm">
//                 <p className="font-medium line-clamp-2">{questionToDelete?.text}</p>
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
//               Delete Question
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
//               Question Details
//             </DialogTitle>
//           </DialogHeader>

//           {loadingDetails ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
//               <p className="text-muted-foreground text-center">Loading details...</p>
//             </div>
//           ) : viewingQuestion ? (
//             <div className="space-y-6 py-4">
//               <div className="space-y-2">
//                 <h4 className="font-semibold">Question</h4>
//                 <p className="text-muted-foreground">{viewingQuestion.text}</p>
//               </div>

//               <Separator />

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <p className="text-xs text-muted-foreground">Type</p>
//                   <Badge variant="outline">{viewingQuestion.type.replace("_", " ")}</Badge>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Difficulty</p>
//                   <Badge variant="secondary">{viewingQuestion.difficulty}</Badge>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Category</p>
//                   <Badge>{viewingQuestion.category}</Badge>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Year</p>
//                   <Badge variant="outline">{viewingQuestion.year}</Badge>
//                 </div>
//               </div>

//               {viewingQuestion.options && (
//                 <>
//                   <Separator />
//                   <div className="space-y-2">
//                     <h4 className="font-semibold">Options</h4>
//                     <div className="space-y-2">
//                       {viewingQuestion.options.map((opt, idx) => (
//                         <div
//                           key={idx}
//                           className={`flex items-center gap-2 p-3 rounded ${
//                             opt === viewingQuestion.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
//                           }`}
//                         >
//                           {opt === viewingQuestion.correctAnswer ? (
//                             <CheckCircle2 className="h-5 w-5 text-green-600" />
//                           ) : (
//                             <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
//                           )}
//                           <span className={opt === viewingQuestion.correctAnswer ? "font-medium text-green-900" : ""}>
//                             {opt}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               )}

//               {viewingQuestion.explanation && (
//                 <>
//                   <Separator />
//                   <div className="space-y-2">
//                     <h4 className="font-semibold">Explanation</h4>
//                     <div className="bg-muted/50 rounded-lg p-4">
//                       <p className="text-sm">{viewingQuestion.explanation}</p>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : null}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailsOpen(false)}>
//               Close
//             </Button>
//             {viewingQuestion && (
//               <Button onClick={() => {
//                 setDetailsOpen(false)
//                 handleEdit(viewingQuestion)
//               }}>
//                 <Pencil className="size-4 mr-2" />
//                 Edit Question
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }







// QuestionsPa

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import {TextStyle} from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, Loader2, Eye, MoreHorizontal, AlertTriangle, FileText, X,
  Bold, Italic, UnderlineIcon, Strikethrough, Subscript as SubIcon, Superscript as SupIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, ImageIcon, List, ListOrdered,
  Highlighter, Palette, Undo, Redo, Minus, Code, Link as LinkIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"]
const QUESTION_TYPES = ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]
const CATEGORIES = ["JAMB", "WAEC", "NECO", "NABTEB"]

// ── Rich Text Toolbar ──────────────────────────────────────────────────────────

function ToolbarButton({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-0.5" />
}

function RichTextToolbar({ editor }) {
  const imageInputRef = useRef(null)

  const insertImage = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      editor.chain().focus().setImage({ src: ev.target.result, alt: file.name }).run()
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }, [editor])

  const insertImageFromUrl = useCallback(() => {
    const url = prompt("Enter image URL:")
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30 rounded-t-md">
      {/* Undo / Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <Bold className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <Italic className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <UnderlineIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <Strikethrough className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code">
        <Code className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Sub / Sup */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript (H₂O)">
        <SubIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript (x²)">
        <SupIcon className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Highlight + Color */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
        <Highlighter className="w-3.5 h-3.5" />
      </ToolbarButton>
      <label title="Text Color" className="p-1.5 rounded hover:bg-muted cursor-pointer flex items-center">
        <Palette className="w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="color"
          className="sr-only"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
      </label>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <AlignLeft className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
        <AlignCenter className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <AlignRight className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <AlignJustify className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive("heading", { level })}
          title={`Heading ${level}`}
        >
          <span className="text-xs font-bold">H{level}</span>
        </ToolbarButton>
      ))}

      <ToolbarDivider />

      {/* Horizontal rule */}
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Image upload */}
      <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Upload Image">
        <ImageIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={insertImageFromUrl} title="Insert Image from URL">
        <LinkIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={insertImage} />
    </div>
  )
}

// ── Rich Text Editor ───────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange, placeholder = "Start typing...", minHeight = "120px" }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-3 py-2",
        style: `min-height: ${minHeight}`,
      },
    },
  })

  // Sync external value changes (e.g. when editing an existing question)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

// Helper to strip HTML tags for plain text comparisons / previews
function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "") || ""
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function QuestionsPanel({
  selectedTopic,
  topicName,
  subjectName,
  globalSearch,
  examBody,
  year,
  color,
}) {
  const { toast } = useToast()
  const {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionById,
    getQuestions,
    questions: storeQuestions,
    loading,
  } = useTutorStore()

  const [dialogKey, setDialogKey] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    text: "",           // HTML string from rich editor
    type: "MULTIPLE_CHOICE",
    difficulty: "MEDIUM",
    year: new Date().getFullYear(),
    category: "JAMB",
    explanation: "",    // HTML string from rich editor
  })
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingQuestion, setViewingQuestion] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!storeQuestions || storeQuestions.length === 0) fetchQuestions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchQuestions = async () => {
    try {
      await getQuestions()
    } catch {
      toast({ title: "Error", description: "Failed to load questions", variant: "destructive" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTopic) {
      toast({ title: "Error", description: "Please select a topic first", variant: "destructive" })
      return
    }
    if (formData.type === "MULTIPLE_CHOICE") {
      const validOptions = options.filter((o) => o.trim())
      if (validOptions.length < 2) {
        toast({ title: "Validation Error", description: "Please provide at least 2 options", variant: "destructive" })
        return
      }
      if (!correctAnswer.trim()) {
        toast({ title: "Validation Error", description: "Please select the correct answer", variant: "destructive" })
        return
      }
    }

    setIsSubmitting(true)
    try {
      const questionData = {
        text: formData.text,              // HTML
        type: formData.type,
        difficulty: formData.difficulty,
        year: parseInt(formData.year),
        category: formData.category,
        explanation: formData.explanation, // HTML
        options: formData.type === "MULTIPLE_CHOICE" ? options.filter((o) => o.trim()) : [],
        correctAnswer: formData.type === "MULTIPLE_CHOICE" ? correctAnswer : formData.text,
      }

      const result = editingQuestion
        ? await updateQuestion(editingQuestion.id, questionData)
        : await createQuestion(selectedTopic, questionData)

      if (result.success) {
        toast({ title: "Success", description: editingQuestion ? "Question updated" : "Question created" })
        resetForm()
        setIsDialogOpen(false)
        useTutorStore.setState({ questionsLoaded: false })
        await fetchQuestions()
      } else {
        toast({ title: "Error", description: result.message || "Failed to save question", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "An error occurred", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
  setFormData({ text: "", type: "MULTIPLE_CHOICE", difficulty: "MEDIUM", 
    year: new Date().getFullYear(), category: "JAMB", explanation: "" })
  setOptions(["", "", "", ""])
  setCorrectAnswer("")
  setEditingQuestion(null)
  setDialogKey((k) => k + 1) // 👈 only addition
}
  // const resetForm = () => {
  //   setFormData({ text: "", type: "MULTIPLE_CHOICE", difficulty: "MEDIUM", year: new Date().getFullYear(), category: "JAMB", explanation: "" })
  //   setOptions(["", "", "", ""])
  //   setCorrectAnswer("")
  //   setEditingQuestion(null)
  // }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      text: question.text,
      type: question.type,
      difficulty: question.difficulty,
      year: question.year,
      category: question.category,
      explanation: question.explanation || "",
    })
    setOptions(question.options || ["", "", "", ""])
    setCorrectAnswer(question.correctAnswer || "")
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (question) => { setQuestionToDelete(question); setDeleteConfirmOpen(true) }

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteQuestion(questionToDelete.id)
      if (result.success) {
        toast({ title: "Success", description: "Question deleted successfully" })
        setDeleteConfirmOpen(false)
        setQuestionToDelete(null)
        useTutorStore.setState({ questionsLoaded: false })
        await fetchQuestions()
      } else {
        toast({ title: "Deletion Failed", description: result.message || "Failed to delete", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Unexpected error while deleting", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewDetails = async (question) => {
    setLoadingDetails(true)
    setDetailsOpen(true)
    try {
      const result = await getQuestionById(question.id)
      if (result.success) {
        setViewingQuestion(result.data)
      } else {
        toast({ title: "Error", description: result.message || "Failed to load details", variant: "destructive" })
        setDetailsOpen(false)
      }
    } catch {
      toast({ title: "Error", description: "Failed to load question details", variant: "destructive" })
      setDetailsOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const addOption = () => setOptions([...options, ""])
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOpts = options.filter((_, i) => i !== index)
      setOptions(newOpts)
      if (correctAnswer === options[index]) setCorrectAnswer("")
    }
  }
  const updateOption = (index, value) => {
    const newOpts = [...options]
    newOpts[index] = value
    setOptions(newOpts)
  }

  const filteredQuestions = (storeQuestions || []).filter((q) => {
    if (selectedTopic && q.topic?.id !== selectedTopic) return false
    if (globalSearch) {
      const s = globalSearch.toLowerCase()
      if (!stripHtml(q.text).toLowerCase().includes(s) && !stripHtml(q.explanation).toLowerCase().includes(s)) return false
    }
    if (year && q.year?.toString() !== year.toString()) return false
    if (examBody && examBody !== "all-catigories" && q.category?.toLowerCase() !== examBody.toLowerCase()) return false
    if (color && color !== "all" && q.topic?.subject?.color !== color) return false
    return true
  })

  if (!selectedTopic) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4">
          <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold text-muted-foreground">No Topic Selected</p>
            <p className="text-sm text-muted-foreground mt-2">Please select a topic to view its questions</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Topic Header */}
      {topicName && (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{topicName}</h2>
            <p className="text-sm text-muted-foreground">
              {subjectName ? `${subjectName} • Manage questions` : "Manage questions for this topic"}
            </p>
          </div>
        </div>
      )}

      {/* Add Question Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 size-4" />New Question</Button>
          </DialogTrigger>

          <DialogContent key={dialogKey} className="sm:max-w-[780px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
              <DialogDescription>
                {editingQuestion ? "Update" : "Create"} a question for the selected topic
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4">
              {/* Meta fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                      {QUESTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                      {DIFFICULTY_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} min="2000" max="2030" />
                </div>
              </div>

              {/* ✅ Rich Text — Question */}
              <div className="space-y-2">
                <Label>Question Text</Label>
                <RichTextEditor
                  value={formData.text}
                  onChange={(html) => setFormData({ ...formData, text: html })}
                  placeholder="Enter your question here... Use the toolbar for formatting, subscript (H₂O), superscript (x²), images, etc."
                  minHeight="140px"
                />
              </div>

              {/* Options */}
              {formData.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-3 w-3 mr-1" /> Add Option
                    </Button>
                  </div>
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant={correctAnswer === option && option ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCorrectAnswer(option)}
                      >
                        {correctAnswer === option && option ? <CheckCircle2 className="h-4 w-4" /> : "Correct"}
                      </Button>
                      {options.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ✅ Rich Text — Explanation */}
              <div className="space-y-2">
                <Label>Explanation</Label>
                <RichTextEditor
                  value={formData.explanation}
                  onChange={(html) => setFormData({ ...formData, explanation: html })}
                  placeholder="Explain the correct answer... You can include diagrams, images, or formatted text."
                  minHeight="120px"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editingQuestion ? "Updating..." : "Creating..."}</>
                ) : (
                  <>{editingQuestion ? "Update" : "Create"} Question</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Questions Grid */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">Loading questions...</p>
            </CardContent>
          </Card>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                {globalSearch ? "No questions match your search" : "No questions yet. Create your first question."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Render HTML question text */}
                      <CardTitle
                        className="text-base font-semibold [&_img]:max-w-full [&_img]:rounded [&_img]:my-1 [&_sup]:text-xs [&_sub]:text-xs"
                        dangerouslySetInnerHTML={{ __html: question.text }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{question.type.replace("_", " ")}</Badge>
                        <Badge variant="secondary">{question.difficulty}</Badge>
                        <Badge>{question.category}</Badge>
                        <Badge variant="outline">{question.year}</Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(question)}>
                        <Eye className="size-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem onClick={() => handleEdit(question)}>
                        <Pencil className="size-4 mr-2" /> Edit Question
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteClick(question)}>
                        <Trash2 className="size-4 mr-2" /> Delete Question
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                {question.type === "MULTIPLE_CHOICE" && question.options && (
                  <div className="space-y-2 mb-3">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-sm p-2 rounded ${opt === question.correctAnswer ? "bg-green-50 border border-green-200" : "bg-muted/50"}`}>
                        {opt === question.correctAnswer
                          ? <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                        }
                        <span className={opt === question.correctAnswer ? "font-medium text-green-900" : ""}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.explanation && (
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Explanation:</p>
                    <div
                      className="text-sm [&_img]:max-w-full [&_img]:rounded [&_img]:my-1 [&_sup]:text-xs [&_sub]:text-xs prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: question.explanation }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirm */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" /> Delete Question
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Are you sure you want to delete this question?</p>
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium line-clamp-2">{stripHtml(questionToDelete?.text)}</p>
              </div>
              <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Eye className="size-5" /> Question Details</DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-12 text-muted-foreground/50 mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading details...</p>
            </div>
          ) : viewingQuestion ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Question</h4>
                <div
                  className="text-muted-foreground [&_img]:max-w-full [&_img]:rounded [&_img]:my-2 [&_sup]:text-xs [&_sub]:text-xs prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewingQuestion.text }}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground">Type</p><Badge variant="outline">{viewingQuestion.type.replace("_", " ")}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Difficulty</p><Badge variant="secondary">{viewingQuestion.difficulty}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Category</p><Badge>{viewingQuestion.category}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Year</p><Badge variant="outline">{viewingQuestion.year}</Badge></div>
              </div>

              {viewingQuestion.options && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Options</h4>
                    <div className="space-y-2">
                      {viewingQuestion.options.map((opt, idx) => (
                        <div key={idx} className={`flex items-center gap-2 p-3 rounded ${opt === viewingQuestion.correctAnswer ? "bg-green-50 border border-green-200" : "bg-muted/50"}`}>
                          {opt === viewingQuestion.correctAnswer
                            ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                            : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                          }
                          <span className={opt === viewingQuestion.correctAnswer ? "font-medium text-green-900" : ""}>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {viewingQuestion.explanation && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Explanation</h4>
                    <div
                      className="bg-muted/50 rounded-lg p-4 [&_img]:max-w-full [&_img]:rounded [&_img]:my-2 [&_sup]:text-xs [&_sub]:text-xs prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: viewingQuestion.explanation }}
                    />
                  </div>
                </>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            {viewingQuestion && (
              <Button onClick={() => { setDetailsOpen(false); handleEdit(viewingQuestion) }}>
                <Pencil className="size-4 mr-2" /> Edit Question
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}