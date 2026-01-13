// SettingsPage.jsx
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import useTutorAuthStore from "@/store/tutorAuthStore"

const EXAM_BODIES = [
  { id: "jamb", label: "JAMB" },
  { id: "waec", label: "WAEC" },
  { id: "neco", label: "NECO" },
  { id: "putme", label: "Post-UTME" },
]

const ACADEMIC_YEARS = ["2025", "2024", "2023", "2022"]

export default function SettingsPage({ context }) {
  const { toast } = useToast()
  const tutor = useTutorAuthStore((state) => state.tutor)
  const { updateProfile, changePassword } = context
  
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  })

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Preferences state
  const [defaultExam, setDefaultExam] = useState(EXAM_BODIES[0]?.id || "")
  const [defaultYear, setDefaultYear] = useState(ACADEMIC_YEARS[0])

  // Load tutor data on mount
  useEffect(() => {
    if (tutor) {
      setProfileData({
        firstName: tutor.firstName || "",
        lastName: tutor.lastName || "",
        email: tutor.email || "",
        bio: tutor.bio || "",
      })
    }
  }, [tutor])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateProfile(profileData)
      
      if (result.success) {
        toast({
          title: "Profile Updated ✅",
          description: "Your profile has been updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All password fields are required",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setPasswordLoading(true)

    try {
      const result = await changePassword(passwordData)
      
      if (result.success) {
        toast({
          title: "Password Changed ✅",
          description: "Your password has been changed successfully",
        })
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to change password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handlePreferencesSubmit = (e) => {
    e.preventDefault()
    console.log("Default Exam Body:", defaultExam)
    console.log("Default Academic Year:", defaultYear)
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been saved",
    })
  }

  return (
    <div className="space-y-6">
      {/* PROFILE SETTINGS */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-20 h-20 border">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 text-2xl">
                  {tutor?.firstName?.[0]}{tutor?.lastName?.[0]}
                </AvatarFallback>
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
                <Label>First Name</Label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Last Name</Label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Bio</Label>
                <Input
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Short bio about yourself"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  if (tutor) {
                    setProfileData({
                      firstName: tutor.firstName || "",
                      lastName: tutor.lastName || "",
                      email: tutor.email || "",
                      bio: tutor.bio || "",
                    })
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* CHANGE PASSWORD */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
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
            <Button type="submit" onClick={handlePreferencesSubmit}>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}