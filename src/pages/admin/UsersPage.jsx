import { useState } from "react";
import { useNavigate } from "react-router-dom";

import  Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import  Header  from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import  UserTable  from "@/components/DashboardComponents/admin/adminComponents/dashboard/user-table";
import  EditUserModal  from "@/components/DashboardComponents/admin/adminComponents/modal/edit-user-modal";
import  ViewUserModal  from "@/components/DashboardComponents/admin/adminComponents/modal/view-user-modal";
import  DeleteConfirmModal  from "@/components/DashboardComponents/admin/adminComponents/modal/delete-confirm-modal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAppStore } from "../../components/DashboardComponents/admin/store";       
import { Search, Users, UserCheck, UserX, Clock } from "lucide-react";

export default function UsersPage() {
  const navigate = useNavigate();

  const users = useAppStore((state) => state.users);
  const updateUser = useAppStore((state) => state.updateUser);
  const deleteUser = useAppStore((state) => state.deleteUser);
  const addActivityLog = useAppStore((state) => state.addActivityLog);

  const regularUsers = users.filter((u) => u.role === "user");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = regularUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeUsers = regularUsers.filter((u) => u.status === "active");
  const suspendedUsers = regularUsers.filter((u) => u.status === "suspended");
  const pendingUsers = regularUsers.filter((u) => u.status === "pending");

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleMessage = (user) => {
    navigate(`/messages?compose=true&to=${user.id}`);
  };

  const handleSuspend = (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";

    updateUser(user.id, { status: newStatus });

    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action: newStatus === "suspended" ? "Suspended user account" : "Unsuspended user account",
      target: user.name,
      createdAt: new Date(),
    });
  };

  const handleApprove = (user) => {
    updateUser(user.id, { status: "active" });

    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action: "Approved user registration",
      target: user.name,
      createdAt: new Date(),
    });
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);

      addActivityLog({
        id: `log-${Date.now()}`,
        userId: "sa-001",
        userName: "Super Admin",
        userRole: "super_admin",
        action: "Deleted user account",
        target: selectedUser.name,
        createdAt: new Date(),
      });

      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

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
                  <p className="text-2xl font-bold">{regularUsers.length}</p>
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
          {pendingUsers.length > 0 && (
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
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(user)}>
                          Approve
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => handleDelete(user)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">All Users</CardTitle>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      placeholder="Search users..."
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
                  <TabsTrigger value="all">All ({regularUsers.length})</TabsTrigger>
                  <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
                  <TabsTrigger value="suspended">Suspended ({suspendedUsers.length})</TabsTrigger>
                </TabsList>

                {/* All users */}
                <TabsContent value="all" className="mt-4">
                  {filteredUsers.length > 0 ? (
                    <UserTable
                      users={filteredUsers}
                      onView={handleView}
                      onEdit={handleEdit}
                      onMessage={handleMessage}
                      onSuspend={handleSuspend}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <p className="py-12 text-center text-muted-foreground">No users found</p>
                  )}
                </TabsContent>

                {/* Active users */}
                <TabsContent value="active" className="mt-4">
                  <UserTable
                    users={activeUsers.filter((u) =>
                      u.name.toLowerCase().includes(search.toLowerCase())
                    )}
                    onView={handleView}
                    onEdit={handleEdit}
                    onMessage={handleMessage}
                    onSuspend={handleSuspend}
                    onDelete={handleDelete}
                  />
                </TabsContent>

                {/* Suspended users */}
                <TabsContent value="suspended" className="mt-4">
                  <UserTable
                    users={suspendedUsers.filter((u) =>
                      u.name.toLowerCase().includes(search.toLowerCase())
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
      <EditUserModal user={selectedUser} open={editModalOpen} onOpenChange={setEditModalOpen} />
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
    </div>
  );
}
