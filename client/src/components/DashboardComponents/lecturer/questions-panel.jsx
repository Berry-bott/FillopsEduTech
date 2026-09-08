import React, { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, Loader2, Eye, MoreHorizontal, AlertTriangle, FileText, X,
  List,
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
import { Switch } from "@/components/ui/switch"
import useTutorStore from "@/store/tutorStore"
import RichTextEditor from "./RichTextEditor"
import {
  normalizeRichTextForBackend,
  listsToDelimiters,
  renderListsInHtml,
  mathSpansToDelimiters,
  renderMathInHtml,
    renderImageMarkersInHtml,
    renderLineBreaksInHtml,
  stripHtml,
} from "./rich-text-utils"

const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"]
const QUESTION_TYPES = ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]
const CATEGORIES = ["JAMB", "WAEC", "NECO"]
const ALL_TOPIC = "all-topics"

function extractEditorImageUrls(...htmlValues) {
  const imageUrls = []

  htmlValues.forEach((html) => {
    if (!html) return
    const document = new DOMParser().parseFromString(html, "text/html")
    document.querySelectorAll("img[src]").forEach((image) => {
      const src = image.getAttribute("src")
      if (src && !imageUrls.includes(src)) imageUrls.push(src)
    })
  })

  return imageUrls
}

function normalizeImageUrl(image) {
  if (typeof image === "string") return image
  if (!image || typeof image !== "object") return ""
  return image.url || image.imageUrl || image.src || image.path || image.location || ""
}

function getQuestionImageUrls(question) {
  const values = [
    question?.imageUrl,
    ...(Array.isArray(question?.imageUrls) ? question.imageUrls : question?.imageUrls ? [question.imageUrls] : []),
    ...(Array.isArray(question?.images) ? question.images : question?.images ? [question.images] : []),
    ...(Array.isArray(question?.data?.imageUrls) ? question.data.imageUrls : question?.data?.imageUrls ? [question.data.imageUrls] : []),
    ...(Array.isArray(question?.data?.images) ? question.data.images : question?.data?.images ? [question.data.images] : []),
  ]

  return [...new Set(values.map(normalizeImageUrl).filter(Boolean))]
}

function renderQuestionContent(html, imageUrls) {
  return renderLineBreaksInHtml(renderImageMarkersInHtml(renderListsInHtml(renderMathInHtml(html)), imageUrls))
}

function RichContentPreview({ html, className = "" }) {
  const [previewUrls, setPreviewUrls] = React.useState([])

  return (
    <>
      <div
        className={`rich-content whitespace-pre-wrap break-words [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_.inline-image-paragraph]:inline-block [&_.inline-image-paragraph]:align-middle [&_.inline-image-paragraph]:m-0 [&_.inline-image-paragraph>img]:inline-block [&_img]:h-[150px] [&_img]:w-[150px] [&_img]:object-contain [&_img]:cursor-zoom-in [&_img]:rounded-md [&_img]:border [&_img]:border-slate-300 [&_[data-image-kind="drawing"]]:h-[64px] [&_[data-image-kind="drawing"]]:w-[100px] ${className}`}
        onClick={(event) => {
          const image = event.target.closest("img")
          if (!image?.src) return

          const imageGroup = image.closest(".inline-image-paragraph")
          const groupUrls = imageGroup
            ? [...imageGroup.querySelectorAll("img")].map((groupImage) => groupImage.src).filter(Boolean)
            : [image.src]

          setPreviewUrls(groupUrls)
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Dialog open={previewUrls.length > 0} onOpenChange={(open) => !open && setPreviewUrls([])}>
        <DialogContent className="max-w-5xl p-3">
          <DialogTitle className="sr-only">Full image preview</DialogTitle>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {previewUrls.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`Full image preview ${index + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function QuestionsPanel({
  selectedSubjectId,
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
    getTopics,
    getSubjects,
    subjects: storeSubjects,
    topics: storeTopics,
    questions: storeQuestions,
    questionsPagination,
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
    imageUrls: [],       // Images inserted inside the rich editors
    instruction: "",     // e.g. "Solve for x."
    isPastQuestion: true, // toggle ON by default → origin is "PAST_QUESTION"
    origin: "PAST_QUESTION",
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
  const [localSelectedSubject, setLocalSelectedSubject] = useState(null)
  const [localSelectedTopic, setLocalSelectedTopic] = useState(null)
  const [isAllTopics, setIsAllTopics] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_LIMIT = 10

  useEffect(() => {
    if (!storeSubjects || storeSubjects.length === 0) fetchSubjects()
    if (!storeTopics || storeTopics.length === 0) fetchTopics()
  }, [storeSubjects, storeTopics])

  const fetchSubjects = async () => {
    try {
      await getSubjects()
    } catch {
      toast({ title: "Error", description: "Failed to load subjects", variant: "destructive" })
    }
  }

  const fetchTopics = async () => {
    try {
      await getTopics()
    } catch {
      toast({ title: "Error", description: "Failed to load topics", variant: "destructive" })
    }
  }

  const fetchQuestionsForPage = async ({
    page = currentPage,
    topicId = isAllTopics ? null : activeTopicId,
    subjectId = activeSubjectId,
    category = examBody,
    yr = year,
    q = globalSearch,
  } = {}) => {
    try {
      await getQuestions({
        page,
        limit: PAGE_LIMIT,
        topicId: topicId || null,
        subjectId: subjectId || null,
        category: category || "",
        year: yr || "",
        search: q || "",
      })
    } catch {
      toast({ title: "Error", description: "Failed to load questions", variant: "destructive" })
    }
  }

  const activeSubjectId = localSelectedSubject || selectedSubjectId
  const activeTopicId = isAllTopics ? null : (localSelectedTopic || selectedTopic)
  const activeSubjectName = subjectName || (storeSubjects || []).find((s) => (s.subjectId || s.id) === activeSubjectId)?.subjectName || ""
  const activeTopicName = topicName || (storeTopics || []).find((t) => t.id === activeTopicId)?.topicName || ""
  const topicOptions = (storeTopics || []).filter((t) => {
    const subjectCandidate = t.subject?.id || t.subject?.subjectId || t.subjectId
    return !activeSubjectId || subjectCandidate === activeSubjectId
  })

  useEffect(() => {
    if (selectedTopic) {
      setLocalSelectedTopic(selectedTopic)
      setIsAllTopics(false)
    }
  }, [selectedTopic])

  useEffect(() => {
    if (isAllTopics) return
    if (!selectedTopic && !localSelectedTopic && topicOptions.length > 0) {
      setLocalSelectedTopic(topicOptions[0]?.id || null)
    }
  }, [selectedTopic, localSelectedTopic, topicOptions, isAllTopics])

  useEffect(() => {
    if (selectedSubjectId) {
      setLocalSelectedSubject(selectedSubjectId)
    }
    if (!selectedSubjectId && !localSelectedSubject && (storeSubjects || []).length > 0) {
      const firstSubject = storeSubjects[0]
      setLocalSelectedSubject(firstSubject?.subjectId || firstSubject?.id || null)
    }
  }, [selectedSubjectId, localSelectedSubject, storeSubjects])

  // Refetch from the server whenever the scoped topic/subject or any filter changes.
  // Resets back to page 1 on filter change; advances pages only when `currentPage` changes.
  const lastFilterSignalRef = useRef("")
  const filterSignal = `${activeTopicId || ""}|${activeSubjectId || ""}|${examBody || ""}|${year || ""}|${globalSearch || ""}|all=${isAllTopics}`

  useEffect(() => {
    if (!activeTopicId && !isAllTopics) return

    if (lastFilterSignalRef.current !== filterSignal) {
      lastFilterSignalRef.current = filterSignal
      setCurrentPage(1)
      fetchQuestionsForPage({ page: 1 })
      return
    }

    fetchQuestionsForPage({ page: currentPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSignal, currentPage, activeTopicId, activeSubjectId, isAllTopics])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!activeTopicId) {
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
      const questionImageUrls = extractEditorImageUrls(formData.text)
      const explanationImageUrls = extractEditorImageUrls(formData.explanation)
      const extractedImageUrls = [...questionImageUrls, ...explanationImageUrls]
      const normalizedText = normalizeRichTextForBackend(formData.text)
      const normalizedExplanation = normalizeRichTextForBackend(formData.explanation, questionImageUrls.length)
      const finalImageUrls = [...new Set([
        ...(formData.imageUrls || []),
        ...extractedImageUrls,
      ])].filter(Boolean)

      const safeOrigin = formData.isPastQuestion
        ? "PAST_QUESTION"
        : "SAMPLE_QUESTION"

      const questionData = {
        text: normalizedText,
        type: formData.type,
        difficulty: formData.difficulty,
        year: formData.isPastQuestion ? Number(formData.year || new Date().getFullYear()) : null,
        category: formData.category,
        explanation: normalizedExplanation,
        imageUrls: finalImageUrls,
        instruction: formData.instruction, // e.g. "Solve for x."
        origin: safeOrigin,
        options: formData.type === "MULTIPLE_CHOICE" ? options.filter((o) => o.trim()) : [],
        correctAnswer: formData.type === "MULTIPLE_CHOICE" ? correctAnswer : stripHtml(normalizedText || formData.text || ""),
      }
      const result = editingQuestion
        ? await updateQuestion(editingQuestion.id, questionData)
        : await createQuestion(activeTopicId, questionData)

      if (result.success) {
        toast({ title: "Success", description: editingQuestion ? "Question updated" : "Question created" })
        resetForm()
        setIsDialogOpen(false)
        useTutorStore.setState({ questionsLoaded: false })
        await fetchQuestionsForPage()
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
    year: new Date().getFullYear(), category: "JAMB", explanation: "",
    imageUrls: [],
    instruction: "",
    isPastQuestion: true,
    origin: "PAST_QUESTION",
  })

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
      imageUrls: question.imageUrls || [],
      instruction: question.instruction || "",
      isPastQuestion: (question.origin || "PAST_QUESTION") === "PAST_QUESTION",
      origin: question.origin || "PAST_QUESTION",
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
        await fetchQuestionsForPage()
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

  // Resolve which topic a question belongs to, regardless of API shape.
  const getQuestionTopicId = (q) =>
    q?.topic?.id || q?.topic?.topicId || q?.topicId || null

  const getQuestionTopicColor = (q) =>
    q?.topic?.subject?.color || q?.topicColor || null

  const filteredQuestions = (storeQuestions || []).filter((q) => {
    if (activeTopicId && getQuestionTopicId(q) !== activeTopicId) return false
    if (globalSearch) {
      const s = globalSearch.toLowerCase()
      if (!stripHtml(q.text).toLowerCase().includes(s) && !stripHtml(q.explanation).toLowerCase().includes(s)) return false
    }
    if (year && q.year?.toString() !== year.toString()) return false
    if (examBody && examBody !== "all-catigories" && q.category?.toLowerCase() !== examBody.toLowerCase()) return false
    if (color && color !== "all" && getQuestionTopicColor(q) !== color) return false
    return true
  })

  return (
    <div className="space-y-6">

      {/* Subject & Topic selectors */}
      {/* Only show manual selectors when opening Questions directly (no inline drill-down topic) */}
      {!selectedTopic && (
      <div className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Subject</Label>
          <Select
            value={activeSubjectId || ""}
            onValueChange={(value) => {
              setLocalSelectedSubject(value)
              setLocalSelectedTopic(null)
              setIsAllTopics(false)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {(storeSubjects || []).map((subject) => {
                const subjectId = subject.subjectId || subject.id
                return (
                  <SelectItem key={subjectId} value={subjectId}>
                    {subject.subjectName || subject.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Topic</Label>
          <Select
            value={isAllTopics ? ALL_TOPIC : (activeTopicId || ALL_TOPIC)}
            onValueChange={(value) => {
              if (value === ALL_TOPIC) {
                setIsAllTopics(true)
                setLocalSelectedTopic(null)
              } else {
                setIsAllTopics(false)
                setLocalSelectedTopic(value)
              }
            }}
            disabled={!activeSubjectId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TOPIC}>ALL TOPIC</SelectItem>
              {topicOptions.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.topicName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      )}

      {/* Topic Header */}
      {isAllTopics ? (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">All Topics</h2>
            <p className="text-sm text-muted-foreground">
              {activeSubjectName ? `${activeSubjectName} • All questions` : "All questions across all topics"}
            </p>
          </div>
        </div>
      ) : activeTopicName && (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{activeTopicName}</h2>
            <p className="text-sm text-muted-foreground">
              {activeSubjectName ? `${activeSubjectName} • Manage questions` : "Manage questions for this topic"}
            </p>
          </div>
        </div>
      )}

      {/* Add Question Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!activeTopicId}
              title={isAllTopics ? "Select a specific topic to create a question" : undefined}
            >
              <Plus className="mr-2 size-4" />New Question
            </Button>
          </DialogTrigger>

          <DialogContent 
            key={dialogKey} 
            className="sm:max-w-[780px] max-h-[85vh] overflow-y-auto md:mt-8 md:ml-10"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
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
                <div className="space-y-2">
                  <Label>Origin</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.isPastQuestion}
                      onCheckedChange={(v) => setFormData({ ...formData, isPastQuestion: v })}
                    />
                    <span className="text-sm text-muted-foreground">Past Question</span>
                  </div>
                  {!formData.isPastQuestion && (
                    <Input
                      placeholder="Sample question"
                      value={formData.origin === "SAMPLE_QUESTION" ? "SAMPLE_QUESTION" : formData.origin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          origin: e.target.value.toUpperCase() || "SAMPLE_QUESTION",
                        })
                      }
                    />
                  )}
                </div>
              </div>

              {/* ✏️ Instruction */}
              <div className="space-y-2">
                <Label>Instruction</Label>
                <Input
                  placeholder="e.g. Solve for x."
                  value={formData.instruction}
                  onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  A short instruction for the question, e.g. &quot;Solve for x.&quot;
                </p>
              </div>

              {/* ✅ Rich Text — Question */}
              <div className="space-y-2">
                <Label>Question Text</Label>
                <RichTextEditor
                  value={formData.text}
                  onChange={(html) => setFormData({ ...formData, text: html })}
                  imageUrls={formData.imageUrls}
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
                  imageUrls={formData.imageUrls}
                  placeholder="Explain the correct answer... You can include images, or formatted text."
                  minHeight="120px"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
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
        {!activeTopicId && !isAllTopics ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                Select a subject and a topic to manage its questions.
              </p>
            </CardContent>
          </Card>
        ) : loading ? (
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
                {globalSearch ? "No questions match your search" : isAllTopics ? "No questions found across all topics" : "No questions yet. Create your first question."}
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
                      <CardTitle className="text-[1rem]  text-blue-500 font-extrabold">
                        Instruction:  <span className="text-sm font-medium">{question.instruction?.trim() || "none"}</span>
                      </CardTitle>
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
                <RichContentPreview
                  html={renderQuestionContent(question.text, getQuestionImageUrls(question))}
                  className="text-base font-semibold [&_img]:my-1 [&_sup]:text-xs [&_sub]:text-xs"
                />

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
                    <RichContentPreview
                      html={renderQuestionContent(question.explanation, getQuestionImageUrls(question))}
                      className="text-sm [&_img]:my-1 prose prose-sm max-w-none"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
                  <Badge variant="outline">{question.type.replace("_", " ")}</Badge>
                  <Badge variant="secondary">{question.difficulty}</Badge>
                  <Badge>{question.category}</Badge>
                  <Badge variant="outline">{question.year}</Badge>
                  {question.origin && <Badge variant="secondary">{question.origin.replace("_", " ")}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {questionsPagination && (activeTopicId || isAllTopics) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Showing page <span className="font-semibold text-foreground">{questionsPagination.currentPage || currentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{questionsPagination.totalPages || 1}</span>
            {" "}({questionsPagination.totalCount ?? 0} questions)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!questionsPagination.hasPrevPage || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, (questionsPagination.currentPage || p) - 1))}
            >
              <span aria-hidden="true">&larr;</span>&nbsp;Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!questionsPagination.hasNextPage || loading}
              onClick={() => setCurrentPage((p) => (questionsPagination.currentPage || p) + 1)}
            >
              Next&nbsp;<span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </div>
      )}

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
        <DialogContent 
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
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
                {viewingQuestion.instruction && (
                  <p className="text-sm font-medium text-blue-700 italic">
                    {viewingQuestion.instruction}
                  </p>
                )}
                <RichContentPreview
                  html={renderQuestionContent(viewingQuestion.text, getQuestionImageUrls(viewingQuestion))}
                  className="text-muted-foreground [&_img]:my-2 prose prose-sm max-w-none"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground">Type</p><Badge variant="outline">{viewingQuestion.type.replace("_", " ")}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Difficulty</p><Badge variant="secondary">{viewingQuestion.difficulty}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Category</p><Badge>{viewingQuestion.category}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Year</p><Badge variant="outline">{viewingQuestion.year}</Badge></div>
                {viewingQuestion.origin && <div><p className="text-xs text-muted-foreground">Origin</p><Badge variant="secondary">{viewingQuestion.origin.replace("_", " ")}</Badge></div>}
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
                    <RichContentPreview
                      html={renderQuestionContent(viewingQuestion.explanation, getQuestionImageUrls(viewingQuestion))}
                      className="bg-muted/50 rounded-lg p-4 [&_img]:my-2 prose prose-sm max-w-none"
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