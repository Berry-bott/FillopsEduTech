import { useState, useEffect } from "react"
import  Sidebar  from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar"
import  Header  from "@/components/DashboardComponents/admin/adminComponents/dashboard/header"
import  UserTable  from "@/components/DashboardComponents/admin/adminComponents/dashboard/user-table"
import  CreateAdminModal  from "@/components/DashboardComponents/admin/adminComponents/modal/create-admin-modal"
import EditUserModal  from "@/components/DashboardComponents/admin/adminComponents/modal/edit-user-modal"
import  ViewUserModal  from "@/components/DashboardComponents/admin/adminComponents/modal/view-user-modal"
import  DeleteConfirmModal  from "@/components/DashboardComponents/admin/adminComponents/modal/delete-confirm-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "../../components/DashboardComponents/admin/store"
import { UserPlus, Search } from "lucide-react"

export default function AdminsPage() {
  const users = useAppStore((state) => state.users)
  const updateUser = useAppStore((state) => state.updateUser)
  const deleteUser = useAppStore((state) => state.deleteUser)
  const addActivityLog = useAppStore((state) => state.addActivityLog)

  const admins = users.filter((u) => u.role === "admin")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Optional: If you want to auto-open create modal with a query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("create") === "true") {
      setCreateModalOpen(true)
    }
  }, [])

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || admin.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleView = (user) => {
    setSelectedUser(user)
    setViewModalOpen(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleMessage = (user) => {
    window.location.href = `/messages?compose=true&to=${user.id}`
  }

  const handleSuspend = (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended"

    updateUser(user.id, { status: newStatus })

    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action:
        newStatus === "suspended"
          ? "Suspended admin account"
          : "Unsuspended admin account",
      target: user.name,
      createdAt: new Date(),
    })
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)

      addActivityLog({
        id: `log-${Date.now()}`,
        userId: "sa-001",
        userName: "Super Admin",
        userRole: "super_admin",
        action: "Deleted admin account",
        target: selectedUser.name,
        createdAt: new Date(),
      })

      setDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <Header
          title="Admin Management"
          description="Create and manage administrator accounts"
        />

        <div className="p-6">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search admins..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Admin Button */}
            <Button onClick={() => setCreateModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Admins</p>
                <p className="text-2xl font-bold">{admins.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {admins.filter((a) => a.status === "active").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-destructive">
                  {admins.filter((a) => a.status === "suspended").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Table */}
          <Card>
            <CardHeader>
              <CardTitle>Administrators ({filteredAdmins.length})</CardTitle>
            </CardHeader>

            <CardContent>
              {filteredAdmins.length > 0 ? (
                <UserTable
                  users={filteredAdmins}
                  onView={handleView}
                  onEdit={handleEdit}
                  onMessage={handleMessage}
                  onSuspend={handleSuspend}
                  onDelete={handleDelete}
                />
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No admins found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <CreateAdminModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
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
    </div>
  )
}
