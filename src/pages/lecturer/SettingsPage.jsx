// SettingsPage.jsx
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const EXAM_BODIES = [
  { id: "jamb", label: "JAMB" },
  { id: "waec", label: "WAEC" },
  { id: "neco", label: "NECO" },
  { id: "putme", label: "Post-UTME" },
]

const ACADEMIC_YEARS = ["2025", "2024", "2023", "2022"]

export default function SettingsPage() {
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@eduadmin.com",
    role: "Lecturer",
    bio: "Mathematics and Physics Instructor",
  })

  // Preferences state
  const [defaultExam, setDefaultExam] = useState(EXAM_BODIES[0]?.id || "")
  const [defaultYear, setDefaultYear] = useState(ACADEMIC_YEARS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Profile updated:", profileData)
    console.log("Default Exam Body:", defaultExam)
    console.log("Default Academic Year:", defaultYear)
    alert("Settings saved!")
  }

  return (
    <div className="space-y-6">
      {/* PROFILE SETTINGS */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-20 h-20 border">
                <AvatarImage src="/professional-teacher.png" alt="Profile" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Button type="button" variant="outline" size="sm">
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Input
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Bio</Label>
                <Input
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PREFERENCES */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col w-full sm:w-1/2 gap-2">
              <Label>Default Exam Body</Label>
              <Select value={defaultExam} onValueChange={setDefaultExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam Body" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_BODIES.map((body) => (
                    <SelectItem key={body.id} value={body.id}>
                      {body.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col w-full sm:w-1/2 gap-2">
              <Label>Default Academic Year</Label>
              <Select value={defaultYear} onValueChange={setDefaultYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" onClick={handleSubmit}>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
        