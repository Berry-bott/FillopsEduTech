// import { useState, useEffect } from "react";
// import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
// import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import  useAdminStore  from "@/store/adminStore";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { Search, Activity, Shield, UserCog, Users, Loader2 } from "lucide-react";

// export default function ActivityPage() {
//   const { fetchDashboard, dashboard, loading } = useAdminStore();

//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [dateFilter, setDateFilter] = useState("all");
  

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const activityLogs = dashboard?.recentActivity ?? [];

//   const filteredLogs = activityLogs.filter((log) => {
//     const name = log.userName ?? log.user ?? "";
//     const action = log.action ?? "";
//     const target = log.target ?? "";

//     const matchesSearch =
//       name.toLowerCase().includes(search.toLowerCase()) ||
//       action.toLowerCase().includes(search.toLowerCase()) ||
//       target.toLowerCase().includes(search.toLowerCase());

//     const matchesRole = roleFilter === "all" || log.userRole === roleFilter;

//     let matchesDate = true;
//     if (dateFilter !== "all") {
//       const now = new Date();
//       const logDate = new Date(log.createdAt);
//       if (dateFilter === "today") {
//         matchesDate = logDate.toDateString() === now.toDateString();
//       } else if (dateFilter === "week") {
//         matchesDate = logDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       } else if (dateFilter === "month") {
//         matchesDate = logDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       }
//     }

//     return matchesSearch && matchesRole && matchesDate;
//   });

//   const superAdminLogs = activityLogs.filter((l) => l.userRole === "super_admin").length;
//   const adminLogs = activityLogs.filter((l) => l.userRole === "admin").length;
//   const userLogs = activityLogs.filter((l) => l.userRole === "user").length;

//   if (loading && !dashboard) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Sidebar />
//         <main className="pl-64 p-6 space-y-6">
//           <div className="grid gap-4 md:grid-cols-4">
//             {[1, 2, 3, 4].map((i) => (
//               <Card key={i}><CardContent className="h-20 animate-pulse bg-muted rounded-lg" /></Card>
//             ))}
//           </div>
//           <Card>
//             <CardContent className="p-6 space-y-3">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="h-10 w-full animate-pulse bg-muted rounded-lg" />
//               ))}
//             </CardContent>
//           </Card>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
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

//           {/* Table */}
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
//                       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                       .map((log) => {
//                         const name = log.userName ?? log.user ?? "Unknown";
//                         const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
//                         return (
//                           <TableRow key={log.id}>
//                             <TableCell>
//                               <div className="flex items-center gap-3">
//                                 <div className={cn(
//                                   "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
//                                   log.userRole === "super_admin" && "bg-primary/10 text-primary",
//                                   log.userRole === "admin" && "bg-amber-500/10 text-amber-600",
//                                   log.userRole === "user" && "bg-emerald-500/10 text-emerald-600",
//                                   !log.userRole && "bg-muted text-muted-foreground"
//                                 )}>
//                                   {initials}
//                                 </div>
//                                 <span className="font-medium text-foreground">{name}</span>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={cn(
//                                 log.userRole === "super_admin" && "border-primary bg-primary/10 text-primary",
//                                 log.userRole === "admin" && "border-amber-500 bg-amber-500/10 text-amber-600",
//                                 log.userRole === "user" && "border-emerald-500 bg-emerald-500/10 text-emerald-600",
//                               )}>
//                                 {log.userRole === "super_admin" ? "Super Admin" : log.userRole === "admin" ? "Admin" : "User"}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-foreground">{log.action}</TableCell>
//                             <TableCell className="text-muted-foreground">{log.target || "-"}</TableCell>
//                             <TableCell className="text-muted-foreground">
//                               {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
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
//   );
// }







import { useState, useEffect } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAdminStore from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Search, Activity, Shield, UserCog, Users,
  BookOpen, Layers, RefreshCw, Eye,
} from "lucide-react";

// ─── Tab nav config ───────────────────────────────────────────────────────────
const TABS = [
  { id: "activity", label: "Activity Logs", icon: Activity },
  { id: "subjects", label: "Subjects",      icon: BookOpen  },
  { id: "topics",   label: "Topics",        icon: Layers    },
];

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonRows({ cols = 5, rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, label }) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 text-muted-foreground">{label}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  ACTIVITY VIEW
// ═════════════════════════════════════════════════════════════════════════════
function ActivityView({ dashboard, loading }) {
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const activityLogs = dashboard?.recentActivity ?? [];

  const filteredLogs = activityLogs.filter((log) => {
    const name   = log.userName ?? log.user ?? "";
    const action = log.action   ?? "";
    const target = log.target   ?? "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase())   ||
      action.toLowerCase().includes(search.toLowerCase()) ||
      target.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || log.userRole === roleFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const now     = new Date();
      const logDate = new Date(log.createdAt);
      if (dateFilter === "today") {
        matchesDate = logDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        matchesDate = logDate >= new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
      } else if (dateFilter === "month") {
        matchesDate = logDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    }

    return matchesSearch && matchesRole && matchesDate;
  });

  const superAdminLogs = activityLogs.filter((l) => l.userRole === "super_admin").length;
  const adminLogs      = activityLogs.filter((l) => l.userRole === "admin").length;
  const userLogs       = activityLogs.filter((l) => l.userRole === "user").length;

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3"><Activity className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold text-foreground">{activityLogs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3"><Shield className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Super Admin</p>
              <p className="text-2xl font-bold text-primary">{superAdminLogs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-500/10 p-3"><UserCog className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Actions</p>
              <p className="text-2xl font-bold text-amber-600">{adminLogs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-3"><Users className="h-5 w-5 text-emerald-600" /></div>
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
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by date" /></SelectTrigger>
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
          {loading && !activityLogs.length ? (
            <SkeletonRows />
          ) : filteredLogs.length > 0 ? (
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
                {[...filteredLogs]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((log) => {
                    const name     = log.userName ?? log.user ?? "Unknown";
                    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                              log.userRole === "super_admin" && "bg-primary/10 text-primary",
                              log.userRole === "admin"       && "bg-amber-500/10 text-amber-600",
                              log.userRole === "user"        && "bg-emerald-500/10 text-emerald-600",
                              !log.userRole                  && "bg-muted text-muted-foreground",
                            )}>
                              {initials}
                            </div>
                            <span className="font-medium text-foreground">{name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            log.userRole === "super_admin" && "border-primary bg-primary/10 text-primary",
                            log.userRole === "admin"       && "border-amber-500 bg-amber-500/10 text-amber-600",
                            log.userRole === "user"        && "border-emerald-500 bg-emerald-500/10 text-emerald-600",
                          )}>
                            {log.userRole === "super_admin" ? "Super Admin"
                              : log.userRole === "admin" ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.target || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={Activity} label="No activity logs found" />
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  SUBJECTS VIEW
// ═════════════════════════════════════════════════════════════════════════════
function SubjectsView({ subjects, topics, loading, onRefresh, onViewTopics }) {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const subjectList = subjects ?? [];
  const topicList   = topics   ?? [];

  const filteredSubjects = subjectList.filter((s) => {
    const name = s.name ?? s.title ?? "";
    const desc = s.description ?? "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount   = subjectList.filter((s) => s.status === "active"   || !s.status).length;
  const inactiveCount = subjectList.filter((s) => s.status === "inactive").length;

  // Count topics per subject
  const topicsForSubject = (subjectId) =>
    topicList.filter((t) => t.subjectId === subjectId || t.subject === subjectId).length;

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3"><BookOpen className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="text-2xl font-bold text-foreground">{subjectList.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-3"><BookOpen className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-red-500/10 p-3"><BookOpen className="h-5 w-5 text-red-500" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-red-500">{inactiveCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-500/10 p-3"><Layers className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Topics</p>
              <p className="text-2xl font-bold text-amber-600">{topicList.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subjects ({filteredSubjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !subjectList.length ? (
            <SkeletonRows />
          ) : filteredSubjects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Topics</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject) => {
                  const name     = subject.name ?? subject.title ?? "Untitled";
                  const initials = name.slice(0, 2).toUpperCase();
                  const count    = topicsForSubject(subject.id ?? subject._id);
                  const isActive = !subject.status || subject.status === "active";

                  return (
                    <TableRow key={subject.id ?? subject._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {initials}
                          </div>
                          <span className="font-medium text-foreground">{name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-muted-foreground">
                        {subject.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <Layers className="h-3 w-3" /> {count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            isActive
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                              : "border-red-500 bg-red-500/10 text-red-500",
                          )}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {subject.createdAt
                          ? format(new Date(subject.createdAt), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewTopics(subject.id ?? subject._id)}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" /> Topics
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={BookOpen} label="No subjects found" />
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  TOPICS VIEW
// ═════════════════════════════════════════════════════════════════════════════
function TopicsView({ topics, subjects, loading, onRefresh, subjectFilter: initialSubjectFilter }) {
  const [search, setSearch]                   = useState("");
  const [subjectFilter, setSubjectFilter]     = useState(initialSubjectFilter ?? "all");

  const topicList   = topics   ?? [];
  const subjectList = subjects ?? [];

  // Keep filter in sync if parent passes a pre-selected subject (e.g. from "View Topics" btn)
  useEffect(() => {
    if (initialSubjectFilter) setSubjectFilter(initialSubjectFilter);
  }, [initialSubjectFilter]);

  const filteredTopics = topicList.filter((t) => {
    const name = t.name ?? t.title ?? "";
    const desc = t.description ?? "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" ||
      t.subjectId === subjectFilter ||
      t.subject   === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjectName = (id) => {
    if (id === "all") return "All Subjects";
    const s = subjectList.find((s) => (s.id ?? s._id) === id);
    return s ? (s.name ?? s.title) : id;
  };

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3"><Layers className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Topics</p>
              <p className="text-2xl font-bold text-foreground">{topicList.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-500/10 p-3"><BookOpen className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-2xl font-bold text-amber-600">{subjectList.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-3"><Layers className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Filtered</p>
              <p className="text-2xl font-bold text-emerald-600">{filteredTopics.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by subject" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjectList.map((s) => (
              <SelectItem key={s.id ?? s._id} value={s.id ?? s._id}>
                {s.name ?? s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Topics ({filteredTopics.length})
              {subjectFilter !== "all" && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  — {subjectName(subjectFilter)}
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !topicList.length ? (
            <SkeletonRows />
          ) : filteredTopics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTopics.map((topic) => {
                  const name     = topic.name ?? topic.title ?? "Untitled";
                  const initials = name.slice(0, 2).toUpperCase();
                  const subj     = subjectList.find(
                    (s) => (s.id ?? s._id) === (topic.subjectId ?? topic.subject),
                  );
                  const subjName = subj ? (subj.name ?? subj.title) : topic.subjectId ?? "-";
                  const isActive = !topic.status || topic.status === "active";

                  return (
                    <TableRow key={topic.id ?? topic._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-xs font-medium text-amber-600">
                            {initials}
                          </div>
                          <span className="font-medium text-foreground">{name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary bg-primary/10 text-primary">
                          {subjName}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-muted-foreground">
                        {topic.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            isActive
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                              : "border-red-500 bg-red-500/10 text-red-500",
                          )}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {topic.createdAt
                          ? format(new Date(topic.createdAt), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={Layers} label="No topics found" />
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function ActivityPage() {
  const { fetchDashboard, fetchSubjects, fetchTopics, dashboard, subjects, topics, loading } =
    useAdminStore();

  const [activeTab, setActiveTab]               = useState("activity");
  const [topicSubjectFilter, setTopicSubjectFilter] = useState("all");

  // Load data when tabs are first visited
  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    if (activeTab === "subjects" || activeTab === "topics") {
      fetchSubjects();
      fetchTopics();
    }
  }, [activeTab]);

  // "View Topics" button in Subjects tab → jump to Topics filtered by that subject
  const handleViewTopics = (subjectId) => {
    setTopicSubjectFilter(subjectId);
    setActiveTab("topics");
  };

  const headerMeta = {
    activity: { title: "Activity Logs",    description: "Monitor all system activity and actions" },
    subjects: { title: "Subjects",         description: "Browse and manage all subjects"           },
    topics:   { title: "Topics",           description: "Browse and manage all topics"              },
  };

  if (loading && !dashboard && activeTab === "activity") {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64 p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="h-20 animate-pulse bg-muted rounded-lg" /></Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6"><SkeletonRows /></CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header
          title={headerMeta[activeTab].title}
          description={headerMeta[activeTab].description}
        />

        <div className="p-6">
          {/* ── Tab Navigation ─────────────────────────────────────────────── */}
          <div className="mb-6 flex items-center gap-1 rounded-lg border bg-muted/40 p-1 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  activeTab === id
                    ? "shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* ── View Switcher ──────────────────────────────────────────────── */}
          {activeTab === "activity" && (
            <ActivityView dashboard={dashboard} loading={loading} />
          )}
          {activeTab === "subjects" && (
            <SubjectsView
              subjects={subjects}
              topics={topics}
              loading={loading}
              onRefresh={() => { fetchSubjects(); fetchTopics(); }}
              onViewTopics={handleViewTopics}
            />
          )}
          {activeTab === "topics" && (
            <TopicsView
              topics={topics}
              subjects={subjects}
              loading={loading}
              onRefresh={fetchTopics}
              subjectFilter={topicSubjectFilter}
            />
          )}
        </div>
      </main>
    </div>
  );
}