// // // import React, { useState } from "react"
// // // import { Button } from "@/components/ui/button"
// // // import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// // // import { Input } from "@/components/ui/input"
// // // import { Label } from "@/components/ui/label"
// // // import { Textarea } from "@/components/ui/textarea"
// // // import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search } from "lucide-react"

// // // // SHADCN DIALOG (React version – works fine in Vite/React)
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogFooter,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogTrigger,
// // // } from "@/components/ui/dialog"

// // // // SHADCN SELECT (React version)
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select"

// // // import { Badge } from "@/components/ui/badge"

// // // export default function QuestionsPanel({ context, questions, setQuestions, topics, modules, subjects, globalSearch }) {
// // //   const [isDialogOpen, setIsDialogOpen] = useState(false)
// // //   const [editingQuestion, setEditingQuestion] = useState(null)

// // //   const [formData, setFormData] = useState({
// // //     text: "",
// // //     topic: "",
// // //     module: "",
// // //     subject: "",
// // //     type: "Multiple Choice",
// // //     explanation: "",
// // //   })

// // //   const [answers, setAnswers] = useState([
// // //     { id: "1", text: "", isCorrect: false },
// // //     { id: "2", text: "", isCorrect: false },
// // //   ])

// // //   const [localSearch, setLocalSearch] = useState("")
// // //   const [filterType, setFilterType] = useState("all")

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault()

// // //     if (editingQuestion) {
// // //       setQuestions(
// // //         questions.map((q) =>
// // //           q.id === editingQuestion.id
// // //             ? {
// // //                 ...q,
// // //                 ...formData,
// // //                 answers: answers.filter((a) => a.text.trim() !== ""),
// // //                 examBody: context.examBody,
// // //                 year: context.year,
// // //                 status: "Active",
// // //               }
// // //             : q
// // //         )
// // //       )
// // //       setEditingQuestion(null)
// // //     } else {
// // //       const newQuestion = {
// // //         id: Date.now().toString(),
// // //         ...formData,
// // //         answers: answers.filter((a) => a.text.trim() !== ""),
// // //         examBody: context.examBody,
// // //         year: context.year,
// // //         status: "Active",
// // //       }
// // //       setQuestions([...questions, newQuestion])
// // //     }

// // //     // Reset
// // //     setFormData({
// // //       text: "",
// // //       topic: "",
// // //       module: "",
// // //       subject: "",
// // //       type: "Multiple Choice",
// // //       explanation: "",
// // //     })

// // //     setAnswers([
// // //       { id: "1", text: "", isCorrect: false },
// // //       { id: "2", text: "", isCorrect: false },
// // //     ])

// // //     setIsDialogOpen(false)
// // //   }

// // //   const handleEdit = (question) => {
// // //     setEditingQuestion(question)
// // //     setFormData({
// // //       text: question.text,
// // //       topic: question.topic,
// // //       module: question.module,
// // //       subject: question.subject,
// // //       type: question.type,
// // //       explanation: question.explanation,
// // //     })
// // //     setAnswers(question.answers || [])
// // //     setIsDialogOpen(true)
// // //   }

// // //   const handleDelete = (id) => {
// // //     setQuestions(questions.filter((q) => q.id !== id))
// // //   }

// // //   const addAnswer = () => {
// // //     setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
// // //   }

// // //   const removeAnswer = (id) => {
// // //     setAnswers(answers.filter((a) => a.id !== id))
// // //   }

// // //   const updateAnswer = (id, field, value) => {
// // //     setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
// // //   }

// // //   const searchTerm = globalSearch || localSearch

// // //   const filteredQuestions = questions.filter(
// // //     (q) =>
// // //       q.examBody === context.examBody &&
// // //       q.year === context.year &&
// // //       (filterType === "all" || q.type === filterType) &&
// // //       (searchTerm === "" || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
// // //   )

// // //   return (
// // //     <div className="space-y-6">
// // //   {/* SEARCH + FILTER */}
// // //   <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// // //     <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
// // //       <div className="relative w-full md:w-[300px]">
// // //         <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
// // //         <Input
// // //           placeholder="Search questions..."
// // //           className="w-full pl-9 bg-background"
// // //           value={localSearch}
// // //           onChange={(e) => setLocalSearch(e.target.value)}
// // //         />
// // //       </div>

// // //       <Select value={filterType} onValueChange={setFilterType} className="w-full md:w-[160px]">
// // //         <SelectTrigger>
// // //           <SelectValue placeholder="Filter" />
// // //         </SelectTrigger>
// // //         <SelectContent>
// // //           <SelectItem value="all">All Types</SelectItem>
// // //           <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// // //           <SelectItem value="True/False">True/False</SelectItem>
// // //           <SelectItem value="Short Answer">Short Answer</SelectItem>
// // //         </SelectContent>
// // //       </Select>
// // //     </div>

// // //     {/* ADD QUESTION BUTTON */}
// // //     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// // //       <DialogTrigger asChild>
// // //         <Button className="w-full md:w-auto flex justify-center md:justify-start">
// // //           <Plus className="mr-2 size-4" />
// // //           Add Question
// // //         </Button>
// // //       </DialogTrigger>

// // //       {/* DIALOG BODY */}
// // //       <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
// // //         <form onSubmit={handleSubmit}>
// // //           <DialogHeader>
// // //             <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
// // //             <DialogDescription>
// // //               {editingQuestion ? "Update" : "Create"} a question with answers
// // //             </DialogDescription>
// // //           </DialogHeader>

// // //           {/* FORM */}
// // //           <div className="grid gap-4 py-4">
// // //             {/* Subject / Module / Topic */}
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //               <div className="space-y-2">
// // //                 <Label>Subject</Label>
// // //                 <Input
// // //                   value={formData.subject}
// // //                   onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
// // //                   required
// // //                 />
// // //               </div>

// // //               <div className="space-y-2">
// // //                 <Label>Module</Label>
// // //                 <Input
// // //                   value={formData.module}
// // //                   onChange={(e) => setFormData({ ...formData, module: e.target.value })}
// // //                   required
// // //                 />
// // //               </div>

// // //               <div className="space-y-2">
// // //                 <Label>Topic</Label>
// // //                 <Input
// // //                   value={formData.topic}
// // //                   onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
// // //                   required
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* TYPE SELECT */}
// // //             <div className="space-y-2 w-full sm:w-[300px]">
// // //               <Label>Question Type</Label>
// // //               <Select
// // //                 value={formData.type}
// // //                 onValueChange={(value) => setFormData({ ...formData, type: value })}
// // //               >
// // //                 <SelectTrigger>
// // //                   <SelectValue />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// // //                   <SelectItem value="True/False">True/False</SelectItem>
// // //                   <SelectItem value="Short Answer">Short Answer</SelectItem>
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>

// // //             {/* QUESTION */}
// // //             <div className="space-y-2">
// // //               <Label>Question</Label>
// // //               <Textarea
// // //                 value={formData.text}
// // //                 onChange={(e) => setFormData({ ...formData, text: e.target.value })}
// // //                 rows={3}
// // //                 required
// // //               />
// // //             </div>

// // //             {/* ANSWERS */}
// // //             <div className="space-y-3">
// // //               <div className="flex items-center justify-between">
// // //                 <Label>Answers</Label>
// // //                 <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
// // //                   <Plus className="h-3 w-3 mr-1" />
// // //                   Add Answer
// // //                 </Button>
// // //               </div>

// // //               {answers.map((answer, index) => (
// // //                 <div key={answer.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// // //                   <Input
// // //                     placeholder={`Answer ${index + 1}`}
// // //                     value={answer.text}
// // //                     onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
// // //                     required
// // //                     className="flex-1"
// // //                   />

// // //                   <input
// // //                     type="checkbox"
// // //                     checked={answer.isCorrect}
// // //                     onChange={(e) => updateAnswer(answer.id, "isCorrect", e.target.checked)}
// // //                     className="h-4 w-4 mt-2 sm:mt-0"
// // //                   />

// // //                   {answers.length > 2 && (
// // //                     <Button
// // //                       type="button"
// // //                       variant="ghost"
// // //                       size="icon"
// // //                       className="h-9 w-9"
// // //                       onClick={() => removeAnswer(answer.id)}
// // //                     >
// // //                       <X className="h-4 w-4" />
// // //                     </Button>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* EXPLANATION */}
// // //             <div className="space-y-2">
// // //               <Label>Explanation</Label>
// // //               <Textarea
// // //                 value={formData.explanation}
// // //                 onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
// // //                 rows={3}
// // //                 required
// // //               />
// // //             </div>
// // //           </div>

// // //           <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
// // //             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
// // //               Cancel
// // //             </Button>
// // //             <Button type="submit">{editingQuestion ? "Update" : "Create"} Question</Button>
// // //           </DialogFooter>
// // //         </form>
// // //       </DialogContent>
// // //     </Dialog>
// // //   </div>

// // //   {/* LIST OF QUESTIONS */}
// // //   <div className="grid gap-4">
// // //     {filteredQuestions.length === 0 ? (
// // //       <Card>
// // //         <CardContent className="flex flex-col items-center justify-center py-12">
// // //           <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
// // //           <p className="text-muted-foreground text-center">No questions found.</p>
// // //         </CardContent>
// // //       </Card>
// // //     ) : (
// // //       filteredQuestions.map((question) => (
// // //         <Card key={question.id} className="group hover:shadow-md transition-shadow">
// // //           <CardHeader>
// // //             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// // //               <div className="flex gap-4 flex-1">
// // //                 <div className="h-12 w-12 bg-accent/50 rounded-lg flex items-center justify-center">
// // //                   <HelpCircle className="h-6 w-6 text-accent-foreground" />
// // //                 </div>

// // //                 <div className="space-y-2 flex-1">
// // //                   <CardTitle className="text-base">{question.text}</CardTitle>

// // //                   <div className="flex flex-wrap gap-2">
// // //                     <Badge variant="secondary">{question.subject}</Badge>
// // //                     <Badge variant="outline">{question.module}</Badge>
// // //                     <Badge variant="outline">{question.topic}</Badge>
// // //                     <Badge>{question.type}</Badge>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
// // //                 <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
// // //                   <Pencil className="h-4 w-4" />
// // //                 </Button>

// // //                 <Button
// // //                   size="icon"
// // //                   variant="ghost"
// // //                   className="text-destructive"
// // //                   onClick={() => handleDelete(question.id)}
// // //                 >
// // //                   <Trash2 className="h-4 w-4" />
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           </CardHeader>

// // //           <CardContent className="space-y-3">
// // //             {/* ANSWERS LIST */}
// // //             <div>
// // //               <p className="text-sm font-medium">Answers:</p>
// // //               {question.answers?.map((a) => (
// // //                 <div
// // //                   key={a.id}
// // //                   className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
// // //                 >
// // //                   {a.isCorrect ? (
// // //                     <CheckCircle2 className="h-4 w-4 text-green-600" />
// // //                   ) : (
// // //                     <div className="h-4 w-4 rounded-full border-2 border-border" />
// // //                   )}
// // //                   <span className={a.isCorrect ? "font-medium" : "text-muted-foreground"}>{a.text}</span>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* EXPLANATION */}
// // //             {question.explanation && (
// // //               <div className="pt-2 border-t">
// // //                 <p className="text-xs font-medium text-muted-foreground">Explanation:</p>
// // //                 <p className="text-sm">{question.explanation}</p>
// // //               </div>
// // //             )}
// // //           </CardContent>

// // //           <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t bg-muted/20 gap-2 sm:gap-0">
// // //             <Badge variant="secondary">{question.status}</Badge>
// // //             <span className="text-xs text-muted-foreground">
// // //               Added to {context.examBody.toUpperCase()} {context.year}
// // //             </span>
// // //           </CardFooter>
// // //         </Card>
// // //       ))
// // //     )}
// // //   </div>
// // // </div>

// // //   )
// // // }




// // import React, { useState } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search } from "lucide-react"

// // // SHADCN DIALOG
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog"

// // // SHADCN SELECT
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"

// // import { Badge } from "@/components/ui/badge"

// // export default function QuestionsPanel({ context, questions, setQuestions, topics, modules, subjects, globalSearch }) {
// //   const [isDialogOpen, setIsDialogOpen] = useState(false)
// //   const [editingQuestion, setEditingQuestion] = useState(null)

// //   const [formData, setFormData] = useState({
// //     text: "",
// //     topic: "",
// //     year: new Date().getFullYear().toString(), // Default to current year
// //     subject: "",
// //     type: "Multiple Choice",
// //     explanation: "",
// //   })

// //   const [answers, setAnswers] = useState([
// //     { id: "1", text: "", isCorrect: false },
// //     { id: "2", text: "", isCorrect: false },
// //   ])

// //   const [localSearch, setLocalSearch] = useState("")
// //   const [filterType, setFilterType] = useState("all")

// //   const handleSubmit = (e) => {
// //     e.preventDefault()

// //     if (editingQuestion) {
// //       setQuestions(
// //         questions.map((q) =>
// //           q.id === editingQuestion.id
// //             ? {
// //                 ...q,
// //                 ...formData,
// //                 answers: answers.filter((a) => a.text.trim() !== ""),
// //                 examBody: context.examBody,
// //                 status: "Active",
// //               }
// //             : q
// //         )
// //       )
// //       setEditingQuestion(null)
// //     } else {
// //       const newQuestion = {
// //         id: Date.now().toString(),
// //         ...formData,
// //         answers: answers.filter((a) => a.text.trim() !== ""),
// //         examBody: context.examBody,
// //         status: "Active",
// //       }
// //       setQuestions([...questions, newQuestion])
// //     }

// //     // Reset
// //     setFormData({
// //       text: "",
// //       topic: "",
// //       year: new Date().getFullYear().toString(),
// //       subject: "",
// //       type: "Multiple Choice",
// //       explanation: "",
// //     })

// //     setAnswers([
// //       { id: "1", text: "", isCorrect: false },
// //       { id: "2", text: "", isCorrect: false },
// //     ])

// //     setIsDialogOpen(false)
// //   }

// //   const handleEdit = (question) => {
// //     setEditingQuestion(question)
// //     setFormData({
// //       text: question.text,
// //       topic: question.topic,
// //       year: question.year,
// //       subject: question.subject,
// //       type: question.type,
// //       explanation: question.explanation,
// //     })
// //     setAnswers(question.answers || [])
// //     setIsDialogOpen(true)
// //   }

// //   const handleDelete = (id) => {
// //     setQuestions(questions.filter((q) => q.id !== id))
// //   }

// //   const addAnswer = () => {
// //     setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
// //   }

// //   const removeAnswer = (id) => {
// //     setAnswers(answers.filter((a) => a.id !== id))
// //   }

// //   const updateAnswer = (id, field, value) => {
// //     setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
// //   }

// //   const searchTerm = globalSearch || localSearch

// //   const filteredQuestions = questions.filter(
// //     (q) =>
// //       q.examBody === context.examBody &&
// //       (filterType === "all" || q.type === filterType) &&
// //       (searchTerm === "" || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
// //   )

// //   return (
// //     <div className="space-y-6">
// //       {/* SEARCH + FILTER */}
// //       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //         <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
// //           <div className="relative w-full md:w-[300px]">
// //             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search questions..."
// //               className="w-full pl-9 bg-background"
// //               value={localSearch}
// //               onChange={(e) => setLocalSearch(e.target.value)}
// //             />
// //           </div>

// //           <Select value={filterType} onValueChange={setFilterType} className="w-full md:w-[160px]">
// //             <SelectTrigger>
// //               <SelectValue placeholder="Filter" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="all">All Types</SelectItem>
// //               <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// //               <SelectItem value="True/False">True/False</SelectItem>
// //               <SelectItem value="Short Answer">Short Answer</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>

// //         {/* ADD QUESTION BUTTON */}
// //         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Button className="w-full md:w-auto flex justify-center md:justify-start">
// //               <Plus className="mr-2 size-4" />
// //               Add Question
// //             </Button>
// //           </DialogTrigger>

// //           {/* DIALOG BODY */}
// //           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
// //             <form onSubmit={handleSubmit}>
// //               <DialogHeader>
// //                 <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
// //                 <DialogDescription>
// //                   {editingQuestion ? "Update" : "Create"} a question with answers
// //                 </DialogDescription>
// //               </DialogHeader>

// //               {/* FORM */}
// //               <div className="grid gap-4 py-4">
// //                 {/* Subject / Year / Topic */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //                   <div className="space-y-2">
// //                     <Label>Subject</Label>
// //                     <Input
// //                       value={formData.subject}
// //                       onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
// //                       placeholder="e.g., Mathematics"
// //                       required
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label>Year</Label>
// //                     <Input
// //                       type="number"
// //                       min="1990"
// //                       max="2100"
// //                       value={formData.year}
// //                       onChange={(e) => setFormData({ ...formData, year: e.target.value })}
// //                       placeholder="e.g., 2025"
// //                       required
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label>Topic</Label>
// //                     <Input
// //                       value={formData.topic}
// //                       onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
// //                       placeholder="e.g., Algebra"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* TYPE SELECT */}
// //                 <div className="space-y-2 w-full sm:w-[300px]">
// //                   <Label>Question Type</Label>
// //                   <Select
// //                     value={formData.type}
// //                     onValueChange={(value) => setFormData({ ...formData, type: value })}
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// //                       <SelectItem value="True/False">True/False</SelectItem>
// //                       <SelectItem value="Short Answer">Short Answer</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {/* QUESTION */}
// //                 <div className="space-y-2">
// //                   <Label>Question</Label>
// //                   <Textarea
// //                     value={formData.text}
// //                     onChange={(e) => setFormData({ ...formData, text: e.target.value })}
// //                     placeholder="Enter your question here..."
// //                     rows={3}
// //                     required
// //                   />
// //                 </div>

// //                 {/* ANSWERS */}
// //                 <div className="space-y-3">
// //                   <div className="flex items-center justify-between">
// //                     <Label>Answers</Label>
// //                     <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
// //                       <Plus className="h-3 w-3 mr-1" />
// //                       Add Answer
// //                     </Button>
// //                   </div>

// //                   {answers.map((answer, index) => (
// //                     <div key={answer.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// //                       <Input
// //                         placeholder={`Answer ${index + 1}`}
// //                         value={answer.text}
// //                         onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
// //                         required
// //                         className="flex-1"
// //                       />

// //                       <div className="flex items-center gap-2">
// //                         <label className="flex items-center gap-2 cursor-pointer">
// //                           <input
// //                             type="checkbox"
// //                             checked={answer.isCorrect}
// //                             onChange={(e) => updateAnswer(answer.id, "isCorrect", e.target.checked)}
// //                             className="h-4 w-4 cursor-pointer"
// //                           />
// //                           <span className="text-xs text-muted-foreground">Correct</span>
// //                         </label>

// //                         {answers.length > 2 && (
// //                           <Button
// //                             type="button"
// //                             variant="ghost"
// //                             size="icon"
// //                             className="h-9 w-9"
// //                             onClick={() => removeAnswer(answer.id)}
// //                           >
// //                             <X className="h-4 w-4" />
// //                           </Button>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* EXPLANATION */}
// //                 <div className="space-y-2">
// //                   <Label>Explanation</Label>
// //                   <Textarea
// //                     value={formData.explanation}
// //                     onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
// //                     placeholder="Explain why the correct answer is correct..."
// //                     rows={3}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
// //                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
// //                   Cancel
// //                 </Button>
// //                 <Button type="submit">{editingQuestion ? "Update" : "Create"} Question</Button>
// //               </DialogFooter>
// //             </form>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* LIST OF QUESTIONS */}
// //       <div className="grid gap-4">
// //         {filteredQuestions.length === 0 ? (
// //           <Card>
// //             <CardContent className="flex flex-col items-center justify-center py-12">
// //               <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
// //               <p className="text-muted-foreground text-center">No questions found.</p>
// //             </CardContent>
// //           </Card>
// //         ) : (
// //           filteredQuestions.map((question) => (
// //             <Card key={question.id} className="group hover:shadow-md transition-shadow">
// //               <CardHeader>
// //                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// //                   <div className="flex gap-4 flex-1">
// //                     <div className="h-12 w-12 bg-accent/50 rounded-lg flex items-center justify-center flex-shrink-0">
// //                       <HelpCircle className="h-6 w-6 text-accent-foreground" />
// //                     </div>

// //                     <div className="space-y-2 flex-1">
// //                       <CardTitle className="text-base">{question.text}</CardTitle>

// //                       <div className="flex flex-wrap gap-2">
// //                         <Badge variant="secondary">{question.subject}</Badge>
// //                         <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
// //                           {question.year}
// //                         </Badge>
// //                         <Badge variant="outline">{question.topic}</Badge>
// //                         <Badge>{question.type}</Badge>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
// //                     <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
// //                       <Pencil className="h-4 w-4" />
// //                     </Button>

// //                     <Button
// //                       size="icon"
// //                       variant="ghost"
// //                       className="text-destructive"
// //                       onClick={() => handleDelete(question.id)}
// //                     >
// //                       <Trash2 className="h-4 w-4" />
// //                     </Button>
// //                   </div>
// //                 </div>
// //               </CardHeader>

// //               <CardContent className="space-y-3">
// //                 {/* ANSWERS LIST */}
// //                 <div>
// //                   <p className="text-sm font-medium mb-2">Answers:</p>
// //                   <div className="space-y-2">
// //                     {question.answers?.map((a) => (
// //                       <div
// //                         key={a.id}
// //                         className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
// //                       >
// //                         {a.isCorrect ? (
// //                           <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
// //                         ) : (
// //                           <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0" />
// //                         )}
// //                         <span className={a.isCorrect ? "font-medium" : "text-muted-foreground"}>{a.text}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* EXPLANATION */}
// //                 {question.explanation && (
// //                   <div className="pt-2 border-t">
// //                     <p className="text-xs font-medium text-muted-foreground mb-1">Explanation:</p>
// //                     <p className="text-sm">{question.explanation}</p>
// //                   </div>
// //                 )}
// //               </CardContent>

// //               <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t bg-muted/20 gap-2 sm:gap-0">
// //                 <Badge variant="secondary">{question.status}</Badge>
// //                 <span className="text-xs text-muted-foreground">
// //                   {context.examBody.toUpperCase()} • {question.year}
// //                 </span>
// //               </CardFooter>
// //             </Card>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   )
// // }







// // import React, { useState, useMemo } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search } from "lucide-react"
// // import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// // // SHADCN DIALOG
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog"

// // // SHADCN SELECT
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"

// // import { Badge } from "@/components/ui/badge"

// // export default function QuestionsPanel({ context, questions, setQuestions, topics, modules, subjects, globalSearch }) {
// //   const [isDialogOpen, setIsDialogOpen] = useState(false)
// //   const [editingQuestion, setEditingQuestion] = useState(null)

// //   const [formData, setFormData] = useState({
// //     text: "",
// //     topic: "",
// //     year: new Date().getFullYear().toString(),
// //     subject: "",
// //     type: "Multiple Choice",
// //     explanation: "",
// //   })

// //   const [answers, setAnswers] = useState([
// //     { id: "1", text: "", isCorrect: false },
// //     { id: "2", text: "", isCorrect: false },
// //   ])

// //   // Combobox states
// //   const [subjectOpen, setSubjectOpen] = useState(false)
// //   const [topicOpen, setTopicOpen] = useState(false)

// //   const [localSearch, setLocalSearch] = useState("")
// //   const [filterType, setFilterType] = useState("all")

// //   // Get unique subjects and topics from context
// //   const contextSubjects = useMemo(() => {
// //     const filtered = subjects.filter(
// //       (s) => s.examBody === context.examBody
// //     )
// //     return [...new Set(filtered.map(s => s.name))].sort()
// //   }, [subjects, context.examBody])

// //   const contextTopics = useMemo(() => {
// //     const filtered = topics.filter(
// //       (t) => t.examBody === context.examBody && 
// //             (!formData.subject || t.subject === formData.subject)
// //     )
// //     return [...new Set(filtered.map(t => t.name))].sort()
// //   }, [topics, context.examBody, formData.subject])

// //   const handleSubmit = (e) => {
// //     e.preventDefault()

// //     if (editingQuestion) {
// //       setQuestions(
// //         questions.map((q) =>
// //           q.id === editingQuestion.id
// //             ? {
// //                 ...q,
// //                 ...formData,
// //                 answers: answers.filter((a) => a.text.trim() !== ""),
// //                 examBody: context.examBody,
// //                 status: "Active",
// //               }
// //             : q
// //         )
// //       )
// //       setEditingQuestion(null)
// //     } else {
// //       const newQuestion = {
// //         id: Date.now().toString(),
// //         ...formData,
// //         answers: answers.filter((a) => a.text.trim() !== ""),
// //         examBody: context.examBody,
// //         status: "Active",
// //       }
// //       setQuestions([...questions, newQuestion])
// //     }

// //     // Reset
// //     setFormData({
// //       text: "",
// //       topic: "",
// //       year: new Date().getFullYear().toString(),
// //       subject: "",
// //       type: "Multiple Choice",
// //       explanation: "",
// //     })

// //     setAnswers([
// //       { id: "1", text: "", isCorrect: false },
// //       { id: "2", text: "", isCorrect: false },
// //     ])

// //     setIsDialogOpen(false)
// //   }

// //   const handleEdit = (question) => {
// //     setEditingQuestion(question)
// //     setFormData({
// //       text: question.text,
// //       topic: question.topic,
// //       year: question.year,
// //       subject: question.subject,
// //       type: question.type,
// //       explanation: question.explanation,
// //     })
// //     setAnswers(question.answers || [])
// //     setIsDialogOpen(true)
// //   }

// //   const handleDelete = (id) => {
// //     setQuestions(questions.filter((q) => q.id !== id))
// //   }

// //   const addAnswer = () => {
// //     setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
// //   }

// //   const removeAnswer = (id) => {
// //     setAnswers(answers.filter((a) => a.id !== id))
// //   }

// //   const updateAnswer = (id, field, value) => {
// //     setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
// //   }

// //   const searchTerm = globalSearch || localSearch

// //   const filteredQuestions = questions.filter(
// //     (q) =>
// //       q.examBody === context.examBody &&
// //       (filterType === "all" || q.type === filterType) &&
// //       (searchTerm === "" || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
// //   )

// //   return (
// //     <div className="space-y-6">
// //       {/* SEARCH + FILTER */}
// //       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //         <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
// //           <div className="relative w-full md:w-[300px]">
// //             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search questions..."
// //               className="w-full pl-9 bg-background"
// //               value={localSearch}
// //               onChange={(e) => setLocalSearch(e.target.value)}
// //             />
// //           </div>

// //           <Select value={filterType} onValueChange={setFilterType} className="w-full md:w-[160px]">
// //             <SelectTrigger>
// //               <SelectValue placeholder="Filter" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="all">All Types</SelectItem>
// //               <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// //               <SelectItem value="True/False">True/False</SelectItem>
// //               <SelectItem value="Short Answer">Short Answer</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>

// //         {/* ADD QUESTION BUTTON */}
// //         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Button className="w-full md:w-auto flex justify-center md:justify-start">
// //               <Plus className="mr-2 size-4" />
// //               Add Question
// //             </Button>
// //           </DialogTrigger>

// //           {/* DIALOG BODY */}
// //           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
// //             <form onSubmit={handleSubmit}>
// //               <DialogHeader>
// //                 <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
// //                 <DialogDescription>
// //                   {editingQuestion ? "Update" : "Create"} a question with answers
// //                 </DialogDescription>
// //               </DialogHeader>

// //               {/* FORM */}
// //               <div className="grid gap-4 py-4">
// //                 {/* Subject / Year / Topic */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //                   {/* SUBJECT COMBOBOX WITH SEARCH */}
// //                   <div className="space-y-2">
// //                     <Label>Subject</Label>
// //                     <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
// //                       <PopoverTrigger asChild>
// //                         <Button
// //                           variant="outline"
// //                           role="combobox"
// //                           aria-expanded={subjectOpen}
// //                           className="w-full justify-between"
// //                         >
// //                           {formData.subject || "Select subject..."}
// //                           <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// //                         </Button>
// //                       </PopoverTrigger>
// //                       <PopoverContent className="w-[300px] p-0">
// //                         <Command>
// //                           <CommandInput placeholder="Search subject..." />
// //                           <CommandEmpty>No subject found.</CommandEmpty>
// //                           <CommandGroup className="max-h-[200px] overflow-auto">
// //                             {contextSubjects.map((subject) => (
// //                               <CommandItem
// //                                 key={subject}
// //                                 value={subject}
// //                                 onSelect={(currentValue) => {
// //                                   setFormData({ ...formData, subject: currentValue, topic: "" })
// //                                   setSubjectOpen(false)
// //                                 }}
// //                               >
// //                                 {subject}
// //                               </CommandItem>
// //                             ))}
// //                           </CommandGroup>
// //                         </Command>
// //                       </PopoverContent>
// //                     </Popover>
// //                   </div>

// //                   {/* YEAR INPUT */}
// //                   <div className="space-y-2">
// //                     <Label>Year</Label>
// //                     <Input
// //                       type="number"
// //                       min="1990"
// //                       max="2100"
// //                       value={formData.year}
// //                       onChange={(e) => setFormData({ ...formData, year: e.target.value })}
// //                       placeholder="e.g., 2025"
// //                       required
// //                     />
// //                   </div>

// //                   {/* TOPIC COMBOBOX WITH SEARCH */}
// //                   <div className="space-y-2">
// //                     <Label>Topic</Label>
// //                     <Popover open={topicOpen} onOpenChange={setTopicOpen}>
// //                       <PopoverTrigger asChild>
// //                         <Button
// //                           variant="outline"
// //                           role="combobox"
// //                           aria-expanded={topicOpen}
// //                           className="w-full justify-between"
// //                           disabled={!formData.subject}
// //                         >
// //                           {formData.topic || "Select topic..."}
// //                           <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// //                         </Button>
// //                       </PopoverTrigger>
// //                       <PopoverContent className="w-[300px] p-0">
// //                         <Command>
// //                           <CommandInput placeholder="Search topic..." />
// //                           <CommandEmpty>No topic found.</CommandEmpty>
// //                           <CommandGroup className="max-h-[200px] overflow-auto">
// //                             {contextTopics.map((topic) => (
// //                               <CommandItem
// //                                 key={topic}
// //                                 value={topic}
// //                                 onSelect={(currentValue) => {
// //                                   setFormData({ ...formData, topic: currentValue })
// //                                   setTopicOpen(false)
// //                                 }}
// //                               >
// //                                 {topic}
// //                               </CommandItem>
// //                             ))}
// //                           </CommandGroup>
// //                         </Command>
// //                       </PopoverContent>
// //                     </Popover>
// //                   </div>
// //                 </div>

// //                 {/* TYPE SELECT */}
// //                 <div className="space-y-2 w-full sm:w-[300px]">
// //                   <Label>Question Type</Label>
// //                   <Select
// //                     value={formData.type}
// //                     onValueChange={(value) => setFormData({ ...formData, type: value })}
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// //                       <SelectItem value="True/False">True/False</SelectItem>
// //                       <SelectItem value="Short Answer">Short Answer</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {/* QUESTION */}
// //                 <div className="space-y-2">
// //                   <Label>Question</Label>
// //                   <Textarea
// //                     value={formData.text}
// //                     onChange={(e) => setFormData({ ...formData, text: e.target.value })}
// //                     placeholder="Enter your question here..."
// //                     rows={3}
// //                     required
// //                   />
// //                 </div>

// //                 {/* ANSWERS */}
// //                 <div className="space-y-3">
// //                   <div className="flex items-center justify-between">
// //                     <Label>Answers</Label>
// //                     <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
// //                       <Plus className="h-3 w-3 mr-1" />
// //                       Add Answer
// //                     </Button>
// //                   </div>

// //                   {answers.map((answer, index) => (
// //                     <div key={answer.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// //                       <Input
// //                         placeholder={`Answer ${index + 1}`}
// //                         value={answer.text}
// //                         onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
// //                         required
// //                         className="flex-1"
// //                       />

// //                       <div className="flex items-center gap-2">
// //                         <label className="flex items-center gap-2 cursor-pointer">
// //                           <input
// //                             type="checkbox"
// //                             checked={answer.isCorrect}
// //                             onChange={(e) => updateAnswer(answer.id, "isCorrect", e.target.checked)}
// //                             className="h-4 w-4 cursor-pointer"
// //                           />
// //                           <span className="text-xs text-muted-foreground">Correct</span>
// //                         </label>

// //                         {answers.length > 2 && (
// //                           <Button
// //                             type="button"
// //                             variant="ghost"
// //                             size="icon"
// //                             className="h-9 w-9"
// //                             onClick={() => removeAnswer(answer.id)}
// //                           >
// //                             <X className="h-4 w-4" />
// //                           </Button>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* EXPLANATION */}
// //                 <div className="space-y-2">
// //                   <Label>Explanation</Label>
// //                   <Textarea
// //                     value={formData.explanation}
// //                     onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
// //                     placeholder="Explain why the correct answer is correct..."
// //                     rows={3}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
// //                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
// //                   Cancel
// //                 </Button>
// //                 <Button type="submit">{editingQuestion ? "Update" : "Create"} Question</Button>
// //               </DialogFooter>
// //             </form>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* LIST OF QUESTIONS */}
// //       <div className="grid gap-4">
// //         {filteredQuestions.length === 0 ? (
// //           <Card>
// //             <CardContent className="flex flex-col items-center justify-center py-12">
// //               <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
// //               <p className="text-muted-foreground text-center">No questions found.</p>
// //             </CardContent>
// //           </Card>
// //         ) : (
// //           filteredQuestions.map((question) => (
// //             <Card key={question.id} className="group hover:shadow-md transition-shadow">
// //               <CardHeader>
// //                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// //                   <div className="flex gap-4 flex-1">
// //                     <div className="h-12 w-12 bg-accent/50 rounded-lg flex items-center justify-center flex-shrink-0">
// //                       <HelpCircle className="h-6 w-6 text-accent-foreground" />
// //                     </div>

// //                     <div className="space-y-2 flex-1">
// //                       <CardTitle className="text-base">{question.text}</CardTitle>

// //                       <div className="flex flex-wrap gap-2">
// //                         <Badge variant="secondary">{question.subject}</Badge>
// //                         <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
// //                           {question.year}
// //                         </Badge>
// //                         <Badge variant="outline">{question.topic}</Badge>
// //                         <Badge>{question.type}</Badge>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
// //                     <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
// //                       <Pencil className="h-4 w-4" />
// //                     </Button>

// //                     <Button
// //                       size="icon"
// //                       variant="ghost"
// //                       className="text-destructive"
// //                       onClick={() => handleDelete(question.id)}
// //                     >
// //                       <Trash2 className="h-4 w-4" />
// //                     </Button>
// //                   </div>
// //                 </div>
// //               </CardHeader>

// //               <CardContent className="space-y-3">
// //                 {/* ANSWERS LIST */}
// //                 <div>
// //                   <p className="text-sm font-medium mb-2">Answers:</p>
// //                   <div className="space-y-2">
// //                     {question.answers?.map((a) => (
// //                       <div
// //                         key={a.id}
// //                         className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
// //                       >
// //                         {a.isCorrect ? (
// //                           <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
// //                         ) : (
// //                           <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0" />
// //                         )}
// //                         <span className={a.isCorrect ? "font-medium" : "text-muted-foreground"}>{a.text}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* EXPLANATION */}
// //                 {question.explanation && (
// //                   <div className="pt-2 border-t">
// //                     <p className="text-xs font-medium text-muted-foreground mb-1">Explanation:</p>
// //                     <p className="text-sm">{question.explanation}</p>
// //                   </div>
// //                 )}
// //               </CardContent>

// //               <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t bg-muted/20 gap-2 sm:gap-0">
// //                 <Badge variant="secondary">{question.status}</Badge>
// //                 <span className="text-xs text-muted-foreground">
// //                   {context.examBody.toUpperCase()} • {question.year}
// //                 </span>
// //               </CardFooter>
// //             </Card>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   )
// // }





// // import React, { useState, useMemo } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search } from "lucide-react"
// // import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// // // SHADCN DIALOG
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog"

// // // SHADCN SELECT
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"

// // import { Badge } from "@/components/ui/badge"


// // export default function QuestionsPanel({ context, questions, setQuestions, topics, modules, subjects, globalSearch }) {
// //   const [isDialogOpen, setIsDialogOpen] = useState(false)
// //   const [editingQuestion, setEditingQuestion] = useState(null)
// //   const [subjectOpenId, setSubjectOpenId] = useState(null);
// // const [topicOpenId, setTopicOpenId] = useState(null);
// //   const [formData, setFormData] = useState({
// //     text: "",
// //     topic: "",
// //     year: new Date().getFullYear().toString(),
// //     subject: "",
// //     type: "Multiple Choice",
// //     explanation: "",
// //   })

// //   const [answers, setAnswers] = useState([
// //     { id: "1", text: "", isCorrect: false },
// //     { id: "2", text: "", isCorrect: false },
// //   ])

// //   // Combobox states
// //   const [subjectOpen, setSubjectOpen] = useState(false)
// //   const [topicOpen, setTopicOpen] = useState(false)

// //   const [localSearch, setLocalSearch] = useState("")
// //   const [filterType, setFilterType] = useState("all")

// //   // Get unique subjects and topics from context
// //   const contextSubjects = useMemo(() => {
// //     const filtered = subjects.filter(
// //       (s) => s.examBody === context.examBody && s.year === context.year
// //     )
// //     return [...new Set(filtered.map(s => s.name))].sort()
// //   }, [subjects, context.examBody, context.year])

// //   const contextTopics = useMemo(() => {
// //     const filtered = topics.filter(
// //       (t) => t.examBody === context.examBody && 
// //             t.year === context.year &&
// //             (!formData.subject || t.subject === formData.subject)
// //     )
// //     return [...new Set(filtered.map(t => t.name))].sort()
// //   }, [topics, context.examBody, context.year, formData.subject])

// //   const handleSubmit = () => {
// //     // Validation
// //     if (!formData.text || !formData.subject || !formData.topic || !formData.explanation) {
// //       alert("Please fill in all required fields")
// //       return
// //     }

// //     if (editingQuestion) {
// //       setQuestions(
// //         questions.map((q) =>
// //           q.id === editingQuestion.id
// //             ? {
// //                 ...q,
// //                 ...formData,
// //                 answers: answers.filter((a) => a.text.trim() !== ""),
// //                 examBody: context.examBody,
// //                 status: "Active",
// //               }
// //             : q
// //         )
// //       )
// //       setEditingQuestion(null)
// //     } else {
// //       const newQuestion = {
// //         id: Date.now().toString(),
// //         ...formData,
// //         answers: answers.filter((a) => a.text.trim() !== ""),
// //         examBody: context.examBody,
// //         status: "Active",
// //       }
// //       setQuestions([...questions, newQuestion])
// //     }

// //     // Reset
// //     setFormData({
// //       text: "",
// //       topic: "",
// //       year: new Date().getFullYear().toString(),
// //       subject: "",
// //       type: "Multiple Choice",
// //       explanation: "",
// //     })

// //     setAnswers([
// //       { id: "1", text: "", isCorrect: false },
// //       { id: "2", text: "", isCorrect: false },
// //     ])

// //     setIsDialogOpen(false)
// //   }

// //   const handleEdit = (question) => {
// //     setEditingQuestion(question)
// //     setFormData({
// //       text: question.text,
// //       topic: question.topic,
// //       year: question.year,
// //       subject: question.subject,
// //       type: question.type,
// //       explanation: question.explanation,
// //     })
// //     setAnswers(question.answers || [])
// //     setIsDialogOpen(true)
// //   }

// //   const handleDelete = (id) => {
// //     setQuestions(questions.filter((q) => q.id !== id))
// //   }

// //   const addAnswer = () => {
// //     setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
// //   }

// //   const removeAnswer = (id) => {
// //     setAnswers(answers.filter((a) => a.id !== id))
// //   }

// //   const updateAnswer = (id, field, value) => {
// //     setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
// //   }

// //   const searchTerm = globalSearch || localSearch

// //   const filteredQuestions = questions.filter(
// //     (q) =>
// //       q.examBody === context.examBody &&
// //       (filterType === "all" || q.type === filterType) &&
// //       (searchTerm === "" || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
// //   )

// //   return (
// //     <div className="space-y-6">
// //       {/* SEARCH + FILTER */}
// //       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //         <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
// //           <div className="relative w-full md:w-[300px]">
// //             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search questions..."
// //               className="w-full pl-9 bg-background"
// //               value={localSearch}
// //               onChange={(e) => setLocalSearch(e.target.value)}
// //             />
// //           </div>

// //           <Select value={filterType} onValueChange={setFilterType} className="w-full md:w-[160px]">
// //             <SelectTrigger>
// //               <SelectValue placeholder="Filter" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="all">All Types</SelectItem>
// //               <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
// //               <SelectItem value="True/False">True/False</SelectItem>
// //               <SelectItem value="Short Answer">Short Answer</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>

// //         {/* ADD QUESTION BUTTON */}
// //         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Button className="w-full md:w-auto flex justify-center md:justify-start">
// //               <Plus className="mr-2 size-4" />
// //               Add Question
// //             </Button>
// //           </DialogTrigger>

// //           {/* DIALOG BODY */}
// //           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
// //             <DialogHeader>
// //               <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
// //               <DialogDescription>
// //                 {editingQuestion ? "Update" : "Create"} a question with answers
// //               </DialogDescription>
// //             </DialogHeader>

// //             {/* FORM */}
// //             <div className="grid gap-4 py-4">
// //               {/* Subject / Year / Topic */}
// //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //                 {/* SUBJECT COMBOBOX WITH SEARCH */}
// //                 <div className="space-y-2">
// //                   <Label>Subject</Label>
// //                   <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
// //                     <PopoverTrigger asChild>
// //                       <Button
// //                         variant="outline"
// //                         role="combobox"
// //                         aria-expanded={subjectOpen}
// //                         className="w-full justify-between"
// //                       >
// //                         {formData.subject || "Select subject..."}
// //                         <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// //                       </Button>
// //                     </PopoverTrigger>
// //                     <PopoverContent className="w-[300px] p-0">
// //                       <Command>
// //                         <CommandInput placeholder="Search subject..." />
// //                         <CommandEmpty>No subject found.</CommandEmpty>
// //                         <CommandGroup className="max-h-[200px] overflow-auto">
// //                           {contextSubjects.map((subject) => (
// //                             <CommandItem
// //                               key={subject}
// //                               value={subject}
// //                               onSelect={(currentValue) => {
// //                                 setFormData({ ...formData, subject: currentValue, topic: "" })
// //                                 setSubjectOpen(false)
// //                               }}
// //                             >
// //                               {subject}
// //                             </CommandItem>
// //                           ))}
// //                         </CommandGroup>
// //                       </Command>
// //                     </PopoverContent>
// //                   </Popover>
// //                 </div>

// //                 {/* YEAR INPUT */}
// //                 <div className="space-y-2">
// //                   <Label>Year</Label>
// //                   <Input
// //                     type="number"
// //                     min="1990"
// //                     max="2100"
// //                     value={formData.year}
// //                     onChange={(e) => setFormData({ ...formData, year: e.target.value })}
// //                     placeholder="e.g., 2025"
// //                   />
// //                 </div>

// //                 {/* TOPIC COMBOBOX WITH SEARCH */}
// //                 <div className="space-y-2">
// //                   <Label>Topic</Label>
// //                   <Popover open={topicOpen} onOpenChange={setTopicOpen}>
// //                     <PopoverTrigger asChild>
// //                       <Button
// //                         variant="outline"
// //                         role="combobox"
// //                         aria-expanded={topicOpen}
// //                         className="w-full justify-between"
// //                         disabled={!formData.subject}
// //                       >
// //                         {formData.topic || "Select topic..."}
// //                         <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
// //                       </Button>
// //                     </PopoverTrigger>
// //                     <PopoverContent className="w-[300px] p-0">
// //                       <Command>
// //                         <CommandInput placeholder="Search topic..." />
// //                         <CommandEmpty>No topic found.</CommandEmpty>
// //                         <CommandGroup className="max-h-[200px] overflow-auto">
// //                           {contextTopics.map((topic) => (
// //                             <CommandItem
// //                               key={topic}
// //                               value={topic}
// //                               onSelect={(currentValue) => {
// //                                 setFormData({ ...formData, topic: currentValue })
// //                                 setTopicOpen(false)
// //                               }}
// //                             >
// //                               {topic}
// //                             </CommandItem>
// //                           ))}
// //                         </CommandGroup>
// //                       </Command>
// //                     </PopoverContent>
// //                   </Popover>
// //                 </div>
// //               </div>

  
// //               {/* QUESTION */}
// //               <div className="space-y-2">
// //                 <Label>Question</Label>
// //                 <Textarea
// //                   value={formData.text}
// //                   onChange={(e) => setFormData({ ...formData, text: e.target.value })}
// //                   placeholder="Enter your question here..."
// //                   rows={3}
// //                 />
// //               </div>

// //               {/* ANSWERS */}
// //               <div className="space-y-3">
// //                 <div className="flex items-center justify-between">
// //                   <Label>Answers</Label>
// //                   <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
// //                     <Plus className="h-3 w-3 mr-1" />
// //                     Add Answer
// //                   </Button>
// //                 </div>

// //                 {answers.map((answer, index) => (
// //                   <div key={answer.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
// //                     <Input
// //                       placeholder={`Answer ${index + 1}`}
// //                       value={answer.text}
// //                       onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
// //                       className="flex-1"
// //                     />

// //                     <div className="flex items-center gap-2">
// //                       <label className="flex items-center gap-2 cursor-pointer">
// //                         <input
// //                           type="checkbox"
// //                           checked={answer.isCorrect}
// //                           onChange={(e) => updateAnswer(answer.id, "isCorrect", e.target.checked)}
// //                           className="h-4 w-4 cursor-pointer"
// //                         />
// //                         <span className="text-xs text-muted-foreground">Correct</span>
// //                       </label>

// //                       {answers.length > 2 && (
// //                         <Button
// //                           type="button"
// //                           variant="ghost"
// //                           size="icon"
// //                           className="h-9 w-9"
// //                           onClick={() => removeAnswer(answer.id)}
// //                         >
// //                           <X className="h-4 w-4" />
// //                         </Button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* EXPLANATION */}
// //               <div className="space-y-2">
// //                 <Label>Explanation</Label>
// //                 <Textarea
// //                   value={formData.explanation}
// //                   onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
// //                   placeholder="Explain why the correct answer is correct..."
// //                   rows={3}
// //                 />
// //               </div>
// //             </div>

// //             <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
// //               <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button onClick={handleSubmit}>{editingQuestion ? "Update" : "Create"} Question</Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* LIST OF QUESTIONS */}
// //       <div className="grid gap-4">
// //         {filteredQuestions.length === 0 ? (
// //           <Card>
// //             <CardContent className="flex flex-col items-center justify-center py-12">
// //               <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
// //               <p className="text-muted-foreground text-center">No questions found.</p>
// //             </CardContent>
// //           </Card>
// //         ) : (
// //           filteredQuestions.map((question) => (
// //             <Card key={question.id} className="group hover:shadow-md transition-shadow">
// //               <CardHeader>
// //   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// //     <div className="flex gap-4 flex-1">
// //       <div className="h-12 w-12 bg-accent/50 rounded-lg flex items-center justify-center flex-shrink-0">
// //         <HelpCircle className="h-6 w-6 text-accent-foreground" />
// //       </div>

// //       <div className="space-y-2 flex-1">
// //         <CardTitle className="text-base">{question.text}</CardTitle>

// //         <div className="flex flex-wrap gap-2 items-center">
            


// //           {/* YEAR */}
// //           <Badge variant="outline">{question.year}</Badge>

// //           {/* TYPE */}
// //           <Badge>{question.type}</Badge>
// //         </div>
// //       </div>
// //     </div>

// //     {/* EDIT / DELETE BUTTONS */}
// //     <div className="flex gap-1">
// //       <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
// //         <Pencil className="h-4 w-4" />
// //       </Button>

// //       <Button
// //         size="icon"
// //         variant="ghost"
// //         className="text-destructive"
// //         onClick={() => handleDelete(question.id)}
// //       >
// //         <Trash2 className="h-4 w-4" />
// //       </Button>
// //     </div>
// //   </div>
// // </CardHeader>



// //               <CardContent className="space-y-3">
// //                 {/* ANSWERS LIST */}
// //                 <div>
// //                   <p className="text-sm font-medium mb-2">Answers:</p>
// //                   <div className="space-y-2">
// //                     {question.answers?.map((a) => (
// //                       <div
// //                         key={a.id}
// //                         className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
// //                       >
// //                         {a.isCorrect ? (
// //                           <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
// //                         ) : (
// //                           <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0" />
// //                         )}
// //                         <span className={a.isCorrect ? "font-medium" : "text-muted-foreground"}>{a.text}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* EXPLANATION */}
// //                 {question.explanation && (
// //                   <div className="pt-2 border-t">
// //                     <p className="text-xs font-medium text-muted-foreground mb-1">Explanation:</p>
// //                     <p className="text-sm">{question.explanation}</p>
// //                   </div>
// //                 )}
// //               </CardContent>

// //               <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t bg-muted/20 gap-2 sm:gap-0">
// //                 <Badge variant="secondary">{question.status}</Badge>
// //                 <span className="text-xs text-muted-foreground">
// //                   {context.examBody.toUpperCase()} • {question.year}
// //                 </span>
// //               </CardFooter>
// //             </Card>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   )
// // }





// import React, { useState, useMemo } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// export default function QuestionsPanel({ context, questions, setQuestions, topics, subjects, globalSearch }) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingQuestion, setEditingQuestion] = useState(null)
//   const [subjectOpenId, setSubjectOpenId] = useState(null)
//   const [topicOpenId, setTopicOpenId] = useState(null)

//   const [formData, setFormData] = useState({
//     text: "",
//     topic: "",
//     year: new Date().getFullYear().toString(),
//     subject: "",
//     type: "Multiple Choice",
//     explanation: "",
//   })

//   const [answers, setAnswers] = useState([
//     { id: "1", text: "", isCorrect: false },
//     { id: "2", text: "", isCorrect: false },
//   ])

//   const [localSearch, setLocalSearch] = useState("")
//   const [filterType, setFilterType] = useState("all")

//   // Filtered subjects and topics
//   const contextSubjects = useMemo(() => {
//     const filtered = subjects.filter(
//       (s) => s.examBody === context.examBody && s.year === context.year
//     )
//     return [...new Set(filtered.map((s) => s.name))].sort()
//   }, [subjects, context.examBody, context.year])

//   const contextTopics = useMemo(() => {
//     const filtered = topics.filter(
//       (t) =>
//         t.examBody === context.examBody &&
//         t.year === context.year &&
//         (!formData.subject || t.subject === formData.subject)
//     )
//     return [...new Set(filtered.map((t) => t.name))].sort()
//   }, [topics, context.examBody, context.year, formData.subject])

//   const searchTerm = globalSearch || localSearch
//   const filteredQuestions = questions.filter(
//     (q) =>
//       q.examBody === context.examBody &&
//       (filterType === "all" || q.type === filterType) &&
//       (searchTerm === "" || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
//   )

//   const handleSubmit = () => {
//     if (!formData.text || !formData.subject || !formData.topic || !formData.explanation) {
//       alert("Please fill in all required fields")
//       return
//     }

//     if (editingQuestion) {
//       setQuestions(
//         questions.map((q) =>
//           q.id === editingQuestion.id
//             ? { ...q, ...formData, answers: answers.filter((a) => a.text.trim() !== ""), examBody: context.examBody, status: "Active" }
//             : q
//         )
//       )
//       setEditingQuestion(null)
//     } else {
//       const newQuestion = {
//         id: Date.now().toString(),
//         ...formData,
//         answers: answers.filter((a) => a.text.trim() !== ""),
//         examBody: context.examBody,
//         status: "Active",
//       }
//       setQuestions([...questions, newQuestion])
//     }

//     setFormData({ text: "", topic: "", year: new Date().getFullYear().toString(), subject: "", type: "Multiple Choice", explanation: "" })
//     setAnswers([{ id: "1", text: "", isCorrect: false }, { id: "2", text: "", isCorrect: false }])
//     setIsDialogOpen(false)
//   }

//   const handleEdit = (question) => {
//     setEditingQuestion(question)
//     setFormData({
//       text: question.text,
//       topic: question.topic,
//       year: question.year,
//       subject: question.subject,
//       type: question.type,
//       explanation: question.explanation,
//     })
//     setAnswers(question.answers || [])
//     setIsDialogOpen(true)
//   }

//   const handleDelete = (id) => {
//     setQuestions(questions.filter((q) => q.id !== id))
//   }

//   const addAnswer = () => setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
//   const removeAnswer = (id) => setAnswers(answers.filter((a) => a.id !== id))
//   const updateAnswer = (id, field, value) => setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))

//   return (
//     <div className="space-y-6">
//       {/* Search + Filter */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
//           <div className="relative w-full md:w-[300px]">
//             <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Search questions..."
//               className="w-full pl-9"
//               value={localSearch}
//               onChange={(e) => setLocalSearch(e.target.value)}
//             />
//           </div>
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="w-full md:w-[160px] border rounded px-2 py-1"
//           >
//             <option value="all">All Types</option>
//             <option value="Multiple Choice">Multiple Choice</option>
//             <option value="True/False">True/False</option>
//             <option value="Short Answer">Short Answer</option>
//           </select>
//         </div>

//         {/* Add Question Button */}
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="w-full md:w-auto flex justify-center md:justify-start">
//               <Plus className="mr-2 size-4" /> Add Question
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
//             <DialogHeader>
//               <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               {/* Subject / Year / Topic */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {/* Subject */}
//                 <div className="space-y-2 relative">
//                   <Label>Subject</Label>
//                   <div
//                     className="border rounded px-2 py-1 cursor-pointer"
//                     onClick={() => setSubjectOpenId(subjectOpenId === "form" ? null : "form")}
//                   >
//                     {formData.subject || "Select subject"}
//                   </div>
//                   {subjectOpenId === "form" && (
//                     <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-50 w-full">
//                       {contextSubjects.map((s) => (
//                         <div
//                           key={s}
//                           className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => {
//                             setFormData({ ...formData, subject: s, topic: "" })
//                             setSubjectOpenId(null)
//                           }}
//                         >
//                           {s}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Year */}
//                 <div className="space-y-2">
//                   <Label>Year</Label>
//                   <Input
//                     type="number"
//                     min="1990"
//                     max="2100"
//                     value={formData.year}
//                     onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//                   />
//                 </div>

//                 {/* Topic */}
//                 <div className="space-y-2 relative">
//                   <Label>Topic</Label>
//                   <div
//                     className={`border rounded px-2 py-1 cursor-pointer ${!formData.subject ? "opacity-50 cursor-not-allowed" : ""}`}
//                     onClick={() => formData.subject && setTopicOpenId(topicOpenId === "form" ? null : "form")}
//                   >
//                     {formData.topic || "Select topic"}
//                   </div>
//                   {topicOpenId === "form" && (
//                     <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-50 w-full">
//                       {contextTopics.map((t) => (
//                         <div
//                           key={t}
//                           className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => {
//                             setFormData({ ...formData, topic: t })
//                             setTopicOpenId(null)
//                           }}
//                         >
//                           {t}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Question Text */}
//               <div className="space-y-2">
//                 <Label>Question</Label>
//                 <Textarea
//                   value={formData.text}
//                   onChange={(e) => setFormData({ ...formData, text: e.target.value })}
//                   rows={3}
//                 />
//               </div>

//               {/* Answers */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <Label>Answers</Label>
//                   <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
//                     <Plus className="h-3 w-3 mr-1" /> Add Answer
//                   </Button>
//                 </div>
//                 {answers.map((a, i) => (
//                   <div key={a.id} className="flex gap-2 items-center">
//                     <Input
//                       placeholder={`Answer ${i + 1}`}
//                       value={a.text}
//                       onChange={(e) => updateAnswer(a.id, "text", e.target.value)}
//                     />
//                     <label className="flex items-center gap-1">
//                       <input type="checkbox" checked={a.isCorrect} onChange={(e) => updateAnswer(a.id, "isCorrect", e.target.checked)} />
//                       Correct
//                     </label>
//                     {answers.length > 2 && <Button size="icon" variant="ghost" onClick={() => removeAnswer(a.id)}><X /></Button>}
//                   </div>
//                 ))}
//               </div>

//               {/* Explanation */}
//               <div className="space-y-2">
//                 <Label>Explanation</Label>
//                 <Textarea
//                   value={formData.explanation}
//                   onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
//                   rows={3}
//                 />
//               </div>
//             </div>

//             <DialogFooter className="flex gap-2">
//               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//               <Button onClick={handleSubmit}>{editingQuestion ? "Update" : "Create"} Question</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Question List */}
//       <div className="grid gap-4">
//         {filteredQuestions.length === 0 ? (
//           <div className="border p-6 text-center text-gray-500 rounded-md">
//             <HelpCircle className="mx-auto mb-2" /> No questions found.
//           </div>
//         ) : (
//           filteredQuestions.map((q) => (
//             <div key={q.id} className="border rounded-md shadow p-4 relative">
//               <div className="flex justify-between items-start gap-4">
//                 <div className="flex-1">
//                   <p className="font-medium">{q.text}</p>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {/* Subject Dropdown */}
//                     <div className="relative">
//                       <div
//                         className="border px-2 py-1 cursor-pointer rounded"
//                         onClick={() => setSubjectOpenId(subjectOpenId === q.id ? null : q.id)}
//                       >
//                         {q.subject || "Select subject"}
//                       </div>
//                       {subjectOpenId === q.id && (
//                         <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-50 w-40">
//                           {contextSubjects.map((s) => (
//                             <div
//                               key={s}
//                               className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => {
//                                 setQuestions((qs) => qs.map((ques) => ques.id === q.id ? { ...ques, subject: s, topic: "" } : ques))
//                                 setSubjectOpenId(null)
//                               }}
//                             >
//                               {s}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
// {/* Topic Dropdown */}
// <div className="relative">
//   <div
//     className={`border px-2 py-1 cursor-pointer rounded ${!q.subject ? "opacity-50 cursor-not-allowed" : ""}`}
//     onClick={() => {
//       if (!q.subject) return; // prevent open if no subject
//       setTopicOpenId(topicOpenId === q.id ? null : q.id)
//     }}
//   >
//     {q.topic || "Select topic"}
//   </div>

//   {topicOpenId === q.id && q.subject && (
//     <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-50 w-40">
//       {topics
//         .filter(
//           (t) =>
//             t.examBody === context.examBody &&
//             t.year === context.year &&
//             t.subject === q.subject // must match the selected subject
//         )
//         .map((t) => (
//           <div
//             key={t.name}
//             className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
//             onClick={() => {
//               setQuestions((qs) =>
//                 qs.map((ques) =>
//                   ques.id === q.id ? { ...ques, topic: t.name } : ques
//                 )
//               )
//               setTopicOpenId(null)
//             }}
//           >
//             {t.name}
//           </div>
//         ))}
//     </div>
//   )}
// </div>


//                     <Badge variant="outline">{q.year}</Badge>
//                     <Badge>{q.type}</Badge>
//                   </div>
//                 </div>

//                 <div className="flex gap-1">
//                   <Button size="icon" variant="ghost" onClick={() => handleEdit(q)}><Pencil /></Button>
//                   <Button size="icon" variant="ghost" className="text-red-600" onClick={() => handleDelete(q.id)}><Trash2 /></Button>
//                 </div>
//               </div>

//               {/* Answers */}
//               <div className="mt-3 space-y-1">
//                 {q.answers?.map((a) => (
//                   <div key={a.id} className="flex gap-2 items-center bg-gray-50 rounded p-1">
//                     {a.isCorrect ? <CheckCircle2 className="text-green-600" /> : <div className="w-4 h-4 border rounded-full" />}
//                     <span className={a.isCorrect ? "font-medium" : "text-gray-500"}>{a.text}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Explanation */}
//               {q.explanation && <div className="mt-2 text-sm text-gray-500 border-t pt-2">{q.explanation}</div>}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }




import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function QuestionsPanel({ context, questions, setQuestions, topics, subjects, globalSearch }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const [formData, setFormData] = useState({
    text: "",
    topic: "",
    year: context.year || new Date().getFullYear().toString(),
    subject: "",
    type: "Multiple Choice",
    explanation: "",
  })

  const [answers, setAnswers] = useState([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
  ])

  const [localSearch, setLocalSearch] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Get subjects for current context
  const contextSubjects = useMemo(() => {
    const filtered = subjects.filter(
      (s) => s.examBody === context.examBody && s.year === context.year
    )
    return [...new Set(filtered.map((s) => s.name))].sort()
  }, [subjects, context.examBody, context.year])

  // Get topics for selected subject
  const contextTopics = useMemo(() => {
    if (!formData.subject) return []
    
    const filtered = topics.filter(
      (t) =>
        t.examBody === context.examBody &&
        t.year === context.year &&
        t.subject === formData.subject
    )
    return [...new Set(filtered.map((t) => t.name))].sort()
  }, [topics, context.examBody, context.year, formData.subject])

  const searchTerm = globalSearch || localSearch
  
  const filteredQuestions = questions.filter(
    (q) =>
      q.examBody === context.examBody &&
      q.year === context.year &&
      (filterType === "all" || q.type === filterType) &&
      (searchTerm === "" || q.text?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubmit = () => {
    if (!formData.text || !formData.subject || !formData.topic || !formData.explanation) {
      alert("Please fill in all required fields")
      return
    }

    const hasCorrectAnswer = answers.some(a => a.isCorrect && a.text.trim() !== "")
    if (!hasCorrectAnswer) {
      alert("Please mark at least one answer as correct")
      return
    }

    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                ...formData,
                answers: answers.filter((a) => a.text.trim() !== ""),
                examBody: context.examBody,
                year: context.year,
                status: "Active",
              }
            : q
        )
      )
      setEditingQuestion(null)
    } else {
      const newQuestion = {
        id: Date.now().toString(),
        ...formData,
        answers: answers.filter((a) => a.text.trim() !== ""),
        examBody: context.examBody,
        year: context.year,
        status: "Active",
      }
      setQuestions([...questions, newQuestion])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      text: "",
      topic: "",
      year: context.year || new Date().getFullYear().toString(),
      subject: "",
      type: "Multiple Choice",
      explanation: "",
    })
    setAnswers([
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
    ])
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      text: question.text,
      topic: question.topic,
      year: question.year,
      subject: question.subject,
      type: question.type,
      explanation: question.explanation,
    })
    setAnswers(question.answers || [])
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const addAnswer = () => {
    setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
  }

  const removeAnswer = (id) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((a) => a.id !== id))
    }
  }

  const updateAnswer = (id, field, value) => {
    setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  return (
    <div className="space-y-6">
      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="w-full pl-9 bg-background"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-[160px] h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="all">All Types</option>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="True/False">True/False</option>
            <option value="Short Answer">Short Answer</option>
          </select>
        </div>

        {/* ADD QUESTION BUTTON */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingQuestion(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 size-4" /> Add Question
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* SUBJECT & TOPIC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SUBJECT DROPDOWN */}
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value, topic: "" })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select subject...</option>
                    {contextSubjects.length === 0 ? (
                      <option disabled>No subjects available</option>
                    ) : (
                      contextSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* TOPIC DROPDOWN */}
                <div className="space-y-2">
                  <Label>Topic *</Label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    disabled={!formData.subject}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background disabled:opacity-50"
                  >
                    <option value="">
                      {formData.subject ? "Select topic..." : "Select subject first"}
                    </option>
                    {contextTopics.length === 0 && formData.subject ? (
                      <option disabled>No topics for this subject</option>
                    ) : (
                      contextTopics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* QUESTION TYPE */}
              <div className="space-y-2">
                <Label>Question Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Short Answer">Short Answer</option>
                </select>
              </div>

              {/* QUESTION TEXT */}
              <div className="space-y-2">
                <Label>Question *</Label>
                <Textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>

              {/* ANSWERS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Answers *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                    <Plus className="h-3 w-3 mr-1" /> Add Answer
                  </Button>
                </div>

                {answers.map((answer, index) => (
                  <div key={answer.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <Input
                      placeholder={`Answer ${index + 1}`}
                      value={answer.text}
                      onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
                      className="flex-1"
                    />

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={answer.isCorrect}
                          onChange={(e) => updateAnswer(answer.id, "isCorrect", e.target.checked)}
                          className="h-4 w-4 cursor-pointer"
                        />
                        <span className="text-xs text-muted-foreground">Correct</span>
                      </label>

                      {answers.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => removeAnswer(answer.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* EXPLANATION */}
              <div className="space-y-2">
                <Label>Explanation *</Label>
                <Textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why the correct answer is correct..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingQuestion ? "Update" : "Create"} Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* QUESTIONS LIST */}
      <div className="grid gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <HelpCircle className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {questions.length === 0
                ? "No questions found. Create your first question to get started."
                : "No questions match your current filters."}
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex gap-4 flex-1">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{question.text}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{question.subject}</Badge>
                      <Badge variant="outline">{question.topic}</Badge>
                      <Badge variant="outline">{question.year}</Badge>
                      <Badge>{question.type}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* ANSWERS */}
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Answers:</p>
                <div className="space-y-2">
                  {question.answers?.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50"
                    >
                      {a.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={a.isCorrect ? "font-medium" : "text-gray-600"}>
                        {a.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXPLANATION */}
              {question.explanation && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Explanation:</p>
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                </div>
              )}

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
                <Badge variant="secondary">{question.status}</Badge>
                <span>{context.examBody.toUpperCase()} • {question.year}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}