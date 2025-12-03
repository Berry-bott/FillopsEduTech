
// import { useState, useEffect } from "react"
// import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar"
// import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useAppStore } from "../../components/DashboardComponents/admin/store"
// import { cn } from "@/lib/utils"
// import { format } from "date-fns"
// import { Search, Activity, Shield, UserCog, Users } from "lucide-react"

// export default function ActivityPage() {
//   const activityLogs = useAppStore((state) => state.activityLogs)

//   const [search, setSearch] = useState("")
//   const [roleFilter, setRoleFilter] = useState("all")
//   const [dateFilter, setDateFilter] = useState("all")
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500) // fake loading for animation
//     return () => clearTimeout(timer)
//   }, [])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background animate-fadeIn">
//         <Sidebar />

//         <main className="pl-64 p-6 space-y-6">
//           <div className="h-10 w-48 bg-muted rounded-md animate-pulse" />

//           {/* Skeleton Stats */}
//           <div className="grid gap-4 md:grid-cols-4">
//             {[1, 2, 3, 4].map((i) => (
//               <Card key={i} className="animate-pulse">
//                 <CardContent className="h-20 bg-muted/50 rounded-md" />
//               </Card>
//             ))}
//           </div>

//           {/* Skeleton table */}
//           <Card className="animate-pulse">
//             <CardHeader>
//               <div className="h-6 w-40 bg-muted rounded-md" />
//             </CardHeader>
//             <CardContent>
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="h-10 w-full bg-muted rounded-md mb-3"
//                 />
//               ))}
//             </CardContent>
//           </Card>
//         </main>
//       </div>
//     )
//   }

//   // ---- AFTER LOADING: Your original full UI ----

//   const filteredLogs = activityLogs.filter((log) => {
//     const matchesSearch =
//       log.userName.toLowerCase().includes(search.toLowerCase()) ||
//       log.action.toLowerCase().includes(search.toLowerCase()) ||
//       (log.target?.toLowerCase().includes(search.toLowerCase()) ?? false)

//     const matchesRole = roleFilter === "all" || log.userRole === roleFilter

//     let matchesDate = true
//     if (dateFilter !== "all") {
//       const now = new Date()
//       const logDate = log.createdAt

//       if (dateFilter === "today") {
//         matchesDate = logDate.toDateString() === now.toDateString()
//       } else if (dateFilter === "week") {
//         const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//         matchesDate = logDate >= weekAgo
//       } else if (dateFilter === "month") {
//         const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
//         matchesDate = logDate >= monthAgo
//       }
//     }

//     return matchesSearch && matchesRole && matchesDate
//   })

//   const superAdminLogs = activityLogs.filter((l) => l.userRole === "super_admin").length
//   const adminLogs = activityLogs.filter((l) => l.userRole === "admin").length
//   const userLogs = activityLogs.filter((l) => l.userRole === "user").length

//   return (
//     <div className="min-h-screen bg-background animate-fadeIn">
//       <Sidebar />

//       <main className="pl-64">
//         <Header title="Activity Logs" description="Monitor all system activity and actions" />

//         <div className="p-6">

//           {/* Stats */}
//           <div className="mb-6 grid gap-4 md:grid-cols-4">
//             <Card>
//               <CardContent className="flex items-center gap-4 p-4">
//                 <div className="rounded-lg bg-primary/10 p-3">
//                   <Activity className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Logs</p>
//                   <p className="text-2xl font-bold text-foreground">{activityLogs.length}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center gap-4 p-4">
//                 <div className="rounded-lg bg-primary/10 p-3">
//                   <Shield className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Super Admin</p>
//                   <p className="text-2xl font-bold text-primary">{superAdminLogs}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center gap-4 p-4">
//                 <div className="rounded-lg bg-amber-500/10 p-3">
//                   <UserCog className="h-5 w-5 text-amber-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Admin Actions</p>
//                   <p className="text-2xl font-bold text-amber-600">{adminLogs}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center gap-4 p-4">
//                 <div className="rounded-lg bg-emerald-500/10 p-3">
//                   <Users className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">User Actions</p>
//                   <p className="text-2xl font-bold text-emerald-600">{userLogs}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Filters */}
//           <div className="mb-6 flex items-center gap-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search activity..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             <Select value={roleFilter} onValueChange={setRoleFilter}>
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Filter by role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Roles</SelectItem>
//                 <SelectItem value="super_admin">Super Admin</SelectItem>
//                 <SelectItem value="admin">Admin</SelectItem>
//                 <SelectItem value="user">User</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={dateFilter} onValueChange={setDateFilter}>
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Filter by date" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Time</SelectItem>
//                 <SelectItem value="today">Today</SelectItem>
//                 <SelectItem value="week">This Week</SelectItem>
//                 <SelectItem value="month">This Month</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Logs Table */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Activity Log ({filteredLogs.length})</CardTitle>
//             </CardHeader>

//             <CardContent>
//               {filteredLogs.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>User</TableHead>
//                       <TableHead>Role</TableHead>
//                       <TableHead>Action</TableHead>
//                       <TableHead>Target</TableHead>
//                       <TableHead>Date & Time</TableHead>
//                     </TableRow>
//                   </TableHeader>

//                   <TableBody>
//                     {filteredLogs
//                       .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//                       .map((log) => (
//                         <TableRow key={log.id}>
//                           <TableCell>
//                             <div className="flex items-center gap-3">
//                               <div
//                                 className={cn(
//                                   "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
//                                   log.userRole === "super_admin" && "bg-primary/10 text-primary",
//                                   log.userRole === "admin" && "bg-amber-500/10 text-amber-600",
//                                   log.userRole === "user" && "bg-emerald-500/10 text-emerald-600",
//                                 )}
//                               >
//                                 {log.userName
//                                   .split(" ")
//                                   .map((n) => n[0])
//                                   .join("")
//                                   .toUpperCase()}
//                               </div>
//                               <span className="font-medium text-foreground">{log.userName}</span>
//                             </div>
//                           </TableCell>

//                           <TableCell>
//                             <Badge
//                               variant="outline"
//                               className={cn(
//                                 log.userRole === "super_admin" &&
//                                   "border-primary bg-primary/10 text-primary",
//                                 log.userRole === "admin" &&
//                                   "border-amber-500 bg-amber-500/10 text-amber-600",
//                                 log.userRole === "user" &&
//                                   "border-emerald-500 bg-emerald-500/10 text-emerald-600",
//                               )}
//                             >
//                               {log.userRole === "super_admin"
//                                 ? "Super Admin"
//                                 : log.userRole === "admin"
//                                   ? "Admin"
//                                   : "User"}
//                             </Badge>
//                           </TableCell>

//                           <TableCell className="text-foreground">{log.action}</TableCell>
//                           <TableCell className="text-muted-foreground">{log.target || "-"}</TableCell>

//                           <TableCell className="text-muted-foreground">
//                             {format(log.createdAt, "MMM d, yyyy 'at' h:mm a")}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <div className="py-12 text-center">
//                   <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
//                   <p className="mt-4 text-muted-foreground">No activity logs found</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }


import { useState, useEffect } from "react"
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar"
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppStore } from "../../components/DashboardComponents/admin/store"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Search, Activity, Shield, UserCog, Users } from "lucide-react"

export default function ActivityPage() {
  const activityLogs = useAppStore((state) => state.activityLogs)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // ------------------ LOADING UI ------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-background animate-fadeIn">
        <Sidebar />

        <main className="pl-64 p-6 space-y-6">

          {/* Page Title Skeleton */}
          <div className="h-10 w-48 skeleton" />

          {/* Stats Skeleton */}
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="h-20 skeleton" />
              </Card>
            ))}
          </div>

          {/* Table Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-40 skeleton" />
            </CardHeader>
            <CardContent>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-full skeleton mb-3" />
              ))}
            </CardContent>
          </Card>

        </main>
      </div>
    )
  }
  // ------------------------------------------------

  // ---- REAL CONTENT BELOW (unchanged) ----
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.target?.toLowerCase().includes(search.toLowerCase()) ?? false)

    const matchesRole = roleFilter === "all" || log.userRole === roleFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const now = new Date()
      const logDate = log.createdAt

      if (dateFilter === "today") {
        matchesDate = logDate.toDateString() === now.toDateString()
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = logDate >= weekAgo
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = logDate >= monthAgo
      }
    }

    return matchesSearch && matchesRole && matchesDate
  })

  const superAdminLogs = activityLogs.filter((l) => l.userRole === "super_admin").length
  const adminLogs = activityLogs.filter((l) => l.userRole === "admin").length
  const userLogs = activityLogs.filter((l) => l.userRole === "user").length

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <Header title="Activity Logs" description="Monitor all system activity and actions" />

        <div className="p-6">

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-bold text-foreground">{activityLogs.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Super Admin</p>
                  <p className="text-2xl font-bold text-primary">{superAdminLogs}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-amber-500/10 p-3">
                  <UserCog className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admin Actions</p>
                  <p className="text-2xl font-bold text-amber-600">{adminLogs}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Actions</p>
                  <p className="text-2xl font-bold text-emerald-600">{userLogs}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Log ({filteredLogs.length})</CardTitle>
            </CardHeader>

            <CardContent>
              {filteredLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredLogs
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                                  log.userRole === "super_admin" && "bg-primary/10 text-primary",
                                  log.userRole === "admin" && "bg-amber-500/10 text-amber-600",
                                  log.userRole === "user" && "bg-emerald-500/10 text-emerald-600",
                                )}
                              >
                                {log.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <span className="font-medium text-foreground">{log.userName}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                log.userRole === "super_admin" &&
                                  "border-primary bg-primary/10 text-primary",
                                log.userRole === "admin" &&
                                  "border-amber-500 bg-amber-500/10 text-amber-600",
                                log.userRole === "user" &&
                                  "border-emerald-500 bg-emerald-500/10 text-emerald-600",
                              )}
                            >
                              {log.userRole === "super_admin"
                                ? "Super Admin"
                                : log.userRole === "admin"
                                  ? "Admin"
                                  : "User"}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-foreground">{log.action}</TableCell>
                          <TableCell className="text-muted-foreground">{log.target || "-"}</TableCell>

                          <TableCell className="text-muted-foreground">
                            {format(log.createdAt, "MMM d, yyyy 'at' h:mm a")}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No activity logs found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
