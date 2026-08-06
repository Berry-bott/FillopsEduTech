
import React, { useState, useEffect, useCallback, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, FileText, Loader2, Eye, MoreHorizontal, AlertTriangle, HelpCircle, Bold, Italic, UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Highlighter, Palette, Undo, Redo, Minus, Code, Link as LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import useTutorStore from "@/store/tutorStore"

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
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

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

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

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

      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Upload Image">
        <span className="text-xs font-semibold">IMG</span>
      </ToolbarButton>
      <ToolbarButton onClick={insertImageFromUrl} title="Insert Image from URL">
        <LinkIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={insertImage} />
    </div>
  )
}

function TopicRichTextEditor({ value, onChange, placeholder = "Start typing...", minHeight = "160px" }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
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

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value, editor])

  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default function TopicsPanel({ 
  selectedSubject, 
  subjectName, 
  onTopicSelect, 
  globalSearch,
  examBody,
  year,
  color 
}) {
  const { toast } = useToast()
  const {
    createTopic,
    updateTopic,
    deleteTopic,
    getTopicById,
    getTopics,
    getSubjects,
    subjects: storeSubjects,
    topics: storeTopics,
    loading,
  } = useTutorStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [formData, setFormData] = useState({
    topicName: "",
    description: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingTopic, setViewingTopic] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localSelectedSubject, setLocalSelectedSubject] = useState(null)
  const [topicContentCache, setTopicContentCache] = useState({})

  // ✅ Fetch topics only once - Zustand will cache them
  useEffect(() => {
    if (!storeSubjects || storeSubjects.length === 0) {
      fetchSubjects()
    }
    if (!storeTopics || storeTopics.length === 0) {
      fetchTopics()
    }
  }, [storeSubjects, storeTopics])

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

  const fetchTopics = async () => {
    try {
      await getTopics() // ✅ This will update the Zustand store
    } catch (error) {
      console.error("Error fetching topics:", error)
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      })
    }
  }

  const resolvedSubjectId = selectedSubject || localSelectedSubject
  const resolvedSubjectName = subjectName || (storeSubjects || []).find((s) => {
    const candidateId = s.subjectId || s.id
    return candidateId === resolvedSubjectId
  })?.subjectName || ""

  useEffect(() => {
    if (!selectedSubject && !localSelectedSubject && (storeSubjects || []).length > 0) {
      const firstSubject = storeSubjects[0]
      setLocalSelectedSubject(firstSubject?.subjectId || firstSubject?.id || null)
    }
  }, [selectedSubject, localSelectedSubject, storeSubjects])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resolvedSubjectId) {
      toast({
        title: "Error",
        description: "Please select a subject first",
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
        : await createTopic(resolvedSubjectId, topicData)

      if (result.success) {
        toast({
          title: "Success",
          description: editingTopic 
            ? "Topic updated successfully" 
            : "Topic created successfully",
        })

        if (result.data?.id) {
          setTopicContentCache((prev) => ({
            ...prev,
            [result.data.id]: result.data.content || "",
          }))
        }

        setFormData({ topicName: "", description: "", content: "" })
        setEditingTopic(null)
        setIsDialogOpen(false)
        
        // ✅ Invalidate cache to force refresh
        useTutorStore.setState({ topicsLoaded: false })
        await fetchTopics()
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
        
        setDeleteConfirmOpen(false)
        setTopicToDelete(null)
        
        // ✅ Invalidate cache to force refresh
        useTutorStore.setState({ topicsLoaded: false })
        await fetchTopics()
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
      const topicKey = topic.id || topic.topicId
      const result = await getTopicById(topicKey)
      const topicPayload = result?.data?.topic || result?.data || null

      if (result?.success && topicPayload) {
        setViewingTopic({
          ...topicPayload,
          id: topicPayload.id || topicKey,
          topicName: topicPayload.topicName || topic.topicName || "",
          description: topicPayload.description || topic.description || "",
          content: topicPayload.content || topicContentCache[topicKey] || topic?.content || "",
          subject: topicPayload.subject || topic.subject || null,
          _count: topicPayload._count || topic._count || { question: 0 },
        })
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to load topic details",
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

  const handleViewQuestions = (topic) => {
    if (onTopicSelect) {
      onTopicSelect(topic.id, topic.topicName)
    }
  }

  // ✅ Filter topics from Zustand store based on props AND search
  const filteredTopics = (storeTopics || []).filter((t) => {
    const topicSubjectId = t.subject?.id || t.subject?.subjectId || t.subjectId || null
    const subjectMatch = resolvedSubjectId
      ? topicSubjectId === resolvedSubjectId
      : true

    if (!subjectMatch) {
      return false
    }

    // Search filter
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase()
      const matchesSearch =
        t.topicName?.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false
    }

    // Category filter (resolve through the selected subject or the topic subject)
    if (examBody && examBody !== "all-catigories") {
      const currentSubject = (storeSubjects || []).find((subject) => {
        const subjectId = subject.subjectId || subject.id
        return subjectId === (resolvedSubjectId || topicSubjectId)
      })

      const subjectCategory = currentSubject?.category || t.subject?.category
      const matchesCategory = subjectCategory?.toLowerCase() === examBody.toLowerCase()

      if (!matchesCategory) return false
    }

    // Color filter (via subject color)
    if (color && color !== "all") {
      const currentSubject = (storeSubjects || []).find((subject) => {
        const subjectId = subject.subjectId || subject.id
        return subjectId === (resolvedSubjectId || topicSubjectId)
      })

      const subjectColor = currentSubject?.color || t.subject?.color
      const matchesColor = subjectColor === color
      if (!matchesColor) return false
    }

    return true
  })

  return (
    <div className="space-y-6">
      {/* Subject selector when accessed directly from sidebar */}
      {!selectedSubject && (
        <div className="flex flex-col max-w-[500px] gap-3 rounded border bg-card p-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium">Select Subject</Label>
            <Select
              value={resolvedSubjectId || ""}
              onValueChange={(value) => setLocalSelectedSubject(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a subject to view its topics" />
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
        </div>
      )}

      {/* Subject Header */}
      {resolvedSubjectName && (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{resolvedSubjectName}</h2>
            <p className="text-sm text-muted-foreground">
              Manage topics for this subject
            </p>
          </div>
        </div>
      )}

      {/* TOP BAR - Only add button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Topic
            </Button>
          </DialogTrigger>

          <DialogContent 
            className="sm:max-w-[600px] max-h-[85vh] md:mt-8 overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</DialogTitle>
              <DialogDescription>
                {editingTopic ? "Update this" : "Create a new"} topic for <span className="font-semibold text-primary">{resolvedSubjectName}</span>
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
                <TopicRichTextEditor
                  value={formData.content}
                  onChange={(html) => setFormData({ ...formData, content: html })}
                  placeholder="Write the topic content here..."
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
      </div>

      {/* TOPICS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                {globalSearch
                  ? "No topics found matching your search criteria" 
                  : `No topics found for ${resolvedSubjectName || "this subject"}.`}
              </p>
              {!globalSearch && (
                <p className="text-sm text-muted-foreground">Click "New Topic" to create your first topic.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className="group hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleViewQuestions(topic)}
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
                        {topic.subject && (
                          <Badge variant="secondary" className="text-xs">
                            {topic.subject.subjectName}
                          </Badge>
                        )}
                        {topic._count && (
                          <Badge variant="outline" className="text-xs">
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
                    <DropdownMenuContent align="end" className="z-[9999]">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleViewQuestions(topic)
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
                    handleViewQuestions(topic)
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
            <AlertDialogDescription>
              <div className="space-y-3">
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
              </div>
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
        <DialogContent 
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Topic Details
            </DialogTitle>
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
                    {viewingTopic.subject && (
                      <Badge variant="secondary">
                        {viewingTopic.subject.subjectName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Description</h4>
                <p className="text-muted-foreground">
                  {viewingTopic.description || 'No description provided'}
                </p>
              </div>

              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Content</h4>
                <div className="bg-muted/50 rounded-lg p-4 text-sm prose prose-sm max-w-none">
                  {viewingTopic.content ? (
                    <div dangerouslySetInnerHTML={{ __html: viewingTopic.content }} />
                  ) : (
                    <p className="text-muted-foreground mb-0">No content provided</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Statistics</h4>
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
          ) : null}

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
                    handleViewQuestions(viewingTopic)
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