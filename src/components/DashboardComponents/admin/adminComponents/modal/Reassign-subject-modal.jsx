import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/store/adminStore";
import { ArrowRightLeft, AlertCircle, CheckCircle2, Loader2, ChevronDown } from "lucide-react";

/**
 * ReassignSubjectModal
 *
 * Props:
 *  - open         : boolean
 *  - onOpenChange : (open: boolean) => void
 *  - tutor        : { id, firstName, lastName } | null
 *  - onSuccess    : () => void (optional)
 */
export default function ReassignSubjectModal({ open, onOpenChange, tutor, onSuccess }) {
  const { tutors, fetchTutors, reassignSubject } = useAdminStore();

  const [tutorSubjects, setTutorSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [subjectId, setSubjectId] = useState("");
  const [newTutorId, setNewTutorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Dropdown open states — controlled manually to avoid Dialog clipping issues
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);

  // Load tutors list when modal opens
  useEffect(() => {
    if (!open) return;
    if (tutors.length === 0) fetchTutors({ page: 1, limit: 50 });
  }, [open]);

  // Fetch subjects scoped to this tutor
  useEffect(() => {
    if (!open || !tutor?.id) return;

    const load = async () => {
      setSubjectsLoading(true);
      setTutorSubjects([]);
      setSubjectId("");

      try {
        const { _fetch } = useAdminStore.getState();
        const res = await _fetch(
          `https://fillops-server-5fuf.onrender.com/api/admin/subjects?tutorId=${tutor.id}&page=1&limit=100`
        );

        if (res?.success) {
          const list = res.data?.subjects ?? res.data ?? [];
          setTutorSubjects(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("[ReassignModal] Failed to load subjects:", err);
      } finally {
        setSubjectsLoading(false);
      }
    };

    load();
  }, [open, tutor?.id]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setSubjectId("");
      setNewTutorId("");
      setFeedback(null);
      setSubmitting(false);
      setTutorSubjects([]);
      setSubjectOpen(false);
      setTutorOpen(false);
    }
  }, [open]);

  const availableTutors = (Array.isArray(tutors) ? tutors : []).filter(
    (t) => t?.isActive && t?.id !== tutor?.id
  );

  const tutorFullName = tutor
    ? `${tutor.firstName ?? ""} ${tutor.lastName ?? ""}`.trim()
    : "—";

  const selectedSubject = tutorSubjects.find((s) => s.id === subjectId);
  const selectedTutor = availableTutors.find((t) => t.id === newTutorId);

  const handleSubmit = async () => {
    if (!subjectId || !newTutorId || !tutor?.id) return;
    setSubmitting(true);
    setFeedback(null);

    const result = await reassignSubject(subjectId, tutor.id, newTutorId);

    if (result?.success) {
      setFeedback({ type: "success", message: "Subject reassigned successfully." });
      onSuccess?.();
      setTimeout(() => onOpenChange(false), 1200);
    } else {
      setFeedback({
        type: "error",
        message: result?.message || "Reassignment failed. Please try again.",
      });
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* overflow-visible is critical — prevents Dialog from clipping dropdowns */}
      <DialogContent className="sm:max-w-md overflow-visible">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Reassign Subject
          </DialogTitle>
          <DialogDescription>
            Move a subject away from{" "}
            <span className="font-semibold text-foreground">{tutorFullName}</span> to
            another active tutor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* From tutor — read only */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">From Tutor</Label>
            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium">
              {tutorFullName}
            </p>
          </div>

          {/* Subject picker */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Subject <span className="text-destructive">*</span>
            </Label>

            {subjectsLoading ? (
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading subjects…
              </div>
            ) : tutorSubjects.length === 0 ? (
              <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                This tutor has no subjects assigned.
              </p>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => { setSubjectOpen((p) => !p); setTutorOpen(false); }}
                  className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <span className={selectedSubject ? "text-foreground" : "text-muted-foreground"}>
                    {selectedSubject
                      ? `${selectedSubject.subjectName} — ${selectedSubject.category}`
                      : "Select a subject..."}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
                </button>

                {subjectOpen && (
                  <div className="absolute z-[9999] mt-1 w-full rounded-md border bg-popover shadow-lg">
                    <div className="max-h-56 overflow-y-auto py-1">
                      {tutorSubjects.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setSubjectId(s.id); setSubjectOpen(false); }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                            subjectId === s.id ? "bg-accent font-medium" : ""
                          }`}
                        >
                          {s.subjectName} — {s.category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* New tutor picker */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              To Tutor <span className="text-destructive">*</span>
            </Label>

            {availableTutors.length === 0 ? (
              <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                No other active tutors available.
              </p>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => { setTutorOpen((p) => !p); setSubjectOpen(false); }}
                  className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <span className={selectedTutor ? "text-foreground" : "text-muted-foreground"}>
                    {selectedTutor
                      ? `${selectedTutor.firstName} ${selectedTutor.lastName}${selectedTutor.email ? ` — ${selectedTutor.email}` : ""}`
                      : "Select a tutor..."}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${tutorOpen ? "rotate-180" : ""}`} />
                </button>

                {tutorOpen && (
                  <div className="absolute z-[9999] mt-1 w-full rounded-md border bg-popover shadow-lg">
                    <div className="max-h-56 overflow-y-auto py-1">
                      {availableTutors.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => { setNewTutorId(t.id); setTutorOpen(false); }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                            newTutorId === t.id ? "bg-accent font-medium" : ""
                          }`}
                        >
                          {t.firstName} {t.lastName}
                          {t.email ? ` — ${t.email}` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`flex items-start gap-2 rounded-md px-3 py-2.5 text-sm border ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              {feedback.message}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!subjectId || !newTutorId || submitting || subjectsLoading}
          >
            {submitting ? "Reassigning…" : "Confirm Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}