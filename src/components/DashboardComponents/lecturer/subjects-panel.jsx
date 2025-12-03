import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MoreVertical, Layers, FileText, Search, Pencil, BookOpen, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SubjectsPanel({ context, subjects, setSubjects, globalSearch }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({ name: "", code: "", color: "bg-blue-500" })
  const [localSearch, setLocalSearch] = useState("")
  const [filterColor, setFilterColor] = useState("all")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingSubject) {
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id
            ? { ...s, ...formData, examBody: context.examBody, year: context.year }
            : s
        )
      )
      setEditingSubject(null)
    } else {
      const newSubject = {
        id: Date.now().toString(),
        ...formData,
        modules: 0,
        topics: 0,
        examBody: context.examBody,
        year: context.year,
      }
      setSubjects([...subjects, newSubject])
    }

    setFormData({ name: "", code: "", color: "bg-blue-500" })
    setIsDialogOpen(false)
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({ name: subject.name, code: subject.code, color: subject.color })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  const searchTerm = globalSearch || localSearch

  const filteredSubjects = subjects.filter(
    (s) =>
      s.examBody === context.examBody &&
      s.year === context.year &&
      (filterColor === "all" || s.color === filterColor) &&
      (searchTerm === "" ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              className="pl-9 bg-background"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterColor("all")}>All Colors</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterColor("bg-blue-500")}>Blue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterColor("bg-emerald-500")}>Green</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterColor("bg-purple-500")}>Purple</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterColor("bg-amber-500")}>Amber</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterColor("bg-red-500")}>Red</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterColor("bg-pink-500")}>Pink</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ADD SUBJECT DIALOG */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingSubject(null)
              setFormData({ name: "", code: "", color: "bg-blue-500" })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4 dark:text-white" />
              <span className="text-white">
              Add Subject
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                <DialogDescription>
                  {editingSubject ? "Update" : "Create"} a subject for {context.examBody.toUpperCase()} {context.year}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mathematics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., MTH"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="color">Color Theme</Label>
                  <select
                    id="color"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-emerald-500">Green</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-amber-500">Amber</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-pink-500">Pink</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingSubject ? "Update" : "Create"} Subject</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SUBJECT CARDS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSubjects.map((subject) => (
          <Card
            key={subject.id}
            className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 border-border"
          >
            <div className={`h-1.5 w-full ${subject.color}`} />

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {subject.code}
                  </Badge>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(subject)}>
                      <Pencil className="size-4 mr-2" />
                      Edit Subject
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(subject.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Layers className="size-3" /> Modules
                  </span>
                  <span className="font-semibold">{subject.modules || 0}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <FileText className="size-3" /> Topics
                  </span>
                  <span className="font-semibold">{subject.topics || 0}</span>
                </div>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="bg-secondary/30 py-3">
              <div className="text-xs text-muted-foreground">
                {context.examBody.toUpperCase()} Syllabus • {context.year}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredSubjects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No subjects found. Create your first subject to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
