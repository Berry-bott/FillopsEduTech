import { useState } from "react";
import { X, Calendar, Clock, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserChatStore } from "@/store/userChatStore";
import { cn } from "@/lib/utils";

export default function BookingModal({ tutor, isOpen, onClose }) {
  const [purpose, setPurpose] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createBooking = useUserChatStore((state) => state.createBooking);
  const fetchBookings = useUserChatStore((state) => state.fetchBookings);

  if (!isOpen || !tutor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!purpose.trim()) {
      setError("Please describe the purpose of this session");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError("Please select a date and time");
      return;
    }

    // Combine date and time into ISO string
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        tutorId: tutor.id,
        purpose: purpose.trim(),
        scheduledAt,
        duration,
      });

      if (result) {
        // Refresh bookings list
        await fetchBookings();
        
        // Close modal
        onClose();
        
        // Reset form
        setPurpose("");
        setScheduledDate("");
        setScheduledTime("");
        setDuration(30);
      } else {
        setError("Failed to create booking. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Book a Session</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tutor Info */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {tutor.participant_name?.charAt(0).toUpperCase() || "T"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{tutor.participant_name}</h3>
              <p className="text-sm text-slate-500">
                {tutor.completedSessions || 0} sessions completed
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-slate-700 font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
              What do you need help with?
            </Label>
            <Textarea
              id="purpose"
              placeholder="e.g., I need help with Calculus integration problems..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="resize-none focus:border-indigo-300 focus:ring-indigo-200"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-700 font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Session Date
            </Label>
            <Input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              disabled={isSubmitting}
              min={new Date().toISOString().split("T")[0]}
              className="focus:border-indigo-300 focus:ring-indigo-200"
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-slate-700 font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-hover" />
              Session Time
            </Label>
            <Input
              id="time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              disabled={isSubmitting}
              className="focus:border-indigo-300 focus:ring-indigo-200"
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-slate-700 font-semibold">
              Session Duration
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  disabled={isSubmitting}
                  className={cn(
                    "py-3 px-4 rounded-lg border-2 font-semibold transition-all",
                    duration === mins
                      ? "borde-primary bg-indigo-50 text-primary"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 b-primabg-primary text-white shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}