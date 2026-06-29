
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import StatsCard from "@/components/DashboardComponents/admin/adminComponents/dashboard/stats-card";
import RecentActivity from "@/components/DashboardComponents/admin/adminComponents/dashboard/recent-activity";
import UserTable from "@/components/DashboardComponents/admin/adminComponents/dashboard/user-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, UserCog, BookOpen, Activity } from "lucide-react";

import { useAdminStore } from "@/store/adminStore";

// ─── SKELETON COMPONENTS ──────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentUsersSkeleton() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentTutorsSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-56 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PopularSubjectsSkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsSkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-40 rounded bg-gray-200 animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { fetchDashboard, fetchUsers, dashboard, users, loading, error } = useAdminStore();

  // Force skeleton on every visit
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Minimum 800ms skeleton
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);

    fetchDashboard();
    fetchUsers({ page: 1, limit: 5 });

    return () => {
      clearTimeout(timer);
      setPageLoading(true); // reset for next visit
    };
  }, [fetchDashboard, fetchUsers]);

  // Extract real stats safely
  const stats = dashboard?.stats || {};
  const recentUsers = Array.isArray(dashboard?.recentUsers) ? dashboard.recentUsers : [];
  const recentTutors = Array.isArray(dashboard?.recentTutors) ? dashboard.recentTutors : [];
  const popularSubjects = Array.isArray(dashboard?.popularSubjects) ? dashboard.popularSubjects : [];

  // ─── FULL PAGE SKELETON ──────────────────────────────────────────────────────
  if (pageLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64">
          <Header title="Dashboard Overview" description="Welcome back, Admin" />

          <div className="p-6 space-y-8">
            {/* Stats skeleton */}
            <StatsSkeleton />

            {/* Recent Users & Tutors */}
            <div className="grid gap-6 lg:grid-cols-3">
              <RecentUsersSkeleton />
              <RecentTutorsSkeleton />
            </div>

            {/* Popular Subjects */}
            <PopularSubjectsSkeleton />

            {/* Quick Actions */}
            <QuickActionsSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Dashboard Overview" description="Welcome back, Admin" />

        <div className="p-6">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 font-semibold mb-2">Failed to load dashboard</p>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  fetchDashboard();
                  fetchUsers({ page: 1, limit: 5 });
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers ?? 0}
              icon={Users}
              iconColor="bg-emerald-500/10 text-emerald-600"
            />
            <StatsCard
              title="Total Tutors"
              value={stats.totalTutors ?? 0}
              icon={UserCog}
              iconColor="bg-amber-500/10 text-amber-600"
            />
            <StatsCard
              title="Total Subjects"
              value={stats.totalSubjects ?? 0}
              icon={BookOpen}
              iconColor="bg-primary/10 text-primary"
            />
            <StatsCard
              title="Total Questions"
              value={stats.totalQuestions ?? 0}
              icon={Activity}
              iconColor="bg-blue-500/10 text-blue-600"
            />
          </div>

          {/* Recent Users & Tutors */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Recent Users */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Recent Users</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/manage-users")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {recentUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    No recent users found
                  </p>
                ) : (
                  <UserTable users={recentUsers} />
                )}
              </CardContent>
            </Card>

            {/* Recent Tutors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTutors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    No recent tutors
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentTutors.map((tutor) => (
                      <div key={tutor.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                          {tutor.firstName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {tutor.firstName} {tutor.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{tutor.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Popular Subjects */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Popular Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              {popularSubjects.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No popular subjects yet
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {popularSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={cn(
                        "rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow",
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-white/80 flex items-center justify-center text-xl font-bold">
                          {subject.subjectName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h4 className="font-semibold">{subject.subjectName}</h4>
                          <p className="text-xs text-muted-foreground">{subject.category || "Uncategorized"}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {subject.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress: {subject._count?.userProgress || 0}</span>
                        <span>Sessions: {subject._count?.studySession || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate("/manage-users")}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button variant="outline" onClick={() => navigate("/manage-tutors")}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Manage Tutors
                </Button>
                <Button variant="outline" onClick={() => navigate("/activity")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Subjects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}