import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, HelpCircle, CheckCircle2, X, Search } from "lucide-react"

// SHADCN DIALOG (React version – works fine in Vite/React)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// SHADCN SELECT (React version)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"

export default function QuestionsPanel({ context, questions, setQuestions, topics, modules, subjects, globalSearch }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const [formData, setFormData] = useState({
    text: "",
    topic: "",
    module: "",
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

  const handleSubmit = (e) => {
    e.preventDefault()

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

    // Reset
    setFormData({
      text: "",
      topic: "",
      module: "",
      subject: "",
      type: "Multiple Choice",
      explanation: "",
    })

    setAnswers([
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
    ])

    setIsDialogOpen(false)
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      text: question.text,
      topic: question.topic,
      module: question.module,
      subject: question.subject,
      type: question.type,
      explanation: question.explanation,
    })
    setAnswers(question.answers || [])
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const addAnswer = () => {
    setAnswers([...answers, { id: Date.now().toString(), text: "", isCorrect: false }])
  }

  const removeAnswer = (id) => {
    setAnswers(answers.filter((a) => a.id !== id))
  }

  const updateAnswer = (id, field, value) => {
    setAnswers(answers.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const searchTerm = globalSearch || localSearch

  const filteredQuestions = questions.filter(
    (q) =>
      q.examBody === context.examBody &&
      q.year === context.year &&
      (filterType === "all" || q.type === filterType) &&
      (searchTerm === "" || q.text.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
  {/* SEARCH + FILTER */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      <Select value={filterType} onValueChange={setFilterType} className="w-full md:w-[160px]">
        <SelectTrigger>
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
          <SelectItem value="True/False">True/False</SelectItem>
          <SelectItem value="Short Answer">Short Answer</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* ADD QUESTION BUTTON */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto flex justify-center md:justify-start">
          <Plus className="mr-2 size-4" />
          Add Question
        </Button>
      </DialogTrigger>

      {/* DIALOG BODY */}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? "Update" : "Create"} a question with answers
            </DialogDescription>
          </DialogHeader>

          {/* FORM */}
          <div className="grid gap-4 py-4">
            {/* Subject / Module / Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Module</Label>
                <Input
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* TYPE SELECT */}
            <div className="space-y-2 w-full sm:w-[300px]">
              <Label>Question Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                  <SelectItem value="True/False">True/False</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* QUESTION */}
            <div className="space-y-2">
              <Label>Question</Label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={3}
                required
              />
            </div>

            {/* ANSWERS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answers</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Answer
                </Button>
              </div>

              {answers.map((answer, index) => (
                <div key={answer.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <Input
                    placeholder={`Answer ${index + 1}`}
                    value={answer.text}
                    onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
                    required
                    className="flex-1"
                  />

                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={(e) => updateAnswer(answer.id, "isCorrect", e.target.checked)}
                    className="h-4 w-4 mt-2 sm:mt-0"
                  />

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
              ))}
            </div>

            {/* EXPLANATION */}
            <div className="space-y-2">
              <Label>Explanation</Label>
              <Textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingQuestion ? "Update" : "Create"} Question</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  {/* LIST OF QUESTIONS */}
  <div className="grid gap-4">
    {filteredQuestions.length === 0 ? (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">No questions found.</p>
        </CardContent>
      </Card>
    ) : (
      filteredQuestions.map((question) => (
        <Card key={question.id} className="group hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <div className="h-12 w-12 bg-accent/50 rounded-lg flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-accent-foreground" />
                </div>

                <div className="space-y-2 flex-1">
                  <CardTitle className="text-base">{question.text}</CardTitle>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{question.subject}</Badge>
                    <Badge variant="outline">{question.module}</Badge>
                    <Badge variant="outline">{question.topic}</Badge>
                    <Badge>{question.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* ANSWERS LIST */}
            <div>
              <p className="text-sm font-medium">Answers:</p>
              {question.answers?.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
                >
                  {a.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-border" />
                  )}
                  <span className={a.isCorrect ? "font-medium" : "text-muted-foreground"}>{a.text}</span>
                </div>
              ))}
            </div>

            {/* EXPLANATION */}
            {question.explanation && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground">Explanation:</p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t bg-muted/20 gap-2 sm:gap-0">
            <Badge variant="secondary">{question.status}</Badge>
            <span className="text-xs text-muted-foreground">
              Added to {context.examBody.toUpperCase()} {context.year}
            </span>
          </CardFooter>
        </Card>
      ))
    )}
  </div>
</div>

  )
}
