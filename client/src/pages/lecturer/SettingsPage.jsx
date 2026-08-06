// // SettingsPage.jsx
// import React, { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Loader2, Eye, EyeOff } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorAuthStore from "@/store/tutorAuthStore"

// const EXAM_BODIES = [
//   { id: "jamb", label: "JAMB" },
//   { id: "waec", label: "WAEC" },
//   { id: "neco", label: "NECO" },
//   { id: "putme", label: "Post-UTME" },
// ]

// const ACADEMIC_YEARS = ["2025", "2024", "2023", "2022"]

// export default function SettingsPage({ context }) {
//   const { toast } = useToast()
//   const tutor = useTutorAuthStore((state) => state.tutor)
//   const { updateProfile, changePassword } = context
  

//   const [loading, setLoading] = useState(false)
//   const [passwordLoading, setPasswordLoading] = useState(false)

//   // Profile state
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     bio: "",
//   })

//   // Password state
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   })

//   // Preferences state
//   const [defaultExam, setDefaultExam] = useState(EXAM_BODIES[0]?.id || "")
//   const [defaultYear, setDefaultYear] = useState(ACADEMIC_YEARS[0])

//   // Load tutor data on mount
//   useEffect(() => {
//     if (tutor) {
//       setProfileData({
//         firstName: tutor.firstName || "",
//         lastName: tutor.lastName || "",
//         email: tutor.email || "",
//         bio: tutor.bio || "",
//       })
//     }
//   }, [tutor])

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const result = await updateProfile(profileData)
      
//       if (result.success) {
//         toast({
//           title: "Profile Updated ✅",
//           description: "Your profile has been updated successfully",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to update profile",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault()

//     // Validation
//     if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
//       toast({
//         title: "Validation Error",
//         description: "All password fields are required",
//         variant: "destructive",
//       })
//       return
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast({
//         title: "Validation Error",
//         description: "New passwords do not match",
//         variant: "destructive",
//       })
//       return
//     }

//     if (passwordData.newPassword.length < 6) {
//       toast({
//         title: "Validation Error",
//         description: "Password must be at least 6 characters",
//         variant: "destructive",
//       })
//       return
//     }

//     setPasswordLoading(true)

//     try {
//       const result = await changePassword(passwordData)
      
//       if (result.success) {
//         toast({
//           title: "Password Changed ✅",
//           description: "Your password has been changed successfully",
//         })
//         // Clear password fields
//         setPasswordData({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to change password",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   const handlePreferencesSubmit = (e) => {
//     e.preventDefault()
//     console.log("Default Exam Body:", defaultExam)
//     console.log("Default Academic Year:", defaultYear)
//     toast({
//       title: "Preferences Saved",
//       description: "Your preferences have been saved",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       {/* PROFILE SETTINGS */}
//       <Card className="w-full max-w-3xl mx-auto">
//         <CardHeader>
//           <CardTitle>Profile Settings</CardTitle>
//           <CardDescription>Manage your account information</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleProfileSubmit} className="space-y-6">
//             <div className="flex flex-col sm:flex-row items-center gap-6">
//               <Avatar className="w-20 h-20 border">
//                 <AvatarImage src="/placeholder.svg" alt="Profile" />
//                 <AvatarFallback className="bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 text-2xl">
//                   {tutor?.firstName?.[0]}{tutor?.lastName?.[0]}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col items-center sm:items-start gap-2">
//                 <Button type="button" variant="outline" size="sm">
//                   Change Avatar
//                 </Button>
//                 <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
//               </div>
//             </div>

//             <Separator />

//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="flex flex-col gap-2">
//                 <Label>First Name</Label>
//                 <Input
//                   value={profileData.firstName}
//                   onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
//                   placeholder="Enter your first name"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Last Name</Label>
//                 <Input
//                   value={profileData.lastName}
//                   onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
//                   placeholder="Enter your last name"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={profileData.email}
//                   onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//                   placeholder="Enter your email"
//                   disabled
//                   className="opacity-60"
//                 />
//                 <p className="text-xs text-muted-foreground">Email cannot be changed</p>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Bio</Label>
//                 <Input
//                   value={profileData.bio}
//                   onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
//                   placeholder="Short bio about yourself"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
//               <Button 
//                 type="button" 
//                 variant="outline"
//                 onClick={() => {
//                   if (tutor) {
//                     setProfileData({
//                       firstName: tutor.firstName || "",
//                       lastName: tutor.lastName || "",
//                       email: tutor.email || "",
//                       bio: tutor.bio || "",
//                     })
//                   }
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* CHANGE PASSWORD */}
//       <Card className="w-full max-w-3xl mx-auto">
//         <CardHeader>
//           <CardTitle>Change Password</CardTitle>
//           <CardDescription>Update your password to keep your account secure</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handlePasswordSubmit} className="space-y-4">
//             <div className="flex flex-col gap-2">
//               <Label>Current Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.current ? "text" : "password"}
//                   value={passwordData.currentPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//                   placeholder="Enter current password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
//                   className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>New Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.new ? "text" : "password"}
//                   value={passwordData.newPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                   placeholder="Enter new password (min 6 characters)"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
//                   className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>Confirm New Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={passwordData.confirmPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//                   placeholder="Confirm new password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
//                   className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-end mt-4">
//               <Button type="submit" disabled={passwordLoading}>
//                 {passwordLoading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     Changing...
//                   </>
//                 ) : (
//                   "Change Password"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* PREFERENCES */}
//       <Card className="w-full max-w-3xl mx-auto">
//         <CardHeader>
//           <CardTitle>Preferences</CardTitle>
//           <CardDescription>Customize your dashboard experience</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="flex flex-col w-full sm:w-1/2 gap-2">
//               <Label>Default Exam Body</Label>
//               <Select value={defaultExam} onValueChange={setDefaultExam}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Exam Body" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {EXAM_BODIES.map((body) => (
//                     <SelectItem key={body.id} value={body.id}>
//                       {body.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex flex-col w-full sm:w-1/2 gap-2">
//               <Label>Default Academic Year</Label>
//               <Select value={defaultYear} onValueChange={setDefaultYear}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {ACADEMIC_YEARS.map((year) => (
//                     <SelectItem key={year} value={year}>
//                       {year}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <Button type="submit" onClick={handlePreferencesSubmit}>
//               Save Preferences
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }












// // SettingsPage.jsx
// import React, { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Loader2, Eye, EyeOff } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import useTutorAuthStore from "@/store/tutorAuthStore"
// import { useRef } from "react"


// const EXAM_BODIES = [
//   { id: "jamb", label: "JAMB" },
//   { id: "waec", label: "WAEC" },
//   { id: "neco", label: "NECO" },
//   { id: "putme", label: "Post-UTME" },
// ]

// const ACADEMIC_YEARS = ["2025", "2024", "2023", "2022"]

// export default function SettingsPage({ context }) {
//   const { toast } = useToast()
//   const tutor = useTutorAuthStore((state) => state.tutor)
//   const { updateProfile, changePassword } = context
//   const [avatarFile, setAvatarFile] = useState(null)
//   const [avatarPreview, setAvatarPreview] = useState(null)
//   const fileInputRef = useRef(null)

//   const [loading, setLoading] = useState(false)
//   const [passwordLoading, setPasswordLoading] = useState(false)

//   // Profile state
//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     bio: "",
//   })

//   // Password state
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   })

//   // Preferences state
//   const [defaultExam, setDefaultExam] = useState(EXAM_BODIES[0]?.id || "")
//   const [defaultYear, setDefaultYear] = useState(ACADEMIC_YEARS[0])

//   // Load tutor data on mount
//   useEffect(() => {
//     if (tutor) {
//       setProfileData({
//         firstName: tutor.firstName || "",
//         lastName: tutor.lastName || "",
//         email: tutor.email || "",
//         bio: tutor.bio || "",
//       })
//     }
//   }, [tutor])

//   // const handleProfileSubmit = async (e) => {
//   //   e.preventDefault()
//   //   setLoading(true)

//   //   try {
//   //     const result = await updateProfile(profileData)
      
//   //     if (result.success) {
//   //       toast({
//   //         title: "Profile Updated ✅",
//   //         description: "Your profile has been updated successfully",
//   //       })
//   //     } else {
//   //       toast({
//   //         title: "Error",
//   //         description: result.message || "Failed to update profile",
//   //         variant: "destructive",
//   //       })
//   //     }
//   //   } catch (error) {
//   //     toast({
//   //       title: "Error",
//   //       description: "An unexpected error occurred",
//   //       variant: "destructive",
//   //     })
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }


//   const handleProfileSubmit = async (e) => {
//   e.preventDefault()
//   setLoading(true)

//   try {
//     const form = new FormData()

//     form.append("firstName", profileData.firstName)
//     form.append("lastName", profileData.lastName)
//     form.append("bio", profileData.bio)

//     if (avatarFile) {
//       form.append("avatar", avatarFile)
//     }

//     const result = await updateProfile(form)

//     if (result.success) {
//       toast({
//         title: "Profile Updated ✅",
//         description: "Your profile has been updated successfully",
//       })
//     } else {
//       throw new Error(result.message)
//     }

//   } catch (err) {
//     toast({
//       title: "Error",
//       description: err.message || "Failed to update profile",
//       variant: "destructive",
//     })
//   } finally {
//     setLoading(false)
//   }
// }


//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault()

//     // Validation
//     if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
//       toast({
//         title: "Validation Error",
//         description: "All password fields are required",
//         variant: "destructive",
//       })
//       return
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast({
//         title: "Validation Error",
//         description: "New passwords do not match",
//         variant: "destructive",
//       })
//       return
//     }

//     if (passwordData.newPassword.length < 6) {
//       toast({
//         title: "Validation Error",
//         description: "Password must be at least 6 characters",
//         variant: "destructive",
//       })
//       return
//     }

//     setPasswordLoading(true)

//     try {
//       const result = await changePassword(passwordData)
      
//       if (result.success) {
//         toast({
//           title: "Password Changed ✅",
//           description: "Your password has been changed successfully",
//         })
//         // Clear password fields
//         setPasswordData({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to change password",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   const handlePreferencesSubmit = (e) => {
//     e.preventDefault()
//     console.log("Default Exam Body:", defaultExam)
//     console.log("Default Academic Year:", defaultYear)
//     toast({
//       title: "Preferences Saved",
//       description: "Your preferences have been saved",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       {/* PROFILE SETTINGS */}
//       <Card className="w-full max-w-3xl mx-auto">
//         <CardHeader>
//           <CardTitle>Profile Settings</CardTitle>
//           <CardDescription>Manage your account information</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleProfileSubmit} className="space-y-6">
//             <div className="flex flex-col sm:flex-row items-center gap-6">
//               <Avatar className="w-20 h-20 border">
//                <AvatarImage 
//                   src={avatarPreview || tutor?.avatar || "/placeholder.svg"} 
//                 />

//                 <AvatarFallback className="bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 text-2xl">
//                   {tutor?.firstName?.[0]}{tutor?.lastName?.[0]}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col items-center sm:items-start gap-2">
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   hidden
//                   onChange={(e) => {
//                     const file = e.target.files[0]
//                     if (!file) return

//                     setAvatarFile(file)
//                     setAvatarPreview(URL.createObjectURL(file))
//                   }}
//                 />

//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => fileInputRef.current.click()}
//                 >
//                   Change Avatar
//                 </Button>


//                 <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
//               </div>
//             </div>

//             <Separator />

//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="flex flex-col gap-2">
//                 <Label>First Name</Label>
//                 <Input
//                   value={profileData.firstName}
//                   onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
//                   placeholder="Enter your first name"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Last Name</Label>
//                 <Input
//                   value={profileData.lastName}
//                   onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
//                   placeholder="Enter your last name"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={profileData.email}
//                   onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//                   placeholder="Enter your email"
//                   disabled
//                   className="opacity-60"
//                 />
//                 <p className="text-xs text-muted-foreground">Email cannot be changed</p>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Bio</Label>
//                 <Input
//                   value={profileData.bio}
//                   onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
//                   placeholder="Short bio about yourself"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
//               <Button 
//                 type="button" 
//                 variant="outline"
//                 onClick={() => {
//                   if (tutor) {
//                     setProfileData({
//                       firstName: tutor.firstName || "",
//                       lastName: tutor.lastName || "",
//                       email: tutor.email || "",
//                       bio: tutor.bio || "",
//                     })
//                   }
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* CHANGE PASSWORD */}
//       <Card className="w-full max-w-3xl mx-auto">
//         <CardHeader>
//           <CardTitle>Change Password</CardTitle>
//           <CardDescription>Update your password to keep your account secure</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handlePasswordSubmit} className="space-y-4">
//             <div className="flex flex-col gap-2">
//               <Label>Current Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.current ? "text" : "password"}
//                   value={passwordData.currentPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//                   placeholder="Enter current password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
//                   className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>New Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.new ? "text" : "password"}
//                   value={passwordData.newPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                   placeholder="Enter new password (min 6 characters)"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
//                   className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>Confirm New Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={passwordData.confirmPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//                   placeholder="Confirm new password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
//                   className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-end mt-4">
//               <Button type="submit" disabled={passwordLoading}>
//                 {passwordLoading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     Changing...
//                   </>
//                 ) : (
//                   "Change Password"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* PREFERENCES */}
//       <Card className="w-full max-w-3xl mx-auto">
//         <CardHeader>
//           <CardTitle>Preferences</CardTitle>
//           <CardDescription>Customize your dashboard experience</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="flex flex-col w-full sm:w-1/2 gap-2">
//               <Label>Default Exam Body</Label>
//               <Select value={defaultExam} onValueChange={setDefaultExam}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Exam Body" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {EXAM_BODIES.map((body) => (
//                     <SelectItem key={body.id} value={body.id}>
//                       {body.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex flex-col w-full sm:w-1/2 gap-2">
//               <Label>Default Academic Year</Label>
//               <Select value={defaultYear} onValueChange={setDefaultYear}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {ACADEMIC_YEARS.map((year) => (
//                     <SelectItem key={year} value={year}>
//                       {year}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <Button type="submit" onClick={handlePreferencesSubmit}>
//               Save Preferences
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }









import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Eye, EyeOff, Upload, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import useTutorAuthStore from "@/store/tutorAuthStore"
import { useRef } from "react"

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
  
  // Get methods from useTutorAuthStore instead of useTutorStore
  const uploadAvatar = useTutorAuthStore((state) => state.uploadAvatar)
  const deleteAvatar = useTutorAuthStore((state) => state.deleteAvatar)
  
  const { updateProfile, changePassword } = context
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)

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

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast({
        title: "No file selected",
        description: "Please select an image first",
        variant: "destructive",
      })
      return
    }

    setAvatarLoading(true)

    try {
      const formData = new FormData()
      formData.append("avatar", avatarFile)

      console.log("📤 Uploading avatar...", avatarFile)

      const result = await uploadAvatar(formData)

      console.log("📥 Upload result:", result)

      if (result.success) {
        toast({
          title: "Avatar Updated ✅",
          description: "Your profile picture has been updated successfully",
        })
        setAvatarFile(null)
        setAvatarPreview(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to upload avatar",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Avatar upload error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setAvatarLoading(false)
    }
  }

  // Handle avatar delete
  const handleAvatarDelete = async () => {
    if (!tutor?.avatar) {
      toast({
        title: "No avatar",
        description: "You don't have a profile picture to delete",
        variant: "destructive",
      })
      return
    }

    setAvatarLoading(true)

    try {
      console.log("🗑️ Deleting avatar...")

      const result = await deleteAvatar()

      console.log("📥 Delete result:", result)

      if (result.success) {
        toast({
          title: "Avatar Deleted ✅",
          description: "Your profile picture has been removed",
        })
        setAvatarPreview(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete avatar",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Avatar delete error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
      }

      const result = await updateProfile(payload)

      if (result.success) {
        toast({
          title: "Profile Updated ✅",
          description: "Your profile has been updated successfully",
        })
      } else {
        throw new Error(result.message)
      }

    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
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
    <div className="space-y-6 pb-8">
      {/* PROFILE SETTINGS */}
      <Card className="w-full max-w-4xl mx-auto border-primary-hovertext-primary shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-hovertext-primaryto-primary-hovertext-primary border-b border-primary-hovertext-primary">
          <CardTitle className="text-primary text-3xl">Profile Settings</CardTitle>
          <CardDescription className="text-primary">Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            {/* AVATAR SECTION */}
            <div className="flex flex-col items-center gap-6 p-6 bg-primary-hovertext-primaryrounded-xl border border-primary-hovertext-primary">
              <Avatar className="w-24 h-24 border-4 border-primary-hovertext-primary shadow-lg">
                <AvatarImage
                  src={avatarPreview || tutor?.avatar || "/placeholder.svg"}
                />
                <AvatarFallback className="bg-primary-hovertext-primary text-white text-3xl font-bold">
                  {tutor?.firstName?.[0]}{tutor?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              
              <div className="flex flex-col items-center gap-3 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (!file) return

                    // Validate file size (2MB)
                    if (file.size > 2 * 1024 * 1024) {
                      toast({
                        title: "File too large",
                        description: "Please select an image smaller than 2MB",
                        variant: "destructive",
                      })
                      return
                    }

                    setAvatarFile(file)
                    setAvatarPreview(URL.createObjectURL(file))
                  }}
                />

                <div className="flex gap-2 flex-wrap justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                    className="border-primary-hovertext-primary text-primary hover:bg-primary-hovertext-primary"
                    disabled={avatarLoading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>

                  {avatarFile && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAvatarUpload}
                      disabled={avatarLoading}
                      className="bg-primary-hover text-white hover:bg-primary-hovertext-primary"
                    >
                      {avatarLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Avatar
                        </>
                      )}
                    </Button>
                  )}

                  {tutor?.avatar && !avatarFile && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleAvatarDelete}
                      disabled={avatarLoading}
                    >
                      {avatarLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Avatar
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-xs text-primary text-center">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-primary">First Name</Label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                  className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-primary">Last Name</Label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                  className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-primary">Email</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                  disabled
                  className="opacity-60 bg-gray-50"
                />
                <p className="text-xs text-primary">Email cannot be changed</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-primary">Bio</Label>
                <Input
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Short bio about yourself"
                  className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary"
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
                className="border-primary-hovertext-primary text-primary hover:bg-primary-hovertext-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="bg-primary text-white hover:bg-primary/90 shadow-sm"
              >
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

      {/* CHANGE PASSWORD - keeping the same */}
      <Card className="w-full max-w-4xl mx-auto border-primary-hovertext-primary shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-hovertext-primaryto-primary-hovertext-primary border-b border-primary-hovertext-primary">
          <CardTitle className="text-primary text-2xl">Change Password</CardTitle>
          <CardDescription className="text-primary">Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-primary">Current Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-3 text-primary hover:text-primary"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-primary">New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-3 text-primary hover:text-primary"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Use at least 8 characters and include uppercase, lowercase, and a number.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-primary">Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-3 text-primary hover:text-primary"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Re-enter the same password to confirm it.</p>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="default"
                disabled={passwordLoading}
                className="bg-primary text-white hover:bg-primary/90 shadow-sm"
              >
                {passwordLoading ? (
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

      {/* PREFERENCES - keeping the same */}
      <Card className="w-full max-w-4xl mx-auto border-primary-hovertext-primary shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-hovertext-primaryto-primary-hovertext-primary border-b border-primary-hovertext-primary">
          <CardTitle className="text-primary text-2xl">Preferences</CardTitle>
          <CardDescription className="text-primary">Customize your dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col w-full sm:w-1/2 gap-2">
              <Label className="text-primary">Default Exam Body</Label>
              <Select value={defaultExam} onValueChange={setDefaultExam}>
                <SelectTrigger className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary">
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
              <Label className="text-primary">Default Academic Year</Label>
              <Select value={defaultYear} onValueChange={setDefaultYear}>
                <SelectTrigger className="border-primary-hovertext-primary focus:ring-primary-hovertext-primary">
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
            <Button type="submit" onClick={handlePreferencesSubmit} className="bg-primary-hovertext-primary hover:bg-primary-hovertext-primary">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}