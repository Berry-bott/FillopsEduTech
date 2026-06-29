import React, { useState, useEffect } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  useAdminStore  from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Search, PenSquare, Inbox, Send, Mail, MailOpen, MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const { fetchCommunityGroups, communityGroups, loading } = useAdminStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCommunityGroups();
  }, []);

  const filteredGroups = communityGroups.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Messages" description="Community group messages and moderation" />
        <div className="p-6">

          {/* Search */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Groups</p>
                  <p className="text-2xl font-bold">{communityGroups.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <Inbox className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Groups</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {communityGroups.filter((g) => g.isActive).length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <Mail className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive Groups</p>
                  <p className="text-2xl font-bold text-destructive">
                    {communityGroups.filter((g) => !g.isActive).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Groups List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Community Groups ({filteredGroups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && communityGroups.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full animate-pulse bg-muted rounded-lg" />
                  ))}
                </div>
              ) : filteredGroups.length > 0 ? (
                <div className="space-y-2">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {group.name?.[0]?.toUpperCase() ?? "G"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{group.name}</p>
                          <p className="text-sm text-muted-foreground">{group.description ?? "No description"}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          group.isActive
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-destructive bg-destructive/10 text-destructive"
                        )}
                      >
                        {group.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No groups found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}