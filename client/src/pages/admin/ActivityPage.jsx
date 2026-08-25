
import { useState, useEffect } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAdminStore from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Search, BookOpen, Layers, RefreshCw, Eye,
  HelpCircle, Clock, FileText, X,
  Paperclip, ChevronRight, Loader2, Trash2, AlertTriangle,
} from "lucide-react";

const TABS = [
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "topics",   label: "Topics",   icon: Layers   },
];

const CATEGORIES = ["WAEC", "JAMB", "NECO"];

const CATEGORY_STYLES = {
  WAEC:  "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  JAMB:  "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  NECO:  "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
};

function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, label }) {
  return (
    <div className="py-8 text-center">
      <Icon className="mx-auto h-10 w-10 text-muted-foreground/50" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ColorDot({ color }) {
  if (!color) return null;
  return color.startsWith("#")
    ? <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-border" style={{ backgroundColor: color }} />
    : <span className={cn("inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-border", color)} />;
}

function StatCard({ icon: Icon, iconClass, bgClass, label, value, valueClass }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("rounded-md p-2 shrink-0", bgClass)}>
          <Icon className={cn("h-4 w-4", iconClass)} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className={cn("text-lg font-bold leading-tight", valueClass)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-border/50 last:border-0">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{label}</span>
      <div className="text-xs text-foreground">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUBJECT DETAIL DRAWER
// ═══════════════════════════════════════════════════════════════
function SubjectDrawer({ subjectId, onClose, onViewTopics }) {
  const { fetchSubject } = useAdminStore();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    fetchSubject(subjectId).then((res) => {
      if (res?.success) setData(res.data);
      setLoading(false);
    });
  }, [subjectId]);

  const subject = data?.subject ?? data;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl border-l border-border overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Subject Details</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !subject ? (
            <EmptyState icon={BookOpen} label="Could not load subject details" />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: subject.color?.startsWith("#") ? subject.color : "#6366f1" }}
                >
                  {(subject.subjectName ?? subject.name ?? "?").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">{subject.subjectName ?? subject.name}</h2>
                  {subject.category && (
                    <Badge variant="outline" className={cn("mt-1 text-[10px] px-1.5 py-0", CATEGORY_STYLES[subject.category])}>
                      {subject.category}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Questions", value: subject._count?.question ?? 0,     color: "text-emerald-600" },
                  { label: "Sessions",  value: subject._count?.studySession ?? 0, color: "text-blue-600"    },
                  { label: "Progress",  value: subject._count?.userProgress ?? 0, color: "text-amber-600"   },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-lg border bg-muted/30 p-2 text-center">
                    <p className={cn("text-base font-bold", color)}>{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border bg-muted/20 px-3">
                {subject.subjectCode && (
                  <DetailRow label="Subject Code">
                    <span className="font-mono">{subject.subjectCode}</span>
                  </DetailRow>
                )}
                <DetailRow label="Description">
                  {subject.description || <span className="text-muted-foreground italic">No description</span>}
                </DetailRow>
                <DetailRow label="Color">
                  <div className="flex items-center gap-2">
                    <ColorDot color={subject.color} />
                    <span className="font-mono text-muted-foreground">{subject.color ?? "—"}</span>
                  </div>
                </DetailRow>
                {subject.createdBy && (
                  <DetailRow label="Created By">
                    {subject.createdBy.firstName} {subject.createdBy.lastName}
                    <span className="ml-1 text-muted-foreground">({subject.createdBy.email})</span>
                  </DetailRow>
                )}
                {subject.createdAt && (
                  <DetailRow label="Created">
                    {format(new Date(subject.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </DetailRow>
                )}
                {subject.updatedAt && (
                  <DetailRow label="Last Updated">
                    {format(new Date(subject.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                  </DetailRow>
                )}
              </div>
            </>
          )}
        </div>

        {subject && (
          <div className="border-t p-4">
            <Button
              className="w-full gap-2"
              size="sm"
              onClick={() => { onViewTopics(subjectId); onClose(); }}
            >
              <Layers className="h-4 w-4" /> View Topics for this Subject
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TOPIC DETAIL DRAWER
// ═══════════════════════════════════════════════════════════════
function TopicDrawer({ topicId, onClose }) {
  const { fetchTopic } = useAdminStore();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);
    fetchTopic(topicId).then((res) => {
      if (res?.success) setData(res.data);
      setLoading(false);
    });
  }, [topicId]);

  const topic = data?.topic ?? data;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl border-l border-border overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold">Topic Details</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !topic ? (
            <EmptyState icon={Layers} label="Could not load topic details" />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-sm font-bold text-amber-600">
                  {(topic.topicName ?? topic.name ?? "?").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">{topic.topicName ?? topic.name}</h2>
                  {topic.subject?.subjectName && (
                    <Badge variant="outline" className="mt-1 border-primary bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                      {topic.subject.subjectName}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-base font-bold text-emerald-600">{topic._count?.question ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground">Questions</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-base font-bold text-blue-600">{topic.order ?? "—"}</p>
                  <p className="text-[10px] text-muted-foreground">Order</p>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 px-3">
                <DetailRow label="Description">
                  {topic.description || <span className="text-muted-foreground italic">No description</span>}
                </DetailRow>
                <DetailRow label="Content">
                  {topic.content ? (
                    <div className="max-h-40 overflow-y-auto rounded border bg-muted/30 p-2 text-[11px] leading-relaxed whitespace-pre-wrap">
                      {topic.content}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">No content</span>
                  )}
                </DetailRow>
                <DetailRow label="Attachment">
                  {topic.attachmentUrl ? (
                    <a href={topic.attachmentUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary underline underline-offset-2">
                      <Paperclip className="h-3 w-3" /> View File
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">No attachment</span>
                  )}
                </DetailRow>
                {topic.createdBy && (
                  <DetailRow label="Created By">
                    {topic.createdBy.firstName} {topic.createdBy.lastName}
                    <span className="ml-1 text-muted-foreground">({topic.createdBy.email})</span>
                  </DetailRow>
                )}
                {topic.createdAt && (
                  <DetailRow label="Created">
                    {format(new Date(topic.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </DetailRow>
                )}
                {topic.updatedAt && (
                  <DetailRow label="Last Updated">
                    {format(new Date(topic.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                  </DetailRow>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUBJECTS VIEW
// ═══════════════════════════════════════════════════════════════
function SubjectsView({ subjects, topics, loading, onRefresh, onViewTopics }) {
  const { deleteSubject } = useAdminStore();
  const { toast } = useToast();
  const [search, setSearch]                       = useState("");
  const [categoryFilter, setCategoryFilter]       = useState("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [subjectToDelete, setSubjectToDelete]     = useState(null);
  const [isDeletingSubject, setIsDeletingSubject] = useState(false);

  const subjectList = subjects ?? [];
  const topicList   = topics   ?? [];

  const filteredSubjects = subjectList.filter((s) => {
    const name = s.subjectName ?? s.name ?? "";
    const desc = s.description ?? "";
    const code = s.subjectCode ?? "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (categoryFilter === "all" || s.category === categoryFilter);
  });

  const totalQuestions = subjectList.reduce((sum, s) => sum + (s._count?.question ?? 0), 0);
  const totalSessions  = subjectList.reduce((sum, s) => sum + (s._count?.studySession ?? 0), 0);
  const topicsForSubject = (id) => topicList.filter((t) => t.subjectId === id).length;

  return (
    <>
      {selectedSubjectId && (
        <SubjectDrawer
          subjectId={selectedSubjectId}
          onClose={() => setSelectedSubjectId(null)}
          onViewTopics={onViewTopics}
        />
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={BookOpen}   bgClass="bg-primary/10"     iconClass="text-primary"     label="Total Subjects" value={subjectList.length} valueClass="text-foreground" />
        <StatCard icon={Layers}     bgClass="bg-amber-500/10"   iconClass="text-amber-600"   label="Total Topics"   value={topicList.length}   valueClass="text-amber-600" />
        <StatCard icon={HelpCircle} bgClass="bg-emerald-500/10" iconClass="text-emerald-600" label="Questions"      value={totalQuestions}     valueClass="text-emerald-600" />
        <StatCard icon={Clock}      bgClass="bg-blue-500/10"    iconClass="text-blue-600"    label="Sessions"       value={totalSessions}      valueClass="text-blue-600" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[150px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 gap-1.5 text-xs px-3">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="py-2.5 px-4">
          <CardTitle className="text-sm">Subjects ({filteredSubjects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !subjectList.length ? (
            <div className="p-4"><SkeletonRows /></div>
          ) : filteredSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 text-xs">Subject</TableHead>
                    <TableHead className="py-2 text-xs">Code</TableHead>
                    <TableHead className="py-2 text-xs">Category</TableHead>
                    <TableHead className="py-2 text-xs">Description</TableHead>
                    <TableHead className="py-2 text-xs text-center">Qs</TableHead>
                    <TableHead className="py-2 text-xs text-center">Sessions</TableHead>
                    <TableHead className="py-2 text-xs text-center">Progress</TableHead>
                    <TableHead className="py-2 text-xs text-center">Topics</TableHead>
                    <TableHead className="py-2 text-xs">Created By</TableHead>
                    <TableHead className="py-2 text-xs">Created</TableHead>
                    <TableHead className="py-2 text-xs"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => {
                    const name      = subject.subjectName ?? subject.name ?? "Untitled";
                    const initials  = name.slice(0, 2).toUpperCase();
                    const count     = topicsForSubject(subject.id ?? subject._id);
                    const createdBy = subject.createdBy
                      ? `${subject.createdBy.firstName} ${subject.createdBy.lastName}`
                      : "—";

                    return (
                      <TableRow
                        key={subject.id ?? subject._id}
                        className="text-xs cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedSubjectId(subject.id ?? subject._id)}
                      >
                        <TableCell className="py-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                              style={{ backgroundColor: subject.color?.startsWith("#") ? subject.color : "#6366f1" }}
                            >{initials}</div>
                            <div className="flex items-center gap-1">
                              <ColorDot color={subject.color} />
                              <span className="font-medium text-foreground whitespace-nowrap">{name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-1.5">
                          {subject.subjectCode
                            ? <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">{subject.subjectCode}</Badge>
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 font-medium", CATEGORY_STYLES[subject.category])}>
                            {subject.category ?? "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-1.5 max-w-[140px]">
                          <span className="block truncate text-muted-foreground">{subject.description || "—"}</span>
                        </TableCell>
                        <TableCell className="py-1.5 text-center font-medium">{subject._count?.question ?? 0}</TableCell>
                        <TableCell className="py-1.5 text-center font-medium">{subject._count?.studySession ?? 0}</TableCell>
                        <TableCell className="py-1.5 text-center font-medium">{subject._count?.userProgress ?? 0}</TableCell>
                        <TableCell className="py-1.5 text-center">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{count}</Badge>
                        </TableCell>
                        <TableCell className="py-1.5 text-muted-foreground whitespace-nowrap">{createdBy}</TableCell>
                        <TableCell className="py-1.5 text-muted-foreground whitespace-nowrap">
                          {subject.createdAt ? format(new Date(subject.createdAt), "MMM d, yy") : "—"}
                        </TableCell>
                                                <TableCell className="py-1.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewTopics(subject.id ?? subject._id)}
                              className="h-6 gap-1 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="h-3 w-3" /> Topics
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSubjectToDelete(subject)}
                              className="h-6 w-6 px-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState icon={BookOpen} label="No subjects found" />
          )}
                </CardContent>
      </Card>

      {subjectToDelete && (
        <AlertDialog open={!!subjectToDelete} onOpenChange={(open) => { if (!open) setSubjectToDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-destructive" />
                Delete Subject
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{subjectToDelete.subjectName ?? subjectToDelete.name}</strong>? This action cannot be undone and will also delete all associated topics and questions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingSubject}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeletingSubject}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isDeletingSubject) return;
                  const subjectId = subjectToDelete.id ?? subjectToDelete._id;
                  setIsDeletingSubject(true);
                  const result = await deleteSubject(subjectId);
                  setIsDeletingSubject(false);
                  if (result?.success) {
                    toast({ title: "Success", description: "Subject deleted successfully" });
                    setSubjectToDelete(null);
                    onRefresh && onRefresh();
                  } else {
                    toast({
                      title: "Error",
                      description: result?.message || "Failed to delete subject",
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletingSubject && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Subject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TOPICS VIEW
// ═══════════════════════════════════════════════════════════════
function TopicsView({ topics, subjects, loading, onRefresh, subjectFilter: initialSubjectFilter }) {
  const { deleteTopic } = useAdminStore();
  const { toast } = useToast();
  const [search, setSearch]                   = useState("");
  const [subjectFilter, setSubjectFilter]     = useState(initialSubjectFilter ?? "all");
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicToDelete, setTopicToDelete]     = useState(null);
  const [isDeletingTopic, setIsDeletingTopic] = useState(false);

  const topicList   = topics   ?? [];
  const subjectList = subjects ?? [];

  useEffect(() => {
    if (initialSubjectFilter) setSubjectFilter(initialSubjectFilter);
  }, [initialSubjectFilter]);

  const filteredTopics = topicList.filter((t) => {
    const name     = t.topicName ?? t.name ?? "";
    const desc     = t.description ?? "";
    const subjName = t.subject?.subjectName ?? "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase())     ||
      desc.toLowerCase().includes(search.toLowerCase())     ||
      subjName.toLowerCase().includes(search.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" ||
      t.subjectId === subjectFilter ||
      t.subject?.id === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const totalQuestions = topicList.reduce((sum, t) => sum + (t._count?.question ?? 0), 0);
  const withContent    = topicList.filter((t) => t.content).length;

  const subjectLabel = (id) => {
    if (id === "all") return "All Subjects";
    const s = subjectList.find((s) => (s.id ?? s._id) === id);
    return s ? (s.subjectName ?? s.name) : id;
  };

  return (
    <>
      {selectedTopicId && (
        <TopicDrawer topicId={selectedTopicId} onClose={() => setSelectedTopicId(null)} />
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Layers}     bgClass="bg-primary/10"     iconClass="text-primary"     label="Total Topics"  value={topicList.length}   valueClass="text-foreground" />
        <StatCard icon={BookOpen}   bgClass="bg-amber-500/10"   iconClass="text-amber-600"   label="Subjects"      value={subjectList.length} valueClass="text-amber-600" />
        <StatCard icon={HelpCircle} bgClass="bg-emerald-500/10" iconClass="text-emerald-600" label="Questions"     value={totalQuestions}     valueClass="text-emerald-600" />
        <StatCard icon={FileText}   bgClass="bg-blue-500/10"    iconClass="text-blue-600"    label="With Content"  value={withContent}        valueClass="text-blue-600" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[150px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjectList.map((s) => (
              <SelectItem key={s.id ?? s._id} value={s.id ?? s._id}>
                {s.subjectName ?? s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 gap-1.5 text-xs px-3">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="py-2.5 px-4">
          <CardTitle className="text-sm">
            Topics ({filteredTopics.length})
            {subjectFilter !== "all" && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">— {subjectLabel(subjectFilter)}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !topicList.length ? (
            <div className="p-4"><SkeletonRows /></div>
          ) : filteredTopics.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 text-xs">Topic</TableHead>
                    <TableHead className="py-2 text-xs">Subject</TableHead>
                    <TableHead className="py-2 text-xs">Description</TableHead>
                    <TableHead className="py-2 text-xs text-center">Order</TableHead>
                    <TableHead className="py-2 text-xs text-center">Qs</TableHead>
                    <TableHead className="py-2 text-xs text-center">Content</TableHead>
                    <TableHead className="py-2 text-xs text-center">File</TableHead>
                                        <TableHead className="py-2 text-xs">Created By</TableHead>
                    <TableHead className="py-2 text-xs">Created</TableHead>
                    <TableHead className="py-2 text-xs text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => {
                    const name      = topic.topicName ?? topic.name ?? "Untitled";
                    const initials  = name.slice(0, 2).toUpperCase();
                    const subjName  = topic.subject?.subjectName
                      ?? subjectList.find((s) => (s.id ?? s._id) === topic.subjectId)?.subjectName
                      ?? "—";
                    const createdBy = topic.createdBy
                      ? `${topic.createdBy.firstName} ${topic.createdBy.lastName}`
                      : "—";

                    return (
                      <TableRow
                        key={topic.id ?? topic._id}
                        className="text-xs cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedTopicId(topic.id ?? topic._id)}
                      >
                        <TableCell className="py-1.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-medium text-amber-600">
                              {initials}
                            </div>
                            <span className="font-medium text-foreground whitespace-nowrap">{name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Badge variant="outline" className="border-primary bg-primary/10 text-primary text-[10px] px-1.5 py-0 whitespace-nowrap">
                            {subjName}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-1.5 max-w-[160px]">
                          <span className="block truncate text-muted-foreground">{topic.description || "—"}</span>
                        </TableCell>
                        <TableCell className="py-1.5 text-center text-muted-foreground">{topic.order ?? "—"}</TableCell>
                        <TableCell className="py-1.5 text-center font-medium">{topic._count?.question ?? 0}</TableCell>
                        <TableCell className="py-1.5 text-center">
                          {topic.content
                            ? <Badge variant="outline" className="border-emerald-500 bg-emerald-500/10 text-emerald-600 text-[10px] px-1.5 py-0">Yes</Badge>
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="py-1.5 text-center">
                          {topic.attachmentUrl
                            ? <Badge variant="outline" className="border-blue-500 bg-blue-500/10 text-blue-600 text-[10px] px-1.5 py-0">Yes</Badge>
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="py-1.5 text-muted-foreground whitespace-nowrap">{createdBy}</TableCell>
                                                <TableCell className="py-1.5 text-muted-foreground whitespace-nowrap">
                          {topic.createdAt ? format(new Date(topic.createdAt), "MMM d, yy") : "—"}
                        </TableCell>
                        <TableCell className="py-1.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTopicToDelete(topic)}
                            className="h-6 w-6 px-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState icon={Layers} label="No topics found" />
          )}
        </CardContent>
            </Card>

      {topicToDelete && (
        <AlertDialog open={!!topicToDelete} onOpenChange={(open) => { if (!open) setTopicToDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-destructive" />
                Delete Topic
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{topicToDelete.topicName ?? topicToDelete.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingTopic}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeletingTopic}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isDeletingTopic) return;
                  const topicId = topicToDelete.id ?? topicToDelete._id;
                  setIsDeletingTopic(true);
                  const result = await deleteTopic(topicId);
                  setIsDeletingTopic(false);
                  if (result?.success) {
                    toast({ title: "Success", description: "Topic deleted successfully" });
                    setTopicToDelete(null);
                    onRefresh && onRefresh();
                  } else {
                    toast({
                      title: "Error",
                      description: result?.message || "Failed to delete topic",
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletingTopic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Topic
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function SubjectsPage() {
  const { fetchSubjects, fetchTopics, subjects, topics, loading } = useAdminStore();

  const [activeTab, setActiveTab]                   = useState("subjects");
  const [topicSubjectFilter, setTopicSubjectFilter] = useState("all");

  useEffect(() => {
    fetchSubjects();
    fetchTopics();
  }, []);

  const handleViewTopics = (subjectId) => {
    setTopicSubjectFilter(subjectId);
    setActiveTab("topics");
  };

  const headerMeta = {
    subjects: { title: "Subjects", description: "Browse and manage all subjects" },
    topics:   { title: "Topics",   description: "Browse and manage all topics"   },
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-w-0 overflow-hidden">
        <Header title={headerMeta[activeTab].title} description={headerMeta[activeTab].description} />
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="mb-4 flex items-center gap-1 rounded-lg border bg-muted/40 p-1 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(id)}
                className={cn(
                  "h-7 gap-1.5 px-3 text-xs transition-all",
                  activeTab === id ? "shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>

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