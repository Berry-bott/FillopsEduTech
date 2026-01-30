import { useState } from "react";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserChatStore } from "@/store/userChatStore";

export default function RescheduleModal({ booking, isOpen, onClose }) {
  const { rescheduleBooking, isLoading } = useUserChatStore();
  
  const [formData, setFormData] = useState({
    scheduledAt: booking?.scheduledAt ? new Date(booking.scheduledAt).toISOString().slice(0, 16) : "",
    duration: booking?.duration || 60,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.scheduledAt) {
      setError("Please select a date and time");
      return;
    }

    const scheduledDate = new Date(formData.scheduledAt);
    if (scheduledDate < new Date()) {
      setError("Cannot schedule a session in the past");
      return;
    }

    if (formData.duration < 15) {
      setError("Duration must be at least 15 minutes");
      return;
    }

    if (formData.duration > 180) {
      setError("Duration cannot exceed 180 minutes (3 hours)");
      return;
    }

    const result = await rescheduleBooking(
      booking.id,
      formData.scheduledAt,
      formData.duration
    );

    if (result) {
      onClose();
    } else {
      setError("Failed to reschedule. Please try again.");
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Reschedule Session</h2>
                <p className="text-indigo-100 text-sm">
                  with {booking.participant_name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Current Schedule */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Current Schedule</p>
              <p className="text-sm text-slate-900">
                {new Date(booking.scheduledAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" • "}
                {booking.duration} minutes
              </p>
            </div>

            {/* Date and Time */}
            <div>
              <Label htmlFor="scheduledAt" className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>New Date & Time</span>
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
                min={new Date().toISOString().slice(0, 16)}
                required
                className="w-full"
              />
              <p className="text-xs text-slate-500 mt-1">
                Select a future date and time for the session
              </p>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration" className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span>Duration (minutes)</span>
              </Label>
              <div className="flex gap-2">
                {[30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: mins })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.duration === mins
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700 border-slate-300 hover:border-indigo-300"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })
                }
                min={15}
                max={180}
                className="w-full mt-2"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isLoading ? "Rescheduling..." : "Reschedule"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}   