import { useEffect, useState } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import UserTable from "@/components/DashboardComponents/admin/adminComponents/dashboard/user-table";
import CreateTutorModal from "@/components/DashboardComponents/admin/adminComponents/modal/create-tutor-modal";
import ViewUserModal from "@/components/DashboardComponents/admin/adminComponents/modal/view-user-modal";
import DeleteConfirmModal from "@/components/DashboardComponents/admin/adminComponents/modal/delete-confirm-modal";
import EditTutorModal from "@/components/DashboardComponents/admin/adminComponents/modal/edit-tutor-modal";
import ReassignSubjectModal from "@/components/DashboardComponents/admin/adminComponents/modal/reassign-subject-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStore } from "@/store/adminStore";
import { UserPlus, Search } from "lucide-react";

// ─── SKELETON COMPONENTS ──────────────────────────────────────────────────────

function StatsCardSkeleton() {


  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          <div className="h-8 w-16 rounded bg-gray-200 animate-pulse" />
        </div>

      </CardContent>
    </Card>
  );
}

function FilterBarSkeleton() {
  return (
    <div className="flex items-center justify-between ">
      <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="h-10 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-10 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-10 w-32 rounded bg-gray-200 animate-pulse" />
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

export default function TutorsPage() {
  const {
    tutors: rawTutors,
    fetchTutors,
    fetchSubjects,
    toggleTutorStatus,
    deleteTutor,
    loading,
    error,
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // — Modal states —
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedTutorForEdit, setSelectedTutorForEdit] = useState(null);
  // Tutor whose subjects will be listed inside the reassign modal
  const [tutorForReassign, setTutorForReassign] = useState(null);

  // Force skeleton on every page visit
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const minLoadingTimer = setTimeout(() => setPageLoading(false), 600);
    fetchTutors({ page: 1, limit: 50 });
    return () => {
      clearTimeout(minLoadingTimer);
      setPageLoading(true);
    };
  }, [fetchTutors]);

  const tutors = Array.isArray(rawTutors) ? rawTutors : [];

  const filteredTutors = tutors.filter((t) => {
    const name = `${t?.firstName ?? ""} ${t?.lastName ?? ""}`.toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      t?.email?.toLowerCase()?.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? t?.isActive : !t?.isActive);
    return matchesSearch && matchesStatus;
  });

  const activeTutors = tutors.filter((t) => t?.isActive);
  const inactiveTutors = tutors.filter((t) => !t?.isActive);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleView = (tutor) => {
    setSelectedTutor(tutor);
    setViewModalOpen(true);
  };

  const handleEdit = (tutor) => {
    setSelectedTutorForEdit(tutor);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (tutor) => {
    if (tutor?.id) toggleTutorStatus(tutor.id);
  };

  const handleDelete = (tutor) => {
    setSelectedTutor(tutor);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTutor?.id) {
      await deleteTutor(selectedTutor.id);
      setDeleteModalOpen(false);
      setSelectedTutor(null);
    }
  };

  // Called from each tutor row — opens reassign modal scoped to that tutor
  const handleReassign = (tutor) => {
    setTutorForReassign(tutor);
    setReassignModalOpen(true);
  };

  // ─── Full-page skeleton ───────────────────────────────────────────────────────
  if (pageLoading || (loading && tutors.length === 0)) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64">
          <Header title="Tutor Management" description="Create and manage tutor accounts" />
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-10 w-40 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
            <Card>
              <CardHeader>
                <FilterBarSkeleton />
              </CardHeader>
              <CardContent>
                <TableSkeleton />
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
        <div className="text-center text-red-500">
          <p className="text-xl font-bold">Error loading tutors</p>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => fetchTutors({ page: 1, limit: 50 })}>
            Retry again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <Header title="Tutor Management" description="Create and manage tutor accounts" />

        <div className="p-6">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutors..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setCreateModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Tutor
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Tutors</p>
                <p className="text-2xl font-bold">{tutors.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">{activeTutors.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-destructive">{inactiveTutors.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tutors ({filteredTutors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTutors.length > 0 ? (
                <UserTable
                  users={filteredTutors}
                  onView={handleView}
                  onEdit={handleEdit}
                  onSuspend={handleToggleStatus}
                  onDelete={handleDelete}
                  onReassign={handleReassign}  // ← new prop for per-row reassign
                  entity="Tutor"
                />
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  {loading ? "Loading tutors..." : "No tutors found"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ── Modals ── */}
      <CreateTutorModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => fetchTutors({ page: 1, limit: 50 })}
      />

      <ViewUserModal
        user={selectedTutor}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        onSuspend={handleToggleStatus}
      />

      <DeleteConfirmModal
        user={selectedTutor}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
      />

      <EditTutorModal
        tutor={selectedTutorForEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={() => fetchTutors({ page: 1, limit: 50 })}
      />

      {/* Scoped to the tutor row that was clicked */}
      <ReassignSubjectModal
        open={reassignModalOpen}
        onOpenChange={setReassignModalOpen}
        tutor={tutorForReassign}
        onSuccess={() => fetchSubjects()}
      />
    </div>
  );
}