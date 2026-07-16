

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import UserTable from "@/components/DashboardComponents/admin/adminComponents/dashboard/user-table";
import EditUserModal from "@/components/DashboardComponents/admin/adminComponents/modal/edit-user-modal";
import ViewUserModal from "@/components/DashboardComponents/admin/adminComponents/modal/view-user-modal";
import DeleteConfirmModal from "@/components/DashboardComponents/admin/adminComponents/modal/delete-confirm-modal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAdminStore } from "@/store/adminStore";
import { Search, Users, UserCheck, UserX, Clock } from "lucide-react";

// ─── SKELETON COMPONENTS ──────────────────────────────────────────────────────

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="rounded-lg bg-gray-200 p-3 h-11 w-11 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          <div className="h-8 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function PendingUserSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-20 rounded bg-gray-200 animate-pulse" />
        <div className="h-9 w-20 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

function FilterBarSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="h-10 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-10 w-40 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-9 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-9 w-16 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const navigate = useNavigate();

  const {
    users,
    fetchUsers,
    fetchUser,
    loading,
    error,
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Force skeleton every time page is visited
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Show skeleton for at least 600ms on every visit
    const minLoadingTimer = setTimeout(() => {
      setPageLoading(false);
    }, 600);

    // Fetch users
    fetchUsers({ page: 1, limit: 50 });

    // Cleanup: reset for next visit
    return () => {
      clearTimeout(minLoadingTimer);
      setPageLoading(true);
    };
  }, [fetchUsers]);

  // Filter users (client-side for now)
  const filteredUsers = users.filter((user) => {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = user.email?.toLowerCase() || "";

    const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());

    let status = "active";
    if (!user.emailVerified) status = "pending";
    if (user.isActive === false) status = "suspended";

    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter((u) => u.emailVerified && u.isActive !== false);
  const suspendedUsers = users.filter((u) => u.isActive === false);
  const pendingUsers = users.filter((u) => !u.emailVerified);

  const handleView = async (userFromList) => {
    console.log("User clicked for view:", userFromList);

    setSelectedUser(null);           // clear old data
    setViewModalOpen(true);          // show modal with loading

    try {
      const result = await fetchUser(userFromList.id);
      console.log("fetchUser full result:", result);

      if (result?.success && result?.data?.user) {
        console.log("Setting real user data:", result.data.user);
        setSelectedUser(result.data.user);   // ← this is the fix
      } else {
        console.warn("fetchUser failed or no user data:", result);
      }
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleMessage = (user) => {
    navigate(`/messages?compose=true&to=${user.id}`);
  };

  const handleSuspend = (user) => {
    alert(`Suspend not implemented yet for user ${user.id}`);
    // Future: updateUser(user.id, { isActive: !user.isActive })
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };


  const confirmDelete = () => {
    alert(`Delete not implemented yet for user ${selectedUser?.id}`);
    setDeleteModalOpen(false);
    setSelectedUser(null);
    // Future: deleteUser(selectedUser.id)
  };

  // ─── FULL PAGE SKELETON ──────────────────────────────────────────────────────
  if (pageLoading || (loading && users.length === 0)) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />

        <main className="pl-64">
          <Header title="User Management" description="Oversee and manage all user accounts" />

          <div className="p-6 space-y-6">
            {/* Stats skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>

            {/* Pending approvals skeleton */}
            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-amber-600" /> Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <PendingUserSkeleton key={i} />
                ))}
              </CardContent>
            </Card>

            {/* Table skeleton */}
            <Card>
              <CardHeader>
                <FilterBarSkeleton />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
                  <TableSkeleton />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold">Error loading users</p>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => fetchUsers({ page: 1, limit: 50 })}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <Header title="User Management" description="Oversee and manage all user accounts" />

        <div className="p-6">
          {/* Stats Grid */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-emerald-600">{activeUsers.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <UserX className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-destructive">{suspendedUsers.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-amber-500/10 p-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingUsers.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          {/* {pendingUsers.length > 0 && (
            <Card className="mb-6 border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-amber-600" /> Pending Approvals ({pendingUsers.length})
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border bg-muted/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-600">
                          {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                        </div>

                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">All Users</CardTitle>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-64 pl-9"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({users.length})</TabsTrigger>
                  <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
                  <TabsTrigger value="suspended">Suspended ({suspendedUsers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  {filteredUsers.length > 0 ? (
                    <UserTable
                      users={filteredUsers}
                      onView={handleView}
                      onEdit={handleEdit}
                      onMessage={handleMessage}
                      onSuspend={handleSuspend}
                      onDelete={handleDelete}
                      entity="User"
                    />
                  ) : (
                    <p className="py-12 text-center text-muted-foreground">No users found</p>
                  )}
                </TabsContent>

                <TabsContent value="active" className="mt-4">
                  <UserTable
                    users={activeUsers.filter((u) =>
                      `${u.firstName || ""} ${u.lastName || ""}`
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )}
                    onView={handleView}
                    onEdit={handleEdit}
                    onMessage={handleMessage}
                    onSuspend={handleSuspend}
                    onDelete={handleDelete}
                  />
                </TabsContent>

                <TabsContent value="suspended" className="mt-4">
                  <UserTable
                    users={suspendedUsers.filter((u) =>
                      `${u.firstName || ""} ${u.lastName || ""}`
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )}
                    onView={handleView}
                    onEdit={handleEdit}
                    onMessage={handleMessage}
                    onSuspend={handleSuspend}
                    onDelete={handleDelete}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      {selectedUser && (
        <>
          <EditUserModal
            user={selectedUser}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
          />
          <ViewUserModal
            user={selectedUser}
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
            onEdit={handleEdit}
            onMessage={handleMessage}
            onSuspend={handleSuspend}
          />
          <DeleteConfirmModal
            user={selectedUser}
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  );
}