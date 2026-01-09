import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, FileText, Upload, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function TopicsPanel({ context, topics, setTopics, modules, subjects, globalSearch }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    module: "",
    subject: "",
    description: "",
    content: "",
  })

  const [localSearch, setLocalSearch] = useState("")
  const [filterModule, setFilterModule] = useState("all")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingTopic) {
      setTopics(
        topics.map((t) =>
          t.id === editingTopic.id
            ? { ...t, ...formData, examBody: context.examBody, year: context.year }
            : t
        )
      )
      setEditingTopic(null)
    } else {
      const newTopic = {
        id: Date.now().toString(),
        ...formData,
        questions: 0,
        hasAttachment: false,
        examBody: context.examBody,
        year: context.year,
      }
      setTopics([...topics, newTopic])
    }

    setFormData({ name: "", module: "", subject: "", description: "", content: "" })
    setIsDialogOpen(false)
  }

  const handleEdit = (topic) => {
    setEditingTopic(topic)
    setFormData({
      name: topic.name,
      module: topic.module,
      subject: topic.subject,
      description: topic.description,
      content: topic.content,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setTopics(topics.filter((t) => t.id !== id))
  }

  const searchTerm = globalSearch || localSearch

  const contextModules = modules.filter(
    (m) => m.examBody === context.examBody && m.year === context.year
  )

  const filteredTopics = topics.filter(
    (t) =>
      t.examBody === context.examBody &&
      t.year === context.year &&
      (filterModule === "all" || t.module === filterModule) &&
      (searchTerm === "" || t.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* SEARCH + FILTER + ADD BUTTON */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              className="pl-9 bg-background"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* FILTER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setFilterModule("all")}>
                All Modules
              </DropdownMenuItem>
              {contextModules.map((module) => (
                <DropdownMenuItem
                  key={module.id}
                  onClick={() => setFilterModule(module.name)}
                >
                  {module.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ADD TOPIC DIALOG */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingTopic(null)
              setFormData({
                name: "",
                module: "",
                subject: "",
                description: "",
                content: "",
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</DialogTitle>
                <DialogDescription>
                  {editingTopic ? "Update" : "Create"} a topic within a module
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* TOPIC NAME */}
                <div className="space-y-2">
                  <Label>Topic Name</Label>
                  <Input
                    placeholder="e.g., Linear Equations"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* SUBJECT + MODULE */}
                <div className="grid grid-cols-2 gap-4">
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
                    <Label>Module</Label>
                    <Input
                      placeholder="e.g., Algebra"
                      value={formData.module}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input
                    placeholder="Brief summary of the topic..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                {/* CONTENT */}
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Detailed content..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                {/* ATTACHMENT */}
                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="file" className="flex-1" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTopic ? "Update" : "Create"} Topic
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TOPICS LIST */}
      <div className="grid gap-4">
        {filteredTopics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">No topics found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTopics.map((topic) => (
            <Card key={topic.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg">{topic.name}</CardTitle>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{topic.subject}</Badge>
                        <Badge variant="outline" className="text-xs">{topic.module}</Badge>

                        {topic.hasAttachment && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Upload className="h-3 w-3" /> Has files
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* EDIT / DELETE BUTTONS */}
                  <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(topic)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(topic.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>

                <div className="text-sm">
                  <span className="text-muted-foreground">Questions:</span>{" "}
                  <span className="font-medium">{topic.questions || 0}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}







